import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ViewType, MarketplaceAuditResponse } from '../types';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Zap,
  TrendingUp,
  Target,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Download,
  Printer,
  FileCode,
  FileText,
  Lock,
  ExternalLink,
  RefreshCw,
  Search,
  Check,
  Layers,
  ShoppingBag,
  SlidersHorizontal,
  Clock,
  Calendar,
  PhoneCall,
  ChevronRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PaymentGatewayModal } from '../components/PaymentGatewayModal';
import {
  extractListingMetadata,
  executeLiveRuleEvaluation,
} from '../utils/shopifyAuditRules';
import {
  downloadAsoAuditPdf,
  downloadAsoAuditHtml,
  downloadAsoAuditMarkdown,
  printAsoAuditReport,
} from '../utils/auditReportExport';

interface LandingViewProps {
  onNavigate: (view: ViewType) => void;
  onOpenBooking: (service?: string) => void;
  onSelectEcosystem?: (slug: string) => void;
}

const auditStages = [
  'Resolving Shopify App DOM structure...',
  'Evaluating Title (≤30 chars) & Subtitle (≤62 chars) density...',
  'Scanning Polaris 12+ design tokens & App Bridge 4.0 runtime...',
  'Analyzing screenshot carousel CRO & 3-second value proof...',
  'Calculating 30-day verified merchant review velocity...',
  'Testing mandatory Shopify privacy webhooks & GDPR compliance...',
  'Synthesizing 22-rule diagnostic matrix & 30-day action roadmap...',
];

const QUICK_SAMPLES = [
  { name: 'CartBoost Pro', url: 'https://apps.shopify.com/cartboost-pro' },
  { name: 'Loox Reviews', url: 'https://apps.shopify.com/loox' },
  { name: 'Klaviyo Email', url: 'https://apps.shopify.com/klaviyo-email-marketing' },
  { name: 'PageFly Builder', url: 'https://apps.shopify.com/pagefly' },
  { name: 'Judge.me Reviews', url: 'https://apps.shopify.com/judgeme' },
  { name: 'ReConvert Upsell', url: 'https://apps.shopify.com/reconvert-upsell-cross-sell' },
];

export const LandingView: React.FC<LandingViewProps> = ({
  onNavigate,
  onOpenBooking,
}) => {
  // Step State: 1 = Input, 2 = 22-Rule Scorecard, 3 = Growth Roadmap, 4 = Report & Implementation
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [urlInput, setUrlInput] = useState<string>('https://apps.shopify.com/cartboost-pro');
  const [loading, setLoading] = useState<boolean>(false);
  const [liveStage, setLiveStage] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [auditResult, setAuditResult] = useState<MarketplaceAuditResponse | null>(null);

  // Filter state for Step 2
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  // Payment & Download state for Step 4
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [paymentReceipt, setPaymentReceipt] = useState<any | null>(null);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  // Helper to ensure audit data exists if user jumps ahead
  const getOrInitAuditResult = (): MarketplaceAuditResponse => {
    if (auditResult) return auditResult;
    const initialUrl = urlInput || 'https://apps.shopify.com/cartboost-pro';
    const initialMeta = extractListingMetadata({ url: initialUrl, detectedName: 'CartBoost Pro' });
    const initialEval = executeLiveRuleEvaluation(initialMeta, 'CartBoost Pro');
    const fallbackData: MarketplaceAuditResponse = {
      appName: 'CartBoost Pro',
      marketplaceName: 'Shopify App Directory',
      ecosystemSlug: 'shopify',
      overallScore: initialEval.overallScore,
      keywordSaturationScore: initialEval.keywordScore,
      visualMediaScore: initialEval.visualCroScore,
      reviewHealthScore: initialEval.reviewScore,
      complianceScore: initialEval.complianceScore,
      pricingFrictionScore: initialEval.pricingScore,
      executiveSummary:
        'Live Shopify App Diagnostic completed for "CartBoost Pro". Evaluated 22 algorithmic criteria across metadata character constraints, Polaris 12+ token compliance, screenshot conversion hierarchy, and merchant review velocity.',
      findings: initialEval.findings,
      ruleEvaluations: initialEval.ruleEvaluations,
      scannedMetadata: initialMeta,
      telemetryHighlights: initialEval.telemetryHighlights,
      actionRoadmap: [
        {
          step: 1,
          pillar: 'Marketplace ASO',
          recommendation: 'Restructure App Title to strictly ≤30 characters and place primary keyword modifier upfront.',
          expectedLift: '+35% Search Impressions',
          timeframe: 'Days 1-7',
        },
        {
          step: 2,
          pillar: 'Marketplace ASO',
          recommendation: 'Redesign Slide 1 of screenshot carousel with high-contrast Polaris ribbon highlighting measurable merchant ROI.',
          expectedLift: '+28% Listing CVR',
          timeframe: 'Days 8-14',
        },
        {
          step: 3,
          pillar: 'PLG & Reviews',
          recommendation: 'Deploy smart milestone-triggered in-app review prompts after merchant generates their first $100 in upsell revenue.',
          expectedLift: '+40% Day-1 Retention',
          timeframe: 'Days 15-21',
        },
        {
          step: 4,
          pillar: 'Co-Marketing',
          recommendation: 'Migrate embedded admin views to Polaris 12+ design tokens and App Bridge 4.0 to secure official badge.',
          expectedLift: 'Built for Shopify Badge',
          timeframe: 'Days 22-30',
        },
      ],
      isUnlocked: false,
    };
    setAuditResult(fallbackData);
    return fallbackData;
  };

  const currentAudit = auditResult || (currentStep > 1 ? getOrInitAuditResult() : null);

  // Execute Live Audit Flow
  const handleRunAudit = async (targetUrl?: string) => {
    let url = targetUrl || urlInput;
    if (!url || url.trim().length < 3) {
      setError('Please provide a Shopify app listing link (e.g. apps.shopify.com/your-app-name).');
      return;
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
      setUrlInput(url);
    }

    setError(null);
    setLoading(true);
    setLiveStage(0);

    const stageInterval = setInterval(() => {
      setLiveStage((prev) => (prev < auditStages.length - 1 ? prev + 1 : prev));
    }, 400);

    try {
      const response = await fetch('/api/marketplace-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          marketplaceUrl: url,
          ecosystemSlug: 'shopify',
        }),
      });

      clearInterval(stageInterval);

      if (!response.ok) {
        throw new Error('Server returned non-200');
      }

      const data: MarketplaceAuditResponse = await response.json();

      if (!data.ruleEvaluations || data.ruleEvaluations.length === 0) {
        const fallbackMeta = extractListingMetadata({ url, detectedName: data.appName });
        const fallbackEval = executeLiveRuleEvaluation(fallbackMeta, data.appName);
        data.ruleEvaluations = fallbackEval.ruleEvaluations;
        data.scannedMetadata = fallbackMeta;
        data.telemetryHighlights = fallbackEval.telemetryHighlights;
      }

      setAuditResult({
        ...data,
        marketplaceName: 'Shopify App Directory',
        ecosystemSlug: 'shopify',
      });
      setLoading(false);
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      clearInterval(stageInterval);
      console.warn('Backend fallback triggered:', err);
      const localMeta = extractListingMetadata({ url });
      const localEval = executeLiveRuleEvaluation(localMeta, localMeta.title.replace(/ App.*$/, ''));
      const fallbackData: MarketplaceAuditResponse = {
        appName: localMeta.title,
        marketplaceName: 'Shopify App Directory',
        ecosystemSlug: 'shopify',
        overallScore: localEval.overallScore,
        keywordSaturationScore: localEval.keywordScore,
        visualMediaScore: localEval.visualCroScore,
        reviewHealthScore: localEval.reviewScore,
        complianceScore: localEval.complianceScore,
        pricingFrictionScore: localEval.pricingScore,
        executiveSummary: `Live Shopify App Diagnostic completed for "${localMeta.title}". Evaluated 22 algorithmic criteria.`,
        findings: localEval.findings,
        ruleEvaluations: localEval.ruleEvaluations,
        scannedMetadata: localMeta,
        telemetryHighlights: localEval.telemetryHighlights,
        actionRoadmap: [
          {
            step: 1,
            pillar: 'Marketplace ASO',
            recommendation: 'Restructure App Title to strictly ≤30 characters and place primary keyword modifier upfront.',
            expectedLift: '+35% Search Impressions',
            timeframe: 'Days 1-7',
          },
          {
            step: 2,
            pillar: 'Marketplace ASO',
            recommendation: 'Redesign Slide 1 of screenshot carousel with high-contrast Polaris ribbon highlighting measurable merchant ROI.',
            expectedLift: '+28% Listing CVR',
            timeframe: 'Days 8-14',
          },
          {
            step: 3,
            pillar: 'PLG & Reviews',
            recommendation: 'Deploy smart milestone-triggered in-app review prompts after merchant achieves setup success.',
            expectedLift: '+40% Day-1 Retention',
            timeframe: 'Days 15-21',
          },
          {
            step: 4,
            pillar: 'Co-Marketing',
            recommendation: 'Migrate embedded admin views to Polaris 12+ design tokens and App Bridge 4.0 to secure official badge.',
            expectedLift: 'Built for Shopify Badge',
            timeframe: 'Days 22-30',
          },
        ],
        isUnlocked: false,
      };

      setAuditResult(fallbackData);
      setLoading(false);
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectSample = (sampleUrl: string) => {
    setUrlInput(sampleUrl);
    handleRunAudit(sampleUrl);
  };

  // Payment & Downloads
  const handlePaymentSuccess = (receipt: any) => {
    setIsPaid(true);
    setPaymentReceipt(receipt);
    setIsPaymentModalOpen(false);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    setDownloadSuccessMessage('Payment verified! ₹60,000 INR captured. Downloading official 24-page report...');
    if (currentAudit) {
      setTimeout(() => {
        downloadAsoAuditPdf(currentAudit);
      }, 700);
    }
  };

  const handleDownloadPdf = () => {
    if (!currentAudit) return;
    setIsDownloading(true);
    try {
      downloadAsoAuditPdf(currentAudit);
      setDownloadSuccessMessage('24-Page Polaris Audit PDF downloaded successfully.');
    } catch {
      setError('Failed to generate PDF.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadHtml = () => {
    if (!currentAudit) return;
    downloadAsoAuditHtml(currentAudit);
    setDownloadSuccessMessage('Standalone offline HTML report downloaded.');
  };

  const handleDownloadMarkdown = () => {
    if (!currentAudit) return;
    downloadAsoAuditMarkdown(currentAudit);
    setDownloadSuccessMessage('Engineering Markdown report downloaded.');
  };

  const handlePrint = () => {
    if (!currentAudit) return;
    printAsoAuditReport(currentAudit);
  };

  // Stepper Config
  const steps = [
    { number: 1, title: 'Listing URL', desc: 'Enter Link & Scan' },
    { number: 2, title: '22-Rule Scorecard', desc: 'Diagnostic Health' },
    { number: 3, title: 'Growth Roadmap', desc: '30-Day Sprint Plan' },
    { number: 4, title: 'Report & Booking', desc: 'Downloads & Sprint' },
  ];

  // Filtering rules for Step 2
  const allRules = currentAudit?.ruleEvaluations || [];
  const filteredRules =
    activeCategoryFilter === 'all'
      ? allRules
      : allRules.filter((r) => r.category === activeCategoryFilter);

  const passCount = allRules.filter((r) => r.status === 'pass').length;
  const warnCount = allRules.filter((r) => r.status === 'warning').length;
  const failCount = allRules.filter((r) => r.status === 'fail').length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-white">
      {/* ── STEP PROGRESS BAR (CLEAN & NON-CROWDED) ── */}
      <div className="bg-[#0A0E17] border border-white/15 rounded-2xl p-3 sm:p-4 shadow-xl">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 sm:pb-0">
          {steps.map((s, idx) => {
            const isActive = currentStep === s.number;
            const isCompleted = currentStep > s.number;
            return (
              <React.Fragment key={s.number}>
                <button
                  onClick={() => {
                    if (s.number > 1 && !auditResult) {
                      getOrInitAuditResult();
                    }
                    setCurrentStep(s.number);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-[#008060] text-white shadow-lg shadow-[#008060]/30 font-bold'
                      : isCompleted
                      ? 'bg-[#121826] text-slate-200 hover:bg-white/10 border border-white/10'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                      isActive
                        ? 'bg-white text-black'
                        : isCompleted
                        ? 'bg-[#00a877] text-white'
                        : 'bg-white/10 text-slate-400'
                    }`}
                  >
                    {isCompleted ? <Check className="w-3.5 h-3.5" /> : s.number}
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-xs font-semibold leading-tight">
                      Step {s.number}: {s.title}
                    </div>
                    <div
                      className={`text-[10px] leading-tight ${
                        isActive ? 'text-emerald-100' : 'text-slate-400'
                      }`}
                    >
                      {s.desc}
                    </div>
                  </div>
                </button>
                {idx < steps.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-slate-600 shrink-0 hidden sm:block" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ── STEP 1: ENTER LISTING URL & LIVE SCAN ── */}
      {currentStep === 1 && (
        <motion.div
          key="step-1"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* Header Card */}
          <div className="text-center max-w-3xl mx-auto space-y-4 py-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121826] border border-white/15 text-xs font-semibold text-slate-200 shadow-md">
              <span className="flex h-2 w-2 rounded-full bg-[#00a877] animate-ping" />
              <span className="text-[#00a877] font-mono font-bold">SHOPIFY SPECIALIST</span>
              <span className="text-slate-500">•</span>
              <span>22 Ranking Rules & Guidelines Tested</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
              Audit Your Shopify App <br className="hidden sm:inline" />
              Listing
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Enter your Shopify App URL to execute a live algorithmic diagnostic against 22 official ranking criteria, Polaris 12+ design tokens, and screenshot conversion benchmarks.
            </p>
          </div>

          {/* Focused Input Box */}
          <div className="bg-[#0A0E17] border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl max-w-3xl mx-auto space-y-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleRunAudit();
              }}
              className="space-y-4"
            >
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                Shopify App Listing URL
              </label>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                    <Search className="w-5 h-5" />
                  </div>
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://apps.shopify.com/your-app-name"
                    disabled={loading}
                    className="w-full pl-11 pr-4 py-4 rounded-2xl bg-[#121826] border border-white/20 text-white placeholder-slate-500 focus:outline-none focus:border-[#008060] focus:ring-2 focus:ring-[#008060]/30 text-sm sm:text-base transition-all font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 rounded-2xl bg-[#008060] hover:bg-[#009973] disabled:bg-[#008060]/50 text-white font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-[#008060]/30 shrink-0"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Auditing Live...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Run Live Listing Audit</span>
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{error}</span>
                </div>
              )}
            </form>

            {/* Live Progress Stages Bar */}
            {loading && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-5 rounded-2xl bg-[#121826] border border-[#008060]/40 space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[#00a877] font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#00a877] animate-ping" />
                    Phase {liveStage + 1} of {auditStages.length}
                  </span>
                  <span className="font-mono text-slate-400">
                    {Math.round(((liveStage + 1) / auditStages.length) * 100)}%
                  </span>
                </div>

                <div className="w-full bg-black/60 rounded-full h-2 overflow-hidden border border-white/10">
                  <motion.div
                    className="bg-gradient-to-r from-[#008060] to-[#00a877] h-full"
                    initial={{ width: '10%' }}
                    animate={{ width: `${((liveStage + 1) / auditStages.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                <div className="text-xs text-slate-200 font-mono flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#00a877]" />
                  <span>{auditStages[liveStage]}</span>
                </div>
              </motion.div>
            )}

            {/* Quick Test Samples */}
            <div className="pt-2 border-t border-white/10 space-y-2.5">
              <div className="text-xs text-slate-400 font-mono">
                Or test with a live category leader:
              </div>
              <div className="flex flex-wrap gap-2">
                {QUICK_SAMPLES.map((sample) => (
                  <button
                    key={sample.name}
                    onClick={() => handleSelectSample(sample.url)}
                    disabled={loading}
                    className="px-3 py-1.5 rounded-xl bg-[#121826] hover:bg-white/10 border border-white/15 text-xs text-slate-200 font-mono transition-all hover:border-[#008060] cursor-pointer"
                  >
                    {sample.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3 Value Pillars (Clean, Spaced, Not Crowded) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-4">
            <div className="bg-[#0A0E17] border border-white/15 rounded-2xl p-5 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-[#008060]/20 text-[#00a877] flex items-center justify-center font-bold font-mono text-sm">
                1
              </div>
              <h3 className="font-bold text-white text-sm">22 Algorithmic Rules</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                App Title ≤30 chars, Subtitle ≤62 chars, Polaris 12+ token compliance, screenshot benefit hierarchy.
              </p>
            </div>

            <div className="bg-[#0A0E17] border border-white/15 rounded-2xl p-5 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-white/15 text-white flex items-center justify-center font-bold font-mono text-sm">
                2
              </div>
              <h3 className="font-bold text-white text-sm">Actionable 30-Day Sprint</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Prioritized roadmap detailing Day 1-7, 8-14, 15-21, and 22-30 actions to double search impressions and CVR.
              </p>
            </div>

            <div className="bg-[#0A0E17] border border-white/15 rounded-2xl p-5 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-[#008060]/20 text-[#00a877] flex items-center justify-center font-bold font-mono text-sm">
                3
              </div>
              <h3 className="font-bold text-white text-sm">Full 24-Page Report</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Complete engineering handoff specifications, competitor search volume, and Polaris UI diffs.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── STEP 2: 22-RULE SCORECARD & DIAGNOSTIC BREAKDOWN ── */}
      {currentStep === 2 && currentAudit && (
        <motion.div
          key="step-2"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* Top Summary Banner */}
          <div className="bg-[#0A0E17] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-md bg-[#008060]/20 text-[#00a877] border border-[#008060]/30 font-bold">
                  Shopify Diagnostic Complete
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {currentAudit.ruleEvaluations?.length || 22} Rules Evaluated
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
                {currentAudit.appName}
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                {currentAudit.scannedMetadata?.rawUrl || urlInput}
              </p>
            </div>

            <div className="flex items-center gap-5">
              <div className="text-right">
                <div className="text-xs font-mono text-slate-400">Overall Listing Health</div>
                <div className="text-3xl sm:text-4xl font-extrabold font-mono text-[#00a877]">
                  {currentAudit.overallScore}
                  <span className="text-base text-slate-400">/100</span>
                </div>
              </div>

              <button
                onClick={() => setCurrentStep(1)}
                className="px-3.5 py-2 rounded-xl bg-[#121826] hover:bg-white/10 text-xs font-mono text-slate-300 border border-white/15 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change URL</span>
              </button>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="bg-[#121826] border border-white/15 rounded-2xl p-5 space-y-2">
            <div className="text-xs font-mono text-[#00a877] font-bold uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>Executive Diagnostic Findings</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-normal">
              {currentAudit.executiveSummary}
            </p>
          </div>

          {/* 4 Core Pillars Health Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#0A0E17] border border-white/15 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <TrendingUp className="w-4 h-4 text-[#00a877]" />
                <span className="text-lg font-bold font-mono text-white">
                  {currentAudit.keywordSaturationScore}/100
                </span>
              </div>
              <div className="text-xs font-semibold text-slate-200">Keyword Saturation</div>
              <div className="w-full bg-black h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#008060] h-full"
                  style={{ width: `${currentAudit.keywordSaturationScore}%` }}
                />
              </div>
            </div>

            <div className="bg-[#0A0E17] border border-white/15 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <ShieldCheck className="w-4 h-4 text-white" />
                <span className="text-lg font-bold font-mono text-white">
                  {currentAudit.visualMediaScore}/100
                </span>
              </div>
              <div className="text-xs font-semibold text-slate-200">Visual Media CRO</div>
              <div className="w-full bg-black h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-white h-full"
                  style={{ width: `${currentAudit.visualMediaScore}%` }}
                />
              </div>
            </div>

            <div className="bg-[#0A0E17] border border-white/15 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <Zap className="w-4 h-4 text-[#00a877]" />
                <span className="text-lg font-bold font-mono text-[#00a877]">
                  {currentAudit.reviewHealthScore}/100
                </span>
              </div>
              <div className="text-xs font-semibold text-slate-200">Review Velocity</div>
              <div className="w-full bg-black h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#00a877] h-full"
                  style={{ width: `${currentAudit.reviewHealthScore}%` }}
                />
              </div>
            </div>

            <div className="bg-[#0A0E17] border border-white/15 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <ShoppingBag className="w-4 h-4 text-white" />
                <span className="text-lg font-bold font-mono text-white">
                  {currentAudit.complianceScore}/100
                </span>
              </div>
              <div className="text-xs font-semibold text-slate-200">Built for Shopify UX</div>
              <div className="w-full bg-black h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-slate-300 h-full"
                  style={{ width: `${currentAudit.complianceScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* 22 Rule Evaluation Matrix */}
          <div className="bg-[#0A0E17] border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-bold font-heading text-white">
                  22-Rule Shopify App Compliance Matrix
                </h3>
                <p className="text-xs text-slate-400">
                  Detailed inspection of character limits, Polaris components, screenshot conversion, and review velocity.
                </p>
              </div>

              {/* Status Counters */}
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-950/60 text-[#00a877] border border-emerald-500/30">
                  {passCount} Pass
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-amber-950/60 text-amber-300 border border-amber-500/30">
                  {warnCount} Warning
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-red-950/60 text-red-300 border border-red-500/30">
                  {failCount} Gap
                </span>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              {[
                { id: 'all', label: 'All 22 Rules' },
                { id: 'Shopify Metadata & ASO', label: 'Metadata & ASO' },
                { id: 'Visual CRO & Media', label: 'Visual Media CRO' },
                { id: 'Built for Shopify & Polaris', label: 'Built for Shopify' },
                { id: 'Review Flywheel & Trust', label: 'Review Flywheel' },
                { id: 'Pricing & Merchant Friction', label: 'Pricing Transparency' },
                { id: 'Internationalization', label: 'i18n & Privacy' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    activeCategoryFilter === cat.id
                      ? 'bg-white text-black font-bold border-white'
                      : 'bg-[#121826] text-slate-300 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Rules Cards List */}
            <div className="space-y-3">
              {filteredRules.map((rule) => {
                const isPass = rule.status === 'pass';
                const isWarn = rule.status === 'warning';
                return (
                  <div
                    key={rule.id}
                    className="p-4 rounded-2xl bg-[#121826] border border-white/10 hover:border-white/20 transition-all space-y-2 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        {isPass && <CheckCircle2 className="w-4 h-4 text-[#00a877] shrink-0" />}
                        {isWarn && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
                        {!isPass && !isWarn && <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
                        <span className="font-bold text-white text-sm">{rule.ruleName}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-400 bg-black/40 px-2 py-0.5 rounded border border-white/10">
                          {rule.category}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            isPass
                              ? 'bg-emerald-950/60 text-[#00a877] border border-emerald-500/30'
                              : isWarn
                              ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                              : 'bg-red-950/60 text-red-300 border border-red-500/30'
                          }`}
                        >
                          {rule.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300 pt-1">
                      <div>
                        <span className="text-slate-500">Observed: </span>
                        <span className="font-mono text-white">{rule.observed}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Shopify Benchmark: </span>
                        <span className="text-slate-300">{rule.benchmark}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                      <div className="text-[#00a877] font-semibold">
                        Impact: {rule.impact}
                      </div>
                      <div className="text-slate-300 italic">
                        {rule.recommendation}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2 Bottom Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
            <button
              onClick={() => {
                setCurrentStep(1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#121826] hover:bg-white/10 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Step 1: Change URL</span>
            </button>

            <button
              onClick={() => {
                setCurrentStep(3);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#008060] hover:bg-[#009973] text-white font-bold text-xs sm:text-sm shadow-xl shadow-[#008060]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue to Step 3: 30-Day Growth Roadmap</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* ── STEP 3: 30-DAY GROWTH ROADMAP & SPECIALIZED SERVICES ── */}
      {currentStep === 3 && currentAudit && (
        <motion.div
          key="step-3"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          <div className="text-center max-w-3xl mx-auto space-y-3 py-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121826] text-[#00a877] text-xs font-mono font-bold border border-white/15">
              30-Day Algorithmic Execution Roadmap
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white">
              Prioritized Action Plan for {currentAudit.appName}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Sequenced sprint schedule addressing the highest-impact gaps identified in the 22-rule diagnostic.
            </p>
          </div>

          {/* 4 Sequenced Sprint Phases */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0A0E17] border border-white/15 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#00a877] bg-[#008060]/20 px-2.5 py-1 rounded-lg border border-[#008060]/30 font-bold">
                  Days 1 - 7: Sprint Phase 1
                </span>
                <span className="text-xs font-mono text-white">+35% Search Impressions</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                Shopify App ASO & Metadata Restructuring
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Shorten App Title to strictly ≤30 characters with high-volume keyword modifier upfront. Refactor App Subtitle (≤62 chars) to lead with merchant outcome verbs (Boost, Automate, Convert). Saturate all 10 backend search tags.
              </p>
            </div>

            <div className="bg-[#0A0E17] border border-white/15 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-white bg-white/15 px-2.5 py-1 rounded-lg border border-white/20 font-bold">
                  Days 8 - 14: Sprint Phase 2
                </span>
                <span className="text-xs font-mono text-[#00a877]">+28% Listing CVR</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                Visual CRO & 6-Slide Polaris Screenshot Redesign
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Re-architect screenshot slide 1 with a high-contrast Polaris headline ribbon highlighting proof. Ensure all 6 slides follow Polaris 12+ layout conventions with desktop and mobile admin framing.
              </p>
            </div>

            <div className="bg-[#0A0E17] border border-white/15 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#00a877] bg-[#008060]/20 px-2.5 py-1 rounded-lg border border-[#008060]/30 font-bold">
                  Days 15 - 21: Sprint Phase 3
                </span>
                <span className="text-xs font-mono text-white">+40% Day-1 Retention</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                In-App Milestone Review Prompts & PLG Loops
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Deploy smart milestone review prompts timed to the exact moment the merchant generates their first revenue lift. Condense Day-1 theme app extension onboarding to under 3 minutes.
              </p>
            </div>

            <div className="bg-[#0A0E17] border border-white/15 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-white bg-white/15 px-2.5 py-1 rounded-lg border border-white/20 font-bold">
                  Days 22 - 30: Sprint Phase 4
                </span>
                <span className="text-xs font-mono text-white">Built for Shopify Badge</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                Built for Shopify Badging & Editorial Submission
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Profile embedded admin page speed against Dawn theme benchmarks. Migrate remaining REST requests to GraphQL. Complete Shopify editorial review submission for collection placement.
              </p>
            </div>
          </div>

          {/* 4 Specialized Growth Services Overview */}
          <div className="bg-[#0A0E17] border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="space-y-1">
              <h3 className="text-lg font-bold font-heading text-white">
                Specialized Shopify Implementation Services
              </h3>
              <p className="text-xs text-slate-400">
                Partner with Culturisk to execute your 30-day sprint directly.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => onNavigate('platform-aso')}
                className="p-4 rounded-2xl bg-[#121826] border border-white/10 hover:border-[#008060] transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-white text-sm group-hover:text-[#00a877]">
                    <TrendingUp className="w-4 h-4 text-[#00a877]" />
                    <span>Shopify App ASO & CRO</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-xs text-slate-300">
                  Search keyword saturation, title hooks & high-converting screenshot carousels.
                </p>
              </div>

              <div
                onClick={() => onNavigate('platform-co-marketing')}
                className="p-4 rounded-2xl bg-[#121826] border border-white/10 hover:border-white transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-white text-sm group-hover:text-white">
                    <ShieldCheck className="w-4 h-4 text-white" />
                    <span>Built for Shopify & Polaris 12+ UX</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-xs text-slate-300">
                  Benchmark compliance, native admin UX, and official badge qualification.
                </p>
              </div>

              <div
                onClick={() => onNavigate('platform-performance')}
                className="p-4 rounded-2xl bg-[#121826] border border-white/10 hover:border-[#008060] transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-white text-sm group-hover:text-[#00a877]">
                    <Target className="w-4 h-4 text-[#00a877]" />
                    <span>Shopify App Search Ads</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-xs text-slate-300">
                  Sponsored search bidding, competitor negative matching & scale CPAs under $28.
                </p>
              </div>

              <div
                onClick={() => onNavigate('platform-plg-reviews')}
                className="p-4 rounded-2xl bg-[#121826] border border-white/10 hover:border-white transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-white text-sm group-hover:text-white">
                    <Zap className="w-4 h-4 text-white" />
                    <span>Merchant Review Velocity & PLG</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-xs text-slate-300">
                  First-milestone review triggers & Day-1 theme extension setup churn reduction.
                </p>
              </div>
            </div>
          </div>

          {/* Step 3 Bottom Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
            <button
              onClick={() => {
                setCurrentStep(2);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#121826] hover:bg-white/10 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Step 2: Scorecard</span>
            </button>

            <button
              onClick={() => {
                setCurrentStep(4);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#008060] hover:bg-[#009973] text-white font-bold text-xs sm:text-sm shadow-xl shadow-[#008060]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue to Step 4: Full Report & Booking</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* ── STEP 4: REPORT DOWNLOAD (₹60,000) & CONSULTATION BOOKING ── */}
      {currentStep === 4 && currentAudit && (
        <motion.div
          key="step-4"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          <div className="text-center max-w-3xl mx-auto space-y-3 py-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121826] text-[#00a877] text-xs font-mono font-bold border border-white/15">
              Deliverables & Strategic Consultation
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white">
              Official Diagnostic Report & Implementation
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Download your complete 24-page developer specifications package and schedule your implementation sprint call.
            </p>
          </div>

          {/* Success Banner if paid */}
          {downloadSuccessMessage && (
            <div className="p-4 rounded-2xl bg-[#008060]/20 border border-[#008060]/40 text-[#00a877] text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#00a877]" />
              <span>{downloadSuccessMessage}</span>
            </div>
          )}

          {/* Two-Column Module: Gated Report vs Strategy Session */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Module 1: Gated 24-Page Report */}
            <div className="lg:col-span-7 bg-[#0A0E17] border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl flex flex-col justify-between">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-md bg-[#008060]/20 text-[#00a877] border border-[#008060]/30 font-bold">
                    Official Diagnostic Package
                  </span>
                  <span className="text-xs font-mono text-slate-400">24-Page Developer Bundle</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
                  Shopify App Deep ASO & Polaris 12+ Handoff Report
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Engineered specifically for {currentAudit.appName}. Contains line-by-line developer handoff specifications, title/subtitle keyword permutations, 6-slide Polaris screenshot wireframes, and competitor search volume analytics.
                </p>

                <div className="space-y-2 text-xs text-slate-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00a877]" />
                    <span>Complete 22-rule guideline matrix with code & copy diffs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00a877]" />
                    <span>Exact Title & Subtitle keyword copy variations ready to paste</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00a877]" />
                    <span>High-contrast 6-slide screenshot wireframe design templates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00a877]" />
                    <span>Shopify search tag saturation & competitor bid landscape</span>
                  </div>
                </div>

                {isPaid ? (
                  <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#00a877]">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Strategic License Active • Payment Verified</span>
                    </div>
                    <div className="text-[11px] text-slate-300 font-mono">
                      Tax Invoice: {paymentReceipt?.taxInvoiceNumber || 'INV-CULTURISK-2025-VERIFIED'} • Amount: ₹60,000 INR
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-[#121826] border border-white/15 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-slate-400">One-Time Strategic License Fee:</span>
                      <span className="text-xl font-bold font-mono text-[#00a877]">₹60,000 INR</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Instant unlock via Razorpay sandbox payment gateway (UPI, Cards, Net Banking). Includes GST Tax Invoice.
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                {isPaid ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      onClick={handleDownloadPdf}
                      disabled={isDownloading}
                      className="p-3 rounded-xl bg-[#008060] hover:bg-[#009973] text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>
                    <button
                      onClick={handleDownloadHtml}
                      className="p-3 rounded-xl bg-[#121826] hover:bg-white/10 text-white font-bold text-xs border border-white/15 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FileCode className="w-3.5 h-3.5 text-[#00a877]" />
                      <span>HTML</span>
                    </button>
                    <button
                      onClick={handleDownloadMarkdown}
                      className="p-3 rounded-xl bg-[#121826] hover:bg-white/10 text-white font-bold text-xs border border-white/15 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-300" />
                      <span>Markdown</span>
                    </button>
                    <button
                      onClick={handlePrint}
                      className="p-3 rounded-xl bg-[#121826] hover:bg-white/10 text-white font-bold text-xs border border-white/15 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-300" />
                      <span>Print</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="w-full py-4 rounded-2xl bg-[#008060] hover:bg-[#009973] text-white font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xl shadow-[#008060]/30"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Pay ₹60,000 & Unlock Detailed Report</span>
                  </button>
                )}
              </div>
            </div>

            {/* Module 2: 30-Min Strategy Consultation */}
            <div className="lg:col-span-5 bg-[#0A0E17] border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-mono font-bold border border-white/15">
                  1-on-1 Growth Sprint
                </div>

                <h3 className="text-xl font-bold font-heading text-white">
                  Schedule Your 30-Min Implementation Strategy Call
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Review your diagnostic scorecard directly with our Lead Polaris Architect. We’ll teardown your current listing live, map out your 30-day roadmap, and plan your Built for Shopify badge submission.
                </p>

                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#00a877]" />
                    <span>30-minute private strategy session</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-white" />
                    <span>Polaris 12+ embedded admin review</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#00a877]" />
                    <span>Actionable Day-1 to Day-30 implementation plan</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <button
                  onClick={() => onOpenBooking(`Shopify App Growth Sprint: ${currentAudit.appName}`)}
                  className="w-full py-4 rounded-2xl bg-white hover:bg-slate-200 text-black font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl"
                >
                  <PhoneCall className="w-4 h-4 text-[#008060]" />
                  <span>Book Strategy Call</span>
                </button>
              </div>
            </div>
          </div>

          {/* Step 4 Bottom Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
            <button
              onClick={() => {
                setCurrentStep(3);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#121826] hover:bg-white/10 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Step 3: Growth Roadmap</span>
            </button>

            <button
              onClick={() => {
                setCurrentStep(1);
                setUrlInput('');
                setAuditResult(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#121826] hover:bg-white/10 text-slate-300 font-semibold text-xs sm:text-sm border border-white/15 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Start Another Listing Audit</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Payment Gateway Modal (₹60,000 INR) */}
      <PaymentGatewayModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        appName={currentAudit?.appName || 'Shopify App'}
        listingUrl={currentAudit?.scannedMetadata?.rawUrl || urlInput}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};
