export type UserRole = 'employee' | 'it_support' | 'manager' | 'admin' | 'it_staff';

export interface User {
  id: string;
  employeeId: string;
  name: string;
  role: UserRole;
  department?: string;
  team?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  designation?: string;
  location?: string;
}

export type UserProfile = User;

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: number;
}

export interface AuthProvider {
  login(employeeId: string, password: string): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}

export type TicketStatus =
  | 'new'
  | 'ai_analyzing'
  | 'in_progress'
  | 'waiting_employee'
  | 'escalated'
  | 'resolved'
  | 'closed';

export type TicketPriority = 'critical' | 'high' | 'medium' | 'low';

export type ProblemType = 'software' | 'hardware' | 'unknown';

export type TicketCategory =
  | 'network'
  | 'sap_enterprise'
  | 'access_identity'
  | 'hardware_workstation'
  | 'email_collaboration'
  | 'general';

export interface ExternalTicketMapping {
  system: 'GLPI' | 'SAP_SOLMAN' | 'EXCHANGE' | 'ACTIVE_DIR';
  externalId: string;
  syncStatus: 'synced' | 'pending' | 'failed';
  lastSyncedAt: string;
  linkUrl?: string;
  rawPayload?: Record<string, any>;
}

export interface TroubleshootingStep {
  id: string;
  stepName: string;
  instruction: string;
  status: 'passed' | 'failed' | 'skipped';
  timestamp: string;
  details?: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  actor: string;
  actorRole: 'employee' | 'it_staff' | 'ai_system';
  type: 'creation' | 'analysis' | 'troubleshooting' | 'assignment' | 'investigation' | 'resolution' | 'comment' | 'escalation' | 'master_link';
}

export interface InternalNote {
  id: string;
  authorName: string;
  authorAvatar: string;
  createdAt: string;
  text: string;
  isAiGenerated?: boolean;
}

export interface ReassignmentRecord {
  fromTeam: string;
  toTeam: string;
  timestamp: string;
  reason: string;
  reassignedBy: string;
}

export interface UnifiedTicket {
  id: string; // e.g. GRID-1024
  title: string;
  description: string;
  employee: UserProfile;
  assignedTeam: string;
  assignee?: UserProfile;
  problemType: ProblemType; // 'software' | 'hardware' | 'unknown'
  aiDetectedProblemType?: ProblemType;
  aiCategoryConfidence?: number; // 0-100
  problemCategorySource?: 'user_selected' | 'ai_detected' | 'it_overridden';
  deviceDetails?: string;
  softwareDetails?: string;
  category: TicketCategory;
  subcategory: string;
  service: string;
  status: TicketStatus;
  priority: TicketPriority;
  priorityScore: number; // 0-100
  priorityFactors: string[];
  aiConfidence: number; // 0-100
  aiReasoning: string;
  aiDifficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  aiSummary?: string;
  routingRecommendation: string;
  routingConfidence: number;
  previousTroubleshooting: TroubleshootingStep[];
  externalMappings: ExternalTicketMapping[];
  incidentClusterId?: string;
  masterIncidentId?: string;
  isDuplicate?: boolean;
  duplicateOf?: string;
  duplicateConfidence?: number;
  createdAt: string;
  updatedAt: string;
  slaTargetMinutes: number;
  slaStartedAt: string;
  slaRemainingMinutes: number;
  slaStatus: 'healthy' | 'at_risk' | 'breached';
  timeline: TimelineEvent[];
  reassignmentHistory: ReassignmentRecord[];
  isAmbiguous?: boolean;
  ambiguityDetails?: {
    teamA: string;
    confA: number;
    teamB: string;
    confB: number;
    message: string;
  };
  suggestedResolution?: {
    text: string;
    confidence: number;
    actionType: 'sync_credentials' | 'restart_vpn_gw' | 'unlock_ad_account' | 'sap_cache_clear' | 'custom';
    actionLabel: string;
    steps?: string[];
  };
  internalNotes: InternalNote[];
  resolutionNotes?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionTimeMinutes?: number;
  userRating?: number;
  attachments?: { id: string; name: string; url: string; size: string; type: string }[];
}

export interface IncidentCluster {
  id: string;
  title: string;
  affectedService: string;
  affectedUsersCount: number;
  confidence: number;
  firstReportTime: string;
  latestReportTime: string;
  status: 'active' | 'investigating' | 'mitigated' | 'master_created';
  ticketIds: string[];
  summary: string;
  severity: 'critical' | 'high' | 'medium';
  primaryLocation?: string;
  suggestedMasterTitle?: string;
  affectedLocations?: string[];
  suspectedRootCause?: string;
  timeSpanMinutes?: number;
}

export interface MasterIncident {
  id: string; // e.g. MASTER-001
  title: string;
  severity: 'P1_CRITICAL' | 'P2_HIGH' | 'P3_MODERATE';
  affectedService: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  rootCause: string;
  investigationNotes: string;
  linkedTicketIds: string[];
  createdAt: string;
  updatedAt: string;
  broadcastMessage: string;
  assignedLead: string;
  timeline: {
    id: string;
    time: string;
    event: string;
    author: string;
  }[];
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: TicketCategory | 'general';
  tags: string[];
  readTime: string;
  views: number;
  helpfulCount: number;
  summary: string;
  content: string;
  steps: string[];
  relatedServices: string[];
  lastUpdated: string;
}

export interface AppNotification {
  id: string;
  targetRole: 'employee' | 'it_staff' | 'all';
  userId?: string;
  title: string;
  message: string;
  type: 'alert' | 'info' | 'success' | 'warning' | 'incident';
  read: boolean;
  timestamp: string;
  actionLink?: string;
  ticketId?: string;
}

export interface SelfServicePreset {
  id: string;
  title: string;
  category: TicketCategory;
  service: string;
  iconName: string;
  description: string;
  samplePrompt: string;
  troubleshootingSteps: {
    id: string;
    title: string;
    description: string;
    actionLabel: string;
    successCondition: string;
  }[];
}
