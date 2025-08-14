#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Files to remove from root directory
const rootFilesToRemove = [
  'test-mcp-servers.js',
  'test-email-api.js',
  'test-email-api.cjs',
  'test-slots.cjs',
  'test-slot-blocking.cjs',
  'test-resend.cjs',
  'test-race-conditions.cjs',
  'test-frontend-realtime.cjs',
  'debug-slots.js',
  'debug-slots.cjs',
  'debug-scroll.js',
  'fix-typescript.cjs',
  'fix-returns.cjs',
  'email-verification.cjs',
  'complete-email-test.cjs',
  'test-scroll-behavior.html',
  'test-scroll-lock.html'
];

// API scripts to remove (keep only essential ones)
const apiScriptsToRemove = [
  'api/scripts/test-email.js',
  'api/scripts/test-frontend-appointment.js',
  'api/scripts/test-real-email-delivery.js',
  'api/scripts/test-resend-directly.js',
  'api/scripts/test-v2-appointment.js',
  'api/scripts/test-verified-domain.js',
  'api/scripts/final-appointment-test.js',
  'api/scripts/final-comprehensive-test.js',
  'api/scripts/production-verify.js',
  'api/scripts/verify-database.js',
  'api/scripts/verify-empty-database.js',
  'api/scripts/diagnose-email-issue.js',
  'api/scripts/direct-email-test.js',
  'api/scripts/check-email-logs.js',
  'cleanup-test-files.cjs',
  'api/scripts/empty-all-tables.js'
];

function removeFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`✅ Removed: ${filePath}`);
      return true;
    } else {
      console.log(`⚠️  File not found: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Error removing ${filePath}: ${error.message}`);
    return false;
  }
}

function cleanupTestFiles() {
  console.log('🧹 Starting cleanup of test and debug files...\n');
  
  let removedCount = 0;
  let totalFiles = rootFilesToRemove.length + apiScriptsToRemove.length;
  
  // Remove root directory files
  console.log('📁 Cleaning root directory...');
  rootFilesToRemove.forEach(file => {
    if (removeFile(file)) {
      removedCount++;
    }
  });
  
  console.log('\n📁 Cleaning API scripts directory...');
  apiScriptsToRemove.forEach(file => {
    if (removeFile(file)) {
      removedCount++;
    }
  });
  
  console.log(`\n🎉 Cleanup complete! Removed ${removedCount}/${totalFiles} files.`);
  console.log('\n📋 Kept essential files:');
  console.log('   - package.json files');
  console.log('   - vite.config.ts');
  console.log('   - tsconfig files');
  console.log('   - tailwindconfig.js');
  console.log('   - postcss.config.js');
  console.log('   - eslint.config.js');
  console.log('   - api/scripts/init-database.js');
  console.log('   - api/scripts/init-functions.js');
  console.log('   - api/scripts/simple-init.js');
  console.log('   - api/scripts/add-default-timeslots.js');
}

cleanupTestFiles();
