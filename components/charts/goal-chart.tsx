"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { ChartDataPoint, GoalMarker } from "@/lib/finance/goal-planner";
import { useChartTheme } from "@/hooks/use-chart-theme";

interface GoalChartProps {
  investmentData: ChartDataPoint[];
  goalData: ChartDataPoint[];
  timeHorizon: number;
  formatFunction: (value: number) => string;
  goalMarkers: GoalMarker[];
}

const GoalChart: React.FC<GoalChartProps> = ({
  investmentData,
  goalData,
  timeHorizon,
  formatFunction,
  goalMarkers,
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const colors = useChartTheme();

  useEffect(() => {
    if (
      !investmentData ||
      !goalData ||
      !svgRef.current ||
      !chartContainerRef.current ||
      !tooltipRef.current
    )
      return;

    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);
    svg.selectAll("*").remove();

    const bounds = chartContainerRef.current.getBoundingClientRect();
    const margin = { top: 20, right: 15, bottom: 35, left: 75 };
    const width = bounds.width - margin.left - margin.right;
    const height = bounds.height - margin.top - margin.bottom;

    if (width <= 0 || height <= 0) return;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const maxY = Math.max(
      d3.max(goalData, (d) => d.value) ?? 0,
      d3.max(investmentData, (d) => d.value) ?? 0,
    );
    const xScale = d3.scaleLinear().domain([0, timeHorizon]).range([0, width]);
    const yScale = d3.scaleLinear().domain([0, maxY]).range([height, 0]).nice();

    g.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(yScale).ticks(5).tickSize(-width).tickFormat(() => ""));

    g.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(Math.min(timeHorizon, 5))
          .tickFormat(d3.format("d")),
      )
      .selectAll("text")
      .style("font-size", "11px")
      .attr("fill", colors.axisColor);

    g.append("g")
      .attr("class", "axis y-axis")
      .call(
        d3
          .axisLeft(yScale)
          .ticks(5)
          .tickFormat((d) => formatFunction(Number(d)).replace("₹", "")),
      )
      .selectAll("text")
      .style("font-size", "11px")
      .attr("fill", colors.axisColor);

    g.selectAll(".axis path, .axis line").attr("stroke", colors.gridColor);
    g.selectAll(".grid line").attr("stroke", colors.gridColor);
    g.selectAll(".grid path").attr("stroke-width", "0");

    const lineGen = d3
      .line<ChartDataPoint>()
      .x((d) => xScale(d.year))
      .y((d) => yScale(d.value))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(goalData)
      .attr("fill", "none")
      .attr("stroke", colors.red)
      .attr("stroke-width", 2.5)
      .attr("stroke-dasharray", "6 4")
      .attr("d", lineGen);

    const investmentPath = g
      .append("path")
      .datum(investmentData)
      .attr("fill", "none")
      .attr("stroke", colors.green)
      .attr("stroke-width", 3)
      .attr("d", lineGen);

    const pathNode = investmentPath.node();
    if (pathNode) {
      const pathLength = pathNode.getTotalLength();
      investmentPath
        .attr("stroke-dasharray", `${pathLength} ${pathLength}`)
        .attr("stroke-dashoffset", pathLength)
        .transition()
        .ease(d3.easeSin)
        .duration(1500)
        .attr("stroke-dashoffset", 0);
    }

    const markersGroup = g.append("g").attr("class", "goal-markers");
    const sortedMarkers = [...goalMarkers].sort((a, b) => a.year - b.year);

    sortedMarkers.forEach((marker) => {
      const markerYear = marker.year;
      const investmentPoint = investmentData.find((d) => d.year === markerYear);
      if (!investmentPoint) return;

      const markersAtSameYear = sortedMarkers.filter(
        (m) => m.year === markerYear,
      );
      const markerIndexInYear = markersAtSameYear.findIndex(
        (m) => m.id === marker.id,
      );

      const cx = xScale(markerYear);
      const cy = yScale(investmentPoint.value);
      const yOffset = -12 - markerIndexInYear * 20;

      markersGroup
        .append("circle")
        .attr("cx", cx)
        .attr("cy", cy)
        .attr("r", 5)
        .attr("fill", marker.status === "met" ? colors.green : colors.amber)
        .attr("stroke", "white")
        .attr("stroke-width", 2);

      const labelText =
        goalMarkers.length > 3
          ? `${sortedMarkers.findIndex((m) => m.id === marker.id) + 1}`
          : marker.status === "met"
            ? "Met"
            : "Adjustment";

      const textNode = markersGroup
        .append("text")
        .attr("x", cx)
        .attr("y", cy + yOffset)
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .attr("font-weight", "600")
        .attr("fill", "white")
        .text(labelText);

      const textBBox = textNode.node()?.getBBox();
      if (textBBox) {
        markersGroup
          .insert("rect", "text")
          .attr("x", textBBox.x - 4)
          .attr("y", textBBox.y - 2)
          .attr("width", textBBox.width + 8)
          .attr("height", textBBox.height + 4)
          .attr("rx", 4)
          .attr("ry", 4)
          .attr("fill", marker.status === "met" ? colors.green : colors.amber);
      }
    });

    g.append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mouseover", () => tooltip.style("opacity", 1))
      .on("mouseout", () => tooltip.style("opacity", 0))
      .on("mousemove", (event: MouseEvent) => {
        const [x] = d3.pointer(event);
        const year = Math.round(xScale.invert(x));
        const bisector = d3.bisector<ChartDataPoint, number>(
          (d) => d.year,
        ).left;
        const i = bisector(investmentData, year, 1);
        if (i === 0 || i > investmentData.length) return;
        const d0 = investmentData[i - 1];
        const d1 = investmentData[i];
        if (!d0) return;
        const d = d1 && year - d0.year > d1.year - year ? d1 : d0;
        const gData = goalData.find((gd) => gd.year === d.year);
        if (!gData) return;

        tooltip
          .html(
            `<div class="flex flex-col text-center"><strong class="font-bold text-xs mb-1">Year: ${d.year}</strong><span style="color:${colors.green}" class="text-xs">Invest: ${formatFunction(d.value)}</span><span style="color:${colors.red}" class="text-xs">Goal: ${formatFunction(gData.value)}</span></div>`,
          )
          .style("left", `${event.pageX + 15}px`)
          .style("top", `${event.pageY - 40}px`);
      });
  }, [investmentData, goalData, timeHorizon, formatFunction, goalMarkers]);

  return (
    <div className="relative w-full h-full">
      <div ref={chartContainerRef} className="w-full h-full">
        <svg
          ref={svgRef}
          className="w-full h-full"
          role="img"
          aria-label="Line chart comparing projected investment growth against financial goals"
        >
          <title>Financial Goal Projection Chart</title>
          <desc>
            Line chart showing investment growth (green) versus goal value (red
            dashed) over the time horizon, with markers indicating whether each
            goal is met or needs adjustment.
          </desc>
        </svg>
      </div>
      <div
        ref={tooltipRef}
        className="fixed text-white px-3 py-2 rounded-lg text-xs pointer-events-none opacity-0 transition-opacity whitespace-nowrap z-10 shadow-lg"
        style={{
          backgroundColor: colors.tooltipBg,
          borderColor: "rgba(255,255,255,0.1)",
        }}
      />
    </div>
  );
};

export default GoalChart;
