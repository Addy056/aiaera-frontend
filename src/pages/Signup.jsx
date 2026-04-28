import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  // 🔥 REDIRECT IF ALREADY LOGGED IN
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        navigate("/dashboard");
      }
    });
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      const user = data.user;

      // 🔥 CREATE FREE SUBSCRIPTION
      if (user) {
        await supabase.from("user_subscriptions").upsert({
          user_id: user.id,
          plan: "free",
          expires_at: null,
        });
      }

      alert("Check your email for confirmation!");
      navigate("/login");

    } catch (err) {
      setErrorMsg(err.message || "Signup failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">

      <form
        onSubmit={handleSignup}
        className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm w-full max-w-md"
      >

        {/* HEADER */}
        <h2 className="text-2xl font-bold mb-2 text-center">
          Create Account
        </h2>
        <p className="text-gray-500 text-center mb-6">
          Start building your AI chatbot
        </p>

        {/* ERROR */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm">
            {errorMsg}
          </div>
        )}

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* BUTTON */}
        <button
          disabled={loading}
          className="w-full bg-[#2563EB] text-white py-3 rounded-lg hover:bg-[#1E40AF] transition disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        {/* FOOTER */}
        <p className="mt-4 text-center text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-[#2563EB] font-medium">
            Login
          </Link>
        </p>

      </form>
    </div>
  );
}