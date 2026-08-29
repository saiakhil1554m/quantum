import { IncidentCluster, MasterIncident, UnifiedTicket } from '../../types';

export class IncidentPulseService {
  /**
   * Evaluates all tickets to detect live incident spikes and clusters
   */
  detectClusters(tickets: UnifiedTicket[]): IncidentCluster[] {
    const vpnTickets = tickets.filter(
      t =>
        (t.category === 'network' && (t.service.toLowerCase().includes('vpn') || t.title.toLowerCase().includes('vpn') || t.description.toLowerCase().includes('vpn'))) &&
        t.status !== 'closed' &&
        t.status !== 'resolved'
    );

    const sapTickets = tickets.filter(
      t =>
        (t.category === 'sap_enterprise' || t.title.toLowerCase().includes('sap') || t.description.toLowerCase().includes('fiori')) &&
        t.status !== 'closed' &&
        t.status !== 'resolved'
    );

    const clusters: IncidentCluster[] = [];

    // Cluster 1: VPN / Remote Access Gateway Cluster (Hero Feature)
    if (vpnTickets.length >= 2) {
      const vpnLocations = Array.from(
        new Set(vpnTickets.map(t => t.employee?.location).filter(Boolean) as string[])
      );
      clusters.push({
        id: 'CLUSTER-NET-01',
        title: 'High Velocity: Corporate VPN & Remote Access Degradation',
        affectedService: 'Remote Access / Cisco AnyConnect Gateway',
        affectedUsersCount: vpnTickets.length + 8, // simulated total affected
        confidence: 91,
        firstReportTime: vpnTickets[vpnTickets.length - 1]?.createdAt || new Date(Date.now() - 25 * 60000).toISOString(),
        latestReportTime: vpnTickets[0]?.createdAt || new Date().toISOString(),
        status: 'active',
        ticketIds: vpnTickets.map(t => t.id),
        summary: `${vpnTickets.length} direct tickets and 8+ monitoring anomalies detected in the last 20 minutes. Common symptom: Authentication failure post-password reset and gateway timeout on 10.45.0.1.`,
        severity: 'critical',
        primaryLocation: 'Northern Regional Load Despatch Centre (NRLDC) & Substation Ops',
        suggestedMasterTitle: 'Major Incident: North Substation VPN & SSO Sync Gateway Outage',
        affectedLocations: vpnLocations.length > 0 ? vpnLocations : ['Northern Regional Load Despatch Centre (NRLDC)', 'Substation Ops', 'Corporate HQ Remote Users'],
        suspectedRootCause: 'Active Directory DC-02 RADIUS authentication thread deadlock following security patch rollup.',
        timeSpanMinutes: 25,
      });
    }

    // Cluster 2: SAP Fiori Billing Timeout Cluster
    if (sapTickets.length >= 2) {
      const sapLocations = Array.from(
        new Set(sapTickets.map(t => t.employee?.location).filter(Boolean) as string[])
      );
      clusters.push({
        id: 'CLUSTER-SAP-02',
        title: 'ERP Latency: SAP Fiori WebGUI Connection Pool Exhaustion',
        affectedService: 'SAP Solution Manager & Fiori Launchpad',
        affectedUsersCount: sapTickets.length + 4,
        confidence: 84,
        firstReportTime: sapTickets[sapTickets.length - 1]?.createdAt || new Date(Date.now() - 40 * 60000).toISOString(),
        latestReportTime: sapTickets[0]?.createdAt || new Date().toISOString(),
        status: 'investigating',
        ticketIds: sapTickets.map(t => t.id),
        summary: `${sapTickets.length} users reported HTTP 503 / RFC timeout during morning billing transactions on instance PRD_01.`,
        severity: 'high',
        primaryLocation: 'Corporate Finance & Grid Billing Division',
        suggestedMasterTitle: 'Major Incident: SAP Fiori Instance PRD_01 Dispatcher Saturation',
        affectedLocations: sapLocations.length > 0 ? sapLocations : ['Corporate Finance', 'Grid Commercial Division', 'Western Region Billing'],
        suspectedRootCause: 'SAP Web Dispatcher connection pool exhausted during batch billing transactions on PRD_01.',
        timeSpanMinutes: 40,
      });
    }

    return clusters;
  }

  /**
   * Create Master Incident from a cluster of tickets
   */
  createMasterFromCluster(
    cluster: IncidentCluster,
    leadEngineer: string = 'Rajesh Gupta (Network Ops Lead)'
  ): MasterIncident {
    const masterId = `MASTER-${Math.floor(100 + Math.random() * 900)}`;
    return {
      id: masterId,
      title: cluster.suggestedMasterTitle || cluster.title,
      severity: cluster.severity === 'critical' ? 'P1_CRITICAL' : 'P2_HIGH',
      affectedService: cluster.affectedService,
      status: 'investigating',
      rootCause: 'Under active root-cause investigation. Suspected RADIUS sync token backlog following domain controller patch update.',
      investigationNotes: `Master Incident spawned from Incident Pulse AI Cluster [${cluster.id}]. Initial triage team assigned. Priority 1 bridge active.`,
      linkedTicketIds: [...cluster.ticketIds],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedLead: leadEngineer,
      broadcastMessage: `IT Operations is actively resolving a major incident affecting ${cluster.affectedService}. Updates will post here automatically.`,
      timeline: [
        {
          id: 'mevt_1',
          time: new Date(Date.now() - 15 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          event: `Incident Pulse AI detected high velocity ticket cluster (${cluster.ticketIds.length} tickets)`,
          author: 'GRIDMIND AI Sentinel',
        },
        {
          id: 'mevt_2',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          event: `Master Incident ${masterId} declared by ${leadEngineer}. All ${cluster.ticketIds.length} tickets linked.`,
          author: leadEngineer,
        },
      ],
    };
  }
}

export const incidentPulseService = new IncidentPulseService();
