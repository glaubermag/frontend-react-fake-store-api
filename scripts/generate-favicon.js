import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateFavicon() {
  try {
    const svgPath = path.join(__dirname, '../public/favicon.svg');
    const pngPath = path.join(__dirname, '../public/favicon.png');
    const icoPath = path.join(__dirname, '../public/favicon.ico');

    // Ler o SVG
    const svgBuffer = fs.readFileSync(svgPath);

    // Gerar PNG (32x32)
    await sharp(svgBuffer).resize(32, 32).png().toFile(pngPath);
    // Gerar ICO (32x32)
    await sharp(svgBuffer).resize(32, 32).toFile(icoPath);

    console.log('✅ Favicon PNG e ICO (32x32) gerados com sucesso!');
    console.log('📁 Arquivos criados: public/favicon.png, public/favicon.ico');
  } catch (error) {
    console.error('❌ Erro ao gerar favicon:', error);
  }
}

generateFavicon(); 