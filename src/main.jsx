import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.jsx";

/*
========================================
AUTH CONTEXT
========================================
*/
import AuthProvider from "./context/AuthContext";

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
    "Root element not found"
  );
}

/*
========================================
CREATE ROOT
========================================
*/
const root =
  createRoot(rootElement);

/*
========================================
REMOVE DUPLICATE CHATBOT
========================================
*/
const existingWidget =
  document.getElementById(
    "aiaera-chatbot-widget"
  );

if (existingWidget) {

  existingWidget.remove();
}

const existingButton =
  document.getElementById(
    "aiaera-chatbot-button"
  );

if (existingButton) {

  existingButton.remove();
}

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