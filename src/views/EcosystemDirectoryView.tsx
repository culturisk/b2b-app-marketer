import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Layers,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  ShoppingBag,
  Building2,
  Cloud,
  Code2,
  MessageSquare,
  Palette,
  Coins,
  CheckCircle2,
  ChevronRight,
  Award,
} from 'lucide-react';
import { ALL_32_ECOSYSTEMS_METADATA, getEcosystemBySlug } from '../data/allEcosystemsRegistry';
import { ECOSYSTEM_CLUSTERS } from '../data/ecosystemsData';
import { ViewType } from '../types';

interface EcosystemDirectoryViewProps {
  onSelectEcosystem: (slug: string) => void;
  onOpenAudit: (ecosystemSlug?: string) => void;
  onOpenBooking: (service?: string) => void;
}

export const EcosystemDirectoryView: React.FC<EcosystemDirectoryViewProps> = ({
  onSelectEcosystem,
  onOpenAudit,
  onOpenBooking,
}) => {
  const [search, setSearch] = useState<string>('');
  const [selectedCluster, setSelectedCluster] = useState<string>('all');

  const filteredEcosystems = useMemo(() => {
    return ALL_32_ECOSYSTEMS_METADATA.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.marketplaceName.toLowerCase().includes(search.toLowerCase()) ||
        item.tagline.toLowerCase().includes(search.toLowerCase()) ||
        item.categoryName.toLowerCase().includes(search.toLowerCase());
      const matchCluster =
        selectedCluster === 'all' || item.categorySlug === selectedCluster;
      return matchSearch && matchCluster;
    }).map((item) => getEcosystemBySlug(item.slug));
  }, [search, selectedCluster]);

  const clusterIcons: Record<string, React.ReactNode> = {
    'e-commerce': <ShoppingBag className="w-4 h-4 text-[#00E5FF]" />,
    'crm-enterprise': <Building2 className="w-4 h-4 text-purple-400" />,
    'cloud-hyperscalers': <Cloud className="w-4 h-4 text-amber-400" />,
    'dev-work-os': <Code2 className="w-4 h-4 text-emerald-400" />,
    'collaboration': <MessageSquare className="w-4 h-4 text-cyan-400" />,
    'data-ai': <Sparkles className="w-4 h-4 text-blue-400" />,
    'creative-cms': <Palette className="w-4 h-4 text-rose-400" />,
    'fintech-hr': <Coins className="w-4 h-4 text-yellow-400" />,
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Directory Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0B132B] border border-white/10 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl space-y-6"
      >
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20">
            Ecosystem Taxonomy
          </span>
          <span className="text-xs text-slate-400 font-mono">
            Dedicated Growth Hubs • Vertical Clusters
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
          B2B Software Ecosystem Directory
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          Explore specialized growth architectures, algorithm ranking telemetry, compliance frameworks, and verified case studies across leading software marketplaces.
        </p>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search across marketplaces (e.g. Shopify, Salesforce, Jira, AWS, Chrome)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#131C35] border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#00E5FF] transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCluster}
              onChange={(e) => setSelectedCluster(e.target.value)}
              className="bg-[#131C35] border border-white/10 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-[#00E5FF] cursor-pointer"
            >
              <option value="all">All Vertical Clusters</option>
              {ECOSYSTEM_CLUSTERS.map((cl) => (
                <option key={cl.id} value={cl.id}>
                  {cl.name} ({cl.ecosystemCount})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Cluster Quick-Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-2">
          <button
            onClick={() => setSelectedCluster('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all border cursor-pointer ${
              selectedCluster === 'all'
                ? 'bg-[#00E5FF] text-[#070C1B] font-bold border-transparent'
                : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
            }`}
          >
            All Clusters
          </button>
          {ECOSYSTEM_CLUSTERS.map((cluster) => {
            const isSelected = selectedCluster === cluster.id;
            return (
              <button
                key={cluster.id}
                onClick={() => setSelectedCluster(cluster.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 border cursor-pointer ${
                  isSelected
                    ? 'bg-[#00E5FF] text-[#070C1B] font-bold border-transparent shadow-md'
                    : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                }`}
              >
                {clusterIcons[cluster.id]}
                <span>{cluster.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Grid of Ecosystems */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Showing {filteredEcosystems.length} Software Ecosystems</span>
          <span>Click any ecosystem to open dedicated growth hub</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredEcosystems.map((eco, idx) => (
              <motion.div
                key={eco.slug}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, delay: idx * 0.02 }}
                whileHover={{ y: -4 }}
                onClick={() => onSelectEcosystem(eco.slug)}
                className="bg-[#0B132B] border border-white/10 hover:border-[#00E5FF]/40 rounded-3xl p-6 space-y-4 transition-all duration-300 hover:shadow-2xl hover:shadow-[#00E5FF]/10 flex flex-col justify-between group cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shadow-sm"
                        style={{ backgroundColor: eco.accentColor }}
                      />
                      <span className="text-xs font-mono text-slate-400">
                        {eco.categoryName}
                      </span>
                    </div>

                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold text-white border border-white/20"
                      style={{ backgroundColor: `${eco.accentColor}80` }}
                    >
                      {eco.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-heading text-white group-hover:text-[#00E5FF] transition-colors">
                    {eco.marketplaceName}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {eco.tagline}
                  </p>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-[11px] font-mono">
                    <div className="bg-[#131C35] rounded-xl p-2 text-center">
                      <div className="text-slate-400 text-[10px]">Apps</div>
                      <div className="font-bold text-white mt-0.5 truncate">
                        {eco.marketStats.totalActiveApps}
                      </div>
                    </div>
                    <div className="bg-[#131C35] rounded-xl p-2 text-center">
                      <div className="text-slate-400 text-[10px]">Top CVR</div>
                      <div className="font-bold text-emerald-400 mt-0.5">
                        {eco.marketStats.top3Cvr}
                      </div>
                    </div>
                    <div className="bg-[#131C35] rounded-xl p-2 text-center">
                      <div className="text-slate-400 text-[10px]">Multiple</div>
                      <div className="font-bold text-[#00E5FF] mt-0.5">
                        {eco.marketStats.avgOrganicArrMultiple}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-[#00E5FF] font-semibold">
                  <div className="flex items-center gap-1">
                    <span>Explore Hub</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenAudit(eco.slug);
                    }}
                    className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
                  >
                    Run Audit
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
