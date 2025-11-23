// src/components/LanguageSelector.jsx
import { useState } from "react";

export default function LanguageSelector({ onSelect }) {
  const [lang, setLang] = useState("en");

  const LANGUAGES = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिन्दी (Hindi)" },
    { code: "es", label: "Español (Spanish)" },
    { code: "fr", label: "Français (French)" },
    { code: "de", label: "Deutsch (German)" },
    { code: "zh", label: "中文 (Chinese)" },
    { code: "ja", label: "日本語 (Japanese)" },
    { code: "ar", label: "العربية (Arabic)" },
    { code: "pt", label: "Português (Portuguese)" },
    { code: "ru", label: "Русский (Russian)" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1a1a2e] p-6 rounded-xl w-80 space-y-4 text-center shadow-xl border border-white/10">
        <h2 className="text-white font-bold text-xl">Choose Your Language</h2>

        <select
          className="bg-black/30 text-white p-2 rounded w-full"
          value={lang}
          onChange={(e) => setLang(e.target.value)}
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>{l.label}</option>
          ))}
        </select>

        <button
          onClick={() => onSelect(lang)}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 p-2 rounded text-white font-bold"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
