export default function GlassCard({ className = "", children }) {
  return (
    <div className={`glass rounded-xl3 p-6 ${className}`}>
      {children}
    </div>
  );
}
