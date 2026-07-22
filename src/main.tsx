import { createRoot } from "react-dom/client";
import "./index.css";

const rootElement = document.getElementById("root")!;

// A failed import or initial render would otherwise leave a blank white page.
import("./App.tsx")
  .then(({ default: App }) => {
    createRoot(rootElement).render(<App />);
  })
  .catch((error) => {
    console.error("Failed to start the app:", error);
    rootElement.innerHTML = `
      <div style="font-family: sans-serif; padding: 3rem 1.5rem; text-align: center;">
        <h1 style="font-size: 1.25rem; margin-bottom: 0.5rem;">Something went wrong loading the site</h1>
        <p style="color: #666;">Please refresh the page. If the problem persists, contact support.</p>
      </div>
    `;
  });
