import { Position } from './position.model';

/**
 * Structure des données de nomenclature chargées depuis nomenclature.json
 * Format: grade -> position -> attack -> techniques[]
 * 
 * Note: Pour les armes, la structure peut être hétérogène :
 * - Tanto Dori et Tachi Dori: Armes -> Type d'arme -> Attaque -> Techniques[]
 * - Jo Dori et Jo Nage: Armes -> Type d'arme -> Techniques[] (pas d'attaque intermédiaire)
 * - Ken Taï Ken et Jo Taï Jo: Armes -> Type d'arme -> [] (Jiyu Waza, pas de techniques)
 */
export interface NomenclatureData {
  [grade: string]: {
    [position: string]: {
      [key: string]: string[] | { [attack: string]: string[] }; // Soit directement techniques[], soit attaque -> techniques[]
    };
  };
}
