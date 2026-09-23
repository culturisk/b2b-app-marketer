import React, { useState } from 'react';
import { ViewType, AuditResult } from '../types';
import { AUDIT_PRESETS } from '../data/mockData';
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Copy,
  Check,
  TrendingUp,
  LayoutGrid,
  Zap,
  Sliders,
  ChevronRight,
  ExternalLink,
  Download,
  Printer,
  FileCode,
  Link,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  downloadAsoAuditPdf,
  downloadAsoAuditHtml,
  downloadAsoAuditMarkdown,
  printAsoAuditReport,
} from '../utils/auditReportExport';
import { MarketplaceAuditTool } from '../components/MarketplaceAuditTool';

interface AuditScorecardViewProps {
  onNavigate: (view: ViewType) => void;
  onOpenBooking: (service?: string) => void;
}

export const AuditScorecardView: React.FC<AuditScorecardViewProps> = ({
  onNavigate,
  onOpenBooking,
}) => {
  const [auditMode, setAuditMode] = useState<'url' | 'wizard'>('url');
  const [step, setStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedReport, setCopiedReport] = useState<boolean>(false);
  const [pdfGenerating, setPdfGenerating] = useState<boolean>(false);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);

  // Form State
  const [appName, setAppName] = useState<string>('CartUpsell Pro');
  const [category, setCategory] = useState<string>('Upsell & Cross-Sell');
  const [appUrl, setAppUrl] = useState<string>(
    'https://apps.shopify.com/cart-upsell-pro'
  );
  const [monthlyInstalls, setMonthlyInstalls] = useState<string>('200 - 500');
  const [priceModel, setPriceModel] = useState<string>('Freemium / $19/mo');
  const [notes, setNotes] = useState<string>(
    'Merchants struggle with setting up the Dawn theme app extension on day 1.'
  );

  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    polaris_native: false,
    ttv_under_3min: false,
    theme_embed_deep_link: true,
    aso_screenshot_contrast: false,
    built_for_shopify: false,
    keyword_density: true,
    shopify_ads_active: true,
    agency_rev_share: false,
    milestone_review_trigger: false,
    uninstall_survey_modal: true,
    winback_email_sequence: false,
    speed_impact_monitored: true,
  });

  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const CHECKLIST_ITEMS = [
    {
      key: 'polaris_native',
      label: 'Native Shopify Polaris 12+ UI in Merchant Admin',
      pillar: 'Pillar 1: Polaris UX',
      desc: 'No foreign fonts, custom non-standard buttons, or external theme styles in app admin.',
    },
    {
      key: 'ttv_under_3min',
      label: 'Guided 3-Step Setup Wizard with < 3 Min Time-to-Value',
      pillar: 'Pillar 2: Onboarding',
      desc: 'Merchants can activate their first live widget without leaving the setup wizard.',
    },
    {
      key: 'theme_embed_deep_link',
      label: 'Theme App Extension 2.0 Direct Deep-Linking',
      pillar: 'Pillar 2: Onboarding',
      desc: '1-click redirect opens Shopify Theme Customizer with your app embed pre-highlighted.',
    },
    {
      key: 'aso_screenshot_contrast',
      label: 'High-Contrast PDP Screenshots with Benefit Callouts',
      pillar: 'Pillar 3: ASO Strategy',
      desc: 'Screenshots emphasize merchant ROI & speed, not just boring settings menus.',
    },
    {
      key: 'built_for_shopify',
      label: 'Qualified for "Built for Shopify" Official Badge',
      pillar: 'Pillar 3: ASO Strategy',
      desc: 'Meets Shopify speed thresholds (< 50ms theme impact) and accessibility guidelines.',
    },
    {
      key: 'keyword_density',
      label: 'Search-Optimized Title, Subtitle & Feature Bullets',
      pillar: 'Pillar 3: ASO Strategy',
      desc: 'App metadata ranks for primary high-intent merchant search queries.',
    },
    {
      key: 'shopify_ads_active',
      label: 'Shopify Search Ads Active with Competitor Conquesting',
      pillar: 'Pillar 4: Paid Search',
      desc: 'Targeting exact competitor search keywords with negative term filtering.',
    },
    {
      key: 'agency_rev_share',
      label: 'Structured Shopify Plus Agency Rev-Share Program',
      pillar: 'Pillar 5: Partnerships',
      desc: 'Co-marketing one-pagers and dedicated partner support channel for agencies.',
    },
    {
      key: 'milestone_review_trigger',
      label: 'Automated 5-Star Review Trigger on 1st Positive Milestone',
      pillar: 'Pillar 6: Email & Reviews',
      desc: 'Review request triggers only after merchant generates their first sale with the app.',
    },
    {
      key: 'uninstall_survey_modal',
      label: 'Pre-Uninstall Feedback & Billing Pause Incentive Modal',
      pillar: 'Pillar 7: Churn Reduction',
      desc: 'Reclaims up to 25% of uninstalls with instant bug fixes or temporary discount pauses.',
    },
    {
      key: 'winback_email_sequence',
      label: 'Automated 30-Day Win-Back Flow for Past Merchants',
      pillar: 'Pillar 7: Churn Reduction',
      desc: 'Notifies past merchants when requested features or major speed upgrades launch.',
    },
    {
      key: 'speed_impact_monitored',
      label: 'Zero Impact on Merchant Lighthouse / Core Web Vitals',
      pillar: 'Pillar 1: Polaris UX',
      desc: 'Theme JS payloads under 25kb compressed, asynchronous loading.',
    },
  ];

  const loadPreset = (preset: (typeof AUDIT_PRESETS)[0]) => {
    setAppName(preset.name);
    setCategory(preset.category);
    setAppUrl(preset.url);
    setMonthlyInstalls(preset.monthlyInstalls);
    setPriceModel(preset.priceModel);
    setChecklist(preset.checklistState);
    setNotes(preset.notes);
  };

  const handleRunAudit = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appName,
          category,
          appUrl,
          monthlyInstalls,
          priceModel,
          checklistState: checklist,
          notes,
        }),
      });

      if (!response.ok) {
        throw new Error('Server returned error while generating audit.');
      }

      const data = await response.json();
      setAuditResult(data);
      setStep(3);

      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#008060', '#00a877', '#34d399'],
        });
      } catch (err) {
        // ignore
      }
    } catch (error: any) {
      console.error('Audit Error:', error);
      setErrorMessage(
        error.message || 'Failed to complete audit. Please retry.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const copyReportToClipboard = () => {
    if (!auditResult) return;
    const text = `=== SHOPIFY APP MARKETER AUDIT REPORT ===
App: ${auditResult.appName}
Overall Score: ${auditResult.overallScore}/100
- Listing Health: ${auditResult.listingHealthScore}/100
- Polaris UX: ${auditResult.polarisUxScore}/100
- Retention Health: ${auditResult.retentionHealthScore}/100

Executive Summary:
${auditResult.executiveSummary}

Key Action Items:
${auditResult.actionItems
  .map(
    (a) => `${a.step}. [${a.pillar}] ${a.recommendation} (Lift: ${a.expectedLift})`
  )
  .join('\n')}

Polaris Critical Flaws:
${auditResult.polarisFlaws.map((f) => `- ${f}`).join('\n')}

ASO Keyword Opportunities:
${auditResult.asoKeywords.join(', ')}
`;
    navigator.clipboard.writeText(text);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  // Real PDF & Report Download Handlers
  const handleDownloadPdf = () => {
    if (!auditResult) return;
    setPdfGenerating(true);
    setDownloadSuccessMessage('Generating vector PDF report...');
    setTimeout(() => {
      const success = downloadAsoAuditPdf(auditResult, appUrl);
      setPdfGenerating(false);
      if (success) {
        setDownloadSuccessMessage(`Downloaded ${auditResult.appName}_ASO_Audit_Report.pdf successfully!`);
        setTimeout(() => setDownloadSuccessMessage(null), 5000);
      }
    }, 400);
  };

  const handleDownloadHtml = () => {
    if (!auditResult) return;
    downloadAsoAuditHtml(auditResult, appUrl);
    setDownloadSuccessMessage(`Downloaded ${auditResult.appName}_ASO_Audit_Report.html!`);
    setTimeout(() => setDownloadSuccessMessage(null), 4000);
  };

  const handleDownloadMarkdown = () => {
    if (!auditResult) return;
    downloadAsoAuditMarkdown(auditResult, appUrl);
    setDownloadSuccessMessage(`Downloaded ${auditResult.appName}_ASO_Report.md!`);
    setTimeout(() => setDownloadSuccessMessage(null), 4000);
  };

  const handlePrint = () => {
    if (!auditResult) return;
    printAsoAuditReport(auditResult, appUrl);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#008060]/15 text-[#00a877] text-xs font-semibold uppercase tracking-wider border border-[#008060]/30">
          <Sparkles className="w-3.5 h-3.5" />
          Powered by Google AI Studio Gemini Engine
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-heading text-white tracking-tight">
          Interactive UX & App Listing Audit
        </h1>
        <p className="text-sm text-zinc-400">
          Paste any software listing link for an instant ASO score and downloadable PDF report, or complete the 12-point Shopify Polaris checklist.
        </p>

        {/* Audit Mode Switcher */}
        <div className="flex items-center justify-center gap-2 pt-3">
          <button
            onClick={() => setAuditMode('url')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              auditMode === 'url'
                ? 'bg-[#00E5FF] text-[#070C1B] shadow-lg shadow-[#00E5FF]/20'
                : 'bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700'
            }`}
          >
            <Link className="w-3.5 h-3.5" />
            <span>Instant Listing URL Audit (Any Marketplace)</span>
          </button>

          <button
            onClick={() => setAuditMode('wizard')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              auditMode === 'wizard'
                ? 'bg-[#008060] text-white shadow-lg shadow-[#008060]/30'
                : 'bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>12-Point Shopify Deep Checklist</span>
          </button>
        </div>

        {/* Step Indicator */}
        {auditMode === 'wizard' && (
          <div className="flex items-center justify-center gap-3 pt-4 text-xs font-mono">
            <button
              onClick={() => setStep(1)}
              className={`px-4 py-1.5 rounded-full border transition-all ${
                step === 1
                  ? 'bg-[#008060] text-white border-[#008060] shadow-[0_0_15px_rgba(0,128,96,0.3)]'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
              }`}
            >
              1. App Details
            </button>
            <ChevronRight className="w-4 h-4 text-zinc-600" />
            <button
              onClick={() => setStep(2)}
              className={`px-4 py-1.5 rounded-full border transition-all ${
                step === 2
                  ? 'bg-[#008060] text-white border-[#008060] shadow-[0_0_15px_rgba(0,128,96,0.3)]'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
              }`}
            >
              2. 12-Point Checklist
            </button>
            <ChevronRight className="w-4 h-4 text-zinc-600" />
            <button
              disabled={!auditResult}
              onClick={() => auditResult && setStep(3)}
              className={`px-4 py-1.5 rounded-full border transition-all ${
                step === 3
                  ? 'bg-[#008060] text-white border-[#008060] shadow-[0_0_15px_rgba(0,128,96,0.3)]'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 opacity-60'
              }`}
            >
              3. AI Audit Scorecard
            </button>
          </div>
        )}
      </div>

      {/* RENDER INSTANT URL AUDIT TOOL */}
      {auditMode === 'url' && (
        <MarketplaceAuditTool onOpenBooking={onOpenBooking} />
      )}

      {/* RENDER WIZARD MODE */}
      {auditMode === 'wizard' && (
        <>
          {/* Preset Quick Loader */}
          {step !== 3 && (
            <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-zinc-400 font-medium">
                ⚡ Quick-load a realistic sample Shopify app:
              </span>
              <div className="flex flex-wrap gap-2">
                {AUDIT_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => loadPreset(preset)}
                    className="px-3 py-1.5 rounded-full bg-[#09090B] hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <span>{preset.name}</span>
                    <span className="text-[10px] text-zinc-500 font-normal">
                      ({preset.category})
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

      {/* STEP 1: APP DETAILS */}
      {step === 1 && (
        <div className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 shadow-2xl space-y-6 max-w-3xl mx-auto">
          <div className="space-y-1">
            <h2 className="text-xl font-bold font-heading text-white">
              Step 1: Your Shopify App Profile
            </h2>
            <p className="text-xs text-zinc-400">
              Provide basic listing details so the AI engine can benchmark against top-performing apps in your category.
            </p>
          </div>

          <div className="space-y-4 text-xs font-medium">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-300 mb-1.5">App Name *</label>
                <input
                  type="text"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  placeholder="e.g. FlashUpsell 2.0"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#09090B] border border-zinc-800 text-white text-sm focus:outline-none focus:border-[#00a877]"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1.5">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#09090B] border border-zinc-800 text-white text-sm focus:outline-none focus:border-[#00a877]"
                >
                  <option value="Upsell & Cross-Sell">Upsell & Cross-Sell</option>
                  <option value="Reviews & Social Proof">Reviews & Social Proof</option>
                  <option value="Inventory & Alerts">Inventory & Alerts</option>
                  <option value="Email & SMS Marketing">Email & SMS Marketing</option>
                  <option value="Page Builders & Design">Page Builders & Design</option>
                  <option value="Subscriptions & Recurring">Subscriptions & Recurring</option>
                  <option value="Customer Support & Helpdesk">Customer Support & Helpdesk</option>
                  <option value="SEO & Speed Optimization">SEO & Speed Optimization</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-300 mb-1.5">
                  App URL or Slug
                </label>
                <input
                  type="text"
                  value={appUrl}
                  onChange={(e) => setAppUrl(e.target.value)}
                  placeholder="apps.shopify.com/your-app-slug"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#09090B] border border-zinc-800 text-white text-sm focus:outline-none focus:border-[#00a877]"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1.5">
                  Monthly Install Range
                </label>
                <select
                  value={monthlyInstalls}
                  onChange={(e) => setMonthlyInstalls(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#09090B] border border-zinc-800 text-white text-sm focus:outline-none focus:border-[#00a877]"
                >
                  <option value="Pre-launch / Under 50">Pre-launch / Under 50</option>
                  <option value="50 - 200">50 - 200 installs/mo</option>
                  <option value="200 - 500">200 - 500 installs/mo</option>
                  <option value="500 - 1,500">500 - 1,500 installs/mo</option>
                  <option value="1,500+">1,500+ installs/mo ($50k+ MRR)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-zinc-300 mb-1.5">
                Pricing Model & Monthly Tier
              </label>
              <input
                type="text"
                value={priceModel}
                onChange={(e) => setPriceModel(e.target.value)}
                placeholder="e.g. Free 14-day trial, then $29/mo or 1.5% GMV fee"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#09090B] border border-zinc-800 text-white text-sm focus:outline-none focus:border-[#00a877]"
              />
            </div>

            <div>
              <label className="block text-zinc-300 mb-1.5">
                Current Known Challenges or Goals
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. High uninstall rate during day 1, poor search ranking for main keywords..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#09090B] border border-zinc-800 text-white text-sm focus:outline-none focus:border-[#00a877] resize-none"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-3 rounded-full font-bold text-xs text-white bg-[#008060] hover:bg-[#00a877] shadow-[0_0_20px_rgba(0,128,96,0.3)] transition-all flex items-center gap-2"
            >
              <span>Continue to 12-Point Checklist</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: 12-POINT CHECKLIST */}
      {step === 2 && (
        <div className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
            <div>
              <h2 className="text-xl font-bold font-heading text-white">
                Step 2: 12-Point UX & Growth Checklist
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Check off everything currently implemented in your app. The AI engine will audit gaps and calculate expected conversion lifts.
              </p>
            </div>
            <div className="text-xs font-mono text-[#00a877] bg-[#008060]/15 px-3 py-1 rounded-full border border-[#008060]/30 font-bold">
              {Object.values(checklist).filter(Boolean).length} of 12 Passed
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CHECKLIST_ITEMS.map((item) => {
              const isChecked = !!checklist[item.key];
              return (
                <div
                  key={item.key}
                  onClick={() =>
                    setChecklist({ ...checklist, [item.key]: !isChecked })
                  }
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-150 flex items-start gap-3.5 ${
                    isChecked
                      ? 'bg-[#008060]/10 border-[#008060]/60 text-white'
                      : 'bg-[#09090B] border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isChecked
                        ? 'bg-[#008060] text-white shadow-[0_0_10px_rgba(0,128,96,0.4)]'
                        : 'border border-zinc-700 bg-zinc-800'
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                        {item.pillar}
                      </span>
                    </div>
                    <div
                      className={`text-xs font-bold ${
                        isChecked ? 'text-white' : 'text-zinc-300'
                      }`}
                    >
                      {item.label}
                    </div>
                    <div className="text-[11px] text-zinc-400 leading-normal">
                      {item.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-800">
            <button
              onClick={() => setStep(1)}
              className="text-xs font-medium text-zinc-400 hover:text-white"
            >
              ← Back to App Details
            </button>

            <button
              onClick={handleRunAudit}
              disabled={isLoading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-sm text-white bg-[#008060] hover:bg-[#00a877] shadow-[0_0_20px_rgba(0,128,96,0.3)] flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing with Gemini AI Engine...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Full AI Scorecard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: AUDIT RESULT SCORECARD */}
      {step === 3 && auditResult && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Top Score summary bar */}
          <div className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 shadow-2xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-zinc-800">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#008060]/15 border border-[#008060]/30 text-[#00a877] text-xs font-semibold uppercase">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Audit Complete • {auditResult.appName}
                </div>
                <h2 className="text-3xl font-bold font-heading text-white">
                  Growth & Polaris Health Scorecard
                </h2>
                <p className="text-xs text-zinc-400 max-w-xl">
                  {auditResult.executiveSummary}
                </p>
              </div>

              {/* Overall Score Dial */}
              <div className="p-5 rounded-2xl bg-[#09090B] border border-[#008060]/40 text-center min-w-[200px] shadow-lg">
                <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block mb-1">
                  Overall Health Score
                </span>
                <div className="text-5xl font-black font-heading text-[#00a877] mt-1 font-mono">
                  {auditResult.overallScore}
                  <span className="text-xl text-zinc-600 font-normal">/100</span>
                </div>
                <div className="text-[11px] text-emerald-300 font-medium mt-1">
                  {auditResult.overallScore > 80
                    ? 'Strong Fundamentals'
                    : auditResult.overallScore > 60
                    ? 'Moderate Friction'
                    : 'Critical Growth Blockers'}
                </div>
              </div>
            </div>

            {/* 3 Sub-scores */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <div className="p-4 rounded-xl bg-[#09090B] border border-zinc-800 space-y-1">
                <div className="text-xs text-zinc-400">Polaris UX & Setup TTV</div>
                <div className="text-2xl font-bold font-mono text-white">
                  {auditResult.polarisUxScore}
                  <span className="text-xs text-zinc-600">/100</span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#008060] h-full rounded-full"
                    style={{ width: `${auditResult.polarisUxScore}%` }}
                  ></div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#09090B] border border-zinc-800 space-y-1">
                <div className="text-xs text-zinc-400">App Listing (ASO)</div>
                <div className="text-2xl font-bold font-mono text-white">
                  {auditResult.listingHealthScore}
                  <span className="text-xs text-zinc-600">/100</span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full"
                    style={{ width: `${auditResult.listingHealthScore}%` }}
                  ></div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#09090B] border border-zinc-800 space-y-1">
                <div className="text-xs text-zinc-400">Retention & Review Loops</div>
                <div className="text-2xl font-bold font-mono text-white">
                  {auditResult.retentionHealthScore}
                  <span className="text-xs text-zinc-600">/100</span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-500 h-full rounded-full"
                    style={{ width: `${auditResult.retentionHealthScore}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Toast Notification */}
          {downloadSuccessMessage && (
            <div className="p-3.5 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/40 flex items-center justify-between gap-3 text-xs text-emerald-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                <span className="font-semibold text-white">{downloadSuccessMessage}</span>
              </div>
              <button
                onClick={() => setDownloadSuccessMessage(null)}
                className="text-zinc-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* UN-GATED INSTANT DOWNLOAD ACTIONS BAR */}
          <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 border-2 border-[#008060]/50 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#00a877]" />
                <span className="font-bold text-white text-sm sm:text-base">
                  Audit Report Ready for Download
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] text-[10px] font-bold">
                  Free / Unlocked
                </span>
              </div>
              <p className="text-xs text-zinc-300">
                Download high-resolution vector PDF, standalone offline HTML, or Markdown format for your team.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <button
                id="wizard-download-pdf-btn"
                onClick={handleDownloadPdf}
                disabled={pdfGenerating}
                className="px-4 py-2.5 rounded-xl bg-[#008060] hover:bg-[#00a877] text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-[#008060]/20 cursor-pointer disabled:opacity-50 whitespace-nowrap"
              >
                {pdfGenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Generating PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF Report</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownloadHtml}
                className="px-3 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs border border-zinc-700 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                title="Download Standalone HTML file"
              >
                <FileCode className="w-3.5 h-3.5 text-[#10B981]" />
                <span>HTML</span>
              </button>

              <button
                onClick={handlePrint}
                className="px-3 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs border border-zinc-700 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                title="Print or Save via Browser"
              >
                <Printer className="w-3.5 h-3.5 text-blue-400" />
                <span>Print</span>
              </button>

              <button
                onClick={handleDownloadMarkdown}
                className="px-3 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs border border-zinc-700 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                title="Download Markdown"
              >
                <Copy className="w-3.5 h-3.5 text-amber-400" />
                <span>Markdown</span>
              </button>
            </div>
          </div>

          {/* Key Action Items Roadmap */}
          <div className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-xl font-bold font-heading text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#00a877]" />
                  Priority 3-Step Growth Roadmap
                </h3>
                <p className="text-xs text-zinc-400">
                  Targeted high-leverage interventions to maximize activation and cut churn.
                </p>
              </div>

              <button
                onClick={copyReportToClipboard}
                className="px-4 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 border border-zinc-700 flex items-center gap-1.5 transition-colors"
              >
                {copiedReport ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Full Report</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-3.5">
              {auditResult.actionItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-[#09090B] border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#008060]/40 transition-colors"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-[#008060]/15 border border-[#008060]/30 text-[#00a877] flex items-center justify-center font-mono font-bold shrink-0 mt-0.5">
                      {item.step}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded text-zinc-400">
                        {item.pillar}
                      </span>
                      <div className="text-sm font-bold text-white mt-1">
                        {item.recommendation}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-block px-3 py-1 rounded-full bg-[#008060]/15 border border-[#008060]/30 text-[#00a877] font-mono text-xs font-bold">
                      {item.expectedLift}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Polaris Flaws & ASO Keyword Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Polaris UX Friction Points */}
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Identified Polaris UX Friction Points:</span>
              </h4>
              <ul className="space-y-2.5 text-xs text-zinc-400">
                {auditResult.polarisFlaws.map((flaw, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-red-400 font-bold shrink-0 mt-0.5">✕</span>
                    <span>{flaw}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ASO High-Intent Keywords */}
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span>ASO Search Keyword Opportunities:</span>
              </h4>
              <p className="text-xs text-zinc-400">
                Target these keywords in your App title, subtitle, and screenshot headers:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {auditResult.asoKeywords.map((kw, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-mono font-medium"
                  >
                    + {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="p-8 rounded-2xl bg-gradient-to-r from-[#09090B] to-[#00806020] border border-[#008060]/40 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-xl font-bold font-heading text-white">
                Ready to Implement This Exact Roadmap?
              </h3>
              <p className="text-xs text-zinc-400">
                Book a 1-on-1 strategy teardown or configure a custom redesign sprint with our Polaris team.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => onNavigate('pricing')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full font-semibold text-xs text-zinc-300 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-colors"
              >
                View Pricing
              </button>

              <button
                onClick={() => onOpenBooking(`Audit Roadmap: ${auditResult.appName}`)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full font-bold text-xs text-white bg-[#008060] hover:bg-[#00a877] shadow-[0_0_20px_rgba(0,128,96,0.3)] transition-all flex items-center justify-center gap-1.5"
              >
                <span>Book 30-Min Call</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
};
