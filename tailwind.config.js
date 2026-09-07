/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ground: "#F9FAFB",
        ink: "#1A1A1A",
        muted: "#6B7280",
        accent: "#0056D2",
        "accent-soft": "#EFF6FF",
        line: "#E5E7EB",
        "line-strong": "#D1D5DB",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.375rem",
      },
    },
  },
  plugins: [],
};
