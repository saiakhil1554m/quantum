import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Plus,
  Paperclip,
  Mic,
  Sparkles,
  Ticket,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Clock,
  MessageSquare,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  FileText,
  Image as ImageIcon,
  User,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useHelpdesk } from '../../context/HelpdeskContext';
import { useAuth } from '../../context/AuthContext';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  actions?: { label: string; action: 'diagnose' | 'create_ticket' | 'custom'; payload?: string }[];
  attachments?: { name: string; url: string; size: string }[];
  diagnosticResults?: { step: string; status: 'passed' | 'failed' }[];
}

interface ConversationSession {
  id: string;
  title: string;
  timestamp: string;
  preview: string;
  messages: Message[];
}

export const AiAssistantPage: React.FC = () => {
  const { createTicket, navigateTo } = useHelpdesk();
  const { currentUser } = useAuth();

  // Initial Sample Conversations
  const [sessions, setSessions] = useState<ConversationSession[]>([
    {
      id: 'sess_1',
      title: 'VPN Connection Failure',
      timestamp: 'Today, 09:42 AM',
      preview: 'RADIUS server authentication timeout on Cisco AnyConnect',
      messages: [
        {
          id: 'm1',
          sender: 'ai',
          text: `Hello ${currentUser?.name || 'Employee'}, I am your POWERGRID AI IT Sentinel. How can I assist you with your IT systems today?`,
          timestamp: '09:40 AM',
        },
        {
          id: 'm2',
          sender: 'user',
          text: 'My VPN is not connecting when working remotely.',
          timestamp: '09:41 AM',
        },
        {
          id: 'm3',
          sender: 'ai',
          text: 'I can help you troubleshoot your VPN connection. Would you like me to run a quick automated diagnosis on your network gateway?',
          timestamp: '09:42 AM',
          actions: [
            { label: 'Run Diagnosis', action: 'diagnose' },
            { label: 'Create Ticket', action: 'create_ticket' },
          ],
        },
      ],
    },
    {
      id: 'sess_2',
      title: 'SAP Fiori SSO Lockout',
      timestamp: 'Yesterday, 14:15',
      preview: 'Single Sign-On credential cache cleared automatically',
      messages: [
        {
          id: 'm10',
          sender: 'user',
          text: 'SAP Fiori says password expired.',
          timestamp: '14:10',
        },
        {
          id: 'm11',
          sender: 'ai',
          text: 'Active Directory SSO sync completed successfully. Password reset link sent to registered mobile.',
          timestamp: '14:15',
        },
      ],
    },
  ]);

  const [activeSessionId, setActiveSessionId] = useState<string>('sess_1');
  const [historyOpen, setHistoryOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Current active conversation messages
  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
  const [messages, setMessages] = useState<Message[]>(activeSession.messages);

  // Input states
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Attachments state
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; url: string; size: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Conversion Modal State
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [ticketSubmitting, setTicketSubmitting] = useState(false);
  const [createdTicketId, setCreatedTicketId] = useState<string | null>(null);

  // Auto-scroll ref
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Update messages when switching sessions
  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
    const target = sessions.find(s => s.id === id);
    if (target) {
      setMessages(target.messages);
    }
  };

  // Start New Conversation
  const handleNewConversation = () => {
    const newId = `sess_${Date.now()}`;
    const newSess: ConversationSession = {
      id: newId,
      title: 'New IT Support Chat',
      timestamp: 'Just now',
      preview: 'Started a new session',
      messages: [
        {
          id: `m_${Date.now()}`,
          sender: 'ai',
          text: `Hello ${currentUser?.name || 'Employee'}, I am ready to help you with hardware, software, or network issues. What problem are you experiencing?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    };
    setSessions(prev => [newSess, ...prev]);
    setActiveSessionId(newId);
    setMessages(newSess.messages);
  };

  // Handle Image / File Attachment
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: { name: string; url: string; size: string }[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const url = URL.createObjectURL(f);
      const sizeMb = (f.size / (1024 * 1024)).toFixed(1);
      newAttachments.push({
        name: f.name,
        url: url,
        size: `${sizeMb} MB`,
      });
    }

    setAttachedFiles(prev => [...prev, ...newAttachments]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Send Message
  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend !== undefined ? textToSend : input).trim();
    if (!text && attachedFiles.length === 0) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = {
      id: `m_u_${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: timeStr,
      attachments: attachedFiles.length > 0 ? [...attachedFiles] : undefined,
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setAttachedFiles([]);
    setIsTyping(true);

    // Update active session preview
    setSessions(prev =>
      prev.map(s => (s.id === activeSessionId ? { ...s, preview: text || 'Attached files', messages: updatedMessages } : s))
    );

    // Send message to Gemini AI API backend
    (async () => {
      try {
        const historyForApi = updatedMessages.map(m => ({
          role: m.sender === 'ai' ? ('assistant' as const) : ('user' as const),
          content: m.text,
        }));

        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: historyForApi }),
        });

        if (response.ok) {
          const data = await response.json();
          const aiMsg: Message = {
            id: `m_ai_${Date.now()}`,
            sender: 'ai',
            text: data.text,
            timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            actions: [
              { label: 'Run Diagnosis', action: 'diagnose' },
              { label: 'Create Ticket', action: 'create_ticket' },
              { label: 'Contact IT Support', action: 'custom', payload: 'contact_support' },
            ],
          };

          const finalMsgs = [...updatedMessages, aiMsg];
          setMessages(finalMsgs);
          setSessions(prev =>
            prev.map(s => (s.id === activeSessionId ? { ...s, messages: finalMsgs } : s))
          );
          setIsTyping(false);
          return;
        }
      } catch (err) {
        console.warn('Gemini AI chat call failed, falling back to offline assistant:', err);
      }

      // Fallback heuristic if API unavailable
      const lower = text.toLowerCase();
      let aiText = '';
      let actions: { label: string; action: 'diagnose' | 'create_ticket' | 'custom'; payload?: string }[] | undefined = undefined;

      if (lower.includes('vpn') || lower.includes('connect') || lower.includes('network')) {
        aiText = 'I can help you troubleshoot your VPN connection. Would you like me to run an autonomous network gateway diagnosis?';
        actions = [
          { label: 'Run Diagnosis', action: 'diagnose' },
          { label: 'Create Ticket', action: 'create_ticket' },
        ];
      } else if (lower.includes('sap') || lower.includes('password') || lower.includes('login') || lower.includes('lock')) {
        aiText = 'Active Directory lock detected for SAP Fiori. I can trigger an automated identity verification and credential sync.';
        actions = [
          { label: 'Sync Credentials', action: 'custom', payload: 'sync_credentials' },
          { label: 'Create Ticket', action: 'create_ticket' },
        ];
      } else {
        aiText = `I have analyzed your query regarding "${text}". Based on enterprise telemetry, would you like me to run autonomous diagnostics or route this directly to IT Support?`;
        actions = [
          { label: 'Run Diagnosis', action: 'diagnose' },
          { label: 'Create Ticket', action: 'create_ticket' },
        ];
      }

      const aiMsg: Message = {
        id: `m_ai_${Date.now()}`,
        sender: 'ai',
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: actions,
      };

      const finalMsgs = [...updatedMessages, aiMsg];
      setMessages(finalMsgs);
      setSessions(prev =>
        prev.map(s => (s.id === activeSessionId ? { ...s, messages: finalMsgs } : s))
      );
      setIsTyping(false);
    })();
  };

  // Handle Action Chip Clicks
  const handleActionClick = (act: { label: string; action: 'diagnose' | 'create_ticket' | 'custom'; payload?: string }) => {
    if (act.action === 'create_ticket') {
      setTicketModalOpen(true);
      return;
    }

    if (act.action === 'diagnose') {
      setIsTyping(true);
      setTimeout(() => {
        const diagMsg: Message = {
          id: `m_diag_${Date.now()}`,
          sender: 'ai',
          text: 'Running autonomous network and gateway diagnostics...',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          diagnosticResults: [
            { step: 'DNS Resolution on DC-01.powergrid.in', status: 'passed' },
            { step: 'Gateway SSL Handshake (SSL_TLS_1.3)', status: 'passed' },
            { step: 'RADIUS Peer Authentication Check', status: 'failed' },
          ],
        };

        const followUpMsg: Message = {
          id: `m_escalate_${Date.now()}`,
          sender: 'ai',
          text: "I couldn't resolve this automatically because the RADIUS Peer Authentication check failed. Would you like me to create an IT support ticket for the Network Engineering team?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actions: [{ label: 'Create Ticket', action: 'create_ticket' }],
        };

        const newMsgs = [...messages, diagMsg, followUpMsg];
        setMessages(newMsgs);
        setIsTyping(false);
      }, 1200);
    }
  };

  // Voice Dictate Simulation
  const handleVoiceInput = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      handleSendMessage('My VPN client is failing with error code 800 during authentication.');
    }, 1500);
  };

  // Create Ticket from Conversation
  const handleConfirmCreateTicket = async () => {
    setTicketSubmitting(true);
    const userTextSummary = messages.filter(m => m.sender === 'user').map(m => m.text).join(' | ') || 'IT Support Query';
    const isHardware = userTextSummary.toLowerCase().includes('hardware') || userTextSummary.toLowerCase().includes('laptop');

    const created = await createTicket({
      title: `AI Chat Escalation: ${userTextSummary.slice(0, 40)}...`,
      description: `[Auto-escalated from AI Conversation Workspace]\n\nConversation Summary:\n${userTextSummary}`,
      problemType: isHardware ? 'hardware' : 'software',
      category: isHardware ? 'hardware_workstation' : 'software_vpn',
      subcategory: 'AI Assistant Escalation',
      service: isHardware ? 'Hardware Ops' : 'VPN Support',
      priority: 'high',
      priorityScore: 75,
      priorityFactors: ['AI Self-Service Diagnostic Failed', 'Employee Escalation'],
      aiConfidence: 90,
      aiReasoning: 'Escalated directly from AI Assistant conversation stream following failed diagnostic telemetry.',
      routingRecommendation: isHardware ? 'Hardware & Substation Ops' : 'Network Support',
    });

    setTicketSubmitting(false);
    setCreatedTicketId(created.id);
  };

  const filteredSessions = sessions.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-68px)] bg-[#DDE6ED] font-sans selection:bg-[#9DB2BF]/40 overflow-hidden">
      {/* Top Header Bar */}
      <div className="h-14 bg-white border-b border-[#9DB2BF]/60 px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl overflow-hidden shadow-xs ring-1 ring-[#526D82]/30">
            <img src="/assets/ai-robot.jpg" alt="AI Sentinel" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-[#27374D] tracking-tight">AI Assistant</h1>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#27374D] text-white">
                SENTINEL v2.4
              </span>
            </div>
            <p className="text-[11px] text-[#526D82]">Your dedicated IT support conversation workspace</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setHistoryOpen(!historyOpen)}
            className="p-2 rounded-lg text-[#526D82] hover:text-[#27374D] hover:bg-[#DDE6ED]/60 transition-colors cursor-pointer"
            title="Toggle Conversation History"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
          <button
            onClick={handleNewConversation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#27374D] hover:bg-[#1e2b3c] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#9DB2BF]" />
            <span>New Conversation</span>
          </button>
        </div>
      </div>

      {/* Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left History Panel */}
        {historyOpen && (
          <div className="w-72 bg-white border-r border-[#9DB2BF]/60 flex flex-col shrink-0 transition-all duration-200">
            <div className="p-3 border-b border-[#DDE6ED] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#27374D] uppercase tracking-wider">
                  History
                </span>
                <span className="text-[10px] font-mono text-[#526D82]">{sessions.length} Chats</span>
              </div>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#526D82]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search chats..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#DDE6ED]/40 rounded-lg border border-[#9DB2BF]/60 text-[#27374D] placeholder-[#526D82]/60 focus:outline-none focus:bg-white"
                />
              </div>
            </div>

            {/* Conversation History List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredSessions.map(s => {
                const isActive = s.id === activeSessionId;
                return (
                  <div
                    key={s.id}
                    onClick={() => handleSelectSession(s.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer text-left ${
                      isActive
                        ? 'bg-[#27374D] text-white border-[#27374D] shadow-xs'
                        : 'bg-white hover:bg-[#DDE6ED]/50 border-[#9DB2BF]/40 text-[#27374D]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs font-bold truncate max-w-[140px]">{s.title}</h4>
                      <span className={`text-[9px] font-mono ${isActive ? 'text-[#9DB2BF]' : 'text-[#526D82]'}`}>
                        {s.timestamp}
                      </span>
                    </div>
                    <p className={`text-[11px] truncate ${isActive ? 'text-[#DDE6ED]/80' : 'text-[#526D82]'}`}>
                      {s.preview}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Center Main Conversation Area */}
        <div className="flex-1 flex flex-col justify-between overflow-hidden bg-[#DDE6ED]/30">
          {/* Scrollable Chat Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map(m => {
              const isUser = m.sender === 'user';
              return (
                <div key={m.id} className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-xl overflow-hidden shrink-0 shadow-xs flex items-center justify-center ${
                    isUser ? 'bg-[#27374D] text-white' : 'bg-white border border-[#9DB2BF]/60'
                  }`}>
                    {isUser ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <img src="/assets/ai-robot.jpg" alt="AI" className="w-full h-full object-cover" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`max-w-lg space-y-2 ${isUser ? 'items-end text-right' : 'items-start'}`}>
                    <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                      isUser
                        ? 'bg-[#27374D] text-white rounded-tr-xs'
                        : 'bg-white text-[#27374D] border border-[#9DB2BF]/60 rounded-tl-xs'
                    }`}>
                      <p className="whitespace-pre-wrap">{m.text}</p>

                      {/* Attachments Preview */}
                      {m.attachments && m.attachments.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-white/20 flex flex-wrap gap-2">
                          {m.attachments.map((att, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 p-1.5 rounded bg-black/20 text-[11px]">
                              {att.name.match(/\.(png|jpg|jpeg)$/i) ? (
                                <img src={att.url} alt={att.name} className="w-8 h-8 object-cover rounded" />
                              ) : (
                                <FileText className="w-4 h-4 text-[#9DB2BF]" />
                              )}
                              <span className="truncate max-w-[100px]">{att.name}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Diagnostics Log */}
                      {m.diagnosticResults && (
                        <div className="mt-3 space-y-1.5 text-left border-t border-[#9DB2BF]/40 pt-2">
                          <span className="text-[10px] font-mono font-bold text-[#526D82] uppercase">
                            Telemetry Diagnostic Execution
                          </span>
                          <div className="space-y-1">
                            {m.diagnosticResults.map((r, i) => (
                              <div key={i} className="p-2 rounded bg-[#DDE6ED]/60 text-[11px] flex items-center justify-between border border-[#9DB2BF]/40">
                                <span>{r.step}</span>
                                <span className={`font-mono font-bold text-[10px] px-1.5 py-0.5 rounded ${
                                  r.status === 'passed' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                }`}>
                                  {r.status.toUpperCase()}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Interactive Action Chips */}
                    {m.actions && m.actions.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {m.actions.map((act, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleActionClick(act)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shadow-xs cursor-pointer flex items-center gap-1.5 ${
                              act.action === 'create_ticket'
                                ? 'bg-[#526D82] hover:bg-[#27374D] text-white'
                                : 'bg-white hover:bg-[#DDE6ED] text-[#27374D] border border-[#9DB2BF]'
                            }`}
                          >
                            {act.action === 'create_ticket' ? <Ticket className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5 text-[#526D82]" />}
                            <span>{act.label}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Timestamp */}
                    <span className="text-[10px] font-mono text-[#526D82] block px-1">
                      {m.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0 bg-white border border-[#9DB2BF]/60 p-0.5">
                  <img src="/assets/ai-robot.jpg" alt="AI" className="w-full h-full object-cover" />
                </div>
                <div className="p-3 rounded-2xl bg-white text-[#526D82] border border-[#9DB2BF]/60 text-xs flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#526D82] animate-spin" />
                  <span>GRIDMIND AI is analyzing your issue...</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Fixed Bottom Input Box */}
          <div className="p-4 bg-white border-t border-[#9DB2BF]/60 shrink-0 space-y-2">
            {/* Uploaded Attachments Preview Bar */}
            {attachedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 pb-1">
                {attachedFiles.map((att, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#DDE6ED] border border-[#9DB2BF] text-xs text-[#27374D]">
                    <ImageIcon className="w-3.5 h-3.5 text-[#526D82]" />
                    <span className="truncate max-w-[120px] font-medium">{att.name}</span>
                    <button
                      onClick={() => setAttachedFiles(prev => prev.filter((_, i) => i !== idx))}
                      className="text-[#526D82] hover:text-rose-600 cursor-pointer ml-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input Toolbar */}
            <div className="flex items-end gap-2 bg-[#DDE6ED]/40 border border-[#9DB2BF] rounded-xl p-2 focus-within:border-[#27374D] focus-within:bg-white transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg, .pdf, .txt"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-[#526D82] hover:text-[#27374D] hover:bg-[#DDE6ED] rounded-lg transition-colors cursor-pointer shrink-0"
                title="Attach Image / File"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleVoiceInput}
                disabled={isRecording}
                className={`p-2 rounded-lg transition-colors cursor-pointer shrink-0 ${
                  isRecording ? 'bg-rose-500 text-white animate-pulse' : 'text-[#526D82] hover:text-[#27374D] hover:bg-[#DDE6ED]'
                }`}
                title="Voice Input"
              >
                <Mic className="w-4 h-4" />
              </button>

              <textarea
                rows={1}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type your IT issue... (Enter to send, Shift+Enter for newline)"
                className="flex-1 bg-transparent text-xs sm:text-sm text-[#27374D] placeholder-[#526D82]/60 focus:outline-none resize-none py-1.5 px-2"
              />

              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!input.trim() && attachedFiles.length === 0}
                className="p-2.5 rounded-lg bg-[#27374D] hover:bg-[#1e2b3c] disabled:opacity-40 text-white transition-colors cursor-pointer shrink-0"
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CONVERSATION -> TICKET CREATION MODAL */}
      {ticketModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#27374D]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#9DB2BF] shadow-xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#DDE6ED] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#27374D] text-white flex items-center justify-center">
                  <Ticket className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#27374D]">Create Ticket from Conversation</h3>
                  <p className="text-xs text-[#526D82]">AI Conversation Escalation Summary</p>
                </div>
              </div>
              <button
                onClick={() => setTicketModalOpen(false)}
                className="p-1 text-[#526D82] hover:text-[#27374D] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {createdTicketId ? (
              <div className="text-center py-4 space-y-3">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-[#27374D]">Ticket Logged Successfully</h4>
                <p className="text-xs font-mono font-bold text-[#526D82] bg-[#DDE6ED] p-2 rounded-lg inline-block">
                  {createdTicketId}
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setTicketModalOpen(false);
                      setCreatedTicketId(null);
                      navigateTo('my-tickets');
                    }}
                    className="w-full py-2.5 bg-[#27374D] hover:bg-[#1e2b3c] text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    View in My Tickets →
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-lg bg-[#DDE6ED]/50 border border-[#9DB2BF]/60 space-y-1">
                    <span className="text-[10px] font-mono text-[#526D82] uppercase font-bold">Auto-Generated Summary</span>
                    <p className="font-semibold text-[#27374D]">
                      {messages.filter(m => m.sender === 'user').map(m => m.text).join(' • ') || 'VPN & Telemetry Error'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-lg bg-[#DDE6ED]/30 border border-[#9DB2BF]/40">
                      <span className="text-[10px] text-[#526D82] uppercase font-bold block">Assigned Queue</span>
                      <span className="font-bold text-[#27374D]">Network Engineering</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#DDE6ED]/30 border border-[#9DB2BF]/40">
                      <span className="text-[10px] text-[#526D82] uppercase font-bold block">Priority Level</span>
                      <span className="font-bold text-amber-700">High Priority</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-2 border-t border-[#DDE6ED]">
                  <button
                    type="button"
                    onClick={() => setTicketModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-[#DDE6ED] text-[#27374D] text-xs font-semibold hover:bg-[#9DB2BF]/40 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmCreateTicket}
                    disabled={ticketSubmitting}
                    className="px-4 py-2 rounded-lg bg-[#27374D] hover:bg-[#1e2b3c] text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    {ticketSubmitting ? 'Submitting Ticket...' : 'Confirm & Create IT Ticket'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
