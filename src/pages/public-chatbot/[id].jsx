// src/pages/public-chatbot/[id].jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function PublicChatbot() {
  const { id } = useParams();
  const [chatbot, setChatbot] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Helper: sanitize backend URL (remove trailing slashes/spaces)
  const backendBase = import.meta.env.VITE_BACKEND_URL
    ? import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, "")
    : "";

  /* ------------------------------
     Fetch chatbot configuration
  ------------------------------ */
  useEffect(() => {
    if (!id) return;

    const fetchChatbot = async () => {
      try {
        const res = await fetch(`${backendBase}/api/chatbot/config/${id}`);
        if (!res.ok) throw new Error("Chatbot not found");
        const data = await res.json();
        setChatbot(data);
      } catch (err) {
        console.error("❌ Chatbot fetch error:", err);
        setError(err.message || "Failed to load chatbot.");
      } finally {
        setLoading(false);
      }
    };

    fetchChatbot();
  }, [id, backendBase]);

  /* ------------------------------
     Send message to public API
  ------------------------------ */
  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await fetch(`${backendBase}/api/chatbot/public/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: input }],
        }),
      });

      const data = await res.json();

      if (data.reply) {
        setMessages([...newMessages, { sender: "bot", text: data.reply }]);
      } else {
        setMessages([
          ...newMessages,
          { sender: "bot", text: "⚠️ No reply from bot." },
        ]);
      }
    } catch (err) {
      console.error("⚠️ Chatbot message error:", err);
      setMessages([
        ...newMessages,
        { sender: "bot", text: "⚠️ Error connecting to bot." },
      ]);
    }
  };

  /* ------------------------------
     Render states
  ------------------------------ */
  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-[#0f0f17] text-white">
        Loading chatbot...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-[#0f0f17] text-red-400">
        {error}
      </div>
    );
  }

  const theme = chatbot?.themeColors?.userBubble || "#7f5af0";

  /* ------------------------------
     UI Rendering
  ------------------------------ */
  return (
    <div className="flex flex-col h-screen bg-[#0f0f17] text-white font-inter">
      {/* Header */}
      <div className="p-3 text-center border-b border-gray-800">
        {chatbot?.logo_url && (
          <img
            src={chatbot.logo_url}
            alt="logo"
            className="h-10 mx-auto mb-2 rounded-lg"
          />
        )}
        <h2 className="text-lg font-semibold">{chatbot?.name || "AI Chatbot"}</h2>
        {chatbot?.business_info && (
          <p className="text-sm text-gray-400">{chatbot.business_info}</p>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[75%] p-2 rounded-2xl ${
              m.sender === "bot"
                ? "bg-[#1f1f2e] self-start"
                : "self-end ml-auto"
            }`}
            style={{
              backgroundColor: m.sender === "user" ? theme : "#1f1f2e",
            }}
          >
            {m.text}
          </div>
        ))}
      </div>

      {/* Input box */}
      <div className="p-3 border-t border-gray-800 flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          rows={1}
          className="flex-1 resize-none bg-[#1a1a24] p-2 rounded-lg outline-none text-white text-sm"
        />
        <button
          onClick={sendMessage}
          style={{ background: theme }}
          className="px-4 py-2 rounded-lg text-white font-medium"
        >
          Send
        </button>
      </div>
    </div>
  );
}
