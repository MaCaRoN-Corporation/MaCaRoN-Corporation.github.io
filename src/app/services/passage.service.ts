import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Passage, PassageState, PassageConfig } from '../models/passage.model';
import { Technique } from '../models/technique.model';
import { PassageFilters } from '../models/passage-filters.model';
import { GradeService } from './grade.service';
import { Position } from '../models/position.model';

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

  /**
   * Ordre strict traditionnel des positions
   */
  private readonly STRICT_POSITION_ORDER: Position[] = ['Suwariwaza', 'Hanmi Handachi', 'Tashiwaza', 'Armes'];

  /**
   * Référence au timer pour incrémenter elapsedTime
   */
  private timerInterval: any = null;

  constructor(private gradeService: GradeService) {
    // Initialisation du service
  }

  /**
   * Génère un nouveau passage selon le grade, les filtres et la configuration
   * @param grade Le grade sélectionné
   * @param filters Les filtres à appliquer
   * @param config La configuration du passage (durée, temps entre techniques, voix)
   * @returns Le passage généré
   * @throws Error si aucun filtre ne correspond ou si aucune technique n'est disponible
   */
  generatePassage(grade: string, filters: PassageFilters, config: PassageConfig): Passage {
    // Synchroniser includeRandori depuis filters (Randori sera ajouté comme technique finale si activé)
    const syncedFilters: PassageFilters = { ...filters };

    // Obtenir toutes les techniques disponibles avec les filtres
    const allTechniques = this.gradeService.getTechniquesForGrade(grade, syncedFilters);

    // Vérifier qu'il y a des techniques disponibles
    if (allTechniques.length === 0) {
      throw new Error(`Aucune technique disponible pour le grade "${grade}" avec les filtres sélectionnés.`);
    }

    // Organiser les techniques par position selon l'ordre strict
    const techniquesByPosition = this.groupTechniquesByPosition(allTechniques);

    // Sélectionner aléatoirement des techniques de chaque position (sans doublons)
    let selectedTechniques = this.selectRandomTechniques(techniquesByPosition, syncedFilters);

    // Vérifier qu'au moins une technique a été sélectionnée
    if (selectedTechniques.length === 0) {
      throw new Error(`Aucune technique ne correspond aux filtres sélectionnés pour le grade "${grade}".`);
    }

    // Si Randori est activé, ajouter Randori comme technique finale
    if (syncedFilters.includeRandori) {
      const randoriTechnique = this.createRandoriTechnique(selectedTechniques.length + 1);
      selectedTechniques.push(randoriTechnique);
    }

    // Assigner l'ordre aux techniques (en cas de changement)
    selectedTechniques.forEach((technique, index) => {
      technique.order = index + 1;
    });

    // Générer un ID unique pour le passage
    const passageId = this.generatePassageId();

    // Créer le passage
    const passage: Passage = {
      id: passageId,
      grade,
      techniques: selectedTechniques,
      duration: config.duration,
      timeBetweenTechniques: config.timeBetweenTechniques,
      voice: config.voice,
      filters: syncedFilters,
      createdAt: new Date(),
      completedAt: null
    };

    return passage;
  }

  /**
   * Crée une technique Randori spéciale (technique finale)
   * @param order Ordre dans la séquence
   * @returns Technique Randori
   * @private
   */
  private createRandoriTechnique(order: number): Technique {
    // Randori est une technique spéciale finale
    // On utilise "Armes" comme position (dernière position normale) pour respecter le type Position
    // mais technique = "Randori" et attack = "Randori" pour l'identifier
    return {
      attack: 'Randori',
      technique: 'Randori',
      position: 'Armes', // Utilise la dernière position pour respecter le type, mais c'est une technique spéciale
      order: order,
      videoUrl: null // Pas de vidéo pour Randori
    };
  }

  /**
   * Groupe les techniques par position
   * @param techniques Liste de toutes les techniques
   * @returns Map des techniques groupées par position
   * @private
   */
  private groupTechniquesByPosition(techniques: Technique[]): Map<Position, Technique[]> {
    const grouped = new Map<Position, Technique[]>();

    for (const position of this.STRICT_POSITION_ORDER) {
      grouped.set(position, []);
    }

    for (const technique of techniques) {
      const positionTechniques = grouped.get(technique.position);
      if (positionTechniques) {
        positionTechniques.push(technique);
      }
    }

    return grouped;
  }

  /**
   * Réorganise les techniques selon l'ordre strict et assure l'unicité
   * @param techniquesByPosition Techniques groupées par position
   * @param filters Filtres appliqués
   * @returns Liste des techniques dans l'ordre strict, sans doublons
   * @private
   */
  private selectRandomTechniques(
    techniquesByPosition: Map<Position, Technique[]>,
    filters: PassageFilters
  ): Technique[] {
    const orderedTechniques: Technique[] = [];
    const usedTechniques = new Set<string>(); // Pour éviter les doublons (clé: "attack-technique-position")

    // Parcourir les positions dans l'ordre strict
    for (const position of this.STRICT_POSITION_ORDER) {
      const positionTechniques = techniquesByPosition.get(position);

      if (!positionTechniques || positionTechniques.length === 0) {
        continue; // Passer à la position suivante si aucune technique disponible
      }

      // Mélanger aléatoirement les techniques de cette position (Fisher-Yates shuffle)
      const shuffledTechniques = this.shuffleArray([...positionTechniques]);

      // Ajouter les techniques uniques dans l'ordre
      for (const technique of shuffledTechniques) {
        const key = `${technique.attack}-${technique.technique}-${technique.position}`;
        if (!usedTechniques.has(key)) {
          usedTechniques.add(key);
          orderedTechniques.push({ ...technique }); // Copie pour éviter mutation
        }
      }
    }

    return orderedTechniques;
  }

  /**
   * Mélange un tableau aléatoirement (algorithme Fisher-Yates)
   * @param array Le tableau à mélanger
   * @returns Nouveau tableau mélangé
   * @private
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Génère un ID unique pour un passage
   * @returns ID unique sous forme de string
   * @private
   */
  private generatePassageId(): string {
    // Utiliser timestamp + random pour générer un ID unique
    return `passage-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }

  /**
   * Met à jour l'état du passage de manière immuable
   * @param partial État partiel à fusionner avec l'état actuel
   * @private
   */
  private updateState(partial: Partial<PassageState>): void {
    const currentState = this.passageState$.value;
    this.passageState$.next({ ...currentState, ...partial });
  }

  /**
   * Démarre le timer pour incrémenter elapsedTime
   * @private
   */
  private startTimer(): void {
    this.stopTimer(); // S'assurer qu'aucun timer n'est déjà en cours
    
    this.timerInterval = setInterval(() => {
      const currentState = this.passageState$.value;
      if (!currentState.isPaused && currentState.isPlaying) {
        const newElapsedTime = currentState.elapsedTime + 1;
        const totalTechniques = currentState.currentPassage?.techniques.length || 0;
        const newProgress = totalTechniques > 0 
          ? Math.min(100, (currentState.currentTechniqueIndex / totalTechniques) * 100)
          : 0;
        
        this.updateState({
          elapsedTime: newElapsedTime,
          progress: newProgress
        });
      }
    }, 1000);
  }

  /**
   * Arrête le timer
   * @private
   */
  private stopTimer(): void {
    if (this.timerInterval !== null) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  /**
   * Calcule le nombre total de techniques dans le passage actuel
   * @returns Le nombre total de techniques
   * @private
   */
  private getTotalTechniques(): number {
    const currentState = this.passageState$.value;
    return currentState.currentPassage?.techniques.length || 0;
  }

  /**
   * Démarre un passage
   * @param passage Le passage à démarrer
   */
  startPassage(passage: Passage): void {
    // Arrêter le timer précédent si existant
    this.stopTimer();

    // Réinitialiser l'état avec le nouveau passage
    this.updateState({
      currentPassage: passage,
      currentTechniqueIndex: 0,
      isPlaying: true,
      isPaused: false,
      elapsedTime: 0,
      progress: 0
    });

    // Démarrer le timer
    this.startTimer();
  }

  /**
   * Met en pause le passage en cours
   */
  pausePassage(): void {
    const currentState = this.passageState$.value;
    if (currentState.isPlaying && !currentState.isPaused) {
      this.updateState({
        isPaused: true
      });
      // Le timer continue mais n'incrémente pas elapsedTime car isPaused est true
    }
  }

  /**
   * Reprend le passage en pause
   */
  resumePassage(): void {
    const currentState = this.passageState$.value;
    if (currentState.isPlaying && currentState.isPaused) {
      this.updateState({
        isPaused: false
      });
      // Le timer continue et incrémente elapsedTime car isPaused est false
    }
  }

  /**
   * Passe à la technique suivante
   */
  nextTechnique(): void {
    const currentState = this.passageState$.value;
    if (!currentState.currentPassage) {
      return;
    }

    const totalTechniques = this.getTotalTechniques();
    const nextIndex = currentState.currentTechniqueIndex + 1;

    if (nextIndex >= totalTechniques) {
      // Le passage est terminé
      this.stopTimer();
      this.updateState({
        isPlaying: false,
        isPaused: false,
        currentTechniqueIndex: totalTechniques - 1 // Reste sur la dernière technique
      });

      // Marquer le passage comme complété
      if (currentState.currentPassage) {
        currentState.currentPassage.completedAt = new Date();
      }
    } else {
      // Passer à la technique suivante
      const newProgress = (nextIndex / totalTechniques) * 100;
      this.updateState({
        currentTechniqueIndex: nextIndex,
        progress: newProgress
      });
    }
  }

  /**
   * Récupère la technique actuellement en cours
   * @returns La technique actuelle ou null si aucun passage en cours
   */
  getCurrentTechnique(): Technique | null {
    const currentState = this.passageState$.value;
    if (!currentState.currentPassage) {
      return null;
    }

    const techniques = currentState.currentPassage.techniques;
    const index = currentState.currentTechniqueIndex;

    if (index >= 0 && index < techniques.length) {
      return techniques[index];
    }

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
