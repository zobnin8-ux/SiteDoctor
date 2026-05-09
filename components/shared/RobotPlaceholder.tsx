import { HeartPulse } from "lucide-react";

import { cn } from "@/lib/utils";

interface Props {
  size?: number;
  /** Родитель задаёт размер (например h-60 w-60 sm:h-80 sm:w-80). Иконка — ~40% от меньшей стороны. */
  fillContainer?: boolean;
  variant?: "hero" | "scanning" | "report";
  className?: string;
}

export function RobotPlaceholder({
  size = 320,
  fillContainer = false,
  variant = "hero",
  className = "",
}: Props) {
  const colors = {
    hero: "text-[var(--accent-tech)] bg-[var(--bg-tertiary)]",
    scanning: "text-[var(--accent-primary)] bg-[var(--bg-secondary)]",
    report: "text-[var(--accent-primary)] bg-[var(--bg-tertiary)]",
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full",
        colors[variant],
        fillContainer && "h-full w-full min-h-0 min-w-0",
        className
      )}
      style={fillContainer ? undefined : { width: size, height: size }}
      aria-hidden
    >
      <HeartPulse
        className={fillContainer ? "h-[40%] w-[40%]" : undefined}
        size={fillContainer ? undefined : size * 0.4}
        strokeWidth={1.5}
      />
    </div>
  );
}
