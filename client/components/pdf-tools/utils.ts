import { collection, addDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * Log a PDF tool execution event to the Firebase analytics tracker.
 * Fully non-PII, keeping file statistics and speed telemetry clean and compliant.
 */
export async function logPdfToolUsage(
  toolId: string,
  fileName: string,
  fileSize: number,
  success: boolean,
  errorMessage: string | null = null
) {
  try {
    const cleanFileName = fileName.replace(/[^\w\.\-\s]/gi, "").substring(0, 100);
    const analyticsRef = collection(db, "pdf_tool_analytics");
    await addDoc(analyticsRef, {
      toolId,
      timestamp: new Date(), // Safe standard date mapped to server rules
      fileName: cleanFileName || "processed_file",
      fileSize: Number(fileSize) || 0,
      success,
      errorMessage: errorMessage ? errorMessage.substring(0, 500) : null
    });
  } catch (err) {
    console.error("Telemetry Logging Error:", err);
  }
}

/**
 * Fetch the active state of a tool relative to settings configured in the Admin Panel database.
 * If no configuration exists, it defaults to true (enabled).
 */
export async function checkPdfToolEnabled(toolId: string): Promise<boolean> {
  try {
    const docRef = doc(db, "pdf_tools_settings", toolId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.enabled !== false;
    }
  } catch (err) {
    console.error(`Error checking tool setting for ${toolId}:`, err);
  }
  return true; // Enabled by default
}

/**
 * Set the enabled/disabled setting for a given tool (Admin action).
 */
export async function setPdfToolEnabled(toolId: string, enabled: boolean): Promise<void> {
  try {
    const docRef = doc(db, "pdf_tools_settings", toolId);
    await setDoc(docRef, {
      toolId,
      enabled,
      updatedAt: new Date()
    });
  } catch (err) {
    console.error(`Error saving setting for tool: ${toolId}`, err);
    throw err;
  }
}
