import React, { useState, useEffect } from 'react';
import {
  X,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Copy,
  Check,
  ExternalLink,
  Shield,
  Layers,
  Sparkles,
  RefreshCw,
  User,
  Calendar,
  CreditCard,
  Send,
  Database,
} from 'lucide-react';
import {
  FormSubmissionRecord,
  FormType,
  fetchUserSubmissions,
  getLocalStorageSubmissions,
  getOrCreateVisitorId,
  auth,
} from '../services/firebaseService';

interface SubmissionsHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWaitlist?: () => void;
  onOpenBooking?: () => void;
}

export const SubmissionsHistoryModal: React.FC<SubmissionsHistoryModalProps> = ({
  isOpen,
  onClose,
  onOpenWaitlist,
  onOpenBooking,
}) => {
  const [submissions, setSubmissions] = useState<FormSubmissionRecord[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmissionRecord | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const visitorId = getOrCreateVisitorId();
  const currentUser = auth.currentUser;

  const loadData = async () => {
    setIsLoading(true);
    try {
      const records = await fetchUserSubmissions();
      setSubmissions(records);
      if (records.length > 0 && !selectedSubmission) {
        setSelectedSubmission(records[0]);
      }
    } catch (e) {
      console.warn('Error loading submissions:', e);
      setSubmissions(getLocalStorageSubmissions());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredSubmissions = submissions.filter((item) => {
    const matchesFilter = selectedFilter === 'all' || item.formType === selectedFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.id.toLowerCase().includes(q) ||
      (item.appName && item.appName.toLowerCase().includes(q)) ||
      item.userEmail.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const getBadgeForType = (type: FormType) => {
    switch (type) {
      case 'waitlist':
        return {
          label: 'Waitlist',
          color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
          icon: Sparkles,
        };
      case 'booking':
        return {
          label: 'Strategy Booking',
          color: 'text-[#00a877] bg-[#008060]/10 border-[#008060]/30',
          icon: Calendar,
        };
      case 'audit':
        return {
          label: 'App Audit',
          color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
          icon: FileText,
        };
      case 'payment':
        return {
          label: 'Payment',
          color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
          icon: CreditCard,
        };
      default:
        return {
          label: type,
          color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
          icon: Layers,
        };
    }
  };

  return (
    <div
      id="submissions-history-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        id="submissions-history-modal-card"
        className="relative w-full max-w-5xl h-[90vh] max-h-[820px] bg-[#090C15] border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white"
      >
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 bg-[#0E1322] border-b border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#008060]/20 border border-[#008060]/40 flex items-center justify-center text-[#00a877]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold font-heading text-white">
                  My Form Submissions & Organized Records
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#008060]/20 text-[#00a877] border border-[#008060]/30">
                  Firebase Firestore
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Systematically organized details with persistent unique IDs for visitor{' '}
                <span className="font-mono text-zinc-300">{visitorId.slice(0, 16)}...</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={isLoading}
              title="Refresh from Firebase"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#00a877]' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 bg-[#0A0E1A] border-b border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Form Type Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'All Forms' },
              { id: 'waitlist', label: 'Waitlist' },
              { id: 'booking', label: 'Strategy Bookings' },
              { id: 'audit', label: 'App Audits' },
              { id: 'payment', label: 'Payments' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedFilter === tab.id
                    ? 'bg-[#008060] text-white shadow-md shadow-[#008060]/30'
                    : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by Unique ID, App, or Email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#008060] transition-colors"
            />
          </div>
        </div>

        {/* Main Split Layout: Left List + Right Details Inspector */}
        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Left Column: Submissions List */}
          <div className="md:col-span-5 border-r border-white/10 flex flex-col h-full overflow-hidden bg-[#070A12]">
            <div className="p-3 bg-black/20 border-b border-white/5 flex items-center justify-between text-xs text-zinc-400">
              <span>
                Found <strong className="text-white">{filteredSubmissions.length}</strong> records
              </span>
              <span className="text-[11px] text-zinc-500">Sorted by newest</span>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {filteredSubmissions.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3 text-zinc-500">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-semibold text-zinc-300">No Submissions Recorded Yet</h4>
                  <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto">
                    Submit the Waitlist form, book a Strategy Session, or run an App Audit to see your submissions organized here in real-time.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    {onOpenWaitlist && (
                      <button
                        onClick={() => {
                          onClose();
                          onOpenWaitlist();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-colors"
                      >
                        Join Waitlist
                      </button>
                    )}
                    {onOpenBooking && (
                      <button
                        onClick={() => {
                          onClose();
                          onOpenBooking();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#008060] hover:bg-[#00a877] text-white text-xs font-bold transition-colors"
                      >
                        Book Call
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                filteredSubmissions.map((sub) => {
                  const badge = getBadgeForType(sub.formType);
                  const Icon = badge.icon;
                  const isSelected = selectedSubmission?.id === sub.id;

                  return (
                    <div
                      key={sub.id}
                      onClick={() => setSelectedSubmission(sub)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left ${
                        isSelected
                          ? 'bg-[#0E1528] border-[#008060] shadow-lg shadow-[#008060]/10 ring-1 ring-[#008060]/30'
                          : 'bg-white/[0.03] border-white/5 hover:border-white/20 hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.color}`}
                        >
                          <Icon className="w-2.5 h-2.5" />
                          {badge.label}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {new Date(sub.submittedAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      <div className="font-semibold text-xs text-white truncate mb-1">
                        {sub.appName || sub.summary}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                        <span className="truncate max-w-[170px] text-zinc-300">{sub.id}</span>
                        <span className="capitalize px-1.5 py-0.2 rounded bg-white/5 text-zinc-400 text-[10px]">
                          {sub.status}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Detailed Document Inspector */}
          <div className="md:col-span-7 flex flex-col h-full overflow-hidden bg-[#090D18]">
            {selectedSubmission ? (
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
                {/* Header Strip */}
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">
                        Document Reference
                      </div>
                      <div className="font-mono text-sm sm:text-base font-bold text-white flex items-center gap-2">
                        <span>{selectedSubmission.id}</span>
                        <button
                          onClick={() => handleCopy(selectedSubmission.id)}
                          className="p-1 rounded bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-colors"
                          title="Copy ID"
                        >
                          {copiedId === selectedSubmission.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Status: {selectedSubmission.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed border-t border-white/5 pt-2">
                    {selectedSubmission.summary}
                  </p>
                </div>

                {/* Primary Identifiers Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/10">
                    <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
                      Submitter Contact
                    </div>
                    <div className="text-xs font-bold text-white mt-0.5 truncate">
                      {selectedSubmission.userEmail}
                    </div>
                    {selectedSubmission.userName && (
                      <div className="text-[11px] text-zinc-400 truncate">
                        Name: {selectedSubmission.userName}
                      </div>
                    )}
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/10">
                    <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
                      Target App / Product
                    </div>
                    <div className="text-xs font-bold text-white mt-0.5 truncate">
                      {selectedSubmission.appName || 'B2B Software'}
                    </div>
                    <div className="text-[11px] text-zinc-400 truncate">
                      Form Category: {selectedSubmission.formType}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/10">
                    <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
                      Device / Visitor Identity
                    </div>
                    <div className="font-mono text-xs text-zinc-300 mt-0.5 truncate">
                      {selectedSubmission.visitorId}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/10">
                    <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
                      Submission Timestamp
                    </div>
                    <div className="text-xs text-zinc-300 mt-0.5">
                      {new Date(selectedSubmission.submittedAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Detailed Payload Breakdown */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                      Organized Form Details & Parameters
                    </h3>
                    <span className="text-[10px] font-mono text-zinc-500">
                      JSON Schema Validated
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#050810] border border-white/10 space-y-3">
                    {Object.entries(selectedSubmission.details || {}).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 py-1.5 border-b border-white/5 last:border-0"
                      >
                        <span className="text-xs font-mono text-zinc-400 capitalize">
                          {key.replace(/([A-Z])/g, ' $1')}:
                        </span>
                        <span className="text-xs font-medium text-white break-all max-w-sm text-right">
                          {Array.isArray(value)
                            ? value.join(', ')
                            : typeof value === 'object' && value !== null
                            ? JSON.stringify(value)
                            : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Database Synchronization Notice */}
                <div className="p-3.5 rounded-xl bg-[#008060]/10 border border-[#008060]/20 flex items-center justify-between gap-3 text-xs text-zinc-300">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#00a877]" />
                    <span>Synchronized with cloud Firestore collection: </span>
                    <code className="font-mono text-[#00a877]">/submissions/{selectedSubmission.id}</code>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-6 text-center text-zinc-500">
                <div>
                  <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-xs">Select any submission from the left list to view details.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
