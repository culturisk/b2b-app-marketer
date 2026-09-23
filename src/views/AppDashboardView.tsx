import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Building2,
  LifeBuoy,
  Database,
  Radio,
  Sparkles,
  ChevronDown,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { DashboardRole } from '../types';
import { MarketingRoleView } from '../components/dashboard/MarketingRoleView';
import { SalesRoleView } from '../components/dashboard/SalesRoleView';
import { SupportRoleView } from '../components/dashboard/SupportRoleView';
import { PartnerConnectModal } from '../components/dashboard/PartnerConnectModal';

interface AppDashboardViewProps {
  onOpenBooking: (service?: string) => void;
  onNavigate?: (view: any) => void;
}

export const AppDashboardView: React.FC<AppDashboardViewProps> = ({
  onOpenBooking,
  onNavigate,
}) => {
  const [activeRole, setActiveRole] = useState<DashboardRole>('marketing');
  const [selectedApp, setSelectedApp] = useState('CartBoost Pro');
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Breadcrumb & Live App Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#008060]/10 border border-[#008060]/30 text-[#00a877]">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold font-heading text-white tracking-tight">
                Shopify App Growth Workspace
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-[#008060]/20 text-[#00a877] text-[10px] font-mono font-bold border border-[#008060]/30">
                Partner Sync Active
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Cross-functional growth, revenue, and merchant intelligence inspired by Mantle, built for Shopify App teams.
            </p>
          </div>
        </div>

        {/* Live App Selector & Connect Button */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={selectedApp}
              onChange={(e) => setSelectedApp(e.target.value)}
              className="appearance-none bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 pr-8 text-xs font-semibold text-white focus:outline-none focus:border-[#00a877] cursor-pointer"
            >
              <option value="CartBoost Pro">CartBoost Pro (Active)</option>
              <option value="ReviewPulse 2.0">ReviewPulse 2.0 (Staging)</option>
              <option value="ShippingBar Native">ShippingBar Native (Dev)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            onClick={() => setIsConnectModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 hover:border-zinc-700 text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-[#00a877]" />
            <span className="hidden sm:inline">Partner GraphQL API</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>
        </div>
      </div>

      {/* Role Switcher Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex bg-zinc-900/90 border border-zinc-800 rounded-2xl p-1.5 gap-1.5 shadow-inner">
          {/* Marketing Tab */}
          <button
            id="tab-marketing-role"
            onClick={() => setActiveRole('marketing')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeRole === 'marketing'
                ? 'bg-[#008060] text-white shadow-[0_0_15px_rgba(0,128,96,0.3)]'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Marketing & ASO</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-black/30">
              3.96% CVR
            </span>
          </button>

          {/* Sales / BD Tab */}
          <button
            id="tab-sales-role"
            onClick={() => setActiveRole('sales')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeRole === 'sales'
                ? 'bg-[#008060] text-white shadow-[0_0_15px_rgba(0,128,96,0.3)]'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Sales & Enterprise BD</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-black/30">
              5 Alerts
            </span>
          </button>

          {/* Support / CS Tab */}
          <button
            id="tab-support-role"
            onClick={() => setActiveRole('support')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeRole === 'support'
                ? 'bg-[#008060] text-white shadow-[0_0_15px_rgba(0,128,96,0.3)]'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            <LifeBuoy className="w-4 h-4" />
            <span>Support & CS</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-black/30">
              86.4 Health
            </span>
          </button>
        </div>

        {/* Growth Strategy Consultation CTA */}
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span>Need custom analytics instrumentation?</span>
          <button
            onClick={() => onOpenBooking('Analytics & Full-Funnel Instrumentation')}
            className="text-[#00a877] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            Book Architect Review <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Dynamic Role Views */}
      <div className="min-h-[500px]">
        {activeRole === 'marketing' && (
          <MarketingRoleView onOpenBooking={onOpenBooking} />
        )}
        {activeRole === 'sales' && (
          <SalesRoleView onOpenBooking={onOpenBooking} />
        )}
        {activeRole === 'support' && (
          <SupportRoleView onOpenBooking={onOpenBooking} />
        )}
      </div>

      {/* Partner Connect Modal */}
      <PartnerConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
      />
    </div>
  );
};
