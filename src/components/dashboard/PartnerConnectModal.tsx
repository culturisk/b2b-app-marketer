import React, { useState } from 'react';
import {
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  Key,
  Database,
  Radio,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';

interface PartnerConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PartnerConnectModal: React.FC<PartnerConnectModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [syncing, setSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('2 minutes ago');
  const [activeTab, setActiveTab] = useState<'status' | 'scopes' | 'webhooks'>('status');

  if (!isOpen) return null;

  const handleTriggerSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setLastSyncTime('Just now');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-[#09090B] border border-zinc-800 rounded-2xl shadow-2xl p-6 space-y-6 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#008060]/20 text-[#00a877] border border-[#008060]/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-heading text-white">
                Shopify Partner API & GraphQL Connect
              </h3>
              <p className="text-xs text-zinc-400">
                Partner Organization #4892019 • Live Production Sync
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl p-1 text-xs">
          <button
            onClick={() => setActiveTab('status')}
            className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'status'
                ? 'bg-[#008060] text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Sync Status
          </button>
          <button
            onClick={() => setActiveTab('scopes')}
            className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'scopes'
                ? 'bg-[#008060] text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            API Scopes (GraphQL)
          </button>
          <button
            onClick={() => setActiveTab('webhooks')}
            className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'webhooks'
                ? 'bg-[#008060] text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Real-time Webhooks
          </button>
        </div>

        {activeTab === 'status' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Connection Status:</span>
                <span className="flex items-center gap-1.5 text-[#00a877] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#00a877] animate-pulse" />
                  Connected & Verified (200 OK)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Shopify Partner Org:</span>
                <span className="font-mono text-zinc-200">ShopifyAppMarketer Labs LLC</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Tracked Live App:</span>
                <span className="font-mono text-zinc-200">CartBoost Pro (App ID: 894029)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Last Successful Sync:</span>
                <span className="font-mono text-emerald-400">{lastSyncTime}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#008060]/10 border border-[#008060]/20 flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-300">
                <ShieldCheck className="w-4 h-4 text-[#00a877]" />
                <span>Zero client secrets exposed. Fully sandboxed proxy.</span>
              </div>
              <button
                onClick={handleTriggerSync}
                disabled={syncing}
                className="px-3 py-1.5 rounded-lg bg-[#008060] hover:bg-[#00a877] text-white font-semibold transition-all flex items-center gap-1.5 cursor-pointer text-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                <span>{syncing ? 'Syncing...' : 'Force Sync Now'}</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'scopes' && (
          <div className="space-y-3 text-xs">
            <div className="space-y-2">
              {[
                { name: 'read_partner_app_earnings', desc: 'Shopify App payout & revenue reconciliation' },
                { name: 'read_merchant_installs', desc: 'Real-time install and uninstall lifecycle webhook streams' },
                { name: 'read_app_subscriptions', desc: 'Recurring application billing and tier upgrade events' },
                { name: 'read_themes', desc: 'Theme App Extension (TAE) activation verification' },
              ].map((scope) => (
                <div
                  key={scope.name}
                  className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between"
                >
                  <div>
                    <div className="font-mono text-zinc-200 font-bold">{scope.name}</div>
                    <div className="text-[11px] text-zinc-400">{scope.desc}</div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-[#00a877]" />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'webhooks' && (
          <div className="space-y-3 text-xs">
            <div className="space-y-2 font-mono">
              {[
                { topic: 'app/uninstalled', status: 'Active (0.0ms delay)', events: '12 events today' },
                { topic: 'app_subscriptions/update', status: 'Active (0.0ms delay)', events: '4 events today' },
                { topic: 'shop/update', status: 'Active (0.0ms delay)', events: '18 events today' },
              ].map((wh) => (
                <div
                  key={wh.topic}
                  className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between"
                >
                  <div>
                    <div className="text-white font-bold">{wh.topic}</div>
                    <div className="text-[10px] text-emerald-400">{wh.status}</div>
                  </div>
                  <span className="text-zinc-400 text-[10px]">{wh.events}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
