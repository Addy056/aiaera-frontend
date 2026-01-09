// src/components/builder/WebsiteTab.jsx

import { Input } from "@/components/ui/Input";
import { Globe } from "lucide-react";

export default function WebsiteTab({ businessWebsite, setBusinessWebsite }) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
          <Globe className="w-4 h-4 text-purple-300" />
          Website Integration
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Let your chatbot learn from your website content.
        </p>
      </div>

      {/* Input */}
      <Input
        placeholder="https://your-website.com"
        value={businessWebsite}
        onChange={(e) => setBusinessWebsite(e.target.value)}
      />

      {/* Helper text */}
      <p className="text-xs text-gray-400 leading-relaxed max-w-lg">
        Add your website URL. The AI assistant will use this to scrape content,
        understand your brand, and deploy the chatbot widget on your site.
      </p>
    </div>
  );
}
