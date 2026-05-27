import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import RouterWrapper from "./RouterWrapper.jsx";
import { AuthProvider } from "./AuthContext.jsx";
import { DataProvider } from "./DataContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <DataProvider>
        <RouterWrapper />
      </DataProvider>
    </AuthProvider>
  </StrictMode>,
);
