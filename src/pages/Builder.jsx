// src/pages/Builder.jsx
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { supabase } from "../supabaseClient";

import Sidebar from "../components/builder/Sidebar";
import LockedSection from "../components/builder/LockedSection";
import BusinessTab from "../components/builder/BusinessTab";
import FilesTab from "../components/builder/FilesTab";
import WebsiteTab from "../components/builder/WebsiteTab";
import StudioTab from "../components/builder/StudioTab";
import AuroraLayer from "../components/builder/AuroraLayer";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Save } from "lucide-react";

export default function Builder() {
  const [activeTab, setActiveTab] = useState("business");

  const [user, setUser] = useState(null);
  const [subscriptionActive, setSubscriptionActive] = useState(true);
  const [plan, setPlan] = useState("free");
  const [freeAccess, setFreeAccess] = useState(false);

  const [loadingInit, setLoadingInit] = useState(true);
  const [saving, setSaving] = useState(false);

  const FREE_ACCESS_EMAIL = "aiaera056@gmail.com";
  const BUCKET = import.meta.env.VITE_SUPABASE_BUCKET || "chatbot-files";

  const APP_BASE_URL = import.meta.env.VITE_APP_BASE_URL;
  const API_BASE = import.meta.env.VITE_API_URL;
  const INTEGRATIONS_API = `${API_BASE}/api/integrations`;

  const [chatbotId, setChatbotId] = useState(null);
  const [isConfigSaved, setIsConfigSaved] = useState(false);

  const [businessName, setBusinessName] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [businessWebsite, setBusinessWebsite] = useState("");

  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const [logoUrl, setLogoUrl] = useState(null);
  const logoInputRef = useRef(null);

  const [themeColors, setThemeColors] = useState({
    background: "#0b0b17",
    userBubble: "#7f5af0",
    botBubble: "#70e1ff",
    text: "#ffffff",
  });

  const [showEmbed, setShowEmbed] = useState(false);
  const [calendlyLink, setCalendlyLink] = useState("");

  // ✅ STREAM STATE
  const [previewMessage, setPreviewMessage] = useState("");
  const [previewReply, setPreviewReply] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const eventSourceRef = useRef(null);

  const aiSuggestions = [
    "We build AI chat assistants that qualify leads, answer FAQs, and book meetings 24/7.",
    "Scale support with multi-channel AI chat — website, WhatsApp, and social, no code needed.",
    "Boost conversions with a smart chatbot tailored to your business.",
  ];

  // ✅ STREAM FUNCTION
  const startPreviewStream = (message) => {
    if (!chatbotId || !message.trim()) return;

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    setPreviewReply("");
    setIsStreaming(true);

    const messages = [{ role: "user", content: message }];
    const encoded = encodeURIComponent(JSON.stringify(messages));

    const url = `${API_BASE}/api/chatbot/preview-stream/${chatbotId}?messages=${encoded}`;
    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.addEventListener("token", (e) => {
      const token = JSON.parse(e.data);
      setPreviewReply((prev) => prev + token);
    });

    es.addEventListener("done", () => {
      es.close();
      setIsStreaming(false);
    });

    es.onerror = () => {
      es.close();
      setIsStreaming(false);
    };
  };

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  // ✅ INITIAL LOAD
  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoadingInit(true);

      try {
        const { data: session } = await supabase.auth.getUser();
        const u = session.user;
        if (!u || !mounted) return;

        setUser(u);

        if (u.email === FREE_ACCESS_EMAIL) {
          setFreeAccess(true);
          setSubscriptionActive(true);
          setPlan("pro");
        } else {
          const { data: sub } = await supabase
            .from("user_subscriptions")
            .select("plan, expires_at")
            .eq("user_id", u.id)
            .maybeSingle();

          setPlan(sub?.plan || "free");
          setSubscriptionActive(true);
        }

        const { data: bot } = await supabase
          .from("chatbots")
          .select("*")
          .eq("user_id", u.id)
          .maybeSingle();

        if (bot) {
          setChatbotId(bot.id);
          setBusinessName(bot.name || "");
          setBusinessDescription(bot.business_info || "");

          const cfg = bot.config || {};
          setBusinessEmail(cfg.businessEmail || "");
          setBusinessPhone(cfg.businessPhone || "");
          setBusinessWebsite(cfg.businessWebsite || "");
          setFiles(Array.isArray(cfg.files) ? cfg.files : []);
          setLogoUrl(cfg.logo_url || null);
          if (cfg.themeColors) setThemeColors(cfg.themeColors);

          setIsConfigSaved(true);
        }

        try {
          const res = await fetch(`${INTEGRATIONS_API}?user_id=${u.id}`);
          const json = await res.json();
          if (json?.success && json?.data?.calendly_link) {
            setCalendlyLink(json.data.calendly_link);
          }
        } catch {}
      } finally {
        if (mounted) setLoadingInit(false);
      }
    })();

    return () => (mounted = false);
  }, []);

  // ✅ FILE UPLOAD
  const uploadFileToStorage = async (file) => {
    if (!user) throw new Error("No User");

    const path = `${user.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file);
    if (error) throw error;

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return { name: file.name, url: data.publicUrl, size: file.size };
  };

  const handleFilesUpload = async (e) => {
    if (plan !== "pro" && !freeAccess) {
      alert("Files tab is Pro only.");
      return;
    }

    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;

    setUploading(true);

    try {
      const uploaded = [];
      for (const f of selected) uploaded.push(await uploadFileToStorage(f));
      setFiles((prev) => [...uploaded, ...prev]);
    } finally {
      setUploading(false);
      fileInputRef.current.value = "";
    }
  };

  // ✅ AI SUGGESTION
  const handleSuggest = () => {
    const suggestion = aiSuggestions[Math.floor(Math.random() * aiSuggestions.length)];
    setBusinessDescription((prev) => (prev ? `${prev}\n\n${suggestion}` : suggestion));
  };

  // ✅ SAVE CONFIG
  const saveConfigToSupabase = async () => {
    if (!user) return;

    setSaving(true);

    const config = {
      businessEmail,
      businessPhone,
      businessWebsite,
      files,
      logo_url: logoUrl,
      themeColors,
      calendlyLink,
    };

    if (chatbotId) {
      await supabase
        .from("chatbots")
        .update({
          name: businessName,
          business_info: businessDescription,
          config,
        })
        .eq("id", chatbotId);
    } else {
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

    setIsConfigSaved(true);
    setSaving(false);
    alert("Saved!");
  };

  if (loadingInit) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0b0b17] text-white">
        Initializing...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0a0b14] text-white overflow-x-hidden">
      <AuroraLayer />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[#cbb8ff] via-[#9b8cff] to-[#5be7ff] bg-clip-text text-transparent">
              AIAERA Builder Studio
            </h1>
            <p className="text-gray-300 mt-2">
              Design, train, and embed your AI assistant.
            </p>
          </div>

          <Button onClick={saveConfigToSupabase} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="col-span-12 lg:col-span-9">
            <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl p-6">

                {activeTab === "business" && (
                  <BusinessTab
                    businessName={businessName}
                    setBusinessName={setBusinessName}
                    businessDescription={businessDescription}
                    setBusinessDescription={setBusinessDescription}
                    businessEmail={businessEmail}
                    setBusinessEmail={setBusinessEmail}
                    businessPhone={businessPhone}
                    setBusinessPhone={setBusinessPhone}
                    businessWebsite={businessWebsite}
                    setBusinessWebsite={setBusinessWebsite}
                    handleSuggest={handleSuggest}
                    previewMessage={previewMessage}
                    setPreviewMessage={setPreviewMessage}
                    previewReply={previewReply}
                    isStreaming={isStreaming}
                    startPreviewStream={startPreviewStream}
                  />
                )}

                {activeTab === "files" &&
                  (plan !== "pro" && !freeAccess ? (
                    <LockedSection message="Files feature is available only in the Pro plan." />
                  ) : (
                    <FilesTab
                      files={files}
                      setFiles={setFiles}
                      uploading={uploading}
                      handleFilesUpload={handleFilesUpload}
                      fileInputRef={fileInputRef}
                    />
                  ))}

                {activeTab === "website" && (
                  <WebsiteTab
                    businessWebsite={businessWebsite}
                    setBusinessWebsite={setBusinessWebsite}
                  />
                )}

                {activeTab === "studio" && (
                  <StudioTab
                    themeColors={themeColors}
                    setThemeColors={setThemeColors}
                    presetThemes={{
                      aurora: {
                        background: "#0e0b24",
                        userBubble: "#7f5af0",
                        botBubble: "#00eaff",
                        text: "#ffffff",
                      },
                      night: {
                        background: "#0c0f1d",
                        userBubble: "#bba7ff",
                        botBubble: "#6b21a8",
                        text: "#f7f7fb",
                      },
                      glass: {
                        background: "#ffffff20",
                        userBubble: "#7f5af0",
                        botBubble: "#a78bfa",
                        text: "#0b0c11",
                      },
                      ocean: {
                        background: "#081427",
                        userBubble: "#7f5af0",
                        botBubble: "#4ad9ff",
                        text: "#e8f7ff",
                      },
                    }}
                    logoUrl={logoUrl}
                    setLogoUrl={setLogoUrl}
                    logoInputRef={logoInputRef}
                    uploadFileToStorage={uploadFileToStorage}
                    chatbotId={chatbotId}
                    businessName={businessName}
                    files={files}
                    user={user}
                    isConfigSaved={isConfigSaved}
                    APP_BASE_URL={APP_BASE_URL}
                    API_BASE={API_BASE}
                    showEmbed={showEmbed}
                    setShowEmbed={setShowEmbed}
                    calendlyLink={calendlyLink}
                  />
                )}

              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
