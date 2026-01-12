const sharp = require('sharp');
const toIco = require('to-ico');
const fs = require('fs');
const path = require('path');

const sourceIcon = path.join(__dirname, '..', 'src', 'assets', 'images', 'icon_white.png');
const publicDir = path.join(__dirname, '..', 'public');
const faviconPath = path.join(publicDir, 'favicon.ico');

async function generateFavicon() {
  try {
    // Vérifier que l'icône source existe
    if (!fs.existsSync(sourceIcon)) {
      throw new Error(`Icône source introuvable: ${sourceIcon}`);
    }

    // Vérifier que le dossier public existe
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    console.log(`Génération du favicon à partir de: ${sourceIcon}`);
    console.log(`Destination: ${faviconPath}\n`);

    // Générer les tailles nécessaires pour le favicon (16x16 et 32x32 sont les plus courantes)
    const sizes = [16, 32];
    const buffers = [];

    for (const size of sizes) {
      const buffer = await sharp(sourceIcon)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 } // Fond transparent
        })
        .png()
        .toBuffer();
      
      buffers.push(buffer);
      console.log(`✓ Image ${size}x${size}px générée`);
    }

    // Convertir en favicon.ico
    const ico = await toIco(buffers);
    fs.writeFileSync(faviconPath, ico);

    console.log('\n✓ Favicon généré avec succès!');
  } catch (error) {
    console.error('Erreur lors de la génération du favicon:', error);
    process.exit(1);
  }
}

generateFavicon();
