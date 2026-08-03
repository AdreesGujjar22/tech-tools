#!/usr/bin/env node

/**
 * CLEANUP MIGRATION BACKUPS
 * 
 * Removes .backup files created during migration
 * Run after you've verified all changes are correct
 * 
 * Usage: node scripts/cleanup-backups.js
 */

const fs = require("fs");
const path = require("path");
const glob = require("glob");

const PAGES_DIR = path.join(process.cwd(), "client", "pages");

async function main() {
  console.log("\n🧹 CLEANING UP BACKUP FILES\n");

  const pattern = path.join(PAGES_DIR, "*.backup");
  const backups = glob.sync(pattern);

  if (backups.length === 0) {
    console.log("✅ No backup files found. Nothing to clean up.\n");
    return;
  }

  console.log(`Found ${backups.length} backup files:\n`);

  for (const backupFile of backups) {
    fs.unlinkSync(backupFile);
    console.log(`🗑️  Deleted: ${path.basename(backupFile)}`);
  }

  console.log(`\n✅ Cleanup complete. Removed ${backups.length} backup files.\n`);
}

main().catch(console.error);
