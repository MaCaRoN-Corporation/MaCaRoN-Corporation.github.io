import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PassageConfig, DEFAULT_PASSAGE_CONFIG } from '../models/passage-config.model';
import { PassageFilters } from '../models/passage-filters.model';

/**
 * Clé utilisée pour stocker la configuration dans localStorage
 */
const STORAGE_KEY = 'keiko-hub-config';

/**
 * Service pour gérer la configuration de passage
 * Responsabilité: Gestion de la configuration (grade, filtres, mode),
 * persistance dans localStorage, synchronisation entre mobile et PC
 */
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config$ = new BehaviorSubject<PassageConfig>(DEFAULT_PASSAGE_CONFIG);

  constructor() {
    // Charger la configuration depuis localStorage au démarrage
    const loadedConfig = this.loadConfig();
    this.config$.next(loadedConfig);
  }

  /**
   * Récupère la configuration en tant qu'Observable
   * @returns Observable de la configuration
   */
  getConfig(): Observable<PassageConfig> {
    return this.config$.asObservable();
  }

  /**
   * Récupère la configuration actuelle (valeur synchrone)
   * @returns Configuration actuelle
   */
  getCurrentConfig(): PassageConfig {
    return this.config$.getValue();
  }

  /**
   * Met à jour la configuration partielle
   * @param config La configuration partielle à mettre à jour
   */
  updateConfig(config: Partial<PassageConfig>): void {
    const currentConfig = this.config$.getValue();
    const updatedConfig: PassageConfig = {
      ...currentConfig,
      ...config,
      // Fusionner les filtres si nécessaire
      filters: config.filters ? { ...currentConfig.filters, ...config.filters } : currentConfig.filters
    };
    this.config$.next(updatedConfig);
    this.saveConfig(updatedConfig);
  }

  /**
   * Met à jour le grade sélectionné
   * @param grade Le grade sélectionné
   */
  updateGrade(grade: string): void {
    this.updateConfig({ selectedGrade: grade });
  }

  /**
   * Met à jour les filtres
   * @param filters Les filtres à mettre à jour
   */
  updateFilters(filters: Partial<PassageFilters>): void {
    const currentConfig = this.config$.getValue();
    const updatedFilters: PassageFilters = {
      ...currentConfig.filters,
      ...filters
    };
    this.updateConfig({ filters: updatedFilters });
  }

  /**
   * Met à jour le mode de passage
   * @param mode Le mode de passage (ex: "classique", "progression", etc.)
   */
  updatePassageMode(mode: string): void {
    this.updateConfig({ passageMode: mode });
  }

  /**
   * Met à jour le temps entre techniques
   * @param timeBetweenTechniques Le temps entre techniques (en secondes)
   */
  updateTimeBetweenTechniques(timeBetweenTechniques: number): void {
    this.updateConfig({ timeBetweenTechniques });
  }

  /**
   * Met à jour la durée totale du passage
   * @param totalDuration La durée totale du passage (en minutes)
   */
  updateTotalDuration(totalDuration: number): void {
    this.updateConfig({ totalDuration });
  }

  /**
   * Met à jour le temps dédié aux armes
   * @param weaponTime Le temps dédié aux armes (en minutes)
   */
  updateWeaponTime(weaponTime: number): void {
    this.updateConfig({ weaponTime });
  }

  /**
   * Met à jour l'indicateur d'inclusion du temps dédié aux armes
   * @param includeWeaponTime true pour inclure un temps dédié aux armes, false sinon
   */
  updateIncludeWeaponTime(includeWeaponTime: boolean): void {
    this.updateConfig({ includeWeaponTime });
  }

  /**
   * Met à jour l'indicateur d'inclusion du temps dédié au randori
   * @param includeRandoriTime true pour inclure un temps dédié au randori, false sinon
   */
  updateIncludeRandoriTime(includeRandoriTime: boolean): void {
    this.updateConfig({ includeRandoriTime });
  }

  /**
   * Met à jour le temps dédié au randori
   * @param randoriTime Le temps dédié au randori (en minutes)
   */
  updateRandoriTime(randoriTime: number): void {
    this.updateConfig({ randoriTime });
  }

  /**
   * Réinitialise la configuration aux valeurs par défaut
   */
  resetConfig(): void {
    this.config$.next(DEFAULT_PASSAGE_CONFIG);
    this.saveConfig(DEFAULT_PASSAGE_CONFIG);
  }

  /**
   * Charge la configuration depuis localStorage
   * @returns Configuration chargée ou configuration par défaut
   * @private
   */
  private loadConfig(): PassageConfig {
    try {
      if (!this.isLocalStorageAvailable()) {
        console.warn('[ConfigService] localStorage is not available, using default config');
        return DEFAULT_PASSAGE_CONFIG;
      }

      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return DEFAULT_PASSAGE_CONFIG;
      }

      const parsed = JSON.parse(stored);
      if (this.isValidConfig(parsed)) {
        // Fusionner avec la config par défaut pour garantir tous les champs
        return {
          ...DEFAULT_PASSAGE_CONFIG,
          ...parsed,
          filters: {
            ...DEFAULT_PASSAGE_CONFIG.filters,
            ...(parsed.filters || {})
          }
        };
      } else {
        console.warn('[ConfigService] Invalid config in localStorage, using default config');
        return DEFAULT_PASSAGE_CONFIG;
      }
    } catch (error) {
      console.error('[ConfigService] Error loading config from localStorage:', error);
      return DEFAULT_PASSAGE_CONFIG;
    }
  }

  /**
   * Sauvegarde la configuration dans localStorage
   * @param config La configuration à sauvegarder
   * @private
   */
  private saveConfig(config: PassageConfig): void {
    try {
      if (!this.isLocalStorageAvailable()) {
        console.warn('[ConfigService] localStorage is not available');
        return;
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.error('[ConfigService] localStorage quota exceeded');
      } else {
        console.error('[ConfigService] Error saving config to localStorage:', error);
      }
      // Ne pas bloquer l'application en cas d'erreur de sauvegarde
    }
  }

  /**
   * Vérifie si localStorage est disponible
   * @returns true si localStorage est disponible, false sinon
   * @private
   */
  private isLocalStorageAvailable(): boolean {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Vérifie si un objet est une instance valide de PassageConfig
   * @param obj L'objet à valider
   * @returns true si l'objet est valide, false sinon
   * @private
   */
  private isValidConfig(obj: unknown): obj is PassageConfig {
    if (!obj || typeof obj !== 'object') {
      return false;
    }

    const config = obj as Record<string, unknown>;

    // Vérifier selectedGrade (doit être une string non vide)
    if (typeof config['selectedGrade'] !== 'string' || config['selectedGrade'].length === 0) {
      return false;
    }

    // Vérifier filters (doit être un objet)
    if (!config['filters'] || typeof config['filters'] !== 'object') {
      return false;
    }

    // Vérifier passageMode (optionnel, mais si présent doit être une string)
    if (config['passageMode'] !== undefined && typeof config['passageMode'] !== 'string') {
      return false;
    }

    return true;
  }
}
