import React, { useState } from 'react';
import { ViewType, ProjectMilestone } from '../types';
import { CLIENT_PROJECT_DATA } from '../data/mockData';
import {
  LayoutDashboard,
  CheckCircle2,
  Clock,
  ExternalLink,
  Download,
  MessageSquare,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Zap,
  Users,
  Star,
  DollarSign,
  AlertCircle,
  FileCode,
  Send,
  Check,
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (view: ViewType) => void;
  onOpenBooking: (service?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenBooking,
}) => {
  const project = CLIENT_PROJECT_DATA;
  const [milestones, setMilestones] = useState<ProjectMilestone[]>(
    project.milestones
  );
  const [newComment, setNewComment] = useState<string>('');
  const [feedbackSent, setFeedbackSent] = useState<boolean>(false);

  const completedCount = milestones.filter((m) => m.status === 'completed').length;
  const progressPercent = Math.round((completedCount / milestones.length) * 100);

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setFeedbackSent(true);
    setNewComment('');
    setTimeout(() => setFeedbackSent(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Portal Header */}
      <div className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#008060]/15 border border-[#008060]/30 text-[#00a877] text-xs font-semibold uppercase tracking-wider">
            <LayoutDashboard className="w-3.5 h-3.5" />
            Active Client Workspace
          </div>
          <h1 className="text-3xl font-bold font-heading text-white">
            {project.appName} • Growth & Polaris Sprint
          </h1>
          <p className="text-xs text-zinc-400">
            Sprint Lead: <strong className="text-white">{project.leadStrategist}</strong> • Target Launch:{' '}
            <strong className="text-white">{project.targetCompletion}</strong>
          </p>
        </div>

        {/* Progress Bar & Status */}
        <div className="p-4 rounded-2xl bg-[#09090B] border border-zinc-800 min-w-[240px] space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-zinc-400">Sprint Progress:</span>
            <span className="text-[#00a877] font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#008060] h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(0,128,96,0.5)]"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <div className="text-[11px] text-zinc-500 text-right font-mono">
            {completedCount} of {milestones.length} Milestones Delivered
          </div>
        </div>
      </div>

      {/* Live Impact Analytics Telemetry */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-1">
          <div className="text-xs text-zinc-400 font-semibold flex items-center justify-between">
            <span>Install-to-Paid Activation</span>
            <Zap className="w-3.5 h-3.5 text-[#00a877]" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {project.metrics.activationRate}
          </div>
          <div className="text-[11px] text-[#00a877] font-mono">
            ▲ +14.2% since Polaris wizard
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-1">
          <div className="text-xs text-zinc-400 font-semibold flex items-center justify-between">
            <span>Shopify Ads ROAS</span>
            <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {project.metrics.searchAdsRoas}
          </div>
          <div className="text-[11px] text-blue-400 font-mono">
            ▲ 18.5% CPA reduction
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-1">
          <div className="text-xs text-zinc-400 font-semibold flex items-center justify-between">
            <span>New 5-Star Reviews</span>
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {project.metrics.fiveStarReviewsGained}
          </div>
          <div className="text-[11px] text-amber-400 font-mono">
            ▲ Automated milestone triggers
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-1">
          <div className="text-xs text-zinc-400 font-semibold flex items-center justify-between">
            <span>Uninstalls Prevented</span>
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {project.metrics.uninstallsPrevented}
          </div>
          <div className="text-[11px] text-purple-400 font-mono">
            ▲ Pre-uninstall pause modal
          </div>
        </div>
      </div>

      {/* Main Portal Body: Deliverables & Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Milestones Timeline */}
        <div className="lg:col-span-8 p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div>
              <h2 className="text-xl font-bold font-heading text-white">
                Sprint Deliverables & Polaris Assets
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Inspect live Figma design systems, theme app extensions, and ASO assets.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3.5 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 border border-zinc-700 flex items-center gap-1.5 transition-colors">
                <Download className="w-3.5 h-3.5" />
                <span>Export ZIP</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {milestones.map((m) => {
              const isDone = m.status === 'completed';
              const isInProgress = m.status === 'in_progress';
              return (
                <div
                  key={m.id}
                  className={`p-5 rounded-xl border transition-all ${
                    isDone
                      ? 'bg-[#008060]/10 border-[#008060]/40'
                      : isInProgress
                      ? 'bg-blue-500/10 border-blue-500/40 shadow-lg shadow-blue-500/5'
                      : 'bg-[#09090B] border-zinc-800 opacity-70'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      <div className="mt-0.5 shrink-0">
                        {isDone ? (
                          <div className="w-6 h-6 rounded-full bg-[#008060] text-white flex items-center justify-center shadow-[0_0_10px_rgba(0,128,96,0.4)]">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : isInProgress ? (
                          <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.4)]">
                            <Clock className="w-3.5 h-3.5 animate-spin" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-zinc-800 text-zinc-500 flex items-center justify-center text-xs font-mono">
                            {m.id}
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                            Pillar #{m.pillarId}
                          </span>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                              isDone
                                ? 'bg-[#008060]/20 text-[#00a877] border border-[#008060]/30'
                                : isInProgress
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                : 'bg-zinc-800 text-zinc-400'
                            }`}
                          >
                            {isDone
                              ? 'Delivered'
                              : isInProgress
                              ? 'In Active Review'
                              : 'Upcoming'}
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-white">
                          {m.title}
                        </h3>
                        <p className="text-xs text-zinc-400">
                          {m.description}
                        </p>
                      </div>
                    </div>

                    <div className="sm:text-right shrink-0 pl-10 sm:pl-0">
                      <div className="text-[11px] font-mono text-zinc-500">
                        Date: {m.date}
                      </div>
                      {m.link && (
                        <a
                          href={m.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-[#00a877] font-semibold hover:underline mt-1"
                        >
                          <span>{m.linkText || 'Open Asset'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Quick Strategist Communication & Figma Hub */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Feedback Card */}
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
              <MessageSquare className="w-3.5 h-3.5 text-[#00a877]" />
              <span>Direct Strategist Line</span>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Have feedback on the latest wireframes or need to tweak ad copy? Message your dedicated strategist below.
            </p>

            <form onSubmit={handleSendFeedback} className="space-y-3">
              <textarea
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Type your notes or design feedback..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#09090B] border border-zinc-800 text-white text-xs focus:outline-none focus:border-[#00a877] resize-none"
              />

              <button
                type="submit"
                className="w-full py-3 rounded-full font-bold text-xs text-white bg-[#008060] hover:bg-[#00a877] shadow-[0_0_20px_rgba(0,128,96,0.3)] transition-all flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Feedback</span>
              </button>

              {feedbackSent && (
                <div className="p-2 rounded-lg bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-[11px] text-center">
                  ✓ Feedback submitted to sprint board!
                </div>
              )}
            </form>
          </div>

          {/* Quick Links Card */}
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 shadow-2xl space-y-3 text-xs">
            <span className="font-bold text-white uppercase tracking-wider text-[11px] block">
              Sprint Bookmarks
            </span>
            <div className="space-y-2">
              <button
                onClick={() => onNavigate('preview-studio')}
                className="w-full p-3 rounded-xl bg-[#09090B] border border-zinc-800 text-zinc-300 hover:text-white flex items-center justify-between transition-colors"
              >
                <span>Live Polaris Admin Preview</span>
                <ExternalLink className="w-3 h-3 text-[#00a877]" />
              </button>
              <button
                onClick={() => onNavigate('roi-calculator')}
                className="w-full p-3 rounded-xl bg-[#09090B] border border-zinc-800 text-zinc-300 hover:text-white flex items-center justify-between transition-colors"
              >
                <span>Financial ROI Cohort Model</span>
                <ExternalLink className="w-3 h-3 text-[#00a877]" />
              </button>
              <button
                onClick={() => onNavigate('sequence-generator')}
                className="w-full p-3 rounded-xl bg-[#09090B] border border-zinc-800 text-zinc-300 hover:text-white flex items-center justify-between transition-colors"
              >
                <span>Email & Polaris Copy Generator</span>
                <ExternalLink className="w-3 h-3 text-[#00a877]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
