// src/pages/public-chatbot/[id].jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function PublicChatbot() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const script = document.createElement("script");
    script.src = `${import.meta.env.VITE_BACKEND_URL}/api/embed/${id}.js`;
    script.async = true;
    script.onerror = () => {
      setError("Failed to load chatbot embed.");
      setLoading(false);
    };
    script.onload = () => setLoading(false);

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [id]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center bg-[#0f0f17] text-white">
        Loading chatbot...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center bg-[#0f0f17] text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#0f0f17]">
      {/* The iframe/chatbot will be injected dynamically by the embed script */}
    </div>
  );
}
