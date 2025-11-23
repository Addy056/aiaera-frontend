// src/components/MainLayout.jsx
import { useEffect, useState } from "react";
import FloatingMenu from "./FloatingMenu";
import LanguageSelector from "./LanguageSelector";
import { supabase } from "../supabaseClient";

export default function MainLayout({ children }) {
  const [userEmail, setUserEmail] = useState("");
  const [showLangModal, setShowLangModal] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;

      if (!user) return;

      setUserEmail(user.email);

      // Check if language already set
      const savedLang = user.user_metadata?.language;

      if (!savedLang) {
        setShowLangModal(true); // show popup only once
      }
    };

    init();
  }, []);

  const handleLanguageSelect = async (lang) => {
    await supabase.auth.updateUser({
      data: { language: lang }
    });

    setShowLangModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#03040a] via-[#071026] to-[#020205] relative flex">

      <FloatingMenu userEmail={userEmail} />

      <div className="flex-1 p-4 md:p-8 md:ml-32">
        {children}
      </div>

      {showLangModal && (
        <LanguageSelector onSelect={handleLanguageSelect} />
      )}
    </div>
  );
}
