
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { PublicLanding } from "./components/PublicLanding";

const path = window.location.pathname;
if (path.startsWith("/l/")) {
  const slug = path.replace("/l/", "").replace(/\/$/, "");
  createRoot(document.getElementById("root")!).render(<PublicLanding slug={slug} />);
} else {
  createRoot(document.getElementById("root")!).render(<App />);
}
  
