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

  const [theme, setTheme] =
    useState({
      botName:
        "Assistant",

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
                  text-blue-400
                  underline
                  break-all
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

      /*
      ========================================
      BOOKING
      ========================================
      */
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

      /*
      ========================================
      MAPS
      ========================================
      */
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

      /*
      ========================================
      DETECT LEAD INFO
      ========================================
      */
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

        /*
        ========================================
        SMART LEAD ASKING
        ========================================
        */
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
      <div className="w-screen h-screen flex items-center justify-center bg-[#0B1120] text-white">
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
      <div className="w-screen h-screen flex items-center justify-center bg-[#0B1120] text-white">
        Chatbot not found
      </div>
    );
  }

  return (
    <div
      className={
        isEmbedded
          ? "w-screen h-screen overflow-hidden bg-[#0B1120] flex flex-col"
          : "w-full min-h-screen flex items-center justify-center bg-[#0B1120] p-4"
      }
    >

      <div
        className={`
          w-full
          h-full
          flex
          flex-col
          overflow-hidden
          border
          border-white/10
          bg-[#0B1120]
          shadow-2xl
          ${
            isEmbedded
              ? "rounded-none"
              : "max-w-[390px] h-[700px] rounded-[28px]"
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
        <div className="h-[72px] min-h-[72px] px-4 border-b border-white/10 flex items-center bg-[#151226] shrink-0">

          <div className="flex items-center gap-3 min-w-0">

            {theme.logo ? (
              <img
                src={theme.logo}
                alt="logo"
                className="w-11 h-11 rounded-2xl object-cover border border-white/10"
              />
            ) : (
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold">
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

        </div>

        {/* QUICK ACTIONS */}
        <div className="px-3 py-3 border-b border-white/10 bg-[#120f20] flex flex-wrap gap-2 shrink-0">

          <button
            onClick={() =>
              handleQuickAction(
                "booking",
                "Book Appointment"
              )
            }
            className="px-4 h-10 rounded-full bg-[#7f5af0]/15 border border-purple-500/20 text-xs text-purple-300"
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
            className="px-4 h-10 rounded-full bg-[#7f5af0]/15 border border-purple-500/20 text-xs text-purple-300"
          >
            📍 Visit Office
          </button>

        </div>

        {/* CHAT */}
        <div className="flex-1 min-h-0 overflow-y-auto px-3 py-4">

          <div className="flex flex-col gap-3">

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
                          ? `linear-gradient(135deg, ${theme.userBubble}, #5b8cff)`
                          : theme.botBubble,
                    }}
                    className="max-w-[82%] px-4 py-3 rounded-2xl text-sm text-white border border-white/5 whitespace-pre-wrap break-words"
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
                  e.key === "Enter"
                ) {

                  sendMessage();
                }
              }}
              className="flex-1 h-11 px-4 rounded-xl bg-white/10 border border-white/10 outline-none text-sm text-white placeholder:text-gray-400"
            />

            <button
              onClick={sendMessage}
              disabled={loading}
              className="h-11 px-5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium text-sm disabled:opacity-50"
            >
              Send
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}