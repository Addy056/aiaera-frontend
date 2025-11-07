import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "../supabaseClient";
import FloatingMenu from "../components/FloatingMenu";
import { User, Lock, LogOut, Save, Mail } from "lucide-react";

export default function Settings() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ email: "", full_name: "" });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [resetMessage, setResetMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setProfile({
        email: user.email,
        full_name: user.user_metadata?.full_name || "",
      });
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.auth.updateUser({ data: { full_name: profile.full_name } });
    setLoading(false);
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handlePasswordReset = async () => {
    setResetMessage("");
    const { error } = await supabase.auth.resetPasswordForEmail(profile.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setResetMessage(
      error
        ? "❌ Failed to send reset email."
        : "📩 Password reset email sent! Check your inbox."
    );
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e0b24] via-[#1a123a] to-[#071529] text-white relative overflow-hidden">
      <FloatingMenu />

      {/* Animated Aurora Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 14 }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#7f5af0]/25 via-[#00eaff]/15 to-[#bfa7ff]/10 blur-[120px]"
        />
        <motion.div
          animate={{ opacity: [0.4, 0.7, 0.4], scale: [1.05, 1, 1.05] }}
          transition={{ repeat: Infinity, duration: 16 }}
          className="absolute bottom-0 right-0 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-[#9b8cff]/25 via-[#00eaff]/15 to-[#7f5af0]/10 blur-[140px]"
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 sm:px-10 py-16 flex flex-col items-center gap-10">
        {/* Avatar + Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center"
        >
          <div className="relative mb-6">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#7f5af0] to-[#9b8cff] flex items-center justify-center text-4xl font-bold shadow-[0_0_40px_rgba(127,90,240,0.5)]"
            >
              {profile.full_name ? profile.full_name[0].toUpperCase() : "A"}
            </motion.div>
            <div className="absolute -bottom-3 right-2 w-6 h-6 rounded-full bg-gradient-to-tr from-[#00eaff] to-[#7f5af0] shadow-lg" />
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-[#bfa7ff] to-[#9b8cff] bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-gray-400 mt-2 text-sm sm:text-base">
            Manage your profile, password, and account preferences ✨
          </p>
        </motion.div>

        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg p-6 sm:p-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <User className="w-6 h-6 text-[#bfa7ff]" />
            <h2 className="text-xl sm:text-2xl font-semibold text-white/90">Profile Info</h2>
          </div>

          <div className="flex flex-col gap-4">
            <InputField
              icon={<User />}
              name="full_name"
              value={profile.full_name}
              onChange={handleChange}
              placeholder="Full Name"
            />
            <InputField icon={<Mail />} name="email" value={profile.email} disabled />
          </div>
        </motion.div>

        {/* Password Reset Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg p-6 sm:p-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <Lock className="w-6 h-6 text-[#bfa7ff]" />
            <h2 className="text-xl sm:text-2xl font-semibold text-white/90">Password Reset</h2>
          </div>
          <p className="text-gray-300 text-sm sm:text-base mb-4">
            Send a password reset link to your registered email.
          </p>
          <button
            onClick={handlePasswordReset}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#9b8cff] to-[#bfa7ff] hover:from-[#bfa7ff] hover:to-[#d0c4ff] text-white font-semibold transition-all shadow-lg hover:shadow-[0_0_25px_rgba(155,140,255,0.4)]"
          >
            Send Reset Email
          </button>
          {resetMessage && (
            <p className="mt-3 text-sm text-green-400">{resetMessage}</p>
          )}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center w-full"
        >
          <ActionButton
            icon={<Save />}
            text={loading ? "Saving..." : "Save Changes"}
            onClick={handleSave}
            gradient="from-[#9b8cff] to-[#bfa7ff]"
          />

          <ActionButton
            icon={<LogOut />}
            text="Logout"
            onClick={handleLogout}
            gradient="from-[#ff5f6d] to-[#e33b44]"
          />
        </motion.div>

        {saved && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-green-400 text-center mt-2"
          >
            ✅ Profile updated successfully!
          </motion.p>
        )}
      </div>
    </div>
  );
}

// ---- Subcomponents ----
function InputField({ icon, name, value, onChange, placeholder, disabled = false }) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-3.5 text-[#bfa7ff]">{icon}</div>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400 outline-none focus:bg-white/15 focus:ring-2 focus:ring-[#9b8cff]/50 transition ${
          disabled ? "text-gray-400 cursor-not-allowed" : ""
        }`}
      />
    </div>
  );
}

function ActionButton({ icon, text, onClick, gradient }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 flex-1 px-6 py-3 rounded-xl bg-gradient-to-r ${gradient} text-white font-semibold shadow-lg hover:shadow-[0_0_25px_rgba(155,140,255,0.4)] transition-all`}
    >
      {icon}
      {text}
    </button>
  );
}
