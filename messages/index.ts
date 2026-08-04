import type { AbstractIntlMessages } from "next-intl";

export const supportedLocales = ["en","de","es","fr","id","it","nl","pt","tr"] as const;
export const defaultLocale = "en" as const;
export type Locale = (typeof supportedLocales)[number];

export const supportedToolNamespaces = [
  "AsciiArtGenerator", "BackgroundRemover", "BarcodeGenerator", "BarcodeReader",
  "Base64FileConverter", "Base64StringConverter", "BasicAuthGenerator", "BenchmarkBuilder",
  "CameraRecorder", "Chronometer", "ColorPicker", "CompressImage", "CompressPdf", "CropImage",
  "DashboardCategories", "DeviceInformation", "EditPdf", "EmailNormalizer", "EmojiPicker",
  "EncryptionDecryption", "EtaCalculator", "ExcelToPdf", "GitMemo", "HmacGenerator",
  "IbanValidator", "ImageConverter", "ImageDashboard", "ImageEditor", "JpgToPdf",
  "Ipv4AddressConverter", "Ipv4RangeExpander", "Ipv4SubnetCalculator", "JsonDiff",
  "JsonToTomlConverter", "JsonToXmlConverter", "ListConverter", "Loading", "LoremGenerator",
  "MergePdf", "Notepad", "OgMetaGenerator", "OutlookSafelinkDecoder", "PasswordGenerator",
  "PdfDashboard", "PdfSignatureChecker", "PdfToExcel", "PdfToJpg", "PdfToPowerpoint", "PdfToWord",
  "PercentageCalculator", "PowerpointToPdf", "ProtectPdf", "QrGenerator", "RepairPdf",
  "ResizeImage", "RotateImage", "RotatePdf", "RsaKeyPairGenerator", "SlugifyString", "SpeedTest",
  "SplitPdf", "TemperatureConverter", "TextDiff", "TomlToJsonConverter", "TomlToYamlConverter",
  "TextToNatoAlphabet", "TextToUnicode", "TypingSpeed", "UnlockPdf", "UrlParser", "UpscaleImage", "WatermarkImage", "WordToPdf",
  "XmlFormatter", "XmlToJsonConverter", "YamlPrettify", "shared"
] as const;

export type ToolNamespace = (typeof supportedToolNamespaces)[number] | string;
export type MessageNamespace = 'common' | 'meta' | ToolNamespace | 'DashboardCategories';

type Messages = AbstractIntlMessages;

function mergeMessages(fallback: Record<string, any>, localized: Record<string, any>): Record<string, any> {
  const merged: Record<string, any> = { ...fallback, ...localized };
  for (const [key, value] of Object.entries(fallback)) {
    const localizedValue = localized[key];
    if (
      value && typeof value === "object" && !Array.isArray(value) &&
      localizedValue && typeof localizedValue === "object" && !Array.isArray(localizedValue)
    ) {
      merged[key] = mergeMessages(value as Record<string, any>, localizedValue as Record<string, any>);
    }
  }
  return merged;
}

export async function loadMessages(locale: Locale, namespaces: readonly MessageNamespace[] = ['common', 'meta']): Promise<Messages> {
  const selected: readonly MessageNamespace[] = namespaces.length ? namespaces : ['common'];
  const loaded = await Promise.all(selected.map(async (namespace) => {
    try {
      if (namespace === 'common') {
        const [fallback, localized] = await Promise.all([
          import('./en/common.json'),
          import(`./${locale}/common.json`),
        ]);
        return [namespace, mergeMessages(fallback.default, localized.default)] as const;
      }
      if (namespace === 'meta') {
        const [fallback, localized] = await Promise.all([
          import('./en/meta.json'),
          import(`./${locale}/meta.json`),
        ]);
        return [namespace, mergeMessages(fallback.default, localized.default)] as const;
      }
      const [fallback, localized] = await Promise.all([
        import(`./en/tools/${namespace}.json`),
        import(`./${locale}/tools/${namespace}.json`),
      ]);
      return [namespace, mergeMessages(fallback.default, localized.default)] as const;
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
