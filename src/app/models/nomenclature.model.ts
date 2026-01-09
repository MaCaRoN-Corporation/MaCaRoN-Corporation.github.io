import { Position } from './position.model';

/**
 * Structure des données de nomenclature chargées depuis nomenclature.json
 * Format: grade -> position -> attack -> techniques[]
 */
export interface NomenclatureData {
  [grade: string]: {
    [position: string]: {
      [attack: string]: string[]; // Liste des techniques
    };
  };
}
