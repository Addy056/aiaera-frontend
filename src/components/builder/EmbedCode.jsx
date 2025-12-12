import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function EmbedCode() {
  const { id } = useParams(); // chatbotId from URL

  const [backendUrl, setBackendUrl] = useState("");
  const [frontendUrl, setFrontendUrl] = useState("");

  useEffect(() => {
    const b = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/$/, "");
    const f = (import.meta.env.VITE_FRONTEND_URL || "").replace(/\/$/, "");

    setBackendUrl(b);
    setFrontendUrl(f);
  }, []);

  if (!id) {
    return (
      <div style={{ padding: 20, color: "white" }}>
        ❌ No chatbot found. Please go back.
      </div>
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

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied!");
  };

  return (
    <div
      style={{
        padding: "30px",
        color: "white",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>
        🔧 Chatbot Embed Code
      </h2>

      <p style={{ opacity: 0.8 }}>
        Copy and paste this script into the{" "}
        <b>footer or header of your website</b>.
      </p>

      {/* SCRIPT EMBED */}
      <div
        style={{
          marginTop: "16px",
          background: "rgba(255,255,255,0.08)",
          padding: "18px",
          borderRadius: "12px",
          position: "relative",
        }}
      >
        <code style={{ whiteSpace: "pre-wrap", fontSize: "14px" }}>
          {scriptCode}
        </code>

        <button
          onClick={() => copy(scriptCode)}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            padding: "6px 14px",
            background: "#7f5af0",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Copy
        </button>
      </div>

      {/* FALLBACK */}
      <h3 style={{ marginTop: "30px" }}>📦 Iframe Fallback (For Websites That Block Scripts)</h3>
      <p style={{ opacity: 0.8 }}>
        If your platform does not allow JavaScript, use this alternative embed:
      </p>

      <div
        style={{
          marginTop: "16px",
          background: "rgba(255,255,255,0.08)",
          padding: "18px",
          borderRadius: "12px",
          position: "relative",
        }}
      >
        <code style={{ whiteSpace: "pre-wrap", fontSize: "14px" }}>
          {iframeCode}
        </code>

        <button
          onClick={() => copy(iframeCode)}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            padding: "6px 14px",
            background: "#7f5af0",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Copy
        </button>
      </div>
    </div>
  );
}
