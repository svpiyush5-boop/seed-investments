import React from "react";
import { cn } from "@/lib/utils";

interface BentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  gradient?: string;
  variant?: "default" | "featured" | "dark";
}

export function BentoCard({
  className,
  icon,
  title,
  description,
  gradient,
  variant = "default",
  children,
  ...props
}: BentoCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border transition-all duration-300 p-8 md:p-10",
        variant === "default" &&
          "bg-card border-border/60 shadow-sm hover:shadow-md",
        variant === "featured" &&
          "bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-card border-blue-200/60 dark:border-blue-800/30 shadow-md hover:shadow-lg",
        variant === "dark" &&
          "bg-gray-900 border-gray-800 text-white shadow-lg",
        className,
      )}
      {...props}
    >
      {gradient && (
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            background: `radial-gradient(circle at 20% 50%, ${gradient}, transparent 70%)`,
          }}
        />
      )}
      <div className="relative z-10 flex flex-col h-full">
        {icon && (
          <div className="mb-5 w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-primary shadow-sm">
            {icon}
          </div>
        )}
        {title && (
          <h3
            className={cn(
              "text-xl font-bold tracking-tight mb-2",
              variant === "dark" ? "text-white" : "text-foreground",
            )}
          >
            {title}
          </h3>
        )}
        {description && (
          <p
            className={cn(
              "text-sm leading-relaxed",
              variant === "dark"
                ? "text-gray-400"
                : "text-muted-foreground",
            )}
          >
            {description}
          </p>
        )}
        {children && <div className="mt-auto pt-4">{children}</div>}
      </div>
    </div>
  );
}
