import {
  Calendar,
  MapPin,
  MessageCircle,
} from "lucide-react";

/*
========================================
HELPER
========================================
*/
const hexToRGBA = (
  hex = "#7C3AED",
  alpha = 0.1
) => {
  const clean = hex.replace("#", "");

  if (clean.length !== 6) {
    return `rgba(124,58,237,${alpha})`;
  }

  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function QuickActions({
  chatbot,
  integrations = {},
  onBookAppointment,
  onVisitOffice,
  onAskServices,
}) {
  const theme = chatbot?.theme || {};

  const accentColor =
    theme.userBubble || "#7C3AED";

  const hoverBackground =
    hexToRGBA(accentColor, 0.08);

  const actions = [];

  if (integrations?.meeting_link) {
    actions.push({
      id: "appointment",
      label: "Book Appointment",
      icon: Calendar,
      onClick: onBookAppointment,
      enabled: typeof onBookAppointment === "function",
    });
  }

  if (integrations?.maps_link) {
    actions.push({
      id: "location",
      label: "Visit Office",
      icon: MapPin,
      onClick: onVisitOffice,
      enabled: typeof onVisitOffice === "function",
    });
  }

  actions.push({
    id: "services",
    label: "Our Services",
    icon: MessageCircle,
    onClick: onAskServices,
    enabled: typeof onAskServices === "function",
  });

  if (!actions.length) return null;

  return (
    <div className="shrink-0 border-b border-slate-200 bg-white px-4 py-3 sm:px-6 sm:py-4">
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.id}
              type="button"
              disabled={!action.enabled}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                if (!action.enabled) return;

                action.onClick(action.id);
              }}
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                px-3
                py-2
                sm:px-4
                text-xs
                sm:text-sm
                font-medium
                shadow-sm
                transition-all
                duration-200
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
              style={{
                background: "#FFFFFF",
                borderColor: "#E2E8F0",
                color: "#475569",
              }}
              onMouseEnter={(e) => {
                if (!action.enabled) return;

                e.currentTarget.style.borderColor =
                  accentColor;

                e.currentTarget.style.background =
                  hoverBackground;

                e.currentTarget.style.color =
                  accentColor;

                e.currentTarget.style.transform =
                  "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor =
                  "#E2E8F0";

                e.currentTarget.style.background =
                  "#FFFFFF";

                e.currentTarget.style.color =
                  "#475569";

                e.currentTarget.style.transform =
                  "translateY(0)";
              }}
            >
              <Icon size={16} />
              <span>{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}