import {
  Sparkles,
  Save,
  Globe,
  Palette,
  Code2,
  Send,
  Bot,
  Crown,
  Check,
  Copy,
  Wand2,
  Upload,
  FileText,
  Trash2,
  Loader2,
  Rocket,
  BrainCircuit,
  RefreshCw,
} from "lucide-react";

import { useState, useEffect, useContext, useRef } from "react";
import { supabase } from "../lib/supabase";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function Builder() {
  const initializedRef = useRef(false);
  
  const { user, loading: authLoading } = useContext(AuthContext);

  const navigate = useNavigate();

  const messagesEndRef = useRef(null);

  const [chatbotId, setChatbotId] = useState(null);

  const [businessInfo, setBusinessInfo] = useState("");

  const [website, setWebsite] = useState("");

  const [files, setFiles] = useState([]);

  const [uploading, setUploading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [loading, setLoading] = useState(true);

  const [copied, setCopied] = useState(false);

  const [sending, setSending] = useState(false);

  const [isSubscribed, setIsSubscribed] = useState(true);

  const [theme, setTheme] = useState({
    botName: "AI Assistant",
    chatBg: "#111827",
    botBubble: "#1F2937",
    userBubble: "#7f5af0",
    textColor: "#ffffff",
    radius: "lg",
  });

  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi 👋 I'm your AI assistant. How can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");

  // =========================================
  // INIT
  // =========================================
  useEffect(() => {
   if (!user || initializedRef.current) return;

initializedRef.current = true;

initialize();
  }, [user]);

  // =========================================
  // AUTO SCROLL
  // =========================================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // =========================================
  // INITIALIZE
  // =========================================
const initialize = async () => {

  try {

    setLoading(true);

    // 🔥 SUBSCRIPTION
    const { data: sub } = await supabase
      .from("user_subscriptions")
      .select("expires_at")
      .eq("user_id", user.id)
      .maybeSingle();

    if (
      sub?.expires_at &&
      new Date(sub.expires_at) < new Date()
    ) {
      setIsSubscribed(false);
    }

    // 🔥 FETCH EXISTING CHATBOT
    let { data: chatbot, error } = await supabase
  .from("chatbots")
  .select("*")
  .eq("user_id", user.id)
  .order("created_at", { ascending: false })
  .limit(1)
  .single();

    if (error) {
      console.error("Fetch chatbot error:", error);
    }

    // 🔥 CREATE NEW CHATBOT IF NONE
   if (!chatbot || error) {

      const defaultTheme = {
        botName: "AI Assistant",
        chatBg: "#111827",
        botBubble: "#1F2937",
        userBubble: "#7f5af0",
        textColor: "#ffffff",
        radius: "lg",
      };
      
      const { data: newBot, error: createError } 
      = await supabase
        .from("chatbots")
        .insert([
          {
            user_id: user.id,
            business_info: "",
            description: "",
            website_url: "",
            bot_name: "AI Assistant",
            theme: defaultTheme,
          },
        ])
        
        .select()
        .single();
        console.log("NEW BOT:", newBot);
        console.log("CREATE ERROR:", createError);
      if (createError) {
        console.error("Create chatbot error:", createError);
        return;
      }

      chatbot = newBot;
    }

    // 🔥 SET CHATBOT DATA
    setChatbotId(chatbot.id);

    setBusinessInfo(
      chatbot.business_info ||
      chatbot.description ||
      ""
    );

    setWebsite(chatbot.website_url || "");

    if (chatbot.theme) {
      setTheme(chatbot.theme);
    }

    // 🔥 FETCH FILES
    const { data: fileData, error: fileError } = await supabase
      .from("chatbot_files")
      .select("*")
      .eq("chatbot_id", chatbot.id)
      .order("created_at", {
        ascending: false,
      });

    if (fileError) {
      console.error(fileError);
    }

    setFiles(fileData || []);

  } catch (err) {

    console.error("Builder Init Error:", err);

  } finally {

    setLoading(false);

  }
};

  // =========================================
  // SAVE CONFIG
  // =========================================
  const saveConfig = async () => {

    try {

      setSaving(true);

      await supabase
        .from("chatbots")
       .update({
       business_info: businessInfo,
       description: businessInfo,
       website_url: website,
       bot_name: theme.botName,
       theme,
})
        .eq("id", chatbotId);

    } catch (err) {
      console.error(err);
      alert("Failed to save chatbot");
    } finally {
      setSaving(false);
    }
  };

  // =========================================
  // FILE UPLOAD
  // =========================================
  const uploadFiles = async (e) => {

    const selectedFiles = Array.from(e.target.files);

    if (!selectedFiles.length) return;

    try {

      setUploading(true);

      for (const file of selectedFiles) {

        const filePath = `${user.id}/${Date.now()}-${file.name}`;

        // STORAGE UPLOAD
        const { error: uploadError } = await supabase.storage
          .from("chatbot-files")
          .upload(filePath, file);

        if (uploadError) {
          console.error(uploadError);
          continue;
        }

        // PUBLIC URL
        const {
          data: { publicUrl },
        } = supabase.storage
          .from("chatbot-files")
          .getPublicUrl(filePath);

        // SAVE DB
        const { data: savedFile } = await supabase
          .from("chatbot_files")
          .insert([
            {
              chatbot_id: chatbotId,
              user_id: user.id,
              file_name: file.name,
              file_url: publicUrl,
              file_type: file.type,
            },
          ])
          .select()
          .single();

        setFiles((prev) => [savedFile, ...prev]);
      }

    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  // =========================================
  // DELETE FILE
  // =========================================
  const deleteFile = async (id) => {

    try {

      await supabase
        .from("chatbot_files")
        .delete()
        .eq("id", id);

      setFiles((prev) =>
        prev.filter((f) => f.id !== id)
      );

    } catch (err) {
      console.error(err);
    }
  };

  // =========================================
  // SEND MESSAGE
  // =========================================
  const sendMessage = async () => {

  if (
    !input.trim() ||
    sending ||
    !chatbotId
  ) {
    return;
  }

  console.log("Chatbot ID:", chatbotId);

  const userMessage = input;

  setMessages((prev) => [
    ...prev,
    {
      role: "user",
      text: userMessage,
    },
  ]);

  setInput("");

  try {

    setSending(true);

    const sessionId =
      localStorage.getItem("session_id")
      || crypto.randomUUID();

    localStorage.setItem(
      "session_id",
      sessionId
    );

    const res = await fetch(
      `${API_URL}/api/chatbot/chat`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          message: userMessage,
          chatbot_id: chatbotId,
          session_id: sessionId,
        }),
      }
    );

    const data = await res.json();

    console.log("CHAT RESPONSE:", data);

    if (!res.ok) {
      throw new Error(
        data.error || "Chat failed"
      );
    }

    setMessages((prev) => [
      ...prev,
      {
        role: "bot",
        text:
          data.reply ||
          "No response received",
      },
    ]);

  } catch (err) {

    console.error("Chat Error:", err);

    setMessages((prev) => [
      ...prev,
      {
        role: "bot",
        text:
          err.message ||
          "Server error occurred",
      },
    ]);

  } finally {

    setSending(false);

  }
};

  // =========================================
  // COPY EMBED
  // =========================================
  const copyEmbed = async () => {

    const code = `<script src="${API_URL}/api/embed/${chatbotId}.js"></script>`;

    await navigator.clipboard.writeText(code);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  // =========================================
  // LOADING
  // =========================================
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">

        <div className="flex flex-col items-center">

          <Loader2 className="animate-spin text-purple-500 mb-5" size={45} />

          <p className="text-gray-400">
            Loading Builder...
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="text-white min-h-screen relative">

      {/* BG */}
      <div className="fixed top-[-150px] left-[-150px] w-[350px] h-[350px] bg-purple-600/20 blur-[160px] rounded-full pointer-events-none"></div>

      <div className="fixed bottom-[-150px] right-[-150px] w-[350px] h-[350px] bg-blue-600/20 blur-[160px] rounded-full pointer-events-none"></div>

      {/* HEADER */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-10">

        <div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-5">

            <Wand2 className="w-4 h-4 text-purple-400" />

            <span className="text-sm text-gray-300">
              AI Chatbot Builder
            </span>

          </div>

          <h1 className="text-5xl font-black mb-3">
            Build Your AI Assistant
          </h1>

          <p className="text-gray-400 text-lg">
            Train, customize, and deploy your chatbot.
          </p>

        </div>

        <button
          onClick={saveConfig}
          disabled={saving}
          className="h-[58px] px-8 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-[1.03] transition-all duration-300 shadow-lg shadow-purple-500/20 flex items-center gap-3 font-semibold"
        >

          {saving ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <Save size={20} />
          )}

          {saving ? "Saving..." : "Save Changes"}

        </button>

      </div>

      {/* WARNING */}
      {!isSubscribed && (

        <div className="mb-8 p-6 rounded-[28px] border border-red-500/20 bg-red-500/10 backdrop-blur-2xl flex items-center justify-between gap-5">

          <div className="flex items-center gap-5">

            <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center">
              <Crown className="text-red-400" />
            </div>

            <div>

              <h3 className="text-2xl font-bold mb-2">
                Subscription Expired
              </h3>

              <p className="text-red-200/80">
                Renew your plan to continue using premium features.
              </p>

            </div>

          </div>

          <button
            onClick={() => navigate("/app/pricing")}
            className="px-7 py-4 rounded-2xl bg-red-500 hover:bg-red-600 transition-all font-semibold"
          >
            Upgrade
          </button>

        </div>

      )}

      {/* GRID */}
      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-8">

        {/* LEFT */}
        <div className="space-y-8">

          {/* BUSINESS */}
          <Card
            icon={<Globe />}
            title="Business Knowledge"
            subtitle="Train chatbot using your business data"
          >

            <textarea
              placeholder="Describe your business, services, pricing, FAQs..."
              className="w-full h-44 rounded-3xl bg-white/5 border border-white/10 p-5 text-white placeholder-gray-500 outline-none focus:border-purple-500 resize-none"
              value={businessInfo}
              onChange={(e) =>
                setBusinessInfo(e.target.value)
              }
            />

            <input
              type="text"
              placeholder="https://yourwebsite.com"
              value={website}
              onChange={(e) =>
                setWebsite(e.target.value)
              }
              className="w-full mt-5 h-14 rounded-2xl bg-white/5 border border-white/10 px-5 text-white placeholder-gray-500 outline-none focus:border-purple-500"
            />

          </Card>

          {/* FILES */}
          <Card
            icon={<Upload />}
            title="Training Files"
            subtitle="Upload PDF or CSV files"
          >

            <label className="w-full h-40 rounded-3xl border-2 border-dashed border-white/10 bg-white/5 hover:bg-white/10 transition-all flex flex-col items-center justify-center cursor-pointer">

              <Upload className="mb-4 text-purple-400" size={40} />

              <h3 className="font-semibold mb-2">
                Upload Training Files
              </h3>

              <p className="text-gray-400 text-sm">
                PDF, CSV supported
              </p>

              <input
                type="file"
                multiple
                hidden
                onChange={uploadFiles}
              />

            </label>

            {uploading && (

              <div className="mt-5 flex items-center gap-3 text-purple-400">

                <Loader2 className="animate-spin" size={18} />

                Uploading files...

              </div>

            )}

            {/* FILES */}
            <div className="space-y-4 mt-6">

              {files.map((file) => (

                <div
                  key={file.id}
                  className="p-5 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-between"
                >

                  <div className="flex items-center gap-4">

                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                      <FileText size={20} />
                    </div>

                    <div>

                      <h3 className="font-semibold">
                        {file.file_name}
                      </h3>

                      <p className="text-gray-400 text-sm">
                        {file.file_type}
                      </p>

                    </div>

                  </div>

                  <button
                    onClick={() => deleteFile(file.id)}
                    className="w-11 h-11 rounded-xl bg-red-500/10 hover:bg-red-500/20 transition-all flex items-center justify-center"
                  >

                    <Trash2
                      size={18}
                      className="text-red-400"
                    />

                  </button>

                </div>

              ))}

            </div>

          </Card>

          {/* APPEARANCE */}
          <Card
            icon={<Palette />}
            title="Appearance"
            subtitle="Customize chatbot UI"
          >

            <input
              type="text"
              value={theme.botName}
              onChange={(e) =>
                setTheme({
                  ...theme,
                  botName: e.target.value,
                })
              }
              className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 px-5 text-white outline-none focus:border-purple-500 mb-6"
            />

            <div className="grid grid-cols-2 gap-5">

              <ColorPicker
                label="Chat Background"
                value={theme.chatBg}
                onChange={(v) =>
                  setTheme({
                    ...theme,
                    chatBg: v,
                  })
                }
              />

              <ColorPicker
                label="Bot Bubble"
                value={theme.botBubble}
                onChange={(v) =>
                  setTheme({
                    ...theme,
                    botBubble: v,
                  })
                }
              />

              <ColorPicker
                label="User Bubble"
                value={theme.userBubble}
                onChange={(v) =>
                  setTheme({
                    ...theme,
                    userBubble: v,
                  })
                }
              />

              <ColorPicker
                label="Text Color"
                value={theme.textColor}
                onChange={(v) =>
                  setTheme({
                    ...theme,
                    textColor: v,
                  })
                }
              />

            </div>

          </Card>

          {/* DEPLOY */}
          <Card
            icon={<Rocket />}
            title="Deploy Chatbot"
            subtitle="Embed chatbot into your website"
          >

            <div className="rounded-2xl bg-black/40 border border-white/10 p-5 font-mono text-sm overflow-x-auto text-gray-300">
              {`<script src="${API_URL}/api/embed/${chatbotId}.js"></script>`}
            </div>

            <button
              onClick={copyEmbed}
              className="mt-5 h-14 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 font-semibold"
            >

              {copied ? (
                <>
                  <Check size={18} />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={18} />
                  Copy Embed Code
                </>
              )}

            </button>

          </Card>

        </div>

        {/* RIGHT */}
        <div>

          <div
            className="rounded-[36px] overflow-hidden border border-white/10 shadow-2xl flex flex-col h-[900px]"
            style={{
              background: theme.chatBg,
            }}
          >

            {/* HEADER */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">

              <div className="flex items-center gap-4">

                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">

                  <Bot
                    style={{
                      color: theme.textColor,
                    }}
                  />

                </div>

                <div>

                  <h3
                    className="text-xl font-bold"
                    style={{
                      color: theme.textColor,
                    }}
                  >
                    {theme.botName}
                  </h3>

                  <p className="text-sm text-gray-400">
                    AI Assistant Online
                  </p>

                </div>

              </div>

              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">

                <BrainCircuit className="text-green-400" size={20} />

              </div>

            </div>

            {/* CHAT */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">

              {messages.map((msg, i) => (

                <div
                  key={i}
                  className={`flex ${
                    msg.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  <div
                    className="max-w-[85%] px-5 py-4 shadow-xl"
                    style={{
                      background:
                        msg.role === "user"
                          ? theme.userBubble
                          : theme.botBubble,

                      color: theme.textColor,

                      borderRadius:
                        theme.radius === "full"
                          ? "999px"
                          : "20px",
                    }}
                  >
                    {msg.text}
                  </div>

                </div>

              ))}

              {sending && (

                <div className="flex justify-start">

                  <div
                    className="px-5 py-4 rounded-2xl flex items-center gap-3"
                    style={{
                      background: theme.botBubble,
                      color: theme.textColor,
                    }}
                  >

                    <Loader2
                      className="animate-spin"
                      size={18}
                    />

                    Typing...

                  </div>

                </div>

              )}

              <div ref={messagesEndRef}></div>

            </div>

            {/* INPUT */}
            <div className="p-5 border-t border-white/10">

              <div className="flex gap-3">

                <input
                  type="text"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) =>
                    setInput(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      sendMessage();
                    }
                  }}
                  className="flex-1 h-14 rounded-2xl bg-white/5 border border-white/10 px-5 text-white placeholder-gray-500 outline-none focus:border-purple-500"
                />

                <button
                  onClick={sendMessage}
                  disabled={sending}
                  style={{
                    background: theme.userBubble,
                  }}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center hover:scale-105 transition-all shadow-lg"
                >

                  {sending ? (
                    <Loader2
                      className="animate-spin"
                      size={20}
                    />
                  ) : (
                    <Send size={20} />
                  )}

                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

/* =========================================
CARD
========================================= */
function Card({
  icon,
  title,
  subtitle,
  children,
}) {

  return (
    <div className="rounded-[32px] bg-white/5 backdrop-blur-3xl border border-white/10 p-8 shadow-2xl">

      <div className="flex items-center gap-4 mb-8">

        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
          {icon}
        </div>

        <div>

          <h2 className="text-2xl font-black">
            {title}
          </h2>

          <p className="text-gray-400 text-sm">
            {subtitle}
          </p>

        </div>

      </div>

      {children}

    </div>
  );
}

/* =========================================
COLOR PICKER
========================================= */
function ColorPicker({
  label,
  value,
  onChange,
}) {

  return (
    <div>

      <p className="text-sm text-gray-400 mb-3">
        {label}
      </p>

      <div className="flex items-center gap-3">

        <input
          type="color"
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className="w-14 h-14 rounded-2xl border border-white/10 bg-transparent cursor-pointer"
        />

        <div className="text-sm text-gray-300 font-mono">
          {value}
        </div>

      </div>

    </div>
  );
}