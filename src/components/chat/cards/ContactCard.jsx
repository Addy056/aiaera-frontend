import {
  Phone,
  Mail,
  Globe,
  MessageCircle,
} from "lucide-react";

import { useTheme } from "../common/ThemeProvider";

/*
========================================
CONTACT ITEM
========================================
*/

function ContactButton({
  icon: Icon,
  label,
  value,
  href,
}) {
  const theme = useTheme();

  if (!value) return null;

  return (
    <a
      href={href}
      target={
        href.startsWith("http")
          ? "_blank"
          : undefined
      }
      rel="noopener noreferrer"
      className="
        flex
        items-center
        gap-3

        rounded-2xl

        border

        px-4
        py-3

        transition-all
        duration-200

        hover:-translate-y-0.5
      "
      style={{
        borderColor: theme.border,
        color: theme.text,
        background: "#FFFFFF",
      }}
    >
      <div
        className="
          flex
          h-10
          w-10
          items-center
          justify-center

          rounded-xl
        "
        style={{
          background: theme.primarySoft,
        }}
      >
        <Icon
          size={18}
          color={theme.primary}
        />
      </div>

      <div className="min-w-0 flex-1">
        <p
          className="text-xs"
          style={{
            color: theme.muted,
          }}
        >
          {label}
        </p>

        <p
          className="
            truncate

            text-sm
            font-medium
          "
        >
          {value}
        </p>
      </div>
    </a>
  );
}

/*
========================================
CONTACT CARD
========================================
*/

export default function ContactCard({
  phone = "",
  email = "",
  website = "",
  whatsapp = "",
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
      "
      style={{
        borderColor: theme.border,
      }}
    >
      <h3
        className="
          mb-4

          text-base
          font-semibold
        "
        style={{
          color: theme.text,
        }}
      >
        Contact Us
      </h3>

      <div className="space-y-3">

        <ContactButton
          icon={Phone}
          label="Phone"
          value={phone}
          href={`tel:${phone}`}
        />

        <ContactButton
          icon={Mail}
          label="Email"
          value={email}
          href={`mailto:${email}`}
        />

        <ContactButton
          icon={Globe}
          label="Website"
          value={website}
          href={website}
        />

        <ContactButton
          icon={MessageCircle}
          label="WhatsApp"
          value={whatsapp}
          href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
        />

      </div>
    </div>
  );
}