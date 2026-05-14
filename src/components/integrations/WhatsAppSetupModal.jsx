import SetupStep from "./SetupStep";

export default function WhatsAppSetupModal({
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
              Connect WhatsApp
            </h2>

            <p className="text-sm text-gray-400">
              Complete Meta setup in a few minutes.
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
            title="Create Meta Developer App"
            desc="Go to Meta Developers and create a new application."
          />

          <SetupStep
            step="2"
            title="Enable WhatsApp Cloud API"
            desc="Add WhatsApp product inside your Meta App dashboard."
          />

          <SetupStep
            step="3"
            title="Copy Access Token"
            desc="Generate a permanent token from API setup section."
          />

          <SetupStep
            step="4"
            title="Copy Phone Number ID"
            desc="Paste the phone number ID into AIAERA integrations."
          />

        </div>

      </div>

    </div>
  );
}