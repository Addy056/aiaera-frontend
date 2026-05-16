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
  EMBED MODE
  ========================================
  */
  const isEmbedded =
    window.self !==
    window.top;

  /*
  ========================================
  OPEN / CLOSE STATE
  ========================================
  */
  const [isOpen, setIsOpen] =
    useState(!isEmbedded);

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
          "Hi 👋 I'm your AI assistant. How can I help you today?",
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

  /*
  ========================================
  GENERIC INTEGRATIONS
  ========================================
  */
  const [integrations, setIntegrations] =
    useState({
      provider: "calendly",
      meeting_link: "",
      maps: "",
    });

  const [leadCollected, setLeadCollected] =
    useState(false);

  const [leadAsked, setLeadAsked] =
    useState(false);

  /*
  ========================================
  DEFAULT BLACK & WHITE THEME
  ========================================
  */
  const [theme, setTheme] =
    useState({
      botName:
        "Assistant",

      logo: "",

      chatBg:
        "#0B0B0F",

      botBubble:
        "rgba(255,255,255,0.08)",

      userBubble:
        "#FFFFFF",

      textColor:
        "#FFFFFF",
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
  LOAD DATA
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
            "Assistant",

          logo:
            bot.theme?.logo ||
            "",

          chatBg:
            bot.theme?.chatBg ||
            "#0B0B0F",

          botBubble:
            bot.theme?.botBubble ||
            "rgba(255,255,255,0.08)",

          userBubble:
            bot.theme?.userBubble ||
            "#FFFFFF",

          textColor:
            bot.theme?.textColor ||
            "#FFFFFF",
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
  FETCH INTEGRATIONS
  ========================================
  */
  const fetchIntegrations =
    async () => {

      try {

        const response =
          await fetch(
            `${API_URL}/api/integrations/public/${id}`
          );

        if (!response.ok) {
          return;
        }

        const data =
          await response.json();

        if (data.success) {

          setIntegrations({
            provider:
              data.integrations
                ?.provider ||
              "calendly",

            meeting_link:
              data.integrations
                ?.meeting_link || "",

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
  LINK RENDER
  ========================================
  */
  const renderMessageWithLinks =
    (text) => {

      if (!text) return null;

      const urlRegex =
        /(https?:\/\/[^\s]+)/g;

      const parts =
        text.split(urlRegex);

      return parts.map(
        (
          part,
          index
        ) => {

          if (
            part.match(urlRegex)
          ) {

            return (
              <a
                key={index}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  underline
                  break-all
                "
                style={{
                  color:
                    theme.userBubble === "#FFFFFF"
                      ? "#FFFFFF"
                      : theme.userBubble,
                }}
              >
                {part}
              </a>
            );
          }

          return (
            <span key={index}>
              {part}
            </span>
          );
        }
      );
    };

  /*
  ========================================
  QUICK ACTIONS
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
        type === "booking"
      ) {

        const providerName =
          integrations.provider === "zoom"
            ? "Zoom"
            : integrations.provider === "teams"
            ? "Microsoft Teams"
            : integrations.provider === "meet"
            ? "Google Meet"
            : integrations.provider === "custom"
            ? "Meeting"
            : "Calendly";

        response =
          integrations.meeting_link &&
          integrations.meeting_link.trim() !== ""
            ? `📅 Book your appointment using ${providerName}:\n${integrations.meeting_link}`
            : "Booking link not configured yet.";
      }

      if (
        type === "maps"
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
  EMAIL + PHONE DETECTION
  ========================================
  */
  const containsLeadInfo =
    (text) => {

      const emailRegex =
        /\S+@\S+\.\S+/;

      const phoneRegex =
        /(\+?\d[\d\s-]{7,})/;

      return (
        emailRegex.test(text) ||
        phoneRegex.test(text)
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

      if (
        containsLeadInfo(msg)
      ) {

        setLeadCollected(true);
      }

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
              method: "POST",

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

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {

          setMessages(
            (prev) => [
              ...prev,
              {
                role: "bot",
                text:
                  data?.reply ||
                  "⚠️ Server error",
              },
            ]
          );

          return;
        }

        let botReply =
          data.reply ||
          "No response available.";

        const userMessageCount =
          messages.filter(
            (m) =>
              m.role === "user"
          ).length + 1;

        const interestKeywords = [
          "price",
          "pricing",
          "cost",
          "service",
          "demo",
          "appointment",
          "consultation",
          "help",
          "business",
          "buy",
          "call",
          "zoom",
          "meeting",
          "schedule",
        ];

        const interested =
          interestKeywords.some(
            (word) =>
              msg
                .toLowerCase()
                .includes(word)
          );

        if (
          !leadCollected &&
          !leadAsked &&
          (
            userMessageCount >= 3 ||
            interested
          )
        ) {

          botReply += `

Could you also share your email and phone number so our team can assist you better?`;

          setLeadAsked(true);
        }

        setMessages(
          (prev) => [
            ...prev,
            {
              role: "bot",
              text:
                botReply,
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
                "⚠️ Service temporarily unavailable.",
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
      <div className="w-screen h-screen flex items-center justify-center bg-black text-white">
        Loading...
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
      <div className="w-screen h-screen flex items-center justify-center bg-black text-white">
        Chatbot not found
      </div>
    );
  }

  return (
    <div
      className={`
        fixed
        bottom-6
        right-6
        z-[999999]
        flex
        flex-col
        items-end
      `}
    >

      {/* FLOATING BUTTON */}
      {!isOpen && (
        <button
          onClick={() =>
            setIsOpen(true)
          }
          className="
            w-16
            h-16
            rounded-full
            shadow-2xl
            border
            border-white/10
            flex
            items-center
            justify-center
            text-black
            text-xl
            font-bold
            transition-all
            duration-300
            hover:scale-110
          "
          style={{
            background:
              theme.userBubble,
          }}
        >
          🤖
        </button>
      )}

      {/* CHAT WINDOW */}
      {isOpen && (
        <div
          className={`
            w-[370px]
            max-w-[calc(100vw-24px)]
            h-[620px]
            max-h-[calc(100vh-24px)]
            rounded-[28px]
            overflow-hidden
            border
            border-white/10
            shadow-2xl
            backdrop-blur-2xl
            flex
            flex-col
            animate-in
            fade-in
            zoom-in-95
            duration-300
          `}
          style={{
            background:
              theme.chatBg,

            color:
              theme.textColor,
          }}
        >

          {/* HEADER */}
          <div
            className="
              h-[74px]
              px-5
              border-b
              border-white/10
              flex
              items-center
              justify-between
              shrink-0
            "
            style={{
              background:
                theme.chatBg,
            }}
          >

            <div className="flex items-center gap-3 min-w-0">

              {theme.logo ? (
                <img
                  src={theme.logo}
                  alt="logo"
                  className="w-11 h-11 rounded-2xl object-cover"
                />
              ) : (
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center font-bold"
                  style={{
                    background:
                      theme.userBubble,

                    color:
                      "#000000",
                  }}
                >
                  AI
                </div>
              )}

              <div className="min-w-0">

                <h2 className="text-[15px] font-semibold truncate">
                  {theme.botName}
                </h2>

                <p className="text-green-400 text-xs">
                  ● Online
                </p>

              </div>

            </div>

            <button
              onClick={() =>
                setIsOpen(false)
              }
              className="
                w-9
                h-9
                rounded-xl
                transition-all
                text-lg
              "
              style={{
                background:
                  theme.botBubble,

                color:
                  theme.textColor,
              }}
            >
              ✕
            </button>

          </div>

          {/* CHAT AREA */}
          <div
            className="
              flex-1
              overflow-y-auto
              px-4
              py-4
            "
            style={{
              background:
                theme.chatBg,
            }}
          >

            <div className="flex flex-col gap-3">

              {/* QUICK ACTIONS */}
              <div className="flex flex-wrap gap-2 mb-2">

                <button
                  onClick={() =>
                    handleQuickAction(
                      "booking",
                      "Book Appointment"
                    )
                  }
                  className="
                    px-4
                    py-2
                    rounded-full
                    text-xs
                    border
                    transition-all
                  "
                  style={{
                    background:
                      theme.botBubble,

                    borderColor:
                      "rgba(255,255,255,0.08)",

                    color:
                      theme.textColor,
                  }}
                >
                  📅 Book Demo
                </button>

                <button
                  onClick={() =>
                    handleQuickAction(
                      "maps",
                      "Visit Office"
                    )
                  }
                  className="
                    px-4
                    py-2
                    rounded-full
                    text-xs
                    border
                    transition-all
                  "
                  style={{
                    background:
                      theme.botBubble,

                    borderColor:
                      "rgba(255,255,255,0.08)",

                    color:
                      theme.textColor,
                  }}
                >
                  📍 Visit Office
                </button>

              </div>

              {messages.map(
                (
                  msg,
                  index
                ) => (

                  <div
                    key={index}
                    className={`flex ${
                      msg.role === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >

                    <div
                      style={{
                        background:
                          msg.role === "user"
                            ? theme.userBubble
                            : theme.botBubble,

                        color:
                          msg.role === "user"
                            ? "#000000"
                            : theme.textColor,
                      }}
                      className="
                        max-w-[82%]
                        px-4
                        py-3
                        rounded-2xl
                        text-sm
                        whitespace-pre-wrap
                        break-words
                        shadow-lg
                      "
                    >

                      <p className="whitespace-pre-wrap break-words">
                        {renderMessageWithLinks(
                          msg.text
                        )}
                      </p>

                    </div>

                  </div>
                )
              )}

              {loading && (
                <div className="text-xs text-gray-400 px-2">
                  {theme.botName} is typing...
                </div>
              )}

              <div ref={chatEndRef} />

            </div>

          </div>

          {/* INPUT */}
          <div
            className="
              p-4
              border-t
              border-white/10
              shrink-0
            "
            style={{
              background:
                theme.chatBg,
            }}
          >

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
                    e.key === "Enter"
                  ) {

                    sendMessage();
                  }
                }}
                className="
                  flex-1
                  h-12
                  px-4
                  rounded-2xl
                  border
                  border-white/10
                  outline-none
                  text-sm
                  placeholder:text-gray-400
                "
                style={{
                  background:
                    theme.botBubble,

                  color:
                    theme.textColor,
                }}
              />

              <button
                onClick={sendMessage}
                disabled={loading}
                className="
                  h-12
                  px-5
                  rounded-2xl
                  font-medium
                  text-sm
                  transition-all
                  hover:scale-105
                  disabled:opacity-50
                "
                style={{
                  background:
                    theme.userBubble,

                  color:
                    "#000000",
                }}
              >
                Send
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}