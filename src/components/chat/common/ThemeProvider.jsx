import {
  createContext,
  useContext,
  useMemo,
} from "react";

import { buildTheme } from "./ThemeUtils";

/*
========================================
CONTEXT
========================================
*/

const ThemeContext =
  createContext(null);

/*
========================================
THEME PROVIDER
========================================
*/

export function ThemeProvider({
  chatbot,
  children,
}) {
  const theme = useMemo(
    () => buildTheme(chatbot),
    [chatbot]
  );

  return (
    <ThemeContext.Provider
      value={theme}
    >
      {children}
    </ThemeContext.Provider>
  );
}

/*
========================================
HOOK
========================================
*/

export function useTheme() {
  const context =
    useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider."
    );
  }

  return context;
}

export default ThemeProvider;