export interface Color {
  id: string; // Dynamic identifier for lock toggle tracking
  hex: string;
  locked: boolean; // Tracks if selected color is locked in generation
  rgb: {
    r: number;
    g: number;
    b: number;
  };
  hsl: {
    h: number;
    s: number;
    l: number;
  };
}

export function getTextColor(hex: string): string {
  // Normalize hex string
  const normalizedHex = hex.replace("#", "");
  if (normalizedHex.length !== 6) {
    return "#ffffff"; // Default fallback
  }

  // Parse RGB
  const r = parseInt(normalizedHex.substring(0, 2), 16);
  const g = parseInt(normalizedHex.substring(2, 4), 16);
  const b = parseInt(normalizedHex.substring(4, 6), 16);

  // Calculate perceived brightness / relative luminance using YIQ formula
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? "#0f172a" : "#f1f5f9"; // Returns dark or light color based on luminance
}
