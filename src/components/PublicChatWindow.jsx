import {
  useState,
  useRef,
  useEffect,
} from "react";

import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL;

export default function PublicChatWindow({
  chatbotId,
  chatbotName = "AI Assistant",
  logo = "",
}) {

  const [messages, setMessages] =
    useState([
      {
        role: "assistant",
        content:
          "Hi 👋 How can I help you today?",
      },
    ]);

  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const chatEndRef =
    useRef(null);

  /*
  ========================================
  AUTO SCROLL
  ========================================
  */
  useEffect(() => {

    chatEndRef.current
      ?.scrollIntoView({
        behavior: "smooth",
      });

  }, [messages]);

  /*
  ========================================
  SEND MESSAGE
  ========================================
  */
  const sendMessage =
    async () => {

      if (
        !input.trim() ||
        loading
      ) {
        return;
      }

      const userMessage = {
        role: "user",
        content: input,
      };

      setMessages(
        (prev) => [
          ...prev,
          userMessage,
        ]
      );

      setLoading(true);

      try {

        const res =
          await axios.post(
            `${API_URL}/api/chatbot/chat`,
            {
              chatbot_id:
                chatbotId,

              message:
                input,
            }
          );

        setMessages(
          (prev) => [
            ...prev,
            {
              role:
                "assistant",

              content:
                res.data.reply ||
                "No response available.",
            },
          ]
        );

      } catch (err) {

        console.error(err);

        setMessages(
          (prev) => [
            ...prev,
            {
              role:
                "assistant",

              content:
                "⚠️ Something went wrong.",
            },
          ]
        );

      } finally {

        setInput("");
        setLoading(false);
      }
    };

  return (
    <div className="flex flex-col h-full bg-[#0B1120] overflow-hidden">

      {/* HEADER */}
      <div className="h-[64px] px-4 border-b border-white/10 bg-[#151226] flex items-center gap-3 shrink-0">

        {logo ? (
          <img
            src={logo}
            alt="logo"
            className="w-10 h-10 rounded-xl object-cover border border-white/10"
          />
        ) : (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold">
            AI
          </div>
        )}

        <div>

          <h2 className="text-white font-semibold text-sm">
            {chatbotName}
          </h2>

          <p className="text-green-400 text-xs">
            ● Online
          </p>

        </div>

      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3">

        {messages.map(
          (
            msg,
            index
          ) => (

            <div
              key={index}
              className={`flex ${
                msg.role ===
                "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >

              <div
                className={`max-w-[82%] px-4 py-3 rounded-2xl text-sm leading-relaxed break-words shadow-lg ${
                  msg.role ===
                  "user"
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                    : "bg-white/10 text-white border border-white/5"
                }`}
              >
                {msg.content}
              </div>

            </div>
          )
        )}

        {loading && (
          <div className="text-xs text-gray-400 px-2 animate-pulse">
            AI is typing...
          </div>
        )}

        <div ref={chatEndRef} />

      </div>

      {/* INPUT */}
      <div className="p-3 border-t border-white/10 bg-[#151226] shrink-0">

        <div className="flex gap-2">

          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) =>
              setInput(
                e.target.value
              )
            }
            onKeyDown={(e) => {

              if (
                e.key ===
                "Enter"
              ) {

                sendMessage();
              }
            }}
            className="flex-1 h-11 px-4 rounded-xl bg-white/10 border border-white/10 outline-none text-white text-sm placeholder:text-gray-400"
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            className="px-5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium text-sm hover:opacity-90 transition-all"
          >
            Send
          </button>

        </div>

      </div>

    </div>
  );
}