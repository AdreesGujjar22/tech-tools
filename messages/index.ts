import type { AbstractIntlMessages } from "next-intl";

export const supportedLocales = ["en","de","es","fr","id","it","nl","pt","tr"] as const;
export const defaultLocale = "en" as const;
export type Locale = (typeof supportedLocales)[number];

export const supportedToolNamespaces = [
  "AsciiArtGenerator", "BackgroundRemover", "BarcodeGenerator", "BarcodeReader",
  "Base64FileConverter", "Base64StringConverter", "BasicAuthGenerator", "BenchmarkBuilder", "BcryptGenerator", "Bip39Generator",
  "CameraRecorder", "CaseConverter", "ChmodCalculator", "Chronometer", "ColorConverter", "ColorPicker", "CompressImage", "CompressPdf", "CropImage", "CrontabGenerator", "DockerRunToDockerComposeConverter",
  "DashboardCategories", "DeviceInformation", "EditPdf", "EmailNormalizer", "EmojiPicker", "HashText", "HtmlEntities", "HtmlWysiwygEditor", "HttpStatusCodes",
  "EncryptionDecryption", "EtaCalculator", "ExcelToPdf", "GitMemo", "HmacGenerator",
  "IbanValidator", "ImageConverter", "ImageDashboard", "ImageEditor", "JpgToPdf",
  "Ipv4AddressConverter", "Ipv4RangeExpander", "Ipv4SubnetCalculator", "JsonDiff",
  "JsonToTomlConverter", "JsonToXmlConverter", "JsonYamlConverter", "JsonFormatterMinifier", "IntegerBaseConverter", "Ipv6UlaGenerator", "JwtParser", "KeycodeInfo", "ListConverter", "Loading", "LoremGenerator",
  "MacAddressLookup", "MarkdownToHtml", "MergePdf", "MimeTypes", "Notepad", "NumeronymGenerator", "OgMetaGenerator", "OtpGenerator", "OutlookSafelinkDecoder", "PasswordGenerator", "PasswordStrengthAnalyser",
  "PdfDashboard", "PdfSignatureChecker", "PdfToExcel", "PdfToJpg", "PdfToPowerpoint", "PdfToWord",
  "PercentageCalculator", "PhoneParser", "PowerpointToPdf", "ProtectPdf", "QrGenerator", "RandomPortGenerator", "RegexTester", "RepairPdf", "RomanNumeralConverter",
  "ResizeImage", "RotateImage", "RotatePdf", "RsaKeyPairGenerator", "SlugifyString", "SpeedTest",
  "SplitPdf", "SqlPrettify", "StringObfuscator", "SvgPlaceholderGenerator", "TemperatureConverter", "TextDiff", "TextStatistics", "TextToBinary", "TomlToJsonConverter", "TomlToYamlConverter", "TokenGenerator",
  "TextToNatoAlphabet", "TextToUnicode", "TypingSpeed", "UnlockPdf", "UrlEncoderDecoder", "UrlParser", "UpscaleImage", "UserAgentParser", "UuidGenerator", "WatermarkImage", "WifiQrCodeGenerator", "WordToPdf",
  "XmlFormatter", "XmlToJsonConverter", "YamlPrettify", "YamlToJsonToml", "shared"
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
  "asciiArtGenerator": "/ascii-art-generator",
  "barcodeGenerator": "/barcode-generator",
  "barcodeReader": "/barcode-reader",
  "base64FileConverter": "/base64-file-converter",
  "base64StringConverter": "/base64-string-converter",
  "basicAuthGenerator": "/basic-auth-generator",
  "bcryptGenerator": "/bcrypt-generator",
  "benchmarkBuilder": "/benchmark-builder",
  "bip39Generator": "/bip39-generator",
  "cameraRecorder": "/camera-recorder",
  "caseConverter": "/case-converter",
  "chmodCalculator": "/chmod-calculator",
  "chronometer": "/chronometer",
  "colorConverter": "/color-converter",
  "colorPicker": "/color-picker",
  "contactUs": "/contact-us",
  "converterToolsDashboard": "/converter-tools-dashboard",
  "crontabGenerator": "/crontab-generator",
  "cryptoSecurityDashboard": "/crypto-security-dashboard",
  "developerToolsDashboard": "/developer-tools-dashboard",
  "deviceInformation": "/device-information",
  "dockerRunToDockerComposeConverter": "/docker-run-to-docker-compose-converter",
  "emailNormalizer": "/email-normalizer",
  "emojiPicker": "/emoji-picker",
  "encryptionDecryption": "/encryption-decryption",
  "etaCalculator": "/eta-calculator",
  "gitMemo": "/git-memo",
  "hashText": "/hash-text",
  "hmacGenerator": "/hmac-generator",
  "htmlEntities": "/html-entities",
  "htmlWysiwygEditor": "/html-wysiwyg-editor",
  "httpStatusCodes": "/http-status-codes",
  "ibanValidator": "/iban-validator",
  "imageToolsDashboard": "/image-tools-dashboard",
  "integerBaseConverter": "/integer-base-converter",
  "ipv4AddressConverter": "/ipv4-address-converter",
  "ipv4RangeExpander": "/ipv4-range-expander",
  "ipv4SubnetCalculator": "/ipv4-subnet-calculator",
  "ipv6UlaGenerator": "/ipv6-ula-generator",
  "jsonDiff": "/json-diff",
  "jsonFormatterMinifier": "/json-formatter-minifier",
  "jsonToTomlConverter": "/json-to-toml-converter",
  "jsonToXmlConverter": "/json-to-xml-converter",
  "jsonYamlConverter": "/json-yaml-converter",
  "jwtParser": "/jwt-parser",
  "keycodeInfo": "/keycode-info",
  "listConverter": "/list-converter",
  "loremGenerator": "/lorem-ipsum-generator",
  "macAddressLookup": "/mac-address-lookup",
  "markdownToHtml": "/markdown-to-html",
  "mathMediaDashboard": "/math-media-dashboard",
  "mimeTypes": "/mime-types",
  "networkToolsDashboard": "/network-tools-dashboard",
  "notepad": "/notepad",
  "numeronymGenerator": "/numeronym-generator",
  "ogMetaGenerator": "/og-meta-generator",
  "otpGenerator": "/otp-generator",
  "outlookSafelinkDecoder": "/outlook-safelink-decoder",
  "passwordGenerator": "/password-generator",
  "passwordStrengthAnalyser": "/password-strength-analyser",
  "pdfSignatureChecker": "/pdf-signature-checker",
  "pdfToolsDashboard": "/pdf-tools-dashboard",
  "percentageCalculator": "/percentage-calculator",
  "phoneParser": "/phone-parser",
  "qrGenerator": "/qr-generator",
  "randomPortGenerator": "/random-port-generator",
  "regexTester": "/regex-tester",
  "romanNumeralConverter": "/roman-numeral-converter",
  "rsaKeyPairGenerator": "/rsa-key-pair-generator",
  "slugifyString": "/slugify-string",
  "speedTest": "/speed-test",
  "sqlPrettify": "/sql-prettify",
  "stringObfuscator": "/string-obfuscator",
  "svgPlaceholderGenerator": "/svg-placeholder-generator",
  "temperatureConverter": "/temperature-converter",
  "textDataDashboard": "/text-data-dashboard",
  "textDiff": "/text-diff",
  "textStatistics": "/text-statistics",
  "textToBinary": "/text-to-binary",
  "textToNatoAlphabet": "/text-to-nato-alphabet",
  "textToUnicode": "/text-to-unicode",
  "tokenGenerator": "/token-generator",
  "tomlToJsonConverter": "/toml-to-json-converter",
  "tomlToYamlConverter": "/toml-to-yaml-converter",
  "typingSpeed": "/typing-speed",
  "urlEncoderDecoder": "/url-encoder-decoder",
  "urlParser": "/url-parser",
  "userAgentParser": "/user-agent-parser",
  "uuidGenerator": "/uuid-generator",
  "webToolsDashboard": "/web-tools-dashboard",
  "wifiQrCodeGenerator": "/wifi-qr-code-generator",
  "xmlFormatter": "/xml-formatter",
  "xmlToJsonConverter": "/xml-to-json-converter",
  "yamlPrettify": "/yaml-prettify",
  "yamlToJsonToml": "/yaml-to-json-toml"
} as const;
