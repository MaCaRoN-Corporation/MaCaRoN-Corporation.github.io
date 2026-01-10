import { PassageFilters } from './passage-filters.model';

/**
 * Configuration complète pour la génération d'un passage
 * Stockée dans localStorage pour persistance
 */
export interface PassageConfig {
  /**
   * Grade sélectionné (ex: "1er Dan", "6e Kyū")
   */
  selectedGrade: string;
  
  /**
   * Filtres appliqués lors de la génération du passage
   */
  filters: PassageFilters;
  
  /**
   * Mode de passage sélectionné (ex: "classique", "progression", "aleatoire", "revision")
   */
  passageMode?: string;
  
  /**
   * Temps entre chaque technique (en secondes)
   * Valeur par défaut: 20 secondes
   * Minimum: 5 secondes, Maximum: 120 secondes
   * Les valeurs sont ajustées par pas de 5 secondes
   */
  timeBetweenTechniques?: number;
  
  /**
   * Durée totale du passage (en minutes)
   * Valeur par défaut: 10 minutes
   * Minimum: 5 minutes, Maximum: 60 minutes
   */
  totalDuration?: number;
  
  /**
   * Temps dédié aux techniques avec armes (en minutes)
   * Valeur par défaut: 5 minutes
   * Minimum: 1 minute, Maximum: 10 minutes
   * Ce temps est soustrait de la durée totale pour calculer le nombre de techniques
   */
  weaponTime?: number;
  
  /**
   * Indique si un temps dédié aux armes doit être inclus
   * Valeur par défaut: false
   * Si true et que le grade est >= 1er Kyū, le contrôle "Temps dédié aux armes" est affiché
   */
  includeWeaponTime?: boolean;
  
  /**
   * Indique si un temps dédié au randori doit être inclus
   * Valeur par défaut: false
   * Temps fixe d'environ 3 minutes pour le randori
   * Ce temps est aussi soustrait de la durée totale pour calculer le nombre de techniques
   */
  includeRandoriTime?: boolean;
  
  /**
   * Temps dédié au randori (en minutes)
   * Valeur par défaut: 3 minutes
   * Temps fixe pour le randori
   */
  randoriTime?: number;
}

/**
 * Configuration par défaut
 */
export const DEFAULT_PASSAGE_CONFIG: PassageConfig = {
  selectedGrade: '1er Dan',
  filters: {
    positions: [],
    attacks: [],
    techniques: [],
    includeWeapons: false,
    includeRandori: false
  },
  passageMode: 'classique',
  timeBetweenTechniques: 20, // secondes
  totalDuration: 10, // minutes
  weaponTime: 5, // minutes
  includeWeaponTime: false, // par défaut, ne pas inclure de temps dédié aux armes
  includeRandoriTime: false, // par défaut, ne pas inclure de temps dédié au randori
  randoriTime: 3 // minutes - temps fixe pour le randori
};
