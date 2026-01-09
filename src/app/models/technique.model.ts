import { Position } from './position.model';

/**
 * Représente une technique individuelle dans un passage
 */
export interface Technique {
  attack: string;
  technique: string;
  position: Position;
  order: number;
  videoUrl: string | null;
}
