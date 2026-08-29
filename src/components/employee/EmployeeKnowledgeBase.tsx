import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  ChevronRight,
  ThumbsUp,
  AlertCircle,
  CheckCircle2,
  Monitor,
  Laptop,
  Globe,
  ListOrdered,
  Lightbulb,
  Eye,
} from 'lucide-react';
import { useHelpdesk } from '../../context/HelpdeskContext';
import { KnowledgeArticle } from '../../types';

/**
 * EmployeeKnowledgeBase — Enhanced "Solved Problems Hub" with root-cause cards
 * and step-by-step solution display. Themed with POWERGRID corporate palette.
 */
export const EmployeeKnowledgeBase: React.FC = () => {
  const { knowledgeArticles, navigateTo } = useHelpdesk();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeArticle, setActiveArticle] = useState<KnowledgeArticle | null>(null);

  const filteredArticles = knowledgeArticles.filter(art => {
    const matchesSearch =
      art.title.toLowerCase().includes(search.toLowerCase()) ||
      art.content.toLowerCase().includes(search.toLowerCase()) ||
      art.summary.toLowerCase().includes(search.toLowerCase()) ||
      art.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCat = selectedCategory === 'all' || art.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Derive category icon
  const getCategoryInfo = (cat: string) => {
    switch (cat) {
      case 'hardware_workstation':
        return { label: 'Hardware', icon: Monitor, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40', border: 'border-amber-200 dark:border-amber-800' };
      case 'network':
        return { label: 'Networking', icon: Globe, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40', border: 'border-emerald-200 dark:border-emerald-800' };
      default:
        return { label: 'Software', icon: Laptop, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-950/40', border: 'border-cyan-200 dark:border-cyan-800' };
    }
  };

  return (
    <div className="space-y-5 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 text-cyan-800 dark:text-cyan-300 text-xs font-semibold mb-1">
          <BookOpen className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          <span>Solved Problems Hub</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Knowledge Base</h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Browse resolved issues with root-cause analysis and step-by-step solutions from our technical team.
        </p>
      </div>

      {/* Search & Categories */}
      <div className="p-3.5 rounded-xl bg-white dark:bg-[#0f1d32] border border-slate-200/80 dark:border-[#1e3456] flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search issues, error codes, VPN, SAP, printer..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 focus:bg-white dark:focus:bg-slate-800"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {[
            { key: 'all', label: 'All' },
            { key: 'network', label: 'Network' },
            { key: 'sap_enterprise', label: 'SAP' },
            { key: 'access_identity', label: 'Access' },
            { key: 'hardware_workstation', label: 'Hardware' },
            { key: 'email_collaboration', label: 'Email' },
          ].map(cat => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
                selectedCategory === cat.key
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Layout: Articles List & Reader Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Left: Articles Grid */}
        <div className="md:col-span-2 space-y-3">
          {filteredArticles.length === 0 ? (
            <div className="p-8 rounded-xl bg-white dark:bg-[#0f1d32] border border-slate-200/80 dark:border-[#1e3456] text-center space-y-2">
              <Search className="w-6 h-6 text-slate-300 dark:text-slate-600 mx-auto" />
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">No articles found</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Try a different search term or category.</p>
            </div>
          ) : (
            filteredArticles.map(article => {
              const catInfo = getCategoryInfo(article.category);
              const CatIcon = catInfo.icon;

              return (
                <div
                  key={article.id}
                  onClick={() => setActiveArticle(article)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer shadow-sm ${
                    activeArticle?.id === article.id
                      ? 'bg-cyan-50/50 dark:bg-cyan-950/20 border-cyan-400 dark:border-cyan-600 shadow-md'
                      : 'bg-white dark:bg-[#0f1d32] border-slate-200/80 dark:border-[#1e3456] hover:border-cyan-300 dark:hover:border-cyan-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${catInfo.bg} ${catInfo.color} ${catInfo.border} border`}>
                      <CatIcon className="w-3 h-3" />
                      {catInfo.label}
                    </span>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 dark:text-slate-500">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" /> {article.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" /> {article.helpfulCount}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                    {article.title}
                  </h3>

                  {/* Root Cause Preview */}
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-rose-50/60 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 mb-2">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wider">Root Cause</p>
                      <p className="text-[11px] text-rose-600 dark:text-rose-300 line-clamp-2 leading-relaxed">
                        {article.summary || article.content.split('\n')[0]}
                      </p>
                    </div>
                  </div>

                  {/* Solution Steps Preview */}
                  {article.steps && article.steps.length > 0 && (
                    <div className="flex items-start gap-2 p-2.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">Solution</p>
                        <p className="text-[11px] text-emerald-600 dark:text-emerald-300">
                          {article.steps.length} steps — Click to view full resolution
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-[#1e3456] text-xs">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {article.tags.slice(0, 3).map(t => (
                        <span key={t} className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                          #{t}
                        </span>
                      ))}
                    </div>
                    <span className="text-cyan-600 dark:text-cyan-400 font-semibold flex items-center gap-0.5">
                      Read <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Article Details View */}
        <div className="space-y-4">
          {activeArticle ? (() => {
            const catInfo = getCategoryInfo(activeArticle.category);
            const CatIcon = catInfo.icon;

            return (
              <div className="p-5 rounded-xl bg-white dark:bg-[#0f1d32] border border-slate-200/80 dark:border-[#1e3456] space-y-4 shadow-sm sticky top-20">
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${catInfo.bg} ${catInfo.color} ${catInfo.border} border`}>
                    <CatIcon className="w-3 h-3" />
                    {catInfo.label}
                  </span>
                  <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold">Resolved Issue</span>
                </div>

                <h2 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {activeArticle.title}
                </h2>

                {/* Root Cause Section */}
                <div className="p-3.5 rounded-lg bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-500" />
                    <h3 className="text-xs font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wider">Root Cause Analysis</h3>
                  </div>
                  <p className="text-xs text-rose-700 dark:text-rose-300 leading-relaxed">
                    {activeArticle.summary || activeArticle.content.split('\n')[0]}
                  </p>
                </div>

                {/* Step-by-Step Solution */}
                {activeArticle.steps && activeArticle.steps.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <ListOrdered className="w-4 h-4 text-emerald-500" />
                      <h3 className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">Step-by-Step Solution</h3>
                    </div>
                    <div className="space-y-2">
                      {activeArticle.steps.map((step, idx) => (
                        <div key={idx} className="flex gap-2.5 p-2.5 rounded-lg bg-emerald-50/40 dark:bg-emerald-950/10 border border-emerald-100/80 dark:border-emerald-900/30">
                          <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                            {idx + 1}
                          </div>
                          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Full Description */}
                <div className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700/80 max-h-48 overflow-y-auto">
                  {activeArticle.content}
                </div>

                {/* CTA */}
                <div className="pt-2 border-t border-slate-100 dark:border-[#1e3456]">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    Still need personalized assistance?
                  </p>
                  <button
                    onClick={() => navigateTo('get-help')}
                    className="w-full py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white font-semibold text-xs shadow-sm transition-all text-center cursor-pointer"
                  >
                    Start Guided AI Intake
                  </button>
                </div>
              </div>
            );
          })() : (
            <div className="p-8 rounded-xl bg-white dark:bg-[#0f1d32] border border-slate-200/80 dark:border-[#1e3456] text-center text-slate-400 dark:text-slate-500 text-xs shadow-sm">
              <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40 text-cyan-600 dark:text-cyan-400" />
              <p>Select any resolved issue to view the root cause and step-by-step solution.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
