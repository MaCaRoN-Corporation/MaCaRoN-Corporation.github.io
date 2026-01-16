# Guide - Alimenter les métriques Google Analytics dans la page Settings

## Vue d'ensemble

Ce guide explique comment récupérer dynamiquement les métriques de visiteurs (aujourd'hui et ce mois-ci) depuis Google Analytics et les afficher dans la page Settings de l'application.

### Problème

Google Analytics Data API nécessite une authentification serveur, ce qui n'est pas possible avec une application statique hébergée sur GitHub Pages.

### Solution

Utiliser **Google Apps Script** comme proxy gratuit pour récupérer les métriques depuis l'API Google Analytics Data API.

---

## Architecture

```
Application Angular (Frontend)
    ↓
    GET /api/analytics/metrics
    ↓
Google Apps Script (Proxy/Backend)
    ↓
Google Analytics Data API
    ↓
Retourne les métriques
```

---

## Étape 1 : Configuration Google Analytics

### 1.1 Récupérer l'ID de propriété

1. Aller sur [Google Analytics](https://analytics.google.com/)
2. Sélectionner votre propriété (ID: `G-H0MY2T492N`)
3. Aller dans **Admin** (icône engrenage) > **Informations sur la propriété**
4. Noter l'**ID de propriété** (format: `123456789`)

### 1.2 Activer l'API Google Analytics Data API

1. Aller sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créer un nouveau projet ou sélectionner un projet existant
3. Aller dans **APIs & Services** > **Library**
4. Rechercher "Google Analytics Data API"
5. Cliquer sur **Enable** (Activer)

---

## Étape 2 : Créer un projet Google Apps Script

### 2.1 Créer le script

1. Aller sur [Google Apps Script](https://script.google.com/)
2. Cliquer sur **Nouveau projet**
3. Renommer le projet (ex: "Keiko Hub Analytics Proxy")

### 2.2 Installer le code

Remplacer tout le contenu par le code suivant :

```javascript
// Configuration
const GA_PROPERTY_ID = '123456789'; // Remplacer par votre ID de propriété GA4
const GA_CREDENTIALS = {
  // Ces informations seront récupérées après la création du service account
};

/**
 * Fonction principale pour récupérer les métriques
 * Accessible via: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
 */
function doGet(e) {
  try {
    // Vérifier les autorisations
    if (!hasAccess()) {
      return ContentService
        .createTextOutput(JSON.stringify({ 
          error: 'Unauthorized',
          message: 'Accès non autorisé'
        }))
        .setMimeType(ContentService.MimeType.JSON)
        .setStatusCode(403);
    }

    // Récupérer les métriques
    const metrics = getAnalyticsMetrics();
    
    return ContentService
      .createTextOutput(JSON.stringify(metrics))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ 
        error: 'Internal Server Error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setStatusCode(500);
  }
}

/**
 * Récupère les métriques depuis Google Analytics
 */
function getAnalyticsMetrics() {
  const today = getVisitorsToday();
  const thisMonth = getVisitorsThisMonth();
  
  return {
    visitorsToday: today,
    visitorsThisMonth: thisMonth,
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Récupère le nombre de visiteurs aujourd'hui
 */
function getVisitorsToday() {
  const startDate = formatDate(new Date());
  const endDate = formatDate(new Date());
  
  return queryAnalytics(startDate, endDate);
}

/**
 * Récupère le nombre de visiteurs ce mois-ci
 */
function getVisitorsThisMonth() {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = now;
  
  return queryAnalytics(formatDate(startDate), formatDate(endDate));
}

/**
 * Requête à l'API Google Analytics Data API
 */
function queryAnalytics(startDate, endDate) {
  try {
    // Option 1: Utiliser le service account (recommandé pour production)
    // Voir section "Configuration avec Service Account" ci-dessous
    
    // Option 2: Utiliser OAuth avec votre compte Google
    // Plus simple pour commencer, nécessite une authentification manuelle initiale
    
    // Pour l'instant, on retourne une valeur de démonstration
    // Vous devrez implémenter l'appel à l'API selon votre méthode d'authentification
    return fetchAnalyticsData(startDate, endDate);
    
  } catch (error) {
    console.error('Error querying Analytics:', error);
    return null;
  }
}

/**
 * Exemple de requête à l'API (à adapter selon votre méthode d'authentification)
 */
function fetchAnalyticsData(startDate, endDate) {
  // Cette fonction sera implémentée selon la méthode d'authentification choisie
  // Voir les sections suivantes pour les détails
  
  // Pour tester, retourner des valeurs de démonstration
  return Math.floor(Math.random() * 100) + 50; // Valeur de test
}

/**
 * Vérifie l'accès (optionnel - pour sécuriser l'endpoint)
 */
function hasAccess() {
  // Optionnel: Ajouter une vérification de clé API ou d'origine
  // Par exemple, vérifier un paramètre 'key' dans la requête
  // const key = e.parameter.key;
  // return key === 'VOTRE_CLE_SECRETE';
  return true;
}

/**
 * Formate une date au format requis par l'API (YYYY-MM-DD)
 */
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
```

### 2.3 Déployer le script

1. Cliquer sur **Déployer** > **Nouveau déploiement**
2. Cliquer sur l'icône **Type de déploiement** > Sélectionner **Application Web**
3. Configuration :
   - **Description** : "API Analytics Metrics v1"
   - **Exécuter en tant que** : Moi
   - **Qui peut y accéder** : Tous
4. Cliquer sur **Déployer**
5. **Copier l'URL du déploiement** (format: `https://script.google.com/macros/s/XXXXX/exec`)
6. Autoriser l'accès si demandé

---

## Étape 3 : Configuration avec Service Account (Recommandé)

### 3.1 Créer un Service Account

1. Aller sur [Google Cloud Console](https://console.cloud.google.com/)
2. Sélectionner votre projet
3. Aller dans **IAM & Admin** > **Service Accounts**
4. Cliquer sur **Create Service Account**
5. Remplir :
   - **Name** : `analytics-api-service`
   - **Description** : `Service account for Analytics API access`
6. Cliquer sur **Create and Continue**
7. Rôle : **Basic** > **Editor** (ou personnalisé selon vos besoins)
8. Cliquer sur **Done**

### 3.2 Créer une clé JSON

1. Cliquer sur le service account créé
2. Aller dans l'onglet **Keys**
3. Cliquer sur **Add Key** > **Create new key**
4. Sélectionner **JSON**
5. Télécharger le fichier JSON (gardez-le secret !)

### 3.3 Donner accès au Service Account dans Google Analytics

1. Aller sur [Google Analytics](https://analytics.google.com/)
2. **Admin** > **Access Management** (Gestion des accès)
3. Cliquer sur **+** > **Ajouter des utilisateurs**
4. Entrer l'email du service account (format: `xxx@xxx.iam.gserviceaccount.com`)
5. Rôle : **Viewer** (lecture seule)
6. Cliquer sur **Ajouter**

### 3.4 Modifier le script Apps Script

Remplacer la fonction `fetchAnalyticsData` par :

```javascript
/**
 * Configuration du Service Account
 */
const SERVICE_ACCOUNT_EMAIL = 'xxx@xxx.iam.gserviceaccount.com'; // Email du service account
const PRIVATE_KEY = '-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n'; // Clé privée du JSON

/**
 * Récupère les données depuis l'API Google Analytics Data API
 */
function fetchAnalyticsData(startDate, endDate) {
  const jwt = createJWT();
  const accessToken = getAccessToken(jwt);
  
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${GA_PROPERTY_ID}:runReport`;
  
  const payload = {
    dateRanges: [
      {
        startDate: startDate,
        endDate: endDate
      }
    ],
    metrics: [
      {
        name: 'activeUsers'
      }
    ],
    dimensions: []
  };
  
  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'Authorization': 'Bearer ' + accessToken
    },
    payload: JSON.stringify(payload)
  };
  
  try {
    const response = UrlFetchApp.fetch(url, options);
    const data = JSON.parse(response.getContentText());
    
    if (data.rows && data.rows.length > 0) {
      return parseInt(data.rows[0].metricValues[0].value);
    }
    return 0;
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return null;
  }
}

/**
 * Crée un JWT pour l'authentification
 */
function createJWT() {
  const now = Math.floor(Date.now() / 1000);
  
  const jwtHeader = {
    alg: 'RS256',
    typ: 'JWT'
  };
  
  const jwtClaim = {
    iss: SERVICE_ACCOUNT_EMAIL,
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };
  
  const encodedHeader = Utilities.base64EncodeWebSafe(JSON.stringify(jwtHeader));
  const encodedClaim = Utilities.base64EncodeWebSafe(JSON.stringify(jwtClaim));
  
  const signature = Utilities.computeRsaSha256Signature(
    encodedHeader + '.' + encodedClaim,
    PRIVATE_KEY
  );
  
  return encodedHeader + '.' + encodedClaim + '.' + Utilities.base64EncodeWebSafe(signature);
}

/**
 * Obtient un access token depuis Google OAuth
 */
function getAccessToken(jwt) {
  const url = 'https://oauth2.googleapis.com/token';
  
  const payload = {
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion: jwt
  };
  
  const options = {
    method: 'post',
    payload: payload
  };
  
  const response = UrlFetchApp.fetch(url, options);
  const data = JSON.parse(response.getContentText());
  
  return data.access_token;
}
```

**Important** : Pour des raisons de sécurité, stockez la clé privée dans les propriétés du script :

1. Dans Apps Script, aller dans **Projet** > **Paramètres du projet**
2. Section **Script Properties**
3. Ajouter :
   - `PRIVATE_KEY` : La clé privée du JSON
   - `SERVICE_ACCOUNT_EMAIL` : L'email du service account
4. Modifier le script pour lire depuis les propriétés :

```javascript
const SERVICE_ACCOUNT_EMAIL = PropertiesService.getScriptProperties().getProperty('SERVICE_ACCOUNT_EMAIL');
const PRIVATE_KEY = PropertiesService.getScriptProperties().getProperty('PRIVATE_KEY');
```

---

## Étape 4 : Configuration Alternative avec OAuth (Plus Simple)

Si la méthode Service Account est trop complexe, vous pouvez utiliser OAuth :

### 4.1 Modifier le script

```javascript
/**
 * Récupère les données depuis l'API avec OAuth
 */
function fetchAnalyticsData(startDate, endDate) {
  const service = getAnalyticsService();
  
  if (!service.hasAccess()) {
    // La première fois, rediriger vers l'autorisation
    const authorizationUrl = service.getAuthorizationUrl();
    Logger.log('Ouvrez cette URL et autorisez l\'accès: ' + authorizationUrl);
    return null;
  }
  
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${GA_PROPERTY_ID}:runReport`;
  
  const payload = {
    dateRanges: [
      {
        startDate: startDate,
        endDate: endDate
      }
    ],
    metrics: [
      {
        name: 'activeUsers'
      }
    ]
  };
  
  try {
    const response = service.fetch(url, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload)
    });
    
    const data = JSON.parse(response.getContentText());
    
    if (data.rows && data.rows.length > 0) {
      return parseInt(data.rows[0].metricValues[0].value);
    }
    return 0;
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return null;
  }
}

/**
 * Configure le service OAuth
 */
function getAnalyticsService() {
  return OAuth2.createService('analytics')
    .setAuthorizationBaseUrl('https://accounts.google.com/o/oauth2/auth')
    .setTokenUrl('https://oauth2.googleapis.com/token')
    .setClientId('VOTRE_CLIENT_ID')
    .setClientSecret('VOTRE_CLIENT_SECRET')
    .setScope('https://www.googleapis.com/auth/analytics.readonly')
    .setCallbackFunction('authCallback')
    .setPropertyStore(PropertiesService.getUserProperties());
}

function authCallback(request) {
  const service = getAnalyticsService();
  const authorized = service.handleCallback(request);
  if (authorized) {
    return HtmlService.createHtmlOutput('Autorisation réussie ! Vous pouvez fermer cette fenêtre.');
  } else {
    return HtmlService.createHtmlOutput('Autorisation échouée.');
  }
}
```

### 4.2 Créer les identifiants OAuth

1. Google Cloud Console > **APIs & Services** > **Credentials**
2. **Create Credentials** > **OAuth client ID**
3. Type : **Web application**
4. **Authorized JavaScript origins** : `https://script.google.com`
5. **Authorized redirect URIs** : `https://script.google.com/macros/s/YOUR_SCRIPT_ID/usercallback`
6. Copier **Client ID** et **Client Secret**

---

## Étape 5 : Modifier le service Angular

### 5.1 Mettre à jour AnalyticsService

Modifier `src/app/services/analytics.service.ts` :

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface AnalyticsMetrics {
  visitorsToday: number | null;
  visitorsThisMonth: number | null;
  lastUpdated?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private readonly GA_PROPERTY_ID = 'G-H0MY2T492N';
  // URL de votre Google Apps Script déployé
  private readonly METRICS_API_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
  
  private metrics$ = new BehaviorSubject<AnalyticsMetrics>({
    visitorsToday: null,
    visitorsThisMonth: null
  });

  // Cache pour éviter trop de requêtes
  private lastFetchTime: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor(private http: HttpClient) {
    // Charger les métriques au démarrage
    this.loadMetrics();
    
    // Rafraîchir périodiquement (toutes les 10 minutes)
    setInterval(() => this.loadMetrics(), 10 * 60 * 1000);
  }

  getMetrics(): Observable<AnalyticsMetrics> {
    return this.metrics$.asObservable();
  }

  /**
   * Charge les métriques depuis l'API Google Apps Script
   */
  private loadMetrics(): void {
    // Vérifier le cache
    const now = Date.now();
    if (now - this.lastFetchTime < this.CACHE_DURATION) {
      return; // Utiliser les données en cache
    }

    this.http.get<AnalyticsMetrics>(this.METRICS_API_URL)
      .pipe(
        catchError(error => {
          console.error('Error loading analytics metrics:', error);
          // Ne pas mettre à jour les métriques en cas d'erreur
          // Garder les dernières valeurs connues
          return of(null);
        }),
        tap(metrics => {
          if (metrics) {
            this.lastFetchTime = now;
            this.metrics$.next({
              visitorsToday: metrics.visitorsToday,
              visitorsThisMonth: metrics.visitorsThisMonth,
              lastUpdated: metrics.lastUpdated
            });
          }
        })
      )
      .subscribe();
  }

  getVisitorsToday(): Observable<number | null> {
    return this.metrics$.pipe(
      map(metrics => metrics.visitorsToday)
    );
  }

  getVisitorsThisMonth(): Observable<number | null> {
    return this.metrics$.pipe(
      map(metrics => metrics.visitorsThisMonth)
    );
  }

  /**
   * Rafraîchit les métriques manuellement
   */
  refreshMetrics(): void {
    this.lastFetchTime = 0; // Forcer le rechargement
    this.loadMetrics();
  }
}
```

### 5.2 Important : Mettre à jour l'URL

Remplacer `YOUR_SCRIPT_ID` par l'ID réel de votre script Apps Script déployé.

---

## Étape 6 : Tester

### 6.1 Tester le script Apps Script

1. Dans Apps Script, exécuter la fonction `doGet`
2. Vérifier les logs pour les erreurs
3. Tester l'URL directement dans le navigateur

### 6.2 Tester l'application

1. Démarrer l'application : `npm start`
2. Aller sur la page Settings
3. Vérifier que les métriques s'affichent
4. Ouvrir la console du navigateur pour vérifier les erreurs

---

## Dépannage

### Erreur 401 : Unauthorized

- Vérifier que le Service Account a accès à Google Analytics
- Vérifier que l'API est activée
- Vérifier les credentials

### Erreur CORS

- Google Apps Script gère automatiquement CORS pour les applications web déployées
- Vérifier que le déploiement est en mode "Tous" peut y accéder

### Les métriques sont toujours null

- Vérifier la console du navigateur
- Vérifier les logs Apps Script (Exécutions)
- Tester l'URL directement dans le navigateur

### Les métriques ne se mettent pas à jour

- Vérifier le cache (5 minutes par défaut)
- Appeler manuellement `refreshMetrics()`

---

## Sécurité

### Recommandations

1. **Ne jamais exposer les credentials dans le code frontend**
2. **Utiliser les Script Properties** pour stocker les clés secrètes
3. **Ajouter une clé API** optionnelle pour limiter l'accès à l'endpoint
4. **Limiter les permissions** du Service Account (lecture seule)

### Ajouter une clé API (optionnel)

Dans le script :

```javascript
function doGet(e) {
  const apiKey = e.parameter.key;
  const validKey = PropertiesService.getScriptProperties().getProperty('API_KEY');
  
  if (apiKey !== validKey) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: 'Unauthorized' }))
      .setMimeType(ContentService.MimeType.JSON)
      .setStatusCode(403);
  }
  
  // ... reste du code
}
```

Dans Angular :

```typescript
this.http.get<AnalyticsMetrics>(this.METRICS_API_URL, {
  params: { key: 'VOTRE_CLE_SECRETE' }
})
```

---

## Résumé des étapes

1. ✅ Activer Google Analytics Data API
2. ✅ Créer un projet Google Apps Script
3. ✅ Configurer l'authentification (Service Account ou OAuth)
4. ✅ Déployer le script et copier l'URL
5. ✅ Modifier `AnalyticsService` avec l'URL du script
6. ✅ Tester l'intégration
7. ✅ Vérifier l'affichage dans la page Settings

---

**Note** : Les métriques peuvent prendre quelques minutes à apparaître dans Google Analytics. L'API peut aussi avoir un délai de traitement des données.
