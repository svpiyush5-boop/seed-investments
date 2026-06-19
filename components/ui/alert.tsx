import React from "react";
import { cn } from "@/lib/utils";
import { Info, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

const alertVariants = {
  info: {
    container:
      "bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800",
    text: "text-blue-800 dark:text-blue-300",
    icon: Info,
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  warning: {
    container:
      "bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800",
    text: "text-amber-800 dark:text-amber-300",
    icon: AlertTriangle,
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  success: {
    container:
      "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800",
    text: "text-emerald-800 dark:text-emerald-300",
    icon: CheckCircle2,
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  destructive: {
    container:
      "bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800",
    text: "text-red-800 dark:text-red-300",
    icon: XCircle,
    iconColor: "text-red-600 dark:text-red-400",
  },
};

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof alertVariants;
  icon?: boolean;
  collapsible?: boolean;
}

export function Alert({
  className,
  variant = "info",
  icon = true,
  collapsible = false,
  children,
  ...props
}: AlertProps) {
  const [isOpen, setIsOpen] = React.useState(!collapsible);
  const config = alertVariants[variant];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "rounded-2xl border p-5 transition-all duration-300",
        config.container,
        className,
      )}
      role="alert"
      {...props}
    >
      <div className="flex items-start gap-3">
        {icon && (
          <Icon
            className={cn("w-5 h-5 mt-0.5 flex-shrink-0", config.iconColor)}
          />
        )}
        <div
          className={cn(
            "flex-1 text-sm leading-relaxed",
            config.text,
          )}
        >
          {collapsible ? (
            <>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 font-semibold"
                aria-expanded={isOpen}
              >
                {children}
              </button>
              <div
                className={cn(
                  "grid transition-all duration-300",
                  isOpen
                    ? "grid-rows-[1fr] opacity-100 mt-3"
                    : "grid-rows-[0fr] opacity-0",
                )}
              >
                <div className="overflow-hidden">{children}</div>
              </div>
            </>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
}
