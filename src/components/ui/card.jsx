import * as React from "react";

export function Card({ children, className = "" }) {
  return (
    <div
      className={`relative rounded-3xl
                  bg-[#11111b]
                  border border-white/10
                  p-6
                  shadow-[0_30px_90px_rgba(0,0,0,0.65)]
                  ${className}`}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }) {
  return (
    <div
      className={`text-sm text-gray-300 leading-relaxed ${className}`}
    >
      {children}
    </div>
  );
}
