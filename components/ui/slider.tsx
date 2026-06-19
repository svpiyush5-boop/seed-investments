"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (val: number) => void;
  formatValue: (val: number) => string;
  suffix?: string;
  caption?: string;
  isSubSlider?: boolean;
  thumbSize?: "default" | "large";
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
  formatValue,
  suffix = "",
  caption,
  isSubSlider = false,
  thumbSize = "default",
  className,
}) => {
  const percentage = max > min ? ((value - min) / (max - min)) * 100 : 0;
  const thumbDimensions =
    thumbSize === "large" ? "w-6 h-6" : "w-5 h-5";
  const sliderId = React.useId();

  return (
    <div className={cn("mb-4 last:mb-0 group", className)}>
      <div className="flex justify-between items-center mb-2">
        <label
          htmlFor={sliderId}
          className={cn(
            "font-medium",
            isSubSlider ? "text-sm text-muted-foreground" : "text-base text-foreground",
          )}
        >
          {label}
        </label>
        <div
          className={cn(
            "font-bold tabular-nums transition-colors duration-300",
            isSubSlider
              ? "text-primary text-sm"
              : "rounded-md bg-muted px-3 py-1 text-primary-dark text-sm group-hover:bg-blue-100 dark:text-blue-400",
          )}
        >
          {formatValue(value)}
          {suffix}
        </div>
      </div>
      <div className="relative h-2 rounded-full bg-muted cursor-pointer touch-none">
        <div
          className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-blue-400 to-primary pointer-events-none"
          style={{ width: `${percentage}%` }}
        />
        <input
          id={sliderId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full h-full opacity-0 cursor-pointer z-10"
          aria-label={label}
          aria-valuenow={value}
          aria-valuemin={min}
          aria-valuemax={max}
        />
        <div
          className={cn(
            "absolute top-1/2 rounded-full bg-white shadow-md pointer-events-none transition-transform duration-150 ease-out group-hover:scale-110 border-2 border-primary",
            thumbDimensions,
          )}
          style={{ left: `${percentage}%`, transform: "translate(-50%, -50%)" }}
        />
      </div>
      {caption && (
        <p className="text-xs text-muted-foreground mt-1.5 text-right">
          {caption}
        </p>
      )}
    </div>
  );
};
