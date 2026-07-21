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
  category: "organize" | "from-pdf" | "to-pdf" | "optimize-edit" | "security";
  iconName: string; // Used to dynamically map icons
  route: string;
}

export const PDF_TOOLS: PdfTool[] = [
  {
    id: "merge-pdf",
    category: "organize",
    iconName: "Combine",
    route: "/ilovepdf/merge-pdf"
  },
  {
    id: "split-pdf",
    category: "organize",
    iconName: "Scissors",
    route: "/ilovepdf/split-pdf"
  },
  {
    id: "compress-pdf",
    category: "optimize-edit",
    iconName: "Minimize2",
    route: "/ilovepdf/compress-pdf"
  },
  {
    id: "pdf-to-word",
    category: "from-pdf",
    iconName: "FileText",
    route: "/ilovepdf/pdf-to-word"
  },
  {
    id: "word-to-pdf",
    category: "to-pdf",
    iconName: "FileOutput",
    route: "/ilovepdf/word-to-pdf"
  },
  {
    id: "pdf-to-powerpoint",
    category: "from-pdf",
    iconName: "Presentation",
    route: "/ilovepdf/pdf-to-powerpoint"
  },
  {
    id: "powerpoint-to-pdf",
    category: "to-pdf",
    iconName: "FileInput",
    route: "/ilovepdf/powerpoint-to-pdf"
  },
  {
    id: "pdf-to-excel",
    category: "from-pdf",
    iconName: "FileSpreadsheet",
    route: "/ilovepdf/pdf-to-excel"
  },
  {
    id: "excel-to-pdf",
    category: "to-pdf",
    iconName: "ArrowRightLeft",
    route: "/ilovepdf/excel-to-pdf"
  },
  {
    id: "pdf-to-jpg",
    category: "from-pdf",
    iconName: "ImageIcon",
    route: "/ilovepdf/pdf-to-jpg"
  },
  {
    id: "jpg-to-pdf",
    category: "to-pdf",
    iconName: "FileImage",
    route: "/ilovepdf/jpg-to-pdf"
  },
  {
    id: "rotate-pdf",
    category: "organize",
    iconName: "RotateCw",
    route: "/ilovepdf/rotate-pdf"
  },
  {
    id: "unlock-pdf",
    category: "security",
    iconName: "Unlock",
    route: "/ilovepdf/unlock-pdf"
  },
  {
    id: "protect-pdf",
    category: "security",
    iconName: "Lock",
    route: "/ilovepdf/protect-pdf"
  },
  {
    id: "repair-pdf",
    category: "organize",
    iconName: "Wrench",
    route: "/ilovepdf/repair-pdf"
  },
  {
    id: "edit-pdf",
    category: "optimize-edit",
    iconName: "PenTool",
    route: "/ilovepdf/edit-pdf"
  }
];

export const CATEGORY_LABELS = {
  organize: "organize",
  "from-pdf": "fromPdf",
  "to-pdf": "toPdf",
  "optimize-edit": "optimizeEdit",
  security: "security"
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
