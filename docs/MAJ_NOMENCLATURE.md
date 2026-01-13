# Guide de mise à jour de nomenclature.json

## Vue d'ensemble

Ce document explique comment mettre à jour le fichier `nomenclature.json` et s'assurer que les utilisateurs obtiennent la nouvelle version.

## Processus de mise à jour (Option Simple - Recommandée)

### Étapes à suivre :

1. **Modifier le fichier** `src/assets/data/nomenclature.json`
2. **Tester localement** avec `ng serve`
3. **Commit et push** les modifications
4. **Déployer** l'application (via GitHub Actions ou manuellement)

### Comportement attendu :

- ✅ **Nouveaux utilisateurs** : Obtiendront automatiquement la nouvelle version
- ✅ **Utilisateurs existants** : Obtiendront la nouvelle version au prochain rechargement de page (grâce à la stratégie "Network First" du Service Worker)
- ⚠️ **Cas rare** : Si un utilisateur est hors ligne, il peut voir l'ancienne version une fois (depuis le cache du Service Worker)

## Détails techniques

### Comment ça fonctionne actuellement :

1. **Chargement initial** : Le `GradeService` charge `nomenclature.json` via `HttpClient`
2. **Cache en mémoire** : Les données sont mises en cache dans le service Angular (réinitialisé à chaque rechargement)
3. **Service Worker** : Utilise une stratégie "Network First" :
   - Essaie d'abord de récupérer depuis le réseau (nouvelle version)
   - Si le réseau échoue, utilise le cache (ancienne version en fallback)

### Fichiers concernés :

- `src/assets/data/nomenclature.json` - Fichier de données à modifier
- `src/app/services/grade.service.ts` - Service qui charge le fichier
- `public/sw.js` - Service Worker qui gère le cache

## Option avancée : Cache-busting avec version

Si vous avez besoin de forcer l'invalidation du cache pour tous les utilisateurs immédiatement, vous pouvez :

### 1. Ajouter un paramètre de version dans l'URL

Modifier `grade.service.ts` :

```typescript
private readonly NOMENCLATURE_VERSION = '1.0.0'; // Incrémenter à chaque mise à jour majeure
private readonly NOMENCLATURE_URL = `assets/data/nomenclature.json?v=${this.NOMENCLATURE_VERSION}`;
```

### 2. Mettre à jour le Service Worker

Modifier `public/sw.js` pour incrémenter `CACHE_NAME` :

```javascript
const CACHE_NAME = 'keiko-hub-v2'; // Incrémenter à chaque mise à jour majeure
```

## Vérification après déploiement

Pour vérifier que la nouvelle version est bien chargée :

1. Ouvrir les DevTools (F12)
2. Aller dans l'onglet "Network"
3. Recharger la page (Ctrl+R ou F5)
4. Chercher `nomenclature.json` dans la liste
5. Vérifier que le contenu correspond à la nouvelle version

## Recommandations

- ✅ **Pour des mises à jour mineures** : Utiliser l'option simple (juste modifier et déployer)
- ✅ **Pour des mises à jour majeures** : Considérer l'option avancée avec cache-busting
- ✅ **Toujours tester localement** avant de déployer
- ✅ **Vérifier après déploiement** que la nouvelle version est bien chargée

## Notes importantes

- Le cache du navigateur peut mettre en cache le fichier JSON
- Le Service Worker peut mettre en cache le fichier JSON
- La stratégie "Network First" garantit que la nouvelle version est récupérée si le réseau est disponible
- Les utilisateurs hors ligne verront la version en cache (comportement attendu pour une PWA)
