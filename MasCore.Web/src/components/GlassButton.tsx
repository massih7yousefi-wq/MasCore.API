import type { ButtonHTMLAttributes, ReactNode } from "react";

interface GlassButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger";
}

export default function GlassButton({
  children,
  variant = "primary",
  className = "",
  ...props
}: GlassButtonProps) {
  return (
    <button
      className={`glass-button glass-button-${variant} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}