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
  DETECT EMBED MODE
  ========================================
  */
  const isEmbedded =
    window.self !==
    window.top;

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

  const [integrations, setIntegrations] =
    useState({
      calendly: "",
      maps: "",
    });

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
        `chat_session_${id}`
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
      `chat_session_${id}`,
      sessionId.current
    );

  }, [id]);

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
    fetchIntegrations();

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

        setTheme({
          botName:
            bot.theme?.botName ||
            bot.bot_name ||
            "AI Assistant",

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
  FETCH PUBLIC INTEGRATIONS
  ========================================
  */
  const fetchIntegrations =
    async () => {

      try {

        const response =
          await fetch(
            `${API_URL}/api/integrations/public/${id}`
          );

        const data =
          await response.json();

        if (
          data.success
        ) {

          setIntegrations({
            calendly:
              data.integrations
                ?.calendly || "",

            maps:
              data.integrations
                ?.maps || "",
          });
        }

      } catch (err) {

        console.error(
          "INTEGRATIONS ERROR:",
          err
        );
      }
    };

  /*
  ========================================
  QUICK BUTTON ACTION
  ========================================
  */
  const handleQuickAction =
    (
      type,
      label
    ) => {

      let response =
        "";

      if (
        type ===
        "calendly"
      ) {

        response =
          integrations.calendly
            ? `📅 Book your appointment here:\n${integrations.calendly}`
            : "Booking link not configured yet.";
      }

      if (
        type ===
        "maps"
      ) {

        response =
          integrations.maps
            ? `📍 Visit our office:\n${integrations.maps}`
            : "Office location not configured yet.";
      }

      setMessages(
        (prev) => [
          ...prev,

          {
            role: "user",
            text: label,
          },

          {
            role: "bot",
            text: response,
          },
        ]
      );
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
      <div className="w-full h-full flex items-center justify-center bg-[#0B1120] text-white">
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
      <div className="w-full h-full flex items-center justify-center bg-[#0B1120] text-white">
        Chatbot not found
      </div>
    );
  }

  return (
    <div
      className={`
        w-full
        h-full
        flex
        flex-col
        overflow-hidden
        ${
          isEmbedded
            ? ""
            : "max-w-[400px] h-[700px] mx-auto mt-6 rounded-[28px] shadow-2xl border border-white/10"
        }
      `}
      style={{
        background:
          `linear-gradient(to bottom, ${theme.chatBg}, #0B1120)`,

        color:
          theme.textColor,
      }}
    >

      {/* HEADER */}
      <div className="h-[72px] min-h-[72px] px-4 border-b border-white/10 flex items-center justify-between bg-[#151226]">

        <div className="flex items-center gap-3 min-w-0">

          {theme.logo ? (
            <img
              src={theme.logo}
              alt="logo"
              className="w-11 h-11 rounded-2xl object-cover border border-white/10 bg-[#1c1830] shrink-0"
            />
          ) : (
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold shrink-0">
              AI
            </div>
          )}

          <div className="min-w-0">

            <h2 className="text-[15px] font-semibold truncate">
              {theme.botName}
            </h2>

            <p className="text-green-400 text-xs mt-1">
              ● Online
            </p>

          </div>

        </div>

        <div className="w-3 h-3 rounded-full bg-green-400 shadow-[0_0_12px_rgba(74,222,128,0.8)]"></div>

      </div>

      {/* QUICK ACTIONS */}
      <div className="px-3 py-3 border-b border-white/10 bg-[#120f20] flex flex-wrap gap-2 shrink-0">

        <button
          onClick={() =>
            handleQuickAction(
              "calendly",
              "Book Appointment"
            )
          }
          className="px-4 h-10 rounded-full bg-[#7f5af0]/15 border border-purple-500/20 text-xs text-purple-300 hover:bg-[#7f5af0]/25 transition-all"
        >
          📅 Book Appointment
        </button>

        <button
          onClick={() =>
            handleQuickAction(
              "maps",
              "Visit Office"
            )
          }
          className="px-4 h-10 rounded-full bg-[#7f5af0]/15 border border-purple-500/20 text-xs text-purple-300 hover:bg-[#7f5af0]/25 transition-all"
        >
          📍 Visit Office
        </button>

      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto px-3 py-4 min-h-0">

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