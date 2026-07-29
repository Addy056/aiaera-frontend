import {
  Save,
  Send,
  Copy,
  Check,
  Loader2,
  Sparkles,
  Settings2,
  FileText,
  Palette,
  Rocket,
  BrainCircuit,
  Upload,
  Info,
} from "lucide-react";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";

import { supabase } from "../lib/supabase";

import {
  useAuth,
} from "../hooks/useAuth";

import {
  useBuilder,
} from "../hooks/useBuilder";

import {
  saveIntegrations,
} from "../api/integrationsApi";

import { uploadAPI } from "../lib/api";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const MAX_LOGO_SIZE = 5 * 1024 * 1024;
const DEFAULT_THEME = {
  botName: "AI Assistant",
  chatBg: "#F8FAFC",
  botBubble: "#FFFFFF",
  userBubble: "#7C3AED",
  textColor: "#0F172A",
  logo: "",
};

const normalizeTheme = (chatbot) => ({
  ...DEFAULT_THEME,
  ...(chatbot?.theme && typeof chatbot.theme === "object" ? chatbot.theme : {}),
  botName: chatbot?.bot_name || chatbot?.theme?.botName || DEFAULT_THEME.botName,
});

export default function Builder() {

  const { user } =
    useAuth();

  const messagesEndRef =
    useRef(null);

  const {

    selectedChatbot,

    integrations,

    loading,

    saving,

    handleSaveChatbot,

  } = useBuilder(
    user?.id
  );

  const [sending, setSending] =
    useState(false);

  const [copied, setCopied] =
    useState(false);

  const [chatbotId, setChatbotId] =
    useState(null);

  const [activeTab, setActiveTab] =
    useState("basic");

  const previewMode = "desktop";

  const [businessInfo, setBusinessInfo] =
    useState("");

  const [website, setWebsite] =
    useState("");

  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [toast, setToast] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [trainingFiles, setTrainingFiles] = useState([]);

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

  useEffect(() => {

    if (!selectedChatbot) {
      setChatbotId(null);
      setBusinessInfo("");
      setWebsite("");
      setTheme(DEFAULT_THEME);
      return;
    }
   setChatbotId(selectedChatbot.id);
    setBusinessInfo(
      selectedChatbot.business_info ||
        ""
    );

    setWebsite(
      selectedChatbot.website_url ||
        ""
    );

    setTheme(normalizeTheme(selectedChatbot));

  }, [selectedChatbot]);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  const loadTrainingFiles = useCallback(async (id) => {
    if (!id) {
      setTrainingFiles([]);
      return;
    }

    const { data, error } = await supabase
      .from("chatbot_files")
      .select("id, file_name, created_at")
      .eq("chatbot_id", id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("TRAINING LIST ERROR:", error);
      showToast("Unable to load training files.", "error");
      return;
    }

    setTrainingFiles(Array.isArray(data) ? data : []);
  }, [showToast]);

  useEffect(() => {
    loadTrainingFiles(chatbotId);
  }, [chatbotId, loadTrainingFiles]);

  const ensureChatbot = async () => {
    if (!user?.id) {
      throw new Error("User is not authenticated");
    }

    const existingId = chatbotId || selectedChatbot?.id;
    const payload = {
      ...(existingId ? { id: existingId } : {}),
      business_info: businessInfo || "",
      website_url: website || "",
      bot_name: theme.botName || DEFAULT_THEME.botName,
      theme: { ...DEFAULT_THEME, ...theme },
      status: "active",
    };

    const chatbot = await handleSaveChatbot(payload);
    if (!chatbot?.id) {
      throw new Error("Chatbot could not be saved");
    }

    setChatbotId(chatbot.id);
    return chatbot.id;
  };

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages]);

  

  const saveChanges = async () => {
    if (saving) return;

    try {
      await ensureChatbot();

      const { error: integrationsError } = await saveIntegrations({
        ...(integrations || {}),
        user_id: user.id,
      });

      if (integrationsError) throw integrationsError;
      showToast("Changes saved successfully.");

    } catch (err) {
      console.error("SAVE BUILDER ERROR:", err);
      showToast(err?.message || "Unable to save changes.", "error");
    }
  };

  const uploadLogo = async (e) => {

    try {

      const file =
        e.target.files?.[0];

      if (!file || uploading) return;

      if (!file.type.startsWith("image/")) {
        showToast("Please upload an image file.", "error");
        return;
      }

      if (file.size > MAX_LOGO_SIZE) {
        showToast("Logo must be smaller than 5 MB.", "error");
        return;
      }

      setUploading(true);
      const activeChatbotId = await ensureChatbot();

      const fileExt =
        file.name
          .split(".")
          .pop();

      const fileName =
        `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}.${fileExt}`;

      const filePath =
        `${user?.id}/${fileName}`;

      const {
        error: uploadError,
      } = await supabase.storage
        .from("chatbot-files")
        .upload(
          filePath,
          file,
          {
            cacheControl:
              "0",

            upsert: true,
          }
        );

      if (uploadError) {

        console.error(
          uploadError
        );

        showToast("Logo upload failed.", "error");
        return;
      }

      const {
        data: publicData,
      } = supabase.storage
        .from("chatbot-files")
        .getPublicUrl(
          filePath
        );

      if (!publicData?.publicUrl) {
        throw new Error("Logo URL was not generated");
      }

      const logoUrl =
        `${publicData.publicUrl}?t=${Date.now()}`;

      const updatedTheme = {
        ...theme,
        logo: logoUrl,
      };

      setTheme(
        updatedTheme
      );

      const { error: themeError } = await supabase
        .from("chatbots")
        .update({
          theme: updatedTheme,
          bot_name: updatedTheme.botName,
        })
        .eq("id", activeChatbotId);

      if (themeError) throw themeError;
      showToast("Logo uploaded successfully.");

    } catch (err) {
      console.error("LOGO UPLOAD ERROR:", err);
      showToast(err?.message || "Something went wrong while uploading the logo.", "error");
    } finally {
      setUploading(false);
    }
  };

  const sendMessage = async () => {

    if (
      !input.trim() ||
      sending
    ) return;

    const userMessage =
      input;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userMessage,
      },
    ]);

    setInput("");

    const lowerMessage =
      userMessage.toLowerCase();

    if (
      (
        lowerMessage.includes("book") ||
        lowerMessage.includes("appointment") ||
        lowerMessage.includes("meeting") ||
        lowerMessage.includes("schedule")
      ) &&
      integrations?.meeting_link
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

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text:
            `📅 Book your appointment using ${providerName}:\n${integrations.meeting_link}`,
        },
      ]);

      return;
    }

    if (
      (
        lowerMessage.includes("office") ||
        lowerMessage.includes("location") ||
        lowerMessage.includes("address") ||
        lowerMessage.includes("visit")
      ) &&
      integrations?.maps_link
    ) {

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text:
            `📍 Visit our office:\n${integrations.maps_link}`,
        },
      ]);

      return;
    }

    try {

      setSending(true);
      const activeChatbotId = await ensureChatbot();

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      const accessToken = sessionData.session?.access_token;
      if (!accessToken) throw new Error("User is not authenticated");

      const response = await fetch(
          `${API_URL}/api/chatbot/chat`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
              Authorization: `Bearer ${accessToken}`,
            },

            body: JSON.stringify({
              message:
                userMessage,

              chatbot_id:
                activeChatbotId,

              session_id:
                user.id,
            }),
          }
        );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || data?.message || "Chat request failed");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text:
            data.reply ||
            data.message ||
            "No response received",
        },
      ]);

    } catch (err) {

      console.error(err);
      showToast(err?.message || "Chat preview request failed.", "error");

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text:
            "Something went wrong.",
        },
      ]);

    } finally {

      setSending(false);

    }
  };

  const copyEmbed = async () => {
  try {
    const activeChatbotId = await ensureChatbot();
    const code =
`<script src="${API_URL}/api/embed/${activeChatbotId}.js"></script>`;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    showToast("Embed code copied.");
    setTimeout(() => setCopied(false), 2000);
  } catch (err) {
    console.error("COPY EMBED ERROR:", err);
    showToast("Unable to copy embed code.", "error");
  }

};

  const uploadTrainingFiles = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";

    if (!files.length) return;
    setUploading(true);
    let activeChatbotId;
    try {
      activeChatbotId = await ensureChatbot();
    } catch (err) {
      console.error("TRAINING CHATBOT CREATION ERROR:", err);
      setUploading(false);
      showToast(err?.message || "Unable to prepare the chatbot.", "error");
      return;
    }

    const uploaded = [];
    const failed = [];

    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("chatbot_id", activeChatbotId);
        await uploadAPI.trainingFile(formData);
        uploaded.push(file.name);
      } catch (err) {
        console.error(`TRAINING UPLOAD ERROR (${file.name}):`, err);
        failed.push(file.name);
      }
    }

    await loadTrainingFiles(activeChatbotId);
    setUploading(false);

    if (failed.length) {
      showToast(`${uploaded.length} uploaded; failed: ${failed.join(", ")}`, "error");
    } else {
      showToast(`${uploaded.length} training file${uploaded.length === 1 ? "" : "s"} uploaded.`);
    }
  };

  const previewSurfaceBg =
    theme.chatBg &&
    theme.chatBg !== "#081120"
      ? theme.chatBg
      : "#f8fafc";

  const previewSeedMessages = [
    {
      role: "bot",
      text: `Hi, I’m ${theme.botName}. ${businessInfo ? `I help with ${businessInfo}` : "I can help with questions, bookings, and support."}`,
    },
    {
      role: "bot",
      text: website
        ? `You can visit ${website} or ask me about our services.`
        : "I can also help with appointments, directions, and product questions.",
    },
    {
      role: "bot",
      text: integrations?.meeting_link
        ? "Need to book a time? I can share the right link instantly."
        : "If you need help getting started, I’m here for you.",
    },
  ];

  const displayMessages =
    messages.length <= 1
      ? [...previewSeedMessages, ...messages.slice(1)]
      : messages;

  if (loading) {

    return (
      <div className="h-[80vh] flex items-center justify-center">

        <Loader2
          className="animate-spin text-purple-500"
          size={35}
        />

      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-90px)] overflow-hidden text-slate-900">
      {toast && (
        <div className={`mb-4 rounded-xl border px-4 py-3 text-sm ${toast.type === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`} role="status">
          {toast.message}
        </div>
      )}
      <div className="mb-4 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
            <Sparkles size={10} className="text-violet-600" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">AI chatbot builder</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Builder</h1>
        </div>

        <button onClick={saveChanges} disabled={saving} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60">
          {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          Save
        </button>
      </div>

      <div className="
grid
gap-6
items-start
xl:grid-cols-[220px_minmax(420px,520px)_minmax(500px,620px)]
">
        <div className="flex h-full flex-col gap-2 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <MenuItem active={activeTab === "basic"} icon={<Settings2 size={16} />} title="Basic" desc="Bot info" onClick={() => setActiveTab("basic")} />
          <MenuItem active={activeTab === "training"} icon={<FileText size={16} />} title="Training" desc="Train AI" onClick={() => setActiveTab("training")} />
          <MenuItem active={activeTab === "appearance"} icon={<Palette size={16} />} title="Appearance" desc="Customize" onClick={() => setActiveTab("appearance")} />
          <MenuItem active={activeTab === "deploy"} icon={<Rocket size={16} />} title="Deploy" desc="Publish" onClick={() => setActiveTab("deploy")} />

          <div className="mt-auto rounded-2xl border border-violet-200 bg-violet-50 p-4 text-sm leading-relaxed text-slate-700">
            <div className="mb-3 flex items-center gap-2">
              <Info size={16} className="text-violet-600" />
              <p className="font-semibold text-slate-900">Quick guide</p>
            </div>
            <div className="space-y-2 text-xs text-slate-600">
              <p>✅ Add business details</p>
              <p>✅ Upload PDFs & CSVs</p>
              <p>✅ Customize chatbot</p>
              <p>✅ Save and deploy</p>
            </div>
          </div>
        </div>

        <div className="h-full overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          {activeTab === "basic" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Basic setup</h2>
                <p className="mt-1 text-sm text-slate-600">Configure your chatbot identity and business details.</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  {theme.logo ? <img src={theme.logo} alt="logo" onError={(e) => { e.target.style.display = "none"; }} className="h-full w-full object-cover" /> : <span className="text-xs text-slate-500">Logo</span>}
                </div>

                <label className="flex h-11 flex-1 cursor-pointer items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                  Upload business logo
                  <input type="file" hidden accept="image/*" onChange={uploadLogo} />
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Chatbot name</label>
                <input type="text" placeholder="AI Assistant" value={theme.botName} onChange={(e) => setTheme({ ...theme, botName: e.target.value })} className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-violet-400" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Business description</label>
                <textarea placeholder="Describe your business..." value={businessInfo} onChange={(e) => setBusinessInfo(e.target.value)} className="h-32 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 outline-none transition focus:border-violet-400" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Website URL</label>
                <input type="text" placeholder="https://website.com" value={website} onChange={(e) => setWebsite(e.target.value)} className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-violet-400" />
              </div>
            </div>
          )}

          {activeTab === "training" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Training data</h2>
                <p className="mt-1 text-sm text-slate-600">Upload PDFs or CSV files to train your AI assistant.</p>
              </div>

              <label className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-violet-200 bg-violet-50 transition hover:bg-violet-100">
                <Upload size={24} className="mb-3 text-violet-600" />
                <p className="text-sm font-medium text-slate-900">Upload PDF or CSV</p>
                <p className="mt-1 text-xs text-slate-600">Click here to upload training files</p>
                <input type="file" hidden multiple accept=".pdf,.csv" onChange={uploadTrainingFiles} />
              </label>

              {uploading && <p className="text-xs text-violet-600">Uploading training files…</p>}
              {trainingFiles.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="mb-2 text-sm font-semibold text-slate-900">Uploaded files</h3>
                  <div className="space-y-1 text-xs text-slate-600">
                    {trainingFiles.map((file) => <p key={file.id}>{file.file_name}</p>)}
                  </div>
                </div>
              )}

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="mb-2 text-sm font-semibold text-slate-900">Tips for better AI responses</h3>
                <div className="space-y-2 text-xs text-slate-600">
                  <p>• Upload FAQs and product/service details</p>
                  <p>• Add pricing sheets or brochures</p>
                  <p>• Keep documents clean and readable</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Appearance</h2>
                <p className="mt-1 text-sm text-slate-600">Customize the chatbot look and feel.</p>
              </div>

              <ColorField label="Chat background" value={theme.chatBg} onChange={(value) => setTheme({ ...theme, chatBg: value })} />
              <ColorField label="Bot message bubble" value={theme.botBubble} onChange={(value) => setTheme({ ...theme, botBubble: value })} />
              <ColorField label="User message bubble" value={theme.userBubble} onChange={(value) => setTheme({ ...theme, userBubble: value })} />
              <ColorField label="Text color" value={theme.textColor} onChange={(value) => setTheme({ ...theme, textColor: value })} />
            </div>
          )}

          {activeTab === "deploy" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Deploy chatbot</h2>
                <p className="mt-1 text-sm text-slate-600">Copy and paste this code into your website.</p>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <code className="break-all whitespace-pre-wrap text-xs text-slate-700">{`<script src="${API_URL}/api/embed/${chatbotId}.js"></script>`}</code>
              </div>

              <button onClick={copyEmbed} disabled={saving} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60">
                {copied ? <><Check size={15} /> Copied</> : <><Copy size={15} /> Copy embed code</>}
              </button>
            </div>
          )}
        </div>

        <div className="flex h-full w-full items-center justify-center">
          <div className={`flex h-full w-full flex-col overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_24px_80px_-28px_rgba(15,23,42,0.28)] ${previewMode === "mobile" ? "max-w-[340px]" : "max-w-[560px]"}`}>
            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  {theme.logo ? <img src={theme.logo} alt="logo" onError={(e) => { e.target.style.display = "none"; }} className="h-full w-full object-cover" /> : <span className="text-[11px] font-semibold text-slate-500">Logo</span>}
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-900">{theme.botName}</h2>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    Online now
                  </div>
                </div>
              </div>
             <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
  <span className="text-sm font-medium text-slate-600">
    Live Preview
  </span>
</div>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2 border-b border-slate-200 bg-slate-50/70 p-3">
              <button onClick={() => { setMessages((prev) => [...prev, { role: "user", text: "Book Appointment" }, { role: "bot", text: integrations?.meeting_link ? `📅 Book your appointment here:\n${integrations.meeting_link}` : "Booking link not configured yet." }]); }} className="rounded-full border border-violet-200 bg-white px-3 py-2 text-[11px] font-medium text-violet-700 shadow-sm transition hover:border-violet-300 hover:bg-violet-50">📅 Book appointment</button>
              <button onClick={() => { setMessages((prev) => [...prev, { role: "user", text: "Visit Office" }, { role: "bot", text: integrations?.maps_link ? `📍 Visit our office:\n${integrations.maps_link}` : "Office location not configured yet." }]); }} className="rounded-full border border-violet-200 bg-white px-3 py-2 text-[11px] font-medium text-violet-700 shadow-sm transition hover:border-violet-300 hover:bg-violet-50">📍 Visit office</button>
              <button onClick={() => { setMessages((prev) => [...prev, { role: "user", text: "Tell me more" }, { role: "bot", text: businessInfo ? `I can help explain our services: ${businessInfo}` : "I can help explain our services in more detail." }]); }} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-[11px] font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-100">💬 Ask about services</button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto p-4" style={{ background: previewSurfaceBg }}>
              <div className="space-y-3">
                {displayMessages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[88%] whitespace-pre-wrap break-words rounded-[20px] px-4 py-3 text-sm leading-6 shadow-sm ${msg.role === "user" ? "border border-violet-100" : "border border-slate-200 bg-white"}`} style={{
  background:
    msg.role === "user"
      ? theme.userBubble
      : theme.botBubble,

  color:
    msg.role === "user"
      ? (
          theme.userBubble === "#ffffff" ||
          theme.userBubble.toLowerCase() === "#fff"
            ? "#0f172a"
            : "#ffffff"
        )
      : theme.textColor,
}}>
                      {msg.text.split("\n").map((line, lineIndex) => {
                        const urlMatch = line.match(/(https?:\/\/[^\s]+)/);
                        if (urlMatch) {
                          const url = urlMatch[0];
                          const text = line.replace(url, "");
                          return (
                            <div key={lineIndex} className="space-y-2">
                              {text && <div>{text}</div>}
                              <a href={url} target="_blank" rel="noopener noreferrer" className="block break-all text-violet-600 underline transition hover:text-violet-700">{url}</a>
                            </div>
                          );
                        }
                        return <div key={lineIndex}>{line}</div>;
                      })}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef}></div>
              </div>
            </div>

            <div className="shrink-0 border-t border-slate-200 bg-white p-3">
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-2 py-2 shadow-sm">
                <input type="text" placeholder="Type your message..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { sendMessage(); } }} className="h-11 flex-1 rounded-xl border-none bg-transparent px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400" />
                <button onClick={sendMessage} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white shadow-sm transition hover:bg-violet-700" style={{ backgroundColor: theme.userBubble }}>
                  {sending ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MenuItem({ icon, title, desc, active, onClick }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all ${active ? "bg-violet-600 text-white shadow-sm" : "bg-slate-50 text-slate-700 hover:bg-slate-100"}`}>
      {icon}
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-[11px] opacity-80">{desc}</p>
      </div>
    </button>
  );
}

function ColorField({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div>
        <p className="text-sm font-medium text-slate-700">{label}</p>
      </div>
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="h-12 w-12 cursor-pointer rounded-xl border-none bg-transparent" />
    </div>
  );
}
