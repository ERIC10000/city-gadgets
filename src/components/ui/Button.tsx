import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

const VARIANTS = {
  primary: "bg-primary text-on-primary hover:opacity-90",
  secondary: "bg-surface-container-highest text-on-surface hover:bg-primary hover:text-on-primary",
  outline: "border border-outline-variant text-on-surface hover:border-primary hover:text-primary bg-transparent",
  ghost: "bg-transparent text-on-surface-variant hover:bg-surface-container-high",
  mpesa: "bg-m-pesa-green text-white hover:opacity-90",
  whatsapp: "bg-whatsapp-green text-white hover:opacity-90",
  danger: "border border-error text-error hover:bg-error hover:text-on-error bg-transparent",
} as const;

const SIZES = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6",
  lg: "h-12 px-8",
} as const;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex select-none items-center justify-center gap-2 rounded-xl font-bold transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    />
  );
});
