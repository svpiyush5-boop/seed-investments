"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useChartTheme } from "@/hooks/use-chart-theme";

interface GrowthDataPoint {
  year: number;
  invested: number;
  total: number;
}

interface GrowthChartProps {
  data: GrowthDataPoint[];
  totalYears: number;
  formatFunction: (value: number) => string;
}

const GrowthChart: React.FC<GrowthChartProps> = ({
  data,
  totalYears,
  formatFunction,
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const colors = useChartTheme();

  useEffect(() => {
    if (
      !data ||
      data.length < 2 ||
      !svgRef.current ||
      !chartContainerRef.current ||
      !tooltipRef.current
    )
      return;

    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);
    svg.selectAll("*").remove();

    const bounds = chartContainerRef.current.getBoundingClientRect();
    const margin = { top: 10, right: 15, bottom: 35, left: 75 };
    const width = bounds.width - margin.left - margin.right;
    const height = bounds.height - margin.top - margin.bottom;

    if (width <= 0 || height <= 0) return;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const maxY = d3.max(data, (d) => d.total) ?? 0;
    const xScale = d3
      .scaleLinear()
      .domain([0, totalYears])
      .range([0, width]);
    const yScale = d3
      .scaleLinear()
      .domain([0, maxY])
      .range([height, 0])
      .nice();

    // Grid lines
    g.append("g")
      .attr("class", "grid")
      .call(
        d3
          .axisLeft(yScale)
          .ticks(5)
          .tickSize(-width)
          .tickFormat(() => ""),
      )
      .selectAll(".tick line")
      .attr("stroke", colors.gridColor);

    g.selectAll(".grid .domain").attr("stroke-width", "0");

    // X axis
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(Math.min(totalYears, 5))
          .tickFormat((d) => `${d}y`),
      )
      .selectAll("text")
      .style("font-size", "11px")
      .attr("fill", colors.axisColor);

    // Y axis
    g.append("g")
      .call(
        d3
          .axisLeft(yScale)
          .ticks(5)
          .tickFormat((d) => formatFunction(Number(d)).replace(/₹\s*/, "")),
      )
      .selectAll("text")
      .style("font-size", "11px")
      .attr("fill", colors.axisColor);

    g.selectAll(".domain").attr("stroke", colors.gridColor);
    g.selectAll(".tick line").attr("stroke", colors.gridColor);

    // Area (invested → total)
    const areaGen = d3
      .area<GrowthDataPoint>()
      .x((d) => xScale(d.year))
      .y0((d) => yScale(d.invested))
      .y1((d) => yScale(d.total))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(data)
      .attr("fill", colors.primary)
      .attr("fill-opacity", 0.15)
      .attr("d", areaGen);

    // Invested area (0 → invested)
    const investedAreaGen = d3
      .area<GrowthDataPoint>()
      .x((d) => xScale(d.year))
      .y0(yScale(0))
      .y1((d) => yScale(d.invested))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(data)
      .attr("fill", colors.primary)
      .attr("fill-opacity", 0.25)
      .attr("d", investedAreaGen);

    // Total value line
    const totalLine = d3
      .line<GrowthDataPoint>()
      .x((d) => xScale(d.year))
      .y((d) => yScale(d.total))
      .curve(d3.curveMonotoneX);

    const totalPath = g
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", colors.primary)
      .attr("stroke-width", 2.5)
      .attr("d", totalLine);

    // Animate draw-in
    const totalPathNode = totalPath.node();
    if (totalPathNode) {
      const length = totalPathNode.getTotalLength();
      totalPath
        .attr("stroke-dasharray", `${length} ${length}`)
        .attr("stroke-dashoffset", length)
        .transition()
        .ease(d3.easeSin)
        .duration(1200)
        .attr("stroke-dashoffset", 0);
    }

    // Invested line (subtle, dashed)
    const investedLine = d3
      .line<GrowthDataPoint>()
      .x((d) => xScale(d.year))
      .y((d) => yScale(d.invested))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", colors.primary)
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "5 3")
      .attr("stroke-opacity", 0.5)
      .attr("d", investedLine);

    // Tooltip overlay
    const bisector = d3.bisector<GrowthDataPoint, number>(
      (d) => d.year,
    ).left;

    g.append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mouseover", () => tooltip.style("opacity", 1))
      .on("mouseout", () => tooltip.style("opacity", 0))
      .on("mousemove", (event: MouseEvent) => {
        const [xPos] = d3.pointer(event);
        const year = xScale.invert(xPos);
        const i = bisector(data, year, 1);
        if (i === 0 || i > data.length) return;
        const d0 = data[i - 1];
        const d1 = data[i];
        if (!d0) return;
        const d = d1 && year - d0.year > d1.year - year ? d1 : d0;
        const returns = d.total - d.invested;

        tooltip
          .html(
            `<div class="flex flex-col gap-1 p-1">
              <div class="font-semibold text-xs">Year ${d.year}</div>
              <div class="flex justify-between gap-4 text-xs">
                <span>Invested</span>
                <span style="color:${colors.primary}">${formatFunction(d.invested)}</span>
              </div>
              <div class="flex justify-between gap-4 text-xs">
                <span style="color:${colors.green}">Returns</span>
                <span style="color:${colors.green}">+${formatFunction(returns)}</span>
              </div>
              <div class="flex justify-between gap-4 text-xs font-semibold border-t pt-1 mt-1" style="border-color: rgba(255,255,255,0.2)">
                <span>Total</span>
                <span>${formatFunction(d.total)}</span>
              </div>
            </div>`,
          )
          .style("left", `${event.pageX + 15}px`)
          .style("top", `${event.pageY - 50}px`);
      });
  }, [data, totalYears, formatFunction, colors]);

  return (
    <div className="relative w-full h-full">
      <div ref={chartContainerRef} className="w-full h-full">
        <svg
          ref={svgRef}
          className="w-full h-full"
          role="img"
          aria-label="Area chart showing investment growth over time"
        >
          <title>SIP Growth Projection Chart</title>
          <desc>
            Area chart displaying total investment value growth over the SIP
            period, with invested principal vs. returns breakdown.
          </desc>
        </svg>
      </div>
      <div
        ref={tooltipRef}
        className="fixed bg-gray-800 text-white px-3 py-2 rounded-lg text-xs pointer-events-none opacity-0 transition-opacity whitespace-nowrap z-10 border border-gray-700 shadow-lg"
      />
    </div>
  );
};

export default GrowthChart;
