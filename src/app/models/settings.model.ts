/**
 * Type pour l'apparence (clair ou sombre)
 */
export type Appearance = 'clair' | 'sombre';

/**
 * Type pour le thème (palette de couleurs de 1 à 4)
 */
export type Theme = 1 | 2 | 3 | 4;

/**
 * Réglages utilisateur persistés dans localStorage
 */
export interface UserSettings {
  appearance: Appearance;
  theme: Theme; // Palette de couleurs (1-4) qui s'adapte à l'apparence
  voice: 'masculin' | 'féminin';
  bannerColor: string;
  footerColor: string;
  elevenlabsApiKey: string | null;
}

/**
 * Valeurs par défaut pour les réglages utilisateur
 */
export const DEFAULT_SETTINGS: UserSettings = {
  appearance: 'clair',
  theme: 1, // Thème par défaut (première palette)
  voice: 'masculin',
  bannerColor: '#4A90E2',
  footerColor: '#2C3E50',
  elevenlabsApiKey: null
};