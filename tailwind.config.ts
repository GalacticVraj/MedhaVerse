import type { Config } from "tailwindcss";

export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/simulation/**/*.{js,ts,jsx,tsx,mdx}"
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                medha: {
                    blue: "#0A2540",
                    accent: "#00E0FF",
                    alert: "#FF3366",
                    success: "#00E676",
                    warn: "#FFD600"
                }
            },
        },
    },
    plugins: [],
} satisfies Config;
