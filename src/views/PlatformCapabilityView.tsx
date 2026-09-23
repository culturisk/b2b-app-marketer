import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp,
  Target,
  Zap,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  BarChart3,
  Layers,
  ShoppingBag,
} from 'lucide-react';
import { ViewType } from '../types';
import { VideoMasterclassPlayer } from '../components/VideoMasterclassPlayer';

interface PlatformCapabilityViewProps {
  initialPillar: 'aso' | 'co-marketing' | 'performance' | 'plg-reviews';
  onOpenAudit: (ecosystemSlug?: string) => void;
  onOpenBooking: (service?: string) => void;
  onNavigate: (view: ViewType) => void;
}

export const PlatformCapabilityView: React.FC<PlatformCapabilityViewProps> = ({
  initialPillar,
  onOpenAudit,
  onOpenBooking,
  onNavigate,
}) => {
  const [activePillar, setActivePillar] = useState<
    'aso' | 'co-marketing' | 'performance' | 'plg-reviews'
  >(initialPillar);

  const pillarsData = {
    aso: {
      id: 'aso',
      title: 'Shopify App ASO & Listing CRO',
      category: 'Organic Shopify App Discovery',
      badge: 'Core Service 01',
      tagline: 'Dominate Shopify Search Algorithms & Maximize Merchant Install Conversion',
      icon: <TrendingUp className="w-6 h-6 text-[#00a877]" />,
      accentColor: '#008060',
      description:
        'The Shopify App algorithm indexes keywords with exact title and subtitle character limits (30 chars title, 62 chars subtitle). We reverse-engineer search volume, craft high-contrast screenshot carousels that merchants understand in under 3 seconds, and conduct rigorous copy tests to push your app into the top 3 organic spots.',
      stats: [
        { label: 'Avg Organic Rank Lift', value: 'Top 3 Search Rank', sub: 'Ranked in 14-21 days' },
        { label: 'Listing CRO Increase', value: '+48% CVR', sub: 'PDP visit-to-install' },
        { label: 'Search Impression Growth', value: '3.4x Lift', sub: 'Exact merchant intent queries' },
      ],
      modules: [
        {
          title: 'Shopify Title & Subtitle Algorithmic Saturation',
          desc: 'High-intent merchant keyword placement across title, subtitle, app details, and search tags tailored to Shopify search ranking factors.',
          deliverables: ['Shopify competitor keyword gap matrix', 'Character-optimized title & subtitle permutations', 'Backend search tag indexation'],
        },
        {
          title: 'High-Contrast Polaris Screenshot Carousels',
          desc: 'High-contrast screenshot carousels and demo video embeds highlighting merchant business outcomes (e.g. +18% AOV) rather than software settings.',
          deliverables: ['6x High-res 1200x800 screenshot pack', '1-Second benefit callout banners', 'Shopify Admin UI device frame mockups'],
        },
        {
          title: 'Shopify PDP A/B Copy Optimization',
          desc: 'Structured testing framework to isolate listing variant performance, measuring organic impressions against merchant install cohorts.',
          deliverables: ['Variant A/B copy matrix', 'Pricing tier positioning audit', 'Monthly winner deployment'],
        },
      ],
    },
    'co-marketing': {
      id: 'co-marketing',
      title: 'Built for Shopify & Polaris 12+ UX Acceleration',
      category: 'Shopify Ecosystem Quality & Certification',
      badge: 'Core Service 02',
      tagline: 'Achieve The Coveted "Built for Shopify" Badge & Editorial Placement',
      icon: <ShieldCheck className="w-6 h-6 text-white" />,
      accentColor: '#FFFFFF',
      description:
        'The Built for Shopify badge is the single most powerful organic growth catalyst on the platform, unlocking editorial spotlighting, higher algorithmic search weighting, and merchant trust. We audit your embedded admin UX against Polaris 12+ guidelines, benchmark performance under Theme App Extension sandboxes, and guide you through certification.',
      stats: [
        { label: 'Install Velocity Boost', value: '+45% Installs', sub: 'Post Built for Shopify badge' },
        { label: 'Time-To-Value Reduction', value: '< 2.5 Minutes', sub: 'From install to first activation' },
        { label: 'Editorial Spotlights', value: 'Staff Picks', sub: 'Featured app collection inclusion' },
      ],
      modules: [
        {
          title: 'Polaris 12+ Embedded Admin UX Audit',
          desc: 'Comprehensive review of your embedded app admin to ensure compliance with Shopify design tokens, navigation, and native feel.',
          deliverables: ['Polaris compliance gap report', 'Native component replacement recommendations', 'App Bridge 4.0 modernization check'],
        },
        {
          title: 'Theme App Extension 2.0 & Performance Benchmarks',
          desc: 'Ensure your app introduces zero theme lag and seamlessly injects blocks via Shopify theme extensions.',
          deliverables: ['Theme speed impact audit', 'GraphQL query optimization plan', 'Theme app extension block templates'],
        },
        {
          title: 'Built for Shopify Submission & Fast-Track',
          desc: 'Direct assistance preparing and submitting your app for official Shopify editorial review and badge approval.',
          deliverables: ['Prerequisite checklist verification', 'Editorial appeal messaging', 'Badge unlock celebration campaign'],
        },
      ],
    },
    'performance': {
      id: 'performance',
      title: 'Shopify App Search Ads & Retargeting',
      category: 'Paid Merchant Acquisition & Search Dominance',
      badge: 'Core Service 03',
      tagline: 'High-ROI Sponsored Search Inside The Shopify App Directory',
      icon: <Target className="w-6 h-6 text-[#00a877]" />,
      accentColor: '#008060',
      description:
        'Capture active Shopify merchants searching for competitors right inside the app directory. We build and manage high-intent sponsored search ad campaigns, negative-match unprofitable search terms, and drive merchant installs at sub-$28 CPAs.',
      stats: [
        { label: 'Sponsored Search ROAS', value: '4.8x ROAS', sub: 'High-intent merchant queries' },
        { label: 'CPA vs Generic Google Ads', value: '-42% Lower CPA', sub: 'Targeted directly to merchants' },
        { label: 'Competitor Term Win Rate', value: '68% Win Rate', sub: 'Conquesting high-volume keywords' },
      ],
      modules: [
        {
          title: 'High-Intent Search Keyword Bidding',
          desc: 'Bid on specific merchant search phrases while locking down exact negative keyword match rules to eliminate wasted ad spend.',
          deliverables: ['Shopify search keyword expansion list', 'Negative keyword suppression tree', 'Automated daypart bidding schedules'],
        },
        {
          title: 'Competitor Conquest Campaigns',
          desc: 'Position your app above legacy category incumbents whenever merchants search for competing app names.',
          deliverables: ['Competitor feature parity matrix', 'Alternative-to ad copy hooks', 'Landing page CRO alignment'],
        },
        {
          title: 'Payback Period & Cohort Analytics',
          desc: 'Measure exact cohort payback periods from initial ad click to paid plan upgrade and monthly recurring revenue.',
          deliverables: ['Ad click-to-install cohort dashboard', 'Plan tier upgrade tracking', 'ROAS attribution model'],
        },
      ],
    },
    'plg-reviews': {
      id: 'plg-reviews',
      title: 'Merchant Review Velocity & PLG Loops',
      category: 'Product-Led Growth & Churn Elimination',
      badge: 'Core Service 04',
      tagline: 'Turn 5-Star Merchant Reviews Into An Algorithmic Flywheel',
      icon: <Zap className="w-6 h-6 text-[#00a877]" />,
      accentColor: '#008060',
      description:
        'The Shopify search algorithm heavily penalizes apps with high 24-hour merchant uninstall rates while disproportionately elevating apps with consistent 5-star review velocity. We engineer in-app milestone triggers that prompt reviews only after merchants experience their first measurable ROI win.',
      stats: [
        { label: '5-Star Review Velocity', value: '4.2x Faster', sub: 'Verified milestone prompts' },
        { label: 'Day-1 Retention Lift', value: '+34% Retention', sub: 'Eliminating setup friction' },
        { label: 'Review Sentiment Score', value: '4.9 ★ Rating', sub: 'Across 150+ merchant reviews' },
      ],
      modules: [
        {
          title: 'Value-Milestone Review Loops',
          desc: 'Trigger review dialogs inside your app strictly when the merchant processes their first order or generates measurable revenue.',
          deliverables: ['In-app milestone trigger SDK hooks', 'Sentiment pre-qualification filter', 'Developer response templates for 4★ feedback'],
        },
        {
          title: 'Day-1 Onboarding UX Friction Elimination',
          desc: 'Eliminate setup drop-offs that cause immediate merchant uninstalls using native Polaris 3-step setup guides.',
          deliverables: ['Onboarding drop-off funnel audit', 'Native Polaris setup card components', 'Auto-configuration defaults'],
        },
        {
          title: 'Automated Merchant Re-Engagement Flows',
          desc: 'Trigger automated notification emails if a merchant installs but fails to complete theme extension activation within 48 hours.',
          deliverables: ['Dormant merchant activation drips', 'Theme App Extension setup guides', 'Uninstall prevention survey flows'],
        },
      ],
    },
  };

  const current = pillarsData[activePillar];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-16 text-white">
      {/* Pillar Tabs Bar - High Contrast Shopify Theme */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 overflow-x-auto gap-2">
        {(
          [
            'aso',
            'co-marketing',
            'performance',
            'plg-reviews',
          ] as Array<'aso' | 'co-marketing' | 'performance' | 'plg-reviews'>
        ).map((key) => {
          const p = pillarsData[key];
          const isActive = activePillar === key;
          return (
            <button
              key={key}
              onClick={() => setActivePillar(key)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 border cursor-pointer ${
                isActive
                  ? 'bg-white text-black border-white shadow-lg'
                  : 'bg-transparent text-slate-400 border-transparent hover:text-white hover:bg-white/10'
              }`}
            >
              {p.icon}
              <span>{p.title.split(' ')[0]} {p.title.split(' ')[1]}</span>
            </button>
          );
        })}
      </div>

      {/* Active Pillar Showcase Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#008060]/20 text-[#00a877] text-xs font-mono font-bold border border-[#008060]/30">
            {current.badge} • {current.category}
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
            {current.title}
          </h1>

          <p className="text-lg text-white font-medium">
            {current.tagline}
          </p>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {current.description}
          </p>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenAudit()}
              className="px-6 py-3.5 rounded-2xl bg-[#008060] hover:bg-[#009973] text-white font-bold text-xs transition-all flex items-center gap-2 shadow-lg shadow-[#008060]/30 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Audit Your Shopify Listing (Free)</span>
            </button>

            <button
              onClick={() => onOpenBooking(`Shopify Sprint: ${current.title}`)}
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Book Growth Sprint Teardown</span>
              <ArrowRight className="w-4 h-4 text-[#00a877]" />
            </button>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="lg:col-span-5 grid grid-cols-1 gap-4">
          {current.stats.map((stat, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-[#0A0E17] border border-white/15 space-y-1 shadow-lg"
            >
              <div className="text-xs font-mono text-slate-400">{stat.label}</div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-[#00a877]">
                {stat.value}
              </div>
              <div className="text-xs text-slate-300">{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 3 Detailed Execution Modules */}
      <div className="space-y-6">
        <div className="border-b border-white/10 pb-4">
          <h3 className="text-xl font-bold font-heading text-white">
            What We Deliver In This Sprint
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Proven execution frameworks delivered within a structured 30-day turnaround.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {current.modules.map((mod, i) => (
            <div
              key={i}
              className="p-6 rounded-3xl bg-[#0A0E17] border border-white/15 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <span className="w-7 h-7 rounded-xl bg-white/10 text-white font-mono font-bold text-xs flex items-center justify-center border border-white/20">
                  0{i + 1}
                </span>
                <h4 className="text-base font-bold text-white">{mod.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{mod.desc}</p>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-2">
                <div className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">
                  Deliverables
                </div>
                <ul className="space-y-1.5 text-xs text-slate-200">
                  {mod.deliverables.map((d, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00a877] shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Culturisk Algorithm Command Center */}
      <div className="space-y-4 pt-4">
        <VideoMasterclassPlayer />
      </div>

      {/* Audit Conversion Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#008060]/20 via-[#0A0E17] to-[#00E5FF]/10 border border-[#008060]/30 p-8 sm:p-10 text-center space-y-6 shadow-2xl">
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#008060]/20 text-[#00a877] text-xs font-mono font-bold border border-[#008060]/30">
            <Sparkles className="w-3.5 h-3.5" />
            FREE SHOPIFY LISTING DIAGNOSTIC
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold font-heading text-white">
            Audit Your Shopify App Listing Now
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Execute a live algorithmic diagnostic against 22 official ranking criteria and get an actionable 30-day roadmap.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('landing')}
            className="px-6 py-3 rounded-2xl bg-[#008060] hover:bg-[#009973] text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-xl shadow-[#008060]/30 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>Start Free 22-Rule Audit</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onOpenBooking(`Shopify ${current.title} Sprint`)}
            className="px-6 py-3 rounded-2xl bg-[#121826] hover:bg-white/10 text-white font-bold text-xs sm:text-sm border border-white/15 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Book 30-Min Strategy Call</span>
            <ArrowRight className="w-4 h-4 text-[#00a877]" />
          </button>
        </div>
      </div>
    </div>
  );
};
