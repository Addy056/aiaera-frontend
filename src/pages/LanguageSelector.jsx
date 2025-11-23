// src/pages/LanguageSelector.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LanguageSelector({ onSelect, open }) {
  const [lang, setLang] = useState("en");

  // Close on ESC key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onSelect(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onSelect]);

  if (!open) return null;

  const handleConfirm = () => {
    onSelect(lang);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[999]"
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl 
                     w-80 p-6 space-y-5 text-center"
        >
          <h2 className="text-white font-bold text-2xl">Choose Language</h2>

          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="w-full bg-black/30 text-white p-3 rounded-xl outline-none focus:ring-2 
                       focus:ring-purple-500 transition-all"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी (Hindi)</option>
            <option value="es">Español (Spanish)</option>
            <option value="fr">Français (French)</option>
            <option value="de">Deutsch (German)</option>
            <option value="zh">中文 (Chinese)</option>
            <option value="ja">日本語 (Japanese)</option>
            <option value="ar">العربية (Arabic)</option>
            <option value="pt">Português (Portuguese)</option>
            <option value="ru">Русский (Russian)</option>
          </select>

          <button
            onClick={handleConfirm}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-xl text-white 
                       text-lg font-semibold shadow-lg hover:shadow-purple-500/30 transition-all"
          >
            Continue
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
