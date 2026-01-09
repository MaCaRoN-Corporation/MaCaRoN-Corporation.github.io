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
