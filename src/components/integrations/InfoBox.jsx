export default function InfoBox({
  children,
}) {

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-xs text-gray-400 leading-relaxed">
      {children}
    </div>
  );
}