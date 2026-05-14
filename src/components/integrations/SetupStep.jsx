export default function SetupStep({
  step,
  title,
  desc,
}) {

  return (
    <div className="flex gap-4">

      <div className="w-8 h-8 rounded-xl bg-[#7f5af0]/20 text-purple-400 flex items-center justify-center text-sm font-semibold">

        {step}

      </div>

      <div>

        <h3 className="text-sm font-medium text-white mb-1">
          {title}
        </h3>

        <p className="text-xs text-gray-400 leading-relaxed">
          {desc}
        </p>

      </div>

    </div>
  );
}