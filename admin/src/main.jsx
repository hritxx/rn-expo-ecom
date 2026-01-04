import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ENV } from "./config/env.js";
import { ClerkProvider } from "@clerk/clerk-react";

createRoot(document.getElementById("root")).render(
  <ClerkProvider publishableKey={ENV.PUBLISHABLE_KEY}>
    <StrictMode>
      <App />
    </StrictMode>
  </ClerkProvider>
);
