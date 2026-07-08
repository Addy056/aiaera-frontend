import {
  MessageCircle,
  MessageSquare,
  Calendar,
  MapPinned,
  Boxes,
  Building2,
  Briefcase,
  Slack,
  Workflow,
  CreditCard,
  Store,
  Globe,
  MonitorSmartphone,
  Instagram,
} from "lucide-react";

const icons = {
  // Existing
  whatsapp: MessageCircle,
  facebook: MessageSquare,
  instagram: Instagram,
  calendly: Calendar,
  maps: MapPinned,

  // Providers
  meta: Boxes,
  meetings: Calendar,
  business: Building2,
  productivity: Briefcase,
  payments: CreditCard,

  // Future
  google: Globe,
  microsoft: MonitorSmartphone,
  slack: Slack,
  zapier: Workflow,
  shopify: Store,
  stripe: CreditCard,
};

export default function PlatformIcon({
  type,
  size = 20,
  className = "",
}) {
  const Icon =
    icons[type] || Boxes;

  return (
    <Icon
      size={size}
      className={className}
    />
  );
}