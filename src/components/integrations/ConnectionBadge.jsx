export default function ConnectionBadge({
  status,
}) {

  const styles = {
    connected:
      "bg-green-500/15 text-green-400 border-green-500/20",

    disconnected:
      "bg-red-500/15 text-red-400 border-red-500/20",

    pending:
      "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  };

  return (
    <div
      className={`px-3 py-1 rounded-full text-xs border ${styles[status]}`}
    >
      {status === "connected"
        ? "Connected"
        : status === "pending"
        ? "Pending"
        : "Not Connected"}
    </div>
  );
}