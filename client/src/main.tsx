import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { LocationProvider } from "./context/LocationContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <UserProvider>
    <LocationProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </LocationProvider>
  </UserProvider>
  // </React.StrictMode>
);
