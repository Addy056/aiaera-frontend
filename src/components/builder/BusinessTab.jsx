// src/components/builder/BusinessTab.jsx

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { Wand2 } from "lucide-react";

export default function BusinessTab({
  businessName,
  setBusinessName,
  businessDescription,
  setBusinessDescription,
  businessEmail,
  setBusinessEmail,
  businessPhone,
  setBusinessPhone,
  businessWebsite,
  setBusinessWebsite,
  handleSuggest,
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Business Information</h2>

      <Input
        placeholder="Business Name"
        value={businessName}
        onChange={(e) => setBusinessName(e.target.value)}
        className="bg-black/30 border-0 text-white"
      />

      <div className="space-y-3">
        <Textarea
          placeholder="Describe your business"
          value={businessDescription}
          onChange={(e) => setBusinessDescription(e.target.value)}
          className="bg-black/30 border-0 text-white min-h-[130px]"
        />

        <Button
          onClick={handleSuggest}
          className="bg-white/10 hover:bg-white/20 flex items-center gap-2"
        >
          <Wand2 className="w-4 h-4" />
          Suggest Better Copy
        </Button>
      </div>

      <Input
        placeholder="Business Email"
        value={businessEmail}
        onChange={(e) => setBusinessEmail(e.target.value)}
        className="bg-black/30 border-0 text-white"
      />

      <Input
        placeholder="Phone Number"
        value={businessPhone}
        onChange={(e) => setBusinessPhone(e.target.value)}
        className="bg-black/30 border-0 text-white"
      />

      <Input
        placeholder="Website URL"
        value={businessWebsite}
        onChange={(e) => setBusinessWebsite(e.target.value)}
        className="bg-black/30 border-0 text-white"
      />

      <p className="text-xs text-gray-400">
        The AI assistant will use this info when generating responses.
      </p>
    </div>
  );
}
