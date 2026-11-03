/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] },
      boxShadow: {
        soft: "0 18px 60px rgba(15,23,42,.10)",
        panel: "0 10px 30px rgba(15,23,42,.08)",
      },
    },
  },
  plugins: [],
};
