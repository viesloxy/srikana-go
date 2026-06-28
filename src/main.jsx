import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";
import { CartProvider } from "./context/CartContext";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </StrictMode>
);
