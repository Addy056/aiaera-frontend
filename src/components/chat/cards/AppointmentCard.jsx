import { Calendar, ArrowRight } from "lucide-react";

import { useTheme } from "../common/ThemeProvider";

/*
========================================
APPOINTMENT CARD
========================================
*/

export default function AppointmentCard({
  title = "Book an Appointment",
  description = "Choose a convenient time to meet with our team.",
  buttonText = "Open Calendar",
  meetingLink = "",
}) {
  const theme = useTheme();

  const handleClick = () => {
    if (!meetingLink) return;

    window.open(
      meetingLink,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div
      className="
        w-full

        rounded-3xl

        border

        bg-white

        p-5

        shadow-sm

        transition-all
        duration-200
      "
      style={{
        borderColor: theme.border,
      }}
    >
      {/* ICON */}

      <div
        className="
          mb-4

          flex

          h-12
          w-12

          items-center
          justify-center

          rounded-2xl
        "
        style={{
          background: theme.primarySoft,
        }}
      >
        <Calendar
          size={22}
          color={theme.primary}
        />
      </div>

      {/* TITLE */}

      <h3
        className="
          text-base

          font-semibold
        "
        style={{
          color: theme.text,
        }}
      >
        {title}
      </h3>

      {/* DESCRIPTION */}

      <p
        className="
          mt-2

          text-sm

          leading-6
        "
        style={{
          color: theme.muted,
        }}
      >
        {description}
      </p>

      {/* BUTTON */}

      <button
        type="button"
        onClick={handleClick}
        disabled={!meetingLink}
        className="
          mt-5

          inline-flex

          w-full

          items-center
          justify-center
          gap-2

          rounded-2xl

          px-4
          py-3

          font-medium

          transition-all
          duration-200

          disabled:cursor-not-allowed
          disabled:opacity-50
        "
        style={{
          background: theme.primary,
          color: "#FFFFFF",
        }}
      >
        <span>{buttonText}</span>

        <ArrowRight size={18} />
      </button>
    </div>
  );
}