import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Loader2,
  Save,
  X,
} from "lucide-react";

export default function SaveBar({
  visible = false,
  saving = false,
  hasChanges = false,
  onSave,
  onDiscard,
  saveText = "Save Changes",
  discardText = "Discard",
}) {
  return (
    <AnimatePresence>
      {visible && hasChanges && (
        <motion.div
          initial={{
            opacity: 0,
            y: 100,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: 100,
          }}
          transition={{
            duration: 0.25,
          }}
          className="
            fixed
            bottom-6
            left-1/2
            z-50
            w-[calc(100%-2rem)]
            max-w-4xl
            -translate-x-1/2
          "
        >
          <div
            className="
              flex
              flex-col
              gap-4
              rounded-2xl
              border
              border-slate-200
              bg-white/95
              p-5
              shadow-2xl
              backdrop-blur-xl
              dark:border-slate-800
              dark:bg-slate-950/95
              md:flex-row
              md:items-center
              md:justify-between
            "
          >
            {/* Left */}
            <div className="flex items-center gap-4">
              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  bg-blue-100
                  text-blue-600
                  dark:bg-blue-500/10
                  dark:text-blue-400
                "
              >
                {saving ? (
                  <Loader2
                    size={22}
                    className="animate-spin"
                  />
                ) : (
                  <CheckCircle2 size={22} />
                )}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {saving
                    ? "Saving your changes..."
                    : "Unsaved changes"}
                </h3>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {saving
                    ? "Please wait while we update your integrations."
                    : "You have pending changes that haven't been saved yet."}
                </p>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={saving}
                onClick={onDiscard}
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-slate-300
                  bg-white
                  px-5
                  py-2.5
                  text-sm
                  font-medium
                  text-slate-700
                  transition
                  hover:bg-slate-100
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  dark:border-slate-700
                  dark:bg-slate-900
                  dark:text-slate-300
                  dark:hover:bg-slate-800
                "
              >
                <X size={16} />

                {discardText}
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={onSave}
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-blue-600
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  shadow-lg
                  transition
                  hover:bg-blue-700
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {saving ? (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                ) : (
                  <Save size={16} />
                )}

                {saving ? "Saving..." : saveText}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}