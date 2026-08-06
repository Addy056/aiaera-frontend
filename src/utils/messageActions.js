export function detectAction(url = "") {
  const value = url.toLowerCase();

  if (!value)
    return null;

  if (
    value.includes("calendly.com")
  ) {
    return {
      type: "booking",
      text: "Schedule Meeting",
    };
  }

  if (
    value.includes("google.com/maps") ||
    value.includes("maps.app.goo.gl")
  ) {
    return {
      type: "location",
      text: "Open Google Maps",
    };
  }

  if (
    value.includes("wa.me") ||
    value.includes("whatsapp.com")
  ) {
    return {
      type: "whatsapp",
      text: "Chat on WhatsApp",
    };
  }

  if (
    value.includes("zoom.us")
  ) {
    return {
      type: "zoom",
      text: "Join Zoom Meeting",
    };
  }

  if (
    value.includes("meet.google.com")
  ) {
    return {
      type: "meet",
      text: "Join Google Meet",
    };
  }

  if (
    value.includes("teams.microsoft.com")
  ) {
    return {
      type: "teams",
      text: "Join Microsoft Teams",
    };
  }

  if (
    value.startsWith("mailto:")
  ) {
    return {
      type: "email",
      text: "Send Email",
    };
  }

  if (
    value.startsWith("tel:")
  ) {
    return {
      type: "phone",
      text: "Call Now",
    };
  }

  return {
    type: "website",
    text: "Open Link",
  };
}

export function extractFirstUrl(text = "") {
  const match =
    text.match(
      /(https?:\/\/[^\s]+)/i
    );

  return match
    ? match[0]
    : null;
}