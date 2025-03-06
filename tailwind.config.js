/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
        primary: {
          100: "#222831",
          200: "#00ADB5",
          300: "#EEEEEE",
        },
        secondary: {
          100: "#DBE2EF",
          200: "#3F72AF",
          300: "#112D4E",
        },
      }
  	}
  },
}