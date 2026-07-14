import type { Config } from "tailwindcss";

import tailwindcssAnimate from "tailwindcss-animate";

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
        sans: ["var(--font-jakarta)", "'Plus Jakarta Sans'", "-apple-system", "Roboto", "Helvetica", "sans-serif"],
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
        "fade-in-scale": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-down": {
          from: { opacity: "0", transform: "translateY(-20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-left": {
          from: { opacity: "0", transform: "translateX(20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "slide-right": {
          from: { opacity: "0", transform: "translateX(-20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "glow": {
          "0%, 100%": { "box-shadow": "0 0 5px rgba(99, 102, 241, 0.3)" },
          "50%": { "box-shadow": "0 0 20px rgba(99, 102, 241, 0.6)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-1200px 0" },
          "100%": { backgroundPosition: "1200px 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.4s ease-out",
        "fade-in-scale": "fade-in-scale 0.5s ease-out",
        "slide-up": "slide-up 0.5s ease-out",
        "slide-down": "slide-down 0.5s ease-out",
        "slide-left": "slide-left 0.5s ease-out",
        "slide-right": "slide-right 0.5s ease-out",
        "pulse-soft": "pulse-soft 3s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite",
        "shimmer": "shimmer 2s infinite",
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(167.63% 52.38% at 50% 50%, rgba(99, 130, 246, 0.18) 0%, rgba(99, 130, 246, 0.00) 70%)",
        "gradient-cta":
          "linear-gradient(135deg, rgba(99, 130, 246, 0.12) 0%, rgba(129, 110, 247, 0.04) 100%)",
        "gradient-indigo-cyan":
          "linear-gradient(115deg, #60b044 0%, #4a8f3a 55%, #3d7a2e 100%)",
        "gradient-card":
          "linear-gradient(135deg, #141d36 0%, #0a1021 100%)",
        "connector-line":
          "linear-gradient(90deg, rgba(99,124,241,0) 0%, rgba(99,124,241,0.4) 50%, rgba(99,124,241,0) 100%)",
        "gradient-soft-slate":
          "linear-gradient(135deg, rgba(241, 245, 249, 0.8) 0%, rgba(226, 232, 240, 0.4) 100%)",
        "gradient-glass":
          "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
        "gradient-emerald-soft":
          "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(34, 197, 94, 0.05) 100%)",
        "gradient-indigo-soft":
          "linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(129, 140, 248, 0.05) 100%)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
