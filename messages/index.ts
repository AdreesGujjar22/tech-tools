import en from "./en.json";
import de from "./de.json";
import es from "./es.json";
import fr from "./fr.json";
import id from "./id.json";
import it from "./it.json";
import nl from "./nl.json";
import pt from "./pt.json";
import tr from "./tr.json";

function mergeMessages<T extends Record<string, any>, U extends Record<string, any>>(base: T, override: U): T & U {
  const result: Record<string, any> = { ...base };
  for (const [key, value] of Object.entries(override)) {
    result[key] = value && typeof value === "object" && !Array.isArray(value)
      ? mergeMessages(result[key] || {}, value)
      : value;
  }
  return result as T & U;
}

const germanMessages = mergeMessages(en, de);
const spanishMessages = mergeMessages(en, es);
const frenchMessages = mergeMessages(en, fr);
const indonesianMessages = mergeMessages(en, id);
const italianMessages = mergeMessages(en, it);
const dutchMessages = mergeMessages(en, nl);
const portugueseMessages = mergeMessages(en, pt);
const turkishMessages = mergeMessages(en, tr);

export const defaultLocale = "en" as const;

export const messages = {
  de: germanMessages,
  en,
  es: spanishMessages,
  fr: frenchMessages,
  id: indonesianMessages,
  it: italianMessages,
  nl: dutchMessages,
  pt: portugueseMessages,
  tr: turkishMessages,
} as const;

export const publicRoutes = messages.en.Routes;

export type Locale = keyof typeof messages;
