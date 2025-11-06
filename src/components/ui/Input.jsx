import * as React from "react";

export const Input = React.forwardRef(({ className = "", type = "text", ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={`w-full rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a1a1f]/80 to-[#0d0d10]/80 text-white placeholder-gray-400 p-3 shadow-md backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${className}`}
      {...props}
    />
  );
});
Input.displayName = "Input";
