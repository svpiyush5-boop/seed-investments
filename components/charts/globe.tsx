"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import type { FeatureCollection, GeometryObject } from "geojson";
import type { Topology } from "topojson-specification";
import worldData from "world-atlas/countries-110m.json";

export interface GlobeConfig {
  globeColor?: string;
  lineColor?: string;
  borderColor?: string;
}

export interface Marker {
  location: [number, number];
  size: number;
  color?: string;
}

export interface Arc {
  start: [number, number];
  end: [number, number];
  color?: string;
}

export interface GlobeProps {
  className?: string;
  globeConfig?: GlobeConfig;
  markers: Marker[];
  arcs?: Arc[];
  initialCoordinates: { lat: number; lng: number };
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  enablePointerInteraction?: boolean;
  isRotating?: boolean;
  ariaLabel?: string;
}

export const Globe: React.FC<GlobeProps> = ({
  className,
  globeConfig = {},
  markers,
  arcs = [],
  initialCoordinates,
  autoRotate = false,
  autoRotateSpeed = 0.15,
  enablePointerInteraction = false,
  isRotating = false,
  ariaLabel = "Interactive globe showing investment flows to India",
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const rotationTimer = useRef<d3.Timer | null>(null);
  const isDragging = useRef(false);

  const {
    globeColor = "#f9fafb",
    lineColor = "rgba(0,0,0,0.1)",
    borderColor = "rgba(0,0,0,0.15)",
  } = globeConfig;

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const svgNode = svg.node();
    if (!svgNode) return;

    const { width, height } = svgNode.getBoundingClientRect();
    if (width === 0 || height === 0) return;

    const minDim = Math.min(width, height);

    const projection = d3
      .geoOrthographic()
      .scale(minDim / 2 - 10)
      .translate([width / 2, height / 2])
      .clipAngle(90)
      .rotate([-initialCoordinates.lng, -initialCoordinates.lat]);

    const path = d3.geoPath().projection(projection) as (
      d: unknown,
    ) => string | null;
    const g = svg.append("g");

    g.append("path")
      .datum({ type: "Sphere" })
      .attr("class", "water")
      .attr("d", path)
      .style("fill", "#ffffff");

    g.append("path")
      .datum(d3.geoGraticule10())
      .attr("class", "graticule")
      .attr("d", path)
      .style("fill", "none")
      .style("stroke", lineColor)
      .style("stroke-width", "0.5px")
      .style("stroke-opacity", 0.5);

    const world = worldData as unknown as Topology;
    const countries = topojson.feature(
      world,
      "countries",
    ) as unknown as FeatureCollection<GeometryObject, { name: string }>;

    const indiaHighlightColor = "#BFDBFE";

    g.selectAll(".land")
      .data(countries.features)
      .enter()
      .append("path")
      .attr("class", "land")
      .attr("d", path)
      .style("fill", (d) => {
        if (d.properties && d.properties.name === "India") {
          return indiaHighlightColor;
        }
        return globeColor;
      })
      .style("stroke", borderColor)
      .style("stroke-width", "0.5px");

    const markerGroup = g.append("g").attr("class", "markers");
    const arcGroup = g.append("g").attr("class", "arcs");

    function isVisible(lon: number, lat: number): boolean {
      const rotation = projection.rotate();
      if (!rotation) return false;
      const gdistance = d3.geoDistance(
        [lon, lat],
        [-rotation[0], -rotation[1]],
      );
      return gdistance < Math.PI / 2;
    }

    const arcPaths = arcs.map((arc) => {
      const geoLine = {
        type: "LineString" as const,
        coordinates: [
          [arc.start[1], arc.start[0]],
          [arc.end[1], arc.end[0]],
        ],
      };
      const pathElement = arcGroup
        .append("path")
        .datum(geoLine)
        .attr("d", path)
        .style("fill", "none")
        .style("stroke", arc.color ?? "#ff0000")
        .style("stroke-width", "1.5px")
        .style("stroke-opacity", 0.25)
        .style("stroke-linecap", "round");
      const pathNode = pathElement.node();
      return {
        element: pathElement,
        arc,
        totalLength: pathNode?.getTotalLength() ?? 0,
      };
    });

    function updateMarkers(elapsed: number) {
      markerGroup.selectAll(".marker").remove();
      markers.forEach((marker) => {
        const [lat, lon] = marker.location;
        if (isVisible(lon, lat)) {
          const coords = projection([lon, lat]);
          if (coords) {
            const baseRadius = (minDim * marker.size) / 20;
            const pulseOffset = marker.size > 0.2 ? 1.5 : 1;
            const pulseRadius =
              baseRadius + pulseOffset * Math.abs(Math.sin(elapsed / 400));

            markerGroup
              .append("circle")
              .attr("class", "marker pulse")
              .attr("cx", coords[0])
              .attr("cy", coords[1])
              .attr("r", pulseRadius)
              .style("fill", marker.color ?? "#ff0000")
              .style("fill-opacity", 0.2);

            markerGroup
              .append("circle")
              .attr("class", "marker solid")
              .attr("cx", coords[0])
              .attr("cy", coords[1])
              .attr("r", baseRadius)
              .style("fill", marker.color ?? "#ff0000");
          }
        }
      });
    }

    function updateArcs(elapsed: number) {
      arcGroup.selectAll(".arc-dot").remove();

      arcPaths.forEach(({ element, arc, totalLength }) => {
        const pathNode = element.node();
        if (!pathNode) return;

        element.attr("d", path);

        const duration = 5000;
        const progress = (elapsed % duration) / duration;
        const currentLength = totalLength * progress;
        const point = pathNode.getPointAtLength(currentLength);

        const invertFn = projection.invert;
        if (!invertFn) return;
        const invertResult = invertFn([point.x, point.y]);
        if (!invertResult) return;
        const [invLon, invLat] = invertResult;
        const pointIsVisible = isVisible(invLon, invLat);

        if (pointIsVisible) {
          arcGroup
            .append("circle")
            .attr("class", "arc-dot")
            .attr("cx", point.x)
            .attr("cy", point.y)
            .attr("r", 2.5)
            .style("fill", arc.color ?? "#ff0000")
            .style("fill-opacity", 0.7);
        }
      });
    }

    function render(elapsed = 0) {
      g.selectAll("path.land, path.graticule, path.water").attr("d", path);
      updateMarkers(elapsed);
      updateArcs(elapsed);
    }

    render();

    function startRotation() {
      if (rotationTimer.current) rotationTimer.current.stop();
      rotationTimer.current = d3.timer((elapsed) => {
        if (isDragging.current) return;

        const rotate = projection.rotate();
        if (!rotate) return;
        rotate[0] += autoRotateSpeed / 60;
        projection.rotate(rotate);

        render(elapsed);
      });
    }

    if (enablePointerInteraction) {
      const drag = d3
        .drag<SVGSVGElement, unknown, unknown>()
        .on("start", () => {
          isDragging.current = true;
          if (rotationTimer.current) rotationTimer.current.stop();
        })
        .on("drag", (event: d3.D3DragEvent<SVGSVGElement, unknown, unknown>) => {
          const r = projection.rotate();
          if (!r) return;
          const k = 75 / projection.scale();
          projection.rotate([r[0] + event.dx * k, r[1] - event.dy * k]);
          render();
        })
        .on("end", () => {
          isDragging.current = false;
          if (autoRotate && isRotating) {
            startRotation();
          }
        });
      svg.call(drag);
    }

    if (autoRotate && isRotating && !isDragging.current) {
      startRotation();
    } else if (rotationTimer.current) {
      rotationTimer.current.stop();
    }

    return () => {
      if (rotationTimer.current) rotationTimer.current.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    globeColor,
    lineColor,
    borderColor,
    markers,
    arcs,
    initialCoordinates.lat,
    initialCoordinates.lng,
    autoRotate,
    autoRotateSpeed,
    enablePointerInteraction,
    isRotating,
  ]);

  return (
    <svg
      ref={svgRef}
      className={className}
      role="img"
      aria-label={ariaLabel}
    >
      <title>{ariaLabel}</title>
    </svg>
  );
};
