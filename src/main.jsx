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
ROOT RENDER
========================================

Removed React.StrictMode
because it causes:
- duplicate widget injection
- duplicate API calls
- Supabase lock errors
- double useEffect execution
- multiple chatbot renders

========================================
*/
createRoot(
  document.getElementById("root")
).render(

  <AuthProvider>

    <App />

  </AuthProvider>
);