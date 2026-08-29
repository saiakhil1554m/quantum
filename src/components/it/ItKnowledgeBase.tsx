import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Copy,
  CheckCircle2,
} from 'lucide-react';
import { useHelpdesk } from '../../context/HelpdeskContext';
import { KnowledgeArticle } from '../../types';

export const ItKnowledgeBase: React.FC = () => {
  const { knowledgeArticles } = useHelpdesk();
  const [search, setSearch] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(
    knowledgeArticles[0] || null
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = knowledgeArticles.filter(
    a =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.content.toLowerCase().includes(search.toLowerCase()) ||
      a.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCopySnippet = (art: KnowledgeArticle) => {
    navigator.clipboard.writeText(art.content);
    setCopiedId(art.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto font-sans text-[#27374D]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#DDE6ED] border border-[#9DB2BF] text-[#27374D] text-xs font-semibold mb-1">
            <BookOpen className="w-3.5 h-3.5 text-[#526D82]" />
            <span>Resolution Playbook Repository</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#27374D] tracking-tight">
            IT Knowledge & Resolution SOPs
          </h1>
          <p className="text-xs sm:text-sm text-[#526D82] mt-0.5">
            Standard operating procedures automatically referenced by the AI Resolution Assistant
          </p>
        </div>
      </div>

      {/* Search and Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Left: Articles List */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#526D82] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search playbooks..."
              className="w-full pl-9 pr-3 py-2 bg-[#DDE6ED]/40 border border-[#9DB2BF] rounded-lg text-xs text-[#27374D] placeholder-[#526D82]/60 focus:outline-none focus:bg-white focus:border-[#27374D]"
            />
          </div>

          <div className="space-y-2">
            {filtered.map(art => (
              <div
                key={art.id}
                onClick={() => setSelectedArticle(art)}
                className={`p-4 rounded-xl border transition-all cursor-pointer shadow-xs ${
                  selectedArticle?.id === art.id
                    ? 'bg-white border-[#27374D] ring-2 ring-[#27374D]/20'
                    : 'bg-white border-[#9DB2BF] hover:border-[#526D82]'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-[#526D82] mb-1">
                  <span className="uppercase font-bold text-[#27374D] px-2 py-0.5 rounded bg-[#DDE6ED]">
                    {art.category}
                  </span>
                  <span>{art.helpfulCount} helpful</span>
                </div>
                <h2 className="text-xs sm:text-sm font-bold text-[#27374D] line-clamp-1">
                  {art.title}
                </h2>
                <p className="text-[11px] text-[#526D82] mt-1 line-clamp-2">{art.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Article Details */}
        <div className="md:col-span-2 space-y-4">
          {selectedArticle ? (
            <div className="p-5 sm:p-6 rounded-xl bg-white border border-[#9DB2BF] space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-[#DDE6ED]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#DDE6ED] text-[#27374D]">
                    {selectedArticle.category}
                  </span>
                  <h2 className="text-lg font-bold text-[#27374D] mt-1.5">
                    {selectedArticle.title}
                  </h2>
                </div>

                <button
                  onClick={() => handleCopySnippet(selectedArticle)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#27374D] hover:bg-[#1e2b3c] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  {copiedId === selectedArticle.id ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied Snippet</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#9DB2BF]" />
                      <span>Copy SOP Text</span>
                    </>
                  )}
                </button>
              </div>

              <div className="prose prose-xs max-w-none text-[#27374D] leading-relaxed">
                <p className="whitespace-pre-wrap">{selectedArticle.content}</p>
              </div>

              <div className="pt-3 border-t border-[#DDE6ED] flex items-center justify-between text-xs text-[#526D82]">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono text-[#526D82] uppercase font-bold">Tags:</span>
                  {selectedArticle.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-[#DDE6ED] text-[#27374D] font-mono text-[10px]">
                      #{tag}
                    </span>
                  ))}
                </div>
                <span className="font-mono text-[11px] text-[#526D82]">Updated by IT Engineering</span>
              </div>
            </div>
          ) : (
            <div className="p-8 bg-white border border-[#9DB2BF] rounded-xl text-center text-[#526D82] shadow-xs">
              Select an SOP article from the list to view instructions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
