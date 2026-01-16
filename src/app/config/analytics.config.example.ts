/**
 * Configuration Analytics - FICHIER D'EXEMPLE
 * 
 * INSTRUCTIONS:
 * 1. Copier ce fichier vers analytics.config.ts
 * 2. Remplacer les valeurs par vos vraies configurations
 * 3. NE PAS COMMITTER analytics.config.ts dans Git
 * 
 * Ce fichier est dans .gitignore pour éviter de commit les secrets
 */

export const ANALYTICS_CONFIG = {
  /**
   * ID Measurement Google Analytics
   * Format: G-XXXXXXXXXX
   * Obtention: Google Analytics > Admin > Informations sur la propriété
   */
  measurementId: 'G-XXXXXXXXXX',

  /**
   * URL de l'API Google Apps Script pour récupérer les métriques
   * Format: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   * Obtention: Déployer le script Apps Script et copier l'URL
   */
  metricsApiUrl: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',

  /**
   * Clé API pour sécuriser l'endpoint (optionnel mais recommandé)
   * Obtention: Créer une clé secrète et la configurer dans Apps Script
   */
  metricsApiKey: 'YOUR_API_KEY'
};
