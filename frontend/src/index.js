import React from "react";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ToastProvider } from "./context/toastProvider";
import { initialState, reducer } from "./context/toastReducer";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ToastProvider initialState={initialState} reducer={reducer}>
      <App />
    </ToastProvider>
  </React.StrictMode>
);
