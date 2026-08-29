import React, { useState } from 'react';
import {
  Shield,
  Server,
  Users,
  Activity,
  CheckCircle2,
  Database,
  Lock,
  RefreshCw,
  Cpu,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DEMO_CREDENTIALS } from '../../services/auth/DemoAuthProvider';

export const AdminDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'health' | 'integrations' | 'audit'>('users');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleTriggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      alert('Enterprise directory synchronization completed successfully.');
    }, 900);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Admin Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-xs ring-1 ring-slate-900/5 dark:ring-white/5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center font-bold text-base shadow-xs">
            <Shield className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-slate-900 dark:bg-slate-800 text-white">
                {currentUser?.employeeId || 'ADM001'}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300">
                Root System Administration
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              System Administration Console
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {currentUser?.designation || 'Chief Information Security Officer (CISO)'} •{' '}
              {currentUser?.department || 'Enterprise Security & Governance'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTriggerSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-semibold shadow-xs transition-colors disabled:opacity-60 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Directory'}</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'users'
              ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User & RBAC</span>
        </button>

        <button
          onClick={() => setActiveTab('health')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'health'
              ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>System & AI Health</span>
        </button>

        <button
          onClick={() => setActiveTab('integrations')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'integrations'
              ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Integrations</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'audit'
              ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Audit Logs</span>
        </button>
      </div>

      {/* Tab 1: User & RBAC Management */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xs ring-1 ring-slate-900/5 dark:ring-white/5 p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Provisioned Enterprise Users</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Verified identities, active RBAC role bindings, and corporate department assignments.
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-lg">
              {DEMO_CREDENTIALS.length} Accounts
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 border-y border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">User</th>
                  <th className="py-2.5 px-4 font-semibold">Employee ID</th>
                  <th className="py-2.5 px-4 font-semibold">Role</th>
                  <th className="py-2.5 px-4 font-semibold">Department</th>
                  <th className="py-2.5 px-4 font-semibold">Access Scope</th>
                  <th className="py-2.5 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {DEMO_CREDENTIALS.map(cred => (
                  <tr key={cred.employeeId} className="hover:bg-slate-50/70 dark:hover:bg-slate-850 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={cred.user.avatar}
                          alt={cred.user.name}
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">{cred.user.name}</p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500">{cred.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                      {cred.employeeId}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-semibold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded ${
                          cred.user.role === 'admin'
                            ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                            : cred.user.role === 'manager'
                            ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                            : cred.user.role === 'it_support'
                            ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {cred.user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {cred.user.department || cred.user.team}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      {cred.user.role === 'admin'
                        ? '/admin (All Systems)'
                        : cred.user.role === 'manager'
                        ? '/manager'
                        : cred.user.role === 'it_support'
                        ? '/it, /it/tickets'
                        : '/employee'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3" />
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: System & AI Health (Balanced 2-column grid on desktop) */}
      {activeTab === 'health' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[
            {
              name: 'AI Triage & Priority Classifier',
              status: 'Operational',
              uptime: '99.98%',
              latency: '142ms',
              description: 'Zero-shot prompt triaging, priority confidence scoring, explainable reasoning generation.',
              icon: Cpu,
              color: 'text-blue-600 dark:text-blue-400 bg-blue-500/10',
            },
            {
              name: 'Proactive Incident Clustering Engine',
              status: 'Operational',
              uptime: '100.00%',
              latency: '88ms',
              description: 'Real-time multi-ticket correlation over 15-minute rolling time windows.',
              icon: Activity,
              color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10',
            },
            {
              name: 'Active Directory Sync Gateway',
              status: 'Operational',
              uptime: '99.95%',
              latency: '45ms',
              description: 'Continuous credential validation, department lookups, and account status verifications.',
              icon: Server,
              color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
            },
            {
              name: 'SAP SolMan & GLPI Service Mesh',
              status: 'Operational',
              uptime: '99.91%',
              latency: '310ms',
              description: 'Bi-directional ticket sync, RFC adapters, and external incident ID cross-referencing.',
              icon: Database,
              color: 'text-purple-600 dark:text-purple-400 bg-purple-500/10',
            },
          ].map(item => (
            <div key={item.name} className="p-5 rounded-2xl bg-white dark:bg-slate-900 shadow-xs ring-1 ring-slate-900/5 dark:ring-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{item.name}</h3>
                    <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.description}</p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
                <span>Uptime: <strong className="text-slate-800 dark:text-slate-200">{item.uptime}</strong></span>
                <span>Latency: <strong className="text-slate-800 dark:text-slate-200">{item.latency}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Integrations */}
      {activeTab === 'integrations' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 shadow-xs ring-1 ring-slate-900/5 dark:ring-white/5 space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Configured External Systems</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Live API adapters, webhooks, and enterprise gateways.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[
              {
                system: 'SAP Solution Manager (SolMan 7.2)',
                protocol: 'RFC / SOAP',
                endpoint: 'https://sap-solman.powergrid.in/rfc',
                status: 'CONNECTED',
                lastSync: '1 min ago',
              },
              {
                system: 'GLPI IT Asset & Helpdesk',
                protocol: 'REST API v2',
                endpoint: 'https://glpi-prod.powergrid.in/api',
                status: 'CONNECTED',
                lastSync: '30s ago',
              },
              {
                system: 'Active Directory & Azure AD',
                protocol: 'LDAPS / Graph',
                endpoint: 'ldaps://ad-dc01.powergrid.in:636',
                status: 'CONNECTED',
                lastSync: '2 mins ago',
              },
              {
                system: 'Enterprise Telemetry & Syslog',
                protocol: 'TLS Syslog',
                endpoint: 'syslog.powergrid.in:6514',
                status: 'CONNECTED',
                lastSync: 'Real-time',
              },
            ].map(intg => (
              <div key={intg.system} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 flex flex-col justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 dark:text-white text-sm font-semibold">{intg.system}</strong>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded text-[10px]">
                      {intg.status}
                    </span>
                  </div>
                  <span className="inline-block font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {intg.protocol}
                  </span>
                  <p className="font-mono text-[11px] text-slate-500 dark:text-slate-400 truncate">{intg.endpoint}</p>
                </div>
                <div className="text-slate-400 dark:text-slate-500 text-[11px] pt-1 border-t border-slate-200/40 dark:border-slate-800 font-mono">
                  Synced {intg.lastSync}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 shadow-xs ring-1 ring-slate-900/5 dark:ring-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Security & Authentication Audit Trail</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Immutable record of login events, role switches, and token issuances.</p>
            </div>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">Live Stream</span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            {[
              {
                time: 'Just now',
                event: 'AUTH_SUCCESS_SESSION_GRANTED',
                actor: `${currentUser?.name} (${currentUser?.employeeId})`,
                ip: '10.240.12.89',
                status: '200 OK',
              },
              {
                time: '2 mins ago',
                event: 'RBAC_ROLE_VERIFICATION',
                actor: 'Ananya Sharma (IT001)',
                ip: '10.240.14.12',
                status: 'GRANTED',
              },
              {
                time: '14 mins ago',
                event: 'AD_DIRECTORY_DELTA_SYNC',
                actor: 'SYSTEM_CRON',
                ip: '127.0.0.1',
                status: 'SYNC_COMPLETE',
              },
              {
                time: '45 mins ago',
                event: 'AUTH_SUCCESS_SESSION_GRANTED',
                actor: 'Rahul Kumar (EMP001)',
                ip: '10.240.18.55',
                status: '200 OK',
              },
            ].map((log, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-900 dark:bg-slate-950 text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-slate-500">{log.time}</span>
                  <span className="text-blue-400 font-bold">{log.event}</span>
                  <span className="text-slate-300">{log.actor}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-slate-500">{log.ip}</span>
                  <span className="text-emerald-400 font-bold">{log.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
