export default function SetupStep({
  step,
  title,
  desc,
}) {

  return (
    <div className="flex gap-4">

      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-50 text-sm font-semibold text-violet-600">

        {step}

      </div>

      <div>

        <h3 className="mb-1 text-sm font-medium text-slate-900">
          {title}
        </h3>

        <p className="text-xs leading-relaxed text-slate-600">
          {desc}
        </p>

      </div>

    </div>
  );
}