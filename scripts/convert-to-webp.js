#!/usr/bin/env node

import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const QUALITY = 85; // WebP quality (0-100)
const DIRECTORIES = [
  path.join(__dirname, '../public/images'),
  path.join(__dirname, '../public/Dashboard-demo-foto'),
  path.join(__dirname, '../public/favicon'),
];

const EXTENSIONS = ['.png', '.jpg', '.jpeg'];

// Stats tracking
let converted = 0;
let skipped = 0;
let totalSizeBefore = 0;
let totalSizeAfter = 0;

async function convertToWebP(inputPath, outputPath) {
  try {
    const stats = await fs.stat(inputPath);
    totalSizeBefore += stats.size;

    // Check if WebP already exists
    try {
      const webpStats = await fs.stat(outputPath);
      console.log(`⏭️  Skipping ${path.basename(inputPath)} - WebP already exists`);
      skipped++;
      totalSizeAfter += webpStats.size;
      return;
    } catch (e) {
      // WebP doesn't exist, continue with conversion
    }

    await sharp(inputPath)
      .webp({ quality: QUALITY })
      .toFile(outputPath);

    const webpStats = await fs.stat(outputPath);
    totalSizeAfter += webpStats.size;

    const reduction = ((1 - webpStats.size / stats.size) * 100).toFixed(1);
    console.log(`✅ Converted ${path.basename(inputPath)} → ${path.basename(outputPath)} (${reduction}% smaller)`);
    converted++;
  } catch (error) {
    console.error(`❌ Failed to convert ${inputPath}:`, error.message);
  }
}

async function processDirectory(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Skip 'unused' directories
        if (entry.name === 'unused') {
          console.log(`⏭️  Skipping unused directory: ${fullPath}`);
          continue;
        }
        await processDirectory(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (EXTENSIONS.includes(ext)) {
          const outputPath = fullPath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
          await convertToWebP(fullPath, outputPath);
        }
      }
    }
  } catch (error) {
    console.error(`❌ Failed to process directory ${dir}:`, error.message);
  }
}

async function main() {
  console.log('🎨 Starting WebP conversion...\n');

  for (const dir of DIRECTORIES) {
    console.log(`📁 Processing: ${path.relative(process.cwd(), dir)}`);
    await processDirectory(dir);
    console.log('');
  }

  console.log('📊 Conversion Summary:');
  console.log(`✅ Converted: ${converted} images`);
  console.log(`⏭️  Skipped: ${skipped} images (already converted)`);

  if (totalSizeBefore > 0) {
    const totalReduction = ((1 - totalSizeAfter / totalSizeBefore) * 100).toFixed(1);
    const beforeMB = (totalSizeBefore / 1024 / 1024).toFixed(2);
    const afterMB = (totalSizeAfter / 1024 / 1024).toFixed(2);
    console.log(`💾 Size reduction: ${beforeMB}MB → ${afterMB}MB (${totalReduction}% smaller)`);
  }
}

main().catch(console.error);