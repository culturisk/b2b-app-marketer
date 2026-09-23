import React, { useState } from 'react';
import { ViewType, PricingServiceItem } from '../types';
import { PRICING_SERVICES } from '../data/mockData';
import {
  DollarSign,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Clock,
  Check,
  ShoppingBag,
} from 'lucide-react';

interface PricingViewProps {
  onNavigate: (view: ViewType) => void;
  onOpenBooking: (
    service?: string,
    configuredServices?: string[],
    totalOneTime?: number,
    totalMonthly?: number
  ) => void;
}

export const PricingView: React.FC<PricingViewProps> = ({
  onNavigate,
  onOpenBooking,
}) => {
  // Selected Service IDs
  const [selectedIds, setSelectedIds] = useState<string[]>([
    'polaris-audit',
    'onboarding-ttv',
    'aso-refresh',
  ]);

  const toggleService = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectAll = () => {
    setSelectedIds(PRICING_SERVICES.map((s) => s.id));
  };

  const clearAll = () => {
    setSelectedIds([]);
  };

  // Calculations
  const selectedServices = PRICING_SERVICES.filter((s) =>
    selectedIds.includes(s.id)
  );

  const totalOneTime = selectedServices
    .filter((s) => s.type === 'one_time')
    .reduce((acc, curr) => acc + curr.price, 0);

  const totalMonthly = selectedServices
    .filter((s) => s.type === 'monthly')
    .reduce((acc, curr) => acc + curr.price, 0);

  const estimatedDays = selectedServices.reduce((acc, curr) => {
    const days = parseInt(curr.turnaround) || 3;
    return Math.max(acc, days);
  }, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 text-white">
      {/* Header - High Contrast Shopify Style */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#008060]/20 text-[#00a877] text-xs font-semibold uppercase tracking-wider border border-[#008060]/30 font-mono">
          <ShoppingBag className="w-3.5 h-3.5" />
          Transparent Shopify Retainers & Sprints
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
          Shopify Growth Sprint Configurator
        </h1>
        <p className="text-sm text-slate-300">
          Build a tailored engagement across our Shopify App growth services. Select the exact deliverables you need with zero bloated agency overhead.
        </p>

        {/* Quick action buttons */}
        <div className="pt-2 flex items-center justify-center gap-3 text-xs font-medium">
          <button
            onClick={selectAll}
            className="text-[#00a877] hover:underline cursor-pointer"
          >
            Select All Services (Full Growth Suite)
          </button>
          <span className="text-slate-600">•</span>
          <button onClick={clearAll} className="text-slate-400 hover:text-white cursor-pointer">
            Clear Selection
          </button>
        </div>
      </div>

      {/* Main Configurator Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Modular Service Cards */}
        <div className="lg:col-span-8 space-y-4">
          {PRICING_SERVICES.map((service) => {
            const isSelected = selectedIds.includes(service.id);
            return (
              <div
                key={service.id}
                id={`pricing-card-${service.id}`}
                onClick={() => toggleService(service.id)}
                className={`p-6 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isSelected
                    ? 'bg-[#121826] border-[#008060] text-white shadow-xl shadow-[#008060]/10'
                    : 'bg-[#0A0E17] border-white/10 text-slate-300 hover:border-white/20'
                }`}
              >
                <div className="flex items-start gap-4 flex-1">
                  {/* Custom Checkbox */}
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isSelected
                        ? 'bg-[#008060] text-white shadow-md'
                        : 'border border-white/30 bg-black'
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/10 text-slate-300 border border-white/10">
                        {service.type === 'one_time' ? 'One-Time Sprint' : 'Monthly Retainer'}
                      </span>
                      {service.recommended && (
                        <span className="text-[10px] font-bold bg-[#008060]/20 text-[#00a877] px-2 py-0.5 rounded-full font-mono border border-[#008060]/30">
                          ★ High Impact
                        </span>
                      )}
                    </div>

                    <h3
                      className={`text-base font-bold font-heading ${
                        isSelected ? 'text-white' : 'text-slate-200'
                      }`}
                    >
                      {service.name}
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Features list */}
                    <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-300">
                      {service.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#00a877] shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price & Turnaround Badge */}
                <div className="text-left sm:text-right shrink-0 pt-2 sm:pt-0 pl-10 sm:pl-0">
                  <div className="text-xl font-black font-mono text-white">
                    ${service.price.toLocaleString()}
                    {service.type === 'monthly' && (
                      <span className="text-xs text-slate-400 font-normal">
                        /mo
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center sm:justify-end gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{service.turnaround}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Live Sticky Summary Box */}
        <div className="lg:col-span-4 sticky top-20">
          <div className="p-7 rounded-3xl bg-[#0A0E17] border border-white/15 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#00a877]" />
                Investment Summary
              </span>
              <span className="text-xs font-mono text-[#00a877] font-bold bg-[#008060]/20 border border-[#008060]/30 px-2.5 py-0.5 rounded-full">
                {selectedServices.length} Selected
              </span>
            </div>

            {/* Selected items breakdown */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-xs">
              {selectedServices.length === 0 ? (
                <div className="text-slate-400 italic text-center py-4">
                  No services selected yet. Toggle any card on the left.
                </div>
              ) : (
                selectedServices.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center text-slate-300 py-1 border-b border-white/5 text-[11px]"
                  >
                    <span className="truncate max-w-[180px]">{item.name}</span>
                    <span className="font-mono font-semibold text-white">
                      ${item.price.toLocaleString()}
                      {item.type === 'monthly' ? '/mo' : ''}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Totals Box */}
            <div className="pt-3 border-t border-white/10 space-y-2 text-xs">
              {totalOneTime > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">One-Time Sprints:</span>
                  <span className="font-bold text-white font-mono text-sm">
                    ${totalOneTime.toLocaleString()}
                  </span>
                </div>
              )}
              {totalMonthly > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Monthly Growth Retainer:</span>
                  <span className="font-bold text-[#00a877] font-mono text-sm">
                    ${totalMonthly.toLocaleString()}/mo
                  </span>
                </div>
              )}
              {estimatedDays > 0 && (
                <div className="flex justify-between items-center text-slate-400 text-[11px]">
                  <span>Estimated First Delivery:</span>
                  <span className="font-mono text-slate-200">
                    Within {estimatedDays} Business Days
                  </span>
                </div>
              )}
            </div>

            {/* CTA Button */}
            <button
              id="pricing-book-btn"
              onClick={() =>
                onOpenBooking(
                  'Custom Shopify Growth Sprint Package',
                  selectedServices.map((s) => s.name),
                  totalOneTime,
                  totalMonthly
                )
              }
              disabled={selectedServices.length === 0}
              className="w-full py-3.5 rounded-2xl bg-[#008060] hover:bg-[#009973] disabled:opacity-40 disabled:pointer-events-none text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#008060]/30 cursor-pointer"
            >
              <span>Book Growth Package</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-[11px] text-slate-400 text-center leading-relaxed">
              Transparent scope. No 12-month lock-ins. Direct async Slack channel with our Shopify growth engineers.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
