import type { FaqItem } from "@/components/FaqSection";

const GENERAL_FAQS: Record<string, FaqItem[]> = {
  en: [
    {
      question: "Is this online utility completely free and secure?",
      answer: "Yes, 100% free with zero sign-up requirements. All operations process locally inside your browser sandbox so your sensitive data never leaves your device.",
    },
    {
      question: "How does browser-based offline processing work?",
      answer: "Our application utilizes WebAssembly, HTML5 APIs, and Web Crypto engines. Once loaded, tools run independently on your local CPU without sending payloads to external servers.",
    },
    {
      question: "Are files or inputs stored on external servers?",
      answer: "No. None of your files, text inputs, generated keys, or images are uploaded or stored anywhere. Your privacy is guaranteed.",
    },
  ],
  de: [
    {
      question: "Ist dieses Online-Tool vollständig kostenlos und sicher?",
      answer: "Ja, 100% kostenlos ohne Registrierung. Alle Verarbeitungen laufen lokal in Ihrem Browser, sodass Ihre vertraulichen Daten das Gerät nie verlassen.",
    },
    {
      question: "Wie funktioniert die browserbasierte Offline-Verarbeitung?",
      answer: "Unsere Tools nutzen WebAssembly und Web Crypto APIs. Nach dem Laden führen sie Berechnungen direkt auf Ihrer CPU ohne Serverübertragung aus.",
    },
    {
      question: "Werden Dateien oder Eingaben auf Servern gespeichert?",
      answer: "Nein. Keine Ihrer Dateien, Texte oder Schlüssel werden hochgeladen oder gespeichert. Ihre Privatsphäre ist zu 100% geschützt.",
    },
  ],
  es: [
    {
      question: "¿Esta herramienta en línea es completamente gratuita y segura?",
      answer: "Sí, 100% gratuita y sin registros. Todo se procesa localmente en su navegador para garantizar la privacidad absoluta de sus datos.",
    },
    {
      question: "¿Cómo funciona el procesamiento local en el navegador?",
      answer: "Utilizamos WebAssembly y motores Web Crypto. Una vez cargada la página, la herramienta ejecuta los procesos directamente en su dispositivo.",
    },
    {
      question: "¿Se guardan archivos o datos en servidores externos?",
      answer: "No. Ninguno de sus archivos o textos ingresados se sube ni se almacena en ningún servidor.",
    },
  ],
  fr: [
    {
      question: "Cet outil en ligne est-il entièrement gratuit et sécurisé ?",
      answer: "Oui, 100 % gratuit et sans inscription. Tous les traitements s'effectuent localement dans votre navigateur sans transfert de données.",
    },
    {
      question: "Comment fonctionne le traitement hors ligne dans le navigateur ?",
      answer: "Nous utilisons WebAssembly et les API Web Crypto. Une fois chargée, l'application fonctionne de manière autonome sur votre processeur local.",
    },
    {
      question: "Vos fichiers ou données sont-ils enregistrés sur un serveur ?",
      answer: "Non. Aucun fichier, texte ou clé générée n'est téléchargé ni conservé sur nos serveurs.",
    },
  ],
  id: [
    {
      question: "Apakah alat online ini benar-benar gratis dan aman?",
      answer: "Ya, 100% gratis tanpa perlu mendaftar. Semua proses berjalan secara lokal di browser Anda sehingga data sensitif Anda tetap aman.",
    },
    {
      question: "Bagaimana cara kerja pemrosesan lokal di browser?",
      answer: "Aplikasi kami menggunakan WebAssembly dan Web Crypto API. Setelah dimuat, alat berjalan secara mandiri tanpa mengirim data ke server.",
    },
    {
      question: "Apakah file atau data saya disimpan di server luar?",
      answer: "Tidak. Tidak ada file, teks, atau kunci yang diunggah atau disimpan di server mana pun.",
    },
  ],
  it: [
    {
      question: "Questo strumento online è completamente gratuito e sicuro?",
      answer: "Sì, gratuito al 100% e senza registrazione. Tutte le operazioni avvengono localmente nel browser per la massima sicurezza.",
    },
    {
      question: "Come funziona l'elaborazione offline nel browser?",
      answer: "Utilizziamo WebAssembly e API Web Crypto. Una volta caricata la pagina, l'elaborazione viene eseguita direttamente sul tuo dispositivo.",
    },
    {
      question: "I file o i dati immessi vengono salvati su server esterni?",
      answer: "No. Nessun file, testo o chiave viene mai caricato o memorizzato su server esterni.",
    },
  ],
  nl: [
    {
      question: "Is deze online tool volledig gratis en veilig?",
      answer: "Ja, 100% gratis zonder registratie. Alle verwerkingen vinden lokaal in je browser plaats, zodat je gegevens nooit je apparaat verlaten.",
    },
    {
      question: "Hoe werkt lokale browserverwerking?",
      answer: "Wij gebruiken WebAssembly en Web Crypto-engine. Na het laden draait de tool onafhankelijk op je eigen CPU zonder serveroverdracht.",
    },
    {
      question: "Worden bestanden of gegevens opgeslagen op externe servers?",
      answer: "Nee. Geen enkel bestand, tekst of gegenereerde sleutel wordt geüpload of opgeslagen.",
    },
  ],
  pt: [
    {
      question: "Esta ferramenta online é totalmente gratuita e segura?",
      answer: "Sim, 100% gratuita e sem necessidade de cadastro. O processamento ocorre localmente no seu navegador para total privacidade.",
    },
    {
      question: "Como funciona o processamento offline no navegador?",
      answer: "Utilizamos WebAssembly e Web Crypto APIs. Após o carregamento, as operações rodam diretamente no seu processador local.",
    },
    {
      question: "Algum arquivo ou dado é salvo em servidores externos?",
      answer: "Não. Nenhum arquivo, texto ou chave gerada é enviado ou armazenado em servidores.",
    },
  ],
  tr: [
    {
      question: "Bu çevrimiçi araç tamamen ücretsiz ve güvenli mi?",
      answer: "Evet, kayıtsız ve %100 ücretsizdir. Tüm işlemler doğrudan tarayıcınızda gerçekleştiği için verileriniz tamamen güvendedir.",
    },
    {
      question: "Tarayıcı tabanlı çevrimdışı işlem nasıl çalışır?",
      answer: "WebAssembly ve Web Crypto API'lerini kullanıyoruz. Sayfa yüklendikten sonra araç doğrudan cihazınız üzerinde çalışır.",
    },
    {
      question: "Dosyalarım veya verilerim herhangi bir sunucuda saklanıyor mu?",
      answer: "Hayır. Hiçbir dosyanız, metniniz veya anahtarınız sunuculara yüklenmez veya saklanmaz.",
    },
  ],
};

const SPECIFIC_FAQS: Record<string, Record<string, FaqItem[]>> = {
  "json-diff": {
    en: [
      { question: "Is this JSON Diff tool free and secure?", answer: "Yes, comparison runs 100% client-side. Large JSON structures up to tens of megabytes are evaluated instantly in browser memory." },
      { question: "How does the structural recursive JSON diff work?", answer: "The diff algorithm traverses object trees and array elements recursively, highlighting additions in green, deletions in red, and updates in amber." },
      { question: "Can I filter to show only differences?", answer: "Yes! Check the 'Show only differences' toggle to isolate modified key-value pairs and hide identical baseline data." },
    ],
  },
  "password-generator": {
    en: [
      { question: "How does offline Web Crypto generation work?", answer: "Our password generator uses window.crypto.getRandomValues() to ensure high-entropy cryptographic randomness without predictable seed flaws." },
      { question: "Are generated passwords logged or transmitted?", answer: "Never. Passwords are generated exclusively in local RAM and wiped as soon as you refresh or clear your session." },
      { question: "Can I customize length and character sets?", answer: "Yes! Adjust length sliders from 4 to 128+ characters and toggle uppercase, lowercase, numbers, and special symbols dynamically." },
    ],
  },
  "qr-generator": {
    en: [
      { question: "Are QR codes generated here free for commercial use?", answer: "Yes, all vector SVG and raster PNG QR codes are yours to keep, print, share, and commercialize with zero royalties or expiration dates." },
      { question: "Do generated QR codes expire?", answer: "No. Static QR codes encode the payload directly into the matrix, so they function permanently without relying on redirects." },
      { question: "What content types can I encode into a QR code?", answer: "You can encode website URLs, plain text, WiFi access credentials, email addresses, phone numbers, and vCard contact cards." },
    ],
  },
  "speed-test": {
    en: [
      { question: "How does the real-time internet speed test calculate bandwidth?", answer: "It measures TCP/HTTPS throughput against edge servers, tracking latency (ping), jitter, download megabits per second, and upload bandwidth." },
      { question: "Is this speed test accurate for fiber and 5G connections?", answer: "Yes, it leverages chunked stream concurrency to accurately saturate high-speed gigabit fiber and mobile 5G connections." },
      { question: "Does running the test store my IP address?", answer: "No IP addresses or location logs are logged or saved to persistent database storage." },
    ],
  },
  "typing-speed": {
    en: [
      { question: "How is Words Per Minute (WPM) calculated?", answer: "Standard WPM is calculated as (Total Characters Typed / 5) divided by Elapsed Time in Minutes, penalized by error counts." },
      { question: "How does accuracy percentage affect my final score?", answer: "Net WPM subtracts uncorrected errors from Gross WPM, ensuring that typing speed reflects real-world productivity." },
      { question: "Is my typing test history stored locally?", answer: "Yes, your personal high scores and WPM progress are saved in your browser's local storage for private review." },
    ],
  },
  "color-picker": {
    en: [
      { question: "How does the browser eyedropper tool extract colors?", answer: "It utilizes the HTML5 EyeDropper API to sample exact screen pixel coordinates and convert them to HEX, RGB, and HSL formats." },
      { question: "Can I generate WCAG accessible color contrasts?", answer: "Yes, the palette tool calculates contrast ratios against light and dark text baselines for Web Content Accessibility Guidelines compliance." },
    ],
  },
  "barcode-reader": {
    en: [
      { question: "How does client-side barcode scanning work?", answer: "The reader utilizes the browser's BarcodeDetector API and WebAssembly matrix decoders to process image frames without uploading files." },
      { question: "Which barcode formats can be scanned?", answer: "It supports QR Code, CODE-128, CODE-39, EAN-13, EAN-8, UPC-A, UPC-E, Data Matrix, and Aztec formats." },
    ],
  },
  "pdf-tools-dashboard": {
    en: [
      { question: "What PDF operations are available in this dashboard?", answer: "You can merge, split, compress, rotate, protect, unlock, edit, and cross-convert PDF documents to Word, Excel, PowerPoint, and JPG formats." },
      { question: "Is document privacy protected during PDF conversion?", answer: "Yes! PDF parsing, raster rendering, and page manipulation run in client-side WebAssembly containers without uploading documents." },
    ],
  },
  "image-tools-dashboard": {
    en: [
      { question: "What image formats can I compress and convert?", answer: "Supports JPG, PNG, WebP, AVIF, GIF, SVG, BMP, TIFF, and ICO image files with bulk batch conversion." },
      { question: "Does AI background removal upload photos to a server?", answer: "No, AI background extraction utilizes edge segment models running locally in your browser's WebGL context." },
    ],
  },
  "crypto-security-dashboard": {
    en: [
      { question: "What security utilities are included in this suite?", answer: "Includes Password Generators, JWT Parsers, Hash Functions (SHA-256, MD5), HMAC, RSA Key Generation, Bcrypt, and Encryption tools." },
      { question: "Why is local Web Crypto execution important for security?", answer: "Executing cryptographic functions in local RAM guarantees that private keys, secrets, and plaintexts are never exposed to network sniffing." },
    ],
  },
};

export function getFaqsForRoute(path: string, locale = "en"): FaqItem[] {
  const normalizedLocale = (GENERAL_FAQS[locale] ? locale : "en") as keyof typeof GENERAL_FAQS;
  const cleanPath = path.replace(/^\/(?:de|en|es|fr|id|it|nl|pt|tr)(?=\/|$)/, "").replace(/^\//, "") || "home";

  const specific = SPECIFIC_FAQS[cleanPath]?.[normalizedLocale] || SPECIFIC_FAQS[cleanPath]?.en;
  if (specific && specific.length > 0) {
    return specific;
  }

  return GENERAL_FAQS[normalizedLocale] || GENERAL_FAQS.en;
}
