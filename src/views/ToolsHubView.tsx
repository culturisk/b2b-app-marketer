import React from 'react';
import { ViewType } from '../types';
import {
  Wrench,
  ShieldCheck,
  Calculator,
  Eye,
  FileText,
  Sparkles,
  ArrowRight,
  Zap,
  TrendingUp,
  Layers,
  BarChart3,
} from 'lucide-react';

interface ToolsHubViewProps {
  onNavigate: (view: ViewType) => void;
  onOpenBooking: (service?: string) => void;
}

export const ToolsHubView: React.FC<ToolsHubViewProps> = ({
  onNavigate,
  onOpenBooking,
}) => {
  const tools = [
    {
      id: 'app-dashboard' as ViewType,
      title: 'Shopify App Growth & Analytics Workspace',
      subtitle: 'Mantle-Inspired Role Intelligence',
      desc: 'Cross-functional workspace for Marketing (funnel & keyword ROAS), Sales BD (Plus lead detection & quota upsells), and Support CS (Polaris reply assistant & merchant health).',
      icon: <BarChart3 className="w-6 h-6 text-[#00a877]" />,
      badge: 'Full Suite • AI + Recharts',
      metric: '3 Role Views • Partner GraphQL Sync',
      cta: 'Open Growth Workspace',
    },
    {
      id: 'audit' as ViewType,
      title: 'Interactive UX & Listing Audit Scorecard',
      subtitle: 'Powered by Gemini AI',
      desc: 'Diagnose your 12-point Polaris compliance, onboarding friction, ASO ranking gaps, and retention loops.',
      icon: <ShieldCheck className="w-6 h-6 text-[#00a877]" />,
      badge: 'Gemini 3.7 Flash',
      metric: '12-Point Checklist',
      cta: 'Launch Audit Tool',
    },
    {
      id: 'roi-calculator' as ViewType,
      title: 'ROI & Churn Impact Financial Simulator',
      subtitle: 'Recharts Cohort Model',
      desc: 'Simulate how +35% onboarding activation and -35% churn reduction compound your Monthly Recurring Revenue.',
      icon: <Calculator className="w-6 h-6 text-blue-400" />,
      badge: 'Financial Forecaster',
      metric: 'Real-Time Recharts',
      cta: 'Open Calculator',
    },
    {
      id: 'preview-studio' as ViewType,
      title: 'Shopify PDP & Polaris Admin Preview Studio',
      subtitle: 'Dual-Tab Visual Studio',
      desc: 'Test your App PDP listing layout alongside the authentic Shopify Polaris 12+ Merchant Admin frame.',
      icon: <Eye className="w-6 h-6 text-purple-400" />,
      badge: 'Visual Sandbox',
      metric: 'PDP + Admin Frame',
      cta: 'Open Preview Studio',
    },
    {
      id: 'sequence-generator' as ViewType,
      title: 'Automated Email & Polaris Copy Generator',
      subtitle: 'Powered by Gemini AI',
      desc: 'Instantly generate 3-step merchant onboarding sequences, Polaris admin setup microcopy, and agency pitch emails.',
      icon: <FileText className="w-6 h-6 text-amber-400" />,
      badge: 'Gemini 3.7 Flash',
      metric: '4 Production Formats',
      cta: 'Generate Copy',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#008060]/15 text-[#00a877] text-xs font-semibold uppercase tracking-wider border border-[#008060]/30">
          <Wrench className="w-3.5 h-3.5" />
          Interactive Growth Toolkit
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-heading text-white tracking-tight">
          Shopify App Developer Toolkit
        </h1>
        <p className="text-sm text-zinc-400">
          Free interactive utilities designed specifically for Shopify app founders, product managers, and growth engineers.
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {tools.map((tool) => (
          <div
            key={tool.id}
            id={`tool-card-${tool.id}`}
            onClick={() => onNavigate(tool.id)}
            className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-[#008060]/50 hover:bg-zinc-900/80 transition-all duration-200 cursor-pointer shadow-xl flex flex-col justify-between group space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-[#09090B] border border-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {tool.icon}
                </div>
                <span className="text-[11px] font-mono font-bold text-[#00a877] bg-[#008060]/15 px-3 py-1 rounded-full border border-[#008060]/30">
                  {tool.badge}
                </span>
              </div>

              <div>
                <div className="text-xs font-mono text-zinc-500">
                  {tool.subtitle}
                </div>
                <h2 className="text-xl font-bold font-heading text-white group-hover:text-[#00a877] transition-colors mt-0.5">
                  {tool.title}
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                {tool.desc}
              </p>
            </div>

            <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs">
              <span className="text-zinc-500 font-mono">{tool.metric}</span>
              <div className="flex items-center gap-1.5 font-bold text-[#00a877] group-hover:translate-x-1 transition-transform">
                <span>{tool.cta}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
