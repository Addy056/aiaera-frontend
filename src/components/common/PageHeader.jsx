import { Link } from "react-router-dom";

export default function PageHeader({
  eyebrow,
  title,
  description,
  actionLabel,
  actionTo,
  actionVariant = "primary",
  children,
}) {
  const actionClasses =
    actionVariant === "secondary"
      ? "rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
      : "rounded-xl bg-violet-600 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-violet-700";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          {eyebrow ? (
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-violet-600">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
          {description ? <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p> : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {children}
          {actionLabel && actionTo ? (
            <Link to={actionTo} className={actionClasses}>
              {actionLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
