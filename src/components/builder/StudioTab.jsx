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
  showEmbed = false,
  setShowEmbed = () => {},
  calendlyLink = "",
}) {
  return (
    <div className="flex flex-col gap-8">

      {/* ✅ PREVIEW SECTION */}
      <div className="w-full">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Live Preview</h2>

          {isConfigSaved && (
            <Button
              variant="secondary"
              onClick={() => setShowEmbed((v) => !v)}
            >
              {showEmbed ? "Hide Embed" : "Get Embed Code"}
            </Button>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
          <ChatbotPreview
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

        {/* ✅ EMBED CODE */}
        {showEmbed && chatbotId && (
          <div className="mt-4 rounded-xl bg-black/30 border border-white/10 p-4 text-sm text-gray-200">
            <p className="mb-2">Embed this script on your website:</p>
            <code className="block text-xs bg-black/50 p-3 rounded-lg overflow-x-auto">
              {`<script src="${API_BASE}/api/embed/${chatbotId}.js" async></script>`}
            </code>
          </div>
        )}
      </div>

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
