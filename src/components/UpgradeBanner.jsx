import { useNavigate } from "react-router-dom";

export default function UpgradeBanner() {
  const navigate = useNavigate();

  return (
    <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/30 flex justify-between items-center">
      <p className="text-sm text-red-300">
        Your subscription has expired. Upgrade to unlock features.
      </p>

      <button
        onClick={() => navigate("/pricing")}
        className="bg-red-500 px-4 py-2 rounded-lg text-sm hover:scale-105 transition"
      >
        Upgrade
      </button>
    </div>
  );
}