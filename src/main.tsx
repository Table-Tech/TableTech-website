import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // ← our Tailwind v4 CSS
import { BrowserRouter } from "react-router-dom";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
