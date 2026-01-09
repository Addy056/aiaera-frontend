// src/components/builder/Sidebar.jsx

import { Building2, FileText, Globe } from "lucide-react";

export default function Sidebar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "business", label: "Business", icon: Building2 },
    { id: "files", label: "Files", icon: FileText },
    { id: "website", label: "Website", icon: Globe },
  ];

  return (
    <div className="space-y-2">
      {tabs.map(({ id, label, icon: Icon }) => {
        const isActive = activeTab === id;

        return (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-3
                        rounded-xl px-4 py-3
                        text-sm font-medium
                        border transition
                        ${
                          isActive
                            ? "bg-[#11111b] border-purple-400/30 text-white shadow-[0_8px_30px_rgba(127,90,240,0.25)]"
                            : "bg-[#0f0f1a] border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-200"
                        }`}
          >
            <Icon
              className={`w-4 h-4 ${
                isActive ? "text-purple-300" : "text-gray-500"
              }`}
            />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
