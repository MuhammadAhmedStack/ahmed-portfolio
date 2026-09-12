const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const ffmpegPath = require('ffmpeg-static');

const videoPath = path.resolve(__dirname, '../public/media/hero-spin.mp4');
const outputDir = path.resolve(__dirname, '../public/media/hero-sequence');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Target around 110-120 frames:
// Duration is ~6.13s. At 18 fps: ~110 frames.
// At 20 fps: ~122 frames.
// Let's use fps=18 for ~110 frames or fps=20 for ~120 frames.
const fps = 18;
const width = 720;
const height = 1280;
const quality = 78;

console.log(`Extracting frames at ${fps} fps, ${width}x${height}, quality=${quality}...`);

const cmd = `"${ffmpegPath}" -y -i "${videoPath}" -vf "fps=${fps},scale=${width}:${height}" -c:v libwebp -lossless 0 -q:v ${quality} "${path.join(outputDir, 'frame-%03d.webp')}"`;

try {
  execSync(cmd, { stdio: 'inherit' });
  console.log('Extraction complete.');

  const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.webp'));
  console.log(`Total frames generated: ${files.length}`);

  let totalSize = 0;
  for (const f of files) {
    totalSize += fs.statSync(path.join(outputDir, f)).size;
  }
  console.log(`Total sequence size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Average frame size: ${(totalSize / files.length / 1024).toFixed(1)} KB`);
  if (files.length > 0) {
    console.log(`First frame: ${files[0]}`);
    console.log(`Last frame: ${files[files.length - 1]}`);
  }
} catch (err) {
  console.error('Error during extraction:', err);
}
