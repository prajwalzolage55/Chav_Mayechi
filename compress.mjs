import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const dir = './images';

async function compress() {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    if (file.endsWith('.png') || file.endsWith('.jpg')) {
      const inputPath = path.join(dir, file);
      // We'll replace the extension with .webp
      const newFileName = file.replace(/\.(png|jpg)$/, '.webp');
      const outputPath = path.join(dir, newFileName);
      
      console.log(`Compressing ${file} -> ${newFileName}...`);
      await sharp(inputPath)
        .webp({ quality: 80 })
        .toFile(outputPath);
      
      console.log(`Created ${outputPath}`);
    }
  }
}

compress().catch(console.error);
