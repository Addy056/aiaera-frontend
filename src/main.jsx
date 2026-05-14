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
REMOVE DUPLICATE CHATBOT ELEMENTS
========================================
*/
const duplicateElements = [

  "aiaera-chatbot-widget",

  "aiaera-chatbot-button",

  "aiaera-chatbot-iframe",

];

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
CREATE ROOT
========================================
*/
const root =
  createRoot(rootElement);

/*
========================================
ROOT RENDER
========================================

React.StrictMode intentionally removed
because it causes:

- duplicate widget injection
- duplicate API calls
- Supabase auth lock errors
- duplicate useEffect execution
- multiple chatbot renders
- iframe duplication
- chatbot flashing issue

========================================
*/
root.render(

  <AuthProvider>

    <App />

  </AuthProvider>
);