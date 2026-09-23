import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Layers,
  BarChart3,
  ExternalLink,
  Target,
  Users,
  ChevronRight,
  Zap,
  ArrowUpRight,
  Calculator,
  Award,
  FileText,
  Activity,
} from 'lucide-react';
import { EcosystemItem, ViewType } from '../types';
import { getEcosystemBySlug, ALL_32_ECOSYSTEMS_METADATA } from '../data/allEcosystemsRegistry';
import { MarketplaceAuditTool } from '../components/MarketplaceAuditTool';
import { VideoMasterclassPlayer } from '../components/VideoMasterclassPlayer';

interface EcosystemDetailViewProps {
  slug: string;
  onNavigate: (view: ViewType) => void;
  onOpenAudit: (ecosystemSlug?: string) => void;
  onOpenBooking: (service?: string) => void;
  onSelectEcosystem: (slug: string) => void;
}

export const EcosystemDetailView: React.FC<EcosystemDetailViewProps> = ({
  slug,
  onNavigate,
  onOpenAudit,
  onOpenBooking,
  onSelectEcosystem,
}) => {
  const ecosystem = useMemo(() => getEcosystemBySlug(slug), [slug]);

  // Interactive ROI Calculator State
  const [monthlyTraffic, setMonthlyTraffic] = useState<number>(
    ecosystem.roiModel.defaultMonthlyTraffic
  );
  const [cvr, setCvr] = useState<number>(ecosystem.roiModel.defaultConversionRate);
  const [arpu, setArpu] = useState<number>(ecosystem.roiModel.defaultArpu);

  const projectedInstalls = Math.round((monthlyTraffic * cvr) / 100);
  const projectedMonthlyRevenue = Math.round(projectedInstalls * arpu);
  const projectedAnnualArr = projectedMonthlyRevenue * 12;

  // Active Capability Tab
  const [activeTab, setActiveTab] = useState<'aso' | 'coMarketing' | 'performanceAds' | 'plgReviews'>('aso');

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-16">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
        <button
          onClick={() => onNavigate('landing')}
          className="hover:text-white transition-colors cursor-pointer"
        >
          Culturisk
        </button>
        <span>/</span>
        <button
          onClick={() => onNavigate('ecosystems')}
          className="hover:text-white transition-colors cursor-pointer"
        >
          Ecosystems
        </button>
        <span>/</span>
        <span className="text-slate-400">{ecosystem.categoryName}</span>
        <span>/</span>
        <span className="text-[#00E5FF] font-bold">{ecosystem.name}</span>
      </div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0B132B] border border-white/10 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl space-y-6"
      >
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: ecosystem.accentColor }}
        />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span
                className="px-3 py-1 rounded-full text-xs font-mono font-bold text-white border border-white/20 flex items-center gap-1.5"
                style={{ backgroundColor: `${ecosystem.accentColor}80` }}
              >
                <Award className="w-3.5 h-3.5" />
                {ecosystem.badge}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono text-slate-300 bg-white/5 border border-white/10">
                {ecosystem.marketStats.merchantBuyerPool}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified Growth Hub
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
              {ecosystem.marketplaceName} Growth Engine
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {ecosystem.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onOpenAudit(ecosystem.slug)}
                className="px-6 py-3 rounded-xl bg-[#00E5FF] hover:bg-[#00cce6] text-[#070C1B] font-bold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-lg shadow-[#00E5FF]/20 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Audit Your {ecosystem.name} Listing</span>
              </button>

              <button
                onClick={() => onOpenBooking(`${ecosystem.name} Growth Retainer`)}
                className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-xs sm:text-sm border border-white/15 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Book Strategy Call</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Telemetry Box */}
          <div className="bg-[#131C35] border border-white/10 rounded-2xl p-5 space-y-3 min-w-[280px]">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              {ecosystem.name} Market Metrics
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Total Live Apps</span>
                <span className="font-mono font-bold text-white">
                  {ecosystem.marketStats.totalActiveApps}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Top 3 CVR Benchmark</span>
                <span className="font-mono font-bold text-emerald-400">
                  {ecosystem.marketStats.top3Cvr}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Avg ARR Multiple</span>
                <span className="font-mono font-bold text-[#00E5FF]">
                  {ecosystem.marketStats.avgOrganicArrMultiple}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Primary Ranking Key</span>
                <span className="font-mono font-bold text-purple-400 truncate max-w-[140px]" title={ecosystem.algorithmTelemetry.primaryRankingFactors[0]}>
                  {ecosystem.algorithmTelemetry.primaryRankingFactors[0]}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Visual Asset & Strategy Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 space-y-5">
          <div className="text-xs font-mono text-[#00E5FF] uppercase tracking-wider font-bold">
            Ecosystem Optimization Framework
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
            Reverse-Engineering the {ecosystem.name} Listing Architecture
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Every software marketplace has strict algorithmic search guidelines, native UI tokens, and reviewer compliance checks. We engineer your listing assets to blend natively with the host platform's design system while dominating organic keyword queries.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
              <span>Full compliance with {ecosystem.name} technical and security review milestones.</span>
            </div>
            <div className="flex items-start gap-3 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
              <span>High-contrast screenshot carousels tested against top category incumbents.</span>
            </div>
            <div className="flex items-start gap-3 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span>Dedicated Partner Account Manager co-selling collateral and joint battlecards.</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="rounded-2xl border border-white/15 bg-[#0B132B] p-6 shadow-2xl space-y-4">
            {/* Header simulation bar */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-slate-300">
                  apps.shopify.com/high-growth-suite
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#00E5FF] px-2 py-0.5 rounded bg-[#00E5FF]/10 font-bold">
                {ecosystem.marketplaceName} PDP Architecture
              </span>
            </div>

            {/* Listing Title & Subtitle Optimization Badges */}
            <div className="space-y-2 bg-[#131C35] rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between">
                <div className="font-bold text-sm text-white flex items-center gap-2">
                  <span>CartBoost Pro: Post-Purchase Upsell</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#008060]/20 text-emerald-400 font-bold border border-[#008060]/30">
                    Built for Shopify
                  </span>
                </div>
                <span className="font-mono text-xs text-emerald-400 font-bold">
                  28/30 Chars
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>One-click checkout upsells, slide cart drawers & bundle discounts</span>
                <span className="font-mono text-xs text-[#00E5FF] font-bold">
                  58/62 Chars
                </span>
              </div>
            </div>

            {/* 3 High-Contrast Screenshot Carousel Wireframes */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <div className="bg-[#121826] rounded-xl p-3 border border-white/10 space-y-2 text-center">
                <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                  Slide 01: Value
                </div>
                <div className="text-base font-extrabold text-white font-mono">
                  +48% CVR
                </div>
                <div className="text-[10px] text-slate-400">
                  Instant 1-Click Upsell
                </div>
              </div>

              <div className="bg-[#121826] rounded-xl p-3 border border-white/10 space-y-2 text-center">
                <div className="text-[10px] font-mono text-[#00E5FF] font-bold uppercase">
                  Slide 02: Native
                </div>
                <div className="text-base font-extrabold text-white font-mono">
                  Polaris 12+
                </div>
                <div className="text-[10px] text-slate-400">
                  Zero Admin Friction
                </div>
              </div>

              <div className="bg-[#121826] rounded-xl p-3 border border-white/10 space-y-2 text-center">
                <div className="text-[10px] font-mono text-purple-400 font-bold uppercase">
                  Slide 03: Speed
                </div>
                <div className="text-base font-extrabold text-white font-mono">
                  0ms Lag
                </div>
                <div className="text-[10px] text-slate-400">
                  Theme 2.0 Blocks
                </div>
              </div>
            </div>

            {/* Footer telemetry bar */}
            <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10 text-slate-300">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> High-Contrast CRO Wireframe
              </span>
              <span className="font-mono text-[11px] text-slate-400">
                100% Polaris Token Compliant
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core Pillars Sub-Tabs */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">
              Full-Stack Capabilities for {ecosystem.name}
            </h2>
            <p className="text-xs text-slate-400">
              Click a pillar to inspect specific tactics tailored for this ecosystem.
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
          <button
            onClick={() => setActiveTab('aso')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border cursor-pointer ${
              activeTab === 'aso'
                ? 'bg-[#00E5FF] text-[#070C1B] border-transparent font-bold shadow-lg shadow-[#00E5FF]/20'
                : 'bg-[#0B132B] text-slate-400 border-white/10 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>1. Marketplace ASO & Listing CRO</span>
          </button>

          <button
            onClick={() => setActiveTab('coMarketing')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border cursor-pointer ${
              activeTab === 'coMarketing'
                ? 'bg-purple-500 text-white border-transparent font-bold shadow-lg shadow-purple-500/20'
                : 'bg-[#0B132B] text-slate-400 border-white/10 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>2. Co-Marketing & Alliances</span>
          </button>

          <button
            onClick={() => setActiveTab('performanceAds')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border cursor-pointer ${
              activeTab === 'performanceAds'
                ? 'bg-amber-500 text-black border-transparent font-bold shadow-lg shadow-amber-500/20'
                : 'bg-[#0B132B] text-slate-400 border-white/10 hover:text-white'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>3. Performance Ads & ABM</span>
          </button>

          <button
            onClick={() => setActiveTab('plgReviews')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border cursor-pointer ${
              activeTab === 'plgReviews'
                ? 'bg-emerald-500 text-white border-transparent font-bold shadow-lg shadow-emerald-500/20'
                : 'bg-[#0B132B] text-slate-400 border-white/10 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>4. PLG & Review Telemetry</span>
          </button>
        </div>

        {/* Tab Content Cards with smooth transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="bg-[#0B132B] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6"
          >
            {activeTab === 'aso' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {ecosystem.capabilityModules.aso.title}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {ecosystem.capabilityModules.aso.subtitle}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#131C35] rounded-2xl p-5 border border-white/5 space-y-3">
                    <div className="text-xs font-mono text-[#00E5FF] font-bold uppercase">
                      Search Indexing Tactics
                    </div>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {ecosystem.capabilityModules.aso.tactics.map((tactic, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[#00E5FF]">•</span>
                          <span>{tactic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-[#131C35] rounded-2xl p-5 border border-white/5 space-y-3">
                    <div className="text-xs font-mono text-emerald-400 font-bold uppercase">
                      Core Optimization Deliverables
                    </div>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {ecosystem.capabilityModules.aso.bullets.map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'coMarketing' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {ecosystem.capabilityModules.coMarketing.title}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {ecosystem.capabilityModules.coMarketing.subtitle}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#131C35] rounded-2xl p-5 border border-white/5 space-y-3">
                    <div className="text-xs font-mono text-purple-400 font-bold uppercase">
                      Partner Acceleration Steps
                    </div>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {ecosystem.capabilityModules.coMarketing.tactics.map((tactic, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-purple-400">•</span>
                          <span>{tactic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-[#131C35] rounded-2xl p-5 border border-white/5 space-y-3">
                    <div className="text-xs font-mono text-purple-300 font-bold uppercase">
                      Alliance Co-Sell Deliverables
                    </div>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {ecosystem.capabilityModules.coMarketing.bullets.map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'performanceAds' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {ecosystem.capabilityModules.performanceAds.title}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {ecosystem.capabilityModules.performanceAds.subtitle}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#131C35] rounded-2xl p-5 border border-white/5 space-y-3">
                    <div className="text-xs font-mono text-amber-400 font-bold uppercase">
                      Campaign Architecture
                    </div>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {ecosystem.capabilityModules.performanceAds.tactics.map((tactic, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-400">•</span>
                          <span>{tactic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-[#131C35] rounded-2xl p-5 border border-white/5 space-y-3">
                    <div className="text-xs font-mono text-amber-300 font-bold uppercase">
                      Ad Target & Conversion Deliverables
                    </div>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {ecosystem.capabilityModules.performanceAds.bullets.map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'plgReviews' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {ecosystem.capabilityModules.plgReviews.title}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {ecosystem.capabilityModules.plgReviews.subtitle}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#131C35] rounded-2xl p-5 border border-white/5 space-y-3">
                    <div className="text-xs font-mono text-emerald-400 font-bold uppercase">
                      Telemetry & Retention Tactics
                    </div>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {ecosystem.capabilityModules.plgReviews.tactics.map((tactic, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-400">•</span>
                          <span>{tactic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-[#131C35] rounded-2xl p-5 border border-white/5 space-y-3">
                    <div className="text-xs font-mono text-emerald-300 font-bold uppercase">
                      Review Acceleration Deliverables
                    </div>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {ecosystem.capabilityModules.plgReviews.bullets.map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Interactive ROI Projection Calculator */}
      <div className="bg-[#0B132B] border border-white/10 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-[#00E5FF] uppercase tracking-wider font-bold">
              Compounding ARR Model
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-white mt-1">
              Projected {ecosystem.name} Revenue Potential
            </h2>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30">
            Real-Time Model
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sliders */}
          <div className="lg:col-span-2 space-y-6">
            {/* Slider 1 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Monthly Marketplace PDP Views</span>
                <span className="font-mono font-bold text-[#00E5FF]">
                  {monthlyTraffic.toLocaleString()} views/mo
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="25000"
                step="250"
                value={monthlyTraffic}
                onChange={(e) => setMonthlyTraffic(Number(e.target.value))}
                className="w-full h-2 bg-[#131C35] rounded-lg appearance-none cursor-pointer accent-[#00E5FF]"
              />
            </div>

            {/* Slider 2 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Listing Conversion Rate (CVR)</span>
                <span className="font-mono font-bold text-[#10B981]">
                  {cvr.toFixed(1)}% (Benchmark: {ecosystem.marketStats.top3Cvr})
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="12.0"
                step="0.1"
                value={cvr}
                onChange={(e) => setCvr(Number(e.target.value))}
                className="w-full h-2 bg-[#131C35] rounded-lg appearance-none cursor-pointer accent-[#10B981]"
              />
            </div>

            {/* Slider 3 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Average Revenue Per Account (ARPU)</span>
                <span className="font-mono font-bold text-purple-400">
                  ${arpu} / month
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={arpu}
                onChange={(e) => setArpu(Number(e.target.value))}
                className="w-full h-2 bg-[#131C35] rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
            </div>
          </div>

          {/* Revenue Output Cards */}
          <div className="bg-[#131C35] rounded-2xl p-6 border border-white/10 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <div className="text-[11px] font-mono text-slate-400 uppercase">
                  Projected New Installs / Mo
                </div>
                <div className="text-2xl font-bold font-mono text-white">
                  {projectedInstalls.toLocaleString()} accounts
                </div>
              </div>

              <div>
                <div className="text-[11px] font-mono text-slate-400 uppercase">
                  Added Monthly Recurring (MRR)
                </div>
                <div className="text-2xl font-bold font-mono text-[#00E5FF]">
                  ${projectedMonthlyRevenue.toLocaleString()} / mo
                </div>
              </div>

              <div className="pt-2 border-t border-white/10">
                <div className="text-[11px] font-mono text-emerald-400 uppercase font-bold">
                  Annualized Run-Rate (ARR)
                </div>
                <div className="text-3xl font-extrabold font-mono text-[#10B981]">
                  ${projectedAnnualArr.toLocaleString()}
                </div>
              </div>
            </div>

            <button
              onClick={() => onOpenBooking(`Strategy Session for ${ecosystem.name}`)}
              className="w-full py-3 rounded-xl bg-[#00E5FF] hover:bg-[#00cce6] text-[#070C1B] font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#00E5FF]/20"
            >
              <span>Unlock This Growth Model</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Embedded Listing Diagnostic Tool */}
      <div className="space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
            Audit Your {ecosystem.name} App Listing
          </h2>
          <p className="text-xs text-slate-400">
            Paste your listing URL to evaluate keyword indexation, visual CRO, and {ecosystem.badge} readiness.
          </p>
        </div>

        <MarketplaceAuditTool
          initialEcosystemSlug={ecosystem.slug}
          onOpenBooking={onOpenBooking}
        />
      </div>

      {/* Switch to Other Ecosystems Grid */}
      <div className="space-y-6 pt-6 border-t border-white/10">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold font-heading text-white">
            Explore Other High-Growth Marketplaces
          </h3>
          <button
            onClick={() => onNavigate('ecosystems')}
            className="text-xs text-[#00E5FF] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>View All Ecosystem Hubs</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {ALL_32_ECOSYSTEMS_METADATA.filter((e) => e.slug !== ecosystem.slug)
            .slice(0, 6)
            .map((eco) => (
              <button
                key={eco.slug}
                onClick={() => onSelectEcosystem(eco.slug)}
                className="bg-[#0B132B] hover:bg-[#131C35] border border-white/10 hover:border-[#00E5FF]/40 rounded-xl p-3 text-left space-y-1 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: eco.accentColor }}
                  />
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white" />
                </div>
                <div className="text-xs font-bold text-white group-hover:text-[#00E5FF] truncate">
                  {eco.name}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {eco.buyerPool}
                </div>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};
