import { KeyRound } from "lucide-react";

export default function IntegrationInput(props) {

  return (
    <div className="relative">

      <KeyRound
        size={15}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
      />

      <input
        {...props}
        className="w-full h-12 rounded-2xl bg-black/20 border border-white/10 pl-11 pr-4 text-sm text-white placeholder-gray-500 outline-none focus:border-[#7f5af0] transition-all"
      />

    </div>
  );
}