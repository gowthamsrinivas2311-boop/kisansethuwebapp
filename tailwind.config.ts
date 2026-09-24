import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        kisan: {
          green: { 50: "#e8f5eb", 100: "#c8e6cd", 200: "#93cda0", 300: "#5db472", 400: "#2e944d", 500: "#1b6e34", 600: "#165a2b", 700: "#114722", 800: "#0d3519", 900: "#0a2613" },
          terra: { 50: "#fff7ed", 100: "#ffedd5", 200: "#fdd9a8", 300: "#f9b963", 400: "#f59e2a", 500: "#d48816", 600: "#b87010", 700: "#8f560d", 800: "#6e4210", 900: "#4d2f0c" },
          ochre: { 50: "#fffceb", 100: "#fff8d1", 200: "#fff2a3", 300: "#ffe76a", 400: "#ffd93d", 500: "#d4a816", 600: "#a38012", 700: "#7a600e", 800: "#52400a", 900: "#3a2d07" },
          cream: { 50: "#fefdfb", 100: "#fcfaf5", 200: "#f9f5ec", 300: "#f5f0e3", 400: "#ede6d3", 500: "#ddd5bf", 600: "#c5bca5", 700: "#9e9680", 800: "#706a59", 900: "#4a4639" },
        },
      },
      boxShadow: {
        "card": "0 1px 3px 0 rgba(26,46,30,0.06), 0 1px 2px -1px rgba(26,46,30,0.06)",
        "card-hover": "0 10px 25px -5px rgba(26,46,30,0.08), 0 6px 10px -6px rgba(26,46,30,0.06)",
        "elevated": "0 4px 14px -2px rgba(26,46,30,0.10), 0 2px 6px -2px rgba(26,46,30,0.06)",
        "glow-green": "0 0 0 3px rgba(27,110,52,0.15)",
        "glow-terra": "0 0 0 3px rgba(212,136,22,0.15)",
        "btn": "0 2px 6px -1px rgba(27,110,52,0.25)",
        "btn-terra": "0 2px 6px -1px rgba(212,136,22,0.30)",
      },
      keyframes: {
        "shimmer": { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        "lift": { "0%": { transform: "translateY(0)" }, "100%": { transform: "translateY(-2px)" } },
        "pulse-dot": { "0%, 80%, 100%": { opacity: "0.3", transform: "scale(0.8)" }, "40%": { opacity: "1", transform: "scale(1)" } },
        "fade-in": { "0%": { opacity: "0", transform: "translateY(6px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
      },
      animation: {
        "shimmer": "shimmer 1.8s ease-in-out infinite",
        "lift": "lift 0.2s ease-out forwards",
        "pulse-dot-1": "pulse-dot 1.4s ease-in-out infinite",
        "pulse-dot-2": "pulse-dot 1.4s ease-in-out 0.2s infinite",
        "pulse-dot-3": "pulse-dot 1.4s ease-in-out 0.4s infinite",
        "fade-in": "fade-in 0.3s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
