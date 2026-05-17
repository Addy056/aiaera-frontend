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

  const [theme, setTheme] =
    useState({
      botName:
        "Assistant",

      logo: "",
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
            bot.bot_name ||
            "Assistant",

          logo:
            bot.theme?.logo ||
            "",
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

        response =
          integrations.meeting_link
            ? `📅 Book here:\n${integrations.meeting_link}`
            : "Booking link not configured yet.";
      }

      if (
        type === "maps"
      ) {

        response =
          integrations.maps
            ? `📍 Visit us:\n${integrations.maps}`
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
          err);

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
  RENDER MESSAGE
  ========================================
  */
  const renderMessage =
    (text) => {

      return (
        <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">

          {text
            ?.split(
              /(https?:\/\/[^\s]+)/g
            )
            .map(
              (
                part,
                index
              ) => {

                const isLink =
                  part.match(
                    /^https?:\/\/[^\s]+$/
                  );

                if (isLink) {

                  return (
                    <a
                      key={index}
                      href={part}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        text-purple-500
                        underline
                        break-all
                        hover:text-purple-400
                        transition-all
                      "
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
            )}

        </div>
      );
    };

  /*
  ========================================
  LOADING
  ========================================
  */
  if (fetching) {

    return (
      <div className="w-full h-full flex items-center justify-center bg-white text-black">
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
      <div className="w-full h-full flex items-center justify-center bg-white text-black">
        Chatbot not found
      </div>
    );
  }

  return (

    <div
      className="
        w-full
        overflow-hidden
        bg-white
        flex
        flex-col
      "
      style={{
        height: "100dvh",
        maxHeight: "100dvh",
      }}
    >

      {/* HEADER */}
      <div className="h-[74px] px-5 border-b border-gray-200 bg-white flex items-center justify-between shrink-0">

        <div className="flex items-center gap-3 min-w-0">

          {theme.logo ? (
            <img
              src={theme.logo}
              alt="logo"
              className="w-11 h-11 rounded-2xl object-cover"
            />
          ) : (
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center font-bold bg-black text-white">
              AI
            </div>
          )}

          <div className="min-w-0">

            <h2 className="text-[15px] font-semibold truncate text-black">
              {theme.botName}
            </h2>

            <p className="text-green-500 text-xs">
              ● Online
            </p>

          </div>

        </div>

      </div>

      {/* CHAT AREA */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 bg-[#f5f5f5]">

        <div className="flex flex-col gap-3 min-h-full">

          {/* QUICK ACTIONS */}
          <div className="flex flex-wrap gap-2 mb-2">

            <button
              onClick={() =>
                handleQuickAction(
                  "booking",
                  "Book Appointment"
                )
              }
              className="px-4 py-2 rounded-full text-sm bg-white text-black font-medium border border-gray-200"
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
              className="px-4 py-2 rounded-full text-sm bg-white text-black font-medium border border-gray-200"
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
                  className="max-w-[82%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap break-words"
                  style={{
                    background:
                      msg.role === "user"
                        ? "#000000"
                        : "#FFFFFF",

                    color:
                      msg.role === "user"
                        ? "#FFFFFF"
                        : "#111111",

                    border:
                      msg.role === "bot"
                        ? "1px solid #e5e7eb"
                        : "none",
                  }}
                >
                  {renderMessage(
                    msg.text
                  )}
                </div>

              </div>
            )
          )}

          {loading && (
            <div className="text-xs text-gray-500 px-2">
              {theme.botName} is typing...
            </div>
          )}

          <div ref={chatEndRef} />

        </div>

      </div>

      {/* INPUT */}
      <div className="p-4 border-t border-gray-200 bg-white shrink-0">

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
            className="flex-1 h-12 px-4 rounded-2xl bg-white border border-gray-300 outline-none text-sm text-black placeholder:text-gray-400"
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            className="h-12 px-6 rounded-2xl bg-black text-white font-semibold text-sm transition-all hover:scale-105 disabled:opacity-50"
          >
            Send
          </button>

        </div>

      </div>

    </div>
  );
}