/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  safelist: [
    // text colors
    "text-black",
    "text-white",
    "text-gray-700",
    "text-gray-800",

    // background colors
    "bg-white",
    "bg-black",
    "bg-gray-100",
    "bg-gray-200",

    // borders & effects
    "border",
    "border-gray-200",
    "shadow",
    "shadow-md",
    "shadow-lg",

    // overlays & hover
    "hover:scale-105",
    "transition",
    "duration-300",
  ],
  theme: {
    extend: {},
  },
};
