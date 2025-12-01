import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

export default function PublicChatbot() {
  const { id } = useParams(); // chatbot ID from URL
  const [chatbot, setChatbot] = useState(null);
  const [loading, setLoading] = useState(true);

  // Chat state
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi 👋 How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedReply, setStreamedReply] = useState("");

  const messagesEndRef = useRef(null);

  const [API_BASE, setAPIBase] = useState("");

  useEffect(() => {
    const base = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/$/, "");
    setAPIBase(base);
  }, []);

  // ------------------------------
  // LOAD CHATBOT CONFIG
  // ------------------------------
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

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamedReply]);

  // ------------------------------
  // ✅ ✅ ✅ SEND MESSAGE (FIXED FOR OPTION 1)
  // ------------------------------
  const sendMessage = async () => {
    if (!input.trim() || isStreaming) return;

    const newMessages = [
      ...messages.slice(-6),
      { role: "user", content: input },
    ];

    setMessages(newMessages);
    setInput("");
    setStreamedReply("");
    setIsStreaming(true);

    try {
      const encodedMessages = encodeURIComponent(
        JSON.stringify(newMessages)
      );

      const evtSource = new EventSource(
        `${API_BASE}/api/chatbot/preview-stream/${id}?messages=${encodedMessages}`
      );

      evtSource.addEventListener("token", (e) => {
        const token = JSON.parse(e.data);
        setStreamedReply((prev) => prev + token);
      });

      evtSource.addEventListener("done", () => {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: streamedReply },
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
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Something went wrong." },
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ------------------------------
  // UI STATES
  // ------------------------------
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        Loading Chatbot...
      </div>
    );

  if (!chatbot)
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        Chatbot not found.
      </div>
    );

  const theme = chatbot.themeColors || {
    background: "#0b0b1a",
    userBubble: "#7f5af0",
    botBubble: "#6b21a8",
    text: "#ffffff",
  };

  return (
    <div
      style={{
        background: theme.background,
        color: theme.text,
        height: "100vh",
        padding: "0",
        margin: "0",
        fontFamily: "sans-serif",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "400px",
          height: "520px",
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(10px)",
          borderRadius: "16px",
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.15)",
          boxShadow: "0 0 25px rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
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
          {chatbot.logo_url && (
            <img
              src={chatbot.logo_url}
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "8px",
                objectFit: "cover",
              }}
            />
          )}
          <span style={{ fontWeight: "bold" }}>{chatbot.name}</span>
        </div>

        {/* MESSAGES */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
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
                }}
              >
                {msg.content}
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
                  color: theme.text,
                }}
              >
                {streamedReply || (
                  <div style={{ display: "flex", gap: "5px" }}>
                    <div style={dotStyle}></div>
                    <div style={{ ...dotStyle, animationDelay: "0.2s" }}></div>
                    <div style={{ ...dotStyle, animationDelay: "0.4s" }}></div>
                  </div>
                )}
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
            borderTop: "1px solid rgba(255,255,255,0.1)",
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
              background: "rgba(255,255,255,0.10)",
              border: "none",
              borderRadius: "12px",
              color: theme.text,
              resize: "none",
            }}
          />

          <button
            onClick={sendMessage}
            disabled={isStreaming}
            style={{
              padding: "0 18px",
              background: theme.userBubble,
              border: "none",
              borderRadius: "12px",
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

/* --- Typing Dots --- */
const dotStyle = {
  width: "6px",
  height: "6px",
  borderRadius: "50%",
  background: "#fff",
  animation: "bounce 1s infinite",
};
