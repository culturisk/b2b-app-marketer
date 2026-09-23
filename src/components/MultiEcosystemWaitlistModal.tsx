import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  CheckCircle2,
  Sparkles,
  Check,
  Copy,
  Layers,
  Send,
  ShieldCheck,
  ChevronRight,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { recordFormSubmission } from '../services/firebaseService';

export interface MultiEcosystemWaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEcosystem?: string;
  initialEmail?: string;
}

interface EcosystemOption {
  id: string;
  name: string;
  category: string;
  badge: string;
}

const AVAILABLE_ECOSYSTEMS: EcosystemOption[] = [
  { id: 'salesforce', name: 'Salesforce AppExchange', category: 'Enterprise CRM', badge: 'Private Beta' },
  { id: 'hubspot', name: 'HubSpot App Marketplace', category: 'Marketing & Sales', badge: 'Waitlist' },
  { id: 'atlassian', name: 'Atlassian Marketplace', category: 'Dev & Collaboration', badge: 'Waitlist' },
  { id: 'stripe', name: 'Stripe App Marketplace', category: 'Payments & Billing', badge: 'Waitlist' },
  { id: 'chrome', name: 'Chrome Web Extension Directory', category: 'Browser Ecosystem', badge: 'Private Beta' },
  { id: 'slack', name: 'Slack App Directory', category: 'Workplace Messaging', badge: 'Waitlist' },
  { id: 'microsoft', name: 'Microsoft Teams & AppSource', category: 'Enterprise Cloud', badge: 'Waitlist' },
  { id: 'openai', name: 'OpenAI GPT Directory & Actions', category: 'AI Agents & LLM', badge: 'In Development' },
  { id: 'quickbooks', name: 'Intuit QuickBooks Directory', category: 'SMB Accounting', badge: 'Waitlist' },
  { id: 'xero', name: 'Xero App Directory', category: 'Global Accounting', badge: 'Waitlist' },
  { id: 'aws', name: 'AWS Marketplace', category: 'Cloud Infrastructure', badge: 'In Development' },
  { id: 'zendesk', name: 'Zendesk Marketplace', category: 'Customer Support CX', badge: 'Waitlist' },
];

export const MultiEcosystemWaitlistModal: React.FC<MultiEcosystemWaitlistModalProps> = ({
  isOpen,
  onClose,
  initialEcosystem,
  initialEmail = '',
}) => {
  const [selectedEcosystems, setSelectedEcosystems] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    appName: '',
    appUrl: '',
    currentPlatform: 'Shopify App Ecosystem',
    stage: '$10K - $50K MRR',
    primaryGoal: 'Listing ASO & Search Keyword Discovery',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [queuePosition, setQueuePosition] = useState(148);
  const [copiedTicket, setCopiedTicket] = useState(false);

  // Sync initial ecosystem and initial email when opening
  useEffect(() => {
    if (isOpen) {
      if (initialEmail) {
        setFormData((prev) => ({ ...prev, email: initialEmail }));
      }
      if (initialEcosystem) {
        const matched = AVAILABLE_ECOSYSTEMS.find(
          (e) => e.name.toLowerCase() === initialEcosystem.toLowerCase()
        );
        if (matched) {
          setSelectedEcosystems([matched.name]);
        } else {
          setSelectedEcosystems([initialEcosystem]);
        }
      } else if (selectedEcosystems.length === 0) {
        // Default select the top 2 popular ecosystems
        setSelectedEcosystems(['Salesforce AppExchange', 'HubSpot App Marketplace']);
      }
    }
  }, [isOpen, initialEcosystem, initialEmail]);

  if (!isOpen) return null;

  const toggleEcosystem = (ecoName: string) => {
    setSelectedEcosystems((prev) =>
      prev.includes(ecoName) ? prev.filter((item) => item !== ecoName) : [...prev, ecoName]
    );
  };

  const selectAllEcosystems = () => {
    setSelectedEcosystems(AVAILABLE_ECOSYSTEMS.map((e) => e.name));
  };

  const clearEcosystems = () => {
    setSelectedEcosystems([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) return;

    setIsSubmitting(true);

    try {
      // Call backend waitlist registration endpoint
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          ecosystems: selectedEcosystems,
        }),
      });

      let token = `WAIT-B2B-${Math.floor(1000 + Math.random() * 9000)}`;
      let qPos = 149;

      if (res.ok) {
        const data = await res.json();
        token = data.waitlistToken || token;
        qPos = data.queuePosition || qPos;
      }

      setTicketId(token);
      setQueuePosition(qPos);

      // Systematically store and organize form submission in Firebase
      try {
        await recordFormSubmission({
          formType: 'waitlist',
          customId: `SUB-WL-${token}`,
          userEmail: formData.email,
          userName: formData.name,
          appName: formData.appName,
          summary: `Waitlist application for ${selectedEcosystems.length} marketplaces (${formData.stage})`,
          status: 'new',
          details: {
            ticketId: token,
            queuePosition: qPos,
            ecosystems: selectedEcosystems,
            currentPlatform: formData.currentPlatform,
            stage: formData.stage,
            primaryGoal: formData.primaryGoal,
            appUrl: formData.appUrl,
            notes: formData.notes,
          },
        });
      } catch (fbErr) {
        console.warn('Firebase waitlist persistence notice:', fbErr);
      }

      setIsSuccess(true);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.55 },
          colors: ['#f59e0b', '#008060', '#3b82f6', '#ffffff'],
        });
      } catch (err) {
        // Safe fallback
      }
    } catch (err) {
      console.warn('Network waitlist submission fallback:', err);
      setTicketId(`WAIT-B2B-${Math.floor(1000 + Math.random() * 9000)}`);
      setQueuePosition(149);
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyConfirmation = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(
        `B2B App Marketer Waitlist Confirmation: Ticket ${ticketId} | Queue Position #${queuePosition} | Target Ecosystems: ${selectedEcosystems.join(', ')}`
      );
      setCopiedTicket(true);
      setTimeout(() => setCopiedTicket(false), 2500);
    }
  };

  return (
    <div
      id="multi-ecosystem-waitlist-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        id="multi-ecosystem-waitlist-card"
        className="relative w-full max-w-2xl bg-[#090B10] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          id="waitlist-modal-close-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          /* SUCCESS VIEW */
          <div className="text-center py-6 space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(245,158,11,0.3)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                ALPHA EXPANSION COHORT CONFIRMED
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold font-heading text-white">
                You're On The Waitlist!
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                Thank you for joining. We have registered{' '}
                <strong className="text-white">{formData.appName || 'your B2B app'}</strong> for early access to our specialized multi-ecosystem growth & diagnostic engine.
              </p>
            </div>

            {/* VIP Pass Ticket Card */}
            <div className="p-5 rounded-xl bg-[#0F1420] border border-amber-500/20 text-left space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    Waitlist Ticket ID
                  </div>
                  <div className="font-mono text-base font-bold text-amber-400">{ticketId}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    Queue Position
                  </div>
                  <div className="font-mono text-base font-bold text-white">#{queuePosition}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Applicant:</span>
                  <span className="text-white font-medium">{formData.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Work Email:</span>
                  <span className="text-white font-medium truncate block">{formData.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Current Platform:</span>
                  <span className="text-white font-medium">{formData.currentPlatform}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Expansion Priority:</span>
                  <span className="text-white font-medium">{formData.primaryGoal}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5">
                <span className="text-slate-400 block text-[11px] mb-1.5">
                  Selected Target Marketplaces ({selectedEcosystems.length}):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedEcosystems.map((eco) => (
                    <span
                      key={eco}
                      className="px-2 py-0.5 rounded-md bg-amber-400/10 text-amber-300 border border-amber-400/25 text-[10px] font-medium"
                    >
                      {eco}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Founding Perks Box */}
            <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-slate-300 flex items-start gap-2.5 text-left">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-medium">Founding Member Guarantee:</strong>
                You'll receive a free baseline listing diagnostic and 50% discount on marketplace crawling tools as each ecosystem enters public beta.
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                id="waitlist-copy-ticket-btn"
                onClick={copyConfirmation}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {copiedTicket ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    Copied Confirmation!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Ticket Details
                  </>
                )}
              </button>

              <button
                id="waitlist-return-btn"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all cursor-pointer shadow-lg shadow-amber-500/20"
              >
                Return to Platform
              </button>
            </div>
          </div>
        ) : (
          /* FORM VIEW */
          <div>
            {/* Header */}
            <div className="mb-6 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  B2B Multi-Ecosystem Waitlist
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Phase 2 Expansion
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight">
                Expand Beyond a Single Marketplace
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Join our private waitlist for specialized ASO indexation, native UI design compliance, and listing conversion diagnostics for the world's leading enterprise and B2B software directories.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Target Ecosystems Selection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-white flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                    Select Target Marketplaces You Plan to Expand Into:
                    <span className="text-amber-400 text-[11px] font-mono ml-1">
                      ({selectedEcosystems.length} selected)
                    </span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={selectAllEcosystems}
                      className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
                    >
                      Select All
                    </button>
                    <span className="text-slate-600">•</span>
                    <button
                      type="button"
                      onClick={clearEcosystems}
                      className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-y-auto p-1 bg-black/40 border border-white/5 rounded-xl">
                  {AVAILABLE_ECOSYSTEMS.map((eco) => {
                    const isSelected = selectedEcosystems.includes(eco.name);
                    return (
                      <div
                        key={eco.id}
                        onClick={() => toggleEcosystem(eco.name)}
                        className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-500/50 text-white shadow-sm'
                            : 'bg-[#0F1420]/70 border-white/5 text-slate-300 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                              isSelected
                                ? 'bg-amber-500 border-amber-400 text-black'
                                : 'border-white/20 bg-black/30'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <div className="truncate">
                            <span className="font-medium text-xs block truncate">{eco.name}</span>
                            <span className="text-[10px] text-slate-400 block">{eco.category}</span>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-400 ml-1.5 shrink-0">
                          {eco.badge}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {selectedEcosystems.length === 0 && (
                  <p className="text-[11px] text-amber-400">
                    * Please select at least one marketplace to request priority access.
                  </p>
                )}
              </div>

              {/* Developer & App Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Your Full Name <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Morgan"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Work Email <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="alex@yourcompany.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    App / Company Name <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FlowSync B2B"
                    value={formData.appName}
                    onChange={(e) => setFormData({ ...formData, appName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    App Website / Current Listing URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://yourapp.com"
                    value={formData.appUrl}
                    onChange={(e) => setFormData({ ...formData, appUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Where is your app live today?
                  </label>
                  <select
                    value={formData.currentPlatform}
                    onChange={(e) => setFormData({ ...formData, currentPlatform: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400 transition-colors"
                  >
                    <option value="Shopify App Ecosystem">Shopify App Ecosystem</option>
                    <option value="Standalone Direct Web B2B App">Standalone Direct Web B2B App</option>
                    <option value="Chrome Web Extension">Chrome Web Extension</option>
                    <option value="Salesforce AppExchange">Salesforce AppExchange</option>
                    <option value="HubSpot Marketplace">HubSpot Marketplace</option>
                    <option value="Pre-launch / Building MVP">Pre-launch / Building MVP</option>
                    <option value="Other">Other Ecosystem</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Current Scale / MRR Band
                  </label>
                  <select
                    value={formData.stage}
                    onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400 transition-colors"
                  >
                    <option value="Pre-Revenue / Seed">Pre-Revenue / Seed Beta</option>
                    <option value="Under $10K MRR">Under $10K MRR</option>
                    <option value="$10K - $50K MRR">$10K - $50K MRR</option>
                    <option value="$50K - $200K MRR">$50K - $200K MRR</option>
                    <option value="$200K+ MRR / Series A+">$200K+ MRR / Enterprise</option>
                  </select>
                </div>
              </div>

              {/* Primary Expansion Need */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Primary Expansion Need
                </label>
                <select
                  value={formData.primaryGoal}
                  onChange={(e) => setFormData({ ...formData, primaryGoal: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400 transition-colors"
                >
                  <option value="Listing ASO & Search Keyword Discovery">
                    Listing ASO & Search Keyword Discovery
                  </option>
                  <option value="Passing Strict Marketplace Security & Review Audits">
                    Passing Strict Marketplace Security & Review Audits
                  </option>
                  <option value="Native Design Guidelines (Polaris / SLDS / Atlaskit)">
                    Native Design Guidelines (Polaris / SLDS / Atlaskit)
                  </option>
                  <option value="Marketplace Search Ads & Listing CRO">
                    Marketplace Search Ads & Listing CRO
                  </option>
                  <option value="Multi-Tenant Webhooks & SDK Architecture">
                    Multi-Tenant Webhooks & SDK Architecture
                  </option>
                  <option value="Full Cross-Listing Management">
                    Full Cross-Listing Management
                  </option>
                </select>
              </div>

              {/* Optional Notes */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Additional Notes or Specific Expansion Timeline (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Planning our Salesforce launch in Q3, looking for compliance and keyword advice..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              {/* Perks Banner */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5 text-xs text-slate-300">
                <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-semibold">Priority Developer Access:</span>{' '}
                  Joining grants you immediate access to alpha diagnostic crawlers, early benchmark data, and free listing audit blueprints upon launch.
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between pt-2">
                <div className="text-[11px] text-slate-400 font-mono">
                  🔒 Zero spam. We notify you solely when your selected ecosystems open.
                </div>

                <button
                  type="submit"
                  id="submit-waitlist-btn"
                  disabled={isSubmitting || selectedEcosystems.length === 0}
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/25"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Joining Waitlist...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Join Multi-Ecosystem Waitlist
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
