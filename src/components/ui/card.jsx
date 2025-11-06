import * as React from "react";

export function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-3xl p-6 bg-white/5 border border-white/8 backdrop-blur-md shadow-[0_25px_80px_rgba(0,0,0,0.6)] ${className}`}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={`prose text-sm ${className}`}>{children}</div>;
}
