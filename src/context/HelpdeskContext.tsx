import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  UserRole,
  UnifiedTicket,
  IncidentCluster,
  MasterIncident,
  KnowledgeArticle,
  AppNotification,
  TicketStatus,
  TicketPriority,
  TicketCategory,
  TroubleshootingStep,
  TimelineEvent,
  ProblemType,
} from '../types';
import {
  DEMO_USERS,
  INITIAL_TICKETS,
  INITIAL_CLUSTERS,
  INITIAL_MASTER_INCIDENTS,
  INITIAL_KNOWLEDGE_ARTICLES,
  INITIAL_NOTIFICATIONS,
} from '../data/seedData';
import { glpiAdapter, sapSolManAdapter } from '../services/integrations/TicketSystemAdapter';
import { incidentPulseService } from '../services/ai/IncidentService';

interface HelpdeskContextType {
  currentUser: UserProfile;
  currentRole: UserRole;
  users: UserProfile[];
  tickets: UnifiedTicket[];
  clusters: IncidentCluster[];
  masterIncidents: MasterIncident[];
  knowledgeArticles: KnowledgeArticle[];
  notifications: AppNotification[];
  unreadNotificationCount: number;
  currentView: string;
  selectedTicketId: string | null;
  selectedMasterIncidentId: string | null;
  selectedClusterId: string | null;
  switchUser: (userId: string) => void;
  switchRole: (role: UserRole) => void;
  navigateTo: (view: string, ticketId?: string, masterId?: string, clusterId?: string) => void;
  createTicket: (payload: {
    title: string;
    description: string;
    problemType?: ProblemType;
    aiDetectedProblemType?: ProblemType;
    aiCategoryConfidence?: number;
    problemCategorySource?: 'user_selected' | 'ai_detected' | 'it_overridden';
    deviceDetails?: string;
    softwareDetails?: string;
    category: TicketCategory;
    subcategory: string;
    service: string;
    priority: TicketPriority;
    priorityScore: number;
    priorityFactors: string[];
    aiConfidence: number;
    aiReasoning: string;
    routingRecommendation: string;
    previousTroubleshooting?: TroubleshootingStep[];
    suggestedResolution?: any;
    isAmbiguous?: boolean;
    ambiguityDetails?: any;
    attachments?: { id: string; name: string; url: string; size: string; type: string }[];
  }) => Promise<UnifiedTicket>;
  updateTicketProblemType: (ticketId: string, problemType: ProblemType, reason?: string) => void;
  updateTicketStatus: (ticketId: string, status: TicketStatus, notes?: string) => void;
  assignTicket: (ticketId: string, team: string, assigneeId?: string, reason?: string) => void;
  addInternalNote: (ticketId: string, text: string) => void;
  applyResolution: (ticketId: string, resolutionNotes: string) => void;
  rateResolution: (ticketId: string, rating: number) => void;
  createMasterIncidentFromCluster: (clusterId: string) => void;
  resolveMasterIncident: (masterId: string, resolutionNotes: string) => void;
  linkTicketToMaster: (ticketId: string, masterId: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  // Demo simulation triggers
  demoSimulateIncidentSpike: () => void;
  demoSimulateSlaRisk: () => void;
  demoSimulatePingPongReassignment: (ticketId: string) => void;
  resetAllData: () => void;
}

const HelpdeskContext = createContext<HelpdeskContextType | undefined>(undefined);

export const HelpdeskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users] = useState<UserProfile[]>(DEMO_USERS);
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEMO_USERS[0]); // Rahul Kumar
  const [currentRole, setCurrentRole] = useState<UserRole>('employee');
  const [tickets, setTickets] = useState<UnifiedTicket[]>(INITIAL_TICKETS);
  const [clusters, setClusters] = useState<IncidentCluster[]>(INITIAL_CLUSTERS);
  const [masterIncidents, setMasterIncidents] = useState<MasterIncident[]>(INITIAL_MASTER_INCIDENTS);
  const [knowledgeArticles] = useState<KnowledgeArticle[]>(INITIAL_KNOWLEDGE_ARTICLES);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  // Navigation state
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>('GRID-1024');
  const [selectedMasterIncidentId, setSelectedMasterIncidentId] = useState<string | null>('MASTER-001');
  const [selectedClusterId, setSelectedClusterId] = useState<string | null>('CLUSTER-NET-01');

  // Recalculate clusters whenever tickets change
  useEffect(() => {
    const updatedClusters = incidentPulseService.detectClusters(tickets);
    if (updatedClusters.length > 0) {
      setClusters(updatedClusters);
    }
  }, [tickets]);

  const switchUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      setCurrentRole(user.role);
      if (user.role === 'employee') {
        setCurrentView('home');
      } else {
        setCurrentView('it-dashboard');
      }
    }
  };

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'employee') {
      const defaultEmp = users.find(u => u.role === 'employee') || DEMO_USERS[0];
      setCurrentUser(defaultEmp);
      setCurrentView('home');
    } else {
      const defaultIt = users.find(u => u.role === 'it_staff') || DEMO_USERS[5];
      setCurrentUser(defaultIt);
      setCurrentView('it-dashboard');
    }
  };

  const navigateTo = (view: string, ticketId?: string, masterId?: string, clusterId?: string) => {
    if (ticketId) setSelectedTicketId(ticketId);
    if (masterId) setSelectedMasterIncidentId(masterId);
    if (clusterId) setSelectedClusterId(clusterId);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const createTicket = async (payload: {
    title: string;
    description: string;
    problemType?: ProblemType;
    aiDetectedProblemType?: ProblemType;
    aiCategoryConfidence?: number;
    problemCategorySource?: 'user_selected' | 'ai_detected' | 'it_overridden';
    deviceDetails?: string;
    softwareDetails?: string;
    category: TicketCategory;
    subcategory: string;
    service: string;
    priority: TicketPriority;
    priorityScore: number;
    priorityFactors: string[];
    aiConfidence: number;
    aiReasoning: string;
    routingRecommendation: string;
    previousTroubleshooting?: TroubleshootingStep[];
    suggestedResolution?: any;
    isAmbiguous?: boolean;
    ambiguityDetails?: any;
    attachments?: { id: string; name: string; url: string; size: string; type: string }[];
  }): Promise<UnifiedTicket> => {
    const newNumber = 1035 + tickets.length;
    const newId = `GRID-${newNumber}`;

    // Backend adapters async synchronization
    const glpiRes = await glpiAdapter.createTicket({
      gridTicketId: newId,
      title: payload.title,
      description: payload.description,
      employeeEmail: currentUser.email,
      employeeName: currentUser.name,
      category: payload.category,
      priority: payload.priority,
    });

    const solmanRes = await sapSolManAdapter.createTicket({
      gridTicketId: newId,
      title: payload.title,
      description: payload.description,
      employeeEmail: currentUser.email,
      employeeName: currentUser.name,
      category: payload.category,
      priority: payload.priority,
    });

    const nowIso = new Date().toISOString();
    const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const finalProblemType: ProblemType = payload.problemType || (payload.category === 'hardware_workstation' ? 'hardware' : 'software');

    const newTicket: UnifiedTicket = {
      id: newId,
      title: payload.title,
      description: payload.description,
      employee: currentUser,
      assignedTeam: (payload as any).assignedTeam || (payload.routingRecommendation.includes('Hardware')
        ? 'Hardware & Infrastructure Ops'
        : payload.routingRecommendation.includes('SAP')
        ? 'SAP Core Team'
        : 'Network Support'),
      problemType: finalProblemType,
      aiDetectedProblemType: payload.aiDetectedProblemType || finalProblemType,
      aiCategoryConfidence: payload.aiCategoryConfidence || payload.aiConfidence,
      aiDifficulty: (payload as any).aiDifficulty || 'MEDIUM',
      aiSummary: (payload as any).aiSummary || payload.description,
      problemCategorySource: payload.problemCategorySource || 'user_selected',
      deviceDetails: payload.deviceDetails,
      softwareDetails: payload.softwareDetails,
      category: payload.category,
      subcategory: payload.subcategory,
      service: payload.service,
      status: 'new',
      priority: payload.priority,
      priorityScore: payload.priorityScore,
      priorityFactors: payload.priorityFactors,
      aiConfidence: payload.aiConfidence,
      aiReasoning: payload.aiReasoning,
      routingRecommendation: payload.routingRecommendation,
      routingConfidence: payload.aiConfidence,
      previousTroubleshooting: payload.previousTroubleshooting || [],
      externalMappings: [
        {
          system: 'GLPI',
          externalId: glpiRes.externalId,
          syncStatus: 'synced',
          lastSyncedAt: nowIso,
          linkUrl: glpiRes.portalUrl,
        },
        {
          system: 'SAP_SOLMAN',
          externalId: solmanRes.externalId,
          syncStatus: 'synced',
          lastSyncedAt: nowIso,
          linkUrl: solmanRes.portalUrl,
        },
      ],
      createdAt: nowIso,
      updatedAt: nowIso,
      slaTargetMinutes: payload.priority === 'critical' ? 60 : payload.priority === 'high' ? 120 : 240,
      slaStartedAt: nowIso,
      slaRemainingMinutes: payload.priority === 'critical' ? 60 : payload.priority === 'high' ? 120 : 240,
      slaStatus: 'healthy',
      timeline: [
        {
          id: `tl_${Date.now()}_1`,
          timestamp: nowTimeStr,
          title: 'Issue Reported by Employee',
          description: `${currentUser.name} reported the issue (${finalProblemType === 'hardware' ? 'Hardware' : 'Software'} classification) via GRIDMIND.`,
          actor: currentUser.name,
          actorRole: 'employee',
          type: 'creation',
        },
        {
          id: `tl_${Date.now()}_2`,
          timestamp: nowTimeStr,
          title: 'AI Analysis & Triage Completed',
          description: `Classified as ${finalProblemType.toUpperCase()} / ${payload.category} (${payload.aiConfidence}% confidence). Routing recommendation: ${payload.routingRecommendation}.`,
          actor: 'GRIDMIND AI Sentinel',
          actorRole: 'ai_system',
          type: 'analysis',
        },
        ...(payload.previousTroubleshooting && payload.previousTroubleshooting.length > 0
          ? [
              {
                id: `tl_${Date.now()}_3`,
                timestamp: nowTimeStr,
                title: 'Guided Self-Service Diagnostics Logged',
                description: `${payload.previousTroubleshooting.length} interactive troubleshooting steps performed and recorded.`,
                actor: currentUser.name,
                actorRole: 'employee' as const,
                type: 'troubleshooting' as const,
              },
            ]
          : []),
        {
          id: `tl_${Date.now()}_4`,
          timestamp: nowTimeStr,
          title: `Orchestrated to ${payload.routingRecommendation}`,
          description: `Backend mappings established: ${glpiRes.externalId} and ${solmanRes.externalId}.`,
          actor: 'GRIDMIND Orchestrator',
          actorRole: 'ai_system',
          type: 'assignment',
        },
      ],
      reassignmentHistory: [],
      isAmbiguous: payload.isAmbiguous || false,
      ambiguityDetails: payload.ambiguityDetails,
      suggestedResolution: payload.suggestedResolution,
      attachments: payload.attachments || [],
      internalNotes: [
        {
          id: `in_${Date.now()}`,
          authorName: 'GRIDMIND AI Sentinel',
          authorAvatar: '',
          createdAt: nowTimeStr,
          text: `AI Context: [${finalProblemType.toUpperCase()}] ${payload.aiReasoning} (Confidence: ${payload.aiConfidence}%)`,
          isAiGenerated: true,
        },
      ],
    };

    setTickets(prev => [newTicket, ...prev]);

    // Add notification for IT Staff
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      targetRole: 'it_staff',
      title: `New ${finalProblemType === 'hardware' ? 'Hardware' : 'Software'} Ticket: ${newId}`,
      message: `${currentUser.name} reported: ${payload.title} (${payload.priority.toUpperCase()})`,
      type: payload.priority === 'critical' ? 'alert' : 'info',
      read: false,
      timestamp: 'Just now',
      ticketId: newId,
    };
    setNotifications(prev => [newNotif, ...prev]);

    return newTicket;
  };

  const updateTicketProblemType = (ticketId: string, problemType: ProblemType, reason?: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setTickets(prev =>
      prev.map(t => {
        if (t.id !== ticketId) return t;

        const newEvent: TimelineEvent = {
          id: `tl_${Date.now()}`,
          timestamp: timeStr,
          title: `Classification Changed to ${problemType.toUpperCase()} ISSUE`,
          description: reason ? `IT Correction: ${reason}` : `Classification updated to ${problemType} by ${currentUser.name}`,
          actor: currentUser.name,
          actorRole: currentUser.role,
          type: 'investigation',
        };

        const targetTeam = problemType === 'hardware'
          ? 'Hardware & Infrastructure Ops'
          : t.assignedTeam === 'Hardware & Infrastructure Ops'
          ? 'Network Support'
          : t.assignedTeam;

        return {
          ...t,
          problemType,
          problemCategorySource: 'it_overridden' as const,
          assignedTeam: targetTeam,
          updatedAt: new Date().toISOString(),
          timeline: [...t.timeline, newEvent],
        };
      })
    );
  };

  const updateTicketStatus = (ticketId: string, status: TicketStatus, notes?: string) => {
    setTickets(prev =>
      prev.map(t => {
        if (t.id !== ticketId) return t;

        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newEvent: TimelineEvent = {
          id: `tl_${Date.now()}`,
          timestamp: timeStr,
          title: `Status Updated to ${status.replace('_', ' ').toUpperCase()}`,
          description: notes || `Status modified by ${currentUser.name}`,
          actor: currentUser.name,
          actorRole: currentUser.role,
          type: status === 'resolved' ? 'resolution' : 'investigation',
        };

        return {
          ...t,
          status,
          updatedAt: new Date().toISOString(),
          timeline: [...t.timeline, newEvent],
          ...(status === 'resolved'
            ? {
                resolvedAt: new Date().toISOString(),
                resolvedBy: currentUser.name,
                resolutionNotes: notes || 'Resolved by IT Support Engineer',
              }
            : {}),
        };
      })
    );
  };

  const assignTicket = (ticketId: string, team: string, assigneeId?: string, reason?: string) => {
    const targetAssignee = users.find(u => u.id === assigneeId);

    setTickets(prev =>
      prev.map(t => {
        if (t.id !== ticketId) return t;

        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const fromTeam = t.assignedTeam;
        const isTeamChange = fromTeam !== team;

        const reassignmentList = isTeamChange
          ? [
              ...t.reassignmentHistory,
              {
                fromTeam,
                toTeam: team,
                timestamp: timeStr,
                reason: reason || 'Manual queue reassignment',
                reassignedBy: currentUser.name,
              },
            ]
          : t.reassignmentHistory;

        // Ping-Pong check: if reassigned more than 2 times, flag ambiguity
        const isPingPongAmbiguous = reassignmentList.length >= 2;

        const newEvent: TimelineEvent = {
          id: `tl_${Date.now()}`,
          timestamp: timeStr,
          title: `Assigned to ${team} ${targetAssignee ? `(${targetAssignee.name})` : ''}`,
          description: reason ? `Reason: ${reason}` : `Reassigned by ${currentUser.name}`,
          actor: currentUser.name,
          actorRole: currentUser.role,
          type: 'assignment',
        };

        return {
          ...t,
          assignedTeam: team,
          assignee: targetAssignee || t.assignee,
          updatedAt: new Date().toISOString(),
          reassignmentHistory: reassignmentList,
          isAmbiguous: isPingPongAmbiguous || t.isAmbiguous,
          ...(isPingPongAmbiguous && !t.ambiguityDetails
            ? {
                ambiguityDetails: {
                  teamA: fromTeam,
                  confA: 49,
                  teamB: team,
                  confB: 51,
                  message: `Ping-Pong Warning: Ticket reassigned ${reassignmentList.length} times. Joint triage recommended between ${fromTeam} and ${team}.`,
                },
              }
            : {}),
          timeline: [...t.timeline, newEvent],
        };
      })
    );
  };

  const addInternalNote = (ticketId: string, text: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setTickets(prev =>
      prev.map(t => {
        if (t.id !== ticketId) return t;
        return {
          ...t,
          internalNotes: [
            ...t.internalNotes,
            {
              id: `note_${Date.now()}`,
              authorName: currentUser.name,
              authorAvatar: currentUser.avatar,
              createdAt: timeStr,
              text,
              isAiGenerated: false,
            },
          ],
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const applyResolution = (ticketId: string, resolutionNotes: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setTickets(prev =>
      prev.map(t => {
        if (t.id !== ticketId) return t;

        const resolveEvent: TimelineEvent = {
          id: `tl_${Date.now()}`,
          timestamp: timeStr,
          title: 'Resolution Applied & Verified',
          description: resolutionNotes,
          actor: currentUser.name,
          actorRole: 'it_staff',
          type: 'resolution',
        };

        return {
          ...t,
          status: 'resolved',
          resolvedAt: new Date().toISOString(),
          resolvedBy: currentUser.name,
          resolutionNotes,
          updatedAt: new Date().toISOString(),
          timeline: [...t.timeline, resolveEvent],
        };
      })
    );

    // Notification for employee
    const targetTicket = tickets.find(t => t.id === ticketId);
    if (targetTicket) {
      setNotifications(prev => [
        {
          id: `notif_${Date.now()}`,
          targetRole: 'employee',
          userId: targetTicket.employee.id,
          title: `Ticket Resolved: ${ticketId}`,
          message: `Your issue "${targetTicket.title}" has been resolved by IT Support.`,
          type: 'success',
          read: false,
          timestamp: 'Just now',
          ticketId,
        },
        ...prev,
      ]);
    }
  };

  const rateResolution = (ticketId: string, rating: number) => {
    setTickets(prev =>
      prev.map(t => (t.id === ticketId ? { ...t, userRating: rating, status: 'closed' } : t))
    );
  };

  const createMasterIncidentFromCluster = (clusterId: string) => {
    const cluster = clusters.find(c => c.id === clusterId);
    if (!cluster) return;

    const newMaster = incidentPulseService.createMasterFromCluster(cluster, currentUser.name);

    setMasterIncidents(prev => [newMaster, ...prev]);

    // Link tickets to this master incident and update cluster status
    setTickets(prev =>
      prev.map(t => (cluster.ticketIds.includes(t.id) ? { ...t, masterIncidentId: newMaster.id } : t))
    );

    setClusters(prev =>
      prev.map(c => (c.id === clusterId ? { ...c, status: 'master_created' } : c))
    );

    setSelectedMasterIncidentId(newMaster.id);
    navigateTo('master-incidents', undefined, newMaster.id);

    // Add broadcast notification
    setNotifications(prev => [
      {
        id: `notif_master_${Date.now()}`,
        targetRole: 'all',
        title: `Master Incident Declared: ${newMaster.id}`,
        message: `${newMaster.title} declared with ${cluster.ticketIds.length} linked tickets.`,
        type: 'incident',
        read: false,
        timestamp: 'Just now',
      },
      ...prev,
    ]);
  };

  const resolveMasterIncident = (masterId: string, resolutionNotes: string) => {
    const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMasterIncidents(prev =>
      prev.map(m => {
        if (m.id !== masterId) return m;
        return {
          ...m,
          status: 'resolved',
          updatedAt: new Date().toISOString(),
          timeline: [
            ...m.timeline,
            {
              id: `mevt_${Date.now()}`,
              time: nowTimeStr,
              event: `Master Incident resolved by ${currentUser.name}. Fix propagated to all ${m.linkedTicketIds.length} tickets.`,
              author: currentUser.name,
            },
          ],
        };
      })
    );

    const targetMaster = masterIncidents.find(m => m.id === masterId);
    if (targetMaster) {
      // Propagate resolution to all linked tickets
      setTickets(prev =>
        prev.map(t => {
          if (targetMaster.linkedTicketIds.includes(t.id)) {
            return {
              ...t,
              status: 'resolved',
              resolvedAt: new Date().toISOString(),
              resolvedBy: `${currentUser.name} (via ${masterId})`,
              resolutionNotes: `Auto-resolved via Master Incident ${masterId}: ${resolutionNotes}`,
              timeline: [
                ...t.timeline,
                {
                  id: `tl_mres_${Date.now()}`,
                  timestamp: nowTimeStr,
                  title: `Resolved via Master Incident ${masterId}`,
                  description: resolutionNotes,
                  actor: currentUser.name,
                  actorRole: 'it_staff',
                  type: 'resolution',
                },
              ],
            };
          }
          return t;
        })
      );
    }
  };

  const linkTicketToMaster = (ticketId: string, masterId: string) => {
    setTickets(prev =>
      prev.map(t => (t.id === ticketId ? { ...t, masterIncidentId: masterId } : t))
    );
    setMasterIncidents(prev =>
      prev.map(m =>
        m.id === masterId && !m.linkedTicketIds.includes(ticketId)
          ? { ...m, linkedTicketIds: [...m.linkedTicketIds, ticketId] }
          : m
      )
    );
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Demo helpers
  const demoSimulateIncidentSpike = () => {
    const simulatedEmployees = [DEMO_USERS[1], DEMO_USERS[2], DEMO_USERS[3], DEMO_USERS[4]];
    const newSimTickets: UnifiedTicket[] = simulatedEmployees.map((emp, idx) => {
      const id = `GRID-104${idx}`;
      return {
        id,
        title: `VPN Tunnel Handshake Drop (${emp.department})`,
        description: `Sudden disconnect from corporate gateway. Unable to access internal substation monitoring.`,
        employee: emp,
        assignedTeam: 'Network Support',
        problemType: 'software' as const,
        aiDetectedProblemType: 'software' as const,
        aiCategoryConfidence: 94,
        problemCategorySource: 'ai_detected' as const,
        category: 'network',
        subcategory: 'Remote Access & VPN',
        service: 'Cisco AnyConnect / Corporate VPN Gateway',
        status: 'new',
        priority: 'high',
        priorityScore: 88,
        priorityFactors: ['Rapid cluster surge', 'Remote substation telecom impacted'],
        aiConfidence: 94,
        aiReasoning: 'Correlated with active RADIUS authentication deadlock event on DC-02.',
        routingRecommendation: 'Network Support',
        routingConfidence: 93,
        previousTroubleshooting: [],
        externalMappings: [
          { system: 'GLPI', externalId: `GLPI-60${idx}`, syncStatus: 'synced', lastSyncedAt: new Date().toISOString() },
        ],
        incidentClusterId: 'CLUSTER-NET-01',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        slaTargetMinutes: 120,
        slaStartedAt: new Date().toISOString(),
        slaRemainingMinutes: 120,
        slaStatus: 'healthy',
        timeline: [
          {
            id: `tl_sim_${idx}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            title: 'Simulated Ticket Inflow Surge',
            description: `Auto-ingested and clustered by Incident Pulse AI`,
            actor: emp.name,
            actorRole: 'employee',
            type: 'creation',
          },
        ],
        reassignmentHistory: [],
        internalNotes: [],
      };
    });

    setTickets(prev => [...newSimTickets, ...prev]);

    setNotifications(prev => [
      {
        id: `notif_spike_${Date.now()}`,
        targetRole: 'it_staff',
        title: '🚨 Incident Pulse: Surge Detected!',
        message: '4 new VPN failure reports arrived in 60 seconds! Incident cluster confidence elevated to 96%.',
        type: 'alert',
        read: false,
        timestamp: 'Just now',
      },
      ...prev,
    ]);
  };

  const demoSimulateSlaRisk = () => {
    setTickets(prev =>
      prev.map(t => {
        if (t.id === 'GRID-1024' || t.id === 'GRID-1018') {
          return {
            ...t,
            slaRemainingMinutes: 8,
            slaStatus: 'at_risk',
          };
        }
        return t;
      })
    );
    setNotifications(prev => [
      {
        id: `notif_sla_${Date.now()}`,
        targetRole: 'it_staff',
        title: '🔴 Critical SLA Risk Alert',
        message: 'Tickets GRID-1024 and GRID-1018 have entered critical SLA breach risk zone (< 10 min remaining)!',
        type: 'warning',
        read: false,
        timestamp: 'Just now',
      },
      ...prev,
    ]);
  };

  const demoSimulatePingPongReassignment = (ticketId: string) => {
    const target = tickets.find(t => t.id === ticketId);
    if (!target) return;
    const nextTeam = target.assignedTeam === 'Network Support' ? 'SAP Core Team' : 'Network Support';
    assignTicket(ticketId, nextTeam, undefined, 'Simulated dispute over network vs application tier fault');
  };

  const resetAllData = () => {
    setTickets(INITIAL_TICKETS);
    setClusters(INITIAL_CLUSTERS);
    setMasterIncidents(INITIAL_MASTER_INCIDENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCurrentUser(DEMO_USERS[0]);
    setCurrentRole('employee');
    setCurrentView('home');
  };

  const unreadNotificationCount = notifications.filter(
    n => !n.read && (n.targetRole === 'all' || n.targetRole === currentRole)
  ).length;

  return (
    <HelpdeskContext.Provider
      value={{
        currentUser,
        currentRole,
        users,
        tickets,
        clusters,
        masterIncidents,
        knowledgeArticles,
        notifications,
        unreadNotificationCount,
        currentView,
        selectedTicketId,
        selectedMasterIncidentId,
        selectedClusterId,
        switchUser,
        switchRole,
        navigateTo,
        createTicket,
        updateTicketProblemType,
        updateTicketStatus,
        assignTicket,
        addInternalNote,
        applyResolution,
        rateResolution,
        createMasterIncidentFromCluster,
        resolveMasterIncident,
        linkTicketToMaster,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        demoSimulateIncidentSpike,
        demoSimulateSlaRisk,
        demoSimulatePingPongReassignment,
        resetAllData,
      }}
    >
      {children}
    </HelpdeskContext.Provider>
  );
};

export const useHelpdesk = () => {
  const context = useContext(HelpdeskContext);
  if (!context) {
    throw new Error('useHelpdesk must be used within a HelpdeskProvider');
  }
  return context;
};
