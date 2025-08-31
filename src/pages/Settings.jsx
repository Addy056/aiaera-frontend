import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

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
    try { await supabase.auth.signOut(); } 
    catch (err) { console.error("Logout failed:", err.message); }
    navigate("/login");
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 md:p-12 flex flex-col gap-6 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-6 drop-shadow-lg">
        Settings
      </h1>

      {/* Profile Section */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-4 sm:p-6 md:p-8 flex flex-col gap-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-purple-300">Profile</h2>
        <input
          type="text"
          name="full_name"
          value={profile.full_name}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full p-3 sm:p-4 md:p-5 rounded-xl bg-white/20 text-white placeholder-gray-300 transition focus:ring-2 focus:ring-purple-500 outline-none"
        />
        <input
          type="text"
          name="email"
          value={profile.email}
          disabled
          className="w-full p-3 sm:p-4 md:p-5 rounded-xl bg-white/20 text-gray-400 cursor-not-allowed"
        />
      </div>

      {/* Password Reset Section */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-4 sm:p-6 md:p-8 flex flex-col gap-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-purple-300">Password</h2>
        <p className="text-gray-300 text-sm sm:text-base md:text-base">
          Request a password reset email. Click the link in your inbox to set a new password.
        </p>
        <button
          onClick={handlePasswordReset}
          className="w-full sm:w-auto px-6 py-3 md:py-4 rounded-xl bg-purple-600 hover:bg-purple-700 transition text-white font-semibold shadow-lg"
        >
          Send Reset Email
        </button>
        {resetMessage && (
          <p className="mt-2 text-sm sm:text-base md:text-base text-green-400">{resetMessage}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex-1 px-6 py-3 md:py-4 rounded-xl bg-purple-600 hover:bg-purple-700 transition text-white font-semibold shadow-lg"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>

        <button
          onClick={handleLogout}
          className="flex-1 px-6 py-3 md:py-4 rounded-xl bg-red-600 hover:bg-red-700 transition text-white font-semibold shadow-lg"
        >
          Logout
        </button>
      </div>

      {saved && (
        <p className="text-green-400 text-center mt-2 sm:mt-4 md:mt-4">
          ✅ Profile updated successfully!
        </p>
      )}
    </div>
  );
}
