import {
  useState,
  useEffect,
  useRef,
} from "react";

import {
  useParams,
} from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL;

export default function PublicChatbot() {

  const { id } =
    useParams();

  /*
  ========================================
  STATES
  ========================================
  */
  const [messages, setMessages] =
    useState([
      {
        role: "bot",
        text:
          "Hi 👋 How can I help you today?",
      },
    ]);

  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [chatbot, setChatbot] =
    useState(null);

  const [theme, setTheme] =
    useState({
      botName:
        "AI Assistant",

      chatBg:
        "#1f1b2e",

      botBubble:
        "#2a2540",

      userBubble:
        "#7f5af0",

      textColor:
        "#ffffff",

      radius:
        "lg",
    });

  /*
  ========================================
  REFS
  ========================================
  */
  const chatEndRef =
    useRef(null);

  /*
  ========================================
  SESSION ID
  ========================================
  */
  const sessionId =
    useRef(
      localStorage.getItem(
        "chat_session"
      ) ||
        crypto.randomUUID()
    );

  /*
  ========================================
  SAVE SESSION
  ========================================
  */
  useEffect(() => {

    localStorage.setItem(
      "chat_session",
      sessionId.current
    );

  }, []);

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
  LOAD CHATBOT
  ========================================
  */
  useEffect(() => {

    fetchChatbot();

  }, [id]);

  const fetchChatbot =
    async () => {

      try {

        const res =
          await fetch(
            `${API_URL}/api/public/chatbot/${id}`
          );

        const data =
          await res.json();

        /*
        ========================================
        SAVE CHATBOT
        ========================================
        */
        setChatbot(data);

        /*
        ========================================
        LOAD THEME
        ========================================
        */
        if (data?.theme) {

          setTheme({
            botName:
              data.name ||
              "AI Assistant",

            chatBg:
              data.theme
                ?.chatBg ||
              "#1f1b2e",

            botBubble:
              data.theme
                ?.botBubble ||
              "#2a2540",

            userBubble:
              data.theme
                ?.userBubble ||
              "#7f5af0",

            textColor:
              data.theme
                ?.textColor ||
              "#ffffff",

            radius:
              data.theme
                ?.radius ||
              "lg",
          });
        }

      } catch (err) {

        console.error(
          "LOAD CHATBOT ERROR:",
          err
        );
      }
    };

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

      const msg =
        input;

      /*
      ========================================
      USER MESSAGE
      ========================================
      */
      setMessages(
        (prev) => [
          ...prev,
          {
            role: "user",
            text: msg,
          },
        ]
      );

      setInput("");
      setLoading(true);

      try {

        const res =
          await fetch(
            `${API_URL}/api/chatbot/chat`,
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  message:
                    msg,

                  chatbot_id:
                    id,

                  session_id:
                    sessionId.current,
                }),
            }
          );

        const data =
          await res.json();

        /*
        ========================================
        BOT MESSAGE
        ========================================
        */
        setMessages(
          (prev) => [
            ...prev,
            {
              role: "bot",
              text:
                data.reply ||
                "No response",
            },
          ]
        );

      } catch (err) {

        console.error(
          "CHAT ERROR:",
          err
        );

        setMessages(
          (prev) => [
            ...prev,
            {
              role: "bot",
              text:
                "Server error",
            },
          ]
        );
      }

      setLoading(false);
    };

  /*
  ========================================
  LOADING
  ========================================
  */
  if (!chatbot) {

    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        Loading chatbot...
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-screen"
      style={{
        background:
          theme.chatBg,

        color:
          theme.textColor,
      }}
    >

      {/* HEADER */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between backdrop-blur-xl">

        <div>
          <h2 className="font-bold text-lg">
            {theme.botName}
          </h2>

          <p className="text-xs opacity-70">
            AI Assistant
          </p>
        </div>

        <div className="w-3 h-3 rounded-full bg-green-400" />

      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

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
                style={{
                  background:
                    msg.role ===
                    "user"
                      ? theme.userBubble
                      : theme.botBubble,

                  color:
                    theme.textColor,

                  borderRadius:
                    theme.radius ===
                    "full"
                      ? "999px"
                      : "18px",
                }}
                className="px-4 py-3 max-w-[80%] text-sm shadow-lg"
              >
                {msg.text}
              </div>

            </div>
          )
        )}

        {loading && (
          <div className="text-sm opacity-70">
            Typing...
          </div>
        )}

        <div ref={chatEndRef} />

      </div>

      {/* INPUT */}
      <div className="p-4 border-t border-white/10 backdrop-blur-xl flex gap-3">

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
          className="flex-1 px-4 py-3 rounded-xl bg-white/10 outline-none border border-white/10"
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          style={{
            background:
              theme.userBubble,
          }}
          className="px-5 rounded-xl font-semibold text-white"
        >
          Send
        </button>

      </div>

    </div>
  );
}