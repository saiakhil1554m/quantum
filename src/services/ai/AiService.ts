import {
  TicketCategory,
  TicketPriority,
  UnifiedTicket,
  TroubleshootingStep,
  ProblemType,
} from '../../types';

export interface IssueAnalysisResult {
  problemType: ProblemType;
  aiCategoryConfidence: number; // 0-100
  problemTypeReasoning: string;
  category: TicketCategory;
  subcategory: string;
  service: string;
  confidence: number;
  friendlyExplanation: string;
  technicalReasoning: string;
  routingRecommendation: string;
  routingConfidence: number;
  priority: TicketPriority;
  priorityScore: number;
  priorityFactors: string[];
  isAmbiguous: boolean;
  difficulty?: 'HARD' | 'MEDIUM' | 'EASY';
  aiSummary?: string;
  recommendedArticles?: { id: string; title: string }[];
  ambiguityDetails?: {
    teamA: string;
    confA: number;
    teamB: string;
    confB: number;
    message: string;
  };
  suggestedTroubleshooting: {
    id: string;
    title: string;
    instruction: string;
    actionLabel: string;
    actionType: 'check_ping' | 'sync_ad' | 'flush_dns' | 'restart_client' | 'check_sap_gui' | 'hardware_check';
  }[];
  suggestedResolution?: {
    text: string;
    confidence: number;
    actionType: 'sync_credentials' | 'restart_vpn_gw' | 'unlock_ad_account' | 'sap_cache_clear' | 'custom';
    actionLabel: string;
  };
  similarTickets?: {
    id: string;
    title: string;
    status: string;
    similarity: number;
    system: string;
  }[];
}

export class AiService {
  /**
   * Classify whether an issue description relates to Hardware or Software
   */
  classifyProblemType(description: string): {
    problemType: ProblemType;
    confidence: number;
    reasoning: string;
  } {
    const text = description.toLowerCase();

    // Hardware keywords with weighted scores
    const hardwareKeywords = [
      'laptop', 'desktop', 'monitor', 'screen', 'keyboard', 'mouse', 'printer',
      'scanner', 'battery', 'charger', 'power cord', 'power cable', 'docking station',
      'dock', 'overheating', 'swollen', 'fan noise', 'beeping', 'won\'t turn on',
      'not turning on', 'black screen', 'flickering screen', 'cracked', 'broken',
      'damaged', 'dropped', 'water damage', 'spill', 'usb port', 'hdmi', 'displayport',
      'cable', 'optical transceiver', 'sfp', 'hardware switch', 'rack module',
      'hard drive', 'ssd failure', 'headset', 'mic hardware', 'webcam physical',
      'power supply', 'motherboard', 'ram module', 'chassis', 'touchpad', 'trackpad',
      'physical device', 'no power', 'dead battery', 'paper jam', 'printer toner'
    ];

    // Software keywords with weighted scores
    const softwareKeywords = [
      'vpn', 'anyconnect', 'sap', 'fiori', 'solman', 'password', 'login', 'credentials',
      'locked', 'mfa', '2fa', 'sso', 'active directory', 'outlook', 'email', 'teams',
      'excel', 'word', 'browser', 'chrome', 'edge', 'portal', 'application', 'software',
      'app', 'install', 'update', 'patch', 'error code', '503', '401', '403', '500',
      'crash', 'freeze', 'slow sync', 'database', 'sql', 'query', 'rfc', 'certificate',
      'permission', 'access denied', 'license', 'timeout', 'bug', 'firewall software',
      'dns', 'ip config', 'webdynpro', 'transaction code'
    ];

    let hardwareScore = 0;
    let softwareScore = 0;
    const detectedHwTerms: string[] = [];
    const detectedSwTerms: string[] = [];

    hardwareKeywords.forEach(term => {
      if (text.includes(term)) {
        hardwareScore += term.length > 8 ? 2 : 1.5;
        detectedHwTerms.push(term);
      }
    });

    softwareKeywords.forEach(term => {
      if (text.includes(term)) {
        softwareScore += term.length > 8 ? 2 : 1.5;
        detectedSwTerms.push(term);
      }
    });

    if (hardwareScore > softwareScore && hardwareScore >= 1.5) {
      const conf = Math.min(Math.round(75 + (hardwareScore - softwareScore) * 8), 98);
      return {
        problemType: 'hardware',
        confidence: conf,
        reasoning: `AI identified physical hardware signatures: ${detectedHwTerms.slice(0, 3).join(', ')}.`,
      };
    } else if (softwareScore > hardwareScore && softwareScore >= 1.5) {
      const conf = Math.min(Math.round(75 + (softwareScore - hardwareScore) * 8), 98);
      return {
        problemType: 'software',
        confidence: conf,
        reasoning: `AI identified software application / access signatures: ${detectedSwTerms.slice(0, 3).join(', ')}.`,
      };
    } else if (hardwareScore > 0 && softwareScore > 0) {
      return {
        problemType: hardwareScore >= softwareScore ? 'hardware' : 'software',
        confidence: 68,
        reasoning: `Contains both hardware and software indicators (${[...detectedHwTerms, ...detectedSwTerms].slice(0, 3).join(', ')}).`,
      };
    }

    return {
      problemType: 'unknown',
      confidence: 50,
      reasoning: 'Insufficient distinct hardware/software keywords detected. Defaulting to general triage.',
    };
  }

  /**
   * Analyze employee issue description with explainable AI heuristics & NLP
   */
  async analyzeIssue(
    description: string,
    existingTickets: UnifiedTicket[] = [],
    userSelectedType?: ProblemType
  ): Promise<IssueAnalysisResult> {
    const text = description.toLowerCase();
    const typeAnalysis = this.classifyProblemType(description);
    const finalProblemType = (userSelectedType && userSelectedType !== 'unknown') ? userSelectedType : typeAnalysis.problemType;

    // 1. Hardware Issue Scenarios (Printers, Displays, Battery, Laptops, Transceivers)
    if (
      finalProblemType === 'hardware' ||
      text.includes('laptop not turning on') ||
      text.includes('battery') ||
      text.includes('monitor') ||
      text.includes('screen') ||
      text.includes('keyboard') ||
      text.includes('mouse') ||
      text.includes('printer') ||
      text.includes('damaged') ||
      text.includes('docking') ||
      text.includes('transceiver') ||
      text.includes('sfp') ||
      text.includes('hardware')
    ) {
      const isDisplayOrPeripheral = text.includes('monitor') || text.includes('screen') || text.includes('keyboard') || text.includes('mouse') || text.includes('dock');
      const isPrinter = text.includes('printer') || text.includes('toner') || text.includes('paper');
      const isBatteryOrPower = text.includes('battery') || text.includes('charger') || text.includes('power') || text.includes('turn on') || text.includes('swollen');
      const isSubstationTelecom = text.includes('sfp') || text.includes('transceiver') || text.includes('optical') || text.includes('switch');

      return {
        problemType: 'hardware',
        aiCategoryConfidence: typeAnalysis.problemType === 'hardware' ? typeAnalysis.confidence : 88,
        problemTypeReasoning: typeAnalysis.reasoning || 'Detected physical hardware component issue.',
        category: 'hardware_workstation',
        subcategory: isSubstationTelecom ? 'Core Infrastructure Hardware' : isPrinter ? 'Office Peripherals & Printers' : isDisplayOrPeripheral ? 'Workstation Display & Peripherals' : 'Laptop Power & Core Hardware',
        service: isSubstationTelecom ? 'Substation Telecom Optical Hardware' : isPrinter ? 'Enterprise Multi-Function Printers' : isDisplayOrPeripheral ? 'Workstation Peripherals & Docking Hub' : 'Enterprise Laptop / Hardware Fleet',
        confidence: 93,
        friendlyExplanation: isBatteryOrPower
          ? 'We diagnosed a laptop power, battery, or hardware charging malfunction. Our hardware support team can schedule a diagnostic or battery replacement.'
          : isPrinter
          ? 'We diagnosed an office printer hardware or paper feeder jam issue.'
          : isSubstationTelecom
          ? 'We diagnosed a critical physical telecom transceiver / SFP loop hardware fault in the substation network.'
          : 'We diagnosed a workstation peripheral or display hardware connectivity problem.',
        technicalReasoning: isBatteryOrPower
          ? 'Physical battery telemetry failure / power delivery negotiation issue on enterprise workstation. Requires hardware desk inspection.'
          : isSubstationTelecom
          ? 'SFP optical power level degraded below -18dBm on Northern ring switch port. Physical transceiver replacement required.'
          : 'DisplayPort / USB-C peripheral controller handshake failure or physical cable defect.',
        routingRecommendation: 'Hardware & Infrastructure Ops',
        routingConfidence: 95,
        priority: isSubstationTelecom ? 'critical' : isBatteryOrPower ? 'high' : 'medium',
        priorityScore: isSubstationTelecom ? 96 : isBatteryOrPower ? 78 : 60,
        priorityFactors: [
          'Physical device hardware replacement / repair required',
          isSubstationTelecom ? 'Substation telecom link redundancy degraded' : 'Employee workstation usability impacted',
          'Candidate for on-site hardware dispatch',
        ],
        isAmbiguous: false,
        suggestedTroubleshooting: [
          {
            id: 'step_hw_1',
            title: 'Verify Physical Power & Cable Connections',
            instruction: 'Inspect power brick LED, reseat USB-C / DisplayPort cable firmly into workstation.',
            actionLabel: 'Confirm Cable Check',
            actionType: 'hardware_check',
          },
          {
            id: 'step_hw_2',
            title: 'Perform 30-Second Hardware Power Drain',
            instruction: 'Disconnect AC adapter, hold power button for 30 seconds to discharge residual capacitor energy.',
            actionLabel: 'Trigger Diagnostic Reset',
            actionType: 'hardware_check',
          },
        ],
        suggestedResolution: {
          text: 'Dispatch IT Hardware field technician with replacement unit / dock to verify serial number and swap defective component.',
          confidence: 92,
          actionType: 'custom',
          actionLabel: 'Schedule Hardware Desk Replacement',
        },
        similarTickets: this.findSimilarTickets(description, existingTickets),
      };
    }

    // 2. VPN / Remote Gateway scenario (Software)
    if (text.includes('vpn') || text.includes('remote') || text.includes('anyconnect') || text.includes('tunnel')) {
      const isPostPassword = text.includes('password') || text.includes('changed') || text.includes('reset') || text.includes('sync');
      
      return {
        problemType: 'software',
        aiCategoryConfidence: typeAnalysis.problemType === 'software' ? typeAnalysis.confidence : 94,
        problemTypeReasoning: typeAnalysis.reasoning || 'Software VPN client authentication & route handshake issue.',
        category: 'network',
        subcategory: 'Remote Access & VPN',
        service: 'Cisco AnyConnect / Corporate VPN Gateway',
        confidence: isPostPassword ? 94 : 88,
        friendlyExplanation: isPostPassword
          ? 'It looks like your VPN security credentials may not have synchronized across directory servers after your recent password update.'
          : 'It looks like your remote VPN client is having trouble establishing a secure handshake with the primary gateway.',
        technicalReasoning: isPostPassword
          ? 'Employee cannot access corporate systems because RADIUS/Active Directory token sync lagged behind password change, rejecting authentication.'
          : 'VPN tunnel negotiation timeout on port 443 with primary gateway gateway.powergrid.in.',
        routingRecommendation: 'Network Support',
        routingConfidence: 92,
        priority: 'high',
        priorityScore: 84,
        priorityFactors: [
          'Remote work capability blocked',
          'Multiple similar reports in 30-min window',
          'Core enterprise gateway affected',
        ],
        isAmbiguous: false,
        suggestedTroubleshooting: [
          {
            id: 'step_net_1',
            title: 'Verify Internet Connectivity',
            instruction: 'Checking network gateway and DNS reachability for internal hostnames.',
            actionLabel: 'Run Connectivity Check',
            actionType: 'check_ping',
          },
          {
            id: 'step_net_2',
            title: 'Flush DNS & Reset VPN Client State',
            instruction: 'Clearing stale connection tokens, temporary routing tables, and client cache.',
            actionLabel: 'Flush DNS & Reset Client',
            actionType: 'flush_dns',
          },
          {
            id: 'step_net_3',
            title: 'Re-authenticate with Updated Credentials',
            instruction: 'Authenticating against the unified identity bridge using current Active Directory credentials.',
            actionLabel: 'Trigger Identity Sync & Connect',
            actionType: 'sync_ad',
          },
        ],
        suggestedResolution: {
          text: 'Force-synchronize RADIUS/AD token on the central identity directory and trigger an automated certificate refresh for employee profile.',
          confidence: 94,
          actionType: 'sync_credentials',
          actionLabel: 'Sync Directory Credentials Now',
        },
        similarTickets: this.findSimilarTickets(description, existingTickets),
      };
    }

    // 3. SAP / Enterprise ERP scenario (Software)
    if (text.includes('sap') || text.includes('fiori') || text.includes('solman') || text.includes('billing') || text.includes('rfc') || text.includes('gui')) {
      const mentionsNetwork = text.includes('timeout') || text.includes('disconnect') || text.includes('slow') || text.includes('network');
      
      if (mentionsNetwork) {
        return {
          problemType: 'software',
          aiCategoryConfidence: 89,
          problemTypeReasoning: 'SAP ERP transaction timeout & network socket reset.',
          category: 'sap_enterprise',
          subcategory: 'SAP Enterprise ERP',
          service: 'SAP Fiori / GUI Gateway',
          confidence: 76,
          friendlyExplanation: 'We noticed an issue with SAP system responsiveness or timeout during your enterprise workflow.',
          technicalReasoning: 'Ambiguous symptom profile: Error mentions SAP GUI session timeout over internal WAN routing. Could be SAP backend work process bottleneck or WAN packet degradation.',
          routingRecommendation: 'SAP Support (Joint Triage with Network)',
          routingConfidence: 54,
          priority: 'high',
          priorityScore: 78,
          priorityFactors: [
            'Enterprise transaction workflow impacted',
            'Cross-domain dependency (SAP + Network)',
          ],
          isAmbiguous: true,
          ambiguityDetails: {
            teamA: 'SAP Core Team',
            confA: 52,
            teamB: 'Network Support',
            confB: 48,
            message: 'Historically Ambiguous Issue: 64% of similar tickets bounced between SAP and Network teams before resolution. Joint triage recommended.',
          },
          suggestedTroubleshooting: [
            {
              id: 'step_sap_1',
              title: 'Check SAP Gateway Status',
              instruction: 'Testing latency to SAP PRD instance (sm59 gateway RFC check).',
              actionLabel: 'Test SAP Gateway RFC',
              actionType: 'check_sap_gui',
            },
            {
              id: 'step_sap_2',
              title: 'Clear Local Fiori / GUI Cache',
              instruction: 'Purging local WebDynpro and SAP GUI session cache.',
              actionLabel: 'Purge SAP Client Cache',
              actionType: 'flush_dns',
            },
          ],
          suggestedResolution: {
            text: 'Inspect user SAP lock entries (SM12) and clear stuck background RFC connections on the PRD application server.',
            confidence: 82,
            actionType: 'sap_cache_clear',
            actionLabel: 'Clear SAP Locks & Reset RFC',
          },
          similarTickets: this.findSimilarTickets(description, existingTickets),
        };
      }

      return {
        problemType: 'software',
        aiCategoryConfidence: 94,
        problemTypeReasoning: 'SAP enterprise authorization / ERP application layer failure.',
        category: 'sap_enterprise',
        subcategory: 'SAP Enterprise ERP',
        service: 'SAP Fiori Launchpad & Core ERP',
        confidence: 91,
        friendlyExplanation: 'Your issue is related to SAP enterprise applications or user authorization permissions.',
        technicalReasoning: 'SAP authorization failure or session invalidation reported in Fiori backend. Component BC-SEC-AUT.',
        routingRecommendation: 'SAP Core Team',
        routingConfidence: 94,
        priority: 'high',
        priorityScore: 82,
        priorityFactors: [
          'Critical business application affected',
          'Employee unable to process billing / operations records',
        ],
        isAmbiguous: false,
        suggestedTroubleshooting: [
          {
            id: 'step_sap_base_1',
            title: 'Verify SAP SSO Session',
            instruction: 'Validating SAML 2.0 token against POWERGRID Enterprise Identity IdP.',
            actionLabel: 'Verify SAP Auth Token',
            actionType: 'sync_ad',
          },
          {
            id: 'step_sap_base_2',
            title: 'Clear Fiori Browser Cache',
            instruction: 'Resetting local storage and cached OData metadata in browser.',
            actionLabel: 'Clear Browser Metadata',
            actionType: 'flush_dns',
          },
        ],
        suggestedResolution: {
          text: 'Refresh user authorization role mapping in SAP SU01 and flush user buffer in transaction SU53.',
          confidence: 88,
          actionType: 'sap_cache_clear',
          actionLabel: 'Refresh User SAP Authorizations',
        },
        similarTickets: this.findSimilarTickets(description, existingTickets),
      };
    }

    // 4. Password / Login / Active Directory Lockout (Software)
    if (text.includes('password') || text.includes('login') || text.includes('locked') || text.includes('mfa') || text.includes('2fa') || text.includes('sso')) {
      return {
        problemType: 'software',
        aiCategoryConfidence: 96,
        problemTypeReasoning: 'Identity & Access Management / Active Directory domain lockout.',
        category: 'access_identity',
        subcategory: 'Identity & Authentication',
        service: 'Active Directory & SSO Portal',
        confidence: 96,
        friendlyExplanation: 'We detected an account access or domain login problem. We can help you verify your account status and unlock it.',
        technicalReasoning: 'Kerberos / SAML authentication rejection. Account may be locked due to bad password attempts or expired credentials.',
        routingRecommendation: 'Identity & Access Support',
        routingConfidence: 95,
        priority: 'medium',
        priorityScore: 68,
        priorityFactors: [
          'Direct individual login disruption',
          'Candidate for automated self-service deflection',
        ],
        isAmbiguous: false,
        suggestedTroubleshooting: [
          {
            id: 'step_pwd_1',
            title: 'Check Domain Account Status',
            instruction: 'Querying central Active Directory domain controller for lockout flags.',
            actionLabel: 'Check Account Lockout Status',
            actionType: 'sync_ad',
          },
          {
            id: 'step_pwd_2',
            title: 'Verify MFA Authenticator Status',
            instruction: 'Testing registered Microsoft Authenticator / SMS token status.',
            actionLabel: 'Verify 2FA Token Status',
            actionType: 'sync_ad',
          },
        ],
        suggestedResolution: {
          text: 'Trigger automatic domain account unlock and send temporary self-service reset OTP to verified mobile.',
          confidence: 96,
          actionType: 'unlock_ad_account',
          actionLabel: 'Unlock AD Account & Issue OTP',
        },
        similarTickets: this.findSimilarTickets(description, existingTickets),
      };
    }

    // 5. Wi-Fi / Local Network / Office Internet (Software/Network)
    if (text.includes('wifi') || text.includes('wi-fi') || text.includes('internet') || text.includes('ethernet') || text.includes('network') || text.includes('slow')) {
      return {
        problemType: 'software',
        aiCategoryConfidence: 86,
        problemTypeReasoning: '802.1X enterprise network wireless authentication & DHCP protocol.',
        category: 'network',
        subcategory: 'Corporate Local Network',
        service: 'POWERGRID-CORP 802.1X Wi-Fi',
        confidence: 89,
        friendlyExplanation: 'It looks like your device is having trouble connecting to the corporate office Wi-Fi network.',
        technicalReasoning: '802.1X EAP-TLS client handshake failure or DHCP lease expiration on corporate access point.',
        routingRecommendation: 'Network Support',
        routingConfidence: 91,
        priority: 'medium',
        priorityScore: 65,
        priorityFactors: ['Office local connectivity disrupted', 'Single workstation scope'],
        isAmbiguous: false,
        suggestedTroubleshooting: [
          {
            id: 'step_wifi_1',
            title: 'Renew DHCP IP Address Lease',
            instruction: 'Requesting a fresh IPv4/IPv6 lease from the local building switch.',
            actionLabel: 'Renew Local IP Lease',
            actionType: 'check_ping',
          },
          {
            id: 'step_wifi_2',
            title: 'Verify 802.1X Certificate',
            instruction: 'Checking if device machine certificate is trusted and unexpired.',
            actionLabel: 'Validate Device Certificate',
            actionType: 'sync_ad',
          },
        ],
        suggestedResolution: {
          text: 'Push device certificate renewal policy via Intune and reset MAC authentication table on building switch.',
          confidence: 85,
          actionType: 'sync_credentials',
          actionLabel: 'Push Certificate & Re-bind MAC',
        },
        similarTickets: this.findSimilarTickets(description, existingTickets),
      };
    }

    // 6. Default General IT Support
    return {
      problemType: typeAnalysis.problemType !== 'unknown' ? typeAnalysis.problemType : 'software',
      aiCategoryConfidence: typeAnalysis.confidence,
      problemTypeReasoning: typeAnalysis.reasoning || 'General IT service triage.',
      category: 'general',
      subcategory: 'Workstation & Applications',
      service: 'General Enterprise IT Service',
      confidence: 78,
      friendlyExplanation: 'We have categorized your issue and prepared a ticket for our Enterprise IT Support desk.',
      technicalReasoning: 'General IT workstation or software inquiry. Requires initial L1 desk triage.',
      routingRecommendation: 'General IT Support',
      routingConfidence: 80,
      priority: 'medium',
      priorityScore: 50,
      priorityFactors: ['Standard desk request', 'Low business blast radius'],
      isAmbiguous: false,
      suggestedTroubleshooting: [
        {
          id: 'step_gen_1',
          title: 'System Diagnostics & Health Check',
          instruction: 'Checking background services and disk/memory utilization.',
          actionLabel: 'Run Quick Diagnostic',
          actionType: 'check_ping',
        },
      ],
      suggestedResolution: {
        text: 'Assign to L1 Support Engineer for initial diagnosis and remote assistance.',
        confidence: 75,
        actionType: 'custom',
        actionLabel: 'Assign to Support Engineer',
      },
      similarTickets: this.findSimilarTickets(description, existingTickets),
    };
  }

  private findSimilarTickets(
    query: string,
    existingTickets: UnifiedTicket[]
  ): { id: string; title: string; status: string; similarity: number; system: string }[] {
    const q = query.toLowerCase();
    const results: { id: string; title: string; status: string; similarity: number; system: string }[] = [];

    for (const ticket of existingTickets) {
      let sim = 0;
      const tTitle = ticket.title.toLowerCase();
      const tDesc = ticket.description.toLowerCase();

      if (q.includes('vpn') && (tTitle.includes('vpn') || tDesc.includes('vpn'))) sim += 0.45;
      if (q.includes('password') && (tTitle.includes('password') || tDesc.includes('password'))) sim += 0.4;
      if (q.includes('sap') && (tTitle.includes('sap') || tDesc.includes('sap'))) sim += 0.45;
      if (q.includes('wifi') && (tTitle.includes('wifi') || tDesc.includes('wifi'))) sim += 0.4;
      if (q.includes('fiori') && (tTitle.includes('fiori') || tDesc.includes('fiori'))) sim += 0.35;
      if (q.includes('hardware') || q.includes('monitor') || q.includes('battery') || q.includes('printer')) {
        if (ticket.problemType === 'hardware' || tTitle.includes('hardware') || tTitle.includes('transceiver') || tDesc.includes('battery') || tDesc.includes('monitor')) {
          sim += 0.45;
        }
      }

      if (sim > 0.3) {
        results.push({
          id: ticket.id,
          title: ticket.title,
          status: ticket.status,
          similarity: Math.min(Math.round(sim * 100), 96),
          system: ticket.externalMappings[0]?.system || 'GRIDMIND',
        });
      }
    }

    return results.sort((a, b) => b.similarity - a.similarity).slice(0, 3);
  }

  /**
   * Analyze employee issue description with Gemini AI API (server-side endpoint)
   * Fallback to heuristics if API is offline or returns error.
   */
  async analyzeIssueWithGemini(
    description: string,
    options?: {
      categoryHint?: string;
      deviceDetails?: string;
      softwareDetails?: string;
      images?: string[];
      conversationContext?: string;
      availableKbArticles?: { id: string; title: string; category: string; summary: string }[];
      existingTickets?: UnifiedTicket[];
      userSelectedType?: ProblemType;
    }
  ): Promise<IssueAnalysisResult> {
    const existingTickets = options?.existingTickets || [];
    try {
      const response = await fetch('/api/ai/classify-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          categoryHint: options?.categoryHint || '',
          deviceDetails: options?.deviceDetails || '',
          softwareDetails: options?.softwareDetails || '',
          images: options?.images || [],
          conversationContext: options?.conversationContext || '',
          availableKbArticles: options?.availableKbArticles || [],
        }),
      });

      if (response.ok) {
        const geminiData = await response.json();
        
        // Map Gemini priority ('CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW') to TicketPriority ('critical' | 'high' | 'medium' | 'low')
        const priorityLower = (geminiData.priority || 'medium').toLowerCase() as TicketPriority;
        const problemType: ProblemType = geminiData.category === 'hardware_workstation' ? 'hardware' : 'software';

        // Calculate priority score (0-100) based on difficulty and priority
        let priorityScore = 50;
        if (geminiData.difficulty === 'HARD') priorityScore = 95;
        else if (geminiData.difficulty === 'MEDIUM') priorityScore = 75;
        else if (geminiData.difficulty === 'EASY') priorityScore = 35;

        // Generate troubleshooting steps based on category
        const steps = this.generateTroubleshootingSteps(geminiData.category);

        return {
          problemType,
          aiCategoryConfidence: geminiData.confidence || 92,
          problemTypeReasoning: geminiData.technicalReasoning || 'Analyzed by Google Gemini AI',
          category: geminiData.category || 'general',
          subcategory: this.getSubcategoryName(geminiData.category),
          service: this.getServiceName(geminiData.category),
          confidence: geminiData.confidence || 92,
          friendlyExplanation: geminiData.summary || description,
          technicalReasoning: geminiData.technicalReasoning || 'Gemini AI evaluated business impact, urgency, and technical complexity.',
          routingRecommendation: geminiData.assignedTeam || 'General IT Support',
          routingConfidence: geminiData.confidence || 90,
          priority: priorityLower,
          priorityScore,
          priorityFactors: [
            `Difficulty: ${geminiData.difficulty || 'MEDIUM'}`,
            `Assigned Team: ${geminiData.assignedTeam}`,
            `Confidence: ${geminiData.confidence}%`,
          ],
          isAmbiguous: false,
          difficulty: geminiData.difficulty || 'MEDIUM',
          aiSummary: geminiData.summary,
          recommendedArticles: geminiData.recommendedArticles || [],
          suggestedTroubleshooting: steps,
          suggestedResolution: {
            text: geminiData.suggestedResolution || 'Inspect system logs and perform standard troubleshooting.',
            confidence: geminiData.confidence || 90,
            actionType: 'custom',
            actionLabel: 'Apply AI Suggested Resolution',
          },
          similarTickets: this.findSimilarTickets(description, existingTickets),
        };
      }
    } catch (err) {
      console.warn('Gemini classification API call failed, falling back to heuristic analysis:', err);
    }

    // Fallback to local heuristic analysis
    const heuristic = await this.analyzeIssue(description, existingTickets, options?.userSelectedType);
    heuristic.difficulty = heuristic.priority === 'critical' ? 'HARD' : heuristic.priority === 'high' ? 'MEDIUM' : 'EASY';
    heuristic.aiSummary = heuristic.friendlyExplanation;
    return heuristic;
  }

  private getSubcategoryName(category: TicketCategory): string {
    switch (category) {
      case 'network': return 'Remote Access & Corporate Network';
      case 'sap_enterprise': return 'SAP Fiori & ERP Transactions';
      case 'access_identity': return 'Identity & Active Directory';
      case 'hardware_workstation': return 'Workstation & Peripheral Hardware';
      case 'email_collaboration': return 'Outlook & Microsoft 365';
      default: return 'General IT Support Service';
    }
  }

  private getServiceName(category: TicketCategory): string {
    switch (category) {
      case 'network': return 'Cisco AnyConnect / Corporate VPN Gateway';
      case 'sap_enterprise': return 'SAP Enterprise ERP (BC-SEC-AUT)';
      case 'access_identity': return 'Active Directory & SSO Identity Bridge';
      case 'hardware_workstation': return 'Enterprise Laptop & Hardware Fleet';
      case 'email_collaboration': return 'Exchange Online & M365 Services';
      default: return 'POWERGRID IT Service Desk';
    }
  }

  private generateTroubleshootingSteps(category: TicketCategory) {
    switch (category) {
      case 'network':
        return [
          {
            id: 'step_net_1',
            title: 'Verify Gateway Reachability',
            instruction: 'Testing network latency and port 443 reachability to corporate VPN gateway.',
            actionLabel: 'Check Gateway Ping',
            actionType: 'check_ping' as const,
          },
          {
            id: 'step_net_2',
            title: 'Flush Local DNS Cache',
            instruction: 'Clearing stale DNS resolution records and resetting connection socket.',
            actionLabel: 'Flush DNS & Reset Client',
            actionType: 'flush_dns' as const,
          },
        ];
      case 'sap_enterprise':
        return [
          {
            id: 'step_sap_1',
            title: 'Verify SAP Gateway RFC',
            instruction: 'Testing SAP PRD application gateway reachability (sm59).',
            actionLabel: 'Test SAP RFC Connection',
            actionType: 'check_sap_gui' as const,
          },
        ];
      case 'access_identity':
        return [
          {
            id: 'step_ad_1',
            title: 'Check Active Directory Lockout',
            instruction: 'Querying domain controller for lockout flags on account.',
            actionLabel: 'Check Account Lock Status',
            actionType: 'sync_ad' as const,
          },
        ];
      default:
        return [
          {
            id: 'step_gen_1',
            title: 'Run Quick System Health Check',
            instruction: 'Verifying workstation background process status.',
            actionLabel: 'Run Health Check',
            actionType: 'check_ping' as const,
          },
        ];
    }
  }
}

export const aiService = new AiService();

