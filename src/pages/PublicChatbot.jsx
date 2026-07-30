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
  const [messages, setMessages] = useState(() => {
    const saved = loadChat(id);
    if (saved && saved.length > 0) {
      return saved;
    }
    return [DEFAULT_MESSAGE];
  });

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
      <div className="w-screen h-[100dvh] bg-[#050816] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2
            size={36}
            className="animate-spin text-purple-400 mb-4"
          />
          <p className="text-sm text-gray-400">
            Loading {chatbot?.bot_name || "Assistant"}...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        isEmbed
          ? "w-screen h-[100dvh] bg-[#050816] overflow-hidden relative"
          : "min-h-screen bg-[#050816] flex items-center justify-center p-4 overflow-hidden relative"
      }
    >
      {!isEmbed && (
        <>
          <div className="absolute top-[-120px] left-[-120px] w-[300px] h-[300px] bg-purple-600/20 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-120px] right-[-120px] w-[300px] h-[300px] bg-blue-600/20 blur-[120px] rounded-full"></div>
        </>
      )}

      <div
        className={`
        relative
        w-full
        h-[100dvh]
        flex
        flex-col
        overflow-hidden
        bg-[#0B1120]/95
        border
        border-white/10
        shadow-[0_20px_120px_rgba(0,0,0,0.55)]
        ${
          isEmbed
            ? "rounded-none"
            : "max-w-5xl rounded-[36px]"
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