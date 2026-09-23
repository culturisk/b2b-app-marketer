import React, { useState, useMemo } from 'react';
import { ViewType } from '../types';
import {
  Calculator,
  Sliders,
  TrendingUp,
  ShieldCheck,
  Zap,
  Sparkles,
  ArrowRight,
  RotateCcw,
  DollarSign,
  Users,
  Percent,
  CheckCircle2,
  Calendar,
  Layers,
  BarChart3,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { D3GrowthTrajectoryChart, TrajectoryDataPoint } from '../components/D3GrowthTrajectoryChart';

interface RoiCalculatorViewProps {
  onNavigate: (view: ViewType) => void;
  onOpenBooking: (service?: string) => void;
}

export const RoiCalculatorView: React.FC<RoiCalculatorViewProps> = ({
  onNavigate,
  onOpenBooking,
}) => {
  // Inputs
  const [monthlyInstalls, setMonthlyInstalls] = useState<number>(400);
  const [appPrice, setAppPrice] = useState<number>(29);
  const [conversionRate, setConversionRate] = useState<number>(10); // % of installs that convert to paid
  const [monthlyChurn, setMonthlyChurn] = useState<number>(9); // % churn per month
  const [horizonMonths, setHorizonMonths] = useState<number>(12);

  // Chart Engine selector: 'd3' (default interactive D3.js vector engine) or 'recharts'
  const [chartEngine, setChartEngine] = useState<'d3' | 'recharts'>('d3');

  // Optimization Levers
  const [enablePolarisWizard, setEnablePolarisWizard] = useState<boolean>(true); // +25% activation
  const [enableAsoRefresh, setEnableAsoRefresh] = useState<boolean>(true); // +30% installs
  const [enableChurnRescue, setEnableChurnRescue] = useState<boolean>(true); // -35% churn

  // Calculate Monthly Cohort Model
  const calculation = useMemo(() => {
    // Effective parameters
    const baselineInstallRate = monthlyInstalls;
    const baselineConv = conversionRate / 100;
    const baselineChurnRate = monthlyChurn / 100;

    const optInstallRate = enableAsoRefresh
      ? Math.round(monthlyInstalls * 1.3)
      : monthlyInstalls;
    const optConv = enablePolarisWizard
      ? Math.min((conversionRate * 1.35) / 100, 0.45)
      : baselineConv;
    const optChurnRate = enableChurnRescue
      ? Math.max((monthlyChurn * 0.65) / 100, 0.02)
      : baselineChurnRate;

    const chartData: TrajectoryDataPoint[] = [];
    let curBaselinePaying = 0;
    let curOptPaying = 0;
    let cumulativeBaselineRev = 0;
    let cumulativeOptRev = 0;

    for (let m = 1; m <= horizonMonths; m++) {
      // Baseline
      const newBaselinePaying = baselineInstallRate * baselineConv;
      curBaselinePaying =
        curBaselinePaying * (1 - baselineChurnRate) + newBaselinePaying;
      const baselineMrr = Math.round(curBaselinePaying * appPrice);
      cumulativeBaselineRev += baselineMrr;

      // Optimized
      const newOptPaying = optInstallRate * optConv;
      curOptPaying = curOptPaying * (1 - optChurnRate) + newOptPaying;
      const optMrr = Math.round(curOptPaying * appPrice);
      cumulativeOptRev += optMrr;

      chartData.push({
        month: `Month ${m}`,
        monthIndex: m,
        BaselineMRR: baselineMrr,
        OptimizedMRR: optMrr,
        NetGain: optMrr - baselineMrr,
        BaselineCumulative: cumulativeBaselineRev,
        OptimizedCumulative: cumulativeOptRev,
        NetCumulativeGain: cumulativeOptRev - cumulativeBaselineRev,
        BaselinePaying: Math.round(curBaselinePaying),
        OptimizedPaying: Math.round(curOptPaying),
      });
    }

    const finalBaselineMrr = chartData[chartData.length - 1].BaselineMRR;
    const finalOptMrr = chartData[chartData.length - 1].OptimizedMRR;
    const netAddedMrr = finalOptMrr - finalBaselineMrr;
    const netAddedCumulativeRevenue =
      cumulativeOptRev - cumulativeBaselineRev;

    // LTV calculations
    const baselineLtv = Math.round(appPrice / baselineChurnRate);
    const optimizedLtv = Math.round(appPrice / optChurnRate);
    const ltvMultiplier = (optimizedLtv / baselineLtv).toFixed(1);

    return {
      chartData,
      finalBaselineMrr,
      finalOptMrr,
      netAddedMrr,
      cumulativeBaselineRev,
      cumulativeOptRev,
      netAddedCumulativeRevenue,
      baselineLtv,
      optimizedLtv,
      ltvMultiplier,
      optInstallRate,
      optConv: Math.round(optConv * 100),
      optChurn: (optChurnRate * 100).toFixed(1),
    };
  }, [
    monthlyInstalls,
    appPrice,
    conversionRate,
    monthlyChurn,
    horizonMonths,
    enablePolarisWizard,
    enableAsoRefresh,
    enableChurnRescue,
  ]);

  const handleReset = () => {
    setMonthlyInstalls(400);
    setAppPrice(29);
    setConversionRate(10);
    setMonthlyChurn(9);
    setHorizonMonths(12);
    setEnablePolarisWizard(true);
    setEnableAsoRefresh(true);
    setEnableChurnRescue(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#008060]/15 text-[#00a877] text-xs font-semibold uppercase tracking-wider border border-[#008060]/30">
          <Calculator className="w-3.5 h-3.5" />
          Interactive Financial Simulator
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-heading text-white tracking-tight">
          Shopify App Growth & Churn ROI Calculator
        </h1>
        <p className="text-sm text-zinc-400">
          Model how native Polaris onboarding (+35% activation), ASO listing refreshes (+30% installs), and review triggers (-35% churn) compound your recurring revenue.
        </p>
      </div>

      {/* Main Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Sliders & Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Sliders className="w-4 h-4 text-[#00a877]" />
                <span>Current Baseline Metrics</span>
              </div>
              <button
                onClick={handleReset}
                className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Slider 1: Installs */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-zinc-300 font-medium">
                <span>Monthly App Installs:</span>
                <span className="font-mono text-white font-bold">
                  {monthlyInstalls.toLocaleString()} installs
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="3000"
                step="50"
                value={monthlyInstalls}
                onChange={(e) => setMonthlyInstalls(Number(e.target.value))}
                className="w-full accent-[#008060] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                <span>50</span>
                <span>1,500</span>
                <span>3,000+</span>
              </div>
            </div>

            {/* Slider 2: Price */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-zinc-300 font-medium">
                <span>Average Monthly Subscription ($):</span>
                <span className="font-mono text-white font-bold">
                  ${appPrice}/mo
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="299"
                step="2"
                value={appPrice}
                onChange={(e) => setAppPrice(Number(e.target.value))}
                className="w-full accent-[#008060] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                <span>$5</span>
                <span>$99</span>
                <span>$299</span>
              </div>
            </div>

            {/* Slider 3: Conversion Rate */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-zinc-300 font-medium">
                <span>Install-to-Paid Activation (%):</span>
                <span className="font-mono text-white font-bold">
                  {conversionRate}%
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="35"
                step="1"
                value={conversionRate}
                onChange={(e) => setConversionRate(Number(e.target.value))}
                className="w-full accent-[#008060] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                <span>2% (High friction)</span>
                <span>10% (Avg)</span>
                <span>35% (High TTV)</span>
              </div>
            </div>

            {/* Slider 4: Churn */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-zinc-300 font-medium">
                <span>Monthly Churn Rate (%):</span>
                <span className="font-mono text-red-400 font-bold">
                  {monthlyChurn}%
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="20"
                step="0.5"
                value={monthlyChurn}
                onChange={(e) => setMonthlyChurn(Number(e.target.value))}
                className="w-full accent-red-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                <span>2% (Sticky)</span>
                <span>9% (Avg)</span>
                <span>20% (Leaky)</span>
              </div>
            </div>

            {/* Time Horizon */}
            <div className="pt-2">
              <div className="text-xs text-zinc-300 font-medium mb-1.5">
                Forecast Time Horizon:
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[6, 12, 24].map((m) => (
                  <button
                    key={m}
                    onClick={() => setHorizonMonths(m)}
                    className={`py-2 rounded-xl text-xs font-mono font-semibold border transition-colors ${
                      horizonMonths === m
                        ? 'bg-[#008060] text-white border-[#008060]'
                        : 'bg-[#09090B] text-zinc-400 border-zinc-800 hover:text-zinc-200'
                    }`}
                  >
                    {m} Months
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Optimization Levers Toggles */}
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 shadow-2xl space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#00a877]" />
              <span>Toggle ShopifyAppMarketer Levers</span>
            </div>

            <label className="flex items-start gap-3 p-3 rounded-xl bg-[#09090B] border border-zinc-800 hover:border-[#008060]/40 transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={enablePolarisWizard}
                onChange={(e) => setEnablePolarisWizard(e.target.checked)}
                className="rounded accent-[#008060] w-4 h-4 mt-0.5"
              />
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  Polaris 3-Step Setup Wizard
                  <span className="text-[10px] bg-[#008060]/20 text-[#00a877] px-1.5 py-0.5 rounded-full font-mono border border-[#008060]/30">
                    +35% Activation
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400">
                  Reduces Day-1 time-to-value to under 3 minutes.
                </div>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-xl bg-[#09090B] border border-zinc-800 hover:border-[#008060]/40 transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={enableAsoRefresh}
                onChange={(e) => setEnableAsoRefresh(e.target.checked)}
                className="rounded accent-[#008060] w-4 h-4 mt-0.5"
              />
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  ASO & PDP Listing Refresh
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded-full font-mono border border-blue-500/30">
                    +30% Installs
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400">
                  Search keyword ranking & high-contrast screenshot redesign.
                </div>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-xl bg-[#09090B] border border-zinc-800 hover:border-[#008060]/40 transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={enableChurnRescue}
                onChange={(e) => setEnableChurnRescue(e.target.checked)}
                className="rounded accent-[#008060] w-4 h-4 mt-0.5"
              />
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  Review Triggers & Exit Rescue
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded-full font-mono border border-purple-500/30">
                    -35% Churn
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400">
                  Pre-uninstall pause survey & automated 5-star review loops.
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Right Column: Recharts Visualization & Comparison */}
        <div className="lg:col-span-7 space-y-6">
          {/* Key Output Metrics Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800">
              <div className="text-xs text-zinc-400 uppercase font-semibold">
                Baseline Month {horizonMonths} MRR
              </div>
              <div className="text-2xl font-black font-mono text-zinc-300 mt-1">
                ${calculation.finalBaselineMrr.toLocaleString()}
              </div>
              <div className="text-[11px] text-zinc-500 mt-1">
                No optimization applied
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/50 border border-[#008060]/40 shadow-lg">
              <div className="text-xs text-[#00a877] uppercase font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#00a877]" />
                Optimized Month {horizonMonths} MRR
              </div>
              <div className="text-2xl font-black font-mono text-white mt-1">
                ${calculation.finalOptMrr.toLocaleString()}
              </div>
              <div className="text-[11px] text-[#00a877] font-mono font-semibold mt-1">
                +${calculation.netAddedMrr.toLocaleString()}/mo MRR Lift
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800">
              <div className="text-xs text-zinc-400 uppercase font-semibold">
                Merchant LTV Expansion
              </div>
              <div className="text-2xl font-black font-mono text-[#00a877] mt-1">
                ${calculation.optimizedLtv}{' '}
                <span className="text-xs font-normal text-zinc-400">
                  (vs ${calculation.baselineLtv})
                </span>
              </div>
              <div className="text-[11px] text-zinc-400 mt-1">
                {calculation.ltvMultiplier}x Lifetime Value Multiplier
              </div>
            </div>
          </div>

          {/* Visualization Engine Switcher Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl bg-zinc-900/60 border border-zinc-800">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setChartEngine('d3')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  chartEngine === 'd3'
                    ? 'bg-[#008060] text-white shadow-[0_0_15px_rgba(0,128,96,0.4)]'
                    : 'text-zinc-400 hover:text-white bg-transparent'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5 text-white" />
                <span>D3.js Growth Trajectory (Interactive)</span>
                <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded font-mono uppercase">
                  Active
                </span>
              </button>

              <button
                onClick={() => setChartEngine('recharts')}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                  chartEngine === 'recharts'
                    ? 'bg-[#008060] text-white shadow-[0_0_15px_rgba(0,128,96,0.4)]'
                    : 'text-zinc-400 hover:text-white bg-transparent'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Standard Area Chart</span>
              </button>
            </div>

            <div className="text-[11px] text-zinc-400 font-mono pr-2 hidden sm:block">
              {chartEngine === 'd3' ? 'Rendered with D3 v7 vector physics' : 'Rendered with Recharts SVG'}
            </div>
          </div>

          {/* D3.js Growth Trajectory Chart */}
          {chartEngine === 'd3' ? (
            <D3GrowthTrajectoryChart
              data={calculation.chartData}
              horizonMonths={horizonMonths}
              appPrice={appPrice}
              monthlyInstalls={monthlyInstalls}
              conversionRate={conversionRate}
              monthlyChurn={monthlyChurn}
              optConv={calculation.optConv}
              optChurn={calculation.optChurn}
            />
          ) : (
            /* Recharts Area Chart Fallback */
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 shadow-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
                <div>
                  <h3 className="text-lg font-bold font-heading text-white">
                    Monthly Recurring Revenue (MRR) Trajectory
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Comparing current baseline trajectory against full-funnel Polaris + ASO optimization.
                  </p>
                </div>
                <div className="text-right font-mono text-xs text-[#00a877] font-bold bg-[#008060]/15 border border-[#008060]/30 px-3 py-1 rounded-full">
                  +${calculation.netAddedCumulativeRevenue.toLocaleString()} Cumulative Added Revenue
                </div>
              </div>

              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={calculation.chartData}
                    margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorOpt"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#00a877"
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="95%"
                          stopColor="#00a877"
                          stopOpacity={0.0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorBase"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#71717a"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#71717a"
                          stopOpacity={0.0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.06)"
                    />
                    <XAxis
                      dataKey="month"
                      stroke="#71717a"
                      fontSize={11}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#71717a"
                      fontSize={11}
                      tickFormatter={(val) => `$${val / 1000}k`}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#09090B',
                        borderColor: 'rgba(255,255,255,0.15)',
                        borderRadius: '0.75rem',
                        fontSize: '12px',
                      }}
                      formatter={(value: any) => [
                        `$${Number(value).toLocaleString()}`,
                      ]}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Area
                      type="monotone"
                      dataKey="OptimizedMRR"
                      name="Optimized Growth Curve ($)"
                      stroke="#00a877"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorOpt)"
                    />
                    <Area
                      type="monotone"
                      dataKey="BaselineMRR"
                      name="Current Baseline ($)"
                      stroke="#71717a"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      fillOpacity={1}
                      fill="url(#colorBase)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Comparison Table */}
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-4">
            <h4 className="text-sm font-bold text-white">
              Growth Levers Impact Summary
            </h4>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400 font-mono">
                    <th className="pb-2">Metric</th>
                    <th className="pb-2">Baseline</th>
                    <th className="pb-2 text-[#00a877]">Optimized</th>
                    <th className="pb-2 text-right">Net Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-zinc-300">
                  <tr>
                    <td className="py-2.5 font-medium">Monthly Installs</td>
                    <td className="py-2.5 font-mono">{monthlyInstalls}</td>
                    <td className="py-2.5 font-mono text-[#00a877]">
                      {calculation.optInstallRate}
                    </td>
                    <td className="py-2.5 text-right font-mono text-[#00a877]">
                      +{calculation.optInstallRate - monthlyInstalls} / mo
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-medium">Day-1 Activation Rate</td>
                    <td className="py-2.5 font-mono">{conversionRate}%</td>
                    <td className="py-2.5 font-mono text-[#00a877]">
                      {calculation.optConv}%
                    </td>
                    <td className="py-2.5 text-right font-mono text-[#00a877]">
                      +{calculation.optConv - conversionRate}%
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-medium">Monthly Churn Rate</td>
                    <td className="py-2.5 font-mono text-red-400">
                      {monthlyChurn}%
                    </td>
                    <td className="py-2.5 font-mono text-[#00a877]">
                      {calculation.optChurn}%
                    </td>
                    <td className="py-2.5 text-right font-mono text-[#00a877]">
                      -{(monthlyChurn - Number(calculation.optChurn)).toFixed(1)}%
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-medium">
                      Month {horizonMonths} Recurring MRR
                    </td>
                    <td className="py-2.5 font-mono">
                      ${calculation.finalBaselineMrr.toLocaleString()}
                    </td>
                    <td className="py-2.5 font-mono text-[#00a877] font-bold">
                      ${calculation.finalOptMrr.toLocaleString()}
                    </td>
                    <td className="py-2.5 text-right font-mono text-[#00a877] font-bold">
                      +${calculation.netAddedMrr.toLocaleString()} / mo
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pt-3 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-zinc-400">
                Ready to turn this simulation into your app's actual roadmap?
              </span>
              <button
                onClick={() => onOpenBooking('ROI Growth Sprint Execution')}
                className="w-full sm:w-auto px-6 py-3 rounded-full font-bold text-xs text-white bg-[#008060] hover:bg-[#00a877] shadow-[0_0_20px_rgba(0,128,96,0.3)] transition-all flex items-center justify-center gap-2"
              >
                <span>Book Growth Architecture Call</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
