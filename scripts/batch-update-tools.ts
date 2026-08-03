#!/usr/bin/env node

/**
 * Batch migration script: Add proper H1/H2/FAQ structure to all 82 tool pages
 * 
 * Usage: npx ts-node scripts/batch-update-tools.ts
 * 
 * This script:
 * 1. Scans all client/pages/*.tsx tool pages
 * 2. Adds missing H2 sections for common areas (If not present)
 * 3. Adds FaqSection imports and renders (If not present)
 * 4. Ensures semantic heading hierarchy is enforced
 */

import fs from "fs";
import path from "path";
import { glob } from "glob";

interface ToolPageInfo {
  filePath: string;
  fileName: string;
  hasH1: boolean;
  hasH2: boolean;
  hasFaq: boolean;
  toolName: string;
  translationNamespace: string;
}

const PAGES_DIR = path.join(process.cwd(), "client", "pages");
const TOOLS_TO_SKIP = [
  "NotePad.tsx", // Special case - admin page
];

async function scanToolPages(): Promise<ToolPageInfo[]> {
  const pattern = path.join(PAGES_DIR, "*.tsx");
  const files = await glob(pattern);

  const tools: ToolPageInfo[] = [];

  for (const filePath of files) {
    const fileName = path.basename(filePath);

    if (TOOLS_TO_SKIP.includes(fileName)) continue;

    const content = fs.readFileSync(filePath, "utf-8");

    // Extract tool name from filename (e.g., "BarcodeGenerator" from "BarcodeGenerator.tsx")
    const toolName = fileName.replace(".tsx", "");

    // Check for presence of key features
    const hasH1 = /<h1[^>]*>/.test(content);
    const hasH2 = /<h2[^>]*>/.test(content);
    const hasFaq = /FaqSection/.test(content) && /getFaqsForRoute/.test(content);

    // Extract translation namespace
    const namespaceMatch = content.match(/useTranslations\("([^"]+)"\)/);
    const translationNamespace = namespaceMatch ? namespaceMatch[1] : "";

    tools.push({
      filePath,
      fileName,
      hasH1,
      hasH2,
      hasFaq,
      toolName,
      translationNamespace,
    });
  }

  return tools;
}

function generateImportStatement(hasH1: boolean, hasFaq: boolean): string[] {
  const imports: string[] = [];

  if (!hasFaq) {
    imports.push('import FaqSection from "@/components/FaqSection";');
    imports.push('import { getFaqsForRoute } from "@/lib/faq-data";');
  }

  return imports;
}

function generateFaqHookCall(toolName: string, hasCurrentFaq: boolean): string {
  if (hasCurrentFaq) return "";

  // Convert toolName to slug (e.g., "BarcodeGenerator" -> "barcode-generator")
  const slug = toolName
    .replace(/([A-Z])/g, "-$1")
    .toLowerCase()
    .replace(/^-/, "");

  return `  const faqs = getFaqsForRoute("${slug}");`;
}

function generateFaqRender(toolName: string): string {
  return `\n      {/* FAQ Section */}\n      {faqs && faqs.length > 0 && <FaqSection items={faqs} title="Frequently Asked Questions" />}`;
}

function generateH2Wrapper(sectionName: string, srOnly = false): string {
  const className = srOnly ? 'className="sr-only"' : 'className="text-3xl font-extrabold tracking-tight text-[#1F3A26] mb-6"';
  return `          <h2 ${className}>${sectionName}</h2>`;
}

function analyzeAndPrintReport(tools: ToolPageInfo[]): void {
  console.log("\n=== TOOL PAGE ANALYSIS REPORT ===\n");

  const withH1 = tools.filter((t) => t.hasH1).length;
  const withH2 = tools.filter((t) => t.hasH2).length;
  const withFaq = tools.filter((t) => t.hasFaq).length;

  console.log(`Total tools scanned: ${tools.length}`);
  console.log(`Tools with H1: ${withH1}/${tools.length} (${Math.round((withH1 / tools.length) * 100)}%)`);
  console.log(`Tools with H2: ${withH2}/${tools.length} (${Math.round((withH2 / tools.length) * 100)}%)`);
  console.log(`Tools with FAQ: ${withFaq}/${tools.length} (${Math.round((withFaq / tools.length) * 100)}%)\n`);

  const needsH2 = tools.filter((t) => !t.hasH2);
  const needsFaq = tools.filter((t) => !t.hasFaq);

  console.log(`\nTools NEEDING H2 sections (${needsH2.length}):`);
  needsH2.slice(0, 20).forEach((t) => {
    console.log(`  - ${t.fileName}`);
  });
  if (needsH2.length > 20) {
    console.log(`  ... and ${needsH2.length - 20} more`);
  }

  console.log(`\nTools NEEDING FAQ sections (${needsFaq.length}):`);
  needsFaq.slice(0, 20).forEach((t) => {
    console.log(`  - ${t.fileName}`);
  });
  if (needsFaq.length > 20) {
    console.log(`  ... and ${needsFaq.length - 20} more`);
  }

  console.log("\n=== RECOMMENDED ACTIONS ===\n");
  console.log(`1. Add H2 sections to ${needsH2.length} tools`);
  console.log(`2. Add FAQ imports & hooks to ${needsFaq.length} tools`);
  console.log(`3. Add FaqSection renders to ${needsFaq.length} tools`);
  console.log(`4. Verify breadcrumbs render on all pages (already global)\n`);
}

function generateMigrationSummary(tools: ToolPageInfo[]): void {
  const needsH2 = tools.filter((t) => !t.hasH2);
  const needsFaq = tools.filter((t) => !t.hasFaq);

  console.log("\n=== MIGRATION SUMMARY ===\n");
  console.log("This script identifies which tools need updates but does NOT auto-modify files.");
  console.log("Reason: Each tool has unique structure and we need careful, reviewed changes.\n");

  console.log("NEXT STEPS:");
  console.log("1. Update tools with missing H2 sections (use pattern from Generator.tsx)");
  console.log("2. Add getFaqsForRoute() hook to tools without FAQ");
  console.log("3. Add <FaqSection> at end of return statement");
  console.log("4. Ensure all H1/H2/H3 hierarchy is semantic and properly styled\n");

  console.log("FILES THAT NEED UPDATES:");
  console.log("\n** Tools needing H2 sections **");
  needsH2.forEach((t, i) => {
    console.log(`${i + 1}. ${t.fileName} (${t.translationNamespace})`);
  });

  console.log("\n** Tools needing FAQ integration **");
  needsFaq.forEach((t, i) => {
    console.log(
      `${i + 1}. ${t.fileName} (slug: ${t.toolName
        .replace(/([A-Z])/g, "-$1")
        .toLowerCase()
        .replace(/^-/, "")})`
    );
  });
}

async function main() {
  console.log("🔍 Scanning tool pages for H1/H2/FAQ structure...\n");

  const tools = await scanToolPages();
  analyzeAndPrintReport(tools);
  generateMigrationSummary(tools);

  console.log("\n✅ Analysis complete. Review the recommendations above.\n");
}

main().catch(console.error);
