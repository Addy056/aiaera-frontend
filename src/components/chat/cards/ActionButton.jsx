import {
  Calendar,
  MapPin,
  Globe,
  Phone,
  Mail,
  MessageCircle,
  Video,
  Download,
  ExternalLink,
} from "lucide-react";

const ICONS = {
  booking: Calendar,
  location: MapPin,
  website: Globe,
  phone: Phone,
  email: Mail,
  whatsapp: MessageCircle,
  zoom: Video,
  meet: Video,
  teams: Video,
  download: Download,
  default: ExternalLink,
};

export default function ActionButton({
  type = "default",
  href,
  text,
}) {
  if (!href) return null;

  const Icon = ICONS[type] || ICONS.default;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="
        mt-4
        inline-flex
        items-center
        gap-2

        rounded-xl

        bg-violet-600
        px-4
        py-3

        text-sm
        font-semibold
        text-white

        transition-all
        duration-200

        hover:bg-violet-700
        hover:scale-[1.02]

        active:scale-[0.98]
      "
    >
      <Icon size={18} />
      {text}
    </a>
  );
}