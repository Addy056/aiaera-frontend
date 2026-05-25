import { createRoot } from "react-dom/client";

import "./index.css";

import App from "./App.jsx";

/*
========================================
AUTH CONTEXT
========================================
*/
import AuthProvider from "./context/AuthContext.jsx";

/*
========================================
ROOT ELEMENT
========================================
*/
const rootElement =
  document.getElementById("root");

/*
========================================
SAFETY CHECK
========================================
*/
if (!rootElement) {

  throw new Error(
    "❌ Root element not found"
  );
}

/*
========================================
PREVENT DUPLICATE CHATBOT WIDGETS
========================================
*/
const duplicateElements = [

  "aiaera-chatbot-widget",

  "aiaera-chatbot-button",

  "aiaera-chatbot-iframe",

];

/*
========================================
REMOVE DUPLICATES
========================================
*/
duplicateElements.forEach(
  (id) => {

    const element =
      document.getElementById(id);

    if (element) {

      element.remove();
    }
  }
);

/*
========================================
CLEAR BROKEN WIDGET CONTAINERS
========================================
*/
document
  .querySelectorAll(
    '[id^="aiaera-widget"]'
  )
  .forEach((el) => {

    if (
      !duplicateElements.includes(
        el.id
      )
    ) {

      el.remove();
    }
  });

/*
========================================
CREATE ROOT
========================================
*/
const root =
  createRoot(rootElement);

/*
========================================
ROOT RENDER

React.StrictMode intentionally removed
because it causes:

- duplicate API calls
- duplicate auth requests
- Supabase auth lock issues
- duplicate useEffect execution
- duplicate chatbot widgets
- iframe flashing
- multiple renders

========================================
*/
root.render(

  <AuthProvider>

    <App />

  </AuthProvider>
);