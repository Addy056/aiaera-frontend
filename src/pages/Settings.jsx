// src/pages/Settings.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Settings() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    email: "",
    full_name: "",
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [resetMessage, setResetMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      setProfile({
        email: user.email,
        full_name: user.user_metadata?.full_name || "",
      });

      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase.auth.updateUser({
      data: { full_name: profile.full_name },
    });

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

    if (error) {
      setResetMessage("❌ Failed to send reset email.");
    } else {
      setResetMessage("📩 Password reset email sent! Check your inbox.");
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
    navigate("/login"); // ✅ SPA-safe redirect
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold text-white mb-6">Settings</h1>

      {/* Profile Section */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/20">
        <h2 className="text-xl font-semibold text-purple-300 mb-4">Profile</h2>
        <div className="space-y-4">
          <input
            type="text"
            name="full_name"
            value={profile.full_name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300"
          />
          <input
            type="text"
            name="email"
            value={profile.email}
            disabled
            className="w-full p-3 rounded-lg bg-white/20 text-gray-400"
          />
        </div>
      </div>

      {/* Password Reset Section */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/20">
        <h2 className="text-xl font-semibold text-purple-300 mb-4">Password</h2>
        <p className="text-gray-300 mb-4">
          You can request a password reset email. Clicking the link in your inbox will let you set a new password.
        </p>
        <button
          onClick={handlePasswordReset}
          className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition text-white font-semibold shadow-lg"
        >
          Send Reset Email
        </button>
        {resetMessage && (
          <p className="mt-3 text-sm text-green-400">{resetMessage}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition text-white font-semibold shadow-lg"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>

        <button
          onClick={handleLogout}
          className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 transition text-white font-semibold shadow-lg"
        >
          Logout
        </button>
      </div>

      {saved && (
        <p className="text-green-400 mt-4">✅ Profile updated successfully!</p>
      )}
    </div>
  );
}
