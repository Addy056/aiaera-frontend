export default function GlassCard({ className = "", children }) {
  return (
    <div
      className={`rounded-2xl
                  bg-[#0f0f1a]
                  border border-white/10
                  p-6
                  shadow-[0_20px_60px_rgba(0,0,0,0.55)]
                  ${className}`}
    >
      {children}
    </div>
  );
}
