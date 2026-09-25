const sharp = require('sharp');
const path = require('path');

const src = path.join(__dirname, '..', 'assets', 'logo-source.jpg');
const publicDir = path.join(__dirname, '..', 'public');

// precise circle bounding box measured from the source photo
const crop = { left: 605, top: 153, width: 789, height: 788 };

const circleMaskSvg = (size) =>
  Buffer.from(`<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/></svg>`);

async function main() {
  const sizes = [
    { file: 'icon-192.png', size: 192 },
    { file: 'icon-512.png', size: 512 },
    { file: 'icon-maskable-512.png', size: 512, maskable: true },
    { file: 'apple-touch-icon.png', size: 180 },
  ];

  for (const s of sizes) {
    if (s.maskable) {
      // maskable icons need safe-zone padding (circle already fills frame, add ~10% margin)
      await sharp(src)
        .extract(crop)
        .resize(Math.round(s.size * 0.8), Math.round(s.size * 0.8))
        .extend({
          top: Math.round(s.size * 0.1),
          bottom: Math.round(s.size * 0.1),
          left: Math.round(s.size * 0.1),
          right: Math.round(s.size * 0.1),
          background: { r: 22, g: 43, b: 47, alpha: 1 },
        })
        .png()
        .toFile(path.join(publicDir, s.file));
    } else {
      await sharp(src)
        .extract(crop)
        .resize(s.size, s.size)
        .png()
        .toFile(path.join(publicDir, s.file));
    }
  }

  // transparent-background circular favicon for browser tabs
  const favSize = 256;
  const favBuf = await sharp(src).extract(crop).resize(favSize, favSize).png().toBuffer();
  await sharp(favBuf)
    .composite([{ input: circleMaskSvg(favSize), blend: 'dest-in' }])
    .png()
    .toFile(path.join(publicDir, 'icon.png'));

  // favicon source (32px)
  await sharp(src).extract(crop).resize(48, 48).png().toFile(path.join(publicDir, 'favicon-48.png'));

  // og image: circle logo on brand-teal canvas, 1200x630
  const ogW = 1200, ogH = 630;
  const logoSize = 420;
  const logoBuf = await sharp(src).extract(crop).resize(logoSize, logoSize).png().toBuffer();
  await sharp({
    create: {
      width: ogW,
      height: ogH,
      channels: 4,
      background: { r: 15, g: 31, b: 34, alpha: 1 },
    },
  })
    .composite([{ input: logoBuf, left: Math.round((ogW - logoSize) / 2), top: 60 }])
    .png()
    .toFile(path.join(publicDir, 'og-image.png'));

  console.log('icons written to', publicDir);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
