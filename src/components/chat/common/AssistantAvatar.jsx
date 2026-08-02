import { Building2 } from "lucide-react";

import { useTheme } from "./ThemeProvider";

/*
========================================
ASSISTANT AVATAR
========================================
*/

export default function AssistantAvatar({
  chatbot,
  size = 48,
  className = "",
}) {
  const theme = useTheme();

  const logo =
    chatbot?.theme?.logo ||
    theme.logo;

  const companyName =
    chatbot?.theme?.companyName ||
    chatbot?.name ||
    theme.companyName;

  return (
    <div
      className={`
        shrink-0
        overflow-hidden
        rounded-2xl
        shadow-sm
        ${className}
      `}
      style={{
        width: size,
        height: size,
        background: theme.primarySoft,
        border: `1px solid ${theme.primaryBorder}`,
      }}
    >
      {logo ? (
        <img
          src={logo}
          alt={companyName}
          className="h-full w-full object-cover"
        />
      ) : (
        <div
          className="
            flex
            h-full
            w-full
            items-center
            justify-center
          "
        >
          {companyName ? (
            <span
              className="font-semibold"
              style={{
                color: theme.primary,
                fontSize: size * 0.42,
              }}
            >
              {companyName.charAt(0).toUpperCase()}
            </span>
          ) : (
            <Building2
              size={size * 0.45}
              color={theme.primary}
            />
          )}
        </div>
      )}
    </div>
  );
}