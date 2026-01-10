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

## Contribution

Ce projet suit un workflow BMAD (Business Model Agile Development) avec des stories définies dans `docs/stories/`.

## Licence

[À définir]
