"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { TimelinePoint } from "@/lib/finance/cashflow";

interface CashflowChartProps {
  data: TimelinePoint[];
  years: number;
  formatFunction: (value: number) => string;
}

const CashflowChart: React.FC<CashflowChartProps> = ({
  data,
  years,
  formatFunction,
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      !data ||
      data.length === 0 ||
      !svgRef.current ||
      !chartContainerRef.current ||
      !tooltipRef.current
    )
      return;

    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);
    svg.selectAll("*").remove();

    const container = chartContainerRef.current;
    const { width, height } = container.getBoundingClientRect();
    const margin = { top: 10, right: 15, bottom: 35, left: 75 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    if (chartWidth <= 0 || chartHeight <= 0) return;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const keys: (keyof Pick<TimelinePoint, "B_liq" | "B_mix" | "B_eq">)[] = [
      "B_liq",
      "B_mix",
      "B_eq",
    ];
    const stack = d3.stack().keys(keys);
    const series = stack(data as never);

    const xScale = d3.scaleLinear().domain([0, years]).range([0, chartWidth]);
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(series, (d) => d3.max(d, (dd) => dd[1])) ?? 0])
      .range([chartHeight, 0])
      .nice();
    const color = d3
      .scaleOrdinal<string>()
      .domain(keys)
      .range(["#93C5FD", "#60A5FA", "#2563EB"]);

    const area = d3
      .area<d3.SeriesPoint<TimelinePoint>>()
      .x((d) => xScale(d.data.month / 12))
      .y0((d) => yScale(d[0]))
      .y1((d) => yScale(d[1]))
      .curve(d3.curveMonotoneX);

    g.selectAll(".area")
      .data(series)
      .join("path")
      .attr("class", "area")
      .style("fill", (d) => color(d.key))
      .attr("d", (d) => area(d as never));

    g.append("g")
      .attr("transform", `translate(0,${chartHeight})`)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(Math.min(years, 5))
          .tickFormat((d) => `${d}y`),
      )
      .selectAll("text")
      .style("font-size", "11px")
      .attr("fill", "#6B7280");

    g.append("g")
      .call(
        d3
          .axisLeft(yScale)
          .ticks(5)
          .tickFormat((d) => formatFunction(Number(d)).replace(/₹\s*/, "")),
      )
      .selectAll("text")
      .style("font-size", "11px")
      .attr("fill", "#6B7280");

    g.selectAll(".domain").remove();
    g.selectAll(".tick line").attr("stroke", "#E5E7EB");

    const bisectYear = d3.bisector(
      (d: TimelinePoint) => d.month / 12,
    ).left;
    const focus = g
      .append("g")
      .attr("class", "focus")
      .style("display", "none");
    focus
      .append("line")
      .attr("class", "focus-line")
      .attr("y1", 0)
      .attr("y2", chartHeight)
      .attr("stroke", "#4B5563")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "3,3");

    g.append("rect")
      .attr("class", "overlay")
      .attr("width", chartWidth)
      .attr("height", chartHeight)
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mouseover", () => {
        focus.style("display", null);
        tooltip.style("opacity", 1);
      })
      .on("mouseout", () => {
        focus.style("display", "none");
        tooltip.style("opacity", 0);
      })
      .on("mousemove", (event: MouseEvent) => {
        const [xPos] = d3.pointer(event, g.node());
        const year = xScale.invert(xPos);
        const index = bisectYear(data, year, 1);
        if (index <= 0 || index > data.length) return;
        const d0 = data[index - 1];
        const d1 = data[index];
        if (!d0) return;
        const d =
          d1 && year - d0.month / 12 > d1.month / 12 - year ? d1 : d0;

        focus
          .select(".focus-line")
          .attr("transform", `translate(${xScale(d.month / 12)},0)`);

        tooltip
          .html(
            `
                <div class="p-2">
                    <div class="font-bold text-xs mb-2">Year: ${Math.floor(d.month / 12)}, Month: ${d.month % 12 || 12}</div>
                    <div class="text-xs flex items-center"><div class="w-2 h-2 rounded-full mr-2" style="background-color: #2563EB;"></div>Equity: ${formatFunction(d.B_eq)}</div>
                    <div class="text-xs flex items-center"><div class="w-2 h-2 rounded-full mr-2" style="background-color: #60A5FA;"></div>Mixed: ${formatFunction(d.B_mix)}</div>
                    <div class="text-xs flex items-center"><div class="w-2 h-2 rounded-full mr-2" style="background-color: #93C5FD;"></div>Liquid: ${formatFunction(d.B_liq)}</div>
                    <div class="text-xs font-semibold mt-1 pt-1 border-t border-gray-600">Total: ${formatFunction(d.total)}</div>
                </div>
            `,
          )
          .style("left", `${event.pageX + 15}px`)
          .style("top", `${event.pageY - 60}px`);
      });
  }, [data, years, formatFunction]);

  return (
    <div className="relative w-full h-full">
      <div ref={chartContainerRef} className="w-full h-full">
        <svg
          ref={svgRef}
          className="w-full h-full"
          role="img"
          aria-label="Stacked area chart showing retirement portfolio cash flow over time"
        >
          <title>Retirement Cash Flow Chart</title>
          <desc>
            Stacked area chart displaying the liquid, mixed, and equity bucket
            balances over the simulation period.
          </desc>
        </svg>
      </div>
      <div
        ref={tooltipRef}
        className="fixed bg-gray-800 text-white rounded-lg text-xs pointer-events-none opacity-0 transition-opacity z-10 border border-gray-700 shadow-lg"
      />
    </div>
  );
};

export default CashflowChart;
