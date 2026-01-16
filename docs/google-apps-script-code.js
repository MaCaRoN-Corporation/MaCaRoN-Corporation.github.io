/**
 * Google Apps Script - Proxy pour récupérer les métriques Google Analytics
 * 
 * INSTRUCTIONS:
 * 1. Copier ce code dans un nouveau projet Google Apps Script
 * 2. Remplacer GA_PROPERTY_ID par votre ID de propriété GA4 (format: 123456789)
 * 3. Suivre les instructions dans docs/google-analytics-metrics-setup.md
 * 4. Déployer en tant qu'application web
 * 5. Copier l'URL du déploiement dans AnalyticsService.ts
 */

// ==================== CONFIGURATION ====================

// ID de votre propriété Google Analytics 4 (format numérique, pas G-XXXXX)
const GA_PROPERTY_ID = '123456789'; // ⚠️ À MODIFIER

// Optionnel: Clé API pour sécuriser l'endpoint
const API_KEY = null; // Exemple: 'VOTRE_CLE_SECRETE'

// ==================== FONCTION PRINCIPALE ====================

/**
 * Fonction principale pour récupérer les métriques
 * Accessible via: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
 */
function doGet(e) {
  try {
    // Vérifier la clé API si configurée
    if (API_KEY && e.parameter.key !== API_KEY) {
      return createErrorResponse(403, 'Unauthorized', 'Clé API invalide');
    }

    // Récupérer les métriques
    const metrics = getAnalyticsMetrics();
    
    return ContentService
      .createTextOutput(JSON.stringify(metrics))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error:', error);
    return createErrorResponse(500, 'Internal Server Error', error.toString());
  }
}

/**
 * Récupère les métriques depuis Google Analytics
 */
function getAnalyticsMetrics() {
  try {
    const today = getVisitorsToday();
    const thisMonth = getVisitorsThisMonth();
    
    return {
      visitorsToday: today,
      visitorsThisMonth: thisMonth,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting metrics:', error);
    return {
      visitorsToday: null,
      visitorsThisMonth: null,
      error: error.toString()
    };
  }
}

/**
 * Récupère le nombre de visiteurs aujourd'hui
 */
function getVisitorsToday() {
  const today = new Date();
  const startDate = formatDate(today);
  const endDate = formatDate(today);
  
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

// ==================== MÉTHODE 1: AVEC SERVICE ACCOUNT (Recommandé) ====================

/**
 * Configuration du Service Account
 * Récupérer ces valeurs depuis Script Properties (Projet > Paramètres du projet)
 */
function getServiceAccountConfig() {
  const scriptProperties = PropertiesService.getScriptProperties();
  
  return {
    email: scriptProperties.getProperty('SERVICE_ACCOUNT_EMAIL'),
    privateKey: scriptProperties.getProperty('PRIVATE_KEY')
  };
}

/**
 * Requête à l'API Google Analytics Data API avec Service Account
 */
function queryAnalytics(startDate, endDate) {
  try {
    // Méthode avec Service Account (recommandée)
    const config = getServiceAccountConfig();
    
    if (config.email && config.privateKey) {
      return fetchAnalyticsDataWithServiceAccount(startDate, endDate, config);
    }
    
    // Méthode avec OAuth (alternative)
    return fetchAnalyticsDataWithOAuth(startDate, endDate);
    
  } catch (error) {
    console.error('Error querying Analytics:', error);
    return null;
  }
}

/**
 * Récupère les données avec Service Account
 */
function fetchAnalyticsDataWithServiceAccount(startDate, endDate, config) {
  const jwt = createJWT(config.email, config.privateKey);
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
    console.error('Error fetching analytics data with Service Account:', error);
    throw error;
  }
}

/**
 * Crée un JWT pour l'authentification avec Service Account
 */
function createJWT(serviceAccountEmail, privateKey) {
  const now = Math.floor(Date.now() / 1000);
  
  const jwtHeader = {
    alg: 'RS256',
    typ: 'JWT'
  };
  
  const jwtClaim = {
    iss: serviceAccountEmail,
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };
  
  const encodedHeader = Utilities.base64EncodeWebSafe(JSON.stringify(jwtHeader));
  const encodedClaim = Utilities.base64EncodeWebSafe(JSON.stringify(jwtClaim));
  
  const signature = Utilities.computeRsaSha256Signature(
    encodedHeader + '.' + encodedClaim,
    privateKey
  );
  
  return encodedHeader + '.' + encodedClaim + '.' + Utilities.base64EncodeWebSafe(signature);
}

/**
 * Obtient un access token depuis Google OAuth avec JWT
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
  
  if (data.error) {
    throw new Error('OAuth error: ' + JSON.stringify(data));
  }
  
  return data.access_token;
}

// ==================== MÉTHODE 2: AVEC OAUTH (Alternative) ====================

/**
 * Récupère les données avec OAuth (si Service Account non configuré)
 */
function fetchAnalyticsDataWithOAuth(startDate, endDate) {
  const service = getAnalyticsService();
  
  if (!service.hasAccess()) {
    // La première fois, rediriger vers l'autorisation
    const authorizationUrl = service.getAuthorizationUrl();
    Logger.log('⚠️ OUVREZ CETTE URL ET AUTORISEZ L\'ACCÈS: ' + authorizationUrl);
    throw new Error('Autorisation OAuth requise. Voir les logs.');
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
    console.error('Error fetching analytics data with OAuth:', error);
    throw error;
  }
}

/**
 * Configure le service OAuth2 (nécessite la bibliothèque OAuth2)
 * 
 * INSTRUCTIONS:
 * 1. Dans Apps Script, aller dans Bibliothèques
 * 2. Ajouter: 1B7FSrk5Zi6L1rSxxTDgDEUsPzlukDsi4KGuTMorsTQHhGBzBkMun4iDF
 * 3. Configurer les credentials OAuth dans Google Cloud Console
 */
function getAnalyticsService() {
  // ⚠️ Cette fonction nécessite la bibliothèque OAuth2
  // Si vous utilisez Service Account, cette fonction n'est pas nécessaire
  
  // Désactiver cette fonction si vous n'utilisez pas OAuth
  throw new Error('OAuth non configuré. Utilisez Service Account ou configurez OAuth.');
  
  /* Exemple de configuration OAuth (à décommenter si nécessaire):
  
  return OAuth2.createService('analytics')
    .setAuthorizationBaseUrl('https://accounts.google.com/o/oauth2/auth')
    .setTokenUrl('https://oauth2.googleapis.com/token')
    .setClientId('VOTRE_CLIENT_ID')
    .setClientSecret('VOTRE_CLIENT_SECRET')
    .setScope('https://www.googleapis.com/auth/analytics.readonly')
    .setCallbackFunction('authCallback')
    .setPropertyStore(PropertiesService.getUserProperties());
  */
}

/**
 * Callback pour l'autorisation OAuth
 */
function authCallback(request) {
  const service = getAnalyticsService();
  const authorized = service.handleCallback(request);
  if (authorized) {
    return HtmlService.createHtmlOutput('✅ Autorisation réussie ! Vous pouvez fermer cette fenêtre.');
  } else {
    return HtmlService.createHtmlOutput('❌ Autorisation échouée.');
  }
}

// ==================== FONCTIONS UTILITAIRES ====================

/**
 * Formate une date au format requis par l'API (YYYY-MM-DD)
 */
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Crée une réponse d'erreur JSON
 */
function createErrorResponse(statusCode, error, message) {
  return ContentService
    .createTextOutput(JSON.stringify({ 
      error: error,
      message: message
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setStatusCode(statusCode);
}
