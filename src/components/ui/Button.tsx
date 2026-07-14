import * as React from "react";

/**
 * Brand button. Three variants so consumers don't reinvent neon pills.
 *   - primary: filled neon, glow (default CTA)
 *   - secondary: filled cyan (alt CTA, used for ticket links)
 *   - ghost: bordered, transparent (cancel / secondary nav)
 */

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold uppercase tracking-widest transition";

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
};

const variants: Record<Variant, string> = {
  primary: "bg-brand-neon text-brand-ink shadow-glow-neon hover:-translate-y-px",
  secondary: "bg-brand-cyan text-brand-ink shadow-glow-cyan hover:-translate-y-px",
  ghost: "border border-brand-line text-brand-paper hover:border-brand-cyan/60",
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};
export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...rest}
    />
  );
}

type LinkButtonProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  size?: Size;
};
export function LinkButton({
  variant = "primary",
  size = "md",
  className = "",
  ...rest
}: LinkButtonProps) {
  return (
    <a
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...rest}
    />
  );
}
