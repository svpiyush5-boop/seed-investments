import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface ChartTheme {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  green: string;
  red: string;
  amber: string;
  gridColor: string;
  axisColor: string;
  tooltipBg: string;
  tooltipText: string;
  liquidColor: string;
  mixedColor: string;
  equityColor: string;
}

function hsbToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  };
  const toHex = (x: number) =>
    Math.round(255 * x)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

function hslToHex(h: number, s: number, l: number): string {
  return hsbToHex(h, s, l);
}

export function useChartTheme(): ChartTheme {
  const { resolvedTheme } = useTheme();
  const [theme, setTheme] = useState<ChartTheme>(() => getColors());

  function getColors(): ChartTheme {
    if (typeof document === "undefined") {
      return getDefaultColors();
    }
    const style = getComputedStyle(document.documentElement);

    function getColor(varName: string): string {
      const val = style.getPropertyValue(varName).trim();
      if (!val) return "#000000";
      const parts = val.split(" ").map(parseFloat);
      if (parts.length === 3 && !isNaN(parts[0]!)) {
        return hslToHex(parts[0]!, parts[1]!, parts[2]!);
      }
      return val;
    }

    const isDark = document.documentElement.classList.contains("dark");
    return {
      primary: getColor("--primary"),
      primaryLight: "#93C5FD",
      primaryDark: "#2563EB",
      green: "#10B981",
      red: "#EF4444",
      amber: "#F59E0B",
      gridColor: isDark ? "#1F2937" : "#F3F4F6",
      axisColor: isDark ? "#9CA3AF" : "#6B7280",
      tooltipBg: isDark ? "#1F2937" : "#1F2937",
      tooltipText: isDark ? "#F9FAFB" : "#F9FAFB",
      liquidColor: "#93C5FD",
      mixedColor: "#60A5FA",
      equityColor: "#2563EB",
    };
  }

  useEffect(() => {
    setTheme(getColors());
  }, [resolvedTheme]);

  return theme;
}

function getDefaultColors(): ChartTheme {
  return {
    primary: "#2563EB",
    primaryLight: "#93C5FD",
    primaryDark: "#2563EB",
    green: "#10B981",
    red: "#EF4444",
    amber: "#F59E0B",
    gridColor: "#F3F4F6",
    axisColor: "#6B7280",
    tooltipBg: "#1F2937",
    tooltipText: "#F9FAFB",
    liquidColor: "#93C5FD",
    mixedColor: "#60A5FA",
    equityColor: "#2563EB",
  };
}
