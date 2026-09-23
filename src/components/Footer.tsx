import React, { useState } from 'react';
import { ViewType } from '../types';
import { Sparkles, ArrowRight, Clock, ShieldCheck, Mail, CheckCircle2, Database } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: ViewType) => void;
  onOpenBooking: (service?: string) => void;
  onOpenWaitlist?: (ecosystem?: string, initialEmail?: string) => void;
  onOpenSubmissions?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenBooking,
  onOpenWaitlist,
  onOpenSubmissions,
}) => {
  const [inlineEmail, setInlineEmail] = useState('');
  const [submittedInline, setSubmittedInline] = useState(false);

  const comingSoonEcosystems = [
    { name: 'Salesforce AppExchange', status: 'Private Beta' },
    { name: 'HubSpot App Marketplace', status: 'Waitlist' },
    { name: 'Atlassian Marketplace', status: 'Waitlist' },
    { name: 'AWS Marketplace', status: 'In Development' },
    { name: 'Chrome Web Extension Directory', status: 'Private Beta' },
    { name: 'Slack App Directory', status: 'Waitlist' },
    { name: 'Stripe App Marketplace', status: 'Waitlist' },
    { name: 'Zendesk Apps', status: 'Waitlist' },
    { name: 'Zoom App Marketplace', status: 'Waitlist' },
    { name: 'Microsoft AppSource', status: 'Waitlist' },
  ];

  const handleInlineWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onOpenWaitlist) {
      onOpenWaitlist(undefined, inlineEmail);
    }
  };

  return (
    <footer className="bg-[#05070D] border-t border-white/10 pt-16 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand & Bio */}
          <div className="md:col-span-2 space-y-4">
            <div
              id="footer-brand-logo"
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-[#008060] flex items-center justify-center shadow-lg shadow-[#008060]/30 group-hover:scale-105 transition-transform">
                <div className="w-3.5 h-3.5 border-2 border-white rounded-sm transform rotate-45 bg-white" />
              </div>
              <span className="font-heading font-extrabold text-lg text-white">
                B2B App Marketer<span className="text-[#00a877]">.com</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-300 max-w-sm">
              The premier growth agency and algorithm intelligence engine for B2B and Shopify App developers. We transform B2B software marketplaces into your highest-converting merchant and customer acquisition channels.
            </p>
            <div className="flex items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#008060]/20 text-[#00a877] border border-[#008060]/40 font-mono text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00a877] animate-pulse" />
                Specialized in B2B & Shopify App Growth
              </span>
            </div>
          </div>

          {/* Col 2: Growth Services */}
          <div className="space-y-3">
            <div className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">
              Shopify Services
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('platform-aso')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Shopify App ASO & CRO
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('platform-co-marketing')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Built for Shopify & Polaris 12+
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('platform-performance')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Shopify App Search Ads
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('platform-plg-reviews')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Merchant Review Velocity & PLG
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-[#00a877] transition-colors text-left font-semibold cursor-pointer"
                >
                  View All Growth Sprints →
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Diagnostics & Tools */}
          <div className="space-y-3">
            <div className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">
              Free Developer Tools
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('audit')}
                  className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer font-bold text-white"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#00a877]" />
                  <span>Free Shopify ASO Audit</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('roi-calculator')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Shopify App ROI Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('preview-studio')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Shopify PDP Screenshot Preview Studio
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('sequence-generator')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Merchant Lifecycle Sequence Builder
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenSubmissions && onOpenSubmissions()}
                  className="hover:text-[#00a877] transition-colors flex items-center gap-1.5 cursor-pointer text-slate-300 font-medium"
                >
                  <Database className="w-3.5 h-3.5 text-[#00a877]" />
                  <span>My Form Submissions & Unique IDs</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Retainers & Strategy */}
          <div className="space-y-3">
            <div className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">
              Work With Us
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('pricing')}
                  className="hover:text-white transition-colors cursor-pointer font-semibold text-slate-200"
                >
                  Growth Sprint Pricing
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenBooking('Shopify App Growth Strategy Session')}
                  className="hover:text-[#00a877] transition-colors cursor-pointer text-white font-medium flex items-center gap-1"
                >
                  <span>Book 30-Min Teardown</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </li>
              <li>
                <span className="text-[11px] text-slate-400 block pt-1">
                  Average client outcome: +42% installs, &lt;3 min TTV, and official Built for Shopify certification.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* COMING SOON: ALL OTHER ECOSYSTEMS SECTION (Unique Multi-Ecosystem Waitlist Form) */}
        <div
          id="multi-ecosystem-waitlist-section"
          className="bg-black/60 border border-amber-500/20 rounded-2xl p-6 sm:p-7 space-y-6 shadow-xl relative overflow-hidden"
        >
          {/* Subtle amber ambient glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <h4 className="text-base font-bold font-heading text-white">
                  Other App Ecosystems — Coming Soon
                </h4>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30 text-[10px] font-mono font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  Waitlist Open
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Phase 2 Expansion
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                While our primary active diagnostic suite is optimized for the <strong className="text-white">Shopify App Marketplace</strong>, we are actively onboarding B2B SaaS developers into our private multi-ecosystem waitlist. Join to receive early ASO audit blueprints, listing CRO templates, and native developer frameworks when these marketplaces unlock.
              </p>
            </div>

            <button
              id="footer-open-waitlist-btn"
              onClick={() => onOpenWaitlist && onOpenWaitlist()}
              className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all whitespace-nowrap cursor-pointer self-start lg:self-auto flex items-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Join Multi-Ecosystem Waitlist</span>
            </button>
          </div>

          {/* Quick Inline Waitlist Signup Form */}
          <form
            id="footer-inline-waitlist-form"
            onSubmit={handleInlineWaitlistSubmit}
            className="p-4 rounded-xl bg-[#090B10]/90 border border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
          >
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                placeholder="Enter work email (e.g. founder@company.com)..."
                value={inlineEmail}
                onChange={(e) => setInlineEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 hover:border-amber-400/50 transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <span>Get Early Access</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </form>

          {/* Coming Soon Ecosystems Grid */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-300">
                Click any marketplace below to request early priority access:
              </span>
              <span className="text-[11px] text-amber-400/90 font-mono hidden sm:inline">
                Founding Member Perks Included
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 pt-1">
              {comingSoonEcosystems.map((eco) => (
                <div
                  key={eco.name}
                  onClick={() => onOpenWaitlist && onOpenWaitlist(eco.name, inlineEmail)}
                  className="px-3 py-2.5 rounded-xl bg-[#0F1420] border border-white/5 hover:border-amber-400/40 hover:bg-[#151C2C] flex items-center justify-between text-xs cursor-pointer transition-all group"
                  title={`Click to join waitlist for ${eco.name}`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400/50 group-hover:bg-amber-400 transition-colors shrink-0" />
                    <span className="text-slate-300 group-hover:text-white font-medium truncate">
                      {eco.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400/80 group-hover:text-amber-300 ml-1.5 shrink-0 flex items-center gap-1">
                    {eco.status}
                    <ArrowRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} Culturisk • B2B App Marketer. Dedicated to B2B SaaS, Shopify App optimization, Polaris UX, and multi-ecosystem growth acceleration.
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px] text-slate-300">
            <span>Polaris 12+</span>
            <span>•</span>
            <span>B2B Multi-Ecosystem</span>
            <span>•</span>
            <span>App Marketplace ASO</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
