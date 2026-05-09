import Link from "next/link";

import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

type LogoProps = {
  variant: "light" | "dark";
  className?: string;
  href?: string;
};

/** Wordmark + tech-cross icon. TODO: заменить иконку на финальную из брендбука */
export function Logo({ variant, className, href = "/" }: LogoProps) {
  const stroke = variant === "light" ? "#0A0E1A" : "#00D4FF";
  const textClass =
    variant === "light"
      ? "text-[var(--text-primary)]"
      : "text-[var(--text-primary)]";

  const inner = (
    <>
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border"
        style={{
          borderColor: stroke,
        }}
        aria-hidden
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path
            d="M4 11h4l1.5-3 2 6 2-5h6"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span
        className={cn(
          "font-display text-lg font-semibold tracking-tight",
          textClass
        )}
      >
        {BRAND.name}
      </span>
    </>
  );

  return (
    <Link
      href={href}
      className={cn("flex items-center gap-2", className)}
      aria-label={`${BRAND.name} — на главную`}
    >
      {inner}
    </Link>
  );
}
