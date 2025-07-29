const fs = require('fs');
const path = require('path');

// Simple placeholder generation (in production, use a proper image library)
const generatePlaceholderIcon = (size) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" fill="#059669" rx="${size * 0.125}"/>
  <text x="${size/2}" y="${size * 0.625}" font-family="Arial, sans-serif" font-size="${size * 0.4}" text-anchor="middle" fill="white">📖</text>
</svg>`;
  return svg;
};

// Generate icons
const sizes = [192, 512];

sizes.forEach(size => {
  const svg = generatePlaceholderIcon(size);
  const filename = path.join(__dirname, '..', 'public', `icon-${size}x${size}.svg`);
  fs.writeFileSync(filename, svg);
  console.log(`Generated ${filename}`);
});

console.log('\nNote: For production, convert these SVG files to PNG format using an image editor or online converter.');
console.log('You can also use tools like sharp or jimp to generate PNG icons programmatically.');
