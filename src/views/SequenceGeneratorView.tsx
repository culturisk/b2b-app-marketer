import React, { useState } from 'react';
import { ViewType, SequenceResult } from '../types';
import {
  FileText,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Send,
  Mail,
  Layers,
  Users,
  ShieldAlert,
  ArrowRight,
  ChevronRight,
  Sliders,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { recordFormSubmission } from '../services/firebaseService';

interface SequenceGeneratorViewProps {
  onNavigate: (view: ViewType) => void;
  onOpenBooking: (service?: string) => void;
}

export const SequenceGeneratorView: React.FC<SequenceGeneratorViewProps> = ({
  onNavigate,
  onOpenBooking,
}) => {
  const [appName, setAppName] = useState<string>('CartUpsell Pro');
  const [appType, setAppType] = useState<string>('Post-Purchase Upsell & Cart Customization');
  const [targetAudience, setTargetAudience] = useState<string>('Shopify & Shopify Plus DTC Brands');
  const [outputType, setOutputType] = useState<string>('onboarding_emails');
  const [tone, setTone] = useState<string>('Professional, Action-Oriented, High-Converting');
  const [customValueProp, setCustomValueProp] = useState<string>(
    'Increase Average Order Value by 24% with instant one-click post-purchase offers.'
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<SequenceResult | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-sequence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appName,
          appType,
          targetAudience,
          outputType,
          tone,
          customValueProp,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate copy from AI engine.');
      }

      const data = await response.json();
      setResult(data);

      // Systematically store and organize sequence generation in Firebase
      try {
        const seqId = `SEQ-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
        await recordFormSubmission({
          formType: 'sequence',
          customId: `SUB-${seqId}`,
          userEmail: 'visitor@b2bappmarketer.com',
          appName: appName || 'Shopify App',
          summary: `Sequence Generator: ${outputType} for ${appName} (${targetAudience})`,
          status: 'processed',
          details: {
            appName,
            appType,
            targetAudience,
            outputType,
            tone,
            customValueProp,
          },
        });
      } catch (fbErr) {
        console.warn('Firebase sequence record notice:', fbErr);
      }

      try {
        confetti({
          particleCount: 50,
          spread: 50,
          origin: { y: 0.6 },
          colors: ['#008060', '#f59e0b', '#3b82f6'],
        });
      } catch (e) {
        // ignore
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const copySection = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAll = () => {
    if (!result) return;
    const combined = result.sections
      .map(
        (s) =>
          `=== ${s.label} ===\n${s.subject ? `Subject: ${s.subject}\n\n` : ''}${s.body}\n\n${s.notes ? `[Notes: ${s.notes}]\n` : ''}`
      )
      .join('\n----------------------------------------\n\n');
    navigator.clipboard.writeText(combined);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
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
          Automated Email & Polaris UX Copy Generator
        </h1>
        <p className="text-sm text-zinc-400">
          Generate high-converting 3-step onboarding sequences, native Polaris setup microcopy, and B2B agency pitch emails in seconds.
        </p>
      </div>

      {/* Generator Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Settings */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 shadow-2xl space-y-4 text-xs font-medium">
          <div className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-zinc-800 flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-[#00a877]" />
            <span>Copy Parameters</span>
          </div>

          <div>
            <label className="block text-zinc-300 mb-1">Requested Deliverable Type *</label>
            <div className="space-y-1.5">
              {[
                {
                  id: 'onboarding_emails',
                  label: '3-Step Onboarding Email Sequence',
                  icon: <Mail className="w-3.5 h-3.5 text-[#00a877]" />,
                },
                {
                  id: 'polaris_microcopy',
                  label: 'Polaris Admin Setup Microcopy',
                  icon: <Layers className="w-3.5 h-3.5 text-blue-400" />,
                },
                {
                  id: 'agency_pitch',
                  label: 'Shopify Plus Agency Partner Pitch',
                  icon: <Users className="w-3.5 h-3.5 text-purple-400" />,
                },
                {
                  id: 'retention_flow',
                  label: 'Pre-Uninstall & Churn Rescue Flow',
                  icon: <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />,
                },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setOutputType(item.id)}
                  className={`w-full text-left p-2.5 rounded-xl border flex items-center gap-2.5 transition-colors ${
                    outputType === item.id
                      ? 'bg-[#008060]/15 border-[#008060]/50 text-white font-bold'
                      : 'bg-[#09090B] border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-zinc-300 mb-1">App Name</label>
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#09090B] border border-zinc-800 text-white text-xs focus:outline-none focus:border-[#00a877]"
              />
            </div>

            <div>
              <label className="block text-zinc-300 mb-1">Tone of Voice</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#09090B] border border-zinc-800 text-white text-xs focus:outline-none focus:border-[#00a877]"
              >
                <option value="Professional, Action-Oriented, High-Converting">
                  Action-Oriented & Concise
                </option>
                <option value="Technical & Authoritative Developer">
                  Technical & Polaris Native
                </option>
                <option value="Friendly, Concierge Founder-to-Founder">
                  Founder Concierge
                </option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-zinc-300 mb-1">App Category & Core Features</label>
            <input
              type="text"
              value={appType}
              onChange={(e) => setAppType(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#09090B] border border-zinc-800 text-white text-xs focus:outline-none focus:border-[#00a877]"
            />
          </div>

          <div>
            <label className="block text-zinc-300 mb-1">Core Value Proposition / Hook</label>
            <textarea
              rows={2}
              value={customValueProp}
              onChange={(e) => setCustomValueProp(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#09090B] border border-zinc-800 text-white text-xs focus:outline-none focus:border-[#00a877] resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full py-3 rounded-full font-bold text-xs text-white bg-[#008060] hover:bg-[#00a877] shadow-[0_0_20px_rgba(0,128,96,0.3)] flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Drafting with Gemini AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Production Copy Pack</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Output Copy Display */}
        <div className="lg:col-span-7 space-y-4">
          {result ? (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold font-heading text-white">
                    {result.title}
                  </h3>
                  <span className="text-[11px] text-[#00a877] font-mono">
                    Ready to paste into Klaviyo, Customer.io, or your app code
                  </span>
                </div>

                <button
                  onClick={copyAll}
                  className="px-3.5 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 border border-zinc-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedAll ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#00a877]" />
                      <span>All Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Full Pack</span>
                    </>
                  )}
                </button>
              </div>

              {/* Sections */}
              <div className="space-y-4">
                {result.sections.map((section, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 shadow-xl space-y-3"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                      <span className="font-bold text-xs font-mono text-[#00a877]">
                        {section.label}
                      </span>
                      <button
                        onClick={() =>
                          copySection(
                            `${section.subject ? `Subject: ${section.subject}\n\n` : ''}${section.body}`,
                            idx
                          )
                        }
                        className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        {copiedIndex === idx ? (
                          <Check className="w-3 h-3 text-[#00a877]" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    {section.subject && (
                      <div className="p-2.5 rounded-xl bg-[#09090B] border border-zinc-800 text-xs text-white">
                        <span className="text-zinc-400 font-medium">Subject: </span>
                        <strong>{section.subject}</strong>
                      </div>
                    )}

                    <pre className="text-xs text-zinc-300 font-mono whitespace-pre-wrap leading-relaxed bg-[#09090B] p-3.5 rounded-xl border border-zinc-800 text-[11px]">
                      {section.body}
                    </pre>

                    {section.notes && (
                      <div className="text-[11px] text-zinc-400 italic">
                        💡 Trigger Rule: {section.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-zinc-900/50 border border-dashed border-zinc-800 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#008060]/10 text-[#00a877] flex items-center justify-center mx-auto border border-[#008060]/30">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-heading text-white">
                No Sequence Generated Yet
              </h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Select your desired copy format and click <strong>"Generate Production Copy Pack"</strong> to create structured onboarding emails or Polaris microcopy.
              </p>
              <button
                onClick={handleGenerate}
                className="px-6 py-2.5 rounded-full font-bold text-xs text-white bg-[#008060] hover:bg-[#00a877] shadow-[0_0_20px_rgba(0,128,96,0.3)] cursor-pointer"
              >
                Generate Initial Template
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
