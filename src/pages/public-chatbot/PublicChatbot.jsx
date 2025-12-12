import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

/* --------------------------------------------------- */
/* ✅ RENDER TEXT + AUTO-LINK                            */
/* --------------------------------------------------- */
const renderMessageWithLinks = (text) => {
  if (!text) return null;

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (urlRegex.test(part)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#00e5ff",
            textDecoration: "underline",
            fontWeight: "bold",
            overflowWrap: "anywhere",
          }}
        >
          {part}
        </a>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

/* --------------------------------------------------- */
/* ⭐ MAIN PUBLIC CHATBOT (Inside Iframe)               */
/* --------------------------------------------------- */
export default function PublicChatbot() {
  const { id } = useParams();

  const [chatbot, setChatbot] = useState(null);
  const [loading, setLoading] = useState(true);

  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi 👋 How can I help you today?" },
  ]);

  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedReply, setStreamedReply] = useState("");

  const messagesEndRef = useRef(null);
  const scrollRef = useRef(null);
  const evtSourceRef = useRef(null);

  const [API_BASE, setAPIBase] = useState("");

  /* --------------------------------------------------- */
  /* Load backend base URL                                */
  /* --------------------------------------------------- */
  useEffect(() => {
    const base = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/$/, "");
    setAPIBase(base);
  }, []);

  /* --------------------------------------------------- */
  /* Fetch chatbot config                                 */
  /* --------------------------------------------------- */
  useEffect(() => {
    if (!API_BASE) return;
    fetchChatbot();
  }, [API_BASE]);

  const fetchChatbot = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/embed/config/${id}`);
      const data = await res.json();

      if (!data.success) throw new Error("Chatbot not found");

      setChatbot(data.chatbot);
    } catch (err) {
      console.error("Public chatbot load failed:", err);
    } finally {
      setLoading(false);
    }
  };

  /* --------------------------------------------------- */
  /* Auto-scroll (smart)                                  */
  /* --------------------------------------------------- */
  const scrollToBottom = (force = false) => {
    const container = scrollRef.current;
    if (!container) return;

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 80;

    if (force || isNearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => scrollToBottom(), [messages, streamedReply]);

  /* --------------------------------------------------- */
  /* SSE Chat Streaming                                   */
  /* --------------------------------------------------- */
  const sendMessage = async () => {
    if (!input.trim() || isStreaming) return;

    const msg = input.trim();

    const newMessages = [
      ...messages.slice(-8), // Keep last 8 for optimal context
      { role: "user", content: msg },
    ];

    setMessages(newMessages);
    setInput("");
    setStreamedReply("");
    setIsStreaming(true);

    try {
      const encoded = encodeURIComponent(JSON.stringify(newMessages));
      const url = `${API_BASE}/api/chatbot/preview-stream/${id}?messages=${encoded}`;

      evtSourceRef.current?.close(); // cleanup if old one exists

      const evtSource = new EventSource(url);
      evtSourceRef.current = evtSource;

      let fullReply = "";

      evtSource.addEventListener("token", (e) => {
        const token = JSON.parse(e.data);
        fullReply += token;
        setStreamedReply((prev) => prev + token);
      });

      evtSource.addEventListener("done", () => {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: fullReply || "⚠️ No reply generated." },
        ]);
        setStreamedReply("");
        setIsStreaming(false);
        evtSource.close();
      });

      evtSource.onerror = () => {
        evtSource.close();
        setIsStreaming(false);

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "⚠️ Connection lost." },
        ]);
      };
    } catch (err) {
      console.error("Stream error:", err);
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /* --------------------------------------------------- */
  /* RENDERING                                             */
  /* --------------------------------------------------- */
  if (loading) {
    return <div style={{ padding: 20 }}>Loading chatbot…</div>;
  }

  if (!chatbot) {
    return <div style={{ padding: 20 }}>Chatbot not found.</div>;
  }

  const config = chatbot.config || {};

  const theme = config.themeColors || {
    background: "#0b0b17",
    userBubble: "#7f5af0",
    botBubble: "#6b21a8",
    text: "#ffffff",
  };

  const logoUrl = config.logo_url || null;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: theme.background,
        color: theme.text,
        display: "flex",
        flexDirection: "column",
        margin: 0,
        padding: 0,
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: "12px",
          background: theme.userBubble,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          color: "#fff",
        }}
      >
        {logoUrl && (
          <img
            src={logoUrl}
            alt="Company Logo"
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "8px",
            }}
          />
        )}
        <span style={{ fontWeight: "bold" }}>{chatbot.name}</span>
      </div>

      {/* MESSAGES */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "14px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent:
                msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "75%",
                padding: "10px 14px",
                borderRadius: "16px",
                background:
                  msg.role === "user"
                    ? theme.userBubble
                    : theme.botBubble,
                color: theme.text,
                lineHeight: 1.4,
                animation: "fadeIn 0.25s ease",
              }}
            >
              {renderMessageWithLinks(msg.content)}
            </div>
          </div>
        ))}

        {/* STREAMING */}
        {isStreaming && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div
              style={{
                maxWidth: "75%",
                padding: "10px 14px",
                borderRadius: "16px",
                background: theme.botBubble,
                opacity: 0.9,
              }}
            >
              {streamedReply || "Typing..."}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div
        style={{
          display: "flex",
          padding: "10px",
          borderTop: "1px solid rgba(255,255,255,0.15)",
          gap: "8px",
        }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: "10px",
            background: "rgba(255,255,255,0.12)",
            borderRadius: "12px",
            color: theme.text,
            border: "none",
            resize: "none",
          }}
        />

        <button
          onClick={sendMessage}
          disabled={isStreaming}
          style={{
            padding: "0 18px",
            background: theme.userBubble,
            borderRadius: "12px",
            color: "#fff",
            fontWeight: "bold",
            border: "none",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
