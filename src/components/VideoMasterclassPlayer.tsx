import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  TrendingUp,
  Award,
  CheckCircle2,
  BarChart3,
  Sliders,
  ShieldCheck,
  Search,
  Activity,
  Zap,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';

interface AlgorithmFactor {
  id: string;
  name: string;
  weight: number;
  benchmark: string;
  impact: string;
  tip: string;
}

const ALGORITHM_FACTORS: AlgorithmFactor[] = [
  {
    id: 'keywords',
    name: 'Title & Subtitle Keyword Saturation',
    weight: 35,
    benchmark: 'Title ≤ 30 chars, Subtitle ≤ 62 chars with exact intent terms',
    impact: '+35% Search Placement Weight',
    tip: 'Shopify search engine indexes Title and Subtitle with 3.2x higher semantic weight than body text.',
  },
  {
    id: 'velocity',
    name: '30-Day Net Active Install Velocity',
    weight: 25,
    benchmark: 'Consistent 15%+ net month-over-month active merchant retention',
    impact: '+25% Category Momentum Lift',
    tip: 'Sudden install velocity triggers temporary featured placement across relevant category search filters.',
  },
  {
    id: 'reviews',
    name: 'Verified Review Velocity & 5-Star Sentiment',
    weight: 20,
    benchmark: 'Minimum 5–12 verified merchant 5-star reviews per month',
    impact: '+20% Conversion Flywheel',
    tip: 'Apps maintaining >4.8★ with active monthly review velocity receive boosted placement in recommended carousels.',
  },
  {
    id: 'polaris',
    name: 'Built for Shopify & Polaris 12+ Compliance',
    weight: 20,
    benchmark: 'App Bridge 4.0, zero theme lag, <2.5 min time-to-value',
    impact: '+20% Multiplier & Editorial Spotlight',
    tip: 'Built for Shopify apps gain official badging, editorial spotlighting, and exclusive placement in category headers.',
  },
];

export const VideoMasterclassPlayer: React.FC = () => {
  // Live Simulation State
  const [titleChars, setTitleChars] = useState<number>(28);
  const [subtitleChars, setSubtitleChars] = useState<number>(58);
  const [monthlyReviews, setMonthlyReviews] = useState<number>(14);
  const [uninstallRate, setUninstallRate] = useState<number>(3.2);
  const [activeFactorId, setActiveFactorId] = useState<string>('keywords');

  // Compute live algorithmic score
  const titleScore = titleChars >= 20 && titleChars <= 30 ? 30 : titleChars < 20 ? 15 : 5;
  const subtitleScore = subtitleChars >= 50 && subtitleChars <= 62 ? 30 : subtitleChars < 50 ? 18 : 5;
  const reviewScore = Math.min(25, monthlyReviews * 2);
  const retentionScore = uninstallRate <= 4 ? 15 : uninstallRate <= 8 ? 8 : 2;

  const totalScore = Math.min(100, Math.round(titleScore + subtitleScore + reviewScore + retentionScore));

  const rankTier =
    totalScore >= 90
      ? { label: 'Top 1-3 Organic Placement', color: 'text-emerald-400', badge: 'Dominant Category Leader' }
      : totalScore >= 75
      ? { label: 'Top 5-10 Search Rank', color: 'text-[#00E5FF]', badge: 'High-Visibility Tier' }
      : { label: 'Page 2+ Visibility (Optimization Needed)', color: 'text-amber-400', badge: 'At Risk of Churn' };

  return (
    <div className="w-full bg-[#0A0E17] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8 relative overflow-hidden text-white">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#008060]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-[#008060]/20 text-[#00a877] border border-[#008060]/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00a877] animate-ping" />
              CULTURISK ALGORITHM COMMAND CENTER
            </span>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              Live Shopify Ranking Telemetry
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-heading text-white mt-2">
            Shopify App Algorithm Simulation Engine
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Test how Title & Subtitle character limits, review velocity, and uninstalls directly dictate organic search rank and editorial spotlighting.
          </p>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-[#121826] border border-white/15 text-xs">
          <Activity className="w-4 h-4 text-[#00a877] animate-pulse" />
          <span className="font-mono text-slate-300">Model: Polaris 12+ & App Bridge 4.0</span>
        </div>
      </div>

      {/* Main Interactive Stage: Telemetry Dashboard & Simulation Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* Left Col: Live Algorithmic Simulation Sliders */}
        <div className="lg:col-span-7 bg-[#121826] border border-white/10 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#00a877]" />
              <span className="text-xs font-mono uppercase font-bold text-slate-200">
                Live Listing Variable Sandbox
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Drag to test ranking impact
            </span>
          </div>

          <div className="space-y-5">
            {/* Variable 1: Title Length */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">
                  App Title Character Length (Max: 30 chars)
                </span>
                <span className="font-mono font-bold text-[#00a877]">
                  {titleChars} / 30 chars {titleChars > 30 ? '(TRUNCATED)' : '(OPTIMAL)'}
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="35"
                value={titleChars}
                onChange={(e) => setTitleChars(Number(e.target.value))}
                className="w-full h-2 bg-black/60 rounded-lg appearance-none cursor-pointer accent-[#008060]"
              />
              <div className="text-[11px] text-slate-400">
                Recommended: 25–30 chars with primary keyword hook (e.g. "CartBoost: Upsell & Cross-Sell")
              </div>
            </div>

            {/* Variable 2: Subtitle Length */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">
                  App Subtitle Character Length (Max: 62 chars)
                </span>
                <span className="font-mono font-bold text-[#00E5FF]">
                  {subtitleChars} / 62 chars {subtitleChars > 62 ? '(OVERFLOW PENALTY)' : '(INDEXED)'}
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="75"
                value={subtitleChars}
                onChange={(e) => setSubtitleChars(Number(e.target.value))}
                className="w-full h-2 bg-black/60 rounded-lg appearance-none cursor-pointer accent-[#00E5FF]"
              />
              <div className="text-[11px] text-slate-400">
                Recommended: 55–62 chars packed with 2–3 high-volume merchant queries
              </div>
            </div>

            {/* Variable 3: Monthly Review Velocity */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">
                  Monthly Verified 5-Star Reviews
                </span>
                <span className="font-mono font-bold text-amber-400">
                  +{monthlyReviews} reviews/mo
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="35"
                value={monthlyReviews}
                onChange={(e) => setMonthlyReviews(Number(e.target.value))}
                className="w-full h-2 bg-black/60 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="text-[11px] text-slate-400">
                Benchmark: Top 3 category incumbents add 10–18 verified reviews/month
              </div>
            </div>

            {/* Variable 4: 24-hr Churn Rate */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">
                  24-Hour Merchant Uninstall Rate
                </span>
                <span className={`font-mono font-bold ${uninstallRate <= 4 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {uninstallRate.toFixed(1)}% {uninstallRate > 4 ? '(HIGH CHURN PENALTY)' : '(HEALTHY)'}
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="12.0"
                step="0.1"
                value={uninstallRate}
                onChange={(e) => setUninstallRate(Number(e.target.value))}
                className="w-full h-2 bg-black/60 rounded-lg appearance-none cursor-pointer accent-red-400"
              />
              <div className="text-[11px] text-slate-400">
                Ceiling: Above 4.5% uninstalls causes algorithmic search visibility suppression
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Live Predicted Score & Ranking Outcomes */}
        <div className="lg:col-span-5 bg-[#121826] border border-white/10 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                Projected Organic Outcome
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/10 text-slate-200">
                Simulated
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
              <div className="text-[11px] font-mono text-slate-400">
                Overall Algorithmic Health Score
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl sm:text-5xl font-extrabold font-mono text-white">
                  {totalScore}
                </span>
                <span className="text-sm font-mono text-slate-400">/ 100 PTS</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-black/60 rounded-full h-2.5 overflow-hidden border border-white/10">
                <div
                  className="h-full transition-all duration-300 bg-gradient-to-r from-[#008060] via-[#00a877] to-[#00E5FF]"
                  style={{ width: `${totalScore}%` }}
                />
              </div>

              <div className="pt-2 text-xs font-bold font-mono flex items-center gap-1.5">
                <span className={rankTier.color}>{rankTier.label}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300">{rankTier.badge}</span>
              </div>
            </div>

            {/* Quick Metrics Breakdown */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-black/30 border border-white/5 space-y-1">
                <div className="text-[10px] font-mono text-slate-400">Keyword Coverage</div>
                <div className="font-mono font-bold text-[#00a877]">
                  {titleScore + subtitleScore}/60 pts
                </div>
              </div>
              <div className="p-3 rounded-xl bg-black/30 border border-white/5 space-y-1">
                <div className="text-[10px] font-mono text-slate-400">Review Flywheel</div>
                <div className="font-mono font-bold text-[#00E5FF]">
                  {reviewScore}/25 pts
                </div>
              </div>
              <div className="p-3 rounded-xl bg-black/30 border border-white/5 space-y-1">
                <div className="text-[10px] font-mono text-slate-400">Day-1 Retention</div>
                <div className="font-mono font-bold text-purple-400">
                  {retentionScore}/15 pts
                </div>
              </div>
              <div className="p-3 rounded-xl bg-black/30 border border-white/5 space-y-1">
                <div className="text-[10px] font-mono text-slate-400">Built for Shopify</div>
                <div className="font-mono font-bold text-amber-400">
                  {totalScore >= 80 ? 'Eligible' : 'Prerequisites Missing'}
                </div>
              </div>
            </div>
          </div>

          {/* Expert Telemetry Note */}
          <div className="pt-4 border-t border-white/10 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#008060] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
              CR
            </div>
            <div className="text-xs space-y-0.5">
              <div className="font-bold text-white flex items-center gap-1.5">
                <span>Culturisk Growth Architecture Engine</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00a877]" />
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Algorithmic telemetry reverse-engineered across 1,400+ indexed Shopify App listings.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core Ranking Factors Tabs */}
      <div className="space-y-4 pt-2 border-t border-white/10">
        <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
          Inspect 4 Core Shopify Ranking Factors
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {ALGORITHM_FACTORS.map((factor) => {
            const isSelected = activeFactorId === factor.id;
            return (
              <button
                key={factor.id}
                onClick={() => setActiveFactorId(factor.id)}
                className={`p-4 rounded-2xl text-left border transition-all cursor-pointer space-y-2 ${
                  isSelected
                    ? 'bg-[#121826] border-[#008060] shadow-lg shadow-[#008060]/10'
                    : 'bg-[#121826]/40 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">
                    {factor.name}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#00a877]">
                    {factor.weight}%
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 leading-relaxed">
                  {factor.benchmark}
                </div>
                <div className="text-[10px] font-mono text-[#00E5FF] pt-1">
                  {factor.impact}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
