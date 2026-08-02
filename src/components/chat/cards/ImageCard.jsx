import {
  ExternalLink,
  Image as ImageIcon,
} from "lucide-react";

import { useState } from "react";
import { useTheme } from "../common/ThemeProvider";

/*
========================================
IMAGE CARD
========================================
*/

export default function ImageCard({
  image = "",
  title = "",
  description = "",
  link = "",
}) {
  const theme = useTheme();

  const [loaded, setLoaded] =
    useState(false);

  const [failed, setFailed] =
    useState(false);

  return (
    <div
      className="
        w-full
        overflow-hidden
        rounded-3xl
        border
        bg-white
        shadow-sm
      "
      style={{
        borderColor: theme.border,
      }}
    >
      {/* IMAGE */}

      <div
        className="
          relative
          aspect-[16/9]
          w-full
          overflow-hidden
        "
        style={{
          background: theme.primarySoft,
        }}
      >
        {!failed && image ? (
          <>
            {!loaded && (
              <div
                className="
                  absolute
                  inset-0
                  animate-pulse
                "
                style={{
                  background:
                    theme.primarySoft,
                }}
              />
            )}

            <img
              src={image}
              alt={title}
              className="
                h-full
                w-full
                object-cover
                transition-transform
                duration-300
                hover:scale-105
              "
              onLoad={() =>
                setLoaded(true)
              }
              onError={() =>
                setFailed(true)
              }
            />
          </>
        ) : (
          <div
            className="
              flex
              h-full
              items-center
              justify-center
            "
          >
            <ImageIcon
              size={40}
              color={theme.primary}
            />
          </div>
        )}
      </div>

      {/* CONTENT */}

      <div className="p-5">

        {title && (
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
        )}

        {description && (
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
        )}

        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="
              mt-5
              inline-flex
              items-center
              gap-2
              rounded-xl
              px-4
              py-2
              text-sm
              font-medium
              transition-all
            "
            style={{
              background:
                theme.primary,
              color: "#FFFFFF",
            }}
          >
            Learn More

            <ExternalLink
              size={16}
            />
          </a>
        )}
      </div>
    </div>
  );
}