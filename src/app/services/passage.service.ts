import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Passage, PassageState, PassageConfig } from '../models/passage.model';
import { Technique } from '../models/technique.model';
import { PassageFilters } from '../models/passage-filters.model';

/**
 * Service pour gérer l'état du passage en cours
 * Responsabilité: Gestion de l'état du passage (techniques, timer, progression),
 * logique de génération aléatoire respectant l'ordre strict traditionnel
 */
@Injectable({
  providedIn: 'root'
})
export class PassageService {
  private passageState$ = new BehaviorSubject<PassageState>({
    currentPassage: null,
    currentTechniqueIndex: 0,
    isPlaying: false,
    isPaused: false,
    elapsedTime: 0,
    progress: 0
  });

  constructor() {
    // Initialisation du service
  }

  /**
   * Génère un nouveau passage selon le grade, les filtres et la configuration
   * @param grade Le grade sélectionné
   * @param filters Les filtres à appliquer
   * @param config La configuration du passage (durée, temps entre techniques, voix)
   * @returns Le passage généré
   */
  generatePassage(grade: string, filters: PassageFilters, config: PassageConfig): Passage {
    // Implementation will be in future stories
    return {} as Passage;
  }

  /**
   * Démarre un passage
   * @param passage Le passage à démarrer
   */
  startPassage(passage: Passage): void {
    // Implementation will be in future stories
  }

  /**
   * Met en pause le passage en cours
   */
  pausePassage(): void {
    // Implementation will be in future stories
  }

  /**
   * Reprend le passage en pause
   */
  resumePassage(): void {
    // Implementation will be in future stories
  }

  /**
   * Récupère la technique actuellement en cours
   * @returns La technique actuelle ou null si aucun passage en cours
   */
  getCurrentTechnique(): Technique | null {
    // Implementation will be in future stories
    return null;
  }

  /**
   * Récupère l'état actuel du passage en tant qu'Observable
   * @returns Observable de l'état du passage
   */
  getPassageState(): Observable<PassageState> {
    return this.passageState$.asObservable();
  }
}
