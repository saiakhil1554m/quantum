import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  User,
  RotateCcw,
  Minus,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Play,
  FilePlus,
  PhoneCall,
} from 'lucide-react';
import { ChatbotService, ChatMessage } from '../../services/ai/ChatbotService';
import { useHelpdesk } from '../../context/HelpdeskContext';

/**
 * FloatingChatbot — Enterprise AI Assistant
 * Palette: Primary #27374D, Secondary #526D82, Accent #9DB2BF, Background #DDE6ED
 */
export const FloatingChatbot: React.FC = () => {
  const { navigateTo } = useHelpdesk();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatbotRef = useRef(new ChatbotService());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize messages
  useEffect(() => {
    setMessages(chatbotRef.current.getMessages());
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isTyping) return;

    if (!textToSend) setInputValue('');
    setIsTyping(true);

    // Add user message
    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMsg]);

    // Simulate response delay
    await new Promise(resolve => setTimeout(resolve, 700 + Math.random() * 500));

    await chatbotRef.current.processMessage(text);
    setMessages(chatbotRef.current.getMessages());
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleReset = () => {
    chatbotRef.current.reset();
    setMessages(chatbotRef.current.getMessages());
  };

  const handleActionButton = (action: 'diagnose' | 'ticket' | 'contact', customPrompt?: string) => {
    if (action === 'diagnose') {
      handleSendMessage(customPrompt || 'Run automatic diagnosis on my current issue');
    } else if (action === 'ticket') {
      navigateTo('get-help');
      setIsOpen(false);
    } else if (action === 'contact') {
      handleSendMessage('How can I contact the IT Helpdesk support team directly?');
    }
  };

  const renderMessage = (msg: ChatMessage) => {
    const isUser = msg.role === 'user';
    const isResolved = msg.metadata?.resolved;
    const isEscalation = msg.metadata?.escalate;

    return (
      <div key={msg.id} className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border border-[#9DB2BF]/40 ${
          isUser ? 'bg-[#526D82] text-white' : 'bg-[#27374D] overflow-hidden'
        }`}>
          {isUser ? (
            <User className="w-3.5 h-3.5" />
          ) : (
            <img src="/assets/ai-robot.jpg" alt="AI Robot" className="w-full h-full object-cover rounded-full" />
          )}
        </div>

        {/* Message Content */}
        <div className={`max-w-[86%] space-y-2`}>
          <div className={`px-3.5 py-2.5 rounded-xl text-xs leading-relaxed ${
            isUser
              ? 'bg-[#27374D] text-white rounded-tr-none'
              : 'bg-white text-[#27374D] border border-[#9DB2BF]/60 rounded-tl-none shadow-xs'
          }`}>
            {msg.content.split('\n').map((line, i) => {
              let formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
              formatted = formatted.replace(/`(.*?)`/g, '<code class="px-1 py-0.5 bg-[#DDE6ED] text-[#27374D] font-mono rounded text-[10px]">$1</code>');

              if (line.startsWith('───')) {
                return <hr key={i} className="my-2 border-[#DDE6ED]" />;
              }

              return (
                <p
                  key={i}
                  className={`${i > 0 && line ? 'mt-1' : ''}`}
                  dangerouslySetInnerHTML={{ __html: formatted || '&nbsp;' }}
                />
              );
            })}

            <span className={`block text-[9px] mt-1.5 font-mono ${isUser ? 'text-[#9DB2BF]' : 'text-[#526D82]'}`}>
              {msg.timestamp}
            </span>
          </div>

          {/* Action Buttons inside Assistant Messages */}
          {!isUser && (
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              <button
                type="button"
                onClick={() => handleActionButton('diagnose')}
                className="flex items-center gap-1 px-2.5 py-1 bg-[#27374D] hover:bg-[#1e2b3c] text-white text-[10px] font-semibold rounded cursor-pointer transition-colors"
              >
                <Play className="w-2.5 h-2.5 fill-current" />
                <span>Run Diagnosis</span>
              </button>
              <button
                type="button"
                onClick={() => handleActionButton('ticket')}
                className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-[#DDE6ED] text-[#27374D] border border-[#9DB2BF] text-[10px] font-semibold rounded cursor-pointer transition-colors"
              >
                <FilePlus className="w-2.5 h-2.5" />
                <span>Create Ticket</span>
              </button>
              <button
                type="button"
                onClick={() => handleActionButton('contact')}
                className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-[#DDE6ED] text-[#526D82] border border-[#9DB2BF] text-[10px] font-semibold rounded cursor-pointer transition-colors"
              >
                <PhoneCall className="w-2.5 h-2.5" />
                <span>Contact IT</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#27374D] text-white shadow-md hover:shadow-lg border-2 border-[#9DB2BF] hover:scale-105 transition-all duration-200 flex items-center justify-center cursor-pointer"
          title="POWERGRID AI Service Assistant"
          aria-label="Open AI Assistant"
          id="chatbot-fab"
        >
          <img src="/assets/ai-robot.jpg" alt="AI Robot" className="w-10 h-10 rounded-full object-cover" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-[390px] max-w-[calc(100vw-2rem)] h-[580px] max-h-[calc(100vh-2rem)] bg-[#DDE6ED] rounded-xl shadow-xl border border-[#9DB2BF] flex flex-col overflow-hidden">
          {/* Window Header */}
          <div className="bg-[#27374D] text-white px-4 py-3 flex items-center justify-between shrink-0 border-b border-[#526D82]/40">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg overflow-hidden ring-1 ring-[#9DB2BF]/40 shrink-0">
                <img src="/assets/ai-robot.jpg" alt="AI Agent" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white tracking-tight">POWERGRID AI Assistant</h3>
                <p className="text-[10px] text-[#9DB2BF] font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Enterprise Triage Online
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[#9DB2BF]">
              <button
                onClick={handleReset}
                className="p-1 hover:text-white hover:bg-[#526D82]/30 rounded transition-colors cursor-pointer"
                title="Reset conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:text-white hover:bg-[#526D82]/30 rounded transition-colors cursor-pointer"
                title="Minimize"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:text-white hover:bg-[#526D82]/30 rounded transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#DDE6ED]">
            {messages.map(msg => renderMessage(msg))}

            {isTyping && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 border border-[#9DB2BF]/40">
                  <img src="/assets/ai-robot.jpg" alt="AI" className="w-full h-full object-cover" />
                </div>
                <div className="bg-white px-3.5 py-2.5 rounded-xl border border-[#9DB2BF]/60 text-xs">
                  <span className="text-[#526D82] font-mono text-[10px]">Analyzing issue...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-[#9DB2BF] shrink-0">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask AI or describe your technical issue..."
                className="flex-1 px-3 py-2 bg-[#DDE6ED]/50 border border-[#9DB2BF] rounded-lg text-xs text-[#27374D] placeholder-[#526D82]/60 focus:outline-none focus:border-[#27374D]"
                disabled={isTyping}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isTyping}
                className="p-2 bg-[#27374D] hover:bg-[#1e2b3c] text-white rounded-lg transition-colors disabled:opacity-40 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[9px] text-[#526D82] text-center mt-1.5 font-mono">
              POWERGRID Service Desk • Strict SLA & Grid Security Enforced
            </p>
          </div>
        </div>
      )}
    </>
  );
};
