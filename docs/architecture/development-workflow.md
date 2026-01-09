# Development Workflow

# Local Development Setup

### Prerequisites

```bash
# Node.js (LTS version recommandée)
node --version  # v18.x ou supérieur

# npm (inclus avec Node.js)
npm --version

# Angular CLI (installé globalement ou via npx)
ng version  # ou npx @angular/cli version
```

### Initial Setup

```bash
# Cloner le repository
git clone <repository-url>
cd keiko-hub

# Installer les dépendances
npm install

# Démarrer le serveur de développement
ng serve
# ou
npm start

# L'application sera accessible sur http://localhost:4200
```

### Development Commands

```bash
# Démarrer le serveur de développement
ng serve
# ou
npm start

# Build pour production
ng build --configuration production
# ou
npm run build

# Lancer les tests unitaires
ng test
# ou
npm test

# Lancer les tests E2E (si configurés)
ng e2e
# ou
npm run e2e

# Linter
ng lint
# ou
npm run lint
```

## Environment Configuration

### Required Environment Variables

**N/A - Pas de variables d'environnement nécessaires**

L'application fonctionne entièrement côté client. Les seules configurations sont:
- Fichiers JSON dans `assets/data/`
- Fichiers audio dans `assets/audio/`
- Configuration Angular dans `angular.json`

**Note:** Si utilisation de l'API Elevenlabs, la clé API est stockée dans localStorage via l'interface utilisateur (pas de variable d'environnement).

---
