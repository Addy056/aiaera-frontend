// src/components/builder/Sidebar.jsx

import { Building2, FileText, Globe } from "lucide-react";

export default function Sidebar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "business", label: "Business", icon: Building2 },
    { id: "files", label: "Files", icon: FileText },
    { id: "website", label: "Website", icon: Globe },
  ];

  return (
    <div className="col-span-12 lg:col-span-3">
      {tabs.map(({ id, label, icon: Icon }) => {
        const isActive = activeTab === id;

        return (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 mb-3 
              rounded-2xl transition-all border
              ${
                isActive
                  ? "bg-white/[0.14] border-white/20 text-[#e6deff] shadow-[0_8px_30px_rgba(127,90,240,0.25)]"
                  : "bg-white/[0.08] border-white/10 text-gray-300 hover:bg-white/[0.12]"
              }
            `}
          >
            <Icon className="w-5 h-5 text-[#bfa7ff]" />
            <span className="font-medium">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
