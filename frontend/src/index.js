import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./Assets/Theme/theme";
import { BrowserRouter as Router } from "react-router-dom";
import Auth0ProviderWithHistory from "./Components/Auth/AuthProviderWithHistory";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Auth0ProviderWithHistory>
    <Router>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Router>
  </Auth0ProviderWithHistory>
);
