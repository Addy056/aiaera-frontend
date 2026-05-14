import SetupStep from "./SetupStep";

export default function InstagramSetupModal({
  open,
  onClose,
}) {

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">

      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0f0f12] p-8">

        <div className="flex items-center justify-between mb-8">

          <div>

            <h2 className="text-2xl font-bold text-white mb-2">
              Connect Instagram DM
            </h2>

            <p className="text-sm text-gray-400">
              Automate Instagram conversations using AI.
            </p>

          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>

        </div>

        <div className="space-y-6">

          <SetupStep
            step="1"
            title="Switch to Business Account"
            desc="Instagram automation only works with Business accounts."
          />

          <SetupStep
            step="2"
            title="Link Facebook Page"
            desc="Connect your Instagram account to a Facebook page."
          />

          <SetupStep
            step="3"
            title="Enable Instagram Messaging"
            desc="Enable Instagram Messaging inside Meta dashboard."
          />

          <SetupStep
            step="4"
            title="Paste Credentials"
            desc="Add Business ID and Access Token into AIAERA."
          />

        </div>

      </div>

    </div>
  );
}