const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sourceIcon = path.join(__dirname, '..', 'src', 'assets', 'images', 'belt.png');
const publicDir = path.join(__dirname, '..', 'public');

// Vérifier que le dossier public existe
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const iconSizes = [
  { size: 192, name: 'icon-192x192.png' },
  { size: 512, name: 'icon-512x512.png' }
];

async function generateIcons() {
  try {
    // Vérifier que l'icône source existe
    if (!fs.existsSync(sourceIcon)) {
      throw new Error(`Icône source introuvable: ${sourceIcon}`);
    }

    console.log(`Génération des icônes PWA à partir de: ${sourceIcon}`);
    console.log(`Destination: ${publicDir}\n`);

    // Générer chaque taille d'icône
    for (const { size, name } of iconSizes) {
      const outputPath = path.join(publicDir, name);
      
      await sharp(sourceIcon)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 } // Fond transparent
        })
        .toFile(outputPath);
      
      console.log(`✓ Icône générée: ${name} (${size}x${size}px)`);
    }

    console.log('\n✓ Toutes les icônes PWA ont été générées avec succès!');
  } catch (error) {
    console.error('Erreur lors de la génération des icônes:', error);
    process.exit(1);
  }
}

generateIcons();
