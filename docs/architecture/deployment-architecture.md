# Deployment Architecture

# Deployment Strategy

**Frontend Deployment:**
- **Platform:** GitHub Pages
- **Build Command:** `ng build --configuration production --output-path docs`
- **Output Directory:** `docs/` (configuré dans angular.json)
- **CDN/Edge:** GitHub Pages CDN global automatique

**Backend Deployment:**
- **N/A - Pas de backend**

**Configuration GitHub Pages:**
1. Build Angular avec output dans `docs/`
2. Commit et push vers repository GitHub
3. Activer GitHub Pages dans les settings du repository
4. Sélectionner la branche et le dossier `docs/`
5. L'application sera accessible sur `https://<username>.github.io/<repository-name>/`

**Note:** Alternative: Utiliser GitHub Actions pour build et déploiement automatique.

## CI/CD Pipeline

**Optionnel pour MVP - Déploiement manuel acceptable**

Si CI/CD souhaité, exemple GitHub Actions:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs
```

## Environments

| Environment | Frontend URL | Backend URL | Purpose |
|-------------|--------------|-------------|----------|
| Development | http://localhost:4200 | N/A | Développement local |
| Production | https://<username>.github.io/keiko-hub/ | N/A | Environnement de production |

---
