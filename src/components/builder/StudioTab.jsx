// src/components/builder/StudioTab.jsx

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bot, Calendar, Code2, Copy, Eye } from "lucide-react";

import ColorSwatch from "./ColorSwatch";
import ChatbotPreview from "@/components/ChatbotPreview.jsx";

export default function StudioTab({
  presetThemes = {},                  // ✅ HARD SAFETY DEFAULT
  themeColors,
  setThemeColors,

  logoUrl,
  setLogoUrl,
  logoInputRef,
  uploadFileToStorage,

  chatbotId,
  businessName,
  files = [],
  user,
  isConfigSaved,

  APP_BASE_URL,
  API_BASE,
  showEmbed,
  setShowEmbed,

  calendlyLink,
}) {
  const [copying, setCopying] = useState(false);

  // ✅ SAFE FRONTEND BASE (PREVENTS undefined/public-chatbot URLs)
  const SAFE_APP_BASE =
    APP_BASE_URL || window?.location?.origin || "";

  // -----------------------------
  // Logo Upload Handler
  // -----------------------------
  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { url } = await uploadFileToStorage(file);
      setLogoUrl(url);
    } catch (err) {
      console.error(err);
      alert("Logo upload failed.");
    } finally {
      if (logoInputRef.current) logoInputRef.current.value = "";
    }
  };

  // -----------------------------
  // Copy Embed Code
  // -----------------------------
  const copyEmbedCode = async (embedCode) => {
    try {
      setCopying(true);
      await navigator.clipboard.writeText(embedCode);
    } finally {
      setTimeout(() => setCopying(false), 800);
    }
  };

  // -----------------------------
  // ✅ SAFE EMBED CODE STRING
  // -----------------------------
  const iframeEmbed = useMemo(() => {
    if (!SAFE_APP_BASE || !chatbotId) return "";
    return `<iframe src="${SAFE_APP_BASE}/public-chatbot/${chatbotId}" width="400" height="500" style="border:none; border-radius:16px;"></iframe>`;
  }, [SAFE_APP_BASE, chatbotId]);

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
        🎨 Studio — Customize, Preview & Embed
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* LEFT — DESIGN PANEL */}
        <Card className="bg-white/5 border border-white/10 backdrop-blur-xl p-6 rounded-3xl shadow-[0_0_40px_rgba(127,90,240,0.25)]">

          {/* ✅ PRESET THEMES (SAFE LOOP) */}
          <div className="flex flex-wrap gap-3 mb-6">
            {Object.keys(presetThemes).length > 0 ? (
              Object.entries(presetThemes).map(([key, theme]) => (
                <Button
                  key={key}
                  className="bg-white/10 hover:bg-white/20 capitalize"
                  onClick={() => setThemeColors(theme)}
                >
                  {key}
                </Button>
              ))
            ) : (
              <p className="text-xs text-gray-400">No presets</p>
            )}
          </div>

          {/* Color Swatches */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <ColorSwatch
              label="Background"
              value={themeColors.background}
              onChange={(v) =>
                setThemeColors((p) => ({ ...p, background: v }))
              }
            />
            <ColorSwatch
              label="User"
              value={themeColors.userBubble}
              onChange={(v) =>
                setThemeColors((p) => ({ ...p, userBubble: v }))
              }
            />
            <ColorSwatch
              label="Bot"
              value={themeColors.botBubble}
              onChange={(v) =>
                setThemeColors((p) => ({ ...p, botBubble: v }))
              }
            />
            <ColorSwatch
              label="Text"
              value={themeColors.text}
              onChange={(v) => setThemeColors((p) => ({ ...p, text: v }))}
            />
          </div>

          {/* Logo Upload */}
          <div className="flex items-center gap-4 mt-6">
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoUpload}
            />
            <Button onClick={() => logoInputRef.current?.click()}>
              Upload Logo
            </Button>

            {!!logoUrl && (
              <img
                src={logoUrl}
                alt="logo"
                className="w-12 h-12 rounded-lg object-cover border border-white/20"
              />
            )}
          </div>
        </Card>

        {/* RIGHT — LIVE PREVIEW */}
        <Card className="bg-white/10 border border-white/10 rounded-3xl p-6 backdrop-blur-2xl">
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-white">
            <Bot className="w-5 h-5" /> Live Chatbot Preview
          </h3>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-inner">
            <ChatbotPreview
              chatbotConfig={{
                id: chatbotId,
                name: businessName,
                files,
                logoUrl,
                themeColors,
                calendlyLink,
              }}
              user={user}
            />
          </div>

          {/* EMBED BUTTONS */}
          {isConfigSaved && chatbotId && (
            <div className="mt-5 space-y-3">
              <Button
                onClick={() => setShowEmbed((prev) => !prev)}
                className="w-full bg-gradient-to-r from-[#7f5af0] via-[#9b8cff] to-[#5be7ff]"
              >
                {showEmbed ? "Hide Embed Code" : "Get Embed Code"}
              </Button>

              {!!calendlyLink && (
                <Button
                  onClick={() => window.open(calendlyLink, "_blank")}
                  className="w-full bg-gradient-to-r from-[#00eaff] via-[#7f5af0] to-[#bfa7ff]"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book a Meeting
                </Button>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* EMBED CODE DRAWER */}
      {showEmbed && isConfigSaved && chatbotId && (
        <Card className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Code2 className="w-4 h-4" /> Embed Code
            </h4>

            <a
              href={`${SAFE_APP_BASE}/public-chatbot/${chatbotId}`}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-[#bfa7ff] hover:underline flex items-center gap-1"
            >
              <Eye className="w-4 h-4" />
              Preview
            </a>
          </div>

          <textarea
            readOnly
            className="w-full h-28 bg-black/30 text-white/90 p-3 rounded-xl font-mono text-sm border border-white/10"
            value={iframeEmbed}
          />

          <div className="flex justify-between items-center mt-3 flex-wrap gap-3">
            <Button
              onClick={() => copyEmbedCode(iframeEmbed)}
              className="flex items-center gap-2 bg-gradient-to-r from-[#9b8cff] to-[#bfa7ff]"
            >
              {copying ? "Copied!" : <Copy className="w-4 h-4" />}
              {copying ? "" : "Copy"}
            </Button>

            <Button
              onClick={() => setShowEmbed(false)}
              variant="ghost"
              className="bg-white/10 hover:bg-white/20"
            >
              Close
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
