const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sourceIcon = path.join(__dirname, '..', 'src', 'assets', 'images', 'icon_white.png');
const publicDir = path.join(__dirname, '..', 'public');

// Vérifier que le dossier public existe
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Tailles recommandées pour PWA
// Les icônes "any" peuvent utiliser toute la zone
// Les icônes "maskable" doivent respecter une zone de sécurité de 66% (padding de ~17% de chaque côté)
const iconSizes = [
  { size: 48, name: 'icon-48x48.png' },      // mdpi (Android)
  { size: 72, name: 'icon-72x72.png' },      // hdpi (Android)
  { size: 96, name: 'icon-96x96.png' },      // xhdpi (Android)
  { size: 144, name: 'icon-144x144.png' },   // xxhdpi (Android)
  { size: 152, name: 'icon-152x152.png' },   // iPad
  { size: 180, name: 'icon-180x180.png' },   // iPhone (iOS)
  { size: 192, name: 'icon-192x192.png' },   // Standard PWA
  { size: 512, name: 'icon-512x512.png' }    // Splash screen / Store
];

// Pour les icônes maskable : zone de sécurité de 66% du centre
// Cela signifie un padding de ~17% de chaque côté (100% - 80% = 20%, divisé par 2 = 10%, mais recommandé 17%)
const SAFE_AREA_RATIO = 0.66; // 66% du centre
const PADDING_RATIO = (1 - SAFE_AREA_RATIO) / 2; // ~17% de chaque côté

async function generateIcons() {
  try {
    // Vérifier que l'icône source existe
    if (!fs.existsSync(sourceIcon)) {
      throw new Error(`Icône source introuvable: ${sourceIcon}`);
    }

    console.log(`Génération des icônes PWA à partir de: ${sourceIcon}`);
    console.log(`Destination: ${publicDir}\n`);

    // Générer chaque taille d'icône (version "any" - utilise toute la zone)
    for (const { size, name } of iconSizes) {
      const outputPath = path.join(publicDir, name);
      
      await sharp(sourceIcon)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 } // Fond blanc
        })
        .toFile(outputPath);
      
      console.log(`✓ Icône générée: ${name} (${size}x${size}px)`);
    }

    // Générer les versions maskable pour les tailles principales (avec zone de sécurité)
    const maskableSizes = [
      { size: 192, name: 'icon-192x192-maskable.png' },
      { size: 512, name: 'icon-512x512-maskable.png' }
    ];

    for (const { size, name } of maskableSizes) {
      const outputPath = path.join(publicDir, name);
      const safeSize = Math.round(size * SAFE_AREA_RATIO); // Taille de la zone de sécurité
      const padding = Math.round(size * PADDING_RATIO); // Padding de chaque côté
      
      // Créer une image avec fond blanc
      const iconBuffer = await sharp(sourceIcon)
        .resize(safeSize, safeSize, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .toBuffer();
      
      // Créer une image de la taille finale avec le padding et fond blanc
      await sharp({
        create: {
          width: size,
          height: size,
          channels: 4,
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        }
      })
        .composite([{
          input: iconBuffer,
          top: padding,
          left: padding
        }])
        .toFile(outputPath);
      
      console.log(`✓ Icône maskable générée: ${name} (${size}x${size}px, zone de sécurité: ${safeSize}x${safeSize}px)`);
    }

    console.log('\n✓ Toutes les icônes PWA ont été générées avec succès!');
  } catch (error) {
    console.error('Erreur lors de la génération des icônes:', error);
    process.exit(1);
  }
}

generateIcons();
