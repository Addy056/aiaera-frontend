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
import ChatbotPreview from "./ChatbotPreview";

// Leaflet icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function Builder() {
  const [messages, setMessages] = useState([
    { id: uuidv4(), sender: "bot", text: "👋 Hi! I’m your AIAERA assistant. Let’s start building." },
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
          setLogoUrl(data.config?.logo_url || null);
          if (Array.isArray(data.config?.files)) setFiles(data.config.files);

          if (data.config?.location?.lat && data.config?.location?.lng) {
            setLocation(data.config.location);
            setHasSelectedLocation(true);
          } else {
            setLocation({ lat: 20.5937, lng: 78.9629 });
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
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loadingReply]);

  const pushMessage = (sender, text) => {
    setMessages((prev) => [...prev, { id: uuidv4(), sender, text }]);
  };

  // --- Unified config save ---
  const saveConfigToSupabase = async (extra = {}) => {
    if (!user) return;
    setSavingConfig(true);
    try {
      const config = {
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
        const { data: subscription } = await supabase
          .from("user_subscriptions")
          .select("expires_at")
          .eq("user_id", user.id)
          .maybeSingle();

        const expired = !subscription || !subscription.expires_at || new Date(subscription.expires_at) < new Date();
        if (expired) {
          pushMessage("bot", "⚠️ Your subscription is inactive. Please renew to create your chatbot. Go to Pricing.");
          setSavingConfig(false);
          return;
        }

        const { data } = await supabase
          .from("chatbots")
          .insert([{ user_id: user.id, name: businessName, business_info: businessDescription, config }])
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

  // --- File Upload ---
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (chatbotId) formData.append("chatbot_id", chatbotId);

      const res = await axios.post(`${API_BASE}/api/uploads`, formData, {
        headers: { Authorization: `Bearer ${authToken}`, "Content-Type": "multipart/form-data" },
      });

      const { metadata, extractedContent, storage } = res.data;

      const newFileEntry = {
        name: metadata.filename,
        path: metadata.path,
        publicUrl: storage?.Key
          ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${metadata.path}`
          : null,
        uploaded_at: new Date().toISOString(),
        extractedContent,
      };

      const updatedFiles = [newFileEntry, ...files];
      setFiles(updatedFiles);
      await saveConfigToSupabase({ files: updatedFiles });

      pushMessage("bot", `📂 Uploaded and parsed ${file.name}`);
    } catch (err) {
      console.error("File upload error:", err.response?.data || err.message || err);
      pushMessage("bot", "❌ File upload failed.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteFile = async (filePath) => {
    if (!user) return;
    try {
      await supabase.storage.from(BUCKET).remove([filePath]);
      const updatedFiles = files.filter((f) => f.path !== filePath);
      setFiles(updatedFiles);
      await saveConfigToSupabase({ files: updatedFiles });
      pushMessage("bot", "🗑️ File deleted.");
    } catch (err) {
      console.error("Delete file error:", err);
      pushMessage("bot", "❌ Failed to delete file.");
    }
  };

  // --- Logo Upload ---
  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const filePath = `${user.id}/logo-${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from(BUCKET).upload(filePath, file, { cacheControl: "3600", upsert: false });
      if (error) throw error;

      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
      const publicUrl = urlData?.publicUrl ?? null;
      setLogoUrl(publicUrl);
      await saveConfigToSupabase({ logo_url: publicUrl });

      pushMessage("bot", "📌 Logo uploaded successfully.");
    } catch (err) {
      console.error("Logo upload error:", err);
      pushMessage("bot", "❌ Logo upload failed.");
    } finally {
      setUploading(false);
      if (logoInputRef.current) logoInputRef.current.value = "";
    }
  };

  // --- Chat Preview ---
  const sendMessage = async () => {
    if (!input.trim() || !user) return;
    const userText = input.trim();
    pushMessage("user", userText);

    const prior = messages.map((m) => ({
      role: m.sender === "bot" ? "assistant" : "user",
      content: m.text,
    }));

    setInput("");
    setLoadingReply(true);

    try {
      const { data } = await supabase.from("business_data").select("*").eq("user_id", user.id);
      const context = data.map((r, idx) => `#${idx + 1} ${r.title}\nDesc: ${r.description || ""}\nAttrs: ${JSON.stringify(r.attributes)}`).join("\n\n");

      const augmentedMessages = [
        ...prior,
        { role: "system", content: "You are an assistant for a business. Answer ONLY using the data provided in 'Business Data Context'." },
        { role: "assistant", content: `Business Data Context:\n${context}` },
        { role: "user", content: userText },
      ];

      const chatbotConfig = {
        id: chatbotId || null,
        name: businessName || "",
        businessDescription: businessDescription || "",
        files: files || [],
        logoUrl: logoUrl || null,
        location: hasSelectedLocation ? location : null,
      };

      const res = await axios.post(
        `${API_BASE}/api/chatbot/preview`,
        { userId: user.id, chatbotConfig, messages: augmentedMessages, retrievedData: data },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      let botReply = res.data?.reply || "🤖 (No reply received)";
      pushMessage("bot", botReply);
    } catch (err) {
      console.error("Preview chat error:", err.response?.data || err.message || err);
      pushMessage("bot", "❌ Error: Unable to get a reply.");
    } finally {
      setLoadingReply(false);
    }
  };

  // --- Retrain ---
  const retrainChatbot = async () => {
    if (!chatbotId || !user) {
      pushMessage("bot", "⚠️ Chatbot ID or user missing.");
      return;
    }
    try {
      pushMessage("bot", "⚡ Retraining your chatbot...");
      const res = await axios.post(`${API_BASE}/api/chatbot/retrain`, { chatbotId, userId: user.id }, { headers: { Authorization: `Bearer ${authToken}` } });
      pushMessage("bot", "✅ Chatbot retraining started successfully!");
      console.log("Retrain response:", res.data);
    } catch (err) {
      console.error("Retrain error:", err.response?.data || err.message || err);
      pushMessage("bot", "❌ Failed to start retraining.");
    }
  };

  // --- Map ---
  function LocationMarker() {
    useMapEvents({
      click(e) {
        setLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
        setHasSelectedLocation(true);
        saveConfigToSupabase({ location: { lat: e.latlng.lat, lng: e.latlng.lng } });
      },
    });
    return hasSelectedLocation ? (
      <Marker position={[location.lat, location.lng]}>
        <Popup>Business Location</Popup>
      </Marker>
    ) : null;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-6 h-full bg-gradient-to-br from-[#0f0f17] via-[#1a1a2e] to-[#0f0f17] min-h-screen">
      {/* Left Panel */}
      <motion.div initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="lg:w-1/2 w-full">
        <Card className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">⚡ Build Your Chatbot</h2>
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
                <Input placeholder="Business Name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="bg-black/30 border-0 text-white w-full" />
                <Textarea placeholder="Business Description" value={businessDescription} onChange={(e) => setBusinessDescription(e.target.value)} className="bg-black/30 border-0 text-white w-full" />

                {isConfigSaved && (
                  <Button onClick={retrainChatbot} className="w-full bg-green-500 hover:opacity-90">
                    Retrain Chatbot
                  </Button>
                )}
              </div>
            </TabsContent>

            {/* Files */}
            <TabsContent value="files">
              <div className="space-y-4">
                <input ref={fileInputRef} type="file" onChange={handleFileChange} className="w-full text-sm text-gray-200" />
                {uploading && <p className="text-sm text-gray-300">Uploading...</p>}
                {files.length === 0 ? <p className="text-sm text-gray-300">No files uploaded yet.</p> : files.map((f) => (
                  <div key={f.path} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white/5 p-3 rounded-lg gap-2">
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-md flex items-center justify-center text-xs font-semibold">
                        {f.name[0]?.toUpperCase() ?? "F"}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{f.name}</div>
                        <div className="text-xs text-gray-300">{f.uploaded_at ? new Date(f.uploaded_at).toLocaleString() : ""}</div>
                        {f.extractedContent?.text && (
                          <div className="mt-2 text-xs text-gray-200 max-h-32 overflow-y-auto p-2 bg-white/5 rounded-md">
                            <strong>Preview:</strong> {f.extractedContent.text.slice(0, 200)}...
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                      {f.publicUrl && <a href={f.publicUrl} target="_blank" rel="noreferrer" className="text-sm underline text-purple-200">Open</a>}
                      <button onClick={() => handleDeleteFile(f.path)} className="text-sm text-red-400 hover:underline">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Logo */}
            <TabsContent value="logo">
              <div className="flex flex-col gap-4">
                <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} />
                {logoUrl && <img src={logoUrl} alt="Logo" className="w-32 h-32 object-contain rounded-lg" />}
              </div>
            </TabsContent>

            {/* Website */}
            <TabsContent value="scraping">
              <Input placeholder="Website URL" className="bg-black/30 border-0 text-white w-full" disabled />
              <p className="text-sm text-gray-400 mt-2">⚠️ Website scraping is handled separately now.</p>
            </TabsContent>

            {/* Map */}
            <TabsContent value="map">
              <div className="w-full h-64">
                <MapContainer
                  center={[location?.lat || 20.5937, location?.lng || 78.9629]}
                  zoom={5}
                  className="w-full h-full rounded-lg"
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationMarker />
                </MapContainer>
                <p className="text-sm text-gray-300 mt-2">Click on the map to select your business location.</p>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </motion.div>

      {/* Right Panel: Chat Preview */}
      <motion.div initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="lg:w-1/2 w-full flex flex-col h-full">
        <Card className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl flex-1 p-4 flex flex-col">
          <ChatbotPreview messages={messages} input={input} setInput={setInput} sendMessage={sendMessage} loadingReply={loadingReply} chatEndRef={chatEndRef} />
        </Card>
      </motion.div>
    </div>
  );
}
