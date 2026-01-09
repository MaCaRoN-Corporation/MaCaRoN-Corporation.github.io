import { Technique } from './technique.model';
import { PassageFilters } from './passage-filters.model';

/**
 * Représente un passage de grade généré avec sa séquence de techniques
 */
export interface Passage {
  id: string;
  grade: string;
  techniques: Technique[];
  duration: number;
  timeBetweenTechniques: number;
  voice: 'masculin' | 'féminin';
  filters: PassageFilters;
  createdAt: Date;
  completedAt: Date | null;
}

/**
 * État actuel d'un passage en cours
 */
export interface PassageState {
  currentPassage: Passage | null;
  currentTechniqueIndex: number;
  isPlaying: boolean;
  isPaused: boolean;
  elapsedTime: number;
  progress: number; // 0-100
}

/**
 * Configuration pour générer un passage
 */
export interface PassageConfig {
  duration: number;
  timeBetweenTechniques: number;
  voice: 'masculin' | 'féminin';
}
