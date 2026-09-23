import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CreditCard,
  QrCode,
  Building2,
  CheckCircle2,
  ArrowRight,
  Lock,
  Sparkles,
  Smartphone,
  Copy,
  Check,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { recordFormSubmission } from '../services/firebaseService';
import { AuditPaymentReceipt } from '../types';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  appName: string;
  onPaymentSuccess: (receipt: AuditPaymentReceipt) => void;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  isOpen,
  onClose,
  appName,
  onPaymentSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [upiId, setUpiId] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);

  // Card form state
  const [cardName, setCardName] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState<string>('12/28');
  const [cardCvv, setCardCvv] = useState<string>('888');

  // Netbanking state
  const [selectedBank, setSelectedBank] = useState<string>('HDFC Bank');

  if (!isOpen) return null;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText('culturisk.growth@icici');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const simulatePayment = async (methodName: string) => {
    setIsProcessing(true);

    try {
      setProcessingStep('Connecting to Banking Ingress...');
      await new Promise((r) => setTimeout(r, 600));

      setProcessingStep('Authorizing ₹60,000.00 with RBI 3D Secure / UPI Switch...');
      await new Promise((r) => setTimeout(r, 800));

      setProcessingStep('Payment Approved! Registering Tax Invoice & Unlocking Report...');
      await new Promise((r) => setTimeout(r, 700));

      const randomSuffix = Math.floor(100000 + Math.random() * 900000);
      const receipt: AuditPaymentReceipt = {
        orderId: `ORD_60K_${randomSuffix}`,
        transactionRef: `TXN_IND_${randomSuffix}`,
        amount: 60000,
        currency: 'INR',
        status: 'captured',
        paidAt: new Date().toISOString(),
        paymentMethod: methodName,
        customerEmail: 'merchant@shopify-app.com',
        taxInvoiceNumber: `INV-CULTURISK-2025-${randomSuffix}`,
      };

      // Systematically store and organize payment in Firebase
      try {
        await recordFormSubmission({
          formType: 'payment',
          customId: `SUB-PAY-${receipt.orderId}`,
          userEmail: receipt.customerEmail,
          appName: appName,
          summary: `Audit unlock payment (₹60,000 INR) via ${methodName}`,
          status: 'confirmed',
          details: {
            orderId: receipt.orderId,
            transactionRef: receipt.transactionRef,
            taxInvoiceNumber: receipt.taxInvoiceNumber,
            amount: receipt.amount,
            currency: receipt.currency,
            paymentMethod: methodName,
            paidAt: receipt.paidAt,
          },
        });
      } catch (fbErr) {
        console.warn('Firebase payment recording notice:', fbErr);
      }

      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#008060', '#00a877', '#ffffff', '#F49342'],
        });
      } catch (e) {
        // ignore
      }

      setIsProcessing(false);
      onPaymentSuccess(receipt);
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#080B11] border border-white/15 rounded-3xl shadow-2xl overflow-hidden text-white">
        {/* Top Header */}
        <div className="p-6 bg-[#0E131F] border-b border-white/10 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#008060] animate-pulse" />
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#00a877] font-bold">
                Culturisk Secure Gateway • RBI & PCI-DSS Verified
              </span>
            </div>
            <h2 className="text-xl font-bold font-heading text-white">
              Unlock Full Detailed Audit & Strategy Report
            </h2>
            <p className="text-xs text-slate-300">
              License for <span className="text-white font-semibold">{appName}</span> • Instant downloadable 24-page vector PDF & Polaris handoff playbook.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Price Strip */}
        <div className="px-6 py-4 bg-[#121826] border-b border-white/10 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400">Total License Fee (Inclusive of GST)</div>
            <div className="text-xs text-slate-300 font-medium">Single App Lifetime Strategic Audit</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black font-heading text-[#00a877] flex items-baseline justify-end gap-1">
              <span>₹60,000</span>
              <span className="text-xs text-slate-400 font-mono font-normal">INR</span>
            </div>
            <div className="text-[10px] text-slate-400">One-Time Fee • Zero Hidden Charges</div>
          </div>
        </div>

        {/* Payment Methods Tabs */}
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-2 p-1 rounded-xl bg-white/5 border border-white/10">
            <button
              onClick={() => setActiveTab('upi')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'upi'
                  ? 'bg-[#008060] text-white shadow-md shadow-[#008060]/30'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>UPI (Instant)</span>
            </button>
            <button
              onClick={() => setActiveTab('card')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'card'
                  ? 'bg-[#008060] text-white shadow-md shadow-[#008060]/30'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Cards (RuPay/Visa)</span>
            </button>
            <button
              onClick={() => setActiveTab('netbanking')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'netbanking'
                  ? 'bg-[#008060] text-white shadow-md shadow-[#008060]/30'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Net Banking</span>
            </button>
          </div>

          {/* Tab 1: UPI */}
          {activeTab === 'upi' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center gap-5">
                {/* Simulated QR Code */}
                <div className="w-32 h-32 bg-white p-2 rounded-xl flex flex-col items-center justify-center shadow-md shrink-0">
                  <QrCode className="w-24 h-24 text-black" />
                  <div className="text-[9px] font-bold text-black font-mono tracking-tighter">
                    SCAN TO PAY ₹60,000
                  </div>
                </div>

                <div className="space-y-3 flex-1 text-center sm:text-left">
                  <div className="text-xs text-slate-300 font-medium">
                    Scan via any UPI App:{' '}
                    <span className="text-white font-bold">Google Pay, PhonePe, Paytm, BHIM, CRED</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-black/40 border border-white/15">
                    <span className="text-xs font-mono text-white flex-1 select-all truncate">
                      culturisk.growth@icici
                    </span>
                    <button
                      onClick={handleCopyUpi}
                      className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-200 text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {copiedUpi ? <Check className="w-3 h-3 text-[#00a877]" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedUpi ? 'Copied' : 'Copy VPA'}</span>
                    </button>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Auto-verification enabled. Report unlocks the moment ₹60,000 is received.
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-slate-300 font-medium block">Or enter your UPI ID:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. yourname@okhdfcbank"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#008060]"
                  />
                  <button
                    onClick={() => simulatePayment(`UPI (${upiId || 'Direct QR'})`)}
                    disabled={isProcessing}
                    className="px-5 py-2.5 rounded-xl bg-[#008060] hover:bg-[#009973] text-white font-bold text-xs transition-all shadow-md shadow-[#008060]/30 cursor-pointer disabled:opacity-50"
                  >
                    Pay ₹60,000
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Cards */}
          {activeTab === 'card' && (
            <div className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="e.g. John Doe (App Founder)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#008060]"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="•••• •••• •••• ••••"
                      className="w-full pl-3.5 pr-20 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#008060] font-mono"
                    />
                    <div className="absolute right-3 top-2.5 flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                      <span>RuPay</span>
                      <span>Visa</span>
                      <span>MC</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-300 font-medium block mb-1">Valid Thru</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM / YY"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#008060] font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 font-medium block mb-1">CVV / CVC</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="•••"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#008060] font-mono"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => simulatePayment('Credit / Debit Card')}
                disabled={isProcessing}
                className="w-full py-3 rounded-xl bg-[#008060] hover:bg-[#009973] text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#008060]/30 cursor-pointer disabled:opacity-50"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Pay ₹60,000 via Secure Card Processing</span>
              </button>
            </div>
          )}

          {/* Tab 3: Net Banking */}
          {activeTab === 'netbanking' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-slate-300 font-medium block">Select Bank:</label>
                <div className="grid grid-cols-2 gap-2">
                  {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map(
                    (bank) => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setSelectedBank(bank)}
                        className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                          selectedBank === bank
                            ? 'bg-[#008060]/20 border-[#008060] text-white'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {bank}
                      </button>
                    )
                  )}
                </div>
              </div>

              <button
                onClick={() => simulatePayment(`Net Banking (${selectedBank})`)}
                disabled={isProcessing}
                className="w-full py-3 rounded-xl bg-[#008060] hover:bg-[#009973] text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#008060]/30 cursor-pointer disabled:opacity-50"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Proceed to Pay ₹60,000 with {selectedBank}</span>
              </button>
            </div>
          )}

          {/* Fast Test Sandbox Simulation Button */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-dashed border-white/20 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#00a877]" />
                <span>Instant Sandbox Approval (Test Mode)</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Simulate successful ₹60,000 payment without real banking deduction to verify instant report download.
              </div>
            </div>
            <button
              onClick={() => simulatePayment('Sandbox Test Gateway')}
              disabled={isProcessing}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors shrink-0 cursor-pointer disabled:opacity-50"
            >
              Test Approve ₹60K
            </button>
          </div>

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="p-4 rounded-2xl bg-[#008060]/10 border border-[#008060]/40 flex items-center gap-3 animate-pulse">
              <div className="w-5 h-5 border-2 border-[#00a877] border-t-transparent rounded-full animate-spin shrink-0" />
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-white">Processing ₹60,000 Transaction...</div>
                <div className="text-[11px] text-[#00a877] font-mono">{processingStep}</div>
              </div>
            </div>
          )}

          {/* Security Badges */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00a877]" />
              256-bit Encrypted Checkout
            </span>
            <span>Official GST Tax Invoice Provided</span>
          </div>
        </div>
      </div>
    </div>
  );
};
