import React, { useState } from 'react';
import {
  TrendingUp,
  Sparkles,
  Users,
  AlertCircle,
  Building2,
  Send,
  Mail,
  Linkedin,
  Copy,
  Check,
  Search,
  Filter,
  CheckCircle2,
  DollarSign,
  ArrowUpRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import {
  mockHighValueLeads,
  mockUpsellRadarAlerts,
  mockAgencyPartners,
} from '../../data/mockAnalyticsData';
import {
  HighValueLead,
  UpsellRadarAlert,
  AgencyPartner,
  OutreachDraftResult,
} from '../../types';

interface SalesRoleViewProps {
  onOpenBooking: (service?: string) => void;
}

export const SalesRoleView: React.FC<SalesRoleViewProps> = ({
  onOpenBooking,
}) => {
  const [tierFilter, setTierFilter] = useState<'All' | 'Shopify Plus' | 'Enterprise Headless' | 'Advanced'>('All');
  const [leadSearch, setLeadSearch] = useState('');
  
  // Targeted Lead Pipeline state
  const [leadsList, setLeadsList] = useState<HighValueLead[]>(mockHighValueLeads);
  const [targetedLeadId, setTargetedLeadId] = useState<string | null>(null);

  // Outreach Drafter Modal
  const [activeAlert, setActiveAlert] = useState<UpsellRadarAlert | null>(null);
  const [outreachChannel, setOutreachChannel] = useState<'email' | 'linkedin'>('email');
  const [draftLoading, setDraftLoading] = useState(false);
  const [draftResult, setDraftResult] = useState<OutreachDraftResult | null>(null);
  const [copiedDraft, setCopiedDraft] = useState(false);

  // Filtered Leads
  const filteredLeads = leadsList.filter((lead) => {
    const matchesTier = tierFilter === 'All' || lead.tier === tierFilter;
    const matchesSearch =
      lead.merchantName.toLowerCase().includes(leadSearch.toLowerCase()) ||
      lead.shopDomain.toLowerCase().includes(leadSearch.toLowerCase()) ||
      lead.activeTheme.toLowerCase().includes(leadSearch.toLowerCase()) ||
      lead.contactPerson.toLowerCase().includes(leadSearch.toLowerCase());
    return matchesTier && matchesSearch;
  });

  const totalPlusGmv = '$348M+';
  const totalReferredMrr = mockAgencyPartners.reduce((acc, curr) => acc + curr.monthlyReferredMrr, 0);
  const totalPendingPayouts = mockAgencyPartners.reduce((acc, curr) => acc + curr.pendingPayout, 0);

  const handleTargetLead = (leadId: string) => {
    setLeadsList((prev) =>
      prev.map((l) =>
        l.id === leadId
          ? {
              ...l,
              pipelineStatus:
                l.pipelineStatus === 'Identified'
                  ? 'Contacted'
                  : l.pipelineStatus === 'Contacted'
                  ? 'Demo Scheduled'
                  : 'Upgraded',
            }
          : l
      )
    );
    setTargetedLeadId(leadId);
    setTimeout(() => setTargetedLeadId(null), 2000);
  };

  const handleOpenOutreachModal = async (alert: UpsellRadarAlert) => {
    setActiveAlert(alert);
    setDraftLoading(true);
    setDraftResult(null);

    try {
      const res = await fetch('/api/analytics/outreach-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchantShop: alert.shopDomain,
          contactName: alert.contactName,
          currentPlan: alert.currentPlan,
          usageMetric: alert.quotaMetric,
          usagePercentage: `${alert.usagePercentage}%`,
          estimatedGmv: alert.estimatedGmv,
          niche: alert.niche,
          channel: outreachChannel,
          appName: 'CartBoost Pro',
        }),
      });

      if (!res.ok) throw new Error('API failed');
      const data = await res.json();
      setDraftResult(data);
    } catch (err) {
      console.error('Outreach generation error:', err);
      // Fallback
      setDraftResult({
        merchantShop: alert.shopDomain,
        contactName: alert.contactName,
        channel: outreachChannel,
        subject: `Quick heads up re: ${alert.quotaMetric} quota on ${alert.merchantName} 🚀`,
        messageBody: `Hi ${alert.contactName},\n\nHope your week is off to a great start! I saw ${alert.merchantName} has been experiencing stellar volume lately in the ${alert.niche} category (${alert.estimatedGmv} GMV).\n\nI'm reaching out because your account is at ${alert.usagePercentage}% of your ${alert.quotaMetric} limit on your ${alert.currentPlan} plan. At your current order velocity, you will hit the cap in ~${alert.projectedOverLimitDays} days.\n\nTo make sure your shoppers never experience throttled checkout offers during key marketing pushes, we can seamlessly upgrade you to ${alert.recommendedPlan} with:\n• Unlimited impressions & prioritized webhook routing\n• Custom CSS styling by our senior Shopify architects\n• Dedicated Slack channel with our core developer team\n\nWould you like me to enable the Enterprise trial on your account, or hop on a 10-minute strategy call?`,
        callToAction: 'Book a 10-Minute Growth Call or Reply to Upgrade',
        talkingPoints: [
          `Currently at ${alert.usagePercentage}% of quota ceiling.`,
          `Projected to cap in ${alert.projectedOverLimitDays} days without upgrade.`,
          `High-volume Plus merchant (${alert.estimatedGmv} GMV) ideal for Enterprise plan.`,
        ],
        recommendedPlan: alert.recommendedPlan,
      });
    } finally {
      setDraftLoading(false);
    }
  };

  const handleCopyDraftText = () => {
    if (!draftResult) return;
    const fullText = `Subject: ${draftResult.subject}\n\n${draftResult.messageBody}`;
    navigator.clipboard.writeText(fullText);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-zinc-900/90 via-zinc-900/60 to-blue-950/20 border border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold border border-blue-500/30 font-mono">
            <Building2 className="w-3.5 h-3.5" />
            Enterprise Pipeline & Sales BD Radar
          </div>
          <h2 className="text-xl font-bold font-heading text-white tracking-tight">
            High-Value Merchant Lead Detector & Quota Upsell Radar
          </h2>
          <p className="text-xs text-zinc-400 max-w-2xl">
            Identify Shopify Plus brands using your app, detect merchants reaching plan limits, and trigger consultative 1-click B2B outreach.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300">
            <span className="text-zinc-500">Tracked Plus GMV: </span>
            <span className="text-[#00a877] font-bold">{totalPlusGmv}</span>
          </div>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <div className="text-[11px] text-zinc-400 font-medium">Shopify Plus Merchant Users</div>
          <div className="text-2xl font-bold font-heading text-white mt-1">42 Merchants</div>
          <div className="text-[11px] text-[#00a877] flex items-center gap-1 mt-1 font-medium">
            <TrendingUp className="w-3 h-3" />
            +8 new Plus installs this month
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <div className="text-[11px] text-zinc-400 font-medium">Merchants &gt;80% Quota Ceiling</div>
          <div className="text-2xl font-bold font-heading text-amber-400 mt-1">5 Merchants</div>
          <div className="text-[11px] text-zinc-400 flex items-center gap-1 mt-1 font-medium">
            <AlertCircle className="w-3 h-3 text-amber-400" />
            High upsell opportunity ($2.4k MRR)
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <div className="text-[11px] text-zinc-400 font-medium">Agency Referred MRR</div>
          <div className="text-2xl font-bold font-heading text-white mt-1">
            ${totalReferredMrr.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#00a877] flex items-center gap-1 mt-1 font-medium">
            <span>6 Active Premier Partner Agencies</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <div className="text-[11px] text-zinc-400 font-medium">Monthly Agency Payouts</div>
          <div className="text-2xl font-bold font-heading text-white mt-1">
            ${totalPendingPayouts.toLocaleString()}
          </div>
          <div className="text-[11px] text-zinc-400 flex items-center gap-1 mt-1 font-medium">
            <ShieldCheck className="w-3 h-3 text-[#00a877]" />
            20% Co-Share Automated
          </div>
        </div>
      </div>

      {/* 1. Usage-Based Upsell Radar (Alert Feed) */}
      <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-zinc-800">
          <div>
            <h3 className="text-base font-bold font-heading text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Usage-Based Upsell Radar (80%+ Quota Triggers)
            </h3>
            <p className="text-xs text-zinc-400">
              Active merchants nearing event, impression, or order limits. Click to generate instant consultative outreach.
            </p>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
            {mockUpsellRadarAlerts.length} Critical Upsell Alerts
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {mockUpsellRadarAlerts.map((alert) => (
            <div
              key={alert.id}
              className="p-4 rounded-xl bg-[#09090B] border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{alert.merchantName}</span>
                  <span className="text-xs font-mono text-zinc-500">({alert.shopDomain})</span>
                  <span
                    className={`px-2 py-0.2 rounded text-[10px] font-bold font-mono ${
                      alert.urgency === 'Critical'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : alert.urgency === 'High'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}
                  >
                    {alert.usagePercentage}% Quota
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400">
                  <span>
                    Limit: <strong className="text-zinc-200">{alert.quotaMetric}</strong> ({alert.usedAmount.toLocaleString()} / {alert.totalLimit.toLocaleString()})
                  </span>
                  <span>
                    Current: <span className="text-zinc-300">{alert.currentPlan}</span>
                  </span>
                  <span>
                    Target: <strong className="text-[#00a877]">{alert.recommendedPlan}</strong>
                  </span>
                  <span>
                    Est. GMV: <strong className="text-zinc-200">{alert.estimatedGmv}</strong>
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full max-w-md h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-1">
                  <div
                    className={`h-full rounded-full ${
                      alert.usagePercentage >= 90
                        ? 'bg-rose-500'
                        : alert.usagePercentage >= 80
                        ? 'bg-amber-500'
                        : 'bg-[#008060]'
                    }`}
                    style={{ width: `${Math.min(alert.usagePercentage, 100)}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => handleOpenOutreachModal(alert)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#008060] hover:bg-[#00a877] transition-all shadow-[0_0_15px_rgba(0,128,96,0.25)] flex items-center gap-1.5 shrink-0 cursor-pointer self-start md:self-center"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                <span>1-Click AI Outreach</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 2. High-Value Merchant Lead Detector Table */}
      <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
          <div>
            <h3 className="text-base font-bold font-heading text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#00a877]" />
              High-Value Merchant Lead Detector
            </h3>
            <p className="text-xs text-zinc-400">
              Filterable active merchant list sorted by GMV tier, order volume, and theme tech stack for enterprise targeting.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search merchants, themes, contacts..."
                value={leadSearch}
                onChange={(e) => setLeadSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-[#09090B] border border-zinc-800 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#00a877]"
              />
            </div>

            {/* Filter buttons */}
            {(['All', 'Shopify Plus', 'Enterprise Headless', 'Advanced'] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => setTierFilter(tier)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  tierFilter === tier
                    ? 'bg-[#008060]/20 text-[#00a877] border border-[#008060]/40 font-bold'
                    : 'bg-[#09090B] text-zinc-400 border border-zinc-800 hover:text-white'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>

        {/* Leads Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 font-mono text-[11px]">
                <th className="pb-3 font-semibold">Merchant / Brand</th>
                <th className="pb-3 font-semibold">Tier</th>
                <th className="pb-3 font-semibold">Monthly Orders</th>
                <th className="pb-3 font-semibold">Active Theme</th>
                <th className="pb-3 font-semibold">Est. Annual GMV</th>
                <th className="pb-3 font-semibold">Decision Maker</th>
                <th className="pb-3 font-semibold">Pipeline Status</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="py-3.5">
                    <div className="font-bold text-white">{lead.merchantName}</div>
                    <div className="text-[10px] font-mono text-zinc-500">{lead.shopDomain}</div>
                  </td>
                  <td className="py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                        lead.tier === 'Shopify Plus'
                          ? 'bg-[#008060]/20 text-[#00a877] border border-[#008060]/30'
                          : lead.tier === 'Enterprise Headless'
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                      }`}
                    >
                      {lead.tier}
                    </span>
                  </td>
                  <td className="py-3.5 font-mono text-zinc-200 font-medium">
                    {lead.monthlyOrderVolume.toLocaleString()} /mo
                  </td>
                  <td className="py-3.5 text-zinc-300 font-medium">
                    {lead.activeTheme}
                  </td>
                  <td className="py-3.5 font-mono text-[#00a877] font-bold">
                    {lead.estimatedAnnualGmv}
                  </td>
                  <td className="py-3.5">
                    <div className="text-zinc-200 font-medium">{lead.contactPerson}</div>
                    <div className="text-[10px] text-zinc-500">{lead.contactRole}</div>
                  </td>
                  <td className="py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        lead.pipelineStatus === 'Upgraded'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : lead.pipelineStatus === 'Demo Scheduled'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : lead.pipelineStatus === 'Contacted'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {lead.pipelineStatus}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => handleTargetLead(lead.id)}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      {targetedLeadId === lead.id ? (
                        <span className="text-[#00a877] flex items-center gap-1">
                          <Check className="w-3 h-3" /> Updated
                        </span>
                      ) : (
                        'Advance Lead'
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Agency & Partner Attribution */}
      <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-zinc-800">
          <div>
            <h3 className="text-base font-bold font-heading text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-[#00a877]" />
              Shopify Plus Agency Partner & Referral Attribution
            </h3>
            <p className="text-xs text-zinc-400">
              Co-selling revenue attribution, referred merchant count, and 20% recurring commission ledger.
            </p>
          </div>
          <button
            onClick={() => onOpenBooking('Agency Partner Co-Marketing')}
            className="px-4 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-colors cursor-pointer"
          >
            Invite Agency Partner
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockAgencyPartners.map((agency) => (
            <div
              key={agency.id}
              className="p-4 rounded-xl bg-[#09090B] border border-zinc-800 space-y-3 hover:border-zinc-700 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#008060]/20 text-[#00a877] flex items-center justify-center font-mono font-bold text-xs border border-[#008060]/30">
                    {agency.logoInitials}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{agency.agencyName}</div>
                    <div className="text-[10px] text-zinc-400">{agency.partnerTier}</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                  {agency.commissionRate}% Share
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800/80 text-xs">
                <div>
                  <span className="text-[10px] text-zinc-500">Active Merchants:</span>
                  <div className="font-bold text-zinc-200">{agency.activeClientMerchants} Merchants</div>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500">Referred MRR:</span>
                  <div className="font-bold text-[#00a877]">${agency.monthlyReferredMrr.toLocaleString()}/mo</div>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500">Pending Payout:</span>
                  <div className="font-bold text-white">${agency.pendingPayout.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500">Account Lead:</span>
                  <div className="text-zinc-300 text-[11px] truncate">{agency.leadAccountManager}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Outreach Drafter Modal */}
      {activeAlert && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#09090B] border border-zinc-800 rounded-2xl shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#008060]/20 text-[#00a877] border border-[#008060]/30">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-heading text-white">
                    AI Consultative Outreach Drafter
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Tailored B2B pitch for {activeAlert.merchantName} ({activeAlert.usagePercentage}% Quota)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveAlert(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Channel Toggle */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-zinc-400">Outreach Channel:</span>
              <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl p-1">
                <button
                  onClick={() => {
                    setOutreachChannel('email');
                    handleOpenOutreachModal(activeAlert);
                  }}
                  className={`px-3 py-1 rounded-lg flex items-center gap-1.5 font-medium transition-all ${
                    outreachChannel === 'email'
                      ? 'bg-[#008060] text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  Email Pitch
                </button>
                <button
                  onClick={() => {
                    setOutreachChannel('linkedin');
                    handleOpenOutreachModal(activeAlert);
                  }}
                  className={`px-3 py-1 rounded-lg flex items-center gap-1.5 font-medium transition-all ${
                    outreachChannel === 'linkedin'
                      ? 'bg-[#008060] text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  LinkedIn Direct Message
                </button>
              </div>
            </div>

            {draftLoading ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-8 h-8 border-2 border-[#008060] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-zinc-400">
                  Synthesizing merchant revenue context and drafting personalized message...
                </p>
              </div>
            ) : draftResult ? (
              <div className="space-y-4 text-xs">
                {/* Talking points */}
                <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
                  <span className="font-mono text-[10px] text-zinc-400 uppercase font-bold">
                    Key Strategic Angles
                  </span>
                  <ul className="list-disc list-inside text-zinc-300 space-y-0.5">
                    {draftResult.talkingPoints.map((tp, i) => (
                      <li key={i}>{tp}</li>
                    ))}
                  </ul>
                </div>

                {/* Email Subject */}
                {outreachChannel === 'email' && (
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                    <span className="text-zinc-500 font-mono text-[10px]">SUBJECT:</span>
                    <div className="font-bold text-white mt-0.5">{draftResult.subject}</div>
                  </div>
                )}

                {/* Message Body */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="font-mono text-[10px]">MESSAGE BODY:</span>
                    <button
                      onClick={handleCopyDraftText}
                      className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedDraft ? (
                        <>
                          <Check className="w-3 h-3 text-[#00a877]" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Message</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-200 font-mono text-xs whitespace-pre-wrap leading-relaxed">
                    {draftResult.messageBody}
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
