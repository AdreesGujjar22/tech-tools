#!/usr/bin/env node

/**
 * PRODUCTION MIGRATION SCRIPT
 * 
 * Safely applies H1/H2/FAQ updates to all tool pages
 * 
 * Usage: node scripts/migrate-tool-pages.js [--apply]
 * 
 * Without --apply: Shows what would be changed (dry run)
 * With --apply: Actually modifies files and creates backups
 */

const fs = require("fs");
const path = require("path");
const glob = require("glob");

const PAGES_DIR = path.join(process.cwd(), "client", "pages");
const DRY_RUN = !process.argv.includes("--apply");

// Tools that are already properly configured
const SKIP_TOOLS = [
  "NotePad.tsx",
  "Generator.tsx",
  "PasswordGenerator.tsx",
  "JsonDiff.tsx",
  "TextDiff.tsx",
  "EmojiPicker.tsx",
  "BarcodeReader.tsx",
  "UrlParser.tsx",
];

function toolNameToSlug(fileName) {
  const name = fileName.replace(".tsx", "");
  return name
    .replace(/([A-Z])/g, "-$1")
    .toLowerCase()
    .replace(/^-/, "");
}

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const fileName = path.basename(filePath);

  return {
    fileName,
    filePath,
    slug: toolNameToSlug(fileName),
    hasH1: /<h1[^>]*>/.test(content),
    hasH2: /<h2[^>]*>/.test(content),
    hasFaqImport: content.includes('import FaqSection from "@/components/FaqSection"'),
    hasFaqHook: /const\s+faqs\s*=\s*getFaqsForRoute/.test(content),
    hasFaqRender: /<FaqSection/.test(content),
    hasUseTranslations: /useTranslations\("Tools\./.test(content),
    content,
  };
}

function generateUpdates(analysis) {
  const updates = [];

  if (!analysis.hasFaqImport) {
    updates.push({
      type: "import",
      position: "after-last-import",
      code: `import FaqSection from "@/components/FaqSection";\nimport { getFaqsForRoute } from "@/lib/faq-data";`,
    });
  }

  if (!analysis.hasFaqHook) {
    updates.push({
      type: "hook",
      position: "after-translations",
      code: `const faqs = getFaqsForRoute("${analysis.slug}");`,
    });
  }

  if (!analysis.hasFaqRender) {
    updates.push({
      type: "render",
      position: "before-closing-main",
      code: `\n\n      {/* Frequently Asked Questions */}\n      {faqs && faqs.length > 0 && (\n        <FaqSection items={faqs} title="Frequently Asked Questions" />\n      )}`,
    });
  }

  return updates;
}

function applyImportUpdate(content) {
  // Find the last import statement
  const lines = content.split("\n");
  let lastImportIdx = -1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(/^import .+;/)) {
      lastImportIdx = i;
    }
  }

  if (lastImportIdx > -1) {
    const importLines = [
      'import FaqSection from "@/components/FaqSection";',
      'import { getFaqsForRoute } from "@/lib/faq-data";',
    ];

    lines.splice(lastImportIdx + 1, 0, ...importLines);
    return lines.join("\n");
  }

  return content;
}

function applyHookUpdate(content) {
  // Find the useTranslations line and add hook after it
  const hookMatch = content.match(/const\s+\w+\s*=\s*useTranslations\([^)]+\);/);

  if (!hookMatch) return content;

  const match = hookMatch[0];
  const slug = content.match(/getFaqsForRoute\("([^"]+)"\)/);
  const slugValue = slug ? slug[1] : "unknown-slug";

  const replacement = `${match}\n  const faqs = getFaqsForRoute("${slugValue}");`;
  return content.replace(match, replacement);
}

function applyRenderUpdate(content) {
  // Try to find </main> first
  const mainMatch = content.match(/<\/main>/);

  if (mainMatch) {
    const insertion = `\n\n      {/* Frequently Asked Questions */}\n      {faqs && faqs.length > 0 && (\n        <FaqSection items={faqs} title="Frequently Asked Questions" />\n      )}\n    </main>`;
    return content.replace(/<\/main>/, insertion);
  }

  // Fallback: find last </div>
  const lastDivIdx = content.lastIndexOf("</div>");
  if (lastDivIdx > -1) {
    const insertion = `\n\n      {/* Frequently Asked Questions */}\n      {faqs && faqs.length > 0 && (\n        <FaqSection items={faqs} title="Frequently Asked Questions" />\n      )}\n    </div>`;
    return content.slice(0, lastDivIdx) + insertion + content.slice(lastDivIdx + 6);
  }

  return content;
}

function applyUpdates(analysis) {
  const updates = generateUpdates(analysis);

  if (updates.length === 0) {
    return { modified: false, content: analysis.content };
  }

  let updatedContent = analysis.content;

  for (const update of updates) {
    if (update.type === "import") {
      updatedContent = applyImportUpdate(updatedContent);
    } else if (update.type === "hook") {
      updatedContent = applyHookUpdate(updatedContent);
    } else if (update.type === "render") {
      updatedContent = applyRenderUpdate(updatedContent);
    }
  }

  return {
    modified: updatedContent !== analysis.content,
    content: updatedContent,
  };
}

function createBackup(filePath) {
  const backupPath = `${filePath}.backup`;
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(filePath, backupPath);
    return true;
  }
  return false;
}

async function main() {
  console.log("\n╔════════════════════════════════════════════╗");
  console.log("║   TOOL PAGE MIGRATION SCRIPT               ║");
  console.log(DRY_RUN ? "║   MODE: DRY RUN (no files modified)       ║" : "║   MODE: APPLY (files will be modified)    ║");
  console.log("╚════════════════════════════════════════════╝\n");

  // Get all tool pages
  const pattern = path.join(PAGES_DIR, "*.tsx");
  const files = glob.sync(pattern);

  let totalNeedingUpdates = 0;
  let processedCount = 0;
  const results = [];

  for (const filePath of files) {
    const fileName = path.basename(filePath);

    if (SKIP_TOOLS.includes(fileName)) {
      console.log(`⏭️  Skipping: ${fileName} (already updated)`);
      continue;
    }

    const analysis = analyzeFile(filePath);
    const { modified, content: updatedContent } = applyUpdates(analysis);

    if (!modified) {
      continue;
    }

    totalNeedingUpdates++;
    processedCount++;

    if (DRY_RUN) {
      console.log(`\n📝 [${processedCount}] ${fileName}`);
      console.log(`   Slug: ${analysis.slug}`);
      console.log(
        `   Changes needed: ${!analysis.hasFaqImport ? "imports, " : ""}${!analysis.hasFaqHook ? "hook, " : ""}${!analysis.hasFaqRender ? "render" : ""}`
      );
    } else {
      // Create backup
      const backupCreated = createBackup(filePath);

      // Write updated content
      fs.writeFileSync(filePath, updatedContent, "utf-8");

      console.log(`✅ Updated: ${fileName}`);
      if (backupCreated) {
        console.log(`   Backup created: ${fileName}.backup`);
      }

      results.push({ fileName, status: "updated" });
    }
  }

  console.log("\n╔════════════════════════════════════════════╗");
  console.log(`║  TOTAL TOOLS NEEDING UPDATES: ${String(totalNeedingUpdates).padEnd(25)} ║`);
  console.log("╚════════════════════════════════════════════╝\n");

  if (DRY_RUN) {
    console.log("📊 DRY RUN COMPLETE");
    console.log(`\nTo apply these changes, run:\n  node scripts/migrate-tool-pages.js --apply\n`);
  } else {
    console.log("✅ MIGRATION COMPLETE");
    console.log(`\nUpdated ${processedCount} files.`);
    console.log("Backups saved with .backup extension.\n");
    console.log("NEXT STEPS:");
    console.log("1. Review updated files");
    console.log("2. Run: npm run typecheck");
    console.log("3. Run: npm run build");
    console.log("4. Test in browser");
    console.log("5. Delete .backup files when satisfied\n");
  }
}

main().catch(console.error);
