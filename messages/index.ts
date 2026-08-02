import type { AbstractIntlMessages } from "next-intl";

export const supportedLocales = ["en","de","es","fr","id","it","nl","pt","tr"] as const;
export const defaultLocale = "en" as const;
export type Locale = (typeof supportedLocales)[number];

export const supportedToolNamespaces = [
  "AsciiArtGenerator", "BackgroundRemover", "BarcodeGenerator", "BarcodeReader",
  "Base64FileConverter", "Base64StringConverter", "BasicAuthGenerator", "BenchmarkBuilder",
  "CameraRecorder", "Chronometer", "ColorPicker", "CropImage", "DashboardCategories",
  "DeviceInformation", "EmailNormalizer", "EmojiPicker", "EncryptionDecryption", "EtaCalculator",
  "GitMemo", "HmacGenerator", "IbanValidator", "ImageConverter", "ImageDashboard",
  "Ipv4AddressConverter", "Ipv4RangeExpander", "Ipv4SubnetCalculator", "JsonDiff",
  "JsonToTomlConverter", "JsonToXmlConverter", "ListConverter", "Loading", "LoremGenerator",
  "Notepad", "OgMetaGenerator", "OutlookSafelinkDecoder", "PasswordGenerator", "PdfDashboard",
  "PdfSignatureChecker", "PdfToPowerpoint", "PdfToWord", "PercentageCalculator", "QrGenerator",
  "RsaKeyPairGenerator", "SlugifyString", "SpeedTest", "TemperatureConverter", "TextDiff",
  "TomlToJsonConverter", "TomlToYamlConverter", "TypingSpeed", "UnlockPdf", "UrlParser",
  "WatermarkImage", "XmlFormatter", "XmlToJsonConverter", "YamlPrettify", "shared"
] as const;

export type ToolNamespace = (typeof supportedToolNamespaces)[number] | string;
export type MessageNamespace = 'common' | 'meta' | ToolNamespace | 'DashboardCategories';

type Messages = AbstractIntlMessages;

export async function loadMessages(locale: Locale, namespaces: readonly MessageNamespace[] = ['common', 'meta']): Promise<Messages> {
  const selected: readonly MessageNamespace[] = namespaces.length ? namespaces : ['common'];
  const loaded = await Promise.all(selected.map(async (namespace) => {
    try {
      if (namespace === 'common') {
        const mod = await import(`./${locale}/common.json`);
        return [namespace, mod.default as AbstractIntlMessages] as const;
      }
      if (namespace === 'meta') {
        const mod = await import(`./${locale}/meta.json`);
        return [namespace, mod.default as AbstractIntlMessages] as const;
      }
      const mod = await import(`./${locale}/tools/${namespace}.json`);
      return [namespace, mod.default as AbstractIntlMessages] as const;
    } catch (e) {
      return [namespace, {} as AbstractIntlMessages] as const;
    }
  }));

  const common = (loaded.find(([namespace]) => namespace === 'common')?.[1] || {}) as AbstractIntlMessages;
  const meta = (loaded.find(([namespace]) => namespace === 'meta')?.[1] || {}) as AbstractIntlMessages;
  const tools = Object.fromEntries(
    loaded
      .filter(([namespace]) => namespace !== 'common' && namespace !== 'meta')
      .map(([namespace, value]) => [namespace, value as AbstractIntlMessages])
  );

  return {
    ...(common as Messages),
    ...(meta as Messages),
    ...(Object.keys(tools).length ? { Tools: tools as Messages } : {}),
  } as Messages;
}

export const publicRoutes = {
  "home": "/",
  "about": "/about-us",
  "tools": "/tools",
  "blog": "/blog",
  "pricing": "/pricing",
  "help": "/help",
  "contact": "/contact-us",
  "privacy": "/privacy-policy",
  "terms": "/terms-and-conditions",
  "pdf": "/ilovepdf",
  "image": "/iloveimg",
  "qrGenerator": "/qr-generator",
  "barcodeGenerator": "/barcode-generator",
  "barcodeReader": "/barcode-reader",
  "passwordGenerator": "/password-generator",
  "loremGenerator": "/lorem-ipsum-generator",
  "emojiPicker": "/emoji-picker",
  "notepad": "/notepad",
  "colorPicker": "/color-picker",
  "speedTest": "/speed-test",
  "typingSpeed": "/typing-speed"
} as const;
