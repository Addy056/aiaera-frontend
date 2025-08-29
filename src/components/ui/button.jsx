import * as React from "react";

export function Button({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`rounded-2xl px-4 py-2 font-semibold transition shadow-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-95 ${className}`}
    >
      {children}
    </button>
  );
}
