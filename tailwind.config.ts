import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./client/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}"
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "-apple-system", "Roboto", "Helvetica", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        qr: {
          bg: "#0B1326",
          "bg-dark": "#060E20",
          card: "#171F33",
          "card-input": "#2D3449",
          nav: "#131B2E",
          indigo: "#4F46E5",
          lavender: "#C3C0FF",
          cyan: "#4CD7F6",
          coral: "#FFB4AB",
          text: "#DAE2FD",
          muted: "#C7C4D8",
          dim: "#918FA1",
          border: "#464555",
          "card-dark": "#31394D",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.4s ease-out",
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(167.63% 52.38% at 50% 50%, rgba(195, 192, 255, 0.15) 0%, rgba(195, 192, 255, 0.00) 70%)",
        "gradient-cta":
          "linear-gradient(135deg, rgba(195, 192, 255, 0.10) 0%, rgba(195, 192, 255, 0.00) 100%)",
        "gradient-indigo-cyan":
          "linear-gradient(90deg, #4F46E5 0%, #03B5D3 100%)",
        "gradient-card":
          "linear-gradient(135deg, #171F33 0%, #0B1326 100%)",
        "connector-line":
          "linear-gradient(90deg, rgba(70,69,85,0) 0%, rgba(70,69,85,0.3) 50%, rgba(70,69,85,0) 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
