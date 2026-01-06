import * as React from "react";

export const Textarea = React.forwardRef(
  ({ className = "", ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        {...props}
        className={`w-full min-h-[120px]
                    resize-none
                    rounded-xl
                    bg-[#0f0f1a]
                    border border-white/10
                    px-4 py-3
                    text-sm text-white
                    placeholder-gray-500
                    shadow-[0_10px_35px_rgba(0,0,0,0.5)]
                    transition
                    focus:outline-none
                    focus:border-purple-400/40
                    focus:ring-2 focus:ring-purple-500/20
                    ${className}`}
      />
    );
  }
);

Textarea.displayName = "Textarea";
