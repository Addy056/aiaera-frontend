import { useTheme } from "./ThemeProvider";

/*
========================================
ONLINE INDICATOR
========================================
*/

export default function OnlineIndicator({
  status = "online",
  showText = true,
  className = "",
}) {
  const theme = useTheme();

  const statusConfig = {
    online: {
      label: "Online",
      color: "#22C55E",
    },

    away: {
      label: "Away",
      color: "#F59E0B",
    },

    offline: {
      label: "Offline",
      color: "#94A3B8",
    },
  };

  const current =
    statusConfig[status] ||
    statusConfig.online;

  return (
    <div
      className={`
        inline-flex
        items-center
        gap-2
        ${className}
      `}
    >
      <span
        className="
          h-2.5
          w-2.5
          rounded-full
        "
        style={{
          background: current.color,
          boxShadow: `0 0 8px ${current.color}66`,
        }}
      />

      {showText && (
        <span
          className="
            text-xs
            font-medium
          "
          style={{
            color: theme.muted,
          }}
        >
          {current.label}
        </span>
      )}
    </div>
  );
}