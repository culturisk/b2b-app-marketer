import React, { useState } from 'react';
import {
  TrendingUp,
  Sparkles,
  ArrowDownRight,
  Filter,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  Search,
  ExternalLink,
  Target,
  BarChart3,
  Layers,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';
import {
  mockFunnelData,
  mockFunnelTrendData,
  mockKeywordRoasData,
  mockChurnHeatmapData,
} from '../../data/mockAnalyticsData';
import { PdpDoctorResult } from '../../types';

interface MarketingRoleViewProps {
  onOpenBooking: (service?: string) => void;
}

export const MarketingRoleView: React.FC<MarketingRoleViewProps> = ({
  onOpenBooking,
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [keywordSearch, setKeywordSearch] = useState('');
  const [keywordFilter, setKeywordFilter] = useState<'All' | 'Profitable' | 'Breakeven' | 'Optimize'>('All');
  
  // AI PDP Copy Doctor state
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [doctorLoading, setDoctorLoading] = useState(false);
  const [doctorResult, setDoctorResult] = useState<PdpDoctorResult | null>(null);
  const [copiedVariant, setCopiedVariant] = useState<string | null>(null);

  // Filtered Keywords
  const filteredKeywords = mockKeywordRoasData.filter((item) => {
    const matchesSearch =
      item.keyword.toLowerCase().includes(keywordSearch.toLowerCase()) ||
      item.matchType.toLowerCase().includes(keywordSearch.toLowerCase());
    const matchesStatus =
      keywordFilter === 'All' || item.status === keywordFilter;
    return matchesSearch && matchesStatus;
  });

  const totalAdSpend = mockKeywordRoasData.reduce((acc, curr) => acc + curr.spend, 0);
  const totalRevenue = mockKeywordRoasData.reduce((acc, curr) => acc + curr.revenue, 0);
  const aggregateRoas = (totalRevenue / totalAdSpend).toFixed(2);

  const handleRunPdpDoctor = async () => {
    setDoctorLoading(true);
    setIsDoctorModalOpen(true);

    try {
      const res = await fetch('/api/analytics/pdp-doctor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appName: 'CartBoost Pro',
          category: 'Cart Customization & Upsell',
          currentTitle: 'CartBoost - Post Purchase Upsell & Cross Sell',
          currentSubtitle: 'Increase AOV with simple one-click post purchase upsells',
          pdpViews: '48,650',
          installRate: '3.96%',
          paidConversionRate: '22.98%',
        }),
      });

      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      setDoctorResult(data);
    } catch (err) {
      console.error('Error fetching PDP doctor results:', err);
      // Fallback
      setDoctorResult({
        appName: 'CartBoost Pro',
        diagnostics:
          'PDP-to-Install conversion is at 3.96% (healthy benchmark is 4.5%+). A 0.8% bump here yields +$14,200 MRR based on current ad traffic.',
        primaryDropOffReason:
          'Listing headline lacks immediate outcome quantification and does not highlight certified Theme App Extension 0.0ms speed compliance.',
        variations: [
          {
            variantId: 'A',
            strategy: 'Direct Revenue & AOV Lift Angle',
            appTitle: 'CartBoost Pro - 1-Click Cart Upsell & Free Shipping Bar',
            subtitle:
              'Boost Average Order Value by 18-32% with zero developer setup. Native Shopify 2.0 checkout integration.',
            featureBullets: [
              'Instant 1-Click Upsells & Cross-Sells in Cart Drawer',
              'AI Smart Product Recommendations based on cart contents',
              '100% Theme App Extension (0.0ms speed impact)',
            ],
            primaryCta: 'Add App (Free 14-Day Trial)',
            predictedLift: '+24% PDP-to-Install Lift',
            rationale:
              'Quantifiable metric removes hesitation for high-volume Shopify Plus merchants.',
          },
          {
            variantId: 'B',
            strategy: 'Shopify 2.0 Native Immersion & Trust Angle',
            appTitle: 'CartBoost | Built for Shopify Cart & Checkout',
            subtitle:
              'The fastest way to increase checkout conversion without intrusive popups. Fully customizable in Theme Editor.',
            featureBullets: [
              'Certified Built for Shopify standard & native Polaris design',
              'Dynamic Free Shipping & Tiered Discount progress bars',
              'Multi-currency & multi-language localization out of the box',
            ],
            primaryCta: 'Install App (14 Days Free)',
            predictedLift: '+18% PDP-to-Install Lift',
            rationale:
              'Appeals directly to brand-conscious merchants afraid of degrading user experience.',
          },
          {
            variantId: 'C',
            strategy: 'Social Proof & Competitor Contrast Angle',
            appTitle: 'CartBoost • The Smart Upsell Engine',
            subtitle:
              'Trusted by 2,500+ top DTC brands to generate $4.2M+ in extra revenue without slowing down page speed.',
            featureBullets: [
              'Non-intrusive post-purchase offers proven to convert 3.4x higher',
              'Automated A/B testing for triggers, discounts, and offer layouts',
              'Dedicated 24/7 Shopify developer Slack & email support',
            ],
            primaryCta: 'Try Risk-Free for 14 Days',
            predictedLift: '+21% PDP-to-Install Lift',
            rationale:
              'Anchors confidence with social proof while guaranteeing zero theme bloat.',
          },
        ],
        recommendations: [
          'Replace generic screenshot 1 with an annotated Before vs. After revenue graph.',
          'Feature the "Built for Shopify" badge above the fold.',
          'Add a 30-second loom GIF of 1-click theme customizer toggle in listing media.',
        ],
      });
    } finally {
      setDoctorLoading(false);
    }
  };

  const handleCopyVariant = (variant: any) => {
    const textToCopy = `Title: ${variant.appTitle}\nSubtitle: ${variant.subtitle}\nCTA: ${variant.primaryCta}\nFeatures:\n- ${variant.featureBullets.join('\n- ')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedVariant(variant.variantId);
    setTimeout(() => setCopiedVariant(null), 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner with AI PDP Doctor CTA */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-zinc-900/90 via-zinc-900/60 to-[#008060]/10 border border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#008060]/20 text-[#00a877] text-xs font-semibold border border-[#008060]/30 font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            Marketing & ASO Intelligence
          </div>
          <h2 className="text-xl font-bold font-heading text-white tracking-tight">
            Full-Funnel PDP Attribution & Search Ads ROAS
          </h2>
          <p className="text-xs text-zinc-400 max-w-2xl">
            Track exact drop-offs across your Shopify App listing, evaluate keyword-level ad spend profitability, and optimize copy with Google AI Studio.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time range selector */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1 text-xs">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  timeRange === range
                    ? 'bg-[#008060] text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            id="btn-ai-pdp-doctor"
            onClick={handleRunPdpDoctor}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#008060] hover:bg-[#00a877] transition-all shadow-[0_0_20px_rgba(0,128,96,0.3)] flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>AI PDP Copy Doctor</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <div className="text-[11px] text-zinc-400 font-medium">PDP Views (Last 30D)</div>
          <div className="text-2xl font-bold font-heading text-white mt-1">48,650</div>
          <div className="text-[11px] text-[#00a877] flex items-center gap-1 mt-1 font-medium">
            <TrendingUp className="w-3 h-3" />
            +14.2% vs previous period
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <div className="text-[11px] text-zinc-400 font-medium">PDP to Install Rate</div>
          <div className="text-2xl font-bold font-heading text-white mt-1">3.96%</div>
          <div className="text-[11px] text-[#00a877] flex items-center gap-1 mt-1 font-medium">
            <span>Benchmark: 3.20%</span>
            <span className="text-emerald-400 font-bold">(+23.7% above avg)</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <div className="text-[11px] text-zinc-400 font-medium">Blended Shopify Ads ROAS</div>
          <div className="text-2xl font-bold font-heading text-white mt-1">{aggregateRoas}x</div>
          <div className="text-[11px] text-[#00a877] flex items-center gap-1 mt-1 font-medium">
            <span>Spend: ${totalAdSpend.toLocaleString()}</span>
            <span className="text-zinc-400">|</span>
            <span>Rev: ${totalRevenue.toLocaleString()}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <div className="text-[11px] text-zinc-400 font-medium">Trial to Paid Conversion</div>
          <div className="text-2xl font-bold font-heading text-white mt-1">22.98%</div>
          <div className="text-[11px] text-[#00a877] flex items-center gap-1 mt-1 font-medium">
            <CheckCircle2 className="w-3 h-3" />
            319 Active Paid Merchants
          </div>
        </div>
      </div>

      {/* 1. Full-Funnel PDP Attribution Section */}
      <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-zinc-800">
          <div>
            <h3 className="text-base font-bold font-heading text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#00a877]" />
              Full-Funnel Conversion Attribution
            </h3>
            <p className="text-xs text-zinc-400">
              Interactive stage progression from App impression down to active paid subscriptions.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00a877]" />
            <span>Cohort: All Channels</span>
          </div>
        </div>

        {/* Funnel Stage Visual Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {mockFunnelData.map((stage, idx) => (
            <div
              key={stage.id}
              className="p-4 rounded-xl bg-[#09090B] border border-zinc-800 relative group hover:border-[#008060]/50 transition-all space-y-3"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-zinc-400">Step 0{idx + 1}</span>
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-bold"
                  style={{
                    backgroundColor: `${stage.color}15`,
                    color: stage.color,
                    border: `1px solid ${stage.color}30`,
                  }}
                >
                  {idx === 0 ? 'Top of Funnel' : `${stage.rateFromPrevious}% Step Rate`}
                </span>
              </div>

              <div>
                <div className="text-xs font-semibold text-zinc-300">{stage.name}</div>
                <div className="text-2xl font-bold font-heading text-white mt-0.5">
                  {stage.count.toLocaleString()}
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-zinc-800/80 text-[11px]">
                <div className="flex justify-between text-zinc-400">
                  <span>Overall Conversion:</span>
                  <span className="font-bold text-zinc-200">{stage.rateFromTop}%</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Category Benchmark:</span>
                  <span className="text-zinc-400">{stage.benchmark}%</span>
                </div>
                {stage.dropOffCount > 0 && (
                  <div className="flex justify-between text-rose-400/90 font-medium">
                    <span>Drop-off:</span>
                    <span>-{stage.dropOffCount.toLocaleString()} ({stage.dropOffRate}%)</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Monthly Trend Area Chart */}
        <div className="pt-2">
          <div className="text-xs font-bold text-zinc-300 mb-3 flex items-center justify-between">
            <span>5-Month Funnel Growth Velocity</span>
            <span className="text-[11px] text-zinc-400 font-mono">Monthly Aggregate Progression</span>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockFunnelTrendData}>
                <defs>
                  <linearGradient id="pdpGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00a877" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00a877" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="installsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
                <XAxis dataKey="month" stroke="#71717A" fontSize={11} />
                <YAxis stroke="#71717A" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#09090B',
                    borderColor: '#27272A',
                    borderRadius: '12px',
                    fontSize: '11px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="pdpViews"
                  name="PDP Views"
                  stroke="#00a877"
                  fillOpacity={1}
                  fill="url(#pdpGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="installs"
                  name="Installs"
                  stroke="#10B981"
                  fillOpacity={1}
                  fill="url(#installsGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="setup"
                  name="Setup Completed"
                  stroke="#34D399"
                  fillOpacity={0.2}
                  fill="#34D399"
                />
                <Area
                  type="monotone"
                  dataKey="paid"
                  name="Paid Subscriptions"
                  stroke="#F59E0B"
                  fillOpacity={0.2}
                  fill="#F59E0B"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 2. Shopify Ads Keyword ROAS Tracker Section */}
      <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
          <div>
            <h3 className="text-base font-bold font-heading text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#00a877]" />
              Shopify App Ads Keyword ROAS Tracker
            </h3>
            <p className="text-xs text-zinc-400">
              Live mapping of ad spend, customer acquisition cost (CAC), and return on ad spend per search term.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search keywords..."
                value={keywordSearch}
                onChange={(e) => setKeywordSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-[#09090B] border border-zinc-800 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#00a877]"
              />
            </div>

            {/* Filter buttons */}
            {(['All', 'Profitable', 'Breakeven', 'Optimize'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setKeywordFilter(filter)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  keywordFilter === filter
                    ? 'bg-[#008060]/20 text-[#00a877] border border-[#008060]/40 font-bold'
                    : 'bg-[#09090B] text-zinc-400 border border-zinc-800 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 font-mono text-[11px]">
                <th className="pb-3 font-semibold">Keyword</th>
                <th className="pb-3 font-semibold">Match Type</th>
                <th className="pb-3 font-semibold">Spend</th>
                <th className="pb-3 font-semibold">Clicks / CPC</th>
                <th className="pb-3 font-semibold">Installs / CAC</th>
                <th className="pb-3 font-semibold">Paid Subs</th>
                <th className="pb-3 font-semibold">Revenue</th>
                <th className="pb-3 font-semibold">ROAS</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredKeywords.map((kw) => (
                <tr key={kw.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="py-3 font-semibold text-white flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-[#00a877]" />
                    {kw.keyword}
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                        kw.matchType === 'Exact'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : kw.matchType === 'Competitor'
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                          : 'bg-zinc-800 text-zinc-300'
                      }`}
                    >
                      {kw.matchType}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-zinc-300">${kw.spend.toLocaleString()}</td>
                  <td className="py-3 font-mono text-zinc-300">
                    {kw.clicks} <span className="text-zinc-500">(${kw.cpc.toFixed(2)})</span>
                  </td>
                  <td className="py-3 font-mono text-zinc-300">
                    {kw.installs} <span className="text-zinc-500">(${kw.cac.toFixed(2)})</span>
                  </td>
                  <td className="py-3 font-mono font-bold text-white">{kw.paidSubscriptions}</td>
                  <td className="py-3 font-mono text-[#00a877] font-semibold">${kw.revenue.toLocaleString()}</td>
                  <td className="py-3 font-mono font-bold">
                    <span
                      className={`px-2 py-0.5 rounded ${
                        kw.roas >= 2.5
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : kw.roas >= 1.0
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {kw.roas.toFixed(2)}x
                    </span>
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        kw.status === 'Profitable'
                          ? 'bg-[#008060]/20 text-[#00a877] border border-[#008060]/30'
                          : kw.status === 'Breakeven'
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {kw.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Uninstall Timing & Churn Heatmap */}
      <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-6">
        <div className="pb-4 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold font-heading text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Uninstall Timing & Churn Matrix
            </h3>
            <p className="text-xs text-zinc-400">
              Visual breakdown of uninstall events grouped by merchant install age and merchant revenue tier.
            </p>
          </div>
          <div className="text-xs text-zinc-400 flex items-center gap-2">
            <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-mono">
              Critical Zone: Day 1 & Day 14
            </span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {(['Day 1', 'Day 3', 'Day 14', 'Day 30+'] as const).map((ageGroup) => {
            const ageCells = mockChurnHeatmapData.filter((c) => c.ageGroup === ageGroup);
            return (
              <div
                key={ageGroup}
                className="p-4 rounded-xl bg-[#09090B] border border-zinc-800 space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <span className="text-xs font-bold text-white font-mono">{ageGroup} Window</span>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {ageGroup === 'Day 1'
                      ? 'First 24h Setup'
                      : ageGroup === 'Day 3'
                      ? 'Early Trial'
                      : ageGroup === 'Day 14'
                      ? 'Trial Expiration'
                      : 'Post-Paid Churn'}
                  </span>
                </div>

                <div className="space-y-2">
                  {ageCells.map((cell) => (
                    <div
                      key={cell.revenueTier}
                      className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-300 font-medium">{cell.revenueTier}</span>
                        <span
                          className={`font-mono font-bold px-1.5 py-0.2 rounded text-[11px] ${
                            cell.uninstallRate > 30
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : cell.uninstallRate > 15
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {cell.uninstallRate}%
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500 line-clamp-2 italic">
                        "{cell.primaryReason}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Actionable Churn Strategy Callout */}
        <div className="p-4 rounded-xl bg-[#008060]/10 border border-[#008060]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#008060]/20 text-[#00a877]">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">
                Polaris Day-1 Onboarding Wizard can prevent 68% of early uninstalls
              </div>
              <div className="text-[11px] text-zinc-300">
                Our UX & Onboarding Sprint fixes app embed auto-detection and injects live test previews.
              </div>
            </div>
          </div>
          <button
            onClick={() => onOpenBooking('UX & Polaris Onboarding')}
            className="px-4 py-1.5 rounded-full bg-[#008060] hover:bg-[#00a877] text-white text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,128,96,0.3)] shrink-0 cursor-pointer"
          >
            Fix Onboarding Leak
          </button>
        </div>
      </div>

      {/* AI PDP Copy Doctor Modal / Drawer */}
      {isDoctorModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-[#09090B] border border-zinc-800 rounded-2xl shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#008060]/20 text-[#00a877] border border-[#008060]/30">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-heading text-white">
                    AI PDP Copy Doctor
                  </h3>
                  <p className="text-xs text-zinc-400">
                    A/B Test Variations powered by Google AI Studio Gemini Engine
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDoctorModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                ✕
              </button>
            </div>

            {doctorLoading ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-10 h-10 border-3 border-[#008060] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm text-zinc-300 font-medium">
                  Analyzing listing drop-offs and generating A/B test copy variations...
                </p>
              </div>
            ) : doctorResult ? (
              <div className="space-y-6">
                {/* Diagnostics Banner */}
                <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2 text-xs">
                  <div className="font-bold text-white uppercase tracking-wider text-[10px] text-[#00a877]">
                    Funnel Diagnostics & Drop-Off Root Cause
                  </div>
                  <p className="text-zinc-300 leading-relaxed">{doctorResult.diagnostics}</p>
                  <div className="text-[11px] text-amber-400 font-medium">
                    ⚠️ {doctorResult.primaryDropOffReason}
                  </div>
                </div>

                {/* 3 Variations */}
                <div className="space-y-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    3 High-Converting A/B Test Variations
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {doctorResult.variations.map((variant) => (
                      <div
                        key={variant.variantId}
                        className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-[#008060]/50 transition-all space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-[#008060]/20 text-[#00a877] flex items-center justify-center text-xs font-bold font-mono border border-[#008060]/30">
                              {variant.variantId}
                            </span>
                            <span className="text-xs font-bold text-white">{variant.strategy}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold font-mono">
                              {variant.predictedLift}
                            </span>
                            <button
                              onClick={() => handleCopyVariant(variant)}
                              className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              {copiedVariant === variant.variantId ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-[#00a877]" />
                                  <span>Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy Variant</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div>
                            <span className="text-zinc-500 font-mono text-[10px]">APP TITLE:</span>
                            <div className="font-bold text-white text-sm">{variant.appTitle}</div>
                          </div>

                          <div>
                            <span className="text-zinc-500 font-mono text-[10px]">SUBTITLE:</span>
                            <div className="text-zinc-300">{variant.subtitle}</div>
                          </div>

                          <div>
                            <span className="text-zinc-500 font-mono text-[10px]">FEATURE BULLETS:</span>
                            <ul className="list-disc list-inside text-zinc-400 space-y-0.5 mt-0.5">
                              {variant.featureBullets.map((bullet, i) => (
                                <li key={i}>{bullet}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-[11px]">
                            <span className="text-zinc-400">
                              <strong>CTA:</strong> {variant.primaryCta}
                            </span>
                            <span className="text-zinc-500 italic">{variant.rationale}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2 text-xs">
                  <div className="font-bold text-white text-[11px] uppercase tracking-wider">
                    Next ASO & Visual Polish Steps
                  </div>
                  <ul className="space-y-1 text-zinc-300 list-disc list-inside">
                    {doctorResult.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
