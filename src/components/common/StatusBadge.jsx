export default function StatusBadge({ status, variant = "default" }) {
  const classes = {
    default: "border-slate-200 bg-slate-50 text-slate-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    warning: "border-amber-200 bg-amber-50 text-amber-700",
    danger: "border-red-200 bg-red-50 text-red-700",
    info: "border-violet-200 bg-violet-50 text-violet-700",
  };

  const normalized = String(status || "").toLowerCase();
  const tone =
    normalized === "accepted" || normalized === "active" || normalized === "completed"
      ? "success"
      : normalized === "pending"
        ? "warning"
        : normalized === "rejected" || normalized === "expired"
          ? "danger"
          : normalized === "info"
            ? "info"
            : variant;

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${classes[tone]}`}>
      {status || "Unknown"}
    </span>
  );
}
