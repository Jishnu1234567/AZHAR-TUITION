/**
 * convert-webp.js
 * Converts all PNG/JPG images in a folder to WebP format.
 *
 * Usage:
 *   node convert-webp.js
 *
 * Install dependency first:
 *   npm install sharp
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// ── Config ──────────────────────────────────────────────────────────────
const INPUT_DIR = path.join(__dirname, 'public', 'herosection');
const OUTPUT_DIR = path.join(__dirname, 'public', 'herosection-webp');
const QUALITY = 82; // 0-100, higher = better quality but larger file
// ────────────────────────────────────────────────────────────────────────

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const files = fs.readdirSync(INPUT_DIR).filter(f =>
  /\.(png|jpg|jpeg)$/i.test(f)
);

if (files.length === 0) {
  console.log('No PNG/JPG files found in', INPUT_DIR);
  process.exit(0);
}

console.log(`Converting ${files.length} images to WebP (quality: ${QUALITY})...\n`);

let done = 0;

Promise.all(
  files.map(async (file) => {
    const inputPath = path.join(INPUT_DIR, file);
    const outputName = path.basename(file, path.extname(file)) + '.webp';
    const outputPath = path.join(OUTPUT_DIR, outputName);

    try {
      await sharp(inputPath)
        .webp({ quality: QUALITY })
        .toFile(outputPath);

      done++;
      const percent = Math.round((done / files.length) * 100);
      process.stdout.write(`\r  Progress: ${done}/${files.length} (${percent}%)`);
    } catch (err) {
      console.error(`\nFailed: ${file} —`, err.message);
    }
  })
).then(() => {
  console.log(`\n\nDone! WebP files saved to: ${OUTPUT_DIR}`);
  console.log('To use WebP in Hero.tsx, update getFrameUrl to:');
  console.log("  const getFrameUrl = (i) => `/herosection-webp/ezgif-frame-${pad(i)}.webp`");
});