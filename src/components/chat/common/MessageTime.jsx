import { useMemo } from "react";

/*
========================================
FORMAT TIME
========================================
*/

function formatTime(date) {
  if (!date) return "";

  const value =
    date instanceof Date
      ? date
      : new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "";
  }

  return value.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/*
========================================
MESSAGE TIME
========================================
*/

export default function MessageTime({
  timestamp,
  className = "",
}) {
  const formatted = useMemo(
    () => formatTime(timestamp),
    [timestamp]
  );

  if (!formatted) return null;

  return (
    <span
      className={`
        select-none

        text-[11px]

        leading-none

        ${className}
      `}
      style={{
        color: "#94A3B8",
      }}
    >
      {formatted}
    </span>
  );
}