import { useState } from "react";
import axios from "axios";

export default function PublicChatWindow({
  chatbotId,
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

  /*
  ========================================
  SEND MESSAGE
  ========================================
  */
  const sendMessage = async () => {

    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setLoading(true);

    try {

      const res =
        await axios.post(
          "http://localhost:5000/api/chatbot/chat",
          {
            chatbot_id:
              chatbotId,

            message: input,
          }
        );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            res.data.reply,
        },
      ]);

    } catch (err) {

      console.error(err);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Something went wrong.",
        },
      ]);
    }

    setInput("");
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-white">

      <div className="p-4 bg-purple-600 text-white font-bold text-lg">
        AI Assistant
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">

        {messages.map(
          (msg, index) => (
            <div
              key={index}
              className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                msg.role === "user"
                  ? "ml-auto bg-purple-600 text-white"
                  : "bg-gray-100 text-black"
              }`}
            >
              {msg.content}
            </div>
          )
        )}

        {loading && (
          <div className="bg-gray-100 p-3 rounded-2xl text-sm w-fit">
            Typing...
          </div>
        )}

      </div>

      <div className="p-3 border-t flex gap-2">

        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) =>
            setInput(
              e.target.value
            )
          }
          onKeyDown={(e) => {
            if (
              e.key === "Enter"
            ) {
              sendMessage();
            }
          }}
          className="flex-1 border rounded-xl px-4 py-2 outline-none"
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-purple-600 text-white px-5 rounded-xl"
        >
          Send
        </button>

      </div>

    </div>
  );
}