import {
  MapPin,
  Navigation,
} from "lucide-react";

import { useTheme } from "../common/ThemeProvider";

/*
========================================
LOCATION CARD
========================================
*/

export default function LocationCard({
  title = "Visit Our Office",
  address = "Our office location",
  buttonText = "Open in Google Maps",
  mapsLink = "",
}) {
  const theme = useTheme();

  const handleOpen = () => {
    if (!mapsLink) return;

    window.open(
      mapsLink,
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
        <MapPin
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

      {/* ADDRESS */}

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
        {address}
      </p>

      {/* BUTTON */}

      <button
        type="button"
        onClick={handleOpen}
        disabled={!mapsLink}
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
        <Navigation size={18} />

        <span>{buttonText}</span>
      </button>
    </div>
  );
}