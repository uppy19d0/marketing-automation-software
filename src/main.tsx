
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { PublicLanding } from "./components/PublicLanding";
import { MarketingLanding } from "./marketing/MarketingLanding";

const path = window.location.pathname;

if (path.startsWith("/l/")) {
  const slug = path.replace("/l/", "").replace(/\/$/, "");
  createRoot(document.getElementById("root")!).render(<PublicLanding slug={slug} />);
} else if (path.startsWith("/promo") || path.startsWith("/marketing") || path.startsWith("/site")) {
  createRoot(document.getElementById("root")!).render(<MarketingLanding />);
} else {
  createRoot(document.getElementById("root")!).render(<App />);
}
  
