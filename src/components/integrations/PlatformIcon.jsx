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
  // Existing
  whatsapp: MessageCircle,
  facebook: MessageSquare,
  FaInstagram: FaInstagram,
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