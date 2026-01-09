# Unified Project Structure

```
keiko-hub/
├── .github/                    # GitHub Actions (optionnel)
│   └── workflows/
│       └── deploy.yml
├── src/                        # Code source Angular
│   ├── app/
│   │   ├── components/         # Composants réutilisables
│   │   │   ├── navigation/
│   │   │   ├── timer/
│   │   │   ├── progress/
│   │   │   └── technique/
│   │   ├── pages/              # Pages/Composants de route
│   │   │   ├── home/
│   │   │   ├── config/
│   │   │   ├── passage/
│   │   │   ├── settings/
│   │   │   └── history/
│   │   ├── services/           # Services Angular
│   │   │   ├── grade.service.ts
│   │   │   ├── passage.service.ts
│   │   │   ├── audio.service.ts
│   │   │   ├── settings.service.ts
│   │   │   └── export.service.ts
│   │   ├── models/             # Interfaces TypeScript
│   │   │   ├── passage.model.ts
│   │   │   ├── technique.model.ts
│   │   │   └── settings.model.ts
│   │   ├── guards/             # Route guards (si nécessaire)
│   │   ├── interceptors/       # HTTP interceptors (si nécessaire)
│   │   ├── utils/              # Utilitaires
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.component.scss
│   │   └── app.module.ts       # ou app.config.ts (standalone)
│   ├── assets/                 # Assets statiques
│   │   ├── data/
│   │   │   ├── nomenclature.json
│   │   │   └── videos.json
│   │   ├── audio/
│   │   │   ├── masculin/
│   │   │   │   ├── shomen-uchi-ikkyo.mp3
│   │   │   │   └── ...
│   │   │   └── feminin/
│   │   │       └── ...
│   │   └── images/
│   │       └── logo.svg
│   ├── styles/                 # Styles globaux
│   │   ├── _variables.scss     # CSS Variables pour thèmes
│   │   ├── _themes.scss        # Définitions thèmes
│   │   └── styles.scss         # Styles globaux
│   └── environments/            # Configuration par environnement
│       ├── environment.ts
│       └── environment.prod.ts
├── docs/                       # Documentation
│   ├── prd.md
│   ├── front-end-spec.md
│   └── architecture.md
├── e2e/                        # Tests E2E (optionnel)
├── angular.json                 # Configuration Angular
├── package.json                 # Dépendances
├── tsconfig.json                # Configuration TypeScript
├── tsconfig.app.json
├── tsconfig.spec.json
├── .gitignore
└── README.md
```

---
