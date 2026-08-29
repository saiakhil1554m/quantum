/**
 * MCP-Ready Tool Registry for GRIDMIND
 * Defines executable tools with parameter schemas that can be exposed to AI agents or MCP servers.
 */

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, { type: string; description: string; enum?: string[] }>;
    required: string[];
  };
  handler: (args: Record<string, any>) => Promise<any>;
}

export class ToolRegistry {
  private tools: Map<string, ToolDefinition> = new Map();

  register(tool: ToolDefinition) {
    this.tools.set(tool.name, tool);
  }

  getTools(): ToolDefinition[] {
    return Array.from(this.tools.values());
  }

  async executeTool(name: string, args: Record<string, any>) {
    const tool = this.tools.get(name);
    if (!tool) {
      throw new Error(`Tool ${name} not found in registry`);
    }
    return await tool.handler(args);
  }
}

export const mcpToolRegistry = new ToolRegistry();

// Register standard tools
mcpToolRegistry.register({
  name: 'search_glpi_tickets',
  description: 'Search GLPI helpdesk backend for tickets matching a query keyword or employee email',
  parameters: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Search term or keyword' },
    },
    required: ['query'],
  },
  handler: async ({ query }) => {
    return [
      { id: 'GLPI-456', title: 'VPN connection failed on Cisco AnyConnect', status: 'In Progress' },
      { id: 'GLPI-489', title: 'Remote gateway timeout after domain password reset', status: 'Open' },
    ].filter(t => t.title.toLowerCase().includes((query || '').toLowerCase()));
  },
});

mcpToolRegistry.register({
  name: 'search_solman_incidents',
  description: 'Search SAP Solution Manager CRM for ERP incidents and Fiori authorization errors',
  parameters: {
    type: 'object',
    properties: {
      systemCode: { type: 'string', description: 'SAP System ID e.g. PRD_01 or DEV_02' },
      errorPattern: { type: 'string', description: 'RFC or HTTP error code' },
    },
    required: [],
  },
  handler: async ({ systemCode, errorPattern }) => {
    return [
      { id: 'SOL-INC-882', component: 'BC-SEC-AUT', description: 'Fiori Launchpad 403 Forbidden after AD password sync', system: systemCode || 'PRD_01' },
    ];
  },
});

mcpToolRegistry.register({
  name: 'detect_incident_pulse_cluster',
  description: 'Analyze time-series ticket inflow to detect statistically significant incident clusters',
  parameters: {
    type: 'object',
    properties: {
      timeWindowMinutes: { type: 'number', description: 'Window in minutes to evaluate' },
    },
    required: ['timeWindowMinutes'],
  },
  handler: async ({ timeWindowMinutes }) => {
    return {
      clusterDetected: true,
      service: 'Remote Access / VPN Gateway',
      volumeCount: 12,
      confidence: 0.89,
      severity: 'critical',
    };
  },
});
