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
  address = "",
  buttonText = "Open in Google Maps",
  mapsLink = "",
}) {
  const theme = useTheme();

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
        className="text-base font-semibold"
        style={{
          color: theme.text,
        }}
      >
        {title}
      </h3>

      {/* ADDRESS (only if available) */}
      {address && (
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
      )}

      {/* BUTTON */}
      {mapsLink ? (
        <a
          href={mapsLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open office location in Google Maps"
          title="Open Google Maps"
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
            hover:opacity-90
            focus:outline-none
            focus:ring-2
            focus:ring-offset-2
          "
          style={{
            background: theme.primary,
            color: "#FFFFFF",
          }}
        >
          <Navigation size={18} />
          <span>{buttonText}</span>
        </a>
      ) : (
        <button
          type="button"
          disabled
          aria-disabled="true"
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
            cursor-not-allowed
            opacity-50
          "
          style={{
            background: theme.primary,
            color: "#FFFFFF",
          }}
        >
          <Navigation size={18} />
          <span>{buttonText}</span>
        </button>
      )}
    </div>
  );
}