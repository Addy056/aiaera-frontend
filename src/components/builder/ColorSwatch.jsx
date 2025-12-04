// src/components/builder/ColorSwatch.jsx
import { useRef } from "react";

export default function ColorSwatch({ label, color, value, onChange }) {
  const inputRef = useRef(null);

  // ✅ Support BOTH prop names safely
  const activeColor = color || value || "#000000";

  return (
    <div className="flex flex-col items-center">
      <span className="text-xs text-gray-400 mb-1">{label}</span>

      {/* ✅ Visible Color Box */}
      <div
        className="w-[28px] h-[28px] rounded-md border border-white/20 cursor-pointer shadow-md"
        style={{ backgroundColor: activeColor }}
        onClick={() => inputRef.current?.click()}
      />

      {/* ✅ Hidden Native Color Picker */}
      <input
        ref={inputRef}
        type="color"
        value={activeColor}
        onChange={(e) => onChange(e.target.value)}
        className="hidden"
      />
    </div>
  );
}
