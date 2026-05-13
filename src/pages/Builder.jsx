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
  useContext,
  useRef,
} from "react";

import { supabase } from "../lib/supabase";
import { AuthContext } from "../context/AuthContext";

const API_URL =
  import.meta.env.VITE_API_URL;

export default function Builder() {

  const { user } =
    useContext(AuthContext);

  const messagesEndRef =
    useRef(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [sending, setSending] =
    useState(false);

  const [copied, setCopied] =
    useState(false);

  const [chatbotId, setChatbotId] =
    useState(null);

  const [activeTab, setActiveTab] =
    useState("basic");

  const [businessInfo, setBusinessInfo] =
    useState("");

  const [website, setWebsite] =
    useState("");

  const [integrations, setIntegrations] =
    useState({
      calendly_link: "",
      maps_link: "",
    });

  const [theme, setTheme] =
    useState({
      botName: "AI Assistant",
      chatBg: "#081120",
      botBubble: "#1F2937",
      userBubble: "#7f5af0",
      textColor: "#ffffff",
      logo: "",
    });

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

    if (!user) return;

    initialize();

  }, [user]);

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages]);

  const initialize = async () => {

    try {

      setLoading(true);

      let {
        data: chatbot,
      } = await supabase
        .from("chatbots")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!chatbot) {

        const {
          data: newBot,
        } = await supabase
          .from("chatbots")
          .insert([
            {
              user_id: user.id,

              business_info: "",

              website_url: "",

              bot_name:
                "AI Assistant",

              theme: {
                botName:
                  "AI Assistant",

                chatBg:
                  "#081120",

                botBubble:
                  "#1F2937",

                userBubble:
                  "#7f5af0",

                textColor:
                  "#ffffff",

                logo: "",
              },
            },
          ])
          .select()
          .single();

        chatbot = newBot;
      }

      setChatbotId(chatbot.id);

      setBusinessInfo(
        chatbot.business_info || ""
      );

      setWebsite(
        chatbot.website_url || ""
      );

      let parsedTheme =
        chatbot.theme || {};

      if (
        typeof parsedTheme ===
        "string"
      ) {

        try {

          parsedTheme =
            JSON.parse(
              parsedTheme
            );

        } catch {

          parsedTheme = {};
        }
      }

      setTheme({
        botName:
          parsedTheme.botName ||
          "AI Assistant",

        chatBg:
          parsedTheme.chatBg ||
          "#081120",

        botBubble:
          parsedTheme.botBubble ||
          "#1F2937",

        userBubble:
          parsedTheme.userBubble ||
          "#7f5af0",

        textColor:
          parsedTheme.textColor ||
          "#ffffff",

        logo:
          parsedTheme.logo ||
          "",
      });

      const token =
        (
          await supabase.auth.getSession()
        ).data.session
          ?.access_token;

      const integrationRes =
        await fetch(
          `${API_URL}/api/integrations`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const integrationData =
        await integrationRes.json();

      setIntegrations({
        calendly_link:
          integrationData.calendly || "",

        maps_link:
          integrationData.maps || "",
      });

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }
  };

  const saveChanges = async () => {

    try {

      setSaving(true);

      await supabase
        .from("chatbots")
        .update({
          business_info:
            businessInfo,

          website_url:
            website,

          bot_name:
            theme.botName,

          theme,
        })
        .eq("id", chatbotId);

    } catch (err) {

      console.error(err);

    } finally {

      setSaving(false);

    }
  };

  const uploadLogo = async (e) => {

    try {

      const file =
        e.target.files[0];

      if (!file) return;

      const fileExt =
        file.name
          .split(".")
          .pop();

      const fileName =
        `${Date.now()}.${fileExt}`;

      const filePath =
        `${user.id}/${fileName}`;

      const {
        error: uploadError,
      } = await supabase.storage
        .from("chatbot-files")
        .upload(
          filePath,
          file,
          {
            cacheControl:
              "3600",

            upsert: true,
          }
        );

      if (uploadError) {

        console.error(
          uploadError
        );

        return;
      }

      const {
        data: publicData,
      } = supabase.storage
        .from("chatbot-files")
        .getPublicUrl(
          filePath
        );

      const updatedTheme = {
        ...theme,

        logo:
  publicData.publicUrl
      };

      setTheme(
        updatedTheme
      );

      await supabase
        .from("chatbots")
        .update({
          theme:
            updatedTheme,
        })
        .eq(
          "id",
          chatbotId
        );

    } catch (err) {

      console.error(err);

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
      integrations?.calendly_link
    ) {

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text:
            `📅 Book your appointment here:\n${integrations.calendly_link}`,
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

      const response =
        await fetch(
          `${API_URL}/api/chatbot/chat`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              message:
                userMessage,

              chatbot_id:
                chatbotId,

              session_id:
                user.id,
            }),
          }
        );

      const data =
        await response.json();

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

  const code =
`<script
  src="${API_URL}/embed.js"
  data-chatbot-id="${chatbotId}"
></script>`;

  await navigator.clipboard.writeText(
    code
  );

  setCopied(true);

  setTimeout(() => {

    setCopied(false);

  }, 2000);

  };

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
    <div className="h-[calc(100vh-90px)] overflow-hidden text-white">

      <div className="flex items-center justify-between mb-4">

        <div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/5 mb-2">

            <Sparkles
              size={10}
              className="text-purple-400"
            />

            <span className="text-[10px] text-gray-300">
              AI Chatbot Builder
            </span>

          </div>

          <h1 className="text-4xl font-bold">
            Builder
          </h1>

        </div>

        <button
          onClick={saveChanges}
          className="h-11 px-5 rounded-2xl bg-[#7f5af0] hover:opacity-90 transition-all flex items-center gap-2 text-sm font-semibold"
        >

          {saving ? (
            <Loader2
              className="animate-spin"
              size={16}
            />
          ) : (
            <Save size={16} />
          )}

          Save

        </button>

      </div>

      <div className="grid grid-cols-[190px_360px_1fr] gap-4 h-[calc(100%-80px)]">

        <div className="rounded-3xl border border-white/5 bg-white/[0.03] p-3 flex flex-col gap-2">

          <MenuItem
            active={activeTab === "basic"}
            icon={<Settings2 size={16} />}
            title="Basic"
            desc="Bot info"
            onClick={() =>
              setActiveTab("basic")
            }
          />

          <MenuItem
            active={activeTab === "training"}
            icon={<FileText size={16} />}
            title="Training"
            desc="Train AI"
            onClick={() =>
              setActiveTab("training")
            }
          />

          <MenuItem
            active={activeTab === "appearance"}
            icon={<Palette size={16} />}
            title="Appearance"
            desc="Customize"
            onClick={() =>
              setActiveTab("appearance")
            }
          />

          <MenuItem
            active={activeTab === "deploy"}
            icon={<Rocket size={16} />}
            title="Deploy"
            desc="Publish"
            onClick={() =>
              setActiveTab("deploy")
            }
          />

          <div className="mt-auto rounded-2xl border border-purple-500/40 bg-gradient-to-r from-[#7f5af0]/20 to-purple-900/20 p-4 text-sm text-purple-100 leading-relaxed">

            <div className="flex items-center gap-2 mb-3">

              <Info
                size={16}
                className="text-purple-300"
              />

              <p className="font-semibold">
                Quick Guide
              </p>

            </div>

            <div className="space-y-2 text-xs">

              <p>
                ✅ Add business details
              </p>

              <p>
                ✅ Upload PDFs & CSVs
              </p>

              <p>
                ✅ Customize chatbot
              </p>

              <p>
                ✅ Save and deploy
              </p>

            </div>

          </div>

        </div>
                <div className="rounded-3xl border border-white/5 bg-white/[0.03] p-5 overflow-y-auto">

          {activeTab === "basic" && (

            <div className="space-y-4">

              <div>

                <h2 className="text-2xl font-bold">
                  Basic Setup
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  Configure your chatbot identity and business details.
                </p>

              </div>

              <div className="flex items-center gap-4">

                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#111827] border border-white/5 flex items-center justify-center">

                  {theme.logo ? (

                    <img
  src={theme.logo}
  alt="logo"
  onError={(e) => {
    e.target.style.display = "none";
  }}
  className="w-full h-full object-contain p-2"
/>

                  ) : (

                    <span className="text-xs text-gray-500">
                      Logo
                    </span>

                  )}

                </div>

                <label className="flex-1 h-11 rounded-2xl border border-dashed border-white/10 bg-white/[0.03] flex items-center justify-center cursor-pointer text-sm text-gray-300 hover:bg-white/[0.05] transition-all">

                  Upload Business Logo

                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={uploadLogo}
                  />

                </label>

              </div>

              <div className="space-y-2">

                <label className="text-sm text-gray-300">
                  Chatbot Name
                </label>

                <input
                  type="text"
                  placeholder="AI Assistant"
                  value={theme.botName}
                  onChange={(e) =>
                    setTheme({
                      ...theme,
                      botName:
                        e.target.value,
                    })
                  }
                  className="w-full h-11 rounded-2xl bg-white/[0.03] border border-white/5 px-4 outline-none text-sm"
                />

              </div>

              <div className="space-y-2">

                <label className="text-sm text-gray-300">
                  Business Description
                </label>

                <textarea
                  placeholder="Describe your business..."
                  value={businessInfo}
                  onChange={(e) =>
                    setBusinessInfo(
                      e.target.value
                    )
                  }
                  className="w-full h-32 rounded-2xl bg-white/[0.03] border border-white/5 p-4 resize-none outline-none text-sm"
                />

              </div>

              <div className="space-y-2">

                <label className="text-sm text-gray-300">
                  Website URL
                </label>

                <input
                  type="text"
                  placeholder="https://website.com"
                  value={website}
                  onChange={(e) =>
                    setWebsite(
                      e.target.value
                    )
                  }
                  className="w-full h-11 rounded-2xl bg-white/[0.03] border border-white/5 px-4 outline-none text-sm"
                />

              </div>

            </div>
          )}

          {activeTab === "training" && (

            <div className="space-y-4">

              <div>

                <h2 className="text-2xl font-bold">
                  Training Data
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  Upload PDFs or CSV files to train your AI assistant.
                </p>

              </div>

              <label className="h-32 rounded-2xl border border-dashed border-purple-500/30 bg-purple-500/5 flex flex-col items-center justify-center cursor-pointer hover:bg-purple-500/10 transition-all">

                <Upload
                  size={24}
                  className="text-purple-400 mb-3"
                />

                <p className="text-sm text-gray-200 font-medium">
                  Upload PDF or CSV
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  Click here to upload training files
                </p>

                <input
  type="file"
  hidden
  multiple
  accept=".pdf,.csv"
  onChange={async (e) => {

    try {

      const files =
        Array.from(
          e.target.files
        );

      if (
        !files.length
      ) return;

      const token =
        (
          await supabase.auth.getSession()
        ).data.session
          ?.access_token;

      for (const file of files) {

        const formData =
          new FormData();

        formData.append(
          "file",
          file
        );

        formData.append(
          "chatbot_id",
          chatbotId
        );

        const response =
          await fetch(
            `${API_URL}/api/upload/training`,
            {
              method: "POST",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },

              body:
                formData,
            }
          );

        const data =
          await response.json();

        console.log(
          "UPLOAD RESPONSE:",
          data
        );
      }

      alert(
        "Training files uploaded successfully 🚀"
      );

    } catch (err) {

      console.error(
        "UPLOAD ERROR:",
        err
      );

      alert(
        "Failed to upload files"
      );

    }
  }}
/>
              </label>

              <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">

                <h3 className="text-sm font-semibold mb-2">
                  Tips for Better AI Responses
                </h3>

                <div className="space-y-2 text-xs text-gray-400">

                  <p>
                    • Upload FAQs and product/service details
                  </p>

                  <p>
                    • Add pricing sheets or brochures
                  </p>

                  <p>
                    • Keep documents clean and readable
                  </p>

                </div>

              </div>

            </div>
          )}

          {activeTab === "appearance" && (

            <div className="space-y-5">

              <div>

                <h2 className="text-2xl font-bold">
                  Appearance
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  Customize the chatbot look and feel.
                </p>

              </div>

              <ColorField
                label="Chat Background"
                value={theme.chatBg}
                onChange={(value) =>
                  setTheme({
                    ...theme,
                    chatBg: value,
                  })
                }
              />

              <ColorField
                label="Bot Message Bubble"
                value={theme.botBubble}
                onChange={(value) =>
                  setTheme({
                    ...theme,
                    botBubble: value,
                  })
                }
              />

              <ColorField
                label="User Message Bubble"
                value={theme.userBubble}
                onChange={(value) =>
                  setTheme({
                    ...theme,
                    userBubble: value,
                  })
                }
              />

              <ColorField
                label="Text Color"
                value={theme.textColor}
                onChange={(value) =>
                  setTheme({
                    ...theme,
                    textColor: value,
                  })
                }
              />

            </div>
          )}

          {activeTab === "deploy" && (

            <div className="space-y-4">

              <div>

                <h2 className="text-2xl font-bold">
                  Deploy Chatbot
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  Copy and paste this code into your website.
                </p>

              </div>

              <div className="rounded-2xl bg-black/40 border border-white/5 p-4 overflow-x-auto">

                <code className="text-xs text-purple-300 break-all whitespace-pre-wrap">
{`<script
  src="${API_URL}/embed.js"
  data-chatbot-id="${chatbotId}"
></script>`}
</code>

              </div>

              <button
                onClick={copyEmbed}
                className="h-11 px-5 rounded-2xl bg-[#7f5af0] hover:opacity-90 transition-all flex items-center gap-2 text-sm font-semibold"
              >

                {copied ? (
                  <>
                    <Check size={15} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={15} />
                    Copy Embed Code
                  </>
                )}

              </button>

            </div>
          )}

        </div>
                <div
         
  className="w-[380px] h-[700px] mx-auto rounded-[32px] overflow-hidden border border-white/5 flex flex-col shadow-[0_20px_80px_rgba(0,0,0,0.45)]"
          style={{
            background:
              theme.chatBg,
          }}
        >

          <div className="p-4 border-b border-white/5 flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white/10 flex items-center justify-center">

                {theme.logo ? (

                  <img
  src={theme.logo}
  alt="logo"
  onError={(e) => {
    e.target.style.display = "none";
  }}
  className="w-full h-full object-contain p-2"
/>

                ) : (

                  <span className="text-xs text-gray-500">
                    Logo
                  </span>

                )}

              </div>

              <div>

                <h2 className="text-xl font-bold">
                  {theme.botName}
                </h2>

                <p className="text-green-400 text-xs">
                  ● Online
                </p>

              </div>

            </div>

            <div className="w-10 h-10 rounded-2xl bg-green-500/10 flex items-center justify-center">

              <BrainCircuit
                className="text-green-400"
                size={18}
              />

            </div>

          </div>

          <div className="p-4 border-b border-white/5 flex gap-2 flex-wrap">

            <button
              onClick={() => {

                setMessages((prev) => [
                  ...prev,

                  {
                    role: "user",
                    text:
                      "Book Appointment",
                  },

                  {
                    role: "bot",

                    text:
                      integrations?.calendly_link
                        ? `📅 Book your appointment here:\n${integrations.calendly_link}`
                        : "Booking link not configured yet.",
                  },
                ]);
              }}
              className="px-4 h-10 rounded-full bg-[#7f5af0]/15 border border-purple-500/20 text-xs text-purple-300 hover:bg-[#7f5af0]/25 transition-all"
            >
              📅 Book Appointment
            </button>

            <button
              onClick={() => {

                setMessages((prev) => [
                  ...prev,

                  {
                    role: "user",
                    text:
                      "Visit Office",
                  },

                  {
                    role: "bot",

                    text:
                      integrations?.maps_link
                        ? `📍 Visit our office:\n${integrations.maps_link}`
                        : "Office location not configured yet.",
                  },
                ]);
              }}
              className="px-4 h-10 rounded-full bg-[#7f5af0]/15 border border-purple-500/20 text-xs text-purple-300 hover:bg-[#7f5af0]/25 transition-all"
            >
              📍 Visit Office
            </button>

          </div>

         <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-purple-500/30">

            {messages.map(
              (
                msg,
                index
              ) => (

                <div
                  key={index}
                  className={`flex ${
                    msg.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  <div
                    className="max-w-[85%] px-4 py-3 text-sm leading-relaxed break-words whitespace-pre-wrap"
                    style={{
                      background:
                        msg.role === "user"
                          ? theme.userBubble
                          : theme.botBubble,

                      color:
                        theme.textColor,

                      borderRadius:
                        "20px",
                    }}
                  >

                    {msg.text
                      .split("\n")
                      .map((line, index) => {

                        const urlMatch =
                          line.match(
                            /(https?:\/\/[^\s]+)/
                          );

                        if (urlMatch) {

                          const url =
                            urlMatch[0];

                          const text =
                            line.replace(
                              url,
                              ""
                            );

                          return (
                            <div
                              key={index}
                              className="space-y-2"
                            >

                              {text && (
                                <div>{text}</div>
                              )}

                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-300 underline break-all hover:text-purple-200 transition-all block"
                              >
                                {url}
                              </a>

                            </div>
                          );
                        }

                        return (
                          <div key={index}>
                            {line}
                          </div>
                        );
                      })}

                  </div>

                </div>
              )
            )}

            <div ref={messagesEndRef}></div>

          </div>

          <div className="p-4 border-t border-white/5">

            <div className="flex gap-2">

              <input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) =>
                  setInput(
                    e.target.value
                  )
                }
                onKeyDown={(e) => {

                  if (
                    e.key === "Enter"
                  ) {

                    sendMessage();
                  }
                }}
                className="flex-1 h-14 rounded-2xl bg-white/[0.03] border border-white/5 px-4 outline-none text-sm"
              />

              <button
                onClick={sendMessage}
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{
                  background:
                    theme.userBubble,
                }}
              >

                {sending ? (

                  <Loader2
                    className="animate-spin"
                    size={16}
                  />

                ) : (

                  <Send size={16} />

                )}

              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
function MenuItem({
  icon,
  title,
  desc,
  active,
  onClick,
}) {

  return (
    <button
      onClick={onClick}
      className={`rounded-2xl px-4 py-3 flex items-center gap-3 transition-all text-left ${
        active
          ? "bg-[#7f5af0] text-white shadow-[0_0_20px_rgba(127,90,240,0.35)]"
          : "bg-white/[0.03] hover:bg-white/[0.05] text-gray-300"
      }`}
    >

      {icon}

      <div>

        <p className="text-sm font-semibold">
          {title}
        </p>

        <p className="text-[11px] opacity-70">
          {desc}
        </p>

      </div>

    </button>
  );
}

function ColorField({
  label,
  value,
  onChange,
}) {

  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 flex items-center justify-between">

      <div>

        <p className="text-sm font-medium">
          {label}
        </p>

      </div>

      <input
        type="color"
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        className="w-12 h-12 rounded-xl bg-transparent border-none cursor-pointer"
      />

    </div>
  );
}