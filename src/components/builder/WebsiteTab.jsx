// src/components/builder/WebsiteTab.jsx

import { Input } from "@/components/ui/Input";
import { Globe } from "lucide-react";

export default function WebsiteTab({ businessWebsite, setBusinessWebsite }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
        <Globe className="w-5 h-5 text-[#cbb8ff]" />
        Website Integration
      </h2>

      <Input
        placeholder="https://your-website.com"
        value={businessWebsite}
        onChange={(e) => setBusinessWebsite(e.target.value)}
        className="bg-black/30 border-0 text-white"
      />

      <p className="text-xs text-gray-400 leading-relaxed">
        Add your website URL.  
        Your AI assistant will use this when scraping content, understanding your brand,  
        and deploying the chatbot widget on your website.
      </p>
    </div>
  );
}
