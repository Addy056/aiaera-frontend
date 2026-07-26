export default function AutomationToggle({
  enabled = false,
  onChange,
  disabled = false,
  label,
}) {
  return (
    <div className="flex items-center gap-3">
      {label && (
        <span className="text-sm font-medium text-slate-600">
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
          h-7
          w-12
          rounded-full
          transition-all
          duration-200
          border
          focus:outline-none
          focus:ring-4
          focus:ring-violet-100
          ${
            disabled
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer"
          }
          ${
            enabled
              ? "border-violet-600 bg-violet-600"
              : "border-slate-300 bg-slate-200"
          }
        `}
      >
        <span
          className={`
            absolute
            top-0.5
            flex
            h-6
            w-6
            items-center
            justify-center
            rounded-full
            bg-white
            shadow
            transition-all
            duration-200
            ${
              enabled
                ? "left-[22px]"
                : "left-0.5"
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