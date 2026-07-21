import en from "./en.json";
import es from "./es.json";

function mergeMessages<T extends Record<string, any>, U extends Record<string, any>>(base: T, override: U): T & U {
  const result: Record<string, any> = { ...base };
  for (const [key, value] of Object.entries(override)) {
    result[key] = value && typeof value === "object" && !Array.isArray(value)
      ? mergeMessages(result[key] || {}, value)
      : value;
  }
  return result as T & U;
}

const spanishMessages = mergeMessages(en, es);

export const defaultLocale = "en" as const;

export const messages = {
  en,
  es: spanishMessages,
} as const;

export const publicRoutes = messages.en.Routes;

export type Locale = keyof typeof messages;
