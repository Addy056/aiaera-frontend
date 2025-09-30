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
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/chatbot/public/${id}`
        );
        const data = await res.json();

        if (data.success && data.data) {
          const chatbot = data.data;

          let config = {};
          try {
            config =
              typeof chatbot.config === "string"
                ? JSON.parse(chatbot.config)
                : chatbot.config || {};
          } catch {
            config = {};
          }

          const normalizedConfig = {
            id: chatbot.id,
            name: chatbot.name || "AI Chatbot",
            businessDescription: chatbot.business_info || "",
            websiteUrl: config.website_url || "",
            files: Array.isArray(config.files) ? config.files : [],
            logoUrl: config.logo_url || null,
            businessAddress: chatbot.businessAddress || null,
            calendlyLink: chatbot.calendlyLink || null,
            themeColors: config.themeColors || {
              background: "#0f0f17",
              userBubble: "#7f5af0",
              botBubble: "#6b21a8",
              text: "#ffffff",
            },
            location: {
              lat: config.location?.lat || null,
              lng: config.location?.lng || null,
              googleMapsLink:
                config.location?.googleMapsLink ||
                (config.location?.lat && config.location?.lng
                  ? `https://www.google.com/maps/search/?api=1&query=${config.location.lat},${config.location.lng}`
                  : null),
            },
          };

          setChatbotConfig(normalizedConfig);
        } else {
          console.error("Chatbot fetch error:", data.error || "No chatbot found");
          setChatbotConfig(null);
        }
      } catch (err) {
        console.error("Failed to fetch chatbot:", err);
        setChatbotConfig(null);
      } finally {
        setLoading(false);
      }
    };

    fetchChatbot();
  }, [id]);

  if (loading)
    return (
      <div className="text-white text-center mt-8">Loading chatbot...</div>
    );
  if (!chatbotConfig)
    return (
      <div className="text-red-400 text-center mt-8">Chatbot not found.</div>
    );

  return (
    <div
      className="w-full h-full min-h-screen bg-gradient-to-br from-[#0f0f17] via-[#1a1a2e] to-[#0f0f17] flex justify-center items-start p-4"
      style={{ overflow: "hidden" }}
    >
      <div className="w-full max-w-2xl space-y-6 flex flex-col">
        {/* Logo only (no business name text) */}
        {chatbotConfig.logoUrl ? (
          <div className="flex justify-center">
            <img
              src={chatbotConfig.logoUrl}
              alt="Logo"
              className="h-20 w-auto rounded-lg shadow-lg"
            />
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="h-20 w-20 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {chatbotConfig.name?.[0] || "A"}
            </div>
          </div>
        )}

        {/* Business Description */}
        {chatbotConfig.businessDescription && (
          <p className="text-white/80 text-center">
            {chatbotConfig.businessDescription}
          </p>
        )}

        {/* Website Link */}
        {chatbotConfig.websiteUrl && (
          <div className="text-center">
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

        {/* Business Address */}
        {chatbotConfig.businessAddress && (
          <div className="text-center text-white/80">
            <span className="font-semibold">Address: </span>
            {chatbotConfig.location?.googleMapsLink ? (
              <a
                href={chatbotConfig.location.googleMapsLink}
                target="_blank"
                rel="noreferrer"
                className="text-purple-400 underline"
              >
                {chatbotConfig.businessAddress}
              </a>
            ) : (
              chatbotConfig.businessAddress
            )}
          </div>
        )}

        {/* Calendly Button */}
        {chatbotConfig.calendlyLink && (
          <div className="text-center">
            <a
              href={chatbotConfig.calendlyLink}
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-purple-600 text-white px-4 py-2 rounded-xl shadow-md hover:bg-purple-700 transition"
            >
              📅 Book an Appointment
            </a>
          </div>
        )}

        {/* Uploaded Files */}
        {chatbotConfig.files.length > 0 && (
          <div className="bg-white/10 p-4 rounded-xl space-y-2">
            <h3 className="text-white font-semibold">Files:</h3>
            <ul className="list-disc list-inside text-white/80">
              {chatbotConfig.files.map((file, idx) => (
                <li key={file.publicUrl || file.name || idx}>
                  <a
                    href={file.publicUrl || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-purple-300"
                  >
                    {file.name || "File"}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Live Chatbot Preview */}
        <div className="bg-white/10 rounded-2xl shadow-xl p-4 flex-1 min-h-[400px]">
          <ChatbotPreview chatbotConfig={chatbotConfig} isPublic />
        </div>
      </div>
    </div>
  );
}
