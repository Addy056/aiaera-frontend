import SetupStep from "./SetupStep";

export default function FacebookSetupModal({
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
              Connect Facebook Messenger
            </h2>

            <p className="text-sm text-gray-400">
              Enable AI auto replies for Facebook Messenger.
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
            title="Create Meta App"
            desc="Go to Meta Developers and create a Business App."
          />

          <SetupStep
            step="2"
            title="Add Messenger Product"
            desc="Enable Messenger product inside your Meta dashboard."
          />

          <SetupStep
            step="3"
            title="Generate Page Token"
            desc="Generate a Page Access Token for your Facebook page."
          />

          <SetupStep
            step="4"
            title="Paste Credentials"
            desc="Add your Page ID and Access Token inside AIAERA."
          />

        </div>

      </div>

    </div>
  );
}