import { useState } from "react";
import ChatbotPreview from "../ChatbotPreview";
import ColorSwatch from "./ColorSwatch";
import { Button } from "@/components/ui/button";

export default function StudioTab({
  themeColors = {
    background: "#0b0b17",
    userBubble: "#7f5af0",
    botBubble: "#70e1ff",
    text: "#ffffff",
  },
  setThemeColors = () => {},
  presetThemes = {},
  logoUrl = null,
  setLogoUrl = () => {},
  logoInputRef = { current: null },
  uploadFileToStorage = async () => ({}),
  chatbotId,
  businessName,
  files = [],
  user,
  isConfigSaved = false,
  APP_BASE_URL,
  API_BASE,
  calendlyLink = "",
}) {
  const [showEmbed, setShowEmbed] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");

  const safeApiBase = API_BASE || "";
  const embedCode =
    chatbotId && safeApiBase
      ? `<script src="${safeApiBase}/embed/${chatbotId}.js"></script>`
      : "";

  const handleCopy = async () => {
    if (!embedCode) return;

    try {
      await navigator.clipboard.writeText(embedCode);
      setCopyStatus("✅ Copied!");
      setTimeout(() => setCopyStatus(""), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
      setCopyStatus("❌ Copy failed");
      setTimeout(() => setCopyStatus(""), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* ✅ PREVIEW SECTION */}
      <div className="w-full">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Live Preview</h2>

          {/* ✅ SAFE EMBED BUTTON */}
          <Button
            variant="secondary"
            disabled={!isConfigSaved || !chatbotId}
            onClick={() => setShowEmbed(true)}
          >
            Get Embed Code
          </Button>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
          <ChatbotPreview
            key={JSON.stringify(themeColors)}
            chatbotId={chatbotId}
            themeColors={themeColors}
            logoUrl={logoUrl}
            businessName={businessName}
            files={files}
            user={user}
            API_BASE={API_BASE}
            calendlyLink={calendlyLink}
          />
        </div>
      </div>

      {/* ✅ SECURE EMBED MODAL */}
      {showEmbed && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#0b0b17] w-full max-w-xl rounded-2xl p-6 border border-white/10 shadow-2xl relative">
            
            {/* CLOSE */}
            <button
              onClick={() => setShowEmbed(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
            >
              ✕
            </button>

            <h3 className="text-lg font-semibold mb-2">Embed Your Chatbot</h3>

            <p className="text-sm text-gray-400 mb-4">
              Paste this script before closing{" "}
              <code className="text-purple-400">&lt;/body&gt;</code> on your
              website.
            </p>

            {/* CODE BOX */}
            <textarea
              readOnly
              value={embedCode || "Save your chatbot to generate embed code."}
              className="w-full h-28 bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-green-400"
            />

            {/* ACTIONS */}
            <div className="mt-4 flex items-center gap-3">
              <Button
                className="flex-1"
                disabled={!embedCode}
                onClick={handleCopy}
              >
                Copy Embed Code
              </Button>

              <Button
                variant="outline"
                className="border-white/20"
                onClick={() => setShowEmbed(false)}
              >
                Close
              </Button>
            </div>

            {copyStatus && (
              <p className="mt-2 text-sm text-center text-gray-400">
                {copyStatus}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ✅ COLOR + LOGO SECTION */}
      <div className="w-full border border-white/10 rounded-2xl bg-white/5 p-6">
        <h3 className="text-lg font-semibold mb-4">Appearance & Branding</h3>

        {/* PRESET THEMES */}
        <div className="mb-6">
          <p className="text-sm text-gray-300 mb-2">Preset Themes</p>
          <div className="flex flex-wrap gap-3">
            {Object.keys(presetThemes || {}).length > 0 ? (
              Object.keys(presetThemes).map((key) => (
                <Button
                  key={key}
                  variant="outline"
                  size="sm"
                  onClick={() => setThemeColors(presetThemes[key])}
                >
                  {key}
                </Button>
              ))
            ) : (
              <p className="text-xs text-gray-400">No presets available</p>
            )}
          </div>
        </div>

        {/* CUSTOM COLORS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <ColorSwatch
            label="Background"
            color={themeColors.background}
            onChange={(v) =>
              setThemeColors((p) => ({ ...p, background: v }))
            }
          />
          <ColorSwatch
            label="User Bubble"
            color={themeColors.userBubble}
            onChange={(v) =>
              setThemeColors((p) => ({ ...p, userBubble: v }))
            }
          />
          <ColorSwatch
            label="Bot Bubble"
            color={themeColors.botBubble}
            onChange={(v) =>
              setThemeColors((p) => ({ ...p, botBubble: v }))
            }
          />
          <ColorSwatch
            label="Text"
            color={themeColors.text}
            onChange={(v) =>
              setThemeColors((p) => ({ ...p, text: v }))
            }
          />
        </div>

        {/* LOGO UPLOAD */}
        <div>
          <p className="text-sm text-gray-300 mb-2">Bot Logo</p>

          <input
            type="file"
            ref={logoInputRef}
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              try {
                const uploaded = await uploadFileToStorage(file);
                if (uploaded?.url) {
                  setLogoUrl(uploaded.url);
                }
              } catch (err) {
                console.error("Logo upload failed:", err);
              }
            }}
          />

          {logoUrl && (
            <img
              src={logoUrl}
              alt="Bot Logo"
              className="mt-3 w-16 h-16 object-contain rounded-xl border border-white/10"
            />
          )}
        </div>
      </div>
    </div>
  );
}
