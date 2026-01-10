# Tech Stack

# Technology Stack Table

| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|------------|
| Frontend Language | TypeScript | 5.x (compatible Angular) | Typage statique pour le code Angular | Sécurité de type, meilleure DX, compatibilité Angular |
| Frontend Framework | Angular | LTS (18+) | Framework principal pour SPA | Framework mature, routing intégré, services, animations, communauté active |
| UI Component Library | Custom Components | N/A | Composants personnalisés | Pas de framework CSS externe pour contrôle total du design et performance |
| State Management | RxJS | Inclus avec Angular | Gestion d'état réactive | BehaviorSubject pour état réactif, pas besoin de NgRx pour cette taille d'application |
| Backend Language | N/A | N/A | Pas de backend | Application 100% côté client |
| Backend Framework | N/A | N/A | Pas de backend | Application 100% côté client |
| API Style | N/A | N/A | Pas d'API backend | Application 100% côté client |
| Database | N/A | N/A | Pas de base de données | localStorage pour persistance locale |
| Cache | Browser Cache | N/A | Cache navigateur pour assets | Cache HTTP standard, pas de cache serveur nécessaire |
| File Storage | GitHub Pages Assets | N/A | Stockage fichiers statiques | Fichiers JSON et audio dans assets/, servis par GitHub Pages |
| Authentication | N/A | N/A | Pas d'authentification | Application publique, pas de comptes utilisateur |
| Frontend Testing | Jasmine + Karma | Inclus Angular | Tests unitaires | Framework de test standard Angular, intégré |
| Backend Testing | N/A | N/A | Pas de backend | Application 100% côté client |
| E2E Testing | Protractor/Cypress | Optionnel | Tests end-to-end | Optionnel pour MVP, peut être ajouté post-MVP |
| Build Tool | Angular CLI | LTS | Build et développement | Outil officiel Angular, optimisé pour Angular |
| Bundler | Webpack (via Angular CLI) | Inclus | Bundling du code | Configuré automatiquement par Angular CLI |
| IaC Tool | N/A | N/A | Pas d'infrastructure | Déploiement statique simple, pas d'IaC nécessaire |
| CI/CD | GitHub Actions | Optionnel | Build et déploiement automatique | Optionnel pour MVP, déploiement manuel acceptable |
| Monitoring | N/A | N/A | Pas de monitoring serveur | Application statique, monitoring optionnel côté client (Google Analytics si souhaité) |
| Logging | Console.log (dev) | N/A | Logging développement | Pas de logging serveur, console pour debug développement |
| CSS Framework | Custom CSS/SCSS | N/A | Styles personnalisés | CSS/SCSS standard avec CSS Variables pour thèmes, pas de framework externe |

---
