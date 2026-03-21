/**
 * main.jsx
 *
 * This is the entry point of the app — the very first file that runs.
 * It wraps the whole app in BrowserRouter so we can use URL-based routing,
 * and renders everything into the #root div in index.html.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./styles/app.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Toaster position="top-center" toastOptions={{ style: { background: 'var(--panel)', color: 'var(--text)', border: '1px solid var(--line)', borderRadius: 'var(--radius-pill)', boxShadow: 'var(--shadow)' } }} />
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
