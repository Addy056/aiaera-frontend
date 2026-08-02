import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { ChatWidget } from "../components/chat";
import useVisitorId from "../hooks/useVisitorId";
import { loadChat, saveChat } from "../utils/chatStorage";
import {
  DEFAULT_MESSAGE,
  DEFAULT_INTEGRATIONS,
  CHAT_PLACEHOLDERS,
} from "../constants/chatConstants";
import { fetchPublicChatbot, sendPublicMessage } from "../api/chatApi";

export default function PublicChatbot() {
  const { id } = useParams();
  const visitorId = useVisitorId();

  /*
  ========================================
  EMBED MODE
  ========================================
  */
  const isEmbed =
  new URLSearchParams(window.location.search).get("embed") === "true";

  /*
  ========================================
  STATES
  ========================================
  */
  useEffect(() => {
  const saved = loadChat(id);
  if (saved && saved.length > 0) {
    setMessages(saved);
  } else {
    setMessages([DEFAULT_MESSAGE]);
  }
}, [id]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatbot, setChatbot] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [expired, setExpired] = useState(false);

  const [integrations, setIntegrations] = useState(DEFAULT_INTEGRATIONS);

  /*
  ========================================
  RELOAD CHAT ON ID CHANGE
  ========================================
  */
  useEffect(() => {
    const saved = loadChat(id);
    if (saved && saved.length > 0) {
      setMessages(saved);
    } else {
      setMessages([DEFAULT_MESSAGE]);
    }
  }, [id]);

  /*
  ========================================
  LOCALSTORAGE PERSISTENCE
  ========================================
  */
  useEffect(() => {
    saveChat(id, messages);
  }, [messages, id]);

  /*
  ========================================
  FETCH CHATBOT
  ========================================
  */
const fetchChatbot = useCallback(async () => {
  try {
    setFetching(true);

    setExpired(false);
    setChatbot(null);

    const data = await fetchPublicChatbot(id);

      if (data.subscription_expired) {
        setExpired(true);
        setMessages([
          {
            role: "bot",
            text: "This chatbot is temporarily unavailable.",
          },
        ]);
        return;
      }

      setChatbot(data.chatbot);
console.log("PUBLIC CHATBOT:", data.chatbot);
      setIntegrations({
        ...DEFAULT_INTEGRATIONS,
        ...(data.integrations || {}),
      });
    } catch (error) {
  console.error("FETCH CHATBOT ERROR:", error);

  setMessages([
    {
      role: "bot",
      text: "Unable to load chatbot. Please try again later.",
    },
  ]);
} finally {
  setFetching(false);
}
  }, [id]);

  useEffect(() => {
    fetchChatbot();
  }, [fetchChatbot]);

  useEffect(() => {
  if (!isEmbed) return;

  const html = document.documentElement;
  const body = document.body;

  const previousHtmlOverflow = html.style.overflow;
  const previousBodyOverflow = body.style.overflow;

  html.style.overflow = "hidden";
  body.style.overflow = "hidden";

  return () => {
    html.style.overflow = previousHtmlOverflow;
    body.style.overflow = previousBodyOverflow;
  };
}, [isEmbed]);

useEffect(() => {
  const viewport = document.querySelector('meta[name="viewport"]');

  if (!viewport) return;

  const previous = viewport.getAttribute("content");

  viewport.setAttribute(
    "content",
    "width=device-width, initial-scale=1, maximum-scale=1"
  );

  return () => {
    if (previous) {
      viewport.setAttribute("content", previous);
    }
  };
}, []);
  /*
  ========================================
  SEND MESSAGE
  ========================================
  */
 const sendMessage = useCallback(
  async (customText = null) => {
    const textToSend = customText || input;

    if (!textToSend.trim() || loading || expired) return;

    const userMessage = {
      role: "user",
      text: textToSend,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);

    if (!customText) {
      setInput("");
    }

    try {
      setLoading(true);

      const data = await sendPublicMessage({
        chatbotId: id,
        visitorId,
        message: textToSend,
        messages: updatedMessages,
      });

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            text: data.error,
          },
        ]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: data.reply || "No response generated.",
        },
      ]);
    } catch (error) {
      console.error("CHAT ERROR:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Something went wrong. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  },
  [input, loading, expired, messages, id, visitorId]
);

  /*
  ========================================
  LOADING
  ========================================
  */
  if (fetching) {
    return (
      <div className="w-screen min-h-[100dvh] bg-[#050816] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2
            size={36}
            className="animate-spin text-purple-400 mb-4"
          />
          <p className="text-sm text-gray-400">
           Loading {chatbot?.name || chatbot?.bot_name || "Assistant"}...
          </p>
        </div>
      </div>
    );
  }
/*
========================================
QUICK ACTIONS
========================================
*/

const handleBookAppointment = () => {
  sendMessage("I want to book an appointment.");
};

const handleVisitOffice = () => {
  sendMessage("Where is your office located?");
};

const handleAskServices = () => {
  sendMessage("Tell me about your services.");
};

return (
  <div
    className={
      isEmbed
        ? `
            relative
            h-full
            w-full
            overflow-x-hidden
            overflow-y-hidden
            bg-[#050816]
          `
        : `
            relative
            flex
            min-h-[100dvh]
            items-center
            justify-center
            overflow-x-hidden
            overflow-y-hidden
            bg-[#050816]
            p-3
            sm:p-4
            lg:p-6
          `
    }
  >
    {!isEmbed && (
      <>
        <div className="pointer-events-none absolute -left-32 -top-32 h-[300px] w-[300px] rounded-full bg-purple-600/20 blur-[120px]" />

        <div className="pointer-events-none absolute -bottom-32 -right-32 h-[300px] w-[300px] rounded-full bg-blue-600/20 blur-[120px]" />
      </>
    )}

    <div
      className={`
        relative
        flex
        w-full
        flex-col
        overflow-hidden

        border
        border-white/10

        bg-[#0B1120]/95

        shadow-[0_20px_120px_rgba(0,0,0,0.55)]

        ${
          isEmbed
            ? `
                h-full
                w-full
                rounded-none
              `
            : `
                max-w-full
                sm:max-w-[430px]
                lg:max-w-[450px]

                h-[calc(100dvh-24px)]
                sm:h-[720px]
                lg:h-[740px]

                rounded-[24px]
                sm:rounded-[32px]
              `
        }
      `}
    >
      <ChatWidget
        mode="public"
        chatbot={chatbot}
        messages={messages}
        loading={loading}
        input={input}
        setInput={setInput}
        onSend={sendMessage}
        integrations={integrations}
        onBookAppointment={handleBookAppointment}
        onVisitOffice={handleVisitOffice}
        onAskServices={handleAskServices}
        placeholder={
          expired
            ? CHAT_PLACEHOLDERS.disabled
            : CHAT_PLACEHOLDERS.default
        }
        disabled={expired}
      />
    </div>
  </div>
);
}