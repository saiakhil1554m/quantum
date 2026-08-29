import { Router, Request, Response } from 'express';
import { chatWithGemini, classifyTicketWithGemini } from './geminiService';

const router = Router();

/**
 * Health check endpoint for AI API
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'POWERGRID Gemini AI Backend Service',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

/**
 * POST /api/ai/chat
 * Handles multi-turn AI Assistant queries securely
 */
router.post('/chat', async (req: Request, res: Response): Promise<void> => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'Invalid or empty messages array in request body.' });
      return;
    }

    // Safety checks: limit length of individual messages
    const lastUserMsg = messages[messages.length - 1]?.content || '';
    if (lastUserMsg.length > 5000) {
      res.status(400).json({ error: 'Message content exceeds maximum allowed length of 5000 characters.' });
      return;
    }

    const aiResponseText = await chatWithGemini(messages);

    // Dynamic action recommendations based on response content
    const actions: { label: string; action: string; payload?: string }[] = [];
    const lower = aiResponseText.toLowerCase();
    if (lower.includes('create') && lower.includes('ticket')) {
      actions.push({ label: 'Create Ticket', action: 'create_ticket' });
    }
    if (lower.includes('troubleshoot') || lower.includes('step')) {
      actions.push({ label: 'Troubleshoot', action: 'diagnose' });
    }
    actions.push({ label: 'Contact IT Support', action: 'contact_support' });

    res.json({
      text: aiResponseText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actions,
    });
  } catch (err: any) {
    console.error('Error in /api/ai/chat:', err);
    res.status(500).json({
      error: 'AI assistance is temporarily unavailable. You can continue creating the ticket manually.',
      details: err?.message || 'Server error',
    });
  }
});

/**
 * POST /api/ai/classify-ticket
 * Handles AI ticket classification, difficulty/priority scoring, team routing, image analysis, and KB matching
 */
router.post('/classify-ticket', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      description,
      categoryHint = '',
      deviceDetails = '',
      softwareDetails = '',
      images = [],
      conversationContext = '',
      availableKbArticles = [],
    } = req.body;

    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      res.status(400).json({ error: 'Description field is required.' });
      return;
    }

    if (description.length > 10000) {
      res.status(400).json({ error: 'Description exceeds maximum allowed size.' });
      return;
    }

    const classification = await classifyTicketWithGemini({
      description,
      categoryHint,
      deviceDetails,
      softwareDetails,
      images,
      conversationContext,
      availableKbArticles,
    });

    res.json(classification);
  } catch (err: any) {
    console.error('Error in /api/ai/classify-ticket:', err);
    res.status(500).json({
      error: 'AI analysis is temporarily unavailable. You can continue creating the ticket manually.',
      details: err?.message || 'Server error',
    });
  }
});

export default router;
