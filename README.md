# Keiko Hub

Application Web d'Entraînement aux Passages de Grade Aïkido

## Description

Keiko Hub est une application web Angular permettant aux pratiquants d'Aïkido de s'entraîner aux passages de grade en générant des séquences de techniques aléatoires avec annonces audio synchronisées.

## Prérequis

- **Node.js** LTS (v18.x ou supérieur)
- **npm** (inclus avec Node.js)
- **Angular CLI** (installé globalement ou via npx)

### Vérification des prérequis

```bash
node --version  # v18.x ou supérieur
npm --version
ng version      # ou npx @angular/cli version
```

## Installation

1. Cloner le repository (si applicable)
2. Installer les dépendances :

```bash
npm install
```

## Commandes de développement

### Serveur de développement

```bash
ng serve
# ou
npm start
```

L'application sera accessible sur `http://localhost:4200`

### Build pour production

```bash
ng build --configuration production
# ou
npm run build
```

Les fichiers de build seront générés dans le dossier `dist/keiko-hub/`

### Tests unitaires

```bash
ng test
# ou
npm test
```

### Linter

```bash
ng lint
# ou
npm run lint
```

## Structure du projet

```
keiko-hub/
├── src/
│   ├── app/              # Code source Angular
│   │   ├── components/   # Composants réutilisables
│   │   ├── pages/        # Pages/Composants de route
│   │   ├── services/     # Services Angular
│   │   ├── models/       # Interfaces TypeScript
│   │   └── ...
│   ├── assets/           # Assets statiques
│   │   ├── data/         # Fichiers JSON (nomenclature, videos)
│   │   ├── audio/        # Fichiers audio
│   │   └── images/       # Images (logo, etc.)
│   └── styles/           # Styles globaux
├── angular.json           # Configuration Angular
├── package.json           # Dépendances
└── tsconfig.json          # Configuration TypeScript
```

## Technologies utilisées

- **Angular** LTS (18+) - Framework principal
- **TypeScript** 5.x - Langage de programmation
- **RxJS** - Gestion d'état réactive
- **SCSS** - Préprocesseur CSS
- **Jasmine + Karma** - Tests unitaires

## Développement

Ce projet utilise Angular avec des composants standalone et le routing intégré.

### Standards de codage

- TypeScript strict mode activé
- Conventions de nommage : kebab-case pour fichiers, PascalCase pour composants
- Services avec `providedIn: 'root'`
- Gestion des unsubscriptions dans `ngOnDestroy`

## Mode Maintenance

L'application dispose d'un système de mode maintenance simple qui permet de rediriger tous les utilisateurs vers une page de maintenance dédiée.

### Activer le mode maintenance

1. Ouvrir le fichier `src/assets/data/maintenance-config.json`
2. Modifier la valeur de `maintenanceEnabled` à `true` :
   ```json
   {
     "maintenanceEnabled": true
   }
   ```
3. Recharger l'application (ou redéployer en production)

Quand le mode maintenance est activé :
- Toutes les routes sont bloquées (même via URL directe)
- Tous les utilisateurs sont automatiquement redirigés vers `/maintenance`
- Seule la page de maintenance reste accessible

### Désactiver le mode maintenance

1. Ouvrir le fichier `src/assets/data/maintenance-config.json`
2. Modifier la valeur de `maintenanceEnabled` à `false` :
   ```json
   {
     "maintenanceEnabled": false
   }
   ```
3. Recharger l'application (ou redéployer en production)

Le site redevient accessible normalement avec toutes les pages fonctionnelles.

**Note :** En production, vous devrez redéployer l'application après modification du fichier pour que les changements prennent effet.

## Contribution

Ce projet suit un workflow BMAD (Business Model Agile Development) avec des stories définies dans `docs/stories/`.

## Licence

[À définir]
