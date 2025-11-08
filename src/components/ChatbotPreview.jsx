import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { supabase } from "../supabaseClient";

export default function ChatbotPreview({ chatbotConfig, user, isPublic }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: `Hi 👋 I'm your AI assistant. How can I help you today?` },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCalendly, setShowCalendly] = useState(false);
  const messagesEndRef = useRef(null);

  // Persistent chat session
  const [sessionId] = useState(() => {
    const existing = localStorage.getItem("chat_session_id");
    if (existing) return existing;
    const newId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem("chat_session_id", newId);
    return newId;
  });

  const themeColors = chatbotConfig?.themeColors || {
    background: "#1a1a2e",
    userBubble: "#7f5af0",
    botBubble: "#6b21a8",
    text: "#ffffff",
  };

  const API_BASE = (import.meta.env.VITE_BACKEND_URL || "http://localhost:5000").replace(/\/$/, "");

  // ✅ Extract integrations
  const calendlyLink = chatbotConfig?.calendlyLink || "";
  const whatsappNumber = chatbotConfig?.whatsapp_number || "";
  const fbPageId = chatbotConfig?.fb_page_id || "";
  const instagramPageId = chatbotConfig?.instagram_page_id || "";

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const msgText = input.trim().toLowerCase();
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    // 🧠 Integration keyword detection
    const intentMap = [
      {
        keywords: ["book", "meeting", "schedule", "appointment", "demo", "call"],
        type: "calendly",
        condition: !!calendlyLink,
        buttonLabel: "📅 Book a Meeting",
        action: () => setShowCalendly(true),
      },
      {
        keywords: ["whatsapp", "chat", "message on whatsapp"],
        type: "whatsapp",
        condition: !!whatsappNumber,
        buttonLabel: "💬 Chat on WhatsApp",
        action: () =>
          window.open(`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`, "_blank"),
      },
      {
        keywords: ["facebook", "messenger", "fb"],
        type: "facebook",
        condition: !!fbPageId,
        buttonLabel: "📘 Message on Facebook",
        action: () =>
          window.open(`https://facebook.com/${fbPageId}`, "_blank"),
      },
      {
        keywords: ["instagram", "insta", "dm"],
        type: "instagram",
        condition: !!instagramPageId,
        buttonLabel: "📸 View Instagram Page",
        action: () =>
          window.open(`https://instagram.com/${instagramPageId}`, "_blank"),
      },
    ];

    const match = intentMap.find((intent) =>
      intent.keywords.some((k) => msgText.includes(k))
    );

    if (match && match.condition) {
      const intentMsg = {
        role: "assistant",
        content: `Sure! You can ${match.type === "calendly" ? "book a meeting" : "connect"} below 👇`,
      };
      setMessages([...newMessages, intentMsg, { role: "assistant", content: `[intent_button_${match.type}]` }]);
      setLoading(false);
      return;
    }

    // 🔗 Otherwise — normal AI reply
    try {
      let headers = { "Content-Type": "application/json" };
      if (!isPublic && user) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) headers.Authorization = `Bearer ${session.access_token}`;
      }

      const res = await axios.post(
        `${API_BASE}/api/chatbot-preview`,
        { messages: newMessages, chatbotConfig, userId: user?.id || null, sessionId },
        { headers }
      );

      const reply = res.data?.reply || "🤖 (No reply received)";
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (error) {
      console.error("❌ Chatbot preview error:", error);
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "⚠️ Unknown error.";
      setMessages([...newMessages, { role: "assistant", content: msg }]);
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

  // Convert links into clickable text
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

  // Renders integration button dynamically
  const renderIntegrationButton = (type) => {
    const baseStyle = {
      border: "none",
      color: "white",
      fontWeight: "600",
      padding: "8px 14px",
      borderRadius: "10px",
      cursor: "pointer",
      boxShadow: "0 2px 12px rgba(127,90,240,0.4)",
      background: `linear-gradient(135deg, ${themeColors.userBubble}, ${darkenColor(
        themeColors.userBubble,
        25
      )})`,
    };

    const buttons = {
      calendly: (
        <button key="calendly" style={baseStyle} onClick={() => setShowCalendly(true)}>
          📅 Book a Meeting
        </button>
      ),
      whatsapp: (
        <button
          key="whatsapp"
          style={baseStyle}
          onClick={() => window.open(`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`, "_blank")}
        >
          💬 Chat on WhatsApp
        </button>
      ),
      facebook: (
        <button
          key="facebook"
          style={baseStyle}
          onClick={() => window.open(`https://facebook.com/${fbPageId}`, "_blank")}
        >
          📘 Message on Facebook
        </button>
      ),
      instagram: (
        <button
          key="instagram"
          style={baseStyle}
          onClick={() => window.open(`https://instagram.com/${instagramPageId}`, "_blank")}
        >
          📸 View Instagram Page
        </button>
      ),
    };
    return buttons[type];
  };

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

        {/* Messages */}
        <div style={styles.messages}>
          {messages.map((msg, i) => {
            const match = msg.content.match(/\[intent_button_(\w+)\]/);
            if (match) {
              const type = match[1];
              return (
                <div key={i} style={{ ...styles.message, ...styles.assistantMsg }}>
                  <div style={{ ...styles.bubble, backgroundColor: themeColors.botBubble }}>
                    {renderIntegrationButton(type)}
                  </div>
                </div>
              );
            }

            return (
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
            );
          })}
          {loading && (
            <div style={{ ...styles.message, ...styles.assistantMsg }}>
              <div style={{ ...styles.bubble, backgroundColor: themeColors.botBubble }}>...</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
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
      </div>

      {/* Calendly Popup */}
      {showCalendly && (
        <div style={styles.modalOverlay} onClick={() => setShowCalendly(false)}>
          <div style={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
            <iframe
              src={calendlyLink}
              width="100%"
              height="100%"
              frameBorder="0"
              title="Calendly"
              style={{ borderRadius: "12px" }}
            ></iframe>
            <button onClick={() => setShowCalendly(false)} style={styles.closeButton}>
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper: darken color
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

// Styles
const styles = {
  wrapper: { display: "flex", flexDirection: "column", height: "100%" },
  chatbotPreview: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(16px)",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.15)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
    padding: "12px",
    fontFamily: "sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    padding: "12px",
    borderRadius: "16px 16px 0 0",
    fontWeight: "bold",
  },
  logo: {
    height: "36px",
    width: "36px",
    objectFit: "contain",
    borderRadius: "6px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  message: { display: "flex", maxWidth: "80%" },
  userMsg: { alignSelf: "flex-end" },
  assistantMsg: { alignSelf: "flex-start" },
  bubble: {
    padding: "10px 14px",
    borderRadius: "18px",
    wordBreak: "break-word",
    backdropFilter: "blur(10px)",
  },
  inputArea: {
    display: "flex",
    gap: "8px",
    padding: "12px",
    borderTop: "1px solid rgba(255,255,255,0.1)",
  },
  textarea: {
    flex: 1,
    resize: "none",
    padding: "10px",
    borderRadius: "12px",
    border: "none",
    outline: "none",
    fontSize: "14px",
    background: "rgba(255,255,255,0.1)",
  },
  button: {
    color: "white",
    border: "none",
    padding: "0 18px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "0.2s",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(4px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  modalContainer: {
    position: "relative",
    width: "90%",
    maxWidth: "600px",
    height: "80vh",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 0 40px rgba(127,90,240,0.3)",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "12px",
    background: "rgba(255,255,255,0.15)",
    border: "none",
    borderRadius: "50%",
    color: "#fff",
    fontSize: "16px",
    width: "32px",
    height: "32px",
    cursor: "pointer",
  },
};
