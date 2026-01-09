// src/components/builder/StudioTab.jsx

import { useState } from "react";
import ChatbotPreview from "../ChatbotPreview";
import ColorSwatch from "./ColorSwatch";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Copy, Check } from "lucide-react";

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
  const [copied, setCopied] = useState(false);

  const embedCode =
    chatbotId && API_BASE
      ? `<script src="${API_BASE}/embed/${chatbotId}.js"></script>`
      : "";

  const handleCopy = async () => {
    if (!embedCode) return;
    await navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-10">

      {/* LIVE PREVIEW */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white tracking-tight">
              Live Preview
            </h2>
            <p className="text-sm text-gray-400">
              See exactly how your chatbot will look to users.
            </p>
          </div>

          <Button
            variant="secondary"
            disabled={!isConfigSaved || !chatbotId}
            onClick={() => setShowEmbed(true)}
          >
            Get Embed Code
          </Button>
        </div>

        <Card className="p-4">
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
        </Card>
      </div>

      {/* APPEARANCE & BRANDING */}
      <Card className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Appearance & Branding
          </h3>
          <p className="text-sm text-gray-400">
            Customize colors and branding to match your business.
          </p>
        </div>

        {/* PRESET THEMES */}
        <div className="space-y-2">
          <p className="text-sm text-gray-300">Preset Themes</p>
          <div className="flex flex-wrap gap-2">
            {Object.keys(presetThemes || {}).length > 0 ? (
              Object.keys(presetThemes).map((key) => (
                <Button
                  key={key}
                  size="sm"
                  variant="secondary"
                  onClick={() => setThemeColors(presetThemes[key])}
                >
                  {key}
                </Button>
              ))
            ) : (
              <p className="text-xs text-gray-500">
                No presets available
              </p>
            )}
          </div>
        </div>

        {/* CUSTOM COLORS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
        <div className="space-y-2">
          <p className="text-sm text-gray-300">Bot Logo</p>

          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              const uploaded = await uploadFileToStorage(file);
              if (uploaded?.url) setLogoUrl(uploaded.url);
            }}
          />

          {logoUrl && (
            <img
              src={logoUrl}
              alt="Bot Logo"
              className="mt-2 w-16 h-16 object-contain
                         rounded-xl border border-white/10"
            />
          )}
        </div>
      </Card>

      {/* EMBED MODAL */}
      {showEmbed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <Card className="relative w-full max-w-xl p-6">
            <button
              onClick={() => setShowEmbed(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-semibold text-white">
              Embed Your Chatbot
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              Paste this before the closing <code>&lt;/body&gt;</code> tag.
            </p>

            <div className="mt-4 rounded-xl bg-[#0f0f1a]
                            border border-white/10 p-4">
              <code className="text-xs text-gray-200 whitespace-pre-wrap">
                {embedCode || "Save your chatbot to generate embed code."}
              </code>
            </div>

            <div className="mt-4 flex gap-3">
              <Button
                className="flex items-center gap-2"
                disabled={!embedCode}
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Copy Embed Code
                  </>
                )}
              </Button>

              <Button
                variant="secondary"
                onClick={() => setShowEmbed(false)}
              >
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
