// src/components/builder/EmbedCode.jsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Copy } from "lucide-react";

export default function EmbedCode() {
  const { id } = useParams(); // chatbotId from URL

  const [backendUrl, setBackendUrl] = useState("");
  const [frontendUrl, setFrontendUrl] = useState("");
  const [copied, setCopied] = useState(null); // "script" | "iframe" | null

  useEffect(() => {
    const b = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/$/, "");
    const f = (import.meta.env.VITE_FRONTEND_URL || "").replace(/\/$/, "");

    setBackendUrl(b);
    setFrontendUrl(f);
  }, []);

  if (!id) {
    return (
      <p className="text-sm text-red-400">
        No chatbot found. Please go back.
      </p>
    );
  }

  const scriptCode = `<script async src="${backendUrl}/embed/${id}.js"></script>`;

  const iframeCode = `<iframe
  src="${frontendUrl}/public-chatbot/${id}"
  width="380"
  height="540"
  style="border:0;border-radius:16px;box-shadow:0 20px 50px rgba(0,0,0,0.35);"
  allow="camera; microphone; clipboard-write;"
></iframe>`;

  const copy = async (text, type) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-white tracking-tight">
          Chatbot Embed Code
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Add your chatbot to your website in seconds.
        </p>
      </div>

      {/* Script Embed */}
      <Card className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-white">
            JavaScript Embed (Recommended)
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Paste this inside your website’s header or footer.
          </p>
        </div>

        <div className="relative rounded-xl bg-[#0f0f1a] border border-white/10 p-4">
          <code className="text-xs text-gray-200 whitespace-pre-wrap">
            {scriptCode}
          </code>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => copy(scriptCode, "script")}
            className="absolute top-3 right-3 flex items-center gap-1"
          >
            {copied === "script" ? (
              <>
                <Check className="w-4 h-4" /> Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copy
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Iframe Fallback */}
      <Card className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-white">
            Iframe Embed (Fallback)
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Use this only if your platform blocks JavaScript.
          </p>
        </div>

        <div className="relative rounded-xl bg-[#0f0f1a] border border-white/10 p-4">
          <code className="text-xs text-gray-200 whitespace-pre-wrap">
            {iframeCode}
          </code>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => copy(iframeCode, "iframe")}
            className="absolute top-3 right-3 flex items-center gap-1"
          >
            {copied === "iframe" ? (
              <>
                <Check className="w-4 h-4" /> Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copy
              </>
            )}
          </Button>
        </div>
      </Card>

    </div>
  );
}
