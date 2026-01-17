# Sécurité - Google Analytics dans un repo public

## ⚠️ Analyse des risques

### Informations actuellement exposées dans votre code

1. **ID Measurement Google Analytics** : `G-H0MY2T492N`
2. **URL Google Apps Script** : `https://script.google.com/macros/s/AKfycbyURxdAhitjOSShrRlpCwjaK1iSPVZJTiq7w1ePtS9j5dXjBDUZ0meF5kHvQF5i93RHTg/exec`

### 🔴 Ce qu'un attaquant peut faire avec ces informations

#### 1. Avec l'ID Measurement (`G-H0MY2T492N`)

| Action | Risque | Impact |
|--------|--------|--------|
| **Tracker des événements fake** | 🔴 Élevé | Envoyer de fausses données à votre Google Analytics, polluer vos statistiques |
| **Spammer vos analytics** | 🟡 Moyen | Surcharger vos rapports avec des événements bidon |
| **Fausser vos métriques** | 🟡 Moyen | Rendre vos statistiques inutilisables |

**Ce qu'il NE PEUT PAS faire :**
- ❌ Accéder à vos données Analytics existantes
- ❌ Modifier ou supprimer vos données
- ❌ Voir vos vraies statistiques
- ❌ Accéder à votre compte Google

#### 2. Avec l'URL Google Apps Script

| Action | Risque | Impact |
|--------|--------|--------|
| **Appeler votre API** | 🟡 Moyen | Consommer vos quotas d'API Google Analytics |
| **Surcharger votre script** | 🟡 Moyen | Faire planter votre endpoint si mal configuré |
| **Voir vos métriques** | 🟢 Faible | Voir uniquement les métriques publiques (visiteurs) |

**Ce qu'il NE PEUT PAS faire (si bien configuré) :**
- ❌ Modifier votre script
- ❌ Accéder à vos credentials
- ❌ Voir d'autres données Analytics (si restrictions en place)
- ❌ Accéder à votre compte Google

### 🟢 Ce qui est ACCEPTABLE dans un repo public

| Information | Public ? | Pourquoi |
|-------------|----------|----------|
| **ID Measurement GA** (`G-XXXXX`) | ✅ OUI | C'est un ID public, visible dans le code source de n'importe quel site web. On ne peut que tracker des événements, pas accéder aux données. |
| **URL Script public** (en lecture seule) | ✅ OUI | Si le script est configuré en lecture seule avec limites, c'est acceptable. |

### 🔴 Ce qui NE DOIT JAMAIS être dans un repo public

| Information | Risque | Pourquoi |
|-------------|--------|----------|
| **Clé privée Service Account** | 🔴 CRITIQUE | Accès total à votre compte Google |
| **Client Secret OAuth** | 🔴 CRITIQUE | Accès à votre compte Google |
| **API Keys avec permissions** | 🔴 CRITIQUE | Accès non autorisé |
| **Credentials de base de données** | 🔴 CRITIQUE | Accès aux données |
| **Tokens d'accès** | 🔴 CRITIQUE | Accès temporaire aux comptes |

---

## 🛡️ Solutions de sécurisation

### Solution 1 : Sécuriser le Google Apps Script (Recommandé)

#### A. Ajouter une clé API (Rate limiting)

Dans votre script Google Apps Script :

```javascript
// Dans google-apps-script-code.js
const API_KEY = PropertiesService.getScriptProperties().getProperty('API_KEY');

function doGet(e) {
  // Vérifier la clé API
  const providedKey = e.parameter.key;
  if (!API_KEY || providedKey !== API_KEY) {
    return createErrorResponse(403, 'Unauthorized', 'Clé API invalide');
  }
  
  // ... reste du code
}
```

**Configuration :**
1. Aller dans Apps Script > **Projet** > **Paramètres du projet**
2. **Script Properties** > Ajouter :
   - `API_KEY` : Une clé secrète générée (ex: `gsk_1234567890abcdef`)

3. Dans Angular, stocker la clé dans un fichier non versionné :

```typescript
// src/app/config/analytics.config.ts (à ajouter au .gitignore)
export const ANALYTICS_CONFIG = {
  apiKey: 'gsk_1234567890abcdef' // ⚠️ NE PAS COMMITTER
};
```

**Limite :** Les utilisateurs de votre site ont besoin de la clé, donc elle sera visible dans le code JavaScript compilé. Mais cela limite les attaques depuis des sources externes.

#### B. Restreindre par domaine (Origin)

```javascript
function doGet(e) {
  // Vérifier l'origine de la requête
  const allowedOrigins = [
    'https://www.keikohub.fr',
    'https://macaron-corporation.github.io'
  ];
  
  const origin = e.parameter.origin || '';
  if (!allowedOrigins.some(allowed => origin.includes(allowed))) {
    return createErrorResponse(403, 'Forbidden', 'Origine non autorisée');
  }
  
  // ... reste du code
}
```

**Limite :** Les headers CORS peuvent être falsifiés, mais cela ajoute une barrière.

#### C. Limiter le taux de requêtes

```javascript
// Stocker les dernières requêtes par IP
const RATE_LIMIT = 10; // Requêtes par minute
const RATE_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(e) {
  const cache = CacheService.getScriptCache();
  const ip = e.parameter.ip || 'unknown';
  const key = 'rate_limit_' + ip;
  const count = parseInt(cache.get(key) || '0');
  
  if (count >= RATE_LIMIT) {
    return false;
  }
  
  cache.put(key, String(count + 1), RATE_WINDOW / 1000);
  return true;
}
```

#### D. Limiter les permissions du Service Account

Dans Google Analytics :
1. **Admin** > **Access Management**
2. Vérifier que le Service Account a **uniquement** le rôle **Viewer** (lecture seule)
3. Ne pas donner de permissions d'écriture

### Solution 2 : Utiliser des variables d'environnement (Pour le build)

#### Créer un fichier de configuration

```typescript
// src/app/config/analytics.config.ts
export const ANALYTICS_CONFIG = {
  measurementId: process.env['NG_APP_GA_MEASUREMENT_ID'] || 'G-H0MY2T492N',
  metricsApiUrl: process.env['NG_APP_METRICS_API_URL'] || '',
  metricsApiKey: process.env['NG_APP_METRICS_API_KEY'] || ''
};
```

**Limite :** Les variables d'environnement Angular sont compilées dans le code JavaScript, donc elles seront visibles côté client. Elles servent surtout à différencier dev/prod.

### Solution 3 : Utiliser un .gitignore pour les secrets

Créer/éditer `.gitignore` :

```gitignore
# Secrets et configurations sensibles
src/app/config/analytics.config.local.ts
.env.local
.env.production.local
*.secret.js
*.secret.ts

# Clés API
**/api-keys.json
**/secrets.json
```

Créer un fichier d'exemple :

```typescript
// src/app/config/analytics.config.local.example.ts
export const ANALYTICS_CONFIG = {
  measurementId: 'G-XXXXXXXXXX',
  metricsApiUrl: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
  metricsApiKey: 'YOUR_API_KEY'
};
```

**Usage :**
1. Copier l'exemple vers `analytics.config.local.ts`
2. Remplir avec vos vraies valeurs
3. Le fichier `.local.ts` ne sera pas commité

### Solution 4 : Utiliser GitHub Secrets (Pour CI/CD)

Si vous avez un workflow GitHub Actions :

```yaml
# .github/workflows/deploy.yml
env:
  GA_MEASUREMENT_ID: ${{ secrets.GA_MEASUREMENT_ID }}
  METRICS_API_URL: ${{ secrets.METRICS_API_URL }}
  METRICS_API_KEY: ${{ secrets.METRICS_API_KEY }}
```

**Configuration :**
1. GitHub > **Settings** > **Secrets and variables** > **Actions**
2. Ajouter les secrets :
   - `GA_MEASUREMENT_ID`
   - `METRICS_API_URL`
   - `METRICS_API_KEY`

**Limite :** Utile pour le build, mais les valeurs finiront dans le code compilé côté client.

---

## ✅ Recommandations finales

### Pour votre situation actuelle

| Information | Action | Priorité |
|-------------|--------|----------|
| **ID Measurement** (`G-H0MY2T492N`) | ✅ **Peut rester public** | Basse |
| **URL Script** | 🟡 **Ajouter une clé API** | Moyenne |
| **Credentials Service Account** | 🔴 **Ne JAMAIS commit** | Critique |

### Checklist de sécurité

- [ ] ✅ ID Measurement peut rester dans le repo (c'est public de toute façon)
- [ ] 🟡 Ajouter une clé API dans le Google Apps Script
- [ ] 🟡 Configurer le rate limiting dans le script
- [ ] 🟡 Vérifier que le Service Account a uniquement le rôle Viewer
- [ ] 🔴 Vérifier qu'aucun secret n'est dans le repo
- [ ] 🔴 Ajouter les fichiers sensibles au `.gitignore`
- [ ] 🔴 Si vous avez déjà commité des secrets, les révoquer immédiatement

### Si vous avez déjà commité des secrets

1. **Révoquer immédiatement** les credentials exposés :
   - Supprimer le Service Account et en recréer un
   - Régénérer les clés OAuth
   - Changer toutes les clés API

2. **Nettoyer l'historique Git** :
   ```bash
   # ATTENTION: Cela réécrit l'historique
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch src/app/services/analytics.service.ts" \
     --prune-empty --tag-name-filter cat -- --all
   ```

3. **Ou** utiliser `git-secret` ou `BFG Repo-Cleaner` pour supprimer les secrets de l'historique.

---

## 📊 Évaluation des risques actuels

### Risque global : 🟡 **MOYEN**

| Aspect | Évaluation | Détails |
|--------|------------|---------|
| **ID Measurement** | 🟢 Faible | Public de toute façon, ne permet que l'envoi d'événements |
| **URL Script** | 🟡 Moyen | Permet d'appeler l'API, mais pas d'accéder aux données sensibles |
| **Données exposées** | 🟢 Faible | Seulement les métriques de visiteurs (données publiques) |
| **Impact potentiel** | 🟡 Moyen | Pollution des analytics, consommation de quotas |

### Actions prioritaires

1. **Court terme** (aujourd'hui) :
   - Ajouter une clé API au script
   - Vérifier les permissions du Service Account

2. **Moyen terme** (cette semaine) :
   - Implémenter le rate limiting
   - Ajouter la vérification d'origine

3. **Long terme** (si nécessaire) :
   - Mettre en place un monitoring des appels API
   - Configurer des alertes en cas de surcharge

---

## 🔍 Vérification continue

### Outils pour détecter les secrets

1. **GitHub Secret Scanning** (automatique)
   - GitHub scanne automatiquement les commits pour détecter les secrets
   - Vous recevrez une alerte si un secret est détecté

2. **git-secrets** (local)
   ```bash
   git secrets --install
   git secrets --register-aws
   ```

3. **TruffleHog** (scan du repo)
   ```bash
   trufflehog git file://. --json
   ```

4. **gitleaks** (scan du repo)
   ```bash
   gitleaks detect --source . --verbose
   ```

---

## 📝 Conclusion

### ✅ Ce qui est OK

- Publier l'ID Measurement GA4 dans le repo public
- Publier l'URL du script si bien sécurisée (avec clé API et rate limiting)

### ⚠️ Ce qu'il faut faire

- Ajouter une clé API au script
- Configurer le rate limiting
- Vérifier les permissions

### 🔴 Ce qu'il ne faut JAMAIS faire

- Commiter des clés privées
- Commiter des credentials Service Account
- Commiter des secrets OAuth
- Exposer des endpoints sans protection

**Rappel :** Même avec toutes les protections, l'ID Measurement GA4 sera toujours visible dans le code source compilé du site web. C'est normal et attendu.
