export default function AutomationToggle({
  enabled,
  onChange,
}) {

  return (
    <button
      type="button"
      onClick={() =>
        onChange(!enabled)
      }
      className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
        enabled
          ? "bg-[#7f5af0]"
          : "bg-white/10"
      }`}
    >

      <div
        className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all duration-300 ${
          enabled
            ? "left-7"
            : "left-1"
        }`}
      />

    </button>
  );
}