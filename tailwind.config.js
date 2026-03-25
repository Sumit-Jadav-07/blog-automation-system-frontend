/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        glow: "0 20px 60px rgba(99, 102, 241, 0.22)",
        card: "0 14px 40px rgba(15, 23, 42, 0.18)",
      },
      borderRadius: {
        xl: "16px",
        lg: "12px",
        btn: "8px",
      },
    },
  },
  plugins: [],
};
