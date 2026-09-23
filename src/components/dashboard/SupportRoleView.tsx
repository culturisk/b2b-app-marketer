import React, { useState } from 'react';
import {
  LifeBuoy,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Star,
  Copy,
  Check,
  Search,
  Filter,
  Layers,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Send,
  HelpCircle,
} from 'lucide-react';
import {
  mockMerchantHealthRecords,
  mockReviewOpportunityMerchants,
  mockSupportInquiryPresets,
} from '../../data/mockAnalyticsData';
import {
  MerchantHealthRecord,
  ReviewOpportunityMerchant,
  SupportAssistantResult,
} from '../../types';

interface SupportRoleViewProps {
  onOpenBooking: (service?: string) => void;
}

export const SupportRoleView: React.FC<SupportRoleViewProps> = ({
  onOpenBooking,
}) => {
  const [healthFilter, setHealthFilter] = useState<'All' | 'Green' | 'Yellow' | 'Red'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Support Assistant Modal state
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [customTicket, setCustomTicket] = useState({
    ticketId: 'TICK-9021',
    merchantShop: 'vintage-leather-craft.myshopify.com',
    planTier: 'Starter ($29/mo)',
    inquiryCategory: 'Theme App Embed Not Showing',
    themeName: 'Dawn 15.0',
    customerMessage:
      'We updated our merchant theme yesterday, and now the upsell recommendation box is missing from our cart drawer. Can you check why it is not visible?',
  });
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [assistantResult, setAssistantResult] = useState<SupportAssistantResult | null>(null);
  const [copiedSupportReply, setCopiedSupportReply] = useState(false);

  // Review Trigger State
  const [reviewMerchants, setReviewMerchants] = useState<ReviewOpportunityMerchant[]>(
    mockReviewOpportunityMerchants
  );
  const [triggeredReviewId, setTriggeredReviewId] = useState<string | null>(null);

  // Filtered health records
  const filteredRecords = mockMerchantHealthRecords.filter((record) => {
    const matchesFilter = healthFilter === 'All' || record.status === healthFilter;
    const matchesSearch =
      record.merchantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.shopDomain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.activeTheme.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const greenCount = mockMerchantHealthRecords.filter((r) => r.status === 'Green').length;
  const yellowCount = mockMerchantHealthRecords.filter((r) => r.status === 'Yellow').length;
  const redCount = mockMerchantHealthRecords.filter((r) => r.status === 'Red').length;

  const handleSelectPreset = (idx: number) => {
    setSelectedPresetIndex(idx);
    const preset = mockSupportInquiryPresets[idx];
    setCustomTicket({
      ...preset,
    });
  };

  const handleGenerateSupportReply = async () => {
    setAssistantLoading(true);
    setIsAssistantOpen(true);

    try {
      const res = await fetch('/api/analytics/support-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...customTicket,
          appName: 'CartBoost Pro',
        }),
      });

      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      setAssistantResult(data);
    } catch (err) {
      console.error('Support assistant error:', err);
      // Fallback
      setAssistantResult({
        ticketId: customTicket.ticketId,
        merchantShop: customTicket.merchantShop,
        empathyOpening: `Hi there,\n\nThanks for reaching out! I completely understand how critical it is for CartBoost Pro to display properly on ${customTicket.themeName} without interrupting your live shoppers.`,
        polarisSteps: [
          {
            stepNumber: 1,
            action: 'Open Shopify Theme Customizer',
            navigationPath:
              'Shopify Admin > Themes > Click "Customize" on active theme',
            detail: 'Ensure you are editing the currently published live theme.',
          },
          {
            stepNumber: 2,
            action: 'Enable App Embed in Left Sidebar',
            navigationPath: 'Theme Editor > Left Sidebar > Click the 3rd Icon ("App embeds")',
            detail: 'Locate "CartBoost Core Embed" and toggle the switch to ON (Active).',
          },
          {
            stepNumber: 3,
            action: 'Save Theme Settings',
            navigationPath: 'Theme Editor > Top Right > Click "Save"',
            detail: 'Test in a fresh Incognito window to confirm the widget renders instantly.',
          },
        ],
        troubleshootingNotes: [
          'If you use custom cart drawer scripts, ensure CartBoost embed is loaded before third-party minifires.',
          'App embeds in Shopify 2.0 do not modify your theme.liquid file directly, so your speed score remains 100% intact.',
        ],
        closingOffer:
          'If you would like our Shopify developer team to verify your theme setup directly, please grant collaborator access via your Shopify Partner portal and we will configure it in 5 minutes free of charge!',
        fullDraftedReply: `Hi there,\n\nThanks for reaching out! I completely understand how critical it is for CartBoost Pro to display properly on ${customTicket.themeName} without interrupting your live shoppers.\n\nHere is the exact step-by-step resolution following native Shopify Polaris standards:\n\n1. Go to Shopify Admin > Themes and click 'Customize' on your active theme.\n2. In the left sidebar, click the 'App embeds' icon (the bottom icon).\n3. Toggle 'CartBoost Core Embed' to ON (Green active state).\n4. Click 'Save' in the top-right corner.\n\n💡 Pro Tip: Our app automatically inherits your theme font and primary brand color.\n\nIf you'd like our developer team to take care of this directly for you, please send a Shopify collaborator request to our partner account, and we'll have it verified within 10 minutes!\n\nBest regards,\nCustomer Success Team`,
        polarisDocReference: 'https://shopify.dev/docs/apps/themes/theme-app-extensions',
      });
    } finally {
      setAssistantLoading(false);
    }
  };

  const handleCopySupportReply = () => {
    if (!assistantResult) return;
    navigator.clipboard.writeText(assistantResult.fullDraftedReply);
    setCopiedSupportReply(true);
    setTimeout(() => setCopiedSupportReply(false), 2000);
  };

  const handleTriggerReviewRequest = (merchantId: string) => {
    setReviewMerchants((prev) =>
      prev.map((m) =>
        m.id === merchantId
          ? {
              ...m,
              reviewTriggerStatus: 'Trigger Sent',
              lastTriggerDate: 'Just now',
            }
          : m
      )
    );
    setTriggeredReviewId(merchantId);
    setTimeout(() => setTriggeredReviewId(null), 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-zinc-900/90 via-zinc-900/60 to-purple-950/20 border border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-xs font-semibold border border-purple-500/30 font-mono">
            <LifeBuoy className="w-3.5 h-3.5" />
            Support & Customer Success Intelligence
          </div>
          <h2 className="text-xl font-bold font-heading text-white tracking-tight">
            Merchant Health Score Index & Polaris Support Assistant
          </h2>
          <p className="text-xs text-zinc-400 max-w-2xl">
            Proactively monitor merchant setup health, resolve merchant tickets using Shopify Polaris standard navigation paths, and automate 5-star review requests.
          </p>
        </div>

        <button
          onClick={() => {
            setIsAssistantOpen(true);
            handleGenerateSupportReply();
          }}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#008060] hover:bg-[#00a877] transition-all shadow-[0_0_15px_rgba(0,128,96,0.3)] flex items-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-emerald-300" />
          <span>AI Support Reply Assistant</span>
        </button>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <div className="text-[11px] text-zinc-400 font-medium">Merchant Health Index</div>
          <div className="text-2xl font-bold font-heading text-emerald-400 mt-1">86.4 / 100</div>
          <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 mt-1 font-medium">
            <span className="text-emerald-400 font-bold">{greenCount} Green</span>
            <span>•</span>
            <span className="text-amber-400 font-bold">{yellowCount} Yellow</span>
            <span>•</span>
            <span className="text-rose-400 font-bold">{redCount} Red</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <div className="text-[11px] text-zinc-400 font-medium">Setup Wizard Completion</div>
          <div className="text-2xl font-bold font-heading text-white mt-1">72.0%</div>
          <div className="text-[11px] text-[#00a877] flex items-center gap-1 mt-1 font-medium">
            <CheckCircle2 className="w-3 h-3" />
            Theme App Embed active on 84% merchants
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <div className="text-[11px] text-zinc-400 font-medium">Open Support Tickets</div>
          <div className="text-2xl font-bold font-heading text-white mt-1">5 Tickets</div>
          <div className="text-[11px] text-zinc-400 flex items-center gap-1 mt-1 font-medium">
            <span className="text-emerald-400">Avg Resolution: 24 mins</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <div className="text-[11px] text-zinc-400 font-medium">Review Trigger Readiness</div>
          <div className="text-2xl font-bold font-heading text-amber-400 mt-1">
            {reviewMerchants.filter((m) => m.reviewTriggerStatus === 'Ready to Trigger').length} Ready
          </div>
          <div className="text-[11px] text-zinc-400 flex items-center gap-1 mt-1 font-medium">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            100% setup + high ROI merchants
          </div>
        </div>
      </div>

      {/* 1. Merchant Health Score Index */}
      <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
          <div>
            <h3 className="text-base font-bold font-heading text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00a877]" />
              Merchant Health Score Index
            </h3>
            <p className="text-xs text-zinc-400">
              Proactive churn prevention tracking setup progress, theme embed activation, and active support tickets.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search shop domain or theme..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-[#09090B] border border-zinc-800 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#00a877]"
              />
            </div>

            {/* Filter buttons */}
            {(['All', 'Green', 'Yellow', 'Red'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setHealthFilter(filter)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  healthFilter === filter
                    ? filter === 'Green'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold'
                      : filter === 'Yellow'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold'
                      : filter === 'Red'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 font-bold'
                      : 'bg-[#008060]/20 text-[#00a877] border border-[#008060]/40 font-bold'
                    : 'bg-[#09090B] text-zinc-400 border border-zinc-800 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Health Records List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 font-mono text-[11px]">
                <th className="pb-3 font-semibold">Merchant Domain</th>
                <th className="pb-3 font-semibold">Health Score</th>
                <th className="pb-3 font-semibold">Setup Progress</th>
                <th className="pb-3 font-semibold">Theme & App Embed</th>
                <th className="pb-3 font-semibold">DAU / MAU</th>
                <th className="pb-3 font-semibold">Open Tickets</th>
                <th className="pb-3 font-semibold">Risk Factors</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="py-3.5">
                    <div className="font-bold text-white">{record.merchantName}</div>
                    <div className="text-[10px] font-mono text-zinc-500">{record.shopDomain}</div>
                  </td>
                  <td className="py-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                        record.status === 'Green'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : record.status === 'Yellow'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {record.healthScore} / 100
                    </span>
                  </td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            record.setupProgress === 100
                              ? 'bg-[#00a877]'
                              : record.setupProgress >= 50
                              ? 'bg-amber-400'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${record.setupProgress}%` }}
                        />
                      </div>
                      <span className="font-mono text-zinc-300">{record.setupProgress}%</span>
                    </div>
                  </td>
                  <td className="py-3.5">
                    <div className="text-zinc-200 font-medium">{record.activeTheme}</div>
                    <div className="flex items-center gap-1 text-[10px] mt-0.5">
                      {record.themeEmbedActive ? (
                        <span className="text-[#00a877] flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Embed Active
                        </span>
                      ) : (
                        <span className="text-rose-400 flex items-center gap-0.5">
                          <XCircle className="w-3 h-3" /> Embed Disabled
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 font-mono text-zinc-300">
                    {(record.dauMauRatio * 100).toFixed(0)}%
                  </td>
                  <td className="py-3.5 font-mono">
                    {record.openTickets > 0 ? (
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold">
                        {record.openTickets} Open
                      </span>
                    ) : (
                      <span className="text-zinc-500">0</span>
                    )}
                  </td>
                  <td className="py-3.5 max-w-xs">
                    {record.riskFactors.length > 0 ? (
                      <div className="space-y-0.5 text-[10px] text-amber-300/90 line-clamp-2">
                        {record.riskFactors.map((r, i) => (
                          <div key={i}>• {r}</div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Optimal Setup
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => {
                        setCustomTicket({
                          ticketId: `TICK-${Math.floor(1000 + Math.random() * 9000)}`,
                          merchantShop: record.shopDomain,
                          planTier: record.plan,
                          inquiryCategory: 'Setup Optimization',
                          themeName: record.activeTheme,
                          customerMessage: `Need help verifying theme app embed and configuring post-purchase upsell for ${record.merchantName}.`,
                        });
                        setIsAssistantOpen(true);
                        handleGenerateSupportReply();
                      }}
                      className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors cursor-pointer"
                    >
                      Assist
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Automated Review Opportunity Trigger Section */}
      <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-zinc-800">
          <div>
            <h3 className="text-base font-bold font-heading text-white flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              Automated 5-Star Review Opportunity Triggers
            </h3>
            <p className="text-xs text-zinc-400">
              Happy merchants who hit ROI milestones with 100% setup and 0 open tickets. Trigger customized App review requests.
            </p>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
            {reviewMerchants.filter((m) => m.reviewTriggerStatus === 'Ready to Trigger').length} Candidates Ready
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviewMerchants.map((merchant) => (
            <div
              key={merchant.id}
              className="p-4 rounded-xl bg-[#09090B] border border-zinc-800 space-y-3 hover:border-zinc-700 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-xs">{merchant.merchantName}</div>
                  <div className="text-[10px] font-mono text-zinc-500">{merchant.ownerName} ({merchant.shopDomain})</div>
                </div>
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span className="text-xs font-bold font-mono">5.0 Potential</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800 text-xs space-y-1">
                <div className="text-[10px] text-zinc-400 font-mono uppercase font-bold">
                  Key Value Milestone:
                </div>
                <div className="text-emerald-400 font-semibold">{merchant.milestoneAchieved}</div>
                <div className="text-[11px] text-zinc-400">
                  Recorded Impact: <strong className="text-white">{merchant.valueGenerated}</strong>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-zinc-500">
                  Active for {merchant.daysActive} days • 0 tickets logged
                </span>

                <button
                  onClick={() => handleTriggerReviewRequest(merchant.id)}
                  disabled={merchant.reviewTriggerStatus === 'Review Completed'}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    merchant.reviewTriggerStatus === 'Trigger Sent'
                      ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30'
                      : 'bg-[#008060] hover:bg-[#00a877] text-white shadow-[0_0_15px_rgba(0,128,96,0.2)]'
                  }`}
                >
                  {merchant.reviewTriggerStatus === 'Trigger Sent' ? (
                    <>
                      <Check className="w-3 h-3 text-[#00a877]" />
                      <span>Review Request Sent</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3 h-3" />
                      <span>Trigger 5-Star Review Prompt</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Support Assistant Modal */}
      {isAssistantOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-[#09090B] border border-zinc-800 rounded-2xl shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#008060]/20 text-[#00a877] border border-[#008060]/30">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-heading text-white">
                    AI Support Reply Assistant
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Draft Polaris-compliant merchant resolution instructions powered by Gemini
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAssistantOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Inquiry Presets Selector */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase font-bold text-zinc-400">
                Common Merchant Support Inquiries (Presets):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {mockSupportInquiryPresets.map((preset, idx) => (
                  <button
                    key={preset.ticketId}
                    onClick={() => handleSelectPreset(idx)}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                      selectedPresetIndex === idx
                        ? 'bg-[#008060]/20 border-[#008060] text-white font-semibold'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <div className="font-mono text-[10px] text-zinc-500">{preset.ticketId}</div>
                    <div className="text-xs mt-0.5 line-clamp-1">{preset.inquiryCategory}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input Fields */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-zinc-400 text-[10px] font-mono">MERCHANT DOMAIN:</label>
                <input
                  type="text"
                  value={customTicket.merchantShop}
                  onChange={(e) =>
                    setCustomTicket({ ...customTicket, merchantShop: e.target.value })
                  }
                  className="w-full mt-1 p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono text-xs focus:outline-none focus:border-[#00a877]"
                />
              </div>

              <div>
                <label className="text-zinc-400 text-[10px] font-mono">ACTIVE THEME:</label>
                <input
                  type="text"
                  value={customTicket.themeName}
                  onChange={(e) =>
                    setCustomTicket({ ...customTicket, themeName: e.target.value })
                  }
                  className="w-full mt-1 p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-[#00a877]"
                />
              </div>

              <div className="col-span-2">
                <label className="text-zinc-400 text-[10px] font-mono">MERCHANT QUESTION / TICKET:</label>
                <textarea
                  rows={2}
                  value={customTicket.customerMessage}
                  onChange={(e) =>
                    setCustomTicket({ ...customTicket, customerMessage: e.target.value })
                  }
                  className="w-full mt-1 p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-[#00a877]"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleGenerateSupportReply}
                disabled={assistantLoading}
                className="px-4 py-2 rounded-xl bg-[#008060] hover:bg-[#00a877] text-white text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,128,96,0.25)] flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                <span>{assistantLoading ? 'Synthesizing...' : 'Regenerate Polaris Reply'}</span>
              </button>
            </div>

            {/* Generated Output */}
            {assistantLoading ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-8 h-8 border-2 border-[#008060] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-zinc-400">
                  Formulating step-by-step Polaris instructions and empathy opening...
                </p>
              </div>
            ) : assistantResult ? (
              <div className="space-y-4 text-xs">
                {/* Polaris Steps Breakdown */}
                <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                  <span className="font-mono text-[10px] text-[#00a877] uppercase font-bold">
                    Shopify Polaris Admin Navigation Path:
                  </span>
                  <div className="space-y-2">
                    {assistantResult.polarisSteps.map((step) => (
                      <div key={step.stepNumber} className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-[#008060]/20 text-[#00a877] font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 border border-[#008060]/30">
                          {step.stepNumber}
                        </span>
                        <div>
                          <div className="font-semibold text-white">{step.action}</div>
                          <div className="text-[11px] font-mono text-zinc-400">{step.navigationPath}</div>
                          <div className="text-[10px] text-zinc-500 mt-0.5">{step.detail}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Full Drafted Reply */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="font-mono text-[10px]">READY-TO-SEND REPLY (ZENDESK / GORGIAS / INTERCOM):</span>
                    <button
                      onClick={handleCopySupportReply}
                      className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedSupportReply ? (
                        <>
                          <Check className="w-3 h-3 text-[#00a877]" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Full Reply</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-200 font-mono text-xs whitespace-pre-wrap leading-relaxed">
                    {assistantResult.fullDraftedReply}
                  </pre>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
