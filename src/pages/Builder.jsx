import { useState, useEffect, useContext } from "react";
import { supabase } from "../lib/supabase";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function Builder() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [businessInfo, setBusinessInfo] = useState("");
  const [website, setWebsite] = useState("");

  const [theme, setTheme] = useState({
    botName: "AI Assistant",
    chatBg: "#1f1b2e",
    botBubble: "#2a2540",
    userBubble: "#7f5af0",
    textColor: "#ffffff",
    radius: "lg"
  });

  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! How can I help you?" }
  ]);
  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(true);

  useEffect(() => {
    if (!user) return;
    init();
  }, [user]);

  const init = async () => {
    const { data: sub } = await supabase
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!sub || new Date(sub.expires_at) < new Date()) {
      setIsSubscribed(false);
    }

    const { data } = await supabase
      .from("chatbots")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (data) {
      setBusinessInfo(data.business_info || "");
      setWebsite(data.website_url || "");
      if (data.theme) setTheme(data.theme);
    }
  };

  const sendMessage = async () => {
    if (!input || loading) return;

    const msg = input;
    setMessages(prev => [...prev, { role: "user", text: msg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          message: msg,
          userId: user.id
        })
      });

      const data = await res.json();
      setMessages(prev => [...prev, { role: "bot", text: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "bot", text: "Server error" }]);
    }

    setLoading(false);
  };

  const saveConfig = async () => {
    setSaving(true);

    await supabase.from("chatbots").upsert({
      user_id: user.id,
      business_info: businessInfo,
      website_url: website,
      bot_name: theme.botName,
      theme
    });

    setSaving(false);
    alert("Saved!");
  };

  if (authLoading) return <div className="p-10">Loading...</div>;

  return (
    <div className="space-y-8 text-white">

      {!isSubscribed && (
        <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex justify-between">
          <p>Subscription expired</p>
          <button onClick={() => navigate("/pricing")} className="bg-red-500 px-4 py-2 rounded">
            Upgrade
          </button>
        </div>
      )}

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Chatbot Builder</h2>
          <p className="text-gray-400">Customize & deploy</p>
        </div>

        <button
          onClick={saveConfig}
          className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-400 hover:scale-105 transition"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">

        {/* LEFT */}
        <div className="space-y-6">

          <Card title="Business Info">
            <textarea
              className="input"
              value={businessInfo}
              onChange={(e) => setBusinessInfo(e.target.value)}
            />

            <input
              className="input mt-3"
              placeholder="Website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </Card>

          <Card title="Appearance">
            <input
              className="input mb-4"
              value={theme.botName}
              onChange={(e)=>setTheme({...theme,botName:e.target.value})}
            />

            <div className="flex gap-5">
              <Color label="BG" value={theme.chatBg} onChange={(v)=>setTheme({...theme,chatBg:v})}/>
              <Color label="Bot" value={theme.botBubble} onChange={(v)=>setTheme({...theme,botBubble:v})}/>
              <Color label="User" value={theme.userBubble} onChange={(v)=>setTheme({...theme,userBubble:v})}/>
              <Color label="Text" value={theme.textColor} onChange={(v)=>setTheme({...theme,textColor:v})}/>
            </div>

            <div className="flex gap-3 mt-4">
              {["sm","lg","full"].map(r => (
                <button
                  key={r}
                  onClick={()=>setTheme({...theme,radius:r})}
                  className="px-3 py-1 bg-white/10 rounded-lg"
                >
                  {r}
                </button>
              ))}
            </div>
          </Card>

          <Card title="Embed">
            <div className="bg-black/40 p-3 rounded text-xs font-mono">
              {`<script src="${API_URL}/api/embed/${user?.id}.js"></script>`}
            </div>
          </Card>

        </div>

        {/* RIGHT CHAT */}
        <div
          className="rounded-2xl flex flex-col shadow-2xl border border-white/10"
          style={{ background: theme.chatBg }}
        >
          <div className="p-4 border-b border-white/10">
            <h3 style={{ color: theme.textColor }}>{theme.botName}</h3>
          </div>

          <div className="flex-1 p-4 space-y-3 overflow-y-auto">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : ""}`}>
                <div
                  style={{
                    background: msg.role === "user" ? theme.userBubble : theme.botBubble,
                    color: theme.textColor,
                    borderRadius: theme.radius === "full" ? "999px" : "12px"
                  }}
                  className="px-4 py-2 max-w-xs shadow"
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 flex gap-2 border-t border-white/10">
            <input
              className="input flex-1"
              value={input}
              onChange={(e)=>setInput(e.target.value)}
            />
            <button
              onClick={sendMessage}
              style={{ background: theme.userBubble }}
              className="px-4 rounded-lg"
            >
              Send
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

/* UI COMPONENTS */

function Card({ title, children }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl">
      <h3 className="mb-4">{title}</h3>
      {children}
    </div>
  );
}

function Color({ label, value, onChange }) {
  return (
    <div className="text-center">
      <p className="text-xs text-gray-400">{label}</p>
      <div
        className="w-10 h-10 rounded-full cursor-pointer border"
        style={{ background: value }}
        onClick={() => {
          const i = document.createElement("input");
          i.type = "color";
          i.value = value;
          i.onchange = (e)=>onChange(e.target.value);
          i.click();
        }}
      />
    </div>
  );
}