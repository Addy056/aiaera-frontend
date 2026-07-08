export default function AutomationToggle({
  enabled = false,
  onChange,
  disabled = false,
  label,
}) {
  return (
    <div className="flex items-center gap-3">
      {label && (
        <span className="text-sm text-gray-300">
          {label}
        </span>
      )}

      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-disabled={disabled}
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            onChange(!enabled);
          }
        }}
        className={`
          relative
          h-8
          w-14
          rounded-full
          transition-all
          duration-300
          focus:outline-none
          focus:ring-2
          focus:ring-purple-500/40
          ${
            disabled
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer"
          }
          ${
            enabled
              ? "bg-[#7f5af0]"
              : "bg-white/10"
          }
        `}
      >
        <span
          className={`
            absolute
            top-1
            flex
            h-6
            w-6
            items-center
            justify-center
            rounded-full
            bg-white
            shadow-md
            transition-all
            duration-300
            ${
              enabled
                ? "left-7"
                : "left-1"
            }
          `}
        />

        <span className="sr-only">
          Toggle automation
        </span>
      </button>
    </div>
  );
}