import {
  Combine,
  Scissors,
  Minimize2,
  FileSpreadsheet,
  FileText,
  Presentation,
  Image as ImageIcon,
  RotateCw,
  Unlock,
  Lock,
  Wrench,
  PenTool,
  ArrowRightLeft,
  Settings,
  TrendingUp,
  FileImage,
  FileInput,
  FileOutput
} from "lucide-react";

export interface PdfTool {
  id: string;
  name: string;
  shortDesc: string;
  longDesc: string;
  category: "organize" | "from-pdf" | "to-pdf" | "optimize-edit" | "security";
  iconName: string; // Used to dynamically map icons
  route: string;
}

export const PDF_TOOLS: PdfTool[] = [
  {
    id: "merge-pdf",
    name: "Merge PDF",
    shortDesc: "Combine multiple PDF files into one.",
    longDesc: "Select multiple PDF files, arrange their order with drag-and-drop, and merge them into a single high-quality document.",
    category: "organize",
    iconName: "Combine",
    route: "/ilovepdf/merge-pdf"
  },
  {
    id: "split-pdf",
    name: "Split PDF",
    shortDesc: "Extract specific page ranges from a PDF.",
    longDesc: "Divide a PDF into single pages, or extract specific page ranges (e.g., pages 1-5, 10) into a brand new PDF document.",
    category: "organize",
    iconName: "Scissors",
    route: "/ilovepdf/split-pdf"
  },
  {
    id: "compress-pdf",
    name: "Compress PDF",
    shortDesc: "Reduce PDF file size while keeping quality.",
    longDesc: "Optimize files and images inside your PDF to shrink size while maintaining crisp typography and layout resolution.",
    category: "optimize-edit",
    iconName: "Minimize2",
    route: "/ilovepdf/compress-pdf"
  },
  {
    id: "pdf-to-word",
    name: "PDF to Word",
    shortDesc: "Convert PDF to editable DOCX document.",
    longDesc: "Extract paragraphs, format grids, and transfer tables directly from your PDF into a fully editable Microsoft Word .docx file.",
    category: "from-pdf",
    iconName: "FileText",
    route: "/ilovepdf/pdf-to-word"
  },
  {
    id: "word-to-pdf",
    name: "Word to PDF",
    shortDesc: "Convert Word DOCX files to secure PDF.",
    longDesc: "Process files from DOCX formats into high-fidelity PDF documents with fully preserved alignments, fonts, and elements.",
    category: "to-pdf",
    iconName: "FileOutput",
    route: "/ilovepdf/word-to-pdf"
  },
  {
    id: "pdf-to-powerpoint",
    name: "PDF to PowerPoint",
    shortDesc: "Transform PDF into PPTX slideshows.",
    longDesc: "Structure text layouts and headings from your PDF pages into fully editable, presentation-ready Microsoft PowerPoint slide decks.",
    category: "from-pdf",
    iconName: "Presentation",
    route: "/ilovepdf/pdf-to-powerpoint"
  },
  {
    id: "powerpoint-to-pdf",
    name: "PowerPoint to PDF",
    shortDesc: "Convert PPT/PPTX slides to PDF.",
    longDesc: "Transform presentation visual slides (PPT/PPTX) into high-resolution, easy-to-read PDF pages for seamless sharing.",
    category: "to-pdf",
    iconName: "FileInput",
    route: "/ilovepdf/powerpoint-to-pdf"
  },
  {
    id: "pdf-to-excel",
    name: "PDF to Excel",
    shortDesc: "Pull tables and data into Excel spreadsheets.",
    longDesc: "Extract multi-column grid arrays and formatted table lists from your PDF and populate them into Microsoft Excel.xlsx formats.",
    category: "from-pdf",
    iconName: "FileSpreadsheet",
    route: "/ilovepdf/pdf-to-excel"
  },
  {
    id: "excel-to-pdf",
    name: "Excel to PDF",
    shortDesc: "Print dynamic Excel worksheets to clean PDF.",
    longDesc: "Format spreadsheet rows and layout grids neatly, setting custom width scaling, and render workbook lines to a ledger PDF.",
    category: "to-pdf",
    iconName: "ArrowRightLeft",
    route: "/ilovepdf/excel-to-pdf"
  },
  {
    id: "pdf-to-jpg",
    name: "PDF to JPG",
    shortDesc: "Extract all PDF pages into separate images.",
    longDesc: "Render each individual page of a PDF document into a sharp, downloadable high-resolution JPEG (.jpg) format.",
    category: "from-pdf",
    iconName: "ImageIcon",
    route: "/ilovepdf/pdf-to-jpg"
  },
  {
    id: "jpg-to-pdf",
    name: "JPG to PDF",
    shortDesc: "Stitch multiple images into a solid PDF.",
    longDesc: "Upload custom JPG, PNG, and WebP images, reorder them as desired, combine sizes, and generate a multi-page PDF workbook.",
    category: "to-pdf",
    iconName: "FileImage",
    route: "/ilovepdf/jpg-to-pdf"
  },
  {
    id: "rotate-pdf",
    name: "Rotate PDF",
    shortDesc: "Rotate pages of a PDF visually.",
    longDesc: "Read PDF files page-by-page, visualize them, and rotate them in specific directions (90, 180, 270 degrees) dynamically.",
    category: "organize",
    iconName: "RotateCw",
    route: "/ilovepdf/rotate-pdf"
  },
  {
    id: "unlock-pdf",
    name: "Unlock PDF",
    shortDesc: "Remove security passwords from custom PDFs.",
    longDesc: "Decrypt protected files, lift general user editing credentials, and download cracked documents without standard security warnings.",
    category: "security",
    iconName: "Unlock",
    route: "/ilovepdf/unlock-pdf"
  },
  {
    id: "protect-pdf",
    name: "Protect PDF",
    shortDesc: "Encrypt PDF with secure password protection.",
    longDesc: "Lock down your sensitive PDFs by securing files with password parameters that prompt for entry upon opening anywhere.",
    category: "security",
    iconName: "Lock",
    route: "/ilovepdf/protect-pdf"
  },
  {
    id: "repair-pdf",
    name: "Repair PDF",
    shortDesc: "Reconstruct damaged structures or faulty offsets.",
    longDesc: "Standardize formatting streams and rebuild faulty cross-reference tables (XREF) to bypass loading warnings.",
    category: "organize",
    iconName: "Wrench",
    route: "/ilovepdf/repair-pdf"
  },
  {
    id: "edit-pdf",
    name: "Edit PDF",
    shortDesc: "Add text labels, shapes, and doodles onto pages.",
    longDesc: "Visually superimpose responsive text blocks, shapes, highlight labels, or signature drawings directly onto specified PDF canvas layers.",
    category: "optimize-edit",
    iconName: "PenTool",
    route: "/ilovepdf/edit-pdf"
  }
];

export const CATEGORY_LABELS = {
  organize: "Organize PDF",
  "from-pdf": "Convert from PDF",
  "to-pdf": "Convert to PDF",
  "optimize-edit": "Optimize & Edit",
  security: "PDF Security"
};

export const CATEGORY_COLORS = {
  organize: "border-red-500/20 hover:border-red-500/50 text-red-500 bg-red-500/5",
  "from-pdf": "border-blue-500/20 hover:border-blue-500/50 text-blue-500 bg-blue-500/5",
  "to-pdf": "border-green-500/20 hover:border-green-500/50 text-green-500 bg-green-500/5",
  "optimize-edit": "border-purple-500/20 hover:border-purple-500/50 text-purple-500 bg-purple-500/5",
  security: "border-amber-500/20 hover:border-amber-500/50 text-amber-500 bg-amber-500/5"
};

export const getToolIcon = (name: string): React.ComponentType<any> => {
  switch (name) {
    case "Combine": return Combine;
    case "Scissors": return Scissors;
    case "Minimize2": return Minimize2;
    case "FileText": return FileText;
    case "FileOutput": return FileOutput;
    case "Presentation": return Presentation;
    case "FileInput": return FileInput;
    case "FileSpreadsheet": return FileSpreadsheet;
    case "ArrowRightLeft": return ArrowRightLeft;
    case "ImageIcon": return ImageIcon;
    case "FileImage": return FileImage;
    case "RotateCw": return RotateCw;
    case "Unlock": return Unlock;
    case "Lock": return Lock;
    case "Wrench": return Wrench;
    case "PenTool": return PenTool;
    default: return FileText;
  }
};

