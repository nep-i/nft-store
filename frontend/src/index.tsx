import React from "react";
import ReactDOM from "react-dom/client";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";

import "./Assets/Styles/index.css";
import "./Assets/Styles/flags.css";

import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router";
import { PrimeReactProvider } from "primereact/api";
import { AuthProvider } from "./auth/Auth";
import * as Sentry from "@sentry/browser";
import { Provider } from "react-redux";
import store from "./store/store";

Sentry.init({
  dsn: "https://03270c2aab094dabbffc0cc26b918eb6@glitchtip.example.com/1",
});

const root = ReactDOM.createRoot(
  document.getElementById("root")! as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter>
          <PrimeReactProvider>
            <App />
          </PrimeReactProvider>
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
