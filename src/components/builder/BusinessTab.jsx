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
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-white tracking-tight">
          Business Information
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          This information helps your AI respond accurately to customers.
        </p>
      </div>

      <Input
        placeholder="Business Name"
        value={businessName}
        onChange={(e) => setBusinessName(e.target.value)}
      />

      <div className="space-y-3">
        <Textarea
          placeholder="Describe your business, products, and services"
          value={businessDescription}
          onChange={(e) => setBusinessDescription(e.target.value)}
          className="min-h-[140px]"
        />

        <Button
          variant="secondary"
          onClick={handleSuggest}
          className="flex items-center gap-2 text-sm"
        >
          <Wand2 className="w-4 h-4" />
          Suggest better copy
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Input
          placeholder="Business Email"
          value={businessEmail}
          onChange={(e) => setBusinessEmail(e.target.value)}
        />

        <Input
          placeholder="Phone Number"
          value={businessPhone}
          onChange={(e) => setBusinessPhone(e.target.value)}
        />
      </div>

      <Input
        placeholder="Website URL"
        value={businessWebsite}
        onChange={(e) => setBusinessWebsite(e.target.value)}
      />

      <p className="text-xs text-gray-400">
        The AI assistant will use this information when generating responses.
      </p>
    </div>
  );
}
