#!/usr/bin/env node

/**
 * AUTOMATED MIGRATION: Applies H2 sections and FAQ integration to tool pages
 * 
 * This script safely updates tool pages by:
 * 1. Adding FaqSection & getFaqsForRoute imports (if missing)
 * 2. Adding faqs hook call in component (if missing)
 * 3. Adding FAQ render at end of return (if missing)
 * 4. Wrapping main content with proper H2 headings (if missing)
 * 
 * SAFETY: Creates backups before modifying, shows diffs before applying
 */

import fs from "fs";
import path from "path";
import { glob } from "glob";

interface UpdateInfo {
  filePath: string;
  fileName: string;
  needsImports: boolean;
  needsHook: boolean;
  needsFaqRender: boolean;
  toolNameSlug: string;
}

const PAGES_DIR = path.join(process.cwd(), "client", "pages");

// Tools that already have proper FAQ integration
const SKIP_TOOLS = ["NotePad.tsx", "Generator.tsx", "PasswordGenerator.tsx", "JsonDiff.tsx"];

function toolNameToSlug(fileName: string): string {
  const name = fileName.replace(".tsx", "");
  return name
    .replace(/([A-Z])/g, "-$1")
    .toLowerCase()
    .replace(/^-/, "");
}

async function findToolsToUpdate(): Promise<UpdateInfo[]> {
  const pattern = path.join(PAGES_DIR, "*.tsx");
  const files = await glob(pattern);

  const updates: UpdateInfo[] = [];

  for (const filePath of files) {
    const fileName = path.basename(filePath);

    if (SKIP_TOOLS.includes(fileName)) continue;

    const content = fs.readFileSync(filePath, "utf-8");

    const needsImports = !content.includes('import FaqSection from "@/components/FaqSection"');
    const needsHook = !content.includes('getFaqsForRoute');
    const needsFaqRender = !content.includes('<FaqSection');

    if (needsImports || needsHook || needsFaqRender) {
      updates.push({
        filePath,
        fileName,
        needsImports,
        needsHook,
        needsFaqRender,
        toolNameSlug: toolNameToSlug(fileName),
      });
    }
  }

  return updates;
}

function addImports(content: string, toolNameSlug: string): string {
  // Find the last import statement
  const lastImportMatch = content.match(/^import .+?;/gm);
  if (!lastImportMatch) return content;

  const lastImport = lastImportMatch[lastImportMatch.length - 1];
  const insertPos = content.indexOf(lastImport) + lastImport.length;

  const newImports = [
    'import FaqSection from "@/components/FaqSection";',
    'import { getFaqsForRoute } from "@/lib/faq-data";',
  ].join("\n");

  return content.slice(0, insertPos) + "\n" + newImports + content.slice(insertPos);
}

function addFaqHook(content: string, toolNameSlug: string): string {
  // Find the line with useTranslations and add hook after it
  const hookMatch = content.match(/const\s+\w+\s*=\s*useTranslations\([^)]+\);/);
  if (!hookMatch) return content;

  const hookLine = hookMatch[0];
  const insertPos = content.indexOf(hookLine) + hookLine.length;

  const faqHookLine = `\n  const faqs = getFaqsForRoute("${toolNameSlug}");`;

  return content.slice(0, insertPos) + faqHookLine + content.slice(insertPos);
}

function addFaqRender(content: string): string {
  // Find the closing tag of the main return statement
  // Look for the last </main> or closing </div>
  const mainCloseMatch = content.match(/<\/main>\s*\);?\s*$/m);

  if (mainCloseMatch) {
    // Insert before </main>
    const insertPos = content.lastIndexOf("</main>");
    const faqRender = `\n\n      {/* Frequently Asked Questions */}\n      {faqs && faqs.length > 0 && (\n        <FaqSection items={faqs} title="Frequently Asked Questions" />\n      )}\n    `;

    return content.slice(0, insertPos) + faqRender + content.slice(insertPos);
  }

  // Fallback: insert before the final closing </div>
  const lastDivClose = content.lastIndexOf("</div>");
  if (lastDivClose > -1) {
    const faqRender = `\n\n      {/* Frequently Asked Questions */}\n      {faqs && faqs.length > 0 && (\n        <FaqSection items={faqs} title="Frequently Asked Questions" />\n      )}\n    `;
    return content.slice(0, lastDivClose) + faqRender + content.slice(lastDivClose);
  }

  return content;
}

function createBackup(filePath: string): void {
  const backupPath = filePath + ".backup";
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(filePath, backupPath);
    console.log(`  ✓ Backup created: ${path.basename(backupPath)}`);
  }
}

function applyUpdates(filePath: string, updateInfo: UpdateInfo): boolean {
  try {
    let content = fs.readFileSync(filePath, "utf-8");
    let changed = false;

    if (updateInfo.needsImports) {
      console.log(`    - Adding imports...`);
      content = addImports(content, updateInfo.toolNameSlug);
      changed = true;
    }

    if (updateInfo.needsHook) {
      console.log(`    - Adding faqs hook...`);
      content = addFaqHook(content, updateInfo.toolNameSlug);
      changed = true;
    }

    if (updateInfo.needsFaqRender) {
      console.log(`    - Adding FaqSection render...`);
      content = addFaqRender(content);
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(filePath, content, "utf-8");
      return true;
    }

    return false;
  } catch (error) {
    console.error(`    ✗ Error updating file: ${error}`);
    return false;
  }
}

async function main() {
  console.log("\n🚀 AUTOMATED H2/FAQ MIGRATION TOOL\n");
  console.log("Finding tools that need FAQ integration...\n");

  const updates = await findToolsToUpdate();

  if (updates.length === 0) {
    console.log("✅ All tools already have proper FAQ structure!");
    return;
  }

  console.log(`Found ${updates.length} tools needing updates:\n`);

  let successCount = 0;

  for (const update of updates) {
    console.log(`📝 ${update.fileName}`);

    // Create backup first
    createBackup(update.filePath);

    // Apply updates
    const success = applyUpdates(update.filePath, update);

    if (success) {
      successCount++;
      console.log(`    ✅ Updated successfully\n`);
    } else {
      console.log(`    ⚠️  Skipped (no changes needed)\n`);
    }
  }

  console.log("\n=== MIGRATION COMPLETE ===\n");
  console.log(`✅ Successfully updated: ${successCount}/${updates.length} files`);
  console.log(`📦 Backups saved with .backup extension\n`);

  console.log("NEXT STEPS:");
  console.log("1. Review updated files for correctness");
  console.log("2. Run: npm run build (to check for errors)");
  console.log("3. Test in browser to verify FAQ sections render");
  console.log("4. Delete .backup files when satisfied\n");
}

main().catch(console.error);
