import React, { useState } from 'react';
import { Bot, Send, Sparkles, MessageSquare, ChevronLeft, MoreVertical } from 'lucide-react';
import { askAiTutor, TutorChatResponse } from '../../services/tutorApi';
import { useQuantumStore } from '../../store/useQuantumStore';

interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
}

interface Props {
  onBack: () => void;
}

export const AiTutorView: React.FC<Props> = ({ onBack }) => {
  const { getCircuitPayload, executionResult } = useQuantumStore();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'tutor',
      text: "Hello Jaswanth! I'm your Socratic AI Quantum Tutor. Ask me any question about superposition, Hadamard gates, or quantum algorithms!",
    },
  ]);

  const handleSend = async (textToSend?: string) => {
    const promptText = textToSend || query;
    if (!promptText.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: promptText,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setQuery('');
    setLoading(true);

    const circuit = getCircuitPayload();
    const result: TutorChatResponse = await askAiTutor(promptText, circuit, executionResult);

    const tutorMsg: ChatMessage = {
      id: `tut-${Date.now()}`,
      sender: 'tutor',
      text: result.response,
    };

    setMessages((prev) => [...prev, tutorMsg]);
    setLoading(false);
  };

  return (
    <div className="flex-1 bg-[#0b0d19] text-slate-100 flex flex-col h-full overflow-hidden font-sans pb-16">
      {/* Top Header */}
      <div className="px-4 py-3 bg-[#0d0f22] border-b border-[#1e2238] flex items-center justify-between shrink-0">
        <button
          onClick={onBack}
          className="flex items-center space-x-1 text-xs font-semibold text-slate-300 hover:text-slate-100"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>AI Tutor</span>
        </button>

        <button className="text-slate-400 hover:text-slate-200">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Main Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {/* 3D AI Robot Avatar Hero */}
        <div className="text-center py-3 space-y-2">
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-600 to-cyan-400 blur-xl opacity-60 animate-pulse" />
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 shadow-xl shadow-purple-600/40 relative z-10">
              <div className="w-full h-full bg-[#0d1024] rounded-[14px] flex items-center justify-center text-purple-300">
                <Bot className="w-9 h-9" />
              </div>
            </div>
          </div>

          <h2 className="text-sm font-bold text-slate-100">Ask your quantum questions</h2>
          <p className="text-[11px] text-slate-400 max-w-xs mx-auto leading-relaxed">
            Get clear explanations, hints, and help with your circuits.
          </p>
        </div>

        {/* Suggestion Chips */}
        {messages.length <= 1 && (
          <div className="space-y-2 pt-1">
            {[
              'Why does the Hadamard gate create superposition?',
              'Explain my current circuit',
              'What is entanglement?',
              'Help me with this quiz question',
            ].map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(preset)}
                className="w-full p-3 rounded-2xl bg-[#121526] hover:bg-[#181c33] border border-[#1e2238] text-left text-xs text-slate-300 hover:text-indigo-300 flex items-center space-x-2.5 transition-all active:scale-[0.99]"
              >
                <MessageSquare className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{preset}</span>
              </button>
            ))}
          </div>
        )}

        {/* Chat Messages */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-md ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none'
                  : 'bg-[#121526] border border-[#1e2238] text-slate-200 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-2 text-slate-400 bg-[#121526] p-3 rounded-2xl border border-[#1e2238] w-48 text-xs">
            <div className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
            <span className="font-mono text-[11px]">Socratic AI thinking...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-3 bg-[#0d0f22] border-t border-[#1e2238] flex items-center space-x-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your question..."
          className="flex-1 bg-[#121526] text-slate-100 placeholder-slate-500 text-xs px-4 py-3 rounded-full border border-[#1e2238] focus:outline-none focus:border-indigo-500 font-sans"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !query.trim()}
          className="p-3 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white disabled:opacity-40 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-indigo-600/30"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
