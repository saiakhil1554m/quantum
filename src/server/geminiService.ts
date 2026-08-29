import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

// Unified Gemini Client Initialization
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Preferred model list in priority order
const PREFERRED_MODELS = ['gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-1.5-flash'];

/**
  * System instruction for the POWERGRID AI Assistant
  */
const ASSISTANT_SYSTEM_INSTRUCTION = `
You are the POWERGRID Smart IT Helpdesk AI Assistant.

Help employees troubleshoot IT problems involving:
- VPN
- Network
- Passwords
- Active Directory
- Email
- SAP
- Software
- Hardware
- Remote access
- Account/access problems
- General IT support

Give clear, simple, step-by-step troubleshooting instructions.

Do not claim that an action was performed unless the application actually performed it.

Do not invent POWERGRID-specific policies, credentials, procedures, or system information.

If the problem cannot reasonably be solved through self-service, recommend creating an IT support ticket.

If appropriate, offer actions:
- Troubleshoot
- Create Ticket
- Contact IT Support
`;

export interface ChatMessageInput {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface TicketClassificationInput {
  description: string;
  categoryHint?: string;
  deviceDetails?: string;
  softwareDetails?: string;
  images?: string[]; // base64 strings or URLs
  conversationContext?: string;
  userRole?: string;
  availableKbArticles?: { id: string; title: string; category: string; summary: string }[];
}

export interface TicketClassificationOutput {
  category: 'network' | 'sap_enterprise' | 'access_identity' | 'hardware_workstation' | 'email_collaboration' | 'general';
  difficulty: 'HARD' | 'MEDIUM' | 'EASY';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  assignedTeam: 'Network Support' | 'Hardware & Infrastructure Ops' | 'SAP / ERP Support' | 'Access & Identity' | 'Security Operations' | 'Application Support' | 'General IT Support';
  summary: string;
  suggestedResolution: string;
  technicalReasoning: string;
  confidence: number;
  recommendedArticles: { id: string; title: string }[];
}

/**
 * Execute Gemini model with automatic model fallback
 */
async function generateContentWithFallback(contents: any, systemInstruction?: string): Promise<string> {
  if (!ai) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }

  let lastError: any = null;

  for (const modelName of PREFERRED_MODELS) {
    try {
      const config: any = {};
      if (systemInstruction) {
        config.systemInstruction = systemInstruction;
      }
      const response = await ai.models.generateContent({
        model: modelName,
        contents,
        config,
      });

      if (response && response.text) {
        return response.text;
      }
    } catch (err: any) {
      lastError = err;
      // Continue to next model if not found or deprecated
      console.warn(`Gemini model ${modelName} call failed:`, err?.message || err);
    }
  }

  throw lastError || new Error('Failed to generate content with available Gemini models.');
}

/**
 * Multi-turn Chat Assistant using Gemini AI
 */
export async function chatWithGemini(messages: ChatMessageInput[]): Promise<string> {
  if (!messages || messages.length === 0) {
    return "Hello! How can I assist you with your POWERGRID IT support request today?";
  }

  // Format context history for Gemini
  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  return await generateContentWithFallback(contents, ASSISTANT_SYSTEM_INSTRUCTION);
}

/**
 * AI Ticket Classification with Multi-modal Image Analysis and Structured Output
 */
export async function classifyTicketWithGemini(input: TicketClassificationInput): Promise<TicketClassificationOutput> {
  const {
    description,
    categoryHint = '',
    deviceDetails = '',
    softwareDetails = '',
    images = [],
    conversationContext = '',
    availableKbArticles = [],
  } = input;

  const kbArticleListText = availableKbArticles.map(a => `- ID: ${a.id} | Title: "${a.title}" | Category: ${a.category} | Summary: ${a.summary}`).join('\n');

  const promptText = `
You are the POWERGRID AI Ticket Triage Engine. Analyze the following IT issue report and produce a JSON classification response.

ISSUE DESCRIPTION:
"${description}"

CATEGORY HINT FROM USER: "${categoryHint}"
DEVICE DETAILS: "${deviceDetails}"
SOFTWARE DETAILS: "${softwareDetails}"
CONVERSATION CONTEXT: "${conversationContext}"

EXISTING KNOWLEDGE BASE ARTICLES AVAILABLE IN THE APP (Select ONLY from this list if relevant, DO NOT invent articles):
${kbArticleListText || 'None available'}

CLASSIFICATION RULES:
1. Category must be one of:
   - "network" (VPN, connectivity, Wi-Fi, routers, switches, optical link)
   - "sap_enterprise" (SAP Fiori, SAP SolMan, SAP ERP, RFC, billing)
   - "access_identity" (Password reset, Active Directory, MFA, 2FA, logins)
   - "hardware_workstation" (Laptop, battery, screen, printer, peripherals)
   - "email_collaboration" (Outlook, Exchange, Teams, Office 365)
   - "general" (Other IT support)

2. Difficulty & Priority Logic:
   - "HARD" -> Priority "CRITICAL": Business impact is severe (e.g., SCADA system failure, substation link down, cybersecurity threat, major server outage affecting grid/multiple users).
   - "MEDIUM" -> Priority "HIGH" or "MEDIUM": Important issue affecting single employee or team work without immediate grid failure (e.g., VPN authentication desync, SAP transaction dump, printer offline, workstation hardware fault).
   - "EASY" -> Priority "LOW": Self-service routine issue (e.g., standard password reset, browser cache, basic how-to).

3. Team Routing options:
   - "Network Support"
   - "Hardware & Infrastructure Ops"
   - "SAP / ERP Support"
   - "Access & Identity"
   - "Security Operations"
   - "Application Support"
   - "General IT Support"

4. Summary: Concise 1-sentence technical summary.
5. Suggested Resolution: Step-by-step troubleshooting or resolution actions.
6. Technical Reasoning: Clear explanation of why this category, difficulty, priority, and team were chosen.
7. Recommended Articles: Pick up to 3 relevant article IDs & titles ONLY from the provided knowledge base list. Do NOT invent new articles.

Respond strictly with valid JSON only in the following format (no markdown formatting, no extra text):
{
  "category": "network",
  "difficulty": "MEDIUM",
  "priority": "HIGH",
  "assignedTeam": "Network Support",
  "summary": "Concise technical summary",
  "suggestedResolution": "Step by step resolution text",
  "technicalReasoning": "Detailed technical analysis",
  "confidence": 94,
  "recommendedArticles": [
    { "id": "article-id", "title": "Article Title" }
  ]
}
`;

  const contentsParts: any[] = [{ text: promptText }];

  // Add attached images if present
  if (images && images.length > 0) {
    for (const imgStr of images) {
      if (imgStr.startsWith('data:image/')) {
        const matches = imgStr.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
        if (matches && matches[2]) {
          const mimeType = `image/${matches[1]}`;
          const base64Data = matches[2];
          contentsParts.push({
            inlineData: {
              mimeType,
              data: base64Data,
            },
          });
        }
      }
    }
  }

  const rawResult = await generateContentWithFallback([{ role: 'user', parts: contentsParts }]);

  // Clean raw JSON string
  let cleaned = rawResult.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
  }

  try {
    const parsed = JSON.parse(cleaned) as TicketClassificationOutput;
    
    // Normalize and validate output fields
    const category = ['network', 'sap_enterprise', 'access_identity', 'hardware_workstation', 'email_collaboration', 'general'].includes(parsed.category)
      ? parsed.category
      : 'general';

    const difficulty = ['HARD', 'MEDIUM', 'EASY'].includes(parsed.difficulty)
      ? parsed.difficulty
      : 'MEDIUM';

    const priority = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].includes(parsed.priority)
      ? parsed.priority
      : difficulty === 'HARD' ? 'CRITICAL' : difficulty === 'MEDIUM' ? 'HIGH' : 'LOW';

    const assignedTeam = [
      'Network Support', 'Hardware & Infrastructure Ops', 'SAP / ERP Support',
      'Access & Identity', 'Security Operations', 'Application Support', 'General IT Support'
    ].includes(parsed.assignedTeam)
      ? parsed.assignedTeam
      : 'General IT Support';

    return {
      category,
      difficulty,
      priority,
      assignedTeam,
      summary: parsed.summary || description.substring(0, 100),
      suggestedResolution: parsed.suggestedResolution || 'Inspect system logs and verify configuration.',
      technicalReasoning: parsed.technicalReasoning || 'Categorized based on submitted symptoms and device context.',
      confidence: typeof parsed.confidence === 'number' ? Math.min(Math.max(parsed.confidence, 50), 99) : 90,
      recommendedArticles: Array.isArray(parsed.recommendedArticles) ? parsed.recommendedArticles : [],
    };
  } catch (err) {
    console.error("Failed to parse Gemini JSON response:", cleaned, err);
    throw new Error("Invalid structured output received from Gemini API.");
  }
}
