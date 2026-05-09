import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-secondary)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--accent-primary)] text-white hover:opacity-95 shadow-card",
        secondary:
          "bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--bg-secondary)]",
        ghost: "hover:bg-[var(--bg-tertiary)]",
        link: "text-[var(--accent-primary)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 py-2",
        lg: "h-14 px-8 text-base font-medium",
        sm: "h-9 rounded-lg px-4",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
