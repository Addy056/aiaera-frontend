// src/components/ChatbotPreview.jsx
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { supabase } from "../supabaseClient";

export default function ChatbotPreview({ chatbotConfig, user, isPublic }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi 👋 I'm your AI assistant. How can I help you today?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const themeColors = chatbotConfig?.themeColors || {
    background: "#1a1a2e",
    userBubble: "#7f5af0",
    botBubble: "#6b21a8",
    text: "#ffffff",
  };

  const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // Scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send message
  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      let headers = { "Content-Type": "application/json" };
      if (!isPublic && user) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error("No active Supabase session found");
        headers.Authorization = `Bearer ${session.access_token}`;
      }

      const res = await axios.post(
  `${API_BASE}/api/chatbot-preview`,

        { messages: newMessages, chatbotConfig, userId: user?.id || null },
        { headers }
      );

      const reply = res.data?.reply || "🤖 (No reply received)";
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (error) {
      console.error("Chatbot preview error:", error);
      setMessages([
        ...newMessages,
        { role: "assistant", content: "⚠️ Error: Failed to fetch reply." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatText = (text) => {
    if (!text) return "";
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, idx) =>
      urlRegex.test(part) ? (
        <a
          key={idx}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: themeColors.userBubble, textDecoration: "underline" }}
        >
          {part}
        </a>
      ) : (
        <span key={idx}>{part}</span>
      )
    );
  };

  const getGoogleMapsLink = (lat, lng) =>
    `https://www.google.com/maps?q=${lat},${lng}`;

  return (
    <div style={{ ...styles.wrapper, background: themeColors.background }}>
      <div style={styles.chatbotPreview}>
        {/* Header */}
        <div
          style={{
            ...styles.header,
            background: `linear-gradient(135deg, ${themeColors.userBubble}, ${darkenColor(
              themeColors.userBubble,
              20
            )})`,
          }}
        >
          {chatbotConfig?.logoUrl && (
            <img src={chatbotConfig.logoUrl} alt="Logo" style={styles.logo} />
          )}
          <span style={{ color: "white", fontWeight: "bold", fontSize: "16px" }}>
            {chatbotConfig?.name || "AI Chatbot"}
          </span>
        </div>

        {/* Business Info */}
        {chatbotConfig?.businessDescription && (
          <div style={styles.businessInfo}>{chatbotConfig.businessDescription}</div>
        )}
        {chatbotConfig?.websiteUrl && (
          <a
            href={chatbotConfig.websiteUrl}
            target="_blank"
            rel="noreferrer"
            style={{ ...styles.websiteLink, color: themeColors.userBubble }}
          >
            Visit Website
          </a>
        )}
        {chatbotConfig?.businessAddress && (
          <div style={styles.address}>
            <strong>Address:</strong>{" "}
            {chatbotConfig.location?.lat && chatbotConfig.location?.lng ? (
              <a
                href={getGoogleMapsLink(chatbotConfig.location.lat, chatbotConfig.location.lng)}
                target="_blank"
                rel="noreferrer"
                style={{ color: themeColors.userBubble, textDecoration: "underline" }}
              >
                {chatbotConfig.businessAddress}
              </a>
            ) : (
              chatbotConfig.businessAddress
            )}
          </div>
        )}

        {/* Uploaded Files */}
        {chatbotConfig?.files?.length > 0 && (
          <div style={styles.filesContainer}>
            <strong>Files:</strong>
            <ul style={styles.fileList}>
              {chatbotConfig.files.map((f) => (
                <li key={f.publicUrl}>
                  <a
                    href={f.publicUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ ...styles.fileLink, color: themeColors.userBubble }}
                  >
                    {f.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Chat Messages */}
        <div style={styles.messages}>
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                ...styles.message,
                ...(msg.role === "user" ? styles.userMsg : styles.assistantMsg),
              }}
            >
              <div
                style={{
                  ...styles.bubble,
                  backgroundColor:
                    msg.role === "user" ? themeColors.userBubble : themeColors.botBubble,
                  color: themeColors.text,
                }}
              >
                {formatText(msg.content)}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ ...styles.message, ...styles.assistantMsg }}>
              <div style={{ ...styles.bubble, backgroundColor: themeColors.botBubble }}>
                ...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area (hidden for public mode) */}
        {!isPublic && (
          <div style={styles.inputArea}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              style={{ ...styles.textarea, color: themeColors.text }}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              style={{ ...styles.button, background: themeColors.userBubble }}
            >
              Send
            </button>
          </div>
        )}

        {/* Embed Code */}
        {!isPublic && (
          <div style={styles.embedSection}>
            <label style={{ marginBottom: "6px", color: "white", fontWeight: "bold" }}>
              Embed this chatbot on your website:
            </label>
            <textarea
              readOnly
              value={`<div id="aiaera-chatbot"></div>\n<script src="${API_BASE.replace(
                /\/$/,
                ""
              )}/api/embed/${chatbotConfig?.id || "demo"}.js" async></script>`}
              style={styles.embedTextarea}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// --- Helper to darken color ---
function darkenColor(hex, percent) {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) - amt;
  const G = ((num >> 8) & 0x00ff) - amt;
  const B = (num & 0x0000ff) - amt;
  return `#${(
    0x1000000 +
    (R < 0 ? 0 : R > 255 ? 255 : R) * 0x10000 +
    (G < 0 ? 0 : G > 255 ? 255 : G) * 0x100 +
    (B < 0 ? 0 : B > 255 ? 255 : B)
  )
    .toString(16)
    .slice(1)}`;
}

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    height: "100%",
    width: "100%",
  },
  chatbotPreview: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    background: "rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(16px)",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
    fontFamily: "sans-serif",
    padding: "12px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
    borderRadius: "16px 16px 0 0",
    justifyContent: "center",
  },
  logo: { height: "36px", width: "36px", objectFit: "contain", borderRadius: "6px", boxShadow: "0 2px 10px rgba(0,0,0,0.3)" },
  businessInfo: { color: "white", textAlign: "center", padding: "6px 12px" },
  websiteLink: { textDecoration: "underline", textAlign: "center", display: "block", marginBottom: "6px" },
  address: { color: "white", textAlign: "center", padding: "4px 12px", fontStyle: "italic" },
  filesContainer: { background: "rgba(255,255,255,0.1)", padding: "8px", borderRadius: "12px", margin: "8px 0" },
  fileList: { listStyleType: "disc", paddingLeft: "16px", color: "white" },
  fileLink: { textDecoration: "underline" },
  messages: { flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: "8px", maxHeight: "400px" },
  message: { display: "flex", maxWidth: "80%" },
  userMsg: { alignSelf: "flex-end", justifyContent: "flex-end" },
  assistantMsg: { alignSelf: "flex-start", justifyContent: "flex-start" },
  bubble: { padding: "10px 14px", borderRadius: "18px", backdropFilter: "blur(10px)", wordBreak: "break-word" },
  inputArea: { display: "flex", gap: "8px", padding: "12px", borderTop: "1px solid rgba(255,255,255,0.1)" },
  textarea: { flex: 1, resize: "none", padding: "10px", borderRadius: "12px", border: "none", outline: "none", fontSize: "14px", background: "rgba(255,255,255,0.1)" },
  button: { color: "white", border: "none", padding: "0 18px", borderRadius: "12px", cursor: "pointer", fontWeight: "bold", transition: "0.2s" },
  embedSection: { margin: "12px 0", display: "flex", flexDirection: "column" },
  embedTextarea: { width: "100%", height: "80px", borderRadius: "12px", border: "none", padding: "10px", resize: "none", background: "rgba(255,255,255,0.1)", color: "white", fontFamily: "monospace", fontSize: "12px" },
};
