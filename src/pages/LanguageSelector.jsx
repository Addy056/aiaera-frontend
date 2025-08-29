// src/pages/LanguageSelector.jsx
import { useState } from "react";

export default function LanguageSelector({ onSelect }) {
  const [lang, setLang] = useState("en");

  const handleConfirm = () => {
    onSelect(lang);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-[#1a1a2e] p-6 rounded-xl w-80 space-y-4 text-center">
        <h2 className="text-white font-bold text-xl">Select Your Language</h2>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="bg-black/30 text-white p-2 rounded w-full"
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
        </select>
        <button
          onClick={handleConfirm}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 p-2 rounded text-white font-bold"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
