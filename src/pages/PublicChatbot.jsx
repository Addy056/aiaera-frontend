import {
  useState,
  useEffect,
  useRef,
} from "react";

import {
  useParams,
} from "react-router-dom";

import {
  Send,
  Bot,
  User,
  Loader2,
  Calendar,
  MapPin,
  Sparkles,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL;

/*
========================================
RTL LANGUAGE DETECTION
========================================
*/
const isRTLText =
  (text = "") => {

    const rtlRegex =
      /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;

    return rtlRegex.test(
      text
    );
  };

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

  const [expired, setExpired] =
    useState(false);

  const [integrations, setIntegrations] =
    useState({
      provider: "calendly",
      meeting_link: "",
      maps: "",
    });

  const messagesEndRef =
    useRef(null);

  /*
  ========================================
  SCROLL
  ========================================
  */
  useEffect(() => {

    messagesEndRef.current
      ?.scrollIntoView({
        behavior:
          "smooth",
      });

  }, [messages]);

  /*
  ========================================
  FETCH CHATBOT
  ========================================
  */
  useEffect(() => {

    fetchChatbot();

  }, [id]);

  const fetchChatbot =
    async () => {

      try {

        setFetching(true);

        const response =
          await fetch(
            `${API_URL}/api/chatbot/public/${id}`
          );

        const data =
          await response.json();

        /*
        ========================================
        EXPIRED
        ========================================
        */
        if (
          data.subscription_expired
        ) {

          setExpired(true);

          setMessages([
            {
              role: "bot",
              text:
                "This chatbot is temporarily unavailable.",
            },
          ]);

          return;
        }

        setChatbot(
          data.chatbot
        );

        setIntegrations({
          provider:
            data.integrations
              ?.provider ||
            "calendly",

          meeting_link:
            data.integrations
              ?.meeting_link ||
            "",

          maps:
            data.integrations
              ?.maps || "",
        });

      } catch (error) {

        console.error(
          error
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
        loading ||
        expired
      )
        return;

      const userMessage = {
        role: "user",
        text: input,
      };

      const updatedMessages = [
        ...messages,
        userMessage,
      ];

      setMessages(
        updatedMessages
      );

      const currentInput =
        input;

      setInput("");

      try {

        setLoading(true);

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
                  chatbotId: id,
                  message:
                    currentInput,
                  messages:
                    updatedMessages,
                }),
            }
          );

        const data =
          await response.json();

        /*
        ========================================
        ERROR
        ========================================
        */
        if (
          data.error
        ) {

          setMessages(
            (
              prev
            ) => [
              ...prev,
              {
                role: "bot",
                text:
                  data.error,
              },
            ]
          );

          return;
        }

        /*
        ========================================
        BOT MESSAGE
        ========================================
        */
        setMessages(
          (
            prev
          ) => [
            ...prev,
            {
              role: "bot",
              text:
                data.reply,
            },
          ]
        );

      } catch (error) {

        console.error(
          error
        );

        setMessages(
          (
            prev
          ) => [
            ...prev,
            {
              role: "bot",
              text:
                "Something went wrong. Please try again later.",
            },
          ]
        );

      } finally {

        setLoading(false);

      }
    };

  /*
  ========================================
  ENTER
  ========================================
  */
  const handleKeyDown =
    (e) => {

      if (
        e.key ===
        "Enter"
      ) {

        e.preventDefault();

        sendMessage();
      }
    };

  /*
  ========================================
  INPUT RTL
  ========================================
  */
  const inputIsRTL =
    isRTLText(
      input
    );

  /*
  ========================================
  LOADING
  ========================================
  */
  if (fetching) {

    return (

      <div className="min-h-screen bg-[#050816] flex items-center justify-center">

        <div className="flex flex-col items-center">

          <Loader2
            size={36}
            className="animate-spin text-purple-400 mb-4"
          />

          <p className="text-sm text-gray-400">

            Loading AI assistant...

          </p>

        </div>

      </div>
    );
  }

  return (

    <div className="min-h-screen bg-[#050816] flex items-center justify-center p-4 overflow-hidden relative">

      {/* BACKGROUND */}
      <div className="absolute top-[-120px] left-[-120px] w-[300px] h-[300px] bg-purple-600/20 blur-[120px] rounded-full"></div>

      <div className="absolute bottom-[-120px] right-[-120px] w-[300px] h-[300px] bg-blue-600/20 blur-[120px] rounded-full"></div>

      {/* CHATBOT */}
      <div className="relative w-full max-w-5xl h-[92vh] flex flex-col rounded-[36px] border border-white/10 bg-[#0B1120]/90 backdrop-blur-3xl overflow-hidden shadow-[0_20px_120px_rgba(0,0,0,0.55)]">

        {/* HEADER */}
        <div className="h-[90px] border-b border-white/10 px-6 flex items-center justify-between bg-white/[0.02]">

          {/* LEFT */}
          <div className="flex items-center gap-4">

            <div className="relative">

              <div className="absolute inset-0 bg-purple-500/20 blur-[20px] rounded-2xl"></div>

              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7f5af0] to-blue-500 flex items-center justify-center border border-white/10">

                <Bot
                  size={24}
                  className="text-white"
                />

              </div>

            </div>

            <div>

              <div className="flex items-center gap-2 mb-1">

                <h2 className="text-lg font-bold text-white">

                  {chatbot?.bot_name ||
                    "AI Assistant"}

                </h2>

                <div className="w-2 h-2 rounded-full bg-green-400"></div>

              </div>

              <p className="text-sm text-gray-400">

                Multilingual AI assistant

              </p>

            </div>

          </div>

          {/* BADGE */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20">

            <Sparkles
              size={14}
              className="text-purple-300"
            />

            <span className="text-xs text-purple-200">

              Powered by AIAERA

            </span>

          </div>

        </div>

        {/* EXPIRED */}
        {expired && (

          <div className="mx-6 mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 flex items-start gap-3">

            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">

              <AlertTriangle
                size={18}
                className="text-red-300"
              />

            </div>

            <div>

              <h3 className="font-semibold text-red-200 mb-1">

                Chatbot Unavailable

              </h3>

              <p className="text-sm text-red-100/80">

                The subscription for this chatbot has expired.

              </p>

            </div>

          </div>

        )}

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 min-h-0">

          {messages.map(
            (
              message,
              index
            ) => {

              const rtl =
                isRTLText(
                  message.text
                );

              return (

                <div
                  key={index}
                  className={`flex ${
                    message.role ===
                    "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  <div
                    className={`
                      max-w-[85%]
                      rounded-[28px]
                      px-5
                      py-4
                      border
                      backdrop-blur-xl
                      ${
                        message.role ===
                        "user"
                          ? `
                            bg-gradient-to-br
                            from-[#7f5af0]
                            to-blue-500
                            border-purple-400/30
                            text-white
                          `
                          : `
                            bg-white/[0.04]
                            border-white/10
                            text-gray-200
                          `
                      }
                    `}
                  >

                    <div className={`
                      flex
                      items-start
                      gap-3
                      ${
                        rtl
                          ? "flex-row-reverse"
                          : ""
                      }
                    `}>

                      {/* ICON */}
                      <div className={`
                        min-w-[36px]
                        h-[36px]
                        rounded-xl
                        flex
                        items-center
                        justify-center
                        ${
                          message.role ===
                          "user"
                            ? "bg-white/20"
                            : "bg-purple-500/10"
                        }
                      `}>

                        {message.role ===
                        "user" ? (

                          <User
                            size={16}
                          />

                        ) : (

                          <Bot
                            size={16}
                            className="text-purple-300"
                          />

                        )}

                      </div>

                      {/* TEXT */}
                      <div
                        dir={
                          rtl
                            ? "rtl"
                            : "ltr"
                        }
                        className={`
                          leading-relaxed
                          text-sm
                          whitespace-pre-wrap
                          break-words
                          ${
                            rtl
                              ? "text-right"
                              : "text-left"
                          }
                        `}
                      >

                        {message.text}

                      </div>

                    </div>

                  </div>

                </div>

              );
            }
          )}

          {/* LOADING */}
          {loading && (

            <div className="flex justify-start">

              <div className="rounded-[28px] px-5 py-4 border border-white/10 bg-white/[0.04]">

                <div className="flex items-center gap-3">

                  <Loader2
                    size={16}
                    className="animate-spin text-purple-300"
                  />

                  <span className="text-sm text-gray-300">

                    AI is typing...

                  </span>

                </div>

              </div>

            </div>

          )}

          <div ref={messagesEndRef} />

        </div>

        {/* FOOTER */}
        <div className="border-t border-white/10 p-5 bg-white/[0.02]">

          {/* QUICK ACTIONS */}
          {(integrations.meeting_link ||
            integrations.maps) && (

            <div className="flex flex-wrap gap-3 mb-4">

              {/* APPOINTMENT */}
              {integrations.meeting_link && (

                <a
                  href={
                    integrations.meeting_link
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 h-11 px-5 rounded-2xl bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-all text-sm"
                >

                  <Calendar
                    size={15}
                    className="text-purple-300"
                  />

                  Book Appointment

                  <ExternalLink
                    size={14}
                  />

                </a>

              )}

              {/* MAPS */}
              {integrations.maps && (

                <a
                  href={
                    integrations.maps
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 h-11 px-5 rounded-2xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-all text-sm"
                >

                  <MapPin
                    size={15}
                    className="text-blue-300"
                  />

                  View Location

                  <ExternalLink
                    size={14}
                  />

                </a>

              )}

            </div>

          )}

          {/* INPUT */}
          <div className="flex items-center gap-4">

            <div className="flex-1 relative">

              <input
                type="text"
                dir={
                  inputIsRTL
                    ? "rtl"
                    : "ltr"
                }
                value={input}
                onChange={(e) =>
                  setInput(
                    e.target.value
                  )
                }
                onKeyDown={
                  handleKeyDown
                }
                disabled={
                  loading ||
                  expired
                }
                placeholder={
                  expired
                    ? "Chatbot unavailable"
                    : "Type your message..."
                }
                className={`
                  w-full
                  h-[60px]
                  rounded-2xl
                  bg-[#111827]
                  border
                  border-white/10
                  px-5
                  pr-14
                  text-white
                  placeholder:text-gray-500
                  outline-none
                  focus:border-purple-500
                  transition-all
                  ${
                    inputIsRTL
                      ? "text-right"
                      : "text-left"
                  }
                `}
              />

            </div>

            <button
              onClick={
                sendMessage
              }
              disabled={
                loading ||
                expired ||
                !input.trim()
              }
              className={`
                min-w-[60px]
                h-[60px]
                rounded-2xl
                flex
                items-center
                justify-center
                transition-all
                ${
                  loading ||
                  expired ||
                  !input.trim()
                    ? "bg-white/5 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-br from-[#7f5af0] to-blue-500 hover:scale-[1.03] shadow-[0_10px_40px_rgba(127,90,240,0.35)]"
                }
              `}
            >

              <Send
                size={18}
              />

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}