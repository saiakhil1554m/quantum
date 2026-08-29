/**
 * ChatbotService — POWERGRID Level-1 AI Technical Support Agent
 * 
 * Three-Tier Classification System:
 * ─────────────────────────────────
 * EASY   → AI resolves autonomously with zero-wait (password resets, PRANIT access, SAP login, browser cache)
 * MEDIUM → Routed to technical team (VPN sync errors, localized software glitches, printer issues)
 * HARD   → Routed to specialized teams (SCADA alerts, cybersecurity threats, substation server failures)
 * 
 * System Persona: Level-1 AI Technical Support Agent for POWERGRID enterprise network.
 * Professional, highly analytical, and concise. Goal: minimize IT downtime.
 * 
 * Operational Directives:
 * 1. Triage & Diagnose: Classify as Hardware/Software/Networking → determine Easy/Medium/Hard
 * 2. Resolve "Easy" instantly with step-by-step self-service instructions
 * 3. Escalate "Medium/Hard" after collecting Employee ID + Asset Tag / Substation Location
 * 4. Never answer questions outside IT/OT support scope
 * 5. Prioritize grid security and enterprise protocols
 * 
 * Post-Resolution:
 * - Educational summary with root cause + steps taken sent to employee
 * - Resolution data fed back into AI knowledge base for continuous learning
 * - 2-hour SLA enforcement with automated email/portal alerts on breach
 */

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: {
    classification?: 'hardware' | 'software' | 'networking';
    difficulty?: 'easy' | 'medium' | 'hard';
    escalate?: boolean;
    collectingData?: boolean;
    dataField?: 'employee_id' | 'asset_tag';
    resolved?: boolean;
    resolutionSummary?: string;
    slaHours?: number;
    routingTeam?: string;
  };
}

export interface ChatbotState {
  messages: ChatMessage[];
  isTyping: boolean;
  classification: 'hardware' | 'software' | 'networking' | null;
  difficulty: 'easy' | 'medium' | 'hard' | null;
  collectedEmployeeId: string | null;
  collectedAssetTag: string | null;
  awaitingField: 'employee_id' | 'asset_tag' | null;
  escalationTriggered: boolean;
  resolvedAutonomously: boolean;
  issueTitle: string | null;
  routingTeam: string | null;
}

// ═══════════════════════════════════════════════════════════════
// EASY-TIER: AI-Resolved Issues (Zero-Wait Autonomous Resolution)
// ═══════════════════════════════════════════════════════════════
const EASY_RESOLUTIONS: Record<string, {
  keywords: string[];
  classification: 'hardware' | 'software' | 'networking';
  title: string;
  rootCause: string;
  steps: string[];
  educationalSummary: string;
}> = {
  sap_login_reset: {
    keywords: ['sap login', 'sap password', 'sap locked', 'sap access', 'sap reset', 'sap fiori login', 'sap gui login', 'sap not opening', 'sap authorization'],
    classification: 'software',
    title: 'SAP Login / Authorization Reset',
    rootCause: 'SAP user session expired or authorization buffer corrupted due to password policy rotation. The SAP SU01 user master record may have a lock flag set after multiple failed login attempts.',
    steps: [
      'Open SAP Fiori Launchpad at https://fiori.powergrid.in or launch SAP GUI 7.70+',
      'If your account is locked: Click "Forgot Password" on the SAP login page',
      'Enter your SAP User ID (usually same as your Employee ID, e.g., PG-78401)',
      'Select verification method: SMS OTP to registered mobile or email to @powergrid.in',
      'Enter the 6-digit OTP and set a new password (min 8 chars, 1 uppercase, 1 digit, 1 special)',
      'After login, if you see "No Authorization" error: Go to Menu → System → User Profile → Clear Authorization Buffer',
      'If Fiori tiles are missing: Clear browser cache (Ctrl+Shift+Del → All Time → Clear Data) and reload'
    ],
    educationalSummary: '🎓 **Why This Happened:** SAP enforces a 90-day password rotation policy per POWERGRID IT Security Policy (PGCIL-SEC-2024-004). After 3 failed login attempts, the system auto-locks your account to prevent unauthorized access. **How to Avoid:** Update your SAP password proactively before the expiry notification appears (you\'ll receive email reminders at 14, 7, and 3 days before expiry).'
  },
  pranit_access: {
    keywords: ['pranit', 'e-tendering', 'etendering', 'tender portal', 'pranit login', 'pranit access', 'pranit password', 'pranit not working', 'tendering system', 'bid submission'],
    classification: 'software',
    title: 'PRANIT e-Tendering Portal Access',
    rootCause: 'PRANIT portal session token expired or DSC (Digital Signature Certificate) not recognized by the browser plugin. The Java-based signing applet may have been blocked by browser security updates.',
    steps: [
      'Navigate to PRANIT portal: https://pranit.powergrid.in (use Internet Explorer Mode in Edge for DSC signing)',
      'If login fails: Click "Forgot Password" → Enter your registered email ID → Check inbox for reset link',
      'For DSC issues: Ensure your Digital Signature Certificate USB token is plugged in',
      'Open Edge browser → Settings → Default Browser → Enable "Allow sites to be reloaded in Internet Explorer mode"',
      'Add https://pranit.powergrid.in to the IE Mode sites list',
      'Install/update the Signer.Digital browser extension from the PRANIT portal footer',
      'Restart the browser, navigate to PRANIT, and test DSC signing with a dummy document',
      'If bid submission times out: Check your internet speed (minimum 2 Mbps required) and retry during off-peak hours (before 10 AM)'
    ],
    educationalSummary: '🎓 **Why This Happened:** PRANIT uses Java-based Digital Signature Certificate (DSC) signing which requires Internet Explorer compatibility mode. Modern browsers (Chrome/Edge) block Java applets by default for security. **How to Avoid:** Always use Edge with IE Mode enabled for PRANIT. Keep your DSC token driver updated. Submit bids at least 2 hours before deadline to avoid last-minute timeout issues.'
  },
  password_reset: {
    keywords: ['password', 'reset password', 'forgot password', 'change password', 'locked out', 'can\'t login', 'cannot login', 'login issue', 'login problem', 'account locked', 'domain password', 'ad password'],
    classification: 'software',
    title: 'Active Directory / Domain Password Reset',
    rootCause: 'Active Directory domain account locked due to Kerberos authentication failure after multiple incorrect password attempts, or password expired per the 90-day POWERGRID password rotation policy.',
    steps: [
      'Navigate to the POWERGRID Self-Service Password Portal at https://sspr.powergrid.in',
      'Click "Reset My Password" and enter your Employee ID (e.g., PG-78401)',
      'Select your verification method: SMS OTP to registered mobile or Email OTP',
      'Enter the 6-digit OTP received on your registered device',
      'Create a new password following the policy: min 12 chars, 1 uppercase, 1 number, 1 special character',
      'Click "Submit" — your Active Directory credentials will sync across all systems within 2 minutes',
      'After reset: Log out of all devices, wait 2 minutes, then log in with your new password',
      'If the portal is inaccessible, contact the IT Helpdesk at Extension 4444'
    ],
    educationalSummary: '🎓 **Why This Happened:** Your account was locked after exceeding the maximum allowed failed login attempts (5 attempts within 30 minutes), or your password expired per the 90-day rotation policy. **How to Avoid:** Use a password manager to track complex passwords. Set a calendar reminder 7 days before expiry. Never share your credentials — each login is audit-logged per CERT-In compliance requirements.'
  },
  browser_cache: {
    keywords: ['cache', 'clear cache', 'browser slow', 'page not loading', 'old page', 'stale page', 'browser issue', 'refresh', 'website not loading', 'portal stuck'],
    classification: 'software',
    title: 'Browser Cache / Portal Loading Issue',
    rootCause: 'Stale browser cache containing outdated CSS/JavaScript assets from a recent portal update, causing rendering issues or authentication token conflicts.',
    steps: [
      'Open your browser (Chrome/Edge) and press Ctrl + Shift + Delete',
      'Set the time range to "All time"',
      'Check: Browsing history, Cookies, Cached images and files',
      'Click "Clear data" and wait for the process to complete',
      'Close all browser tabs and restart the browser',
      'Navigate to the affected portal/application and try again',
      'If the issue persists on SAP Fiori, also clear localStorage: Press F12 → Application tab → Local Storage → Clear All',
      'For PRANIT portal: Ensure IE Mode is enabled in Edge after clearing cache'
    ],
    educationalSummary: '🎓 **Why This Happened:** Web portals (SAP Fiori, PRANIT, HR Portal) receive periodic updates. Your browser cached the old version, causing visual glitches or authentication failures. **How to Avoid:** Enable "Clear cache on exit" in browser settings. If a portal looks broken after an update, always try Ctrl+Shift+R (hard refresh) first before clearing all data.'
  },
  lan_cable: {
    keywords: ['lan', 'ethernet', 'cable', 'no connection', 'network cable', 'unplugged', 'wired connection', 'ethernet not working', 'lan port'],
    classification: 'networking',
    title: 'LAN / Ethernet Connectivity Check',
    rootCause: 'Physical Ethernet cable disconnection or wall port deactivation. DHCP lease may have expired, or the 802.1X port authentication failed due to machine certificate expiry.',
    steps: [
      'Check if the LAN cable is firmly plugged into your workstation\'s Ethernet port — you should hear a click',
      'Verify the other end is connected to the wall outlet or desk switch port',
      'Check the LED indicators on the Ethernet port: Green = Link Up, Amber/Off = No Link',
      'Try a different LAN cable if available (use CAT6 or higher for POWERGRID standard)',
      'Open Command Prompt (Win+R → cmd) and run: ipconfig /release then ipconfig /renew',
      'Run: ping 10.0.0.1 (default gateway) to verify connectivity',
      'Run: nslookup powergrid.in to verify DNS resolution',
      'If no link LED, the wall port may be deactivated — raise a ticket for Network team activation'
    ],
    educationalSummary: '🎓 **Why This Happened:** Physical network cables can degrade over time, especially in high-traffic office environments. Wall ports may be administratively disabled after workstation moves. **How to Avoid:** Avoid bending LAN cables at sharp angles. After any desk move, verify your wall port is active with IT support. Always use CAT6/CAT6A cables for reliable gigabit connectivity.'
  },
  wifi_connect: {
    keywords: ['wifi', 'wi-fi', 'wireless', 'can\'t connect wifi', 'wifi not working', 'no wifi', 'wifi password', 'wireless network'],
    classification: 'networking',
    title: 'Corporate Wi-Fi (POWERGRID-CORP) Connection',
    rootCause: '802.1X EAP-TLS enterprise wireless authentication failure. Machine certificate may have expired, or RADIUS server rejected the authentication request due to stale credentials.',
    steps: [
      'Click the Wi-Fi icon in your system tray (bottom-right of taskbar)',
      'Look for the POWERGRID-CORP network (802.1X Enterprise)',
      'If not visible, toggle Wi-Fi off and on, then scan again',
      'Connect using your Active Directory credentials (same as your desktop login)',
      'If prompted for certificate, accept the POWERGRID Root CA certificate',
      'Run diagnostics: Open CMD → netsh wlan show interfaces to verify connection status',
      'If the issue persists, forget the network: Settings → Network → Wi-Fi → Manage known networks → POWERGRID-CORP → Forget',
      'Re-add the network and authenticate again with your current domain credentials'
    ],
    educationalSummary: '🎓 **Why This Happened:** POWERGRID-CORP Wi-Fi uses 802.1X enterprise authentication tied to your Active Directory credentials. When you change your domain password, the Wi-Fi must also re-authenticate. **How to Avoid:** After every password change, reconnect to Wi-Fi with your new credentials. If your laptop was off during a password change, connect via LAN first to sync credentials.'
  },
  outlook_sync: {
    keywords: ['outlook', 'email not syncing', 'email stuck', 'outlook offline', 'send receive error', 'email problem', 'outlook error', 'email not working', 'mail not coming'],
    classification: 'software',
    title: 'Outlook / Email Synchronization Issue',
    rootCause: 'Outlook local cache (.ost file) corruption or Exchange ActiveSync profile desynchronization. The Autodiscover endpoint may be unreachable due to VPN disconnect or DNS misconfiguration.',
    steps: [
      'Check if Outlook shows "Disconnected" or "Working Offline" in the bottom status bar',
      'If offline: Go to Send/Receive tab → click "Work Offline" to toggle back online',
      'If sync errors: Go to File → Account Settings → Repair your email account',
      'Clear the Outlook cache: Close Outlook → navigate to %localappdata%\\Microsoft\\Outlook → rename the .ost file',
      'Restart Outlook and allow it to rebuild the local cache (this may take 10-15 minutes)',
      'Verify your mailbox is not full: File → Mailbox Settings → check storage quota (limit: 50 GB)',
      'If using VPN: Ensure Cisco AnyConnect is connected before opening Outlook',
      'If the issue persists after these steps, your Exchange mailbox may need a server-side repair'
    ],
    educationalSummary: '🎓 **Why This Happened:** Outlook stores a local copy of your mailbox (.ost file) for offline access. This cache can corrupt during unexpected shutdowns, VPN drops, or when the mailbox approaches its 50 GB quota. **How to Avoid:** Archive old emails regularly (File → Cleanup Tools → Archive). Always close Outlook before disconnecting VPN. Enable "Download headers first" for large attachments.'
  },
  mfa_issue: {
    keywords: ['mfa', '2fa', 'authenticator', 'otp not working', 'two factor', 'verification code', 'authentication app', 'otp expired', 'otp not received'],
    classification: 'software',
    title: 'Multi-Factor Authentication (MFA) Issue',
    rootCause: 'Time-based OTP (TOTP) desynchronization between the Authenticator app and the Azure AD MFA server, or SMS OTP delivery delay due to telecom gateway congestion.',
    steps: [
      'Ensure your phone\'s date and time are set to "Automatic" (time drift > 30 seconds causes OTP failures)',
      'Open Microsoft Authenticator app and check if the POWERGRID account is listed',
      'Try the "Refresh" option in the Authenticator app to resync the token',
      'If using SMS OTP: Verify your registered mobile number with HR at hr-helpdesk@powergrid.in',
      'Clear the Authenticator app cache: Phone Settings → Apps → Authenticator → Clear Cache',
      'If the account is missing from Authenticator, re-enroll at https://aka.ms/mfasetup using a backup verification method',
      'For persistent issues, the IT team can reset your MFA registration — call Extension 4444'
    ],
    educationalSummary: '🎓 **Why This Happened:** Time-based OTP codes change every 30 seconds and require your phone\'s clock to be precisely synchronized with the server. Even a 1-minute drift causes failures. SMS OTPs can be delayed by 30-60 seconds during peak hours. **How to Avoid:** Always keep your phone\'s time set to "Automatic (network-provided)". Use the Authenticator app instead of SMS for faster, more reliable MFA.'
  },
  software_install: {
    keywords: ['install software', 'software install', 'install application', 'need software', 'software request', 'install tool', 'application install', 'software download'],
    classification: 'software',
    title: 'Software Installation Request',
    rootCause: 'Standard user accounts do not have local administrator privileges per POWERGRID security policy. Software must be deployed via Microsoft Intune/SCCM managed deployment.',
    steps: [
      'Open the Company Portal app (pre-installed on all POWERGRID managed devices)',
      'Search for the required software in the Company Portal catalog',
      'If the software is listed: Click "Install" — it will be deployed within 15 minutes',
      'If NOT listed: Submit a Software Request via the IT Service Desk portal at https://itsm.powergrid.in',
      'Fill in: Software Name, Business Justification, and Manager Approval (auto-routed)',
      'Standard software (7-Zip, VLC, PDF reader) is auto-approved within 2 hours',
      'Specialized software (AutoCAD, MATLAB, licensed tools) requires CISO approval — allow 3-5 business days',
      'Never install software from external sources — all executables are blocked by POWERGRID endpoint protection'
    ],
    educationalSummary: '🎓 **Why This Happened:** POWERGRID enforces a Principle of Least Privilege (PoLP) security model. Users cannot install software directly to prevent malware and unauthorized tools. All software is vetted by the IT Security team before deployment. **How to Avoid:** Check the Company Portal first — most common tools are already available. For specialized software, submit requests well in advance of project deadlines.'
  },
};

// ═══════════════════════════════════════════════════════════════
// MEDIUM-TIER: Technical Team Routing (2-Hour SLA)
// ═══════════════════════════════════════════════════════════════
const MEDIUM_ESCALATION: {
  keywords: string[];
  classification: 'hardware' | 'software' | 'networking';
  title: string;
  routingTeam: string;
  description: string;
}[] = [
  {
    keywords: ['vpn failure', 'vpn not connecting', 'vpn sync', 'vpn error', 'vpn disconnect', 'anyconnect error', 'vpn synchronization', 'vpn timeout'],
    classification: 'networking',
    title: 'VPN Synchronization / Connection Error',
    routingTeam: 'Network Support',
    description: 'VPN tunnel negotiation failure or RADIUS/AD credential sync lag after password change. Requires Network team to verify gateway health and force credential synchronization.',
  },
  {
    keywords: ['sap error', 'sap crash', 'sap timeout', 'sap slow', 'fiori error', 'sap transaction', 'sap dump', 'sap gui crash', 'rfc error'],
    classification: 'software',
    title: 'SAP Application Error / Performance Issue',
    routingTeam: 'SAP Core Team',
    description: 'SAP application-layer error, transaction timeout, or GUI session crash. Requires SAP Basis team to check work process availability and lock table entries.',
  },
  {
    keywords: ['printer jam', 'printer offline', 'printer error', 'scanner not working', 'print queue', 'printer not printing', 'paper jam', 'toner'],
    classification: 'hardware',
    title: 'Printer / Scanner Hardware Issue',
    routingTeam: 'Hardware & Infrastructure Ops',
    description: 'Physical printer malfunction, paper feed mechanism jam, or toner replacement. Requires on-site hardware technician dispatch.',
  },
  {
    keywords: ['monitor flickering', 'display issue', 'second monitor', 'docking station', 'dock not working', 'usb not working', 'keyboard broken', 'mouse broken'],
    classification: 'hardware',
    title: 'Workstation Peripheral / Docking Issue',
    routingTeam: 'Hardware & Infrastructure Ops',
    description: 'Peripheral device connectivity failure, docking station handshake issue, or physical device malfunction. Requires hardware inspection and possible replacement.',
  },
  {
    keywords: ['teams not working', 'teams call', 'video call issue', 'teams audio', 'sharepoint error', 'onedrive sync', 'office 365 error', 'ms teams'],
    classification: 'software',
    title: 'Microsoft 365 / Teams Issue',
    routingTeam: 'Email & Collaboration Team',
    description: 'Microsoft 365 service disruption, Teams audio/video failure, or SharePoint/OneDrive sync conflict. Requires M365 admin team investigation.',
  },
  {
    keywords: ['slow computer', 'laptop slow', 'system hanging', 'blue screen', 'bsod', 'system freeze', 'laptop overheating', 'fan noise'],
    classification: 'hardware',
    title: 'Workstation Performance / Hardware Degradation',
    routingTeam: 'Hardware & Infrastructure Ops',
    description: 'System performance degradation due to hardware wear, thermal throttling, or disk failure. Requires diagnostic scan and possible component replacement.',
  },
  {
    keywords: ['network slow', 'internet slow', 'bandwidth', 'download slow', 'upload slow', 'latency', 'packet loss', 'ping high'],
    classification: 'networking',
    title: 'Network Performance / Bandwidth Issue',
    routingTeam: 'Network Support',
    description: 'Network throughput degradation or elevated latency on the corporate LAN/WAN segment. Requires network monitoring team to analyze traffic patterns.',
  },
];

// ═══════════════════════════════════════════════════════════════
// HARD-TIER: Critical Escalation (Specialized Teams, Priority SLA)
// ═══════════════════════════════════════════════════════════════
const HARD_ESCALATION: {
  keywords: string[];
  classification: 'hardware' | 'software' | 'networking';
  title: string;
  routingTeam: string;
  description: string;
  severity: string;
}[] = [
  {
    keywords: ['scada', 'scada alert', 'scada failure', 'scada system', 'scada down', 'scada alarm', 'ems', 'energy management'],
    classification: 'software',
    title: '⚠️ CRITICAL: SCADA / EMS System Alert',
    routingTeam: 'SCADA & Automation Control Room',
    description: 'SCADA/EMS system alert affecting real-time grid monitoring and control. This is a P1-CRITICAL incident affecting national grid operations safety.',
    severity: 'P1-CRITICAL',
  },
  {
    keywords: ['security breach', 'cyber attack', 'malware', 'ransomware', 'phishing', 'unauthorized access', 'data breach', 'cybersecurity', 'virus', 'suspicious email', 'hacked'],
    classification: 'software',
    title: '🔴 CRITICAL: Cybersecurity Threat / Security Incident',
    routingTeam: 'Cybersecurity SOC (Security Operations Center)',
    description: 'Potential cybersecurity incident affecting enterprise infrastructure. Immediate SOC team response required per CERT-In reporting guidelines.',
    severity: 'P1-CRITICAL',
  },
  {
    keywords: ['server down', 'server crash', 'server not responding', 'server outage', 'data center', 'server failure', 'server unreachable'],
    classification: 'software',
    title: '🔴 CRITICAL: Server / Data Center Outage',
    routingTeam: 'Data Center Operations',
    description: 'Enterprise server or data center infrastructure failure affecting multiple users/services. Requires immediate infrastructure team response.',
    severity: 'P1-CRITICAL',
  },
  {
    keywords: ['substation', 'substation server', 'substation network', 'substation down', 'rtu failure', 'remote terminal', 'telecom link down', 'plcc', 'opgw'],
    classification: 'networking',
    title: '⚠️ CRITICAL: Substation Infrastructure Failure',
    routingTeam: 'Substation Telecom & IT Infrastructure',
    description: 'Substation IT/telecom infrastructure failure affecting RTU communication, PLCC/OPGW links, or local server operations. Grid reliability impacted.',
    severity: 'P1-CRITICAL',
  },
  {
    keywords: ['network outage', 'entire floor down', 'building network down', 'wan link down', 'mpls down', 'core switch', 'router failure', 'complete outage'],
    classification: 'networking',
    title: '🔴 CRITICAL: Major Network Outage',
    routingTeam: 'Network Operations Center (NOC)',
    description: 'Major network infrastructure failure affecting multiple locations or WAN/MPLS links. NOC immediate response required.',
    severity: 'P1-CRITICAL',
  },
  {
    keywords: ['laptop dead', 'laptop not turning on', 'no power', 'motherboard failure', 'hard drive failure', 'ssd failure', 'hardware failure', 'device dead'],
    classification: 'hardware',
    title: 'Hardware Failure — Device Non-Functional',
    routingTeam: 'Hardware & Infrastructure Ops',
    description: 'Complete hardware failure requiring physical inspection, component replacement, or device swap. Employee productivity completely blocked.',
    severity: 'P2-HIGH',
  },
  {
    keywords: ['database down', 'oracle down', 'sql server down', 'database error', 'database corruption', 'data loss'],
    classification: 'software',
    title: '🔴 CRITICAL: Database System Failure',
    routingTeam: 'Database Administration Team',
    description: 'Enterprise database failure or corruption affecting business applications. Requires DBA team immediate intervention.',
    severity: 'P1-CRITICAL',
  },
];

const SYSTEM_GREETING = `Welcome to **POWERGRID Smart IT Helpdesk**. I'm your Level-1 AI Technical Support Agent.

I handle three tiers of support:
• **🟢 Easy** — Password resets, SAP login, PRANIT access, browser issues → *I resolve these instantly*
• **🟡 Medium** — VPN errors, printer issues, software glitches → *Routed to technical team (2-hour SLA)*
• **🔴 Hard** — SCADA alerts, cybersecurity, server outages → *Immediate specialized team dispatch*

Describe your issue, and I'll diagnose and classify it immediately.`;

export class ChatbotService {
  private state: ChatbotState;

  constructor() {
    this.state = this.getInitialState();
  }

  private getInitialState(): ChatbotState {
    return {
      messages: [
        {
          id: 'welcome',
          role: 'assistant',
          content: SYSTEM_GREETING,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ],
      isTyping: false,
      classification: null,
      difficulty: null,
      collectedEmployeeId: null,
      collectedAssetTag: null,
      awaitingField: null,
      escalationTriggered: false,
      resolvedAutonomously: false,
      issueTitle: null,
      routingTeam: null,
    };
  }

  getState(): ChatbotState {
    return { ...this.state };
  }

  getMessages(): ChatMessage[] {
    return [...this.state.messages];
  }

  reset(): void {
    this.state = this.getInitialState();
  }

  async processMessage(userMessage: string): Promise<ChatMessage> {
    const text = userMessage.toLowerCase().trim();
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Add user message
    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: userMessage,
      timestamp: now,
    };
    this.state.messages.push(userMsg);

    // ─── Scope enforcement ───
    if (this.isOutOfScope(text)) {
      return this.addBotMessage(
        '⚠️ I can only assist with **IT/OT technical support issues** for POWERGRID systems. I cannot help with general inquiries, code generation, or creative content.\n\nPlease describe your IT issue, or contact HR at hr-helpdesk@powergrid.in for non-IT queries.',
        now
      );
    }

    // ─── Data collection flow (for Medium/Hard escalation) ───
    if (this.state.awaitingField === 'employee_id') {
      this.state.collectedEmployeeId = userMessage.trim();
      this.state.awaitingField = 'asset_tag';
      return this.addBotMessage(
        `✅ Employee ID recorded: **${this.state.collectedEmployeeId}**\n\nPlease provide your **Device Asset Tag** or **Substation Location**:\n_(e.g., \`ASSET-LAP-4521\`, \`SUB-GGN-R04\`, or \`Corporate Centre, Delhi\`)_`,
        now,
        { collectingData: true, dataField: 'asset_tag' }
      );
    }

    if (this.state.awaitingField === 'asset_tag') {
      this.state.collectedAssetTag = userMessage.trim();
      this.state.awaitingField = null;
      this.state.escalationTriggered = true;

      const isHard = this.state.difficulty === 'hard';
      const tier = isHard ? '🔴 HARD' : '🟡 MEDIUM';
      const slaText = isHard ? '**Priority SLA: 1 hour** (critical infrastructure)' : '**Standard SLA: 2 hours**';

      return this.addBotMessage(
        `✅ Asset/Location recorded: **${this.state.collectedAssetTag}**\n\n` +
        `📋 **Ticket Ready for Submission**\n\n` +
        `| Field | Value |\n|---|---|\n` +
        `| **Tier** | ${tier} |\n` +
        `| **Category** | ${(this.state.classification || 'software').charAt(0).toUpperCase() + (this.state.classification || 'software').slice(1)} |\n` +
        `| **Issue** | ${this.state.issueTitle || 'Technical Issue'} |\n` +
        `| **Employee ID** | ${this.state.collectedEmployeeId} |\n` +
        `| **Asset/Location** | ${this.state.collectedAssetTag} |\n` +
        `| **Routing** | ${this.state.routingTeam || 'IT Support'} |\n` +
        `| **SLA** | ${slaText} |\n\n` +
        `Click **"Raise Support Ticket"** below to submit.\n\n` +
        `📬 You will receive:\n` +
        `• **Live updates** on the web portal as your ticket progresses\n` +
        `• **SLA breach alert** via email + portal if resolution exceeds the SLA window\n` +
        `• **Resolution summary** with root cause analysis and steps taken when the ticket is closed`,
        now,
        { escalate: true, classification: this.state.classification || undefined, slaHours: isHard ? 1 : 2, routingTeam: this.state.routingTeam || undefined }
      );
    }

    // ─── TIER 1: Check EASY resolutions (autonomous) ───
    for (const [key, resolution] of Object.entries(EASY_RESOLUTIONS)) {
      if (resolution.keywords.some(kw => text.includes(kw))) {
        this.state.classification = resolution.classification;
        this.state.difficulty = 'easy';
        this.state.resolvedAutonomously = true;
        this.state.issueTitle = resolution.title;

        const stepsText = resolution.steps.map((s, i) => `**${i + 1}.** ${s}`).join('\n');

        return this.addBotMessage(
          `🟢 **EASY TIER — Autonomous Resolution**\n` +
          `**Classification:** ${resolution.classification.toUpperCase()} | **Issue:** ${resolution.title}\n\n` +
          `───────────────────────\n` +
          `**🔍 Root Cause:**\n${resolution.rootCause}\n\n` +
          `**✅ Step-by-Step Solution:**\n${stepsText}\n\n` +
          `───────────────────────\n` +
          `${resolution.educationalSummary}\n\n` +
          `───────────────────────\n` +
          `✅ **This issue has been resolved autonomously.** No ticket is needed.\n` +
          `❌ If the problem persists after all steps, type **"escalate"** and I'll route to the technical team.`,
          now,
          { classification: resolution.classification, difficulty: 'easy', resolved: true, resolutionSummary: resolution.educationalSummary }
        );
      }
    }

    // ─── Check for "escalate" command after easy resolution ───
    if (text === 'escalate' || text === 'still not working' || text === 'not resolved' || text === 'issue persists') {
      if (this.state.resolvedAutonomously) {
        this.state.difficulty = 'medium';
        this.state.resolvedAutonomously = false;
        this.state.awaitingField = 'employee_id';

        return this.addBotMessage(
          `I understand the self-service steps didn't resolve your issue. I'll escalate this to the technical team.\n\n` +
          `🟡 **Escalating to MEDIUM TIER** — Your ticket will be assigned to **${this.state.routingTeam || 'IT Support'}** with a **2-hour SLA**.\n\n` +
          `Before I create the ticket, please provide your **Employee ID** (e.g., \`PG-78401\`):`,
          now,
          { collectingData: true, dataField: 'employee_id' }
        );
      }
    }

    // ─── TIER 3: Check HARD escalation (critical) ───
    for (const escalation of HARD_ESCALATION) {
      if (escalation.keywords.some(kw => text.includes(kw))) {
        this.state.classification = escalation.classification;
        this.state.difficulty = 'hard';
        this.state.awaitingField = 'employee_id';
        this.state.issueTitle = escalation.title;
        this.state.routingTeam = escalation.routingTeam;

        return this.addBotMessage(
          `🔴 **HARD TIER — Critical Escalation Required**\n` +
          `**Classification:** ${escalation.classification.toUpperCase()} | **Severity:** ${escalation.severity}\n\n` +
          `**Issue:** ${escalation.title}\n` +
          `**Routing to:** ${escalation.routingTeam}\n\n` +
          `⚠️ _${escalation.description}_\n\n` +
          `**This requires immediate specialized team intervention.** I am preparing a priority support ticket.\n\n` +
          `Please provide your **Employee ID** (e.g., \`PG-78401\`):`,
          now,
          { classification: escalation.classification, difficulty: 'hard', collectingData: true, dataField: 'employee_id' }
        );
      }
    }

    // ─── TIER 2: Check MEDIUM escalation ───
    for (const escalation of MEDIUM_ESCALATION) {
      if (escalation.keywords.some(kw => text.includes(kw))) {
        this.state.classification = escalation.classification;
        this.state.difficulty = 'medium';
        this.state.awaitingField = 'employee_id';
        this.state.issueTitle = escalation.title;
        this.state.routingTeam = escalation.routingTeam;

        return this.addBotMessage(
          `🟡 **MEDIUM TIER — Technical Team Required**\n` +
          `**Classification:** ${escalation.classification.toUpperCase()} | **Issue:** ${escalation.title}\n\n` +
          `**Routing to:** ${escalation.routingTeam}\n` +
          `**SLA:** 2-hour resolution window\n\n` +
          `_${escalation.description}_\n\n` +
          `Before I create the ticket, please provide your **Employee ID** (e.g., \`PG-78401\`):`,
          now,
          { classification: escalation.classification, difficulty: 'medium', collectingData: true, dataField: 'employee_id' }
        );
      }
    }

    // ─── Generic classification attempt ───
    const classification = this.classifyGeneric(text);
    this.state.classification = classification;

    return this.addBotMessage(
      `🔍 I've analyzed your issue and classified it as **${classification.toUpperCase()}**.\n\n` +
      `To determine the correct tier (Easy/Medium/Hard), could you provide more detail?\n\n` +
      `For example:\n` +
      `• What specific application or system is affected? (SAP, PRANIT, Outlook, VPN, SCADA)\n` +
      `• What error message are you seeing?\n` +
      `• Is this affecting just your workstation or multiple users?\n` +
      `• When did the issue start?`,
      now,
      { classification }
    );
  }

  /**
   * Process user chat message with Google Gemini AI API via backend service
   */
  async processMessageWithGemini(userMessage: string): Promise<ChatMessage> {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Build conversation context
    const messagesHistory = this.state.messages.map(m => ({
      role: m.role,
      content: m.content,
    }));
    messagesHistory.push({ role: 'user', content: userMessage });

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messagesHistory }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Add user message to state
        const userMsg: ChatMessage = {
          id: `user_${Date.now()}`,
          role: 'user',
          content: userMessage,
          timestamp: now,
        };
        this.state.messages.push(userMsg);

        // Add AI message to state
        return this.addBotMessage(data.text, data.timestamp || now);
      }
    } catch (err) {
      console.warn('Gemini chat API unavailable, falling back to rule engine:', err);
    }

    // Fallback to local rule engine
    return this.processMessage(userMessage);
  }

  private addBotMessage(content: string, timestamp: string, metadata?: ChatMessage['metadata']): ChatMessage {
    const msg: ChatMessage = {
      id: `bot_${Date.now()}`,
      role: 'assistant',
      content,
      timestamp,
      metadata,
    };
    this.state.messages.push(msg);
    return msg;
  }

  private classifyGeneric(text: string): 'hardware' | 'software' | 'networking' {
    const hwKeywords = ['laptop', 'desktop', 'monitor', 'screen', 'keyboard', 'mouse', 'printer', 'battery', 'charger', 'dock', 'usb', 'hardware', 'device', 'physical', 'scanner', 'headset'];
    const netKeywords = ['network', 'wifi', 'internet', 'ethernet', 'dns', 'ip', 'connectivity', 'ping', 'lan', 'switch', 'router', 'firewall', 'vpn', 'bandwidth', 'wan'];
    const swKeywords = ['software', 'app', 'application', 'sap', 'pranit', 'outlook', 'email', 'login', 'password', 'error', 'crash', 'install', 'update', 'scada', 'fiori', 'teams', 'portal'];

    let hwScore = hwKeywords.filter(k => text.includes(k)).length;
    let netScore = netKeywords.filter(k => text.includes(k)).length;
    let swScore = swKeywords.filter(k => text.includes(k)).length;

    if (hwScore >= netScore && hwScore >= swScore && hwScore > 0) return 'hardware';
    if (netScore >= hwScore && netScore >= swScore && netScore > 0) return 'networking';
    return 'software';
  }

  private isOutOfScope(text: string): boolean {
    const outOfScopePatterns = [
      'write me a', 'write a poem', 'tell me a joke', 'what is the meaning of life',
      'write code', 'generate code', 'create a script', 'help me with homework',
      'weather', 'recipe', 'news', 'sports score', 'movie recommendation',
      'translate', 'summarize this article', 'who is the president',
      'tell me a story', 'play a game', 'what time is it',
    ];
    return outOfScopePatterns.some(p => text.includes(p));
  }

  getEscalationData(): {
    employeeId: string;
    assetTag: string;
    classification: string;
    difficulty: string;
    issueTitle: string;
    routingTeam: string;
    slaHours: number;
  } | null {
    if (!this.state.escalationTriggered) return null;
    return {
      employeeId: this.state.collectedEmployeeId || '',
      assetTag: this.state.collectedAssetTag || '',
      classification: this.state.classification || 'software',
      difficulty: this.state.difficulty || 'medium',
      issueTitle: this.state.issueTitle || 'Technical Issue',
      routingTeam: this.state.routingTeam || 'IT Support',
      slaHours: this.state.difficulty === 'hard' ? 1 : 2,
    };
  }

  getResolutionData(): {
    issueTitle: string;
    classification: string;
    resolvedAutonomously: boolean;
  } | null {
    if (!this.state.resolvedAutonomously) return null;
    return {
      issueTitle: this.state.issueTitle || 'IT Issue',
      classification: this.state.classification || 'software',
      resolvedAutonomously: true,
    };
  }
}

export const chatbotService = new ChatbotService();
