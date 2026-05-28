import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./app/App";
import { AuthSessionProvider } from "./features/auth/session";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthSessionProvider>
      <App />
    </AuthSessionProvider>
  </React.StrictMode>
);
