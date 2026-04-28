import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function PublicChatbot() {
  const { id } = useParams();

  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! How can I help you?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [theme, setTheme] = useState({
    botName: "AI Assistant",
    chatBg: "#1f1b2e",
    botBubble: "#2a2540",
    userBubble: "#7f5af0",
    textColor: "#ffffff",
    radius: "lg"
  });

  const chatEndRef = useRef(null);

  // 🔥 SESSION ID (IMPORTANT)
  const sessionId = useRef(
    localStorage.getItem("chat_session") ||
    crypto.randomUUID()
  );

  useEffect(() => {
    localStorage.setItem("chat_session", sessionId.current);
  }, []);

  // 🔥 AUTO SCROLL
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔥 LOAD BOT CONFIG + THEME
  useEffect(() => {
    const fetchBot = async () => {
      try {
        const res = await fetch(`${API_URL}/api/embed/chatbot/${id}`);
        const data = await res.json();

        if (data?.theme) {
          setTheme(data.theme);
        }

      } catch {
        console.log("Failed to load chatbot");
      }
    };

    fetchBot();
  }, [id]);

  // 🔥 SEND MESSAGE
  const sendMessage = async () => {
    if (!input || loading) return;

    const msg = input;

    setMessages(prev => [...prev, { role: "user", text: msg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/chatbot/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: msg,
          chatbot_id: id, // ✅ FIXED
          session_id: sessionId.current // ✅ IMPORTANT
        })
      });

      const data = await res.json();

      setMessages(prev => [
        ...prev,
        { role: "bot", text: data.reply }
      ]);

    } catch {
      setMessages(prev => [
        ...prev,
        { role: "bot", text: "Server error" }
      ]);
    }

    setLoading(false);
  };

  return (
    <div
      className="flex flex-col h-screen"
      style={{ background: theme.chatBg, color: theme.textColor }}
    >

      {/* HEADER */}
      <div className="p-4 border-b border-white/10">
        <h3>{theme.botName}</h3>
      </div>

      {/* CHAT */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : ""}`}
          >
            <div
              style={{
                background:
                  msg.role === "user"
                    ? theme.userBubble
                    : theme.botBubble,
                color: theme.textColor,
                borderRadius:
                  theme.radius === "full" ? "999px" : "12px"
              }}
              className="px-4 py-2 max-w-xs"
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && <div className="text-sm opacity-70">Typing...</div>}

        <div ref={chatEndRef} />
      </div>

      {/* INPUT */}
      <div className="p-4 flex gap-2 border-t border-white/10">
        <input
          className="flex-1 p-2 rounded-lg bg-white/10"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          style={{ background: theme.userBubble }}
          className="px-4 rounded-lg"
        >
          Send
        </button>
      </div>

    </div>
  );
}