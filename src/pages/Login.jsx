import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        navigate("/dashboard");
      }
    });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      navigate("/dashboard");

    } catch (err) {
      setErrorMsg(err.message || "Login failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0814] text-white relative overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute top-[-150px] left-[-100px] w-[400px] h-[400px] bg-purple-600/30 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-150px] right-[-100px] w-[400px] h-[400px] bg-blue-600/20 blur-[120px] rounded-full"></div>

      {/* CARD */}
      <form
        onSubmit={handleLogin}
        className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
      >

        {/* LOGO */}
        <h1 className="text-2xl font-bold text-center text-purple-400 mb-6">
          AIAERA
        </h1>

        {/* HEADER */}
        <h2 className="text-3xl font-bold text-center mb-2">
          Welcome Back 👋
        </h2>
        <p className="text-gray-400 text-center mb-6">
          Login to continue building your AI chatbot
        </p>

        {/* ERROR */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-500/20 text-red-400 rounded-lg text-sm border border-red-500/30">
            {errorMsg}
          </div>
        )}

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email address"
          className="w-full p-3 mb-4 rounded-lg bg-white/10 border border-white/20 outline-none focus:border-purple-500 transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded-lg bg-white/10 border border-white/20 outline-none focus:border-purple-500 transition"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* BUTTON */}
        <button
          disabled={loading}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-[#7f5af0] to-[#9f7aea] hover:scale-[1.02] transition shadow-lg disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* FOOTER */}
        <p className="mt-6 text-center text-gray-400">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-purple-400 hover:underline">
            Sign Up
          </Link>
        </p>

      </form>
    </div>
  );
}