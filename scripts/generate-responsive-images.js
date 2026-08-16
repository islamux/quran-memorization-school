#!/usr/bin/env node

/**
 * Script to generate responsive images
 * Usage: node scripts/generate-responsive-images.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Image sizes to generate
const SIZES = [320, 640, 750, 828, 1080, 1200, 1920, 2048];
const QUALITIES = {
  avif: 50,
  webp: 75,
  jpeg: 80
};

// Source and output directories
const SOURCE_DIR = path.join(__dirname, '../public/images/original');
const OUTPUT_DIR = path.join(__dirname, '../public/images/optimized');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Generate responsive images using Sharp
 */
function generateImages(imagePath, imageName) {
  const baseName = path.parse(imageName).name;
  const ext = path.parse(imageName).ext;

  console.log(`🖼️  Processing: ${imageName}`);

  // Generate different sizes
  SIZES.forEach(size => {
    // AVIF format
    try {
      const avifOutput = path.join(OUTPUT_DIR, `${baseName}-${size}.avif`);
      execSync(`npx sharp-cli -i "${imagePath}" -o "${avifOutput}" -f avif -q ${QUALITIES.avif} ${size}w`);
      console.log(`  ✅ ${baseName}-${size}.avif`);
    } catch (error) {
      console.warn(`  ⚠️  Failed to generate AVIF for ${size}w: ${error.message}`);
    }

    // WebP format
    try {
      const webpOutput = path.join(OUTPUT_DIR, `${baseName}-${size}.webp`);
      execSync(`npx sharp-cli -i "${imagePath}" -o "${webpOutput}" -f webp -q ${QUALITIES.webp} ${size}w`);
      console.log(`  ✅ ${baseName}-${size}.webp`);
    } catch (error) {
      console.warn(`  ⚠️  Failed to generate WebP for ${size}w: ${error.message}`);
    }

    // JPEG format
    try {
      const jpegOutput = path.join(OUTPUT_DIR, `${baseName}-${size}.jpg`);
      execSync(`npx sharp-cli -i "${imagePath}" -o "${jpegOutput}" -f jpeg -q ${QUALITIES.jpeg} ${size}w`);
      console.log(`  ✅ ${baseName}-${size}.jpg`);
    } catch (error) {
      console.warn(`  ⚠️  Failed to generate JPEG for ${size}w: ${error.message}`);
    }
  });
}

/**
 * Generate blur placeholder
 */
function generateBlurPlaceholder(imagePath, imageName) {
  const baseName = path.parse(imageName).name;
  const blurOutput = path.join(OUTPUT_DIR, `${baseName}-blur.jpg`);

  try {
    execSync(`npx sharp-cli -i "${imagePath}" -o "${blurOutput}" -f jpeg -q 10 -w 20`);
    console.log(`  ✨ Generated blur placeholder: ${baseName}-blur.jpg`);
  } catch (error) {
    console.warn(`  ⚠️  Failed to generate blur placeholder: ${error.message}`);
  }
}

/**
 * Main function
 */
function main() {
  console.log('🚀 Starting image optimization...\n');

  // Check if Sharp is installed
  try {
    execSync('npx sharp-cli --version', { stdio: 'ignore' });
  } catch (error) {
    console.log('📦 Installing Sharp CLI...');
    execSync('npm install sharp-cli --save-dev', { stdio: 'inherit' });
  }

  // Check if source directory exists
  if (!fs.existsSync(SOURCE_DIR)) {
    console.log(`⚠️  Source directory not found: ${SOURCE_DIR}`);
    console.log('Creating directory...');
    fs.mkdirSync(SOURCE_DIR, { recursive: true });
    return;
  }

  // Get all image files
  const imageFiles = fs.readdirSync(SOURCE_DIR)
    .filter(file => /\.(jpe?g|png|gif|svg|webp|avif)$/i.test(file));

  if (imageFiles.length === 0) {
    console.log('ℹ️  No images found in source directory');
    return;
  }

  console.log(`Found ${imageFiles.length} image(s) to process\n`);

  // Process each image
  imageFiles.forEach(imageFile => {
    const imagePath = path.join(SOURCE_DIR, imageFile);
    generateImages(imagePath, imageFile);
    generateBlurPlaceholder(imagePath, imageFile);
    console.log(''); // Empty line for readability
  });

  console.log('✅ Image optimization complete!');
  console.log(`📁 Optimized images saved to: ${OUTPUT_DIR}\n`);

  // Generate manifest
  generateManifest(imageFiles);
}

/**
 * Generate image manifest for documentation
 */
function generateManifest(imageFiles) {
  const manifest = {
    generated: new Date().toISOString(),
    sizes: SIZES,
    formats: ['avif', 'webp', 'jpg'],
    images: imageFiles.map(file => {
      const baseName = path.parse(file).name;
      return {
        original: `/images/original/${file}`,
        variants: SIZES.map(size => ({
          size: `${size}w`,
          avif: `/images/optimized/${baseName}-${size}.avif`,
          webp: `/images/optimized/${baseName}-${size}.webp`,
          jpg: `/images/optimized/${baseName}-${size}.jpg`
        })),
        blur: `/images/optimized/${baseName}-blur.jpg`
      };
    })
  };

  const manifestPath = path.join(OUTPUT_DIR, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('📋 Generated image manifest: manifest.json');
}

// Run the script
main();
