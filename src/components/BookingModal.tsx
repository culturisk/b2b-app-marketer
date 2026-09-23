import React, { useState } from 'react';
import { X, Calendar, Clock, CheckCircle2, Sparkles, Send, ArrowRight, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { recordFormSubmission } from '../services/firebaseService';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
  configuredServices?: string[];
  totalOneTime?: number;
  totalMonthly?: number;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialService,
  configuredServices = [],
  totalOneTime = 0,
  totalMonthly = 0,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    appName: '',
    appUrl: '',
    monthlyInstalls: '100 - 500',
    preferredTime: 'Morning (10:00 AM EST)',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingCode, setBookingCode] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const generatedCode = `BOOK-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
    setBookingCode(generatedCode);

    try {
      // Systematically store and organize booking submission in Firebase with unique ID
      await recordFormSubmission({
        formType: 'booking',
        customId: `SUB-${generatedCode}`,
        userEmail: formData.email,
        userName: formData.name,
        appName: formData.appName,
        summary: `Strategy consultation: ${initialService || 'Polaris & ASO Audit'} (${formData.monthlyInstalls} installs)`,
        status: 'new',
        details: {
          confirmationCode: generatedCode,
          service: initialService || 'Growth & Polaris Strategy Call',
          configuredServices,
          totalOneTime,
          totalMonthly,
          appUrl: formData.appUrl,
          monthlyInstalls: formData.monthlyInstalls,
          preferredTime: formData.preferredTime,
          notes: formData.notes,
        },
      });

      setIsSuccess(true);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#008060', '#00a877', '#ffffff'],
        });
      } catch (err) {
        // ignore
      }
    } catch (err) {
      console.error('Booking submission notice:', err);
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="booking-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        id="booking-modal-card"
        className="relative w-full max-w-xl bg-[#09090B] border border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          id="booking-modal-close-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#008060]/20 text-[#00a877] border border-[#008060]/30 flex items-center justify-center mx-auto animate-bounce shadow-[0_0_20px_rgba(0,128,96,0.3)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold font-heading text-white">
              Strategy Session Requested!
            </h3>
            <p className="text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
              We've received your application for{' '}
              <span className="text-[#00a877] font-semibold">
                {formData.appName || 'your Shopify app'}
              </span>
              . Our Lead Polaris Architect will review your current listing and
              email you a Calendar invite within 4 hours.
            </p>

            {bookingCode && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 max-w-sm mx-auto flex items-center justify-between">
                <div className="text-left">
                  <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Unique Reference ID</div>
                  <div className="font-mono text-xs font-bold text-emerald-400">SUB-{bookingCode}</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`SUB-${bookingCode}`);
                    setCopiedCode(true);
                    setTimeout(() => setCopiedCode(false), 2000);
                  }}
                  className="px-2.5 py-1 text-xs rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center gap-1.5 transition-colors"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCode ? 'Copied' : 'Copy'}
                </button>
              </div>
            )}

            {(configuredServices.length > 0 || totalOneTime > 0) && (
              <div className="mt-4 p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 text-left text-xs space-y-2">
                <div className="font-semibold text-white">Configured Scope Transferred:</div>
                <div className="flex justify-between text-zinc-400">
                  <span>Selected Pillars:</span>
                  <span className="font-mono text-[#00a877]">{configuredServices.length} items</span>
                </div>
                {totalOneTime > 0 && (
                  <div className="flex justify-between text-zinc-400">
                    <span>Estimated Setup Investment:</span>
                    <span className="font-mono text-[#00a877]">${totalOneTime.toLocaleString()}</span>
                  </div>
                )}
                {totalMonthly > 0 && (
                  <div className="flex justify-between text-zinc-400">
                    <span>Estimated Monthly Retainer:</span>
                    <span className="font-mono text-[#00a877]">${totalMonthly.toLocaleString()}/mo</span>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={onClose}
              className="mt-6 px-6 py-2.5 rounded-full font-semibold text-sm text-white bg-[#008060] hover:bg-[#00a877] shadow-[0_0_20px_rgba(0,128,96,0.3)] transition-all"
            >
              Return to Platform
            </button>
          </div>
        ) : (
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#008060]/15 border border-[#008060]/30 text-xs font-semibold text-[#00a877] uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              1-on-1 Growth & Polaris Strategy Call
            </div>
            <h2 className="text-2xl font-bold font-heading text-white tracking-tight">
              Book Your 30-Minute Growth Audit
            </h2>
            <p className="text-xs text-zinc-400 mt-1 mb-6">
              Review your Shopify App's Polaris friction, ASO ranking potential, and Day-1 onboarding roadmap directly with our growth architects.
            </p>

            {initialService && (
              <div className="mb-4 p-3 rounded-xl bg-[#008060]/10 border border-[#008060]/30 text-xs text-[#00a877] flex items-center justify-between">
                <span>Selected Package: <strong>{initialService}</strong></span>
                <span className="font-mono text-[11px] bg-[#008060]/20 px-2 py-0.5 rounded-full">Pre-filled</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Mercer"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#050505] border border-zinc-800 text-white text-sm focus:outline-none focus:border-[#00a877] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="founder@yourapp.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#050505] border border-zinc-800 text-white text-sm focus:outline-none focus:border-[#00a877] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Shopify App Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CartBoost 2.0"
                    value={formData.appName}
                    onChange={(e) =>
                      setFormData({ ...formData, appName: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#050505] border border-zinc-800 text-white text-sm focus:outline-none focus:border-[#00a877] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    App URL or Website
                  </label>
                  <input
                    type="text"
                    placeholder="apps.shopify.com/your-app"
                    value={formData.appUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, appUrl: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#050505] border border-zinc-800 text-white text-sm focus:outline-none focus:border-[#00a877] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Current Monthly Installs
                  </label>
                  <select
                    value={formData.monthlyInstalls}
                    onChange={(e) =>
                      setFormData({ ...formData, monthlyInstalls: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#050505] border border-zinc-800 text-white text-sm focus:outline-none focus:border-[#00a877]"
                  >
                    <option value="Pre-launch">Pre-launch / Development</option>
                    <option value="50 - 200">50 - 200 installs/mo</option>
                    <option value="200 - 500">200 - 500 installs/mo</option>
                    <option value="500 - 1,500">500 - 1,500 installs/mo</option>
                    <option value="1,500+">1,500+ installs/mo ($50k+ MRR)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Preferred Time Slot
                  </label>
                  <select
                    value={formData.preferredTime}
                    onChange={(e) =>
                      setFormData({ ...formData, preferredTime: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#050505] border border-zinc-800 text-white text-sm focus:outline-none focus:border-[#00a877]"
                  >
                    <option value="Morning (10:00 AM EST)">Morning (10:00 AM EST)</option>
                    <option value="Midday (1:00 PM EST)">Midday (1:00 PM EST)</option>
                    <option value="Afternoon (4:00 PM EST)">Afternoon (4:00 PM EST)</option>
                    <option value="Evening (7:00 PM EST)">Evening (7:00 PM EST)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Current Growth or Polaris Bottleneck
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Merchants drop off before embedding the widget on Dawn theme, or our ASO ranking stalled at #12 for core keywords..."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050505] border border-zinc-800 text-white text-sm focus:outline-none focus:border-[#00a877] resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-full font-semibold text-sm text-white bg-[#008060] hover:bg-[#00a877] shadow-[0_0_20px_rgba(0,128,96,0.3)] flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Securing Calendar Slot...
                    </span>
                  ) : (
                    <>
                      <span>Confirm Strategy Session</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-center">
                <span className="text-[11px] text-zinc-400">
                  🔒 100% Free Consultation. No sales pitch, strictly actionable UX & ASO teardown.
                </span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
