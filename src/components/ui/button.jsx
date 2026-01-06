import * as React from "react";

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30";

  const variants = {
    primary:
      "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-[0_12px_40px_rgba(127,90,240,0.35)] hover:translate-y-[-1px] hover:shadow-[0_18px_55px_rgba(127,90,240,0.45)]",
    secondary:
      "bg-[#11111b] text-white border border-white/15 shadow-[0_10px_35px_rgba(0,0,0,0.5)] hover:border-purple-400/30",
    ghost:
      "bg-transparent text-purple-300 hover:text-purple-200",
  };

  return (
    <button
      {...props}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
