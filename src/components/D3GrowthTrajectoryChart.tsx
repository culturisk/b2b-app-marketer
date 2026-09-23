import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3';
import {
  TrendingUp,
  DollarSign,
  Users,
  Layers,
  Sparkles,
  Download,
  Info,
  Maximize2,
  CheckCircle2,
} from 'lucide-react';

export interface TrajectoryDataPoint {
  month: string;
  monthIndex: number;
  BaselineMRR: number;
  OptimizedMRR: number;
  NetGain: number;
  BaselineCumulative: number;
  OptimizedCumulative: number;
  NetCumulativeGain: number;
  BaselinePaying: number;
  OptimizedPaying: number;
}

interface D3GrowthTrajectoryChartProps {
  data: TrajectoryDataPoint[];
  horizonMonths: number;
  appPrice: number;
  monthlyInstalls: number;
  conversionRate: number;
  monthlyChurn: number;
  optConv: number;
  optChurn: string;
}

type MetricMode = 'mrr' | 'cumulative' | 'merchants';

export const D3GrowthTrajectoryChart: React.FC<D3GrowthTrajectoryChartProps> = ({
  data,
  horizonMonths,
  appPrice,
  monthlyInstalls,
  conversionRate,
  monthlyChurn,
  optConv,
  optChurn,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // View Controls
  const [metricMode, setMetricMode] = useState<MetricMode>('mrr');
  const [showSurplusShading, setShowSurplusShading] = useState<boolean>(true);
  const [showBaseline, setShowBaseline] = useState<boolean>(true);
  const [hoveredPoint, setHoveredPoint] = useState<TrajectoryDataPoint | null>(null);
  const [hoverCoords, setHoverCoords] = useState<{ x: number; y: number } | null>(null);

  // Dimensions
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 680,
    height: 340,
  });

  // Observe container size
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width } = entries[0].contentRect;
      if (width > 0) {
        setDimensions({
          width,
          height: Math.max(320, Math.min(420, Math.round(width * 0.48))),
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Summary statistics for active mode
  const summary = useMemo(() => {
    if (!data || data.length === 0) return null;
    const last = data[data.length - 1];

    if (metricMode === 'mrr') {
      return {
        unit: '$',
        baselineEnd: last.BaselineMRR,
        optEnd: last.OptimizedMRR,
        lift: last.NetGain,
        pctLift: last.BaselineMRR > 0 ? Math.round(((last.OptimizedMRR - last.BaselineMRR) / last.BaselineMRR) * 100) : 0,
        title: 'Monthly Recurring Revenue (MRR)',
        subtitle: 'Trajectory of active monthly subscriptions compounding over time',
      };
    } else if (metricMode === 'cumulative') {
      return {
        unit: '$',
        baselineEnd: last.BaselineCumulative,
        optEnd: last.OptimizedCumulative,
        lift: last.NetCumulativeGain,
        pctLift: last.BaselineCumulative > 0 ? Math.round(((last.OptimizedCumulative - last.BaselineCumulative) / last.BaselineCumulative) * 100) : 0,
        title: 'Cumulative Total Cashflow',
        subtitle: 'Aggregate gross subscription revenue captured over the forecast window',
      };
    } else {
      return {
        unit: '',
        baselineEnd: last.BaselinePaying,
        optEnd: last.OptimizedPaying,
        lift: last.OptimizedPaying - last.BaselinePaying,
        pctLift: last.BaselinePaying > 0 ? Math.round(((last.OptimizedPaying - last.BaselinePaying) / last.BaselinePaying) * 100) : 0,
        title: 'Paying Active Merchants',
        subtitle: 'Number of retained paying merchant stores on paid tiers',
      };
    }
  }, [data, metricMode]);

  // Primary D3 Chart Renderer
  useEffect(() => {
    if (!svgRef.current || !data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const { width, height } = dimensions;
    const margin = { top: 28, right: 32, bottom: 45, left: metricMode === 'merchants' ? 50 : 64 };
    const innerWidth = Math.max(10, width - margin.left - margin.right);
    const innerHeight = Math.max(10, height - margin.top - margin.bottom);

    // Value extractors based on metricMode
    const getOptVal = (d: TrajectoryDataPoint) => {
      if (metricMode === 'mrr') return d.OptimizedMRR;
      if (metricMode === 'cumulative') return d.OptimizedCumulative;
      return d.OptimizedPaying;
    };

    const getBaseVal = (d: TrajectoryDataPoint) => {
      if (metricMode === 'mrr') return d.BaselineMRR;
      if (metricMode === 'cumulative') return d.BaselineCumulative;
      return d.BaselinePaying;
    };

    // Scales
    const xScale = d3
      .scaleLinear()
      .domain([1, horizonMonths])
      .range([0, innerWidth]);

    const maxVal = Math.max(
      ...data.map((d) => Math.max(getOptVal(d), getBaseVal(d))),
      1000
    );
    const yScale = d3
      .scaleLinear()
      .domain([0, maxVal * 1.12])
      .nice()
      .range([innerHeight, 0]);

    // Defs & Gradients
    const defs = svg.append('defs');

    // Emerald Glow Gradient (Optimized area)
    const optAreaGradient = defs
      .append('linearGradient')
      .attr('id', 'd3-emerald-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    optAreaGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#00a877')
      .attr('stop-opacity', 0.45);

    optAreaGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#00a877')
      .attr('stop-opacity', 0.0);

    // Surplus Delta Gradient (Difference between Opt and Base)
    const surplusGradient = defs
      .append('linearGradient')
      .attr('id', 'd3-surplus-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    surplusGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#10b981')
      .attr('stop-opacity', 0.35);

    surplusGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#059669')
      .attr('stop-opacity', 0.05);

    // Baseline Area Gradient
    const baseAreaGradient = defs
      .append('linearGradient')
      .attr('id', 'd3-base-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    baseAreaGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#71717a')
      .attr('stop-opacity', 0.22);

    baseAreaGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#71717a')
      .attr('stop-opacity', 0.0);

    // Filter for neon glow effect on the main path
    const filter = defs
      .append('filter')
      .attr('id', 'd3-emerald-glow')
      .attr('x', '-20%')
      .attr('y', '-20%')
      .attr('width', '140%')
      .attr('height', '140%');

    filter
      .append('feGaussianBlur')
      .attr('stdDeviation', '3.5')
      .attr('result', 'blur');

    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'blur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Main Chart Group
    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Horizontal Grid Lines
    const yGrid = d3
      .axisLeft(yScale)
      .ticks(5)
      .tickSize(-innerWidth)
      .tickFormat(() => '');

    g.append('g')
      .attr('class', 'y-grid')
      .call(yGrid)
      .selectAll('line')
      .attr('stroke', 'rgba(255, 255, 255, 0.07)')
      .attr('stroke-dasharray', '3 4');

    g.select('.y-grid .domain').remove();

    // Generators
    const lineGeneratorOpt = d3
      .line<TrajectoryDataPoint>()
      .x((d) => xScale(d.monthIndex))
      .y((d) => yScale(getOptVal(d)))
      .curve(d3.curveMonotoneX);

    const lineGeneratorBase = d3
      .line<TrajectoryDataPoint>()
      .x((d) => xScale(d.monthIndex))
      .y((d) => yScale(getBaseVal(d)))
      .curve(d3.curveMonotoneX);

    // Delta / Growth Surplus Area (Difference between opt and base)
    if (showSurplusShading && showBaseline) {
      const areaSurplus = d3
        .area<TrajectoryDataPoint>()
        .x((d) => xScale(d.monthIndex))
        .y0((d) => yScale(getBaseVal(d)))
        .y1((d) => yScale(getOptVal(d)))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(data)
        .attr('fill', 'url(#d3-surplus-gradient)')
        .attr('d', areaSurplus)
        .attr('opacity', 0)
        .transition()
        .duration(650)
        .attr('opacity', 1);
    } else {
      // Standard full area under optimized
      const areaOpt = d3
        .area<TrajectoryDataPoint>()
        .x((d) => xScale(d.monthIndex))
        .y0(innerHeight)
        .y1((d) => yScale(getOptVal(d)))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(data)
        .attr('fill', 'url(#d3-emerald-gradient)')
        .attr('d', areaOpt);
    }

    // Baseline Line & Area
    if (showBaseline) {
      const areaBase = d3
        .area<TrajectoryDataPoint>()
        .x((d) => xScale(d.monthIndex))
        .y0(innerHeight)
        .y1((d) => yScale(getBaseVal(d)))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(data)
        .attr('fill', 'url(#d3-base-gradient)')
        .attr('d', areaBase);

      const baseLinePath = g
        .append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#71717a')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5 4')
        .attr('d', lineGeneratorBase);

      // Animate stroke
      const totalLengthBase = baseLinePath.node()?.getTotalLength() || 0;
      baseLinePath
        .attr('stroke-dasharray', `${totalLengthBase} ${totalLengthBase}`)
        .attr('stroke-dashoffset', totalLengthBase)
        .transition()
        .duration(750)
        .ease(d3.easeCubicOut)
        .attr('stroke-dashoffset', 0)
        .on('end', () => {
          baseLinePath.attr('stroke-dasharray', '5 4');
        });
    }

    // Optimized Primary Line (With glow filter)
    const optLinePath = g
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#00a877')
      .attr('stroke-width', 3.5)
      .attr('filter', 'url(#d3-emerald-glow)')
      .attr('d', lineGeneratorOpt);

    const totalLengthOpt = optLinePath.node()?.getTotalLength() || 0;
    optLinePath
      .attr('stroke-dasharray', `${totalLengthOpt} ${totalLengthOpt}`)
      .attr('stroke-dashoffset', totalLengthOpt)
      .transition()
      .duration(900)
      .ease(d3.easeCubicOut)
      .attr('stroke-dashoffset', 0);

    // Highlight key milestone circles: Month 1 and Final Month
    const keyMilestones = [data[0], data[data.length - 1]];
    if (data.length > 6) {
      keyMilestones.splice(1, 0, data[Math.floor(data.length / 2)]);
    }

    const milestoneGroup = g.append('g').attr('class', 'milestones');

    keyMilestones.forEach((pt) => {
      // Opt marker
      milestoneGroup
        .append('circle')
        .attr('cx', xScale(pt.monthIndex))
        .attr('cy', yScale(getOptVal(pt)))
        .attr('r', 5)
        .attr('fill', '#09090B')
        .attr('stroke', '#00a877')
        .attr('stroke-width', 2.5);

      // Value badge above final point
      if (pt.monthIndex === horizonMonths) {
        const valText =
          metricMode === 'merchants'
            ? `${getOptVal(pt).toLocaleString()} stores`
            : `$${(getOptVal(pt) / 1000).toFixed(1)}k`;

        milestoneGroup
          .append('rect')
          .attr('x', xScale(pt.monthIndex) - 52)
          .attr('y', Math.max(0, yScale(getOptVal(pt)) - 24))
          .attr('width', 58)
          .attr('height', 18)
          .attr('rx', 4)
          .attr('fill', '#008060')
          .attr('stroke', '#00a877')
          .attr('stroke-width', 1);

        milestoneGroup
          .append('text')
          .attr('x', xScale(pt.monthIndex) - 23)
          .attr('y', Math.max(0, yScale(getOptVal(pt)) - 11))
          .attr('text-anchor', 'middle')
          .attr('fill', '#ffffff')
          .attr('font-size', '10px')
          .attr('font-weight', 'bold')
          .attr('font-family', 'monospace')
          .text(valText);
      }
    });

    // X-Axis
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(Math.min(horizonMonths, innerWidth > 500 ? 12 : 6))
      .tickFormat((d) => `M${d}`);

    const xAxisGroup = g
      .append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis);

    xAxisGroup.select('.domain').attr('stroke', 'rgba(255, 255, 255, 0.2)');
    xAxisGroup
      .selectAll('text')
      .attr('fill', '#a1a1aa')
      .attr('font-size', '11px')
      .attr('font-family', 'monospace')
      .attr('dy', '10px');
    xAxisGroup.selectAll('line').attr('stroke', 'rgba(255, 255, 255, 0.15)');

    // Y-Axis
    const yAxis = d3
      .axisLeft(yScale)
      .ticks(5)
      .tickFormat((d) => {
        const num = Number(d);
        if (metricMode === 'merchants') {
          return num >= 1000 ? `${(num / 1000).toFixed(1)}k` : `${num}`;
        }
        return num >= 1000 ? `$${(num / 1000).toFixed(0)}k` : `$${num}`;
      });

    const yAxisGroup = g.append('g').call(yAxis);
    yAxisGroup.select('.domain').remove();
    yAxisGroup
      .selectAll('text')
      .attr('fill', '#71717a')
      .attr('font-size', '11px')
      .attr('font-family', 'monospace');
    yAxisGroup.selectAll('line').remove();

    // Interactive Hover Elements
    const hoverGroup = g
      .append('g')
      .attr('class', 'hover-overlay')
      .style('display', 'none');

    const hoverLine = hoverGroup
      .append('line')
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', '#00a877')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4 3')
      .attr('opacity', 0.85);

    const hoverCircleOpt = hoverGroup
      .append('circle')
      .attr('r', 6)
      .attr('fill', '#00a877')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2);

    const hoverCircleBase = hoverGroup
      .append('circle')
      .attr('r', 5)
      .attr('fill', '#71717a')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 1.5);

    // Overlay Rect for capturing mouse interaction
    const bisect = d3.bisector<TrajectoryDataPoint, number>((d) => d.monthIndex).center;

    svg
      .append('rect')
      .attr('class', 'd3-interactive-overlay')
      .attr('x', margin.left)
      .attr('y', margin.top)
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'transparent')
      .style('cursor', 'crosshair')
      .on('mousemove', function (event) {
        const [mx] = d3.pointer(event, this);
        const monthVal = xScale.invert(mx);
        const index = bisect(data, monthVal);
        const selected = data[Math.min(Math.max(0, index), data.length - 1)];

        if (!selected) return;

        const xPos = xScale(selected.monthIndex);
        const yOpt = yScale(getOptVal(selected));
        const yBase = yScale(getBaseVal(selected));

        hoverGroup.style('display', null);
        hoverLine.attr('x1', xPos).attr('x2', xPos);
        hoverCircleOpt.attr('cx', xPos).attr('cy', yOpt);
        hoverCircleBase.attr('cx', xPos).attr('cy', yBase);

        setHoveredPoint(selected);
        setHoverCoords({
          x: xPos + margin.left,
          y: yOpt + margin.top,
        });
      })
      .on('mouseleave', function () {
        hoverGroup.style('display', 'none');
        setHoveredPoint(null);
        setHoverCoords(null);
      });
  }, [
    data,
    dimensions,
    metricMode,
    showSurplusShading,
    showBaseline,
    horizonMonths,
  ]);

  // Export chart as SVG file
  const handleExportSvg = () => {
    if (!svgRef.current) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgRef.current);
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shopify-app-growth-trajectory-${horizonMonths}m.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 shadow-2xl space-y-5 relative">
      {/* Chart Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#008060]/20 text-[#00a877] border border-[#008060]/30">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-bold font-heading text-white">
              D3.js Projected Growth Trajectory Engine
            </h3>
            <span className="text-[10px] bg-[#008060]/15 text-[#00a877] border border-[#008060]/30 px-2 py-0.5 rounded-full font-mono font-semibold">
              Live Cohort Vector
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            {summary?.subtitle}
          </p>
        </div>

        {/* Metric Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-[#09090B] border border-zinc-800 rounded-xl">
          <button
            onClick={() => setMetricMode('mrr')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              metricMode === 'mrr'
                ? 'bg-[#008060] text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>MRR Curve</span>
          </button>
          <button
            onClick={() => setMetricMode('cumulative')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              metricMode === 'cumulative'
                ? 'bg-[#008060] text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Cumulative Cashflow</span>
          </button>
          <button
            onClick={() => setMetricMode('merchants')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              metricMode === 'merchants'
                ? 'bg-[#008060] text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Paid Stores</span>
          </button>
        </div>
      </div>

      {/* Trajectory Highlights Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#09090B]/60 p-3.5 rounded-xl border border-zinc-800/80">
        <div>
          <div className="text-[10px] text-zinc-400 uppercase font-semibold">
            Baseline Month {horizonMonths}
          </div>
          <div className="text-base sm:text-lg font-black font-mono text-zinc-300 mt-0.5">
            {metricMode === 'merchants'
              ? `${summary?.baselineEnd.toLocaleString()} stores`
              : `$${summary?.baselineEnd.toLocaleString()}`}
          </div>
        </div>

        <div>
          <div className="text-[10px] text-[#00a877] uppercase font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#00a877]" />
            Optimized Month {horizonMonths}
          </div>
          <div className="text-base sm:text-lg font-black font-mono text-white mt-0.5">
            {metricMode === 'merchants'
              ? `${summary?.optEnd.toLocaleString()} stores`
              : `$${summary?.optEnd.toLocaleString()}`}
          </div>
        </div>

        <div>
          <div className="text-[10px] text-emerald-400 uppercase font-semibold">
            Net Surplus Lift
          </div>
          <div className="text-base sm:text-lg font-black font-mono text-[#00a877] mt-0.5">
            +{metricMode === 'merchants'
              ? `${summary?.lift.toLocaleString()} stores`
              : `$${summary?.lift.toLocaleString()}`}
          </div>
        </div>

        <div>
          <div className="text-[10px] text-zinc-400 uppercase font-semibold">
            Relative Efficiency
          </div>
          <div className="text-base sm:text-lg font-black font-mono text-emerald-300 mt-0.5">
            +{summary?.pctLift}% Growth
          </div>
        </div>
      </div>

      {/* Main D3 Chart Container */}
      <div
        ref={containerRef}
        className="w-full relative bg-[#09090B] border border-zinc-800/90 rounded-xl overflow-hidden pt-2"
        style={{ minHeight: `${dimensions.height}px` }}
      >
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="w-full h-full block select-none"
        />

        {/* Hover Tooltip Popup Overlay */}
        {hoveredPoint && hoverCoords && (
          <div
            className="absolute pointer-events-none z-20 transition-all duration-75 transform -translate-x-1/2 -translate-y-full mb-3"
            style={{
              left: `${Math.max(130, Math.min(dimensions.width - 130, hoverCoords.x))}px`,
              top: `${Math.max(70, hoverCoords.y - 12)}px`,
            }}
          >
            <div className="p-3 rounded-xl bg-zinc-950/95 border border-zinc-700 shadow-2xl backdrop-blur-md text-xs space-y-1.5 min-w-[210px]">
              <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800">
                <span className="font-bold text-white flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#00a877]" />
                  {hoveredPoint.month}
                </span>
                <span className="text-[10px] font-mono text-[#00a877] bg-[#008060]/20 px-1.5 py-0.5 rounded">
                  +{Math.round(((hoveredPoint.OptimizedMRR - hoveredPoint.BaselineMRR) / (hoveredPoint.BaselineMRR || 1)) * 100)}% Lift
                </span>
              </div>

              {metricMode === 'mrr' && (
                <>
                  <div className="flex justify-between text-zinc-400">
                    <span>Baseline MRR:</span>
                    <span className="font-mono text-zinc-300">
                      ${hoveredPoint.BaselineMRR.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-white font-semibold">
                    <span className="text-[#00a877]">Optimized MRR:</span>
                    <span className="font-mono text-[#00a877]">
                      ${hoveredPoint.OptimizedMRR.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-emerald-400 text-[11px] pt-1 border-t border-zinc-800/80">
                    <span>Net MRR Added:</span>
                    <span className="font-mono font-bold">
                      +${hoveredPoint.NetGain.toLocaleString()} / mo
                    </span>
                  </div>
                </>
              )}

              {metricMode === 'cumulative' && (
                <>
                  <div className="flex justify-between text-zinc-400">
                    <span>Baseline Cumulative:</span>
                    <span className="font-mono text-zinc-300">
                      ${hoveredPoint.BaselineCumulative.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-white font-semibold">
                    <span className="text-[#00a877]">Optimized Cumulative:</span>
                    <span className="font-mono text-[#00a877]">
                      ${hoveredPoint.OptimizedCumulative.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-emerald-400 text-[11px] pt-1 border-t border-zinc-800/80">
                    <span>Surplus Capital:</span>
                    <span className="font-mono font-bold">
                      +${hoveredPoint.NetCumulativeGain.toLocaleString()}
                    </span>
                  </div>
                </>
              )}

              {metricMode === 'merchants' && (
                <>
                  <div className="flex justify-between text-zinc-400">
                    <span>Baseline Stores:</span>
                    <span className="font-mono text-zinc-300">
                      {hoveredPoint.BaselinePaying.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-white font-semibold">
                    <span className="text-[#00a877]">Optimized Stores:</span>
                    <span className="font-mono text-[#00a877]">
                      {hoveredPoint.OptimizedPaying.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-emerald-400 text-[11px] pt-1 border-t border-zinc-800/80">
                    <span>Net Stores Retained:</span>
                    <span className="font-mono font-bold">
                      +{hoveredPoint.OptimizedPaying - hoveredPoint.BaselinePaying} stores
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Chart Footer: Legend, Controls & D3 Details */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
        {/* Interactive Legend */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-1 bg-[#00a877] rounded-full shadow-[0_0_8px_#00a877]" />
            <span className="text-white font-semibold">
              Optimized Trajectory
            </span>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showBaseline}
              onChange={(e) => setShowBaseline(e.target.checked)}
              className="accent-[#008060] w-3.5 h-3.5 rounded"
            />
            <span className="text-zinc-400 flex items-center gap-1.5">
              <span className="w-3.5 h-0.5 border-t border-dashed border-zinc-400" />
              Baseline Current
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showSurplusShading}
              onChange={(e) => setShowSurplusShading(e.target.checked)}
              className="accent-[#008060] w-3.5 h-3.5 rounded"
            />
            <span className="text-zinc-400">
              Surplus Lift Area
            </span>
          </label>
        </div>

        {/* Action button to export SVG */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportSvg}
            className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors flex items-center gap-1 text-[11px] font-medium cursor-pointer"
            title="Download SVG vector diagram of the projected model"
          >
            <Download className="w-3 h-3 text-[#00a877]" />
            <span>Export SVG</span>
          </button>
        </div>
      </div>

      {/* Input Metrics Footnote Bar */}
      <div className="p-3 rounded-xl bg-zinc-950/50 border border-zinc-800/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-400 font-mono">
        <div className="flex items-center gap-3">
          <span>Input Installs: <strong className="text-white">{monthlyInstalls}</strong>/mo</span>
          <span>ARPU: <strong className="text-white">${appPrice}</strong></span>
          <span>Activation: <strong className="text-white">{conversionRate}% → {optConv}%</strong></span>
          <span>Churn: <strong className="text-white">{monthlyChurn}% → {optChurn}%</strong></span>
        </div>
        <div className="text-[#00a877] font-semibold flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          <span>D3.js Monotone Curve Engine Active</span>
        </div>
      </div>
    </div>
  );
};
