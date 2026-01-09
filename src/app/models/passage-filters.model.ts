import { Position } from './position.model';

/**
 * Filtres appliqués lors de la génération d'un passage
 */
export interface PassageFilters {
  positions: Position[];
  attacks: string[];
  techniques: string[];
  includeWeapons: boolean;
  includeRandori: boolean;
}
