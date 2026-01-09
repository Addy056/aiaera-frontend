// src/components/builder/LockedSection.jsx

import { Lock } from "lucide-react";

export default function LockedSection({ message }) {
  return (
    <div
      className="flex flex-col items-center justify-center
                 rounded-2xl
                 border border-white/10
                 bg-[#0f0f1a]
                 px-6 py-20
                 text-center
                 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
    >
      <div
        className="mb-4 flex h-10 w-10 items-center justify-center
                   rounded-full
                   border border-purple-400/30
                   bg-purple-500/10"
      >
        <Lock className="h-5 w-5 text-purple-300" />
      </div>

      <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
        {message}
      </p>
    </div>
  );
}
