import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        lab: {
          ink: "#07111f",
          navy: "#0b1627",
          panel: "rgba(13, 25, 44, 0.76)",
          border: "rgba(148, 163, 184, 0.18)"
        }
      },
      boxShadow: {
        glow: "0 0 40px rgba(34, 211, 238, 0.14)",
        card: "0 24px 80px rgba(0, 0, 0, 0.32)"
      }
    }
  },
  plugins: []
};

export default config;
