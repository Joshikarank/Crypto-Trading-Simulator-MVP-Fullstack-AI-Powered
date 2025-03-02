import React from "react";
import { createRoot } from "react-dom/client"; // Import createRoot from react-dom/client
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";

// Get the root element
const rootElement = document.getElementById("root");

// Create a root
const root = createRoot(rootElement);
  
// Render the app
root.render(
  <Router>
    <App />
  </Router>
);