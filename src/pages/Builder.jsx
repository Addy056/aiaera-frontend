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
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import ChatbotPreview from "../components/ChatbotPreview.jsx";

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

  const [themeColors, setThemeColors] = useState({
    background: "#1a1a2e",
    userBubble: "#7f5af0",
    botBubble: "#6b21a8",
    text: "#ffffff",
  });

  const fileInputRef = useRef(null);
  const logoInputRef = useRef(null);
  const chatEndRef = useRef(null);

  const API_BASE = import.meta.env.VITE_BACKEND_URL;
  const BUCKET = import.meta.env.VITE_SUPABASE_BUCKET || "chatbot-files";

  // Initialize Builder
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
          setLogoUrl(data.config?.logo_url || null);
          if (Array.isArray(data.config?.files)) setFiles(data.config.files);

          if (data.config?.location?.lat && data.config?.location?.lng) {
            setLocation(data.config.location);
            setHasSelectedLocation(true);
          } else {
            setLocation({ lat: 20.5937, lng: 78.9629 });
            setHasSelectedLocation(false);
          }

          if (data.config?.themeColors) setThemeColors(data.config.themeColors);

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

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loadingReply]);

  const pushMessage = (sender, text) => {
    setMessages((prev) => [...prev, { id: uuidv4(), sender, text }]);
  };

  // --- Save Config and Generate Embed ---
  const saveConfigToSupabase = async (extra = {}) => {
    if (!user) return;
    setSavingConfig(true);
    try {
      const config = {
        files: files || [],
        logo_url: logoUrl || null,
        location: hasSelectedLocation ? location : null,
        themeColors,
        ...extra,
      };

      if (chatbotId) {
        // ✅ Update existing chatbot
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
        // ✅ Create a new chatbot entry
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

        const { data, error } = await supabase
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

        if (error) throw error;
        setChatbotId(data.id); // ✅ Auto-generate chatbotId instantly
      }

      pushMessage("bot", "✅ Chatbot saved successfully!");
      setIsConfigSaved(true);
    } catch (err) {
      console.error("Save config error:", err);
      pushMessage("bot", "❌ Failed to save chatbot.");
    } finally {
      setSavingConfig(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-6 h-full bg-gradient-to-br from-[#0f0f17] via-[#1a1a2e] to-[#0f0f17] min-h-screen">
      {/* Left Panel */}
      <motion.div
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="lg:w-1/2 w-full"
      >
        <Card className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
            ⚡ Build Your Chatbot
          </h2>
          <Tabs defaultValue="business">
            <TabsList className="grid grid-cols-2 sm:grid-cols-5 bg-black/30 rounded-xl p-1 mb-6 gap-2">
              <TabsTrigger value="business">Business</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="scraping">Website</TabsTrigger>
              <TabsTrigger value="logo">Logo</TabsTrigger>
              <TabsTrigger value="map">Location</TabsTrigger>
            </TabsList>

            {/* Business */}
            <TabsContent value="business">
              <div className="space-y-4">
                <Input
                  placeholder="Business Name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="bg-black/30 border-0 text-white w-full"
                />
                <Textarea
                  placeholder="Business Description"
                  value={businessDescription}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                  className="bg-black/30 border-0 text-white w-full"
                />
                <Button
                  onClick={() => saveConfigToSupabase()}
                  disabled={savingConfig}
                  className="w-full bg-purple-600 hover:bg-purple-500 mt-2"
                >
                  {savingConfig ? "Saving..." : "💾 Save Chatbot"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* ✅ Embed Code section (only after save) */}
        {isConfigSaved && chatbotId && (
          <Card className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-4 mt-4">
            <h3 className="text-white font-bold text-lg mb-2">
              📄 Embed Your Chatbot
            </h3>
            <p className="text-gray-300 text-sm mb-2">
              Copy and paste this iframe into your website:
            </p>
            <textarea
              readOnly
              className="w-full h-24 bg-black/30 text-white p-2 rounded-lg font-mono text-sm"
              value={`<iframe src="${API_BASE}/public-chatbot/${chatbotId}" width="400" height="500" style="border:none; border-radius:16px;"></iframe>`}
            />
            <Button
              className="mt-2 w-full bg-purple-600 hover:bg-purple-500"
              onClick={() => {
                navigator.clipboard.writeText(
                  `<iframe src="${API_BASE}/public-chatbot/${chatbotId}" width="400" height="500" style="border:none; border-radius:16px;"></iframe>`
                );
                alert("✅ Embed code copied to clipboard!");
              }}
            >
              Copy Embed Code
            </Button>
          </Card>
        )}
      </motion.div>

      {/* Right Panel */}
      <motion.div
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="lg:w-1/2 w-full flex flex-col h-full"
      >
        {/* Color Picker */}
        <Card className="backdrop-blur-2xl bg-white/5 border border-white/20 shadow-2xl rounded-2xl p-4 mb-4 flex flex-col gap-4">
          <h3 className="text-white font-bold text-lg mb-2">
            🎨 Customize Chatbot Colors
          </h3>
          <div className="flex gap-4 flex-wrap">
            {[
              { label: "Background", field: "background" },
              { label: "User Bubble", field: "userBubble" },
              { label: "Bot Bubble", field: "botBubble" },
              { label: "Text Color", field: "text" },
            ].map((item) => (
              <div key={item.field} className="flex flex-col items-center">
                <span className="text-sm text-gray-300 mb-1">
                  {item.label}
                </span>
                <div
                  onClick={() =>
                    document
                      .getElementById(`color-input-${item.field}`)
                      .click()
                  }
                  style={{ backgroundColor: themeColors[item.field] }}
                  className="w-10 h-10 rounded-full shadow-lg cursor-pointer transition-transform hover:scale-110 border-2 border-white/20"
                />
                <input
                  type="color"
                  id={`color-input-${item.field}`}
                  value={themeColors[item.field]}
                  onChange={(e) =>
                    setThemeColors((prev) => ({
                      ...prev,
                      [item.field]: e.target.value,
                    }))
                  }
                  className="hidden"
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Chatbot Preview (❌ hides business info) */}
        <Card className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl flex-1 p-4 flex flex-col">
          <ChatbotPreview
            chatbotConfig={{
              id: chatbotId,
              name: businessName,
              // 👇 removed businessDescription — no sensitive info visible
              files,
              logoUrl,
              location: hasSelectedLocation ? location : null,
              themeColors,
            }}
            user={user}
          />
          <div ref={chatEndRef} />
        </Card>
      </motion.div>
    </div>
  );
}
