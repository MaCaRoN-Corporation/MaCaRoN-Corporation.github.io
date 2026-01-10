import { Position } from './position.model';

/**
 * Filtres appliqués lors de la génération d'un passage
 */
export interface PassageFilters {
  positions: Position[];
  attacks: string[];
  techniques: string[];
  includeWeapons: boolean;
  /**
   * Active l'annonce audio "Randori" à la fin du passage
   * (pas de techniques spécifiques, juste une annonce finale avec temps personnalisable)
   */
  includeRandori: boolean;
}
