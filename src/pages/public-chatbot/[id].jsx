// src/pages/public-chatbot/[id].jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ChatbotPreview from "../../components/ChatbotPreview";

export default function PublicChatbot() {
  const { id } = useParams();
  const [chatbotConfig, setChatbotConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChatbot = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/chatbots/public/${id}`);
        const data = await res.json();

        if (data.success && data.chatbot) {
          const chatbot = data.chatbot;

          // Normalize config fields safely
          const normalizedConfig = {
            id: chatbot.id,
            name: chatbot.name || "AI Chatbot",
            businessDescription: chatbot.business_info || "",
            websiteUrl: chatbot.config?.website_url || "",
            files: Array.isArray(chatbot.config?.files) ? chatbot.config.files : [],
            logoUrl: chatbot.config?.logo_url || null,
          };

          setChatbotConfig(normalizedConfig);
        } else {
          console.error("Chatbot fetch error:", data.error || "No chatbot found");
        }
      } catch (err) {
        console.error("Failed to fetch chatbot:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChatbot();
  }, [id]);

  if (loading) return <div>Loading chatbot...</div>;
  if (!chatbotConfig) return <div>Chatbot not found.</div>;

  return (
    <div className="p-4 min-h-screen bg-gradient-to-br from-[#0f0f17] via-[#1a1a2e] to-[#0f0f17]">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Logo */}
        {chatbotConfig.logoUrl ? (
          <div className="flex justify-center mb-4">
            <img
              src={chatbotConfig.logoUrl}
              alt="Logo"
              className="h-20 w-auto rounded-lg shadow-lg"
            />
          </div>
        ) : (
          <div className="flex justify-center mb-4">
            <div className="h-20 w-20 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {chatbotConfig.name?.[0] || "A"}
            </div>
          </div>
        )}

        {/* Business Name */}
        <h1 className="text-3xl font-bold text-white text-center">
          {chatbotConfig.name}
        </h1>

        {/* Business Description */}
        {chatbotConfig.businessDescription && (
          <p className="text-white/80 text-center">
            {chatbotConfig.businessDescription}
          </p>
        )}

        {/* Website Link */}
        {chatbotConfig.websiteUrl && (
          <div className="text-center mt-2">
            <a
              href={chatbotConfig.websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="text-purple-400 underline"
            >
              Visit Website
            </a>
          </div>
        )}

        {/* Uploaded Files */}
        {chatbotConfig.files.length > 0 && (
          <div className="bg-white/10 p-4 rounded-xl space-y-2">
            <h3 className="text-white font-semibold">Files:</h3>
            <ul className="list-disc list-inside text-white/80">
              {chatbotConfig.files.map((file) => (
                <li key={file.publicUrl}>
                  <a
                    href={file.publicUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-purple-300"
                  >
                    {file.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Live Chatbot Preview */}
        <ChatbotPreview chatbotConfig={chatbotConfig} />
      </div>
    </div>
  );
}
