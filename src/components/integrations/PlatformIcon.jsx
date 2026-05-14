import {
  MessageCircle,
  MessageSquare,
  Calendar,
  MapPinned,
} from "lucide-react";

export default function PlatformIcon({
  type,
}) {

  switch (type) {

    case "whatsapp":
      return <MessageCircle size={20} />;

    case "facebook":
      return <MessageSquare size={20} />;

    case "calendly":
      return <Calendar size={20} />;

    case "maps":
      return <MapPinned size={20} />;

    default:
      return null;
  }
}