// src/components/builder/ColorSwatch.jsx

import { useRef } from "react";

export default function ColorSwatch({ label, value, onChange }) {
  const inputRef = useRef(null);

  return (
    <div className="flex flex-col items-center">
      <span className="text-xs text-gray-400 mb-1">{label}</span>

      {/* Color Preview Box */}
      <div
        className="w-[28px] h-[28px] rounded-md border border-white/20 cursor-pointer shadow-md"
        style={{ backgroundColor: value }}
        onClick={() => inputRef.current?.click()}
      />

      {/* Hidden Input */}
      <input
        ref={inputRef}
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="hidden"
      />
    </div>
  );
}
