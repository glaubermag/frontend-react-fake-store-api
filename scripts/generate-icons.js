import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputSvg = 'public/icons/icon.svg';
const outputDir = 'public/icons';

// Garantir que o diretório existe
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateIcons() {
  try {
    console.log('Gerando ícones PWA...');
    
    for (const size of sizes) {
      const outputFile = path.join(outputDir, `icon-${size}x${size}.png`);
      
      await sharp(inputSvg)
        .resize(size, size)
        .png()
        .toFile(outputFile);
      
      console.log(`✓ Gerado: icon-${size}x${size}.png`);
    }
    
    // Gerar apple-touch-icon
    await sharp(inputSvg)
      .resize(192, 192)
      .png()
      .toFile(path.join('public', 'apple-touch-icon.png'));
    
    console.log('✓ Gerado: apple-touch-icon.png');
    
    // Gerar mask-icon.svg
    const maskIconContent = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="16" height="16" rx="4" fill="#3b82f6"/>
  <path d="M4 6h8v6H4V6z" fill="white"/>
  <path d="M5 7h6v1H5V7z" fill="#3b82f6"/>
  <path d="M5 8.5h6v1H5v-1z" fill="#3b82f6"/>
  <path d="M5 10h4v1H5v-1z" fill="#3b82f6"/>
  <circle cx="12" cy="10.5" r="0.75" fill="#ef4444"/>
</svg>`;
    
    fs.writeFileSync(path.join(outputDir, 'mask-icon.svg'), maskIconContent);
    console.log('✓ Gerado: mask-icon.svg');
    
    console.log('🎉 Todos os ícones PWA foram gerados com sucesso!');
    
  } catch (error) {
    console.error('Erro ao gerar ícones:', error);
    process.exit(1);
  }
}

generateIcons(); 