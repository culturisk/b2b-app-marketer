import React, { useState } from 'react';
import { ViewType } from '../types';
import {
  TrendingUp,
  ShieldCheck,
  Target,
  Zap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight,
  Activity,
  Calculator,
  Calendar,
} from 'lucide-react';
import { VideoMasterclassPlayer } from '../components/VideoMasterclassPlayer';

interface ServicesViewProps {
  onNavigate: (view: ViewType) => void;
  onOpenBooking: (service?: string) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({
  onNavigate,
  onOpenBooking,
}) => {
  const [selectedServiceId, setSelectedServiceId] = useState<string>('aso');

  const services = [
    {
      id: 'aso',
      navKey: 'platform-aso' as ViewType,
      pillarNumber: '01',
      title: 'Shopify App ASO & Listing CRO',
      category: 'Organic Search Algorithm Optimization',
      tagline: 'Rank in the Top 3 Search Positions & Double PDP-to-Install Conversion',
      icon: <TrendingUp className="w-5 h-5 text-[#00a877]" />,
      summary:
        'The Shopify App algorithm places 3.2x higher semantic weight on Title (≤30 chars) and Subtitle (≤62 chars) than description text. We optimize high-intent keyword density, engineer high-contrast screenshot carousels that merchants comprehend in 3 seconds, and run A/B copy tests to lock in category dominance.',
      stats: [
        { label: 'Organic Search Rank', value: 'Top 3 Placement', sub: 'Indexed in 14-21 days' },
        { label: 'PDP Conversion Rate', value: '+48% CVR', sub: 'Listing visit-to-install' },
        { label: 'Merchant Query Volume', value: '3.4x Lift', sub: 'Exact search match rate' },
      ],
      deliverables: [
        'Shopify Title (≤30) & Subtitle (≤62) algorithmic keyword matrix',
        '6x High-Contrast 1200x800 screenshot carousel redesign',
        'Competitor search volume & keyword ranking gap audit',
        'Monthly A/B copy and search tag performance report',
      ],
    },
    {
      id: 'built-for-shopify',
      navKey: 'platform-co-marketing' as ViewType,
      pillarNumber: '02',
      title: 'Built for Shopify & Polaris 12+ UX Acceleration',
      category: 'Ecosystem Quality & Badging Certification',
      tagline: 'Attain The Built for Shopify Badge & Exclusive Editorial Spotlights',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      summary:
        'The Built for Shopify badge is the highest trust and organic discovery multiplier in the ecosystem. We audit your embedded admin UX against Polaris 12+ design tokens, optimize App Bridge 4.0 performance, verify Theme App Extensions, and eliminate day-1 merchant drop-off.',
      stats: [
        { label: 'Install Velocity Boost', value: '+45% Growth', sub: 'Post-badging momentum' },
        { label: 'Time-to-Value', value: '< 2.5 Minutes', sub: 'Install to first workflow' },
        { label: 'Editorial Inclusions', value: 'Staff Picks', sub: 'Category carousel spotlights' },
      ],
      deliverables: [
        'Polaris 12+ component token compliance review',
        'App Bridge 4.0 session & navigation latency audit',
        'Theme App Extension 2.0 zero-lag theme benchmarking',
        'Step-by-step submission roadmap for Built for Shopify',
      ],
    },
    {
      id: 'search-ads',
      navKey: 'platform-performance' as ViewType,
      pillarNumber: '03',
      title: 'Shopify App Search Ads & Retargeting',
      category: 'Paid Search & Competitor Conquesting',
      tagline: 'High-Intent Merchant Acquisition with Guaranteed Payback Velocity',
      icon: <Target className="w-5 h-5 text-[#00E5FF]" />,
      summary:
        'Capture active merchants at the exact moment they search for your competitors. We structure negative keyword lists, calibrate cost-per-install (CPI) bidding algorithms, and construct merchant payback models to ensure profitable customer acquisition cost (CAC).',
      stats: [
        { label: 'Avg Install Cost', value: '$18 - $34 CPI', sub: 'Category dependent CAC' },
        { label: 'Paid-to-Paid Payback', value: '< 60 Days', sub: 'Subscription LTV alignment' },
        { label: 'Ad Impression Share', value: '85%+ Top Spot', sub: 'Defending brand keywords' },
      ],
      deliverables: [
        'Exact & broad match Shopify search bid architecture',
        'Competitor keyword conquesting & brand defense campaigns',
        'Day-parting & negative keyword waste prevention lists',
        'Weekly CPI, CPA, and blended ROAS reporting dashboard',
      ],
    },
    {
      id: 'plg-reviews',
      navKey: 'platform-plg-reviews' as ViewType,
      pillarNumber: '04',
      title: 'Merchant Review Velocity & In-App PLG Loops',
      category: 'Product-Led Growth & Retention Flywheels',
      tagline: 'Accelerate Verified 5-Star Reviews & Suppress 24-Hour Merchant Churn',
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      summary:
        'The Shopify ranking algorithm heavily depresses listings with high 24-hour uninstall rates. We build milestone-based review prompt triggers, frictionless onboarding flows, and automated customer success interventions that turn newly installed merchants into vocal brand advocates.',
      stats: [
        { label: 'Review Velocity', value: '+12 Reviews/mo', sub: 'Verified 5-star ratings' },
        { label: '24-Hour Churn', value: '< 3.8% Ceiling', sub: 'Safely below algo penalty' },
        { label: 'Merchant Referral Rate', value: '22% PLG Loop', sub: 'Word-of-mouth installs' },
      ],
      deliverables: [
        'Value-milestone review prompt triggers (timed post-first-success)',
        'Frictionless onboarding checklist & interactive guided setup',
        'Pre-uninstall sentiment capture & live rescue chat webhooks',
        'Merchant testimonial syndication across PDP and screenshot assets',
      ],
    },
  ];

  const currentService =
    services.find((s) => s.id === selectedServiceId) || services[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 text-white">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121826] border border-white/15 text-xs font-semibold text-slate-200 shadow-md">
          <span className="flex h-2 w-2 rounded-full bg-[#00a877] animate-ping" />
          <span className="text-[#00a877] font-mono font-bold">SHOPIFY SPECIALIST</span>
          <span className="text-slate-500">•</span>
          <span>4 Specialized Growth Engines</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
          Shopify App <br className="hidden sm:inline" />
          Ecosystem Services
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Full-stack growth architectures engineered exclusively for Shopify app developers. We systematically optimize organic search ranking algorithms, Polaris 12+ UX tokens, screenshot conversion rates, and merchant lifecycle retention.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('landing')}
            className="px-6 py-3 rounded-2xl bg-[#008060] hover:bg-[#009973] text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-xl shadow-[#008060]/30 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>Audit Your Shopify Listing (Free)</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onOpenBooking('Shopify Growth Architecture Sprint')}
            className="px-6 py-3 rounded-2xl bg-[#121826] hover:bg-white/10 text-white font-bold text-xs sm:text-sm border border-white/15 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-[#00a877]" />
            <span>Book 30-Min Strategy Call</span>
          </button>
        </div>
      </div>

      {/* 4 Core Shopify Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Services Selector Tabs */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-[11px] uppercase tracking-widest text-slate-400 font-mono font-bold px-2">
            Select a Shopify Growth Engine:
          </div>

          {services.map((service) => {
            const isSelected = service.id === selectedServiceId;
            return (
              <button
                key={service.id}
                onClick={() => setSelectedServiceId(service.id)}
                className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex items-center justify-between group cursor-pointer ${
                  isSelected
                    ? 'bg-[#0A0E17] border-[#008060] text-white shadow-xl shadow-[#008060]/15'
                    : 'bg-[#0A0E17]/40 border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-[#008060] text-white shadow-md'
                        : 'bg-white/5 text-slate-400 group-hover:text-white'
                    }`}
                  >
                    {service.icon}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        Pillar {service.pillarNumber}
                      </span>
                    </div>
                    <div
                      className={`text-sm font-bold leading-snug ${
                        isSelected ? 'text-white' : 'text-slate-300'
                      }`}
                    >
                      {service.title}
                    </div>
                  </div>
                </div>

                <ChevronRight
                  className={`w-4 h-4 transition-transform ${
                    isSelected ? 'text-[#00a877] translate-x-1' : 'text-slate-600'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Right Side: Selected Service Deep Dive Card */}
        <div className="lg:col-span-7 bg-[#0A0E17] border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-5">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#00a877] font-bold">
                {currentService.category}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-white mt-1">
                {currentService.title}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{currentService.tagline}</p>
            </div>

            <button
              onClick={() => onNavigate(currentService.navKey)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1.5 transition-all self-start sm:self-center border border-white/10 cursor-pointer"
            >
              <span>Full View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {currentService.summary}
          </p>

          {/* 3 Metric Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {currentService.stats.map((stat, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-[#121826] border border-white/10 space-y-1"
              >
                <div className="text-[10px] font-mono text-slate-400">{stat.label}</div>
                <div className="text-lg sm:text-xl font-bold font-mono text-[#00a877]">
                  {stat.value}
                </div>
                <div className="text-[10px] text-slate-300">{stat.sub}</div>
              </div>
            ))}
          </div>

          {/* Key Deliverables */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
              Key Deliverables In This Sprint
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentService.deliverables.map((d, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 text-xs text-slate-200 bg-[#121826]/60 p-3 rounded-xl border border-white/5"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#00a877] shrink-0 mt-0.5" />
                  <span>{d}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => onNavigate('landing')}
              className="text-xs text-[#00a877] hover:underline font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Audit Your App Against This Framework</span>
            </button>

            <button
              onClick={() => onOpenBooking(currentService.title)}
              className="px-5 py-2.5 rounded-xl bg-[#008060] hover:bg-[#009973] text-white text-xs font-bold transition-all shadow-lg shadow-[#008060]/20 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Deploy This Sprint</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Integrated Live Culturisk Algorithm Command Center */}
      <div className="space-y-4">
        <VideoMasterclassPlayer />
      </div>

      {/* Conversion Banner: Launch the 4-Step Listing Audit */}
      <div className="rounded-3xl bg-gradient-to-r from-[#008060]/20 via-[#0A0E17] to-[#00E5FF]/10 border border-[#008060]/30 p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#008060]/20 text-[#00a877] text-xs font-mono font-bold border border-[#008060]/30">
            <Sparkles className="w-3.5 h-3.5" />
            LIVE SHOPIFY LISTING DIAGNOSTIC
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-white">
            Ready to See Where Your Shopify App Ranks?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Run a free algorithmic diagnostic against 22 official ranking criteria, Polaris 12+ design tokens, and screenshot conversion benchmarks in under 15 seconds.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('landing')}
            className="px-8 py-3.5 rounded-2xl bg-[#008060] hover:bg-[#009973] text-white font-bold text-sm transition-all flex items-center gap-2 shadow-xl shadow-[#008060]/30 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>Run Free 22-Rule Listing Audit</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('roi')}
            className="px-6 py-3.5 rounded-2xl bg-[#121826] hover:bg-white/10 text-white font-bold text-sm border border-white/15 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Calculator className="w-4 h-4 text-emerald-400" />
            <span>Calculate Projected ROI</span>
          </button>
        </div>
      </div>
    </div>
  );
};
