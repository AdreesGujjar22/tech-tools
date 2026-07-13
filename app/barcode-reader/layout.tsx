import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Barcode & QR Reader - Tech Tools",
  description: "Read QR codes and barcodes from an image or live camera feed directly in your browser.",
  keywords: ["barcode reader", "QR reader", "webcam scanner", "scan barcode image"],
};

export default function BarcodeReaderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
