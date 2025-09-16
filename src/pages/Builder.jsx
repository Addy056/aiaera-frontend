// src/pages/Builder.jsx
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "../supabaseClient.js";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Leaflet icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function Builder() {
  const [messages, setMessages] = useState([
    {
      id: uuidv4(),
      sender: "bot",
      text: "👋 Hi! I’m your AIAERA assistant. Let’s start building.",
    },
  ]);
  const [input, setInput] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [files, setFiles] = useState([]);
  const [logoUrl, setLogoUrl] = useState(null);
  const [location, setLocation] = useState({ lat: 20.5937, lng: 78.9629 });
  const [hasSelectedLocation, setHasSelectedLocation] = useState(false);

  const [loadingConfig, setLoadingConfig] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loadingReply, setLoadingReply] = useState(false);

  const [user, setUser] = useState(null);
  const [chatbotId, setChatbotId] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [isConfigSaved, setIsConfigSaved] = useState(false);
  const [showEmbedModal, setShowEmbedModal] = useState(false);

  const fileInputRef = useRef(null);
  const logoInputRef = useRef(null);
  const chatEndRef = useRef(null);

  const API_BASE = import.meta.env.VITE_BACKEND_URL;
  const BUCKET = import.meta.env.VITE_SUPABASE_BUCKET || "chatbot-files";

  // -----------------------
  // Initialize Builder
  // -----------------------
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      setLoadingConfig(true);
      try {
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();
        if (!currentUser || !mounted) return;
        setUser(currentUser);

        const { data: sessionData } = await supabase.auth.getSession();
        setAuthToken(sessionData?.session?.access_token || null);

        const { data, error } = await supabase
          .from("chatbots")
          .select("*")
          .eq("user_id", currentUser.id)
          .single();

        if (error && error.code !== "PGRST116")
          console.warn("chatbots fetch error:", error);

        if (data) {
          setChatbotId(data.id);
          setBusinessName(data.name || "");
          setBusinessDescription(data.business_info || "");
          setWebsiteUrl(data.config?.website_url || "");
          setLogoUrl(data.config?.logo_url || null);
          if (Array.isArray(data.config?.files)) setFiles(data.config.files);

          // Ensure valid location
          if (data.config?.location?.lat && data.config?.location?.lng) {
            setLocation(data.config.location);
            setHasSelectedLocation(true);
          } else {
            setLocation({ lat: 20.5937, lng: 78.9629 }); // default India coords
            setHasSelectedLocation(false);
          }
          setIsConfigSaved(true);
        }
      } catch (err) {
        console.error("Init Builder error:", err);
      } finally {
        if (mounted) setLoadingConfig(false);
      }
    };
    init();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loadingReply]);

  // -----------------------
  // Push Message
  // -----------------------
  const pushMessage = (sender, payload) => {
    // payload can be string (old) or object (new structured)
    const message =
      typeof payload === "string"
        ? { id: uuidv4(), sender, text: payload }
        : { id: uuidv4(), sender, ...payload };

    setMessages((prev) => [...prev, message]);
  };

  // -----------------------
  // Save Config
  // -----------------------
  const saveConfigToSupabase = async (extra = {}) => {
    if (!user) return;
    setSavingConfig(true);
    try {
      const config = {
        website_url: websiteUrl || "",
        files: files || [],
        logo_url: logoUrl || null,
        location: hasSelectedLocation ? location : null,
        ...extra,
      };

      if (chatbotId) {
        await supabase
          .from("chatbots")
          .update({
            name: businessName,
            business_info: businessDescription,
            config,
            updated_at: new Date().toISOString(),
          })
          .eq("id", chatbotId)
          .eq("user_id", user.id);
      } else {
        // Ensure subscription active
        const { data: subscription } = await supabase
          .from("user_subscriptions")
          .select("expires_at")
          .eq("user_id", user.id)
          .maybeSingle();

        const expired =
          !subscription ||
          !subscription.expires_at ||
          new Date(subscription.expires_at) < new Date();
        if (expired) {
          pushMessage(
            "bot",
            "⚠️ Your subscription is inactive. Please renew to create your chatbot. Go to Pricing."
          );
          setSavingConfig(false);
          return;
        }

        const { data } = await supabase
          .from("chatbots")
          .insert([
            {
              user_id: user.id,
              name: businessName,
              business_info: businessDescription,
              config,
            },
          ])
          .select()
          .single();
        setChatbotId(data.id);
      }
      pushMessage("bot", "✅ Configuration saved.");
      setIsConfigSaved(true);
    } catch (err) {
      console.error("Save config error:", err);
      pushMessage("bot", "❌ Failed to save configuration.");
    } finally {
      setSavingConfig(false);
    }
  };

  // -----------------------
  // Chat Preview
  // -----------------------
  const sendMessage = async () => {
    if (!input.trim() || !user) return;
    const userText = input.trim();
    pushMessage("user", userText);

    const prior = messages.map((m) => ({
      role: m.sender === "bot" ? "assistant" : "user",
      content: m.text || m.label || "",
    }));

    setInput("");
    setLoadingReply(true);

    try {
      const { data } = await supabase
        .from("business_data")
        .select("*")
        .eq("user_id", user.id);

      const context = data
        .map(
          (r, idx) =>
            `#${idx + 1} ${r.title}\nDesc: ${r.description || ""}\nAttrs: ${JSON.stringify(
              r.attributes
            )}`
        )
        .join("\n\n");

      const augmentedMessages = [
        ...prior,
        {
          role: "system",
          content:
            "You are an assistant for a business. Answer ONLY using the data provided in 'Business Data Context'.",
        },
        { role: "assistant", content: `Business Data Context:\n${context}` },
        { role: "user", content: userText },
      ];

      const chatbotConfig = {
        chatbotId: chatbotId || null,
        businessName: businessName || "",
        businessDescription: businessDescription || "",
        websiteUrl: websiteUrl || "",
        files: files || [],
        logoUrl: logoUrl || null,
        location: hasSelectedLocation ? location : null,
      };

      const res = await axios.post(
        `${API_BASE}/api/chatbot/preview`,
        {
          userId: user.id,
          chatbotConfig,
          messages: augmentedMessages,
          retrievedData: data,
        },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      const botReply = res.data?.reply;

      if (!botReply) {
        pushMessage("bot", "🤖 (No reply received)");
      } else if (botReply.type === "button") {
        pushMessage("bot", {
          type: "button",
          label: botReply.label,
          url: botReply.url,
        });
      } else {
        pushMessage("bot", botReply.text || String(botReply));
      }
    } catch (err) {
      console.error(
        "Preview chat error:",
        err.response?.data || err.message || err
      );
      pushMessage("bot", "❌ Error: Unable to get a reply.");
    } finally {
      setLoadingReply(false);
    }
  };

  // -----------------------
  // Chat Message Renderer
  // -----------------------
  const renderMessage = (msg) => {
    if (msg.type === "button") {
      return (
        <Button
          asChild
          className="mt-2 bg-green-500 hover:bg-green-600 text-white"
        >
          <a href={msg.url} target="_blank" rel="noreferrer">
            {msg.label || "Open Link"}
          </a>
        </Button>
      );
    }
    return <span>{msg.text}</span>;
  };

  // -----------------------
  // Map
  // -----------------------
  function LocationMarker() {
    useMapEvents({
      click(e) {
        setLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
        setHasSelectedLocation(true);
        saveConfigToSupabase({
          location: { lat: e.latlng.lat, lng: e.latlng.lng },
        });
      },
    });
    return hasSelectedLocation ? (
      <Marker position={[location.lat, location.lng]}>
        <Popup>Business Location</Popup>
      </Marker>
    ) : null;
  }

  // -----------------------
  // Embed Code
  // -----------------------
  const generateEmbedCode = () => setShowEmbedModal(true);
  const embedCode = chatbotId
    ? `<script src="${API_BASE}/api/embed/${chatbotId}.js" async></script>`
    : "";
  const copyEmbedCode = () => {
    if (!embedCode) return;
    navigator.clipboard.writeText(embedCode);
    alert("Embed code copied!");
  };

  // -----------------------
  // JSX
  // -----------------------
  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-6 h-full bg-gradient-to-br from-[#0f0f17] via-[#1a1a2e] to-[#0f0f17] min-h-screen">
      {/* Left Panel */}
      {/* ... SAME as before (Business, Files, Logo, Website, Map) ... */}

      {/* Right Panel: Chat Preview */}
      <motion.div
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="lg:w-1/2 w-full flex flex-col h-full"
      >
        <Card className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl flex-1 p-4 flex flex-col">
          <div className="flex-1 overflow-y-auto mb-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-2 ${
                  msg.sender === "bot" ? "text-left" : "text-right"
                }`}
              >
                <div
                  className={`inline-block px-3 py-2 rounded-xl ${
                    msg.sender === "bot"
                      ? "bg-purple-600 text-white"
                      : "bg-white/20 text-white"
                  }`}
                >
                  {renderMessage(msg)}
                </div>
              </div>
            ))}
            <div ref={chatEndRef}></div>
          </div>
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-black/20 border-0 text-white"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button
              onClick={sendMessage}
              disabled={loadingReply}
              className="bg-purple-600 hover:opacity-90"
            >
              {loadingReply ? "..." : "Send"}
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
