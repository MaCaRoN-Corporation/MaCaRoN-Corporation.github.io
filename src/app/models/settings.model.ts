/**
 * Réglages utilisateur persistés dans localStorage
 */
export interface UserSettings {
  theme: 'clair' | 'sombre';
  voice: 'masculin' | 'féminin';
  bannerColor: string;
  footerColor: string;
  elevenlabsApiKey: string | null;
}

/**
 * Valeurs par défaut pour les réglages utilisateur
 */
export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'clair',
  voice: 'masculin',
  bannerColor: '#4A90E2',
  footerColor: '#2C3E50',
  elevenlabsApiKey: null
};