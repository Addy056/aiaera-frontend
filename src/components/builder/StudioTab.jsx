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

  const embedCode = `<script src="${API_BASE}/embed/${chatbotId}.js"></script>`;

  return (
    <div className="flex flex-col gap-8">

      {/* ✅ PREVIEW SECTION */}
      <div className="w-full">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Live Preview</h2>

          {/* ✅ EMBED BUTTON */}
          {isConfigSaved && chatbotId && (
            <Button
              variant="secondary"
              onClick={() => setShowEmbed(true)}
            >
              Get Embed Code
            </Button>
          )}
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

      {/* ✅ PREMIUM EMBED CODE MODAL */}
      {showEmbed && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative w-full max-w-xl rounded-3xl p-[1px] bg-gradient-to-br from-purple-500/40 via-cyan-400/20 to-purple-600/40 shadow-[0_0_60px_rgba(127,90,240,0.35)]">

            {/* GLASS CARD */}
            <div className="relative bg-[#0b0b17]/90 backdrop-blur-xl rounded-3xl p-6 border border-white/10">

              {/* CLOSE BUTTON */}
              <button
                onClick={() => setShowEmbed(false)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
              >
                ✕
              </button>

              {/* HEADER */}
              <div className="mb-5">
                <h3 className="text-xl font-bold text-white">
                  Embed Your Chatbot
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  Paste this script before the closing
                  <code className="mx-1 text-purple-400">&lt;/body&gt;</code>
                  tag of your website.
                </p>
              </div>

              {/* CODE BOX */}
              <div className="relative rounded-xl bg-black/50 border border-white/10 p-4 font-mono text-sm text-green-400 overflow-hidden">
                <div className="absolute inset-0 rounded-xl pointer-events-none bg-gradient-to-br from-purple-500/10 to-cyan-400/10" />

                <textarea
                  readOnly
                  value={embedCode}
                  className="relative w-full h-24 bg-transparent resize-none outline-none"
                />
              </div>

              {/* ACTIONS */}
              <div className="mt-6 flex gap-3">
                <Button
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-semibold shadow-lg"
                  onClick={() => {
                    navigator.clipboard.writeText(embedCode);
                    alert("✅ Embed code copied!");
                  }}
                >
                  Copy Code
                </Button>

                <Button
                  variant="outline"
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                  onClick={() => setShowEmbed(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ COLOR + LOGO SECTION */}
      <div className="w-full border border-white/10 rounded-2xl bg-white/5 p-6">
        <h3 className="text-lg font-semibold mb-4">
          Appearance & Branding
        </h3>

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
              <p className="text-xs text-gray-400">
                No presets available
              </p>
            )}
          </div>
        </div>

        {/* CUSTOM COLOR PICKER */}
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

              const uploaded = await uploadFileToStorage(file);
              if (uploaded?.url) {
                setLogoUrl(uploaded.url);
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
