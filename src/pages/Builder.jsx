/* FULL FILE BELOW — CLEAN, UPDATED, FIXED */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "../supabaseClient";
import ChatbotPreview from "../components/ChatbotPreview";
import {
  Building2,
  FileText,
  Globe,
  Palette,
  Bot,
  Upload,
  Trash2,
  Wand2,
  Save,
  Eye,
  Code2,
  Copy,
  Lock,
  Calendar,
} from "lucide-react";

export default function Builder() {
  const [activeTab, setActiveTab] = useState("business");
  const [user, setUser] = useState(null);
  const [subscriptionActive, setSubscriptionActive] = useState(false);
  const [plan, setPlan] = useState("free");
  const [chatbotId, setChatbotId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loadingInit, setLoadingInit] = useState(true);
  const [isConfigSaved, setIsConfigSaved] = useState(false);
  const [freeAccess, setFreeAccess] = useState(false);
  const [calendlyLink, setCalendlyLink] = useState("");

  const FREE_ACCESS_EMAIL = "aiaera056@gmail.com";
  const BUCKET = import.meta.env.VITE_SUPABASE_BUCKET || "chatbot-files";

  // NEW CLEAN ENV VARIABLES
  const APP_BASE_URL = import.meta.env.VITE_APP_BASE_URL;  // frontend (iframe)
  const API_BASE = import.meta.env.VITE_API_URL;           // backend API

  const INTEGRATIONS_API = `${API_BASE}/api/integrations`;

  // Business data
  const [businessName, setBusinessName] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [businessWebsite, setBusinessWebsite] = useState("");

  // Files
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const logoInputRef = useRef(null);

  // Theme
  const [logoUrl, setLogoUrl] = useState(null);
  const [themeColors, setThemeColors] = useState({
    background: "#0b0b17",
    userBubble: "#7f5af0",
    botBubble: "#70e1ff",
    text: "#ffffff",
  });

  const [showEmbed, setShowEmbed] = useState(false);

  const presetThemes = {
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
  };

  const aiSuggestions = [
    "We build AI chat assistants that qualify leads, answer FAQs, and book meetings 24/7.",
    "Scale support with multi-channel AI chat — website, WhatsApp, and social, no code needed.",
    "Boost conversions with a smart chatbot tailored to your business.",
  ];

  // ----------------------
  // Init — user + plan
  // ----------------------
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingInit(true);
      try {
        const { data: { user: u } } = await supabase.auth.getUser();

        if (!u || !mounted) return;
        setUser(u);

        if (u.email === FREE_ACCESS_EMAIL) {
          setSubscriptionActive(true);
          setPlan("pro");
          setFreeAccess(true);
        } else {
          const { data: sub } = await supabase
            .from("user_subscriptions")
            .select("plan, expires_at")
            .eq("user_id", u.id)
            .maybeSingle();

          const isActive = sub && new Date(sub.expires_at) > new Date();
          setSubscriptionActive(isActive);
          setPlan(sub?.plan || "free");
        }

        // Load chatbot config
        const { data } = await supabase
          .from("chatbots")
          .select("*")
          .eq("user_id", u.id)
          .maybeSingle();

        if (data) {
          setChatbotId(data.id);
          setBusinessName(data.name || "");
          setBusinessDescription(data.business_info || "");

          const cfg = data.config || {};
          setBusinessEmail(cfg.businessEmail || "");
          setBusinessPhone(cfg.businessPhone || "");
          setBusinessWebsite(cfg.businessWebsite || "");
          setFiles(Array.isArray(cfg.files) ? cfg.files : []);
          setLogoUrl(cfg.logo_url || null);
          if (cfg.themeColors) setThemeColors(cfg.themeColors);

          setIsConfigSaved(true);
        }

        // Calendly from backend
        try {
          const res = await fetch(`${INTEGRATIONS_API}?user_id=${u.id}`);
          const json = await res.json();
          if (json?.success && json?.data?.calendly_link) {
            setCalendlyLink(json.data.calendly_link);
          }
        } catch (err) {
          console.warn("Calendly fetch failed:", err.message);
        }

      } finally {
        if (mounted) setLoadingInit(false);
      }
    })();

    return () => (mounted = false);
  }, []);

  // Upload to Supabase Storage
  const uploadFileToStorage = async (file) => {
    if (!user) throw new Error("No User");
    const path = `${user.id}/${Date.now()}-${file.name}`;

    const { error } = await supabase.storage.from(BUCKET).upload(path, file);
    if (error) throw error;

    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return { name: file.name, url: pub.publicUrl, size: file.size };
  };

  const handleFilesUpload = async (e) => {
    if (plan !== "pro" && !freeAccess) {
      alert("Pro plan required for uploads.");
      return;
    }

    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;

    setUploading(true);
    try {
      const uploaded = [];
      for (const f of selected) uploaded.push(await uploadFileToStorage(f));
      setFiles((prev) => [...uploaded, ...prev]);
    } catch {
      alert("Upload failed.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSuggest = () => {
    const s = aiSuggestions[Math.floor(Math.random() * aiSuggestions.length)];
    setBusinessDescription((prev) => (prev ? `${prev}\n\n${s}` : s));
  };

  // Save to Supabase
  const saveConfigToSupabase = async () => {
    if (!user) return;

    setSaving(true);
    try {
      // Check subscription
      if (!freeAccess) {
        const { data: sub } = await supabase
          .from("user_subscriptions")
          .select("expires_at")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!sub || new Date(sub.expires_at) < new Date()) {
          alert("Subscription expired.");
          setSaving(false);
          return;
        }
      }

      const config = {
        files,
        logo_url: logoUrl,
        themeColors,
        businessEmail,
        businessPhone,
        businessWebsite,
      };

      if (chatbotId) {
        await supabase
          .from("chatbots")
          .update({
            name: businessName,
            business_info: businessDescription,
            config,
          })
          .eq("id", chatbotId)
          .eq("user_id", user.id);
      } else {
        const { data, error } = await supabase
          .from("chatbots")
          .insert([{ user_id: user.id, name: businessName, business_info: businessDescription, config }])
          .select()
          .single();

        if (error) throw error;
        setChatbotId(data.id);
      }

      setIsConfigSaved(true);
      alert("Saved!");
    } catch {
      alert("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  if (loadingInit)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0b17] text-white">
        Initializing...
      </div>
    );

  if (!subscriptionActive && !freeAccess)
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#0b0b17]">
        Your subscription expired.
      </div>
    );

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

          <Button
            onClick={saveConfigToSupabase}
            disabled={saving}
            className="bg-gradient-to-r from-[#7f5af0] via-[#9b8cff] to-[#5be7ff]"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="col-span-12 lg:col-span-9">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <Card className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl p-6 shadow-[0_0_60px_rgba(155,140,255,0.2)]">
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
                  />
                )}

                {activeTab === "files" && plan !== "pro" && !freeAccess ? (
                  <LockedSection message="Files available only in Pro plan." />
                ) : (
                  activeTab === "files" && (
                    <FilesTab
                      files={files}
                      setFiles={setFiles}
                      fileInputRef={fileInputRef}
                      uploading={uploading}
                      handleFilesUpload={handleFilesUpload}
                    />
                  )
                )}

                {activeTab === "website" && (
                  <WebsiteTab
                    businessWebsite={businessWebsite}
                    setBusinessWebsite={setBusinessWebsite}
                  />
                )}

                {activeTab === "studio" && (
                  <StudioTab
                    presetThemes={presetThemes}
                    themeColors={themeColors}
                    setThemeColors={setThemeColors}
                    logoUrl={logoUrl}
                    setLogoUrl={setLogoUrl}
                    logoInputRef={logoInputRef}
                    uploadFileToStorage={uploadFileToStorage}
                    chatbotId={chatbotId}
                    businessName={businessName}
                    files={files}
                    user={user}
                    isConfigSaved={isConfigSaved}
                    APP_BASE_URL={APP_BASE_URL}     // Fixed frontend base
                    API_BASE={API_BASE}             // Backend API
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

/* === SUPPORTING COMPONENTS (UNCHANGED EXCEPT FOR API_BASE & APP_BASE_URL FIXES) === */

function LockedSection({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-gray-400">
      <Lock className="w-8 h-8 mb-3 text-[#bfa7ff]" />
      <p>{message}</p>
    </div>
  );
}

function Sidebar({ activeTab, setActiveTab }) {
  return (
    <div className="col-span-12 lg:col-span-3">
      {[
        { id: "business", icon: <Building2 />, label: "Business" },
        { id: "files", icon: <FileText />, label: "Files" },
        { id: "website", icon: <Globe />, label: "Website" },
        { id: "studio", icon: <Palette />, label: "Studio" },
      ].map((t) => (
        <button
          key={t.id}
          onClick={() => setActiveTab(t.id)}
          className={`w-full flex items-center gap-3 px-4 py-3 mb-3 rounded-2xl transition-all border ${
            activeTab === t.id
              ? "bg-white/[0.14] border-white/20 text-[#e6deff] shadow-[0_8px_30px_rgba(127,90,240,0.25)]"
              : "bg-white/[0.08] border-white/10 text-gray-300 hover:bg-white/[0.12]"
          }`}
        >
          <span className="text-[#bfa7ff]">{t.icon}</span>
          <span className="font-medium">{t.label}</span>
        </button>
      ))}
    </div>
  );
}

/* === BUSINESS TAB === */
function BusinessTab({
  businessName,
  setBusinessName,
  businessDescription,
  setBusinessDescription,
  businessEmail,
  setBusinessEmail,
  businessPhone,
  setBusinessPhone,
  businessWebsite,
  setBusinessWebsite,
  handleSuggest,
}) {
  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold tracking-tight">Business Information</h2>

      <Input
        placeholder="Business Name"
        value={businessName}
        onChange={(e) => setBusinessName(e.target.value)}
        className="bg-black/30 border-0 text-white"
      />

      <Textarea
        placeholder="Describe your business"
        value={businessDescription}
        onChange={(e) => setBusinessDescription(e.target.value)}
        className="bg-black/30 border-0 text-white min-h-[120px]"
      />

      <Button onClick={handleSuggest} className="bg-white/10 hover:bg-white/20">
        <Wand2 className="w-4 h-4 mr-2" /> Suggest Better Copy
      </Button>

      <Input
        placeholder="Business Email"
        value={businessEmail}
        onChange={(e) => setBusinessEmail(e.target.value)}
        className="bg-black/30 border-0 text-white"
      />

      <Input
        placeholder="Phone"
        value={businessPhone}
        onChange={(e) => setBusinessPhone(e.target.value)}
        className="bg-black/30 border-0 text-white"
      />

      <Input
        placeholder="Website URL"
        value={businessWebsite}
        onChange={(e) => setBusinessWebsite(e.target.value)}
        className="bg-black/30 border-0 text-white"
      />
    </div>
  );
}

/* === FILES TAB === */
function FilesTab({ files, setFiles, fileInputRef, uploading, handleFilesUpload }) {
  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold tracking-tight">Files</h2>

      <div className="flex items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.csv,.txt,.md"
          onChange={handleFilesUpload}
          className="hidden"
        />
        <Button onClick={() => fileInputRef.current?.click()}>
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? "Uploading..." : "Upload Files"}
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {files.map((f) => (
          <div key={f.url} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl px-3 py-2">
            <div className="truncate text-sm">{f.name}</div>
            <Button
              variant="ghost"
              className="text-red-300 hover:text-red-200"
              onClick={() => setFiles((prev) => prev.filter((x) => x.url !== f.url))}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
        {!files.length && <p className="text-gray-400 text-sm">No files uploaded.</p>}
      </div>
    </div>
  );
}

/* === WEBSITE TAB === */
function WebsiteTab({ businessWebsite, setBusinessWebsite }) {
  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold tracking-tight">Website Integration</h2>
      <Input
        placeholder="https://your-website.com"
        value={businessWebsite}
        onChange={(e) => setBusinessWebsite(e.target.value)}
        className="bg-black/30 border-0 text-white"
      />
      <p className="text-xs text-gray-400">
        Website integration allows your chatbot to capture leads and chat directly on your site.
      </p>
    </div>
  );
}

/* === STUDIO TAB === */
function StudioTab({
  presetThemes,
  themeColors,
  setThemeColors,
  logoUrl,
  setLogoUrl,
  logoInputRef,
  uploadFileToStorage,
  chatbotId,
  businessName,
  files,
  user,
  isConfigSaved,
  APP_BASE_URL,
  API_BASE,
  showEmbed,
  setShowEmbed,
  calendlyLink,
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
        <Palette className="w-5 h-5 text-[#cbb8ff]" /> Studio — Design & Live Preview
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* DESIGN */}
        <Card className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-2xl shadow-[0_0_40px_rgba(127,90,240,0.25)]">
          <div className="flex flex-wrap gap-3 mb-4">
            {Object.entries(presetThemes).map(([k, v]) => (
              <Button key={k} onClick={() => setThemeColors(v)} className="bg-white/10 hover:bg-white/20 capitalize">
                {k}
              </Button>
            ))}
          </div>

          {/* Color Pickers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Background", field: "background" },
              { label: "User", field: "userBubble" },
              { label: "Bot", field: "botBubble" },
              { label: "Text", field: "text" },
            ].map(({ label, field }) => (
              <ColorSwatch
                key={field}
                label={label}
                value={themeColors[field]}
                onChange={(v) => setThemeColors((p) => ({ ...p, [field]: v }))}
              />
            ))}
          </div>

          {/* Logo Upload */}
          <div className="flex items-center gap-3 mt-5">
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                try {
                  const { url } = await uploadFileToStorage(f);
                  setLogoUrl(url);
                } catch {
                  alert("Logo upload failed.");
                } finally {
                  if (logoInputRef.current) logoInputRef.current.value = "";
                }
              }}
            />
            <Button onClick={() => logoInputRef.current?.click()}>Upload Logo</Button>
            {logoUrl && <img src={logoUrl} alt="logo" className="w-10 h-10 rounded-lg border border-white/10" />}
          </div>
        </Card>

        {/* PREVIEW */}
        <Card className="bg-white/10 border border-white/10 rounded-3xl p-5 backdrop-blur-2xl">
          <h3 className="font-semibold mb-3 text-white flex items-center gap-2">
            <Bot className="w-5 h-5" /> Live Chatbot Preview
          </h3>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-inner">
            <ChatbotPreview
              chatbotConfig={{
                id: chatbotId,
                name: businessName,
                files,
                logoUrl,
                themeColors,
                calendlyLink,
              }}
              user={user}
            />
          </div>

          {/* Embed Button */}
          {isConfigSaved && chatbotId && (
            <div className="mt-4 space-y-3">
              <Button
                onClick={() => setShowEmbed((s) => !s)}
                className="w-full bg-gradient-to-r from-[#7f5af0] via-[#9b8cff] to-[#5be7ff]"
              >
                {showEmbed ? "Hide Embed Code" : "Get Embed Code"}
              </Button>

              {calendlyLink && (
                <Button
                  onClick={() => window.open(calendlyLink, "_blank")}
                  className="w-full bg-gradient-to-r from-[#00eaff] via-[#7f5af0] to-[#bfa7ff]"
                >
                  <Calendar className="w-4 h-4 mr-2" /> Book a Meeting
                </Button>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* EMBED DRAWER */}
      <AnimatePresence>
        {showEmbed && isConfigSaved && chatbotId && (
          <motion.div
            key="embed"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.35 }}
          >
            <Card className="bg-white/6 border border-white/10 rounded-3xl p-5 backdrop-blur-2xl">

              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Code2 className="w-4 h-4" /> Embed Code
                </h4>

                {/* FIXED PREVIEW LINK */}
                <a
                  href={`${APP_BASE_URL}/public-chatbot/${chatbotId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-[#bfa7ff] hover:underline flex items-center gap-1"
                >
                  <Eye className="w-4 h-4" /> Preview
                </a>
              </div>

              {/* FIXED IFRAME EMBED CODE */}
              <textarea
                readOnly
                className="w-full h-28 bg-black/30 text-white/90 p-3 rounded-xl font-mono text-sm border border-white/10"
                value={`<iframe src="${APP_BASE_URL}/public-chatbot/${chatbotId}" width="400" height="500" style="border:none; border-radius:16px;"></iframe>`}
              />

              <div className="flex justify-between items-center mt-3 flex-wrap gap-3">

                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `<iframe src="${APP_BASE_URL}/public-chatbot/${chatbotId}" width="400" height="500" style="border:none; border-radius:16px;"></iframe>`
                    );
                    alert("Copied!");
                  }}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#9b8cff] to-[#bfa7ff]"
                >
                  <Copy className="w-4 h-4" /> Copy
                </Button>

                <Button
                  onClick={() => setShowEmbed(false)}
                  variant="ghost"
                  className="bg-white/10 hover:bg-white/20"
                >
                  Close
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* === Color Swatch === */
function ColorSwatch({ label, value, onChange }) {
  const inputRef = useRef(null);
  return (
    <div className="flex flex-col items-center">
      <span className="text-xs text-gray-400 mb-1">{label}</span>
      <div
        className="w-[25px] h-[25px] rounded-md border border-white/20 cursor-pointer shadow-md"
        onClick={() => inputRef.current?.click()}
        style={{ backgroundColor: value }}
      />
      <input
        type="color"
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="hidden"
      />
    </div>
  );
}

/* === Aurora Layer === */
function AuroraLayer() {
  return (
    <motion.div
      animate={{ opacity: [0.35, 0.6, 0.35], scale: [1, 1.06, 1] }}
      transition={{ repeat: Infinity, duration: 16 }}
      className="pointer-events-none absolute -top-52 -left-48 w-[620px] h-[620px] rounded-full blur-[140px]"
      style={{
        background:
          "radial-gradient(circle at 30% 30%, rgba(191,167,255,0.25), rgba(127,90,240,0.18), rgba(0,234,255,0.14))",
      }}
    />
  );
}

