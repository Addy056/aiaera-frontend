import {
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";

const variants = {
  connected: {
    label: "Connected",
    icon: CheckCircle2,
    className:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  },

  pending: {
    label: "Pending",
    icon: Clock3,
    className:
      "border-amber-500/20 bg-amber-500/10 text-amber-400",
  },

  disconnected: {
    label: "Not Connected",
    icon: XCircle,
    className:
      "border-red-500/20 bg-red-500/10 text-red-400",
  },
};

export default function ConnectionBadge({
  status = "disconnected",
}) {
  const config =
    variants[status] ||
    variants.disconnected;

  const Icon = config.icon;

  return (
    <div
      className={`
        inline-flex
        items-center
        gap-2
        rounded-full
        border
        px-3
        py-1.5
        text-xs
        font-medium
        transition-all
        ${config.className}
      `}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-40" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
      </span>

      <Icon size={14} />

      {config.label}
    </div>
  );
}