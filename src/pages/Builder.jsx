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

export default function Builder() {
  const [messages, setMessages] = useState([
    { id: uuidv4(), sender: "bot", text: "👋 Hi! I’m your AIAERA assistant. Let’s start building." },
  ]);
  const [input, setInput] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [files, setFiles] = useState([]);
  const [logoUrl, setLogoUrl] = useState(null);
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
  const API_BASE = import.meta.env.VITE_API_URL;
  const BUCKET = import.meta.env.VITE_SUPABASE_BUCKET || "chatbot-files";

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      setLoadingConfig(true);
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (!currentUser || !mounted) return;
        setUser(currentUser);

        const { data: sessionData } = await supabase.auth.getSession();
        setAuthToken(sessionData?.session?.access_token || null);

        const { data, error } = await supabase
          .from("chatbots")
          .select("*")
          .eq("user_id", currentUser.id)
          .single();

        if (error && error.code !== "PGRST116") console.warn("chatbots fetch error:", error);

        if (data) {
          setChatbotId(data.id);
          setBusinessName(data.name || "");
          setBusinessDescription(data.business_info || "");
          setWebsiteUrl(data.config?.website_url || "");
          setLogoUrl(data.config?.logo_url || null);
          if (Array.isArray(data.config?.files)) setFiles(data.config.files);
          setIsConfigSaved(true);
        } else setChatbotId(null);
      } catch (err) {
        console.error("Init Builder error:", err);
      } finally {
        if (mounted) setLoadingConfig(false);
      }
    };
    init();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loadingReply]);

  const pushMessage = (sender, text) => {
    setMessages((prev) => [...prev, { id: uuidv4(), sender, text }]);
  };

  const formatMessage = (text) => {
    if (!text) return "";
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, (url) => `<a href="${url}" target="_blank" class="underline text-purple-200">${url}</a>`);
  };

  // ---------------- Save Config ----------------
  const saveConfig = async () => {
    if (!user) {
      pushMessage("bot", "⚠️ Please log in to save your configuration.");
      return;
    }
    setSavingConfig(true);
    try {
      const config = { website_url: websiteUrl, files, logo_url: logoUrl };

      if (chatbotId) {
        const { error } = await supabase
          .from("chatbots")
          .update({
            name: businessName,
            business_info: businessDescription,
            config,
            updated_at: new Date().toISOString(),
          })
          .eq("id", chatbotId)
          .eq("user_id", user.id);

        if (error) throw error;
      } else {
        const { data: subscription, error: subErr } = await supabase
          .from("user_subscriptions")
          .select("expires_at")
          .eq("user_id", user.id)
          .maybeSingle();

        if (subErr) {
          console.error("Subscription check error:", subErr);
          pushMessage("bot", "❌ Unable to verify subscription. Please try again.");
          setSavingConfig(false);
          return;
        }

        const expired = !subscription || !subscription.expires_at || new Date(subscription.expires_at) < new Date();
        if (expired) {
          pushMessage("bot", "⚠️ Your subscription is inactive. Please renew to create your chatbot. Go to Pricing.");
          setSavingConfig(false);
          return;
        }

        const { data, error } = await supabase
          .from("chatbots")
          .insert([{ user_id: user.id, name: businessName, business_info: businessDescription, config }])
          .select()
          .single();

        if (error) throw error;
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

  const generateEmbedCode = () => {
    if (!chatbotId) return;
    setShowEmbedModal(true);
  };

  const embedCode = chatbotId
    ? `<script src="${API_BASE}/api/embed/${chatbotId}.js" async></script>`
    : "";

  const copyEmbedCode = () => {
    if (!embedCode) return;
    navigator.clipboard.writeText(embedCode);
    alert("Embed code copied to clipboard!");
  };

  // ---------------- Logo Upload ----------------
  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const filePath = `${user.id}/logo-${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(filePath, file, { cacheControl: "3600", upsert: false });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
      const publicUrl = urlData?.publicUrl ?? null;

      setLogoUrl(publicUrl);
      pushMessage("bot", `📌 Logo uploaded successfully.`);

      if (chatbotId) {
        const { error } = await supabase
          .from("chatbots")
          .update({
            config: { website_url: websiteUrl, files, logo_url: publicUrl },
            updated_at: new Date().toISOString(),
          })
          .eq("id", chatbotId)
          .eq("user_id", user.id);

        if (error) throw error;
      }
    } catch (err) {
      console.error("Logo upload error:", err);
      pushMessage("bot", "❌ Logo upload failed.");
    } finally {
      setUploading(false);
      if (logoInputRef.current) logoInputRef.current.value = "";
    }
  };

  // ---------------- File Upload ----------------
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const filePath = `${user.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(filePath, file, { cacheControl: "3600", upsert: false });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
      const publicUrl = urlData?.publicUrl ?? null;

      const newFileEntry = { name: file.name, path: filePath, publicUrl, uploaded_at: new Date().toISOString() };
      const updatedFiles = [newFileEntry, ...files];
      setFiles(updatedFiles);

      if (chatbotId) {
        const { error } = await supabase
          .from("chatbots")
          .update({
            config: { website_url: websiteUrl, files: updatedFiles, logo_url: logoUrl },
            updated_at: new Date().toISOString(),
          })
          .eq("id", chatbotId)
          .eq("user_id", user.id);

        if (error) throw error;
      }

      pushMessage("bot", `📂 Uploaded ${file.name}`);
    } catch (err) {
      console.error("File upload error:", err);
      pushMessage("bot", "❌ File upload failed.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteFile = async (filePath) => {
    if (!user) return;
    try {
      const { error: delErr } = await supabase.storage.from(BUCKET).remove([filePath]);
      if (delErr) throw delErr;

      const updatedFiles = files.filter((f) => f.path !== filePath);
      setFiles(updatedFiles);

      if (chatbotId) {
        const { error } = await supabase
          .from("chatbots")
          .update({
            config: { website_url: websiteUrl, files: updatedFiles, logo_url: logoUrl },
            updated_at: new Date().toISOString(),
          })
          .eq("id", chatbotId)
          .eq("user_id", user.id);

        if (error) throw error;
      }

      pushMessage("bot", "🗑️ File deleted.");
    } catch (err) {
      console.error("Delete file error:", err);
      pushMessage("bot", "❌ Failed to delete file.");
    }
  };

  // ---------------- Chat Preview & Retrain ----------------
  const sendMessage = async () => {
    if (!input.trim() || !user) return;
    pushMessage("user", input);

    const outgoingMessages = [
      ...messages.map((m) => ({ role: m.sender === "bot" ? "assistant" : "user", content: m.text })),
      { role: "user", content: input },
    ];

    setInput("");
    setLoadingReply(true);

    try {
      const res = await axios.post(
        `${API_BASE}/api/chatbot/preview`,
        {
          userId: user.id,
          chatbotConfig: { businessName, businessDescription, websiteUrl, files, logoUrl },
          messages: outgoingMessages,
        },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      let botReply = "🤖 (No reply received)";
      if (res.data?.reply) botReply = res.data.reply;
      else if (Array.isArray(res.data?.messages)) {
        const formatted = res.data.messages.map((m) => ({
          id: uuidv4(),
          sender: m.role === "assistant" ? "bot" : "user",
          text: m.content,
        }));
        setMessages(formatted);
        return;
      }

      pushMessage("bot", botReply);
    } catch (err) {
      console.error("Preview chat error:", err.response?.data || err.message || err);
      const errorText = err.response?.data?.error || err.message || "❌ Error: Unable to get a reply.";
      pushMessage("bot", errorText);
    } finally {
      setLoadingReply(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-6 h-full bg-gradient-to-br from-[#0f0f17] via-[#1a1a2e] to-[#0f0f17]">
      {/* Left - Builder Config */}
      <motion.div initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="lg:w-1/2 w-full">
        <Card className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">⚡ Build Your Chatbot</h2>
          <Tabs defaultValue="business">
            <TabsList className="grid grid-cols-2 sm:grid-cols-4 bg-black/30 rounded-xl p-1 mb-6 gap-2">
              <TabsTrigger value="business">Business</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="scraping">Website</TabsTrigger>
              <TabsTrigger value="logo">Logo</TabsTrigger>
            </TabsList>

            {/* Business Info */}
            <TabsContent value="business">
              <div className="space-y-4">
                <Input placeholder="Business Name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="bg-black/30 border-0 text-white w-full" />
                <Textarea placeholder="Business Description" value={businessDescription} onChange={(e) => setBusinessDescription(e.target.value)} className="bg-black/30 border-0 text-white w-full" />

                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <Button
                    onClick={isConfigSaved ? generateEmbedCode : saveConfig}
                    disabled={savingConfig}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90"
                  >
                    {isConfigSaved ? "Generate Embed Code" : savingConfig ? "Saving..." : "Save Info"}
                  </Button>

                  {isConfigSaved && (
                    <Button
                      onClick={async () => {
                        if (!chatbotId || !user) return;
                        try {
                          pushMessage("bot", "⚡ Retraining your chatbot...");
                          await axios.post(`${API_BASE}/api/chatbot/retrain`, { chatbotId, userId: user.id }, {
                            headers: { Authorization: `Bearer ${authToken}` },
                          });
                          pushMessage("bot", "✅ Chatbot retraining started successfully!");
                        } catch (err) {
                          console.error("Retrain error:", err.response?.data || err.message || err);
                          pushMessage("bot", "❌ Failed to start retraining.");
                        }
                      }}
                      className="flex-1 bg-green-500 hover:opacity-90"
                    >
                      Retrain Chatbot
                    </Button>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Files Upload */}
            <TabsContent value="files">
              <div className="space-y-4">
                <input ref={fileInputRef} type="file" onChange={handleFileChange} className="w-full text-sm text-gray-200" />
                <div className="space-y-2">
                  {uploading && <p className="text-sm text-gray-300">Uploading...</p>}
                  {files.length === 0 ? (
                    <p className="text-sm text-gray-300">No files uploaded yet.</p>
                  ) : (
                    files.map((f) => (
                      <div key={f.path} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white/5 p-3 rounded-lg gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-md flex items-center justify-center text-xs font-semibold">
                            {f.name[0]?.toUpperCase() ?? "F"}
                          </div>
                          <div>
                            <div className="text-sm font-medium">{f.name}</div>
                            <div className="text-xs text-gray-300">{f.uploaded_at ? new Date(f.uploaded_at).toLocaleString() : ""}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {f.publicUrl && (
                            <a href={f.publicUrl} target="_blank" rel="noreferrer" className="text-sm underline text-purple-200">Open</a>
                          )}
                          <button onClick={() => handleDeleteFile(f.path)} className="text-sm text-red-400 hover:underline">Delete</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Website Scraping */}
            <TabsContent value="scraping">
              <div className="space-y-4">
                <Input placeholder="https://your-website.com" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} className="bg-black/30 border-0 text-white" />
                <Button onClick={saveConfig} className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90">Save Website</Button>
              </div>
            </TabsContent>

            {/* Logo Upload */}
            <TabsContent value="logo">
              <div className="space-y-4">
                <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="w-full text-sm text-gray-200" />
                {uploading && <p className="text-sm text-gray-300">Uploading...</p>}
                {logoUrl && (
                  <div className="flex justify-center mt-4">
                    <img src={logoUrl} alt="Logo Preview" className="h-24 w-auto rounded-lg shadow-lg" />
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </motion.div>

      {/* Right - Chat Preview */}
      <motion.div initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="lg:w-1/2 w-full flex flex-col">
        <Card className="flex flex-col h-[70vh] sm:h-[80vh] backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
            {messages.map((m) => (
              <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] sm:max-w-[75%] px-4 py-2 rounded-2xl shadow ${m.sender === "user" ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white" : "bg-white/15 text-gray-100 border border-white/20"}`}>
                  <span dangerouslySetInnerHTML={{ __html: formatMessage(m.text) }} />
                </div>
              </motion.div>
            ))}
            {loadingReply && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ repeat: Infinity, duration: 1 }}>
                <div className="px-4 py-2 rounded-2xl bg-white/15 text-gray-100 border border-white/20">Typing...</div>
              </motion.div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 border-t border-white/20 bg-black/20 flex flex-col sm:flex-row items-center gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 bg-black/40 border-0 text-white w-full"
            />
            <Button onClick={sendMessage} className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 w-full sm:w-auto">Send</Button>
          </div>
        </Card>
      </motion.div>

      {/* Embed Modal */}
      {showEmbedModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-[#1a1a2e] p-6 rounded-2xl shadow-2xl w-[90%] max-w-lg">
            <h3 className="text-xl font-bold mb-4 text-white">Embed Code</h3>
            <textarea value={embedCode} readOnly className="w-full h-32 bg-black/40 text-white text-sm p-3 rounded-lg" />
            <div className="flex justify-end gap-3 mt-4">
              <Button onClick={copyEmbedCode} className="bg-green-500 hover:opacity-90">Copy</Button>
              <Button onClick={() => setShowEmbedModal(false)} className="bg-gray-600 hover:opacity-90">Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
