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
} from "lucide-react";

import { FaInstagram } from "react-icons/fa";

const icons = {
  // Communication
  whatsapp: MessageCircle,
  facebook: MessageSquare,
  instagram: FaInstagram,

  // Providers
  meta: Boxes,
  calendly: Calendar,
  meetings: Calendar,
  maps: MapPinned,

  // Categories
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
  const Icon = icons[type] || Boxes;

  return (
    <Icon
      size={size}
      strokeWidth={2}
      className={`shrink-0 ${className}`}
    />
  );
}