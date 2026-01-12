/**
 * Type pour l'apparence (clair ou sombre)
 */
export type Appearance = 'clair' | 'sombre';

/**
 * Type pour le thème (palette de couleurs de 1 à 9)
 * 1 = Par défaut, 2-9 = Thèmes personnalisés
 */
export type Theme = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/**
 * Type pour les IDs de voix disponibles
 * Note: Ce type est utilisé pour la validation, mais les voix sont chargées dynamiquement
 * depuis assets/audio/voices.json
 */
export type VoiceId = string;

/**
 * Type pour la langue de la voix
 */
export type VoiceLanguage = 'French' | 'Japanese';

/**
 * Interface pour une voix avec ses informations
 */
export interface Voice {
  id: VoiceId;
  label: string;
  displayName: string; // Prénom à afficher
  gender: 'male' | 'female';
  language: VoiceLanguage; // Langue de la voix (French ou Japanese)
}

/**
 * Construit un VoiceId complet au format {language}_{id}
 * @param voice La voix pour laquelle construire l'ID
 * @returns Le VoiceId complet (ex: "French_Male1")
 */
export function getFullVoiceId(voice: Voice): VoiceId {
  return `${voice.language}_${voice.id}`;
}

/**
 * Extrait la langue et l'ID depuis un VoiceId complet
 * @param fullVoiceId Le VoiceId complet (ex: "French_Male1" ou "Male1" pour rétrocompatibilité)
 * @returns Un objet avec language et id, ou null si le format n'est pas valide
 */
export function parseVoiceId(fullVoiceId: VoiceId): { language: VoiceLanguage; id: string } | null {
  if (fullVoiceId.includes('_')) {
    const parts = fullVoiceId.split('_');
    if (parts.length === 2 && (parts[0] === 'French' || parts[0] === 'Japanese')) {
      return { language: parts[0] as VoiceLanguage, id: parts[1] };
    }
  }
  // Rétrocompatibilité : si pas de langue, supposer French par défaut
  return { language: 'French', id: fullVoiceId };
}

/**
 * Liste des voix disponibles (basée sur les dossiers dans assets/audio)
 * Note: Liste de fallback si voices.json ne peut pas être chargé
 */
export const AVAILABLE_VOICES: Voice[] = [
  { id: 'Male1', label: 'Voix masculine 1', displayName: 'Alexandre', gender: 'male', language: 'French' },
  { id: 'Male2', label: 'Voix masculine 2', displayName: 'Thomas', gender: 'male', language: 'French' },
  { id: 'Male3', label: 'Voix masculine 3', displayName: 'Lucas', gender: 'male', language: 'French' },
  { id: 'Female1', label: 'Voix féminine 1', displayName: 'Sophie', gender: 'female', language: 'French' },
  { id: 'Female2', label: 'Voix féminine 2', displayName: 'Emma', gender: 'female', language: 'French' },
  { id: 'Female3', label: 'Voix féminine 3', displayName: 'Léa', gender: 'female', language: 'French' }
];

/**
 * Réglages utilisateur persistés dans localStorage
 */
export interface UserSettings {
  appearance: Appearance;
  theme: Theme; // Palette de couleurs (1-9) qui s'adapte à l'apparence
  voice: VoiceId; // ID complet de la voix (format: '{language}_{id}', ex: 'French_Male1', 'Japanese_Female2')
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
  voice: 'French_Male1', // Voix par défaut : première voix masculine française (format: {language}_{id})
  bannerColor: '#4A90E2',
  footerColor: '#2C3E50',
  elevenlabsApiKey: null
};