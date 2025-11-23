// src/components/LanguageSwitcher.jsx

import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div
      className="
        flex items-center gap-2 
        bg-white/10 px-3 py-2 rounded-xl 
        shadow-md backdrop-blur-xl 
        border border-white/20
      "
    >
      <Globe className="w-5 h-5 text-white opacity-90" />

      <select
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
        className="
          bg-transparent text-white text-sm 
          outline-none cursor-pointer 
          appearance-none px-1
          focus:ring-0 focus:outline-none
        "
        style={{
          WebkitAppearance: "none",
          MozAppearance: "none",
        }}
      >
        <option className="text-black" value="en">English</option>
        <option className="text-black" value="hi">हिन्दी</option>
        <option className="text-black" value="es">Español</option>
        <option className="text-black" value="fr">Français</option>
        <option className="text-black" value="de">Deutsch</option>
        <option className="text-black" value="zh">中文</option>
        <option className="text-black" value="ja">日本語</option>
        <option className="text-black" value="ru">Русский</option>
        <option className="text-black" value="ar">العربية</option>
        <option className="text-black" value="pt">Português</option>
      </select>
    </div>
  );
}
