export default function InfoBox({
  children,
}) {
  return (
    <div
      className="
        rounded-xl
        border
        border-slate-200
        bg-slate-50
        px-4
        py-3
        text-sm
        leading-6
        text-slate-600
      "
    >
      {children}
    </div>
  );
}