// src/components/builder/ColorSwatch.jsx
import { useRef } from "react";

export default function ColorSwatch({ label, color, value, onChange }) {
  const inputRef = useRef(null);

  // Support both prop names safely
  const activeColor = color || value || "#000000";

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs text-gray-400">{label}</span>

      {/* Color swatch */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-7 h-7 rounded-md
                   border border-white/15
                   shadow-[0_6px_20px_rgba(0,0,0,0.45)]
                   transition
                   hover:border-purple-400/40
                   focus:outline-none
                   focus:ring-2 focus:ring-purple-500/30"
        style={{ backgroundColor: activeColor }}
        aria-label={`Select ${label} color`}
      />

      {/* Hidden native color picker */}
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
