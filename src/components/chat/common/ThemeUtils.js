/*
==================================================
AIAERA THEME UTILITIES
==================================================
*/

const DEFAULT_THEME = {
  companyName: "Business",

  assistantName: "Business Assistant",

  logo: "",

  primary: "#7C3AED",

  background: "#F8FAFC",

  surface: "#FFFFFF",

  userBubble: "#7C3AED",

  botBubble: "#FFFFFF",

  text: "#0F172A",

  muted: "#64748B",

  border: "#E2E8F0",

  shadow: "0 18px 60px -24px rgba(15,23,42,.22)",

  radius: 24,
};

/*
==================================================
HEX TO RGBA
==================================================
*/

export function hexToRGBA(
  hex,
  alpha = 1
) {
  if (!hex) {
    return `rgba(124,58,237,${alpha})`;
  }

  const clean = hex.replace("#", "");

  if (clean.length !== 6) {
    return `rgba(124,58,237,${alpha})`;
  }

  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);

  return `rgba(${r},${g},${b},${alpha})`;
}

/*
==================================================
LIGHT COLOR
==================================================
*/

export function isLightColor(
  color = "#FFFFFF"
) {
  const hex = color.replace("#", "");

  if (hex.length !== 6) {
    return false;
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const brightness =
    (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 180;
}

/*
==================================================
BUILD THEME
==================================================
*/

export function buildTheme(chatbot) {
  const raw = chatbot?.theme || {};

  const primary =
    raw.brandColor ||
    raw.userBubble ||
    DEFAULT_THEME.primary;

  /*
  ========================================
  COMPANY NAME
  ========================================
  */

  const companyName =
    raw.companyName ||
    chatbot?.company_name ||
    chatbot?.business_name ||
    chatbot?.name ||
    chatbot?.bot_name ||
    DEFAULT_THEME.companyName;

  /*
  ========================================
  ASSISTANT NAME
  ========================================
  */

  const assistantName =
    raw.assistantName ||
    chatbot?.assistant_name ||
    chatbot?.assistantName ||
    `${companyName} Assistant`;

  return {
    /*
    ========================================
    BRANDING
    ========================================
    */

    companyName,

    assistantName,

    logo:
      raw.logo ||
      chatbot?.logo ||
      chatbot?.business_logo ||
      DEFAULT_THEME.logo,

    /*
    ========================================
    COLORS
    ========================================
    */

    primary,

    background:
      raw.chatBg ||
      DEFAULT_THEME.background,

    surface:
      DEFAULT_THEME.surface,

    userBubble:
      raw.userBubble ||
      primary,

    botBubble:
      raw.botBubble ||
      DEFAULT_THEME.botBubble,

    text:
      raw.textColor ||
      DEFAULT_THEME.text,

    muted:
      DEFAULT_THEME.muted,

    border:
      DEFAULT_THEME.border,

    /*
    ========================================
    STYLES
    ========================================
    */

    radius:
      raw.radius ||
      DEFAULT_THEME.radius,

    shadow:
      DEFAULT_THEME.shadow,

    /*
    ========================================
    GENERATED COLORS
    ========================================
    */

    primarySoft:
      hexToRGBA(primary, 0.08),

    primaryLight:
      hexToRGBA(primary, 0.15),

    primaryBorder:
      hexToRGBA(primary, 0.22),

    isUserBubbleLight:
      isLightColor(
        raw.userBubble ||
        primary
      ),
  };
}

export default buildTheme;