import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import AuthProvider from "./context/AuthProvider.jsx";
import { CourseProvider } from "./context/CourseContext.jsx";
import { ProgressProvider } from "./context/ProgressContext.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <CourseProvider>
        <ProgressProvider>
          <App />
        </ProgressProvider>
      </CourseProvider>
    </AuthProvider>
  </React.StrictMode>
);
