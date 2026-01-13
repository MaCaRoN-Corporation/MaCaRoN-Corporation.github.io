import { Position } from './position.model';

/**
 * Mode d'affichage de la liste de filtrage
 */
export type DisplayMode = 'positions' | 'positions-attacks' | 'all';

/**
 * Sélection hiérarchique pour le mode révision
 * Permet de sélectionner des techniques de manière hiérarchique (positions → attaques → techniques)
 */
export interface HierarchicalSelection {
  /**
   * Grade associé à cette sélection
   */
  grade: string;
  
  /**
   * Mode d'affichage actuel
   */
  displayMode: DisplayMode;
  
  /**
   * Positions sélectionnées
   */
  selectedPositions: Position[];
  
  /**
   * Attaques sélectionnées par position
   * Clé: Position, Valeur: Liste des attaques
   */
  selectedAttacks: Record<Position, string[]>;
  
  /**
   * Techniques sélectionnées par position et attaque
   * Clé: "Position-Attaque", Valeur: Liste des techniques
   */
  selectedTechniques: Record<string, string[]>;
  
  /**
   * Terme de recherche (optionnel, pour sauvegarde de l'état)
   */
  searchTerm?: string;
}

/**
 * Données hiérarchiques pour une position
 */
export interface HierarchicalPositionData {
  position: Position;
  attacks: Map<string, string[]>; // Attaque → Techniques[]
}

/**
 * Élément hiérarchique pour l'affichage
 */
export interface HierarchicalItem {
  type: 'position' | 'attack' | 'technique';
  id: string;
  label: string;
  parentId?: string;
  children?: HierarchicalItem[];
  isSelected: boolean;
  isExpanded?: boolean;
}

/**
 * Configuration par défaut pour une sélection hiérarchique
 */
export const DEFAULT_HIERARCHICAL_SELECTION: Omit<HierarchicalSelection, 'grade'> = {
  displayMode: 'all',
  selectedPositions: [],
  selectedAttacks: {
    'Suwariwaza': [],
    'Hanmi Handachi': [],
    'Tashiwaza': [],
    'Armes': []
  },
  selectedTechniques: {},
  searchTerm: ''
};
