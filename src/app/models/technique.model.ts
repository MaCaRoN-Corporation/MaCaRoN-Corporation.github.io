import { Position } from './position.model';

/**
 * Représente une technique individuelle dans un passage
 */
export interface Technique {
  attack: string;
  technique: string;
  position: Position;
  order: number;
  /**
   * URLs vidéo associées à cette technique (liste d'URLs depuis videos.json)
   * Peut être null si aucune vidéo n'est disponible
   */
  videoUrl: string[] | null;
}
