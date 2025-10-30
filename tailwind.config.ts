import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx}",  // Make sure this matches your folder structure
    ],
    theme: {
        extend: {},
    },
    plugins: [
        require("tailwind-scrollbar")({ nocompatible: true }),
    ],
};

export default config;
