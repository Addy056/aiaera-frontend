// src/components/builder/LockedSection.jsx

import { Lock } from "lucide-react";

export default function LockedSection({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-gray-400">
      <Lock className="w-8 h-8 mb-3 text-[#bfa7ff]" />
      <p className="text-center text-sm max-w-xs leading-relaxed">{message}</p>
    </div>
  );
}
