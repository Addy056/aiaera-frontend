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

  const [fetching, setFetching] =
    useState(true);

  const [theme, setTheme] =
    useState({
      botName:
        "AI Assistant",

      logo: "",

      chatBg:
        "#161126",

      botBubble:
        "rgba(255,255,255,0.06)",

      userBubble:
        "#7f5af0",

      textColor:
        "#ffffff",
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
  SESSION
  ========================================
  */
  const sessionId =
    useRef(
      sessionStorage.getItem(
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

    sessionStorage.setItem(
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

    if (!id) return;

    fetchChatbot();

  }, [id]);

  /*
  ========================================
  FETCH CHATBOT
  ========================================
  */
  const fetchChatbot =
    async () => {

      try {

        setFetching(true);

        const response =
          await fetch(
            `${API_URL}/api/embed/chatbot/${id}`
          );

        if (!response.ok) {

          throw new Error(
            "Failed to fetch chatbot"
          );
        }

        const data =
          await response.json();

        console.log(
          "PUBLIC CHATBOT:",
          data
        );

        if (
          !data.success ||
          !data.chatbot
        ) {

          throw new Error(
            "Chatbot not found"
          );
        }

        const bot =
          data.chatbot;

        setChatbot(bot);

        /*
        ========================================
        APPLY THEME
        ========================================
        */
        setTheme({
          /*
          ========================================
          FIX BOT NAME
          ========================================
          */
          botName:
            bot.theme?.botName ||
            bot.bot_name ||
            "AI Assistant",

          /*
          ========================================
          FIX LOGO
          ========================================
          */
          logo:
            bot.theme?.logo ||
            "",

          chatBg:
            bot.theme?.chatBg ||
            "#161126",

          botBubble:
            bot.theme?.botBubble ||
            "rgba(255,255,255,0.06)",

          userBubble:
            bot.theme?.userBubble ||
            "#7f5af0",

          textColor:
            bot.theme?.textColor ||
            "#ffffff",
        });

      } catch (err) {

        console.error(
          "CHATBOT LOAD ERROR:",
          err
        );

      } finally {

        setFetching(false);
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
        input.trim();

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

        const response =
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
                  chatbot_id:
                    id,

                  session_id:
                    sessionId.current,

                  message:
                    msg,
                }),
            }
          );

        if (!response.ok) {

          throw new Error(
            "Failed to send message"
          );
        }

        const data =
          await response.json();

        setMessages(
          (prev) => [
            ...prev,
            {
              role: "bot",
              text:
                data.reply ||
                "No response available.",
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
                "⚠️ AI assistant is temporarily unavailable.",
            },
          ]
        );

      } finally {

        setLoading(false);
      }
    };

  /*
  ========================================
  LOADING
  ========================================
  */
  if (fetching) {

    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[#0B1120] text-white">
        <div className="flex flex-col items-center gap-3">

          <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>

          <p className="text-sm text-gray-400">
            Loading AI Assistant...
          </p>

        </div>
      </div>
    );
  }

  /*
  ========================================
  NOT FOUND
  ========================================
  */
  if (!chatbot) {

    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[#0B1120] text-white">
        Chatbot not found
      </div>
    );
  }

  return (
    <div
      className="absolute inset-0 flex flex-col overflow-hidden"
      style={{
        background:
          `linear-gradient(to bottom, ${theme.chatBg}, #0B1120)`,

        color:
          theme.textColor,
      }}
    >

      {/* HEADER */}
      <div className="h-[68px] px-4 border-b border-white/10 flex items-center justify-between bg-[#151226] shrink-0">

        <div className="flex items-center gap-3 min-w-0">

          {theme.logo ? (
            <img
              src={theme.logo}
              alt="logo"
              onError={(e) => {

                e.currentTarget.style.display =
                  "none";
              }}
              className="w-10 h-10 rounded-xl object-cover border border-white/10 bg-[#1c1830] shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold shrink-0">
              AI
            </div>
          )}

          <div className="min-w-0">

            <h2 className="text-sm font-semibold truncate">
              {theme.botName}
            </h2>

            <p className="text-green-400 text-xs mt-1">
              ● Online
            </p>

          </div>

        </div>

        <div className="w-3 h-3 rounded-full bg-green-400 shrink-0"></div>

      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto px-3 py-4">

        <div className="flex flex-col gap-3">

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
                        ? `linear-gradient(135deg, ${theme.userBubble}, #5b8cff)`
                        : theme.botBubble,
                  }}
                  className="max-w-[82%] px-4 py-3 rounded-2xl text-sm leading-relaxed text-white border border-white/5 backdrop-blur-xl shadow-lg whitespace-pre-wrap break-words"
                >
                  {msg.text}
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

      </div>

      {/* INPUT */}
      <div className="p-3 border-t border-white/10 bg-[#151226] shrink-0">

        <div className="flex items-center gap-2">

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
            className="flex-1 h-11 px-4 rounded-xl bg-white/10 border border-white/10 outline-none text-sm text-white placeholder:text-gray-400"
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            className="h-11 px-5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium text-sm hover:opacity-90 transition-all disabled:opacity-60"
          >
            Send
          </button>

        </div>

      </div>

    </div>
  );
}