import {
  Calendar,
  Briefcase,
  MapPin,
  Phone,
} from "lucide-react";

import { useTheme } from "./ThemeProvider";

/*
========================================
ACTION BUTTON
========================================
*/
function ActionButton({
  icon: Icon,
  label,
  onClick,
}) {
  const theme = useTheme();

  return (
    <button
      type="button"
      onClick={onClick}
      className="
        flex
        items-center
        gap-3

        rounded-2xl

        border

        px-4
        py-3

        text-sm
        font-medium

        transition-all
        duration-200

        hover:-translate-y-0.5
      "
      style={{
        borderColor: theme.border,
        background: "#FFFFFF",
        color: theme.text,
      }}
    >
      <div
        className="
          flex
          h-9
          w-9
          items-center
          justify-center

          rounded-xl
        "
        style={{
          background: theme.primary + "15",
          color: theme.primary,
        }}
      >
        <Icon size={18} />
      </div>

      <span>{label}</span>
    </button>
  );
}

/*
========================================
WELCOME SCREEN
========================================
*/
export default function WelcomeScreen({
  chatbot,
  onBookAppointment,
  onVisitOffice,
  onAskServices,
}) {
  const theme = useTheme();

  const companyName =
    chatbot?.theme?.companyName ||
    chatbot?.name ||
    "Your Company";

  const introduction =
    chatbot?.theme?.introduction ||
    "I'm here to answer your questions, help you book appointments and connect you with our team.";

  const logo =
    chatbot?.theme?.logo || "";

  return (
    <div
      className="
        flex
        flex-1
        flex-col

        overflow-y-auto

        px-6
        py-8
      "
      style={{
        background: theme.background,
      }}
    >
      {/* LOGO */}

      <div className="flex justify-center">

        {logo ? (

          <img
            src={logo}
            alt={companyName}
            className="
              h-20
              w-20

              rounded-3xl

              object-cover

              shadow-md
            "
          />

        ) : (

          <div
            className="
              flex
              h-20
              w-20

              items-center
              justify-center

              rounded-3xl

              text-3xl
              font-bold
            "
            style={{
              background: theme.primary,
              color: "#FFFFFF",
            }}
          >
            {companyName.charAt(0)}
          </div>

        )}

      </div>

      {/* TITLE */}

      <div className="mt-6 text-center">

        <h2
          className="
            text-2xl
            font-bold
          "
          style={{
            color: theme.text,
          }}
        >
          Welcome to {companyName}
        </h2>

        <p
          className="
            mx-auto
            mt-4

            max-w-md

            text-sm
            leading-7
          "
          style={{
            color: theme.muted,
          }}
        >
          {introduction}
        </p>

      </div>

      {/* HOW CAN I HELP */}

      <div className="mt-10">

        <h3
          className="
            mb-4

            text-sm
            font-semibold
          "
          style={{
            color: theme.text,
          }}
        >
          How can I help?
        </h3>

        <div className="grid gap-3">

          <ActionButton
            icon={Calendar}
            label="Book Appointment"
            onClick={onBookAppointment}
          />

          <ActionButton
            icon={Briefcase}
            label="Our Services"
            onClick={onAskServices}
          />

          <ActionButton
            icon={MapPin}
            label="Visit Office"
            onClick={onVisitOffice}
          />

          <ActionButton
            icon={Phone}
            label="Contact Us"
            onClick={() => {}}
          />

        </div>
      </div>
            {/* ========================================
          POPULAR QUESTIONS
      ======================================== */}

      <div className="mt-10">

        <h3
          className="
            mb-4

            text-sm
            font-semibold
          "
          style={{
            color: theme.text,
          }}
        >
          Popular questions
        </h3>

        <div className="flex flex-wrap gap-3">

          {(chatbot?.theme?.suggestedQuestions || [
            "Tell me about your services.",
            "How can I book an appointment?",
            "Where are you located?",
          ]).map((question) => (

            <button
              key={question}
              type="button"
              onClick={() => {
                if (typeof onAskServices === "function") {
                  onAskServices(question);
                }
              }}
              className="
                rounded-full

                border

                px-4
                py-2

                text-xs
                sm:text-sm

                transition-all
                duration-200

                hover:-translate-y-0.5
              "
              style={{
                borderColor: theme.border,
                background: "#FFFFFF",
                color: theme.text,
              }}
            >
              {question}
            </button>

          ))}

        </div>

      </div>

      {/* ========================================
          SPACER
      ======================================== */}

      <div className="flex-1" />

      {/* ========================================
          FOOTER
      ======================================== */}

      <div className="mt-10 text-center">

        <p
          className="
            text-xs
          "
          style={{
            color: theme.muted,
          }}
        >
          Powered by
        </p>

        <h4
          className="
            mt-1

            text-sm
            font-semibold
          "
          style={{
            color: theme.primary,
          }}
        >
          AIAERA
        </h4>

      </div>
          </div>
  );
}