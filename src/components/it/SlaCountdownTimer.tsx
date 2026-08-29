import React, { useState, useEffect, useRef } from 'react';
import { Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

/**
 * SlaCountdownTimer — Real-time SLA countdown for IT staff.
 * 
 * Displays a live hours:minutes:seconds countdown with color-coded urgency:
 * - Green: > 60 min remaining (healthy)
 * - Amber: 30-60 min remaining (at risk)
 * - Red: < 30 min remaining (critical)
 * - Flashing Red: SLA breached (0 min)
 * 
 * Default SLA: 2 hours (120 minutes)
 */
interface SlaCountdownTimerProps {
  /** SLA remaining in minutes (from ticket data) */
  slaRemainingMinutes: number;
  /** SLA status from ticket model */
  slaStatus: 'healthy' | 'at_risk' | 'breached';
  /** Total SLA target in minutes */
  slaTargetMinutes?: number;
  /** Compact mode for ticket queue rows */
  compact?: boolean;
  /** When the SLA timer started */
  slaStartedAt?: string;
}

export const SlaCountdownTimer: React.FC<SlaCountdownTimerProps> = ({
  slaRemainingMinutes,
  slaStatus,
  slaTargetMinutes = 120,
  compact = false,
  slaStartedAt,
}) => {
  const [remainingSeconds, setRemainingSeconds] = useState(slaRemainingMinutes * 60);

  // Calculate elapsed time since SLA started to adjust the timer
  useEffect(() => {
    if (slaStartedAt) {
      const startTime = new Date(slaStartedAt).getTime();
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - startTime) / 1000);
      const targetSeconds = slaTargetMinutes * 60;
      const remaining = Math.max(0, targetSeconds - elapsedSeconds);
      setRemainingSeconds(remaining);
    } else {
      setRemainingSeconds(slaRemainingMinutes * 60);
    }
  }, [slaRemainingMinutes, slaStartedAt, slaTargetMinutes]);

  // Live countdown
  useEffect(() => {
    if (remainingSeconds <= 0) return;

    const interval = setInterval(() => {
      setRemainingSeconds(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingSeconds]);

  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');
  const timeDisplay = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

  // Determine visual urgency
  const remainingMin = remainingSeconds / 60;
  let urgency: 'healthy' | 'at_risk' | 'critical' | 'breached';
  if (remainingSeconds <= 0) {
    urgency = 'breached';
  } else if (remainingMin < 30) {
    urgency = 'critical';
  } else if (remainingMin < 60) {
    urgency = 'at_risk';
  } else {
    urgency = 'healthy';
  }

  // Override with actual slaStatus if worse
  if (slaStatus === 'breached') urgency = 'breached';
  if (slaStatus === 'at_risk' && urgency === 'healthy') urgency = 'at_risk';

  const progressPercent = slaTargetMinutes > 0
    ? Math.max(0, Math.min(100, (remainingSeconds / (slaTargetMinutes * 60)) * 100))
    : 0;

  const colorMap = {
    healthy: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      border: 'border-emerald-200 dark:border-emerald-800',
      text: 'text-emerald-700 dark:text-emerald-400',
      bar: 'bg-emerald-500',
      icon: <CheckCircle2 className={compact ? 'w-3 h-3' : 'w-4 h-4'} />,
      label: 'SLA Healthy',
    },
    at_risk: {
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      border: 'border-amber-200 dark:border-amber-800',
      text: 'text-amber-700 dark:text-amber-400',
      bar: 'bg-amber-500',
      icon: <Clock className={compact ? 'w-3 h-3' : 'w-4 h-4'} />,
      label: 'SLA At Risk',
    },
    critical: {
      bg: 'bg-rose-50 dark:bg-rose-950/30',
      border: 'border-rose-200 dark:border-rose-800',
      text: 'text-rose-700 dark:text-rose-400',
      bar: 'bg-rose-500',
      icon: <AlertTriangle className={compact ? 'w-3 h-3' : 'w-4 h-4'} />,
      label: 'SLA Critical',
    },
    breached: {
      bg: 'bg-rose-100 dark:bg-rose-950/50',
      border: 'border-rose-300 dark:border-rose-700',
      text: 'text-rose-800 dark:text-rose-300 sla-flash',
      bar: 'bg-rose-600',
      icon: <AlertTriangle className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} sla-flash`} />,
      label: 'SLA BREACHED',
    },
  };

  const style = colorMap[urgency];

  // Compact mode — for ticket queue rows
  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-mono font-bold ${style.bg} ${style.border} ${style.text} border`}>
        {style.icon}
        <span>{timeDisplay}</span>
      </div>
    );
  }

  // Full mode — for ticket detail view
  return (
    <div className={`${style.bg} ${style.border} border rounded-xl p-4 space-y-2.5`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={style.text}>
            {style.icon}
          </div>
          <span className={`text-xs font-bold uppercase tracking-wider ${style.text}`}>
            {style.label}
          </span>
        </div>
        <span className={`text-lg font-mono font-black tracking-tight ${style.text}`}>
          {timeDisplay}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-slate-200/60 dark:bg-slate-700/40 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-linear ${style.bar}`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono">
        <span>Target: {Math.floor(slaTargetMinutes / 60)}h {slaTargetMinutes % 60}m</span>
        <span>Remaining: {Math.floor(remainingMin)}m {seconds}s</span>
      </div>
    </div>
  );
};
