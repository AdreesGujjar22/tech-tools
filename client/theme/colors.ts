/**
 * Unified Color System for Tech Tools
 * All color values are defined here to ensure consistency across the entire application
 */

export const colors = {
  // Primary Colors - Main brand color
  primary: {
    50: "hsl(245 58% 95%)",
    100: "hsl(245 58% 90%)",
    200: "hsl(245 58% 80%)",
    300: "hsl(245 58% 70%)",
    400: "hsl(245 58% 60%)",
    500: "hsl(245 58% 51%)", // Primary - Main brand
    600: "hsl(245 58% 45%)",
    700: "hsl(245 58% 40%)",
    800: "hsl(245 58% 35%)",
    900: "hsl(245 58% 25%)",
  },

  // Neutral/Gray - Used for text, backgrounds, borders
  neutral: {
    50: "hsl(210 20% 98%)",
    100: "hsl(220 14.3% 92%)",
    200: "hsl(220 13% 85%)",
    300: "hsl(220 12% 75%)",
    400: "hsl(220 10% 60%)",
    500: "hsl(220 9% 50%)",
    600: "hsl(220 8.9% 40%)",
    700: "hsl(220 8% 30%)",
    800: "hsl(224 71% 4%)",
    900: "hsl(225 59% 11%)",
  },

  // Surface Colors - Backgrounds and elevated surfaces
  surface: {
    light: "hsl(210 20% 98%)",
    default: "hsl(0 0% 100%)",
    elevated: "hsl(220 14.3% 92%)",
    overlay: "rgba(0, 0, 0, 0.5)",
    dark: "hsl(225 31% 14%)",
    darkElevated: "hsl(225 59% 11%)",
  },

  // State Colors
  state: {
    success: "hsl(120 85% 50%)",
    warning: "hsl(45 100% 51%)",
    error: "hsl(0 84.2% 60.2%)",
    info: "hsl(245 58% 51%)",
  },

  // Semantic Colors
  semantic: {
    background: "hsl(210 20% 98%)",
    foreground: "hsl(224 71% 4%)",
    card: "hsl(0 0% 100%)",
    cardForeground: "hsl(224 71% 4%)",
    border: "hsl(220 13% 85%)",
    input: "hsl(220 13% 85%)",
    ring: "hsl(245 58% 51%)",
    muted: "hsl(220 14.3% 95.9%)",
    mutedForeground: "hsl(220 8.9% 40%)",
    accent: "hsl(245 58% 95%)",
    accentForeground: "hsl(245 35% 25%)",
    destructive: "hsl(0 84.2% 60.2%)",
    destructiveForeground: "hsl(210 40% 98%)",
  },

  // Glass Morphism - For modern frosted glass effects
  glass: {
    light: "rgba(255, 255, 255, 0.72)",
    lightBorder: "rgba(0, 0, 0, 0.08)",
    dark: "rgba(13, 20, 38, 0.75)",
    darkBorder: "rgba(255, 255, 255, 0.06)",
    card: "rgba(255, 255, 255, 0.65)",
    cardBorder: "rgba(0, 0, 0, 0.06)",
  },

  // Text Colors
  text: {
    primary: "hsl(224 71% 4%)",
    secondary: "hsl(220 8.9% 40%)",
    muted: "hsl(220 10% 60%)",
    light: "hsl(210 40% 98%)",
    lightSecondary: "hsl(215.4 16.3% 65%)",
  },

  // Accent Colors for highlights
  accent: {
    cyan: "hsl(200 100% 50%)",
    purple: "hsl(270 70% 50%)",
    pink: "hsl(340 70% 60%)",
    orange: "hsl(30 100% 50%)",
  },

  // Dark Mode specific
  darkMode: {
    background: "hsl(225 59% 11%)",
    foreground: "hsl(210 40% 98%)",
    card: "hsl(225 31% 14%)",
    border: "hsl(225 25% 18%)",
    text: "hsl(210 40% 98%)",
    textSecondary: "hsl(215.4 16.3% 65%)",
  },
} as const;

/**
 * Color mapping for easy reference
 * Use these semantic names instead of color values
 */
export const colorMap = {
  // Backgrounds
  bgPrimary: colors.semantic.background,
  bgSecondary: colors.surface.elevated,
  bgCard: colors.semantic.card,
  bgOverlay: colors.surface.overlay,

  // Text
  textPrimary: colors.text.primary,
  textSecondary: colors.text.secondary,
  textMuted: colors.text.muted,
  textLight: colors.text.light,

  // Borders
  borderDefault: colors.semantic.border,
  borderLight: colors.neutral[200],
  borderMuted: colors.neutral[300],

  // Interactive
  buttonPrimary: colors.primary[500],
  buttonHover: colors.primary[600],
  buttonActive: colors.primary[700],

  // State
  stateSuccess: colors.state.success,
  stateWarning: colors.state.warning,
  stateError: colors.state.error,
  stateInfo: colors.state.info,
} as const;

/**
 * Tailwind utility helpers for colors
 * Can be used in className or exported for use in other systems
 */
export const colorClasses = {
  // Text colors
  "text-primary": "text-[hsl(224_71%_4%)]",
  "text-secondary": "text-[hsl(220_8.9%_40%)]",
  "text-muted": "text-[hsl(220_10%_60%)]",

  // Background colors
  "bg-primary": "bg-[hsl(245_58%_51%)]",
  "bg-primary-light": "bg-[hsl(245_58%_95%)]",
  "bg-card": "bg-[hsl(0_0%_100%)]",

  // Border colors
  "border-default": "border-[hsl(220_13%_85%)]",
  "border-primary": "border-[hsl(245_58%_51%)]",
} as const;
