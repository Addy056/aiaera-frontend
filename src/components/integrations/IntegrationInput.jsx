import { KeyRound } from "lucide-react";

export default function IntegrationInput({
  className = "",
  ...props
}) {
  return (
    <div className="relative">
      <KeyRound
        size={16}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        {...props}
        className={`
          h-11
          w-full
          rounded-xl
          border
          border-slate-200
          bg-white
          pl-11
          pr-4
          text-sm
          text-slate-800
          placeholder:text-slate-400
          shadow-sm
          outline-none
          transition-all
          duration-200
          hover:border-slate-300
          focus:border-violet-500
          focus:ring-4
          focus:ring-violet-100
          disabled:cursor-not-allowed
          disabled:bg-slate-100
          disabled:text-slate-400
          ${className}
        `}
      />
    </div>
  );
}