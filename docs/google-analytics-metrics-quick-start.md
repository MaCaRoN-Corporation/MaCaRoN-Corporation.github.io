# Démarrage Rapide - Métriques Google Analytics

## Résumé de la solution

Pour alimenter dynamiquement les métriques de visiteurs dans la page Settings, nous utilisons **Google Apps Script** comme proxy gratuit pour récupérer les données depuis l'API Google Analytics Data API.

## Étapes principales

### 1️⃣ Préparer Google Analytics

- [ ] Récupérer votre **ID de propriété GA4** (format numérique: `123456789`)
- [ ] Activer l'**API Google Analytics Data API** dans Google Cloud Console

### 2️⃣ Créer le script Google Apps Script

- [ ] Aller sur [Google Apps Script](https://script.google.com/)
- [ ] Créer un nouveau projet
- [ ] Copier le code depuis `docs/google-apps-script-code.js`
- [ ] Remplacer `GA_PROPERTY_ID = '123456789'` par votre ID réel

### 3️⃣ Configurer l'authentification

**Option A : Service Account (Recommandé)**

- [ ] Créer un Service Account dans Google Cloud Console
- [ ] Télécharger la clé JSON
- [ ] Donner accès au Service Account dans Google Analytics (Viewer)
- [ ] Ajouter la clé privée et l'email dans Script Properties de Apps Script

**Option B : OAuth (Plus simple)**

- [ ] Créer des credentials OAuth dans Google Cloud Console
- [ ] Configurer les URLs de redirection
- [ ] Modifier le script pour utiliser OAuth

### 4️⃣ Déployer le script

- [ ] **Déployer** > **Nouveau déploiement** > **Application Web**
- [ ] Configuration :
  - Exécuter en tant que : **Moi**
  - Qui peut y accéder : **Tous**
- [ ] Copier l'**URL du déploiement** (format: `https://script.google.com/macros/s/XXXXX/exec`)

### 5️⃣ Mettre à jour Angular

- [ ] Ouvrir `src/app/services/analytics.service.ts`
- [ ] Remplacer `YOUR_SCRIPT_ID` dans `METRICS_API_URL` par l'ID de votre script
- [ ] L'URL devrait ressembler à : `https://script.google.com/macros/s/XXXXX/exec`

### 6️⃣ Tester

- [ ] Démarrer l'application : `npm start`
- [ ] Aller sur la page Settings
- [ ] Vérifier que les métriques s'affichent (au lieu de "...")
- [ ] Vérifier la console du navigateur pour les erreurs

## Documentation complète

Pour les détails complets de chaque étape, voir :
- 📖 **Guide complet** : `docs/google-analytics-metrics-setup.md`
- 📝 **Code du script** : `docs/google-apps-script-code.js`
- 📊 **Intégration GA** : `docs/google-analytics-integration.md`

## Dépannage rapide

### Les métriques ne s'affichent pas

1. Vérifier que l'URL dans `AnalyticsService` est correcte
2. Tester l'URL directement dans le navigateur (devrait retourner du JSON)
3. Vérifier la console du navigateur (F12)
4. Vérifier les logs Apps Script (Exécutions dans Apps Script)

### Erreur 401/403

- Vérifier que le Service Account a accès à Google Analytics
- Vérifier que l'API est activée
- Vérifier les credentials dans Script Properties

### L'URL n'est pas configurée

Si vous voyez l'avertissement dans la console :
```
[AnalyticsService] URL de l'API non configurée
```

➡️ Remplacer `YOUR_SCRIPT_ID` dans `src/app/services/analytics.service.ts`

## Checklist finale

- [ ] Script Apps Script créé et déployé
- [ ] URL du déploiement copiée
- [ ] `AnalyticsService.ts` mis à jour avec l'URL
- [ ] Métriques affichées dans la page Settings
- [ ] Test en production effectué

## Support

En cas de problème, vérifier :
1. Les logs Apps Script (Exécutions)
2. La console du navigateur
3. La documentation complète
4. Les erreurs dans Google Cloud Console
