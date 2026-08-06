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
py-2.5

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
          h-8
          w-8
          items-center
          justify-center

          rounded-xl
        "
        style={{
          background: theme.primary + "15",
          color: theme.primary,
        }}
      >
        <Icon size={16} />
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
  onContactUs,
}) {
  const theme = useTheme();

 const companyName =
  theme.companyName ||
  chatbot?.name ||
  "Your Company";

const introduction =
  theme.introduction ||
  chatbot?.theme?.introduction ||
  "Ask me anything or choose one of the options below.";

const logo =
  theme.logo ||
  chatbot?.theme?.logo ||
  "";

  return (
    <div
      className="
        flex
        flex-1
        flex-col

        overflow-y-auto

        px-5
        py-5
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
              h-14
              w-14

              rounded-2xl

              object-cover

              shadow-md
            "
          />

        ) : (

          <div
            className="
              flex
              h-14
              w-14
          

              items-center
              justify-center

              rounded-2xl

              text-xl
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

      <div className="mt-2 text-center">
<h2
  className="
    text-xl
    font-bold
  "
  style={{
    color: theme.text,
  }}
>
  {theme.welcomeTitle || `Hi, I'm ${companyName} Assistant 👋`}
</h2>

        <p
          className="
            mx-auto
            mt-2

            max-w-md

            text-sm
            leading-6
          "
          style={{
            color: theme.muted,
          }}
        >
          {introduction}
        </p>

      </div>

      {/* HOW CAN I HELP */}

      <div className="mt-6">

        <h3
          className="
            mb-3

            text-sm
            font-semibold
          "
          style={{
            color: theme.text,
          }}
        >
          How can I help?
        </h3>

        <div className="grid gap-2">

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
  onClick={onContactUs}
/>

        </div>
      </div>
            {/* ========================================
          POPULAR QUESTIONS
      ======================================== */}

      <div className="mt-6">

        <h3
          className="
            mb-3

            text-sm
            font-semibold
          "
          style={{
            color: theme.text,
          }}
        >
          Popular questions
        </h3>

        <div className="flex flex-wrap gap-2">

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

               px-3
py-1.5
                text-xs
               

                transition-all
                duration-200

                hover:-translate-y-0.5
hover:shadow-md
hover:border-slate-300
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

    </div>
  );
}