/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Fond general creme (inspire de la landing Aiglix), cartes en blanc par-dessus
        ground: "#F6F2E6",
        mist: "#EFEADC",
        ink: "#0B1F4D",
        muted: "#5B6684",
        line: "#E6DFCD",
        "line-strong": "#D5CBB3",
        // Marque : bleu du logo + navy profond pour les bandeaux
        accent: "#0056D2",
        "accent-soft": "#DCE8FB",
        navy: "#0B1F4D",
        "navy-dark": "#071536",
        // Accent decoratif (fleche orange du logo) : macarons, soulignes
        sun: "#FBBF24",
      },
      fontFamily: {
        sans: ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Unbounded", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "rise-in": {
          from: { opacity: 0, transform: "translateY(16px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "rise-in": "rise-in 0.6s cubic-bezier(0.2, 0.9, 0.3, 1.2) both",
      },
    },
  },
  plugins: [],
};
