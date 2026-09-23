import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Search,
  CheckCircle2,
  DollarSign,
  Layers,
  BarChart3,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { EcosystemItem } from '../types';
import { ALL_32_ECOSYSTEMS_METADATA, getEcosystemBySlug } from '../data/allEcosystemsRegistry';
import { ECOSYSTEM_CLUSTERS } from '../data/ecosystemsData';

interface EcosystemSwitcherProps {
  onSelectEcosystem: (slug: string) => void;
  onOpenAudit: (ecosystemSlug?: string) => void;
  onOpenBooking: (service?: string) => void;
}

export const EcosystemSwitcher: React.FC<EcosystemSwitcherProps> = ({
  onSelectEcosystem,
  onOpenAudit,
  onOpenBooking,
}) => {
  const [activeSlug, setActiveSlug] = useState<string>('shopify');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCluster, setSelectedCluster] = useState<string>('all');

  const currentEcosystem = useMemo(() => {
    return getEcosystemBySlug(activeSlug);
  }, [activeSlug]);

  const filteredEcosystems = useMemo(() => {
    return ALL_32_ECOSYSTEMS_METADATA.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.marketplaceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCluster =
        selectedCluster === 'all' || item.categorySlug === selectedCluster;
      return matchesSearch && matchesCluster;
    });
  }, [searchQuery, selectedCluster]);

  const topPillSlugs = ['shopify', 'salesforce', 'atlassian', 'aws-marketplace', 'hubspot', 'slack', 'chrome', 'snowflake'];

  return (
    <div className="w-full bg-[#0B132B]/90 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden transition-all duration-300">
      {/* Dynamic Ambient Background Glow based on active ecosystem accent */}
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: currentEcosystem.accentColor }}
      />
      <div
        className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: currentEcosystem.accentColor }}
      />

      {/* Switcher Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
              Dynamic Ecosystem Switcher
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Live Telemetry & Ranking Benchmarks
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-heading text-white mt-1.5">
            Explore Growth Architecture by Software Ecosystem
          </h3>
        </div>

        {/* Quick Search & Category Filter */}
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search software marketplaces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#131C35] border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#00E5FF] transition-all"
            />
          </div>

          <select
            value={selectedCluster}
            onChange={(e) => setSelectedCluster(e.target.value)}
            className="bg-[#131C35] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#00E5FF] cursor-pointer"
          >
            <option value="all">All Vertical Clusters</option>
            {ECOSYSTEM_CLUSTERS.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Horizontal Tabs / Pills Interface */}
      <div className="py-4 relative z-10">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {(searchQuery || selectedCluster !== 'all'
            ? filteredEcosystems.slice(0, 10)
            : topPillSlugs.map((s) => ALL_32_ECOSYSTEMS_METADATA.find((m) => m.slug === s)!)
          ).map((item) => {
            const isActive = activeSlug === item.slug;
            return (
              <button
                key={item.slug}
                onClick={() => setActiveSlug(item.slug)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2 border cursor-pointer ${
                  isActive
                    ? 'bg-[#131C35] text-white border-[#00E5FF] shadow-lg shadow-[#00E5FF]/10'
                    : 'bg-[#0B132B] text-slate-400 border-white/5 hover:text-slate-200 hover:border-white/20'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: item.accentColor }}
                />
                <span>{item.name}</span>
                {isActive && (
                  <span className="text-[10px] font-mono text-[#00E5FF] bg-[#00E5FF]/10 px-1.5 py-0.2 rounded">
                    Active
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Ecosystem Showcase Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2 relative z-10">
        {/* Left Col: Overview & Badging */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold text-white border border-white/20"
              style={{ backgroundColor: `${currentEcosystem.accentColor}80` }}
            >
              {currentEcosystem.badge}
            </span>
            <span className="text-xs font-mono text-slate-400 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
              {currentEcosystem.categoryName}
            </span>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              {currentEcosystem.marketStats.merchantBuyerPool}
            </span>
          </div>

          <h4 className="text-xl sm:text-2xl font-bold font-heading text-white">
            {currentEcosystem.marketplaceName}
          </h4>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {currentEcosystem.tagline}
          </p>

          {/* Core Metrics Grid */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="bg-[#131C35] rounded-2xl p-3.5 border border-white/5 space-y-1">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Live Marketplace Apps</div>
              <div className="text-base sm:text-lg font-bold font-mono text-white">
                {currentEcosystem.marketStats.totalActiveApps}
              </div>
            </div>

            <div className="bg-[#131C35] rounded-2xl p-3.5 border border-white/5 space-y-1">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Top 3 CVR Benchmark</div>
              <div className="text-base sm:text-lg font-bold font-mono text-emerald-400">
                {currentEcosystem.marketStats.top3Cvr}
              </div>
            </div>

            <div className="bg-[#131C35] rounded-2xl p-3.5 border border-white/5 space-y-1">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Avg Organic ARR Multiple</div>
              <div className="text-base sm:text-lg font-bold font-mono text-[#00E5FF]">
                {currentEcosystem.marketStats.avgOrganicArrMultiple}
              </div>
            </div>
          </div>

          {/* Verified Case Study Callout */}
          <div className="bg-[#131C35]/60 border border-white/10 rounded-2xl p-4 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>Verified Case Study: {currentEcosystem.caseStudy.clientName}</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/15 px-1.5 rounded">
                  {currentEcosystem.caseStudy.resultArr || currentEcosystem.caseStudy.installGrowth}
                </span>
              </div>
              <p className="text-xs text-slate-300 italic">
                "{currentEcosystem.caseStudy.quote}"
              </p>
              <div className="text-[10px] font-mono text-slate-400">
                {currentEcosystem.caseStudy.authorRole}
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Algorithm Breakdown & Direct CTAs */}
        <div className="lg:col-span-5 bg-[#131C35] border border-white/10 rounded-2xl p-5 space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-300 font-bold uppercase tracking-wider">
                Algorithm Weightings
              </span>
              <span className="text-[10px] font-mono text-[#00E5FF]">
                {currentEcosystem.name} Ranking Signals
              </span>
            </div>

            {/* Algorithm Weighting Bars */}
            <div className="space-y-2.5 text-xs">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-300">Keyword Placement & Search Match</span>
                  <span className="font-mono font-bold text-white">
                    {currentEcosystem.algorithmTelemetry?.keywordWeight ?? 35}%
                  </span>
                </div>
                <div className="w-full bg-[#070C1B] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#00E5FF] h-full rounded-full"
                    style={{ width: `${currentEcosystem.algorithmTelemetry?.keywordWeight ?? 35}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-300">Review Velocity & Star Rating</span>
                  <span className="font-mono font-bold text-white">
                    {currentEcosystem.algorithmTelemetry?.reviewVelocityWeight ?? 25}%
                  </span>
                </div>
                <div className="w-full bg-[#070C1B] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-400 h-full rounded-full"
                    style={{ width: `${currentEcosystem.algorithmTelemetry?.reviewVelocityWeight ?? 25}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-300">30-Day Install Momentum</span>
                  <span className="font-mono font-bold text-white">
                    {currentEcosystem.algorithmTelemetry?.installVelocityWeight ?? 20}%
                  </span>
                </div>
                <div className="w-full bg-[#070C1B] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full rounded-full"
                    style={{ width: `${currentEcosystem.algorithmTelemetry?.installVelocityWeight ?? 20}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-300">Retention & Churn Velocity Signal</span>
                  <span className="font-mono font-bold text-white">
                    {currentEcosystem.algorithmTelemetry?.churnSignalWeight ?? 10}%
                  </span>
                </div>
                <div className="w-full bg-[#070C1B] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full"
                    style={{ width: `${currentEcosystem.algorithmTelemetry?.churnSignalWeight ?? 10}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs for this ecosystem */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <button
              onClick={() => onOpenAudit(currentEcosystem.slug)}
              className="w-full py-3 rounded-xl bg-[#00E5FF] hover:bg-[#00cce6] text-[#070C1B] font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#00E5FF]/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Audit Your {currentEcosystem.name} Listing</span>
            </button>

            <button
              onClick={() => onSelectEcosystem(currentEcosystem.slug)}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-xs border border-white/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Explore Dedicated {currentEcosystem.name} Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
