import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Passage, PassageState, PassageConfig as ServicePassageConfig } from '../models/passage.model';
import { Technique } from '../models/technique.model';
import { PassageFilters } from '../models/passage-filters.model';
import { GradeService } from './grade.service';
import { Position } from '../models/position.model';
import { PassageConfig } from '../models/passage-config.model';

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
  private readonly STRICT_POSITION_ORDER: Position[] = ['Suwariwaza', 'Hanmi Handachi', 'Tachiwaza', 'Armes'];

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
   * @param config La configuration du passage (durée, temps entre techniques, voix, mode)
   * @param userSelection Sélection utilisateur pour le mode révision (optionnel)
   * @returns Le passage généré
   * @throws Error si aucun filtre ne correspond ou si aucune technique n'est disponible
   */
  generatePassage(
    grade: string, 
    filters: PassageFilters, 
    config: PassageConfig, // PassageConfig de passage-config.model.ts (avec passageMode)
    userSelection?: any // HierarchicalSelection, mais on évite l'import circulaire
  ): Passage {
    // Synchroniser includeRandori depuis filters (Randori sera ajouté comme technique finale si activé)
    const syncedFilters: PassageFilters = { ...filters };

    // Obtenir le mode de passage (par défaut: 'aleatoire' pour compatibilité)
    const passageMode = config.passageMode || 'aleatoire';

    let selectedTechniques: Technique[] = [];

    // Router vers la méthode appropriée selon le mode
    switch (passageMode) {
      case 'classique':
        selectedTechniques = this.generateClassiquePassage(grade, syncedFilters, config);
        break;
      case 'progression':
        selectedTechniques = this.generateProgressionPassage(grade, syncedFilters, config);
        break;
      case 'revision':
        if (!userSelection) {
          throw new Error('Le mode révision nécessite une sélection utilisateur.');
        }
        selectedTechniques = this.generateRevisionPassage(grade, syncedFilters, userSelection);
        break;
      case 'aleatoire':
      default:
        selectedTechniques = this.generateAleatoirePassage(grade, syncedFilters, config);
        break;
    }

    // Vérifier qu'au moins une technique a été sélectionnée
    if (selectedTechniques.length === 0) {
      throw new Error(`Aucune technique ne correspond aux filtres sélectionnés pour le grade "${grade}" en mode "${passageMode}".`);
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

    // Calculer le temps nécessaire pour les techniques
    const timeBetweenTechniques = config.timeBetweenTechniques ?? 20; // secondes
    const requestedDuration = config.totalDuration ?? 10; // minutes
    const requestedWeaponTime = config.weaponTime ?? 5; // minutes
    const includeWeaponTime = config.includeWeaponTime ?? false;
    const includeRandoriTime = config.includeRandoriTime ?? false;
    const randoriTime = config.randoriTime ?? 2; // minutes
    
    // Calculer le temps disponible pour les techniques normales (hors armes et randori)
    // Utiliser syncedFilters.includeRandori pour savoir si le randori sera ajouté au passage
    const willHaveRandori = syncedFilters.includeRandori || false;
    let availableTimeForTechniques = requestedDuration;
    if (includeWeaponTime) {
      availableTimeForTechniques -= requestedWeaponTime;
    }
    if (willHaveRandori) {
      availableTimeForTechniques -= randoriTime;
    }
    availableTimeForTechniques = Math.max(1, availableTimeForTechniques); // Au moins 1 minute
    
    // Calculer le nombre de techniques cible pour se rapprocher du temps demandé
    const targetTechniquesCount = Math.floor((availableTimeForTechniques * 60) / timeBetweenTechniques);
    
    // Calculer le nombre de techniques d'armes cible si activé
    let targetWeaponTechniquesCount = 0;
    if (includeWeaponTime) {
      targetWeaponTechniquesCount = Math.floor((requestedWeaponTime * 60) / timeBetweenTechniques);
    }
    
    // Séparer les techniques normales et les techniques d'armes
    // Exclure le randori des techniques normales (c'est une technique spéciale)
    const normalTechniques = selectedTechniques.filter(t => t.position !== 'Armes' && !(t.attack === 'Randori' && t.technique === 'Randori'));
    const weaponTechniques = selectedTechniques.filter(t => t.position === 'Armes' && !(t.attack === 'Randori' && t.technique === 'Randori'));
    const hasRandori = selectedTechniques.some(t => t.attack === 'Randori' && t.technique === 'Randori');
    
    // Calculer le temps réel basé sur les techniques sélectionnées
    const actualNormalTime = (normalTechniques.length * timeBetweenTechniques) / 60;
    const actualWeaponTime = (weaponTechniques.length * timeBetweenTechniques) / 60;
    // Si le randori fait partie du passage, ajouter le temps configuré (randoriTime) au temps total
    const actualTotalTime = actualNormalTime + (includeWeaponTime ? actualWeaponTime : 0) + (hasRandori ? randoriTime : 0);
    
    // Calculer la durée finale en essayant de se rapprocher du temps demandé
    // Utiliser le temps réel calculé (qui se rapproche le plus possible du temps demandé)
    const finalDuration = actualTotalTime;
    
    // Log pour débogage si le temps réel diffère significativement du temps demandé
    const timeDifference = Math.abs(actualTotalTime - requestedDuration);
    if (timeDifference > 0.5) { // Différence de plus de 30 secondes
      console.log(`[PassageService] Mode ${passageMode}: Temps réel (${actualTotalTime.toFixed(1)} min) vs temps demandé (${requestedDuration} min). Différence: ${timeDifference.toFixed(1)} min.`);
    }

    // Générer un ID unique pour le passage
    const passageId = this.generatePassageId();

    // Créer le passage (utiliser la durée ajustée)
    // Note: config.voice peut être undefined, on utilisera une valeur par défaut si nécessaire
    const passage: Passage = {
      id: passageId,
      grade,
      techniques: selectedTechniques,
      duration: finalDuration,
      timeBetweenTechniques: timeBetweenTechniques,
      voice: (config.voice || 'French_Male1') as any, // VoiceId par défaut si non défini
      filters: syncedFilters,
      createdAt: new Date(),
      completedAt: null
    };

    return passage;
  }

  /**
   * Génère un passage en mode classique (ordre traditionnel fixe)
   * Les techniques sont sélectionnées dans l'ordre hiérarchique strict : Position → Attaque → Techniques
   * Contrainte: Suwariwaza + Hanmi Handachi Waza ne dépassent pas 30% du temps total
   * @param grade Le grade sélectionné
   * @param filters Les filtres à appliquer
   * @param config La configuration du passage (pour calculer les contraintes de temps)
   * @returns Liste des techniques dans l'ordre classique
   * @private
   */
  private generateClassiquePassage(grade: string, filters: PassageFilters, config: PassageConfig): Technique[] {
    // Obtenir toutes les techniques disponibles avec les filtres
    const allTechniques = this.gradeService.getTechniquesForGrade(grade, filters);

    // Vérifier qu'il y a des techniques disponibles
    if (allTechniques.length === 0) {
      throw new Error(`Aucune technique disponible pour le grade "${grade}" avec les filtres sélectionnés.`);
    }

    // Séparer les techniques normales et les techniques d'armes
    const normalTechniques = allTechniques.filter(t => t.position !== 'Armes');
    const weaponTechniques = allTechniques.filter(t => t.position === 'Armes');

    // Calculer les contraintes de temps en visant le temps demandé
    const timeBetweenTechniques = config.timeBetweenTechniques ?? 20; // secondes
    const totalDuration = config.totalDuration ?? 10; // minutes
    const includeWeaponTime = config.includeWeaponTime ?? false;
    const weaponTime = config.includeWeaponTime ? (config.weaponTime ?? 5) : 0; // minutes
    const includeRandoriTime = config.includeRandoriTime ?? false;
    const randoriTime = config.includeRandoriTime ? (config.randoriTime ?? 3) : 0; // minutes
    
    // Calculer le temps disponible pour les techniques normales (hors armes et randori)
    const availableTimeForTechniques = totalDuration - weaponTime - randoriTime;
    const availableTimeSeconds = Math.max(60, availableTimeForTechniques * 60); // Au moins 1 minute
    
    const maxTimeForSittingPositions = availableTimeSeconds * 0.3; // 30% du temps disponible
    const maxTechniquesForSittingPositions = Math.floor(maxTimeForSittingPositions / timeBetweenTechniques);
    
    // Cible : nombre de techniques normales pour se rapprocher du temps demandé
    const estimatedNormalTechniques = Math.floor(availableTimeSeconds / timeBetweenTechniques);
    
    // Cible : nombre de techniques d'armes pour se rapprocher du temps demandé
    const estimatedWeaponTechniques = includeWeaponTime 
      ? Math.floor((weaponTime * 60) / timeBetweenTechniques)
      : 0;

    // Organiser les techniques normales par position puis par attaque
    const normalTechniquesByPositionAndAttack = this.groupTechniquesByPositionAndAttack(normalTechniques);
    
    // Sélectionner les techniques normales dans l'ordre hiérarchique strict
    // Les attaques sont mélangées, et les techniques au sein de chaque attaque le sont aussi
    const selectedNormalTechniques = this.selectTechniquesInHierarchicalOrder(
      normalTechniquesByPositionAndAttack,
      estimatedNormalTechniques,
      maxTechniquesForSittingPositions,
      true // mélanger les attaques pour le mode classique
    );

    // Sélectionner les techniques d'armes si activé
    let selectedWeaponTechniques: Technique[] = [];
    if (includeWeaponTime && estimatedWeaponTechniques > 0 && weaponTechniques.length > 0) {
      const weaponTechniquesByPositionAndAttack = this.groupTechniquesByPositionAndAttack(weaponTechniques);
      selectedWeaponTechniques = this.selectTechniquesInHierarchicalOrder(
        weaponTechniquesByPositionAndAttack,
        estimatedWeaponTechniques,
        0, // Pas de contrainte de 30% pour les armes
        true // mélanger les attaques
      );
    }

    // Combiner les techniques normales et les armes (normales d'abord, puis armes)
    return [...selectedNormalTechniques, ...selectedWeaponTechniques];
  }

  /**
   * Génère un passage en mode progression (niveau croissant)
   * Les techniques sont organisées par progression de difficulté basée sur les grades
   * Pour chaque attaque, on commence par les techniques du 6e Kyū, puis 5e Kyū, etc. jusqu'au grade sélectionné
   * Contrainte: Suwariwaza + Hanmi Handachi Waza ne dépassent pas 30% du temps total
   * @param grade Le grade sélectionné
   * @param filters Les filtres à appliquer
   * @param config La configuration du passage (pour calculer les contraintes de temps)
   * @returns Liste des techniques dans l'ordre de progression
   * @private
   */
  private generateProgressionPassage(grade: string, filters: PassageFilters, config: PassageConfig): Technique[] {
    // Construire la liste de progression dynamique basée sur les grades
    const progressionTechniques = this.buildProgressionTechniquesList(grade, filters);

    // Vérifier qu'il y a des techniques disponibles
    if (progressionTechniques.length === 0) {
      throw new Error(`Aucune technique disponible pour le grade "${grade}" avec les filtres sélectionnés.`);
    }

    // Séparer les techniques normales et les techniques d'armes
    const normalTechniques = progressionTechniques.filter(t => t.position !== 'Armes');
    const weaponTechniques = progressionTechniques.filter(t => t.position === 'Armes');

    // Calculer les contraintes de temps en visant le temps demandé
    const timeBetweenTechniques = config.timeBetweenTechniques ?? 20; // secondes
    const totalDuration = config.totalDuration ?? 10; // minutes
    const includeWeaponTime = config.includeWeaponTime ?? false;
    const weaponTime = config.includeWeaponTime ? (config.weaponTime ?? 5) : 0; // minutes
    const includeRandoriTime = config.includeRandoriTime ?? false;
    const randoriTime = config.includeRandoriTime ? (config.randoriTime ?? 3) : 0; // minutes
    
    // Calculer le temps disponible pour les techniques normales (hors armes et randori)
    const availableTimeForTechniques = totalDuration - weaponTime - randoriTime;
    const availableTimeSeconds = Math.max(60, availableTimeForTechniques * 60); // Au moins 1 minute
    
    const maxTimeForSittingPositions = availableTimeSeconds * 0.3; // 30% du temps disponible
    const maxTechniquesForSittingPositions = Math.floor(maxTimeForSittingPositions / timeBetweenTechniques);
    
    // Cible : nombre de techniques normales pour se rapprocher du temps demandé
    const estimatedNormalTechniques = Math.floor(availableTimeSeconds / timeBetweenTechniques);
    
    // Cible : nombre de techniques d'armes pour se rapprocher du temps demandé
    const estimatedWeaponTechniques = includeWeaponTime 
      ? Math.floor((weaponTime * 60) / timeBetweenTechniques)
      : 0;

    // Organiser les techniques normales par position puis par attaque
    // Les techniques dans chaque attaque sont déjà dans l'ordre de progression (facile → difficile)
    const normalTechniquesByPositionAndAttack = this.groupProgressionTechniquesByPositionAndAttack(normalTechniques);
    
    // Sélectionner les techniques normales avec sélection aléatoire dans l'ordre de progression
    const selectedNormalTechniques = this.selectTechniquesInProgressionOrder(
      normalTechniquesByPositionAndAttack,
      estimatedNormalTechniques,
      maxTechniquesForSittingPositions
    );

    // Sélectionner les techniques d'armes si activé
    let selectedWeaponTechniques: Technique[] = [];
    if (includeWeaponTime && estimatedWeaponTechniques > 0 && weaponTechniques.length > 0) {
      const weaponTechniquesByPositionAndAttack = this.groupProgressionTechniquesByPositionAndAttack(weaponTechniques);
      selectedWeaponTechniques = this.selectTechniquesInProgressionOrder(
        weaponTechniquesByPositionAndAttack,
        estimatedWeaponTechniques,
        0 // Pas de contrainte de 30% pour les armes
      );
    }

    // Combiner les techniques normales et les armes (normales d'abord, puis armes)
    return [...selectedNormalTechniques, ...selectedWeaponTechniques];
  }

  /**
   * Construit une liste de techniques organisée par progression de grade
   * Pour chaque attaque, on commence par les techniques du 6e Kyū, puis 5e Kyū, etc. jusqu'au grade sélectionné
   * @param targetGrade Le grade sélectionné (jusqu'où aller dans la progression)
   * @param filters Les filtres à appliquer
   * @returns Liste des techniques dans l'ordre de progression (6e Kyū → grade sélectionné)
   * @private
   */
  private buildProgressionTechniquesList(targetGrade: string, filters: PassageFilters): Technique[] {
    const allGrades = this.gradeService.getGrades();
    const progressionTechniques: Technique[] = [];
    const usedTechniques = new Set<string>(); // Pour éviter les doublons (clé: "attack-technique-position")

    // Trouver l'index du grade cible
    const targetGradeIndex = allGrades.indexOf(targetGrade);
    if (targetGradeIndex === -1) {
      // Si le grade n'est pas trouvé, utiliser toutes les techniques du grade cible
      return this.gradeService.getTechniquesForGrade(targetGrade, filters);
    }

    // Obtenir les grades de progression (du 6e Kyū jusqu'au grade sélectionné)
    const progressionGrades = allGrades.slice(0, targetGradeIndex + 1);

    // Parcourir les positions dans l'ordre strict
    for (const position of this.STRICT_POSITION_ORDER) {
      // Collecter toutes les attaques disponibles pour cette position à travers tous les grades
      const attacksSet = new Set<string>();
      
      for (const grade of progressionGrades) {
        const gradeTechniques = this.gradeService.getTechniquesForGrade(grade, filters);
        for (const technique of gradeTechniques) {
          if (technique.position === position) {
            attacksSet.add(technique.attack);
          }
        }
      }

      const attacks = Array.from(attacksSet);

      // Pour chaque attaque, construire la progression de techniques
      for (const attack of attacks) {
        // Parcourir les grades dans l'ordre de progression (6e Kyū → grade sélectionné)
        for (const grade of progressionGrades) {
          // Obtenir les techniques pour ce grade, position et attaque
          const techniqueNames = this.gradeService.getTechniquesForGradePositionAttack(grade, position, attack);
          
          // Pour chaque technique, créer l'objet Technique si pas déjà utilisé
          for (const techniqueName of techniqueNames) {
            const key = `${attack}-${techniqueName}-${position}`;
            
            if (!usedTechniques.has(key)) {
              usedTechniques.add(key);
              
              // Créer l'objet Technique
              const technique: Technique = {
                attack: attack,
                technique: techniqueName,
                position: position,
                order: 0, // Sera assigné plus tard
                videoUrl: this.gradeService.getVideoUrls(attack, techniqueName)
              };
              
              progressionTechniques.push(technique);
            }
          }
        }
      }
    }

    return progressionTechniques;
  }

  /**
   * Génère un passage en mode aléatoire (sélection aléatoire respectant l'ordre strict)
   * C'est le comportement par défaut actuel
   * Contrainte: Suwariwaza + Hanmi Handachi Waza ne dépassent pas 30% du temps total
   * @param grade Le grade sélectionné
   * @param filters Les filtres à appliquer
   * @param config La configuration du passage (pour calculer les contraintes de temps)
   * @returns Liste des techniques dans l'ordre strict, sélectionnées aléatoirement
   * @private
   */
  private generateAleatoirePassage(grade: string, filters: PassageFilters, config: PassageConfig): Technique[] {
    // Obtenir toutes les techniques disponibles avec les filtres
    const allTechniques = this.gradeService.getTechniquesForGrade(grade, filters);

    // Vérifier qu'il y a des techniques disponibles
    if (allTechniques.length === 0) {
      throw new Error(`Aucune technique disponible pour le grade "${grade}" avec les filtres sélectionnés.`);
    }

    // Séparer les techniques normales et les techniques d'armes
    const normalTechniques = allTechniques.filter(t => t.position !== 'Armes');
    const weaponTechniques = allTechniques.filter(t => t.position === 'Armes');

    // Calculer les contraintes de temps en visant le temps demandé
    const timeBetweenTechniques = config.timeBetweenTechniques ?? 20; // secondes
    const totalDuration = config.totalDuration ?? 10; // minutes
    const includeWeaponTime = config.includeWeaponTime ?? false;
    const weaponTime = config.includeWeaponTime ? (config.weaponTime ?? 5) : 0; // minutes
    const includeRandoriTime = config.includeRandoriTime ?? false;
    const randoriTime = config.includeRandoriTime ? (config.randoriTime ?? 3) : 0; // minutes
    
    // Calculer le temps disponible pour les techniques normales (hors armes et randori)
    const availableTimeForTechniques = totalDuration - weaponTime - randoriTime;
    const availableTimeSeconds = Math.max(60, availableTimeForTechniques * 60); // Au moins 1 minute
    
    const maxTimeForSittingPositions = availableTimeSeconds * 0.3; // 30% du temps disponible
    const maxTechniquesForSittingPositions = Math.floor(maxTimeForSittingPositions / timeBetweenTechniques);
    
    // Cible : nombre de techniques normales pour se rapprocher du temps demandé
    const estimatedNormalTechniques = Math.floor(availableTimeSeconds / timeBetweenTechniques);
    
    // Cible : nombre de techniques d'armes pour se rapprocher du temps demandé
    const estimatedWeaponTechniques = includeWeaponTime 
      ? Math.floor((weaponTime * 60) / timeBetweenTechniques)
      : 0;

    // Sélectionner les techniques normales de manière complètement aléatoire
    const selectedNormalTechniques = this.selectTechniquesRandomly(
      normalTechniques,
      estimatedNormalTechniques,
      maxTechniquesForSittingPositions
    );

    // Sélectionner les techniques d'armes si activé
    let selectedWeaponTechniques: Technique[] = [];
    if (includeWeaponTime && estimatedWeaponTechniques > 0 && weaponTechniques.length > 0) {
      // Pour les armes, pas de contrainte de 30% (maxTechniquesForSittingPositions = 0 signifie pas de limite)
      selectedWeaponTechniques = this.selectTechniquesRandomly(
        weaponTechniques,
        estimatedWeaponTechniques,
        0 // Pas de contrainte de 30% pour les armes
      );
    }

    // Combiner les techniques normales et les armes (normales d'abord, puis armes)
    return [...selectedNormalTechniques, ...selectedWeaponTechniques];
  }

  /**
   * Génère un passage en mode révision (utilise la sélection utilisateur)
   * @param grade Le grade sélectionné
   * @param filters Les filtres à appliquer
   * @param userSelection Sélection hiérarchique de l'utilisateur
   * @returns Liste des techniques sélectionnées par l'utilisateur
   * @private
   */
  private generateRevisionPassage(grade: string, filters: PassageFilters, userSelection: any): Technique[] {
    // Vérifier que le grade correspond
    if (userSelection.grade !== grade) {
      throw new Error(`Le grade de la sélection (${userSelection.grade}) ne correspond pas au grade sélectionné (${grade}).`);
    }

    const selectedTechniques: Technique[] = [];
    const usedTechniques = new Set<string>();

    // Obtenir toutes les techniques disponibles pour le grade
    const allTechniques = this.gradeService.getTechniquesForGrade(grade, filters);

    // Créer un Set pour recherche rapide
    const techniqueSet = new Set<string>();
    for (const tech of allTechniques) {
      const key = `${tech.attack}-${tech.technique}-${tech.position}`;
      techniqueSet.add(key);
    }

    // Traiter selon le mode d'affichage de la sélection
    const displayMode = userSelection.displayMode;

    if (displayMode === 'positions') {
      // Mode positions: sélectionner toutes les techniques des positions sélectionnées
      for (const position of userSelection.selectedPositions || []) {
        for (const technique of allTechniques) {
          if (technique.position === position) {
            const key = `${technique.attack}-${technique.technique}-${technique.position}`;
            if (!usedTechniques.has(key) && techniqueSet.has(key)) {
              usedTechniques.add(key);
              selectedTechniques.push({ ...technique });
            }
          }
        }
      }
    } else if (displayMode === 'positions-attacks') {
      // Mode positions-attacks: sélectionner les techniques des attaques sélectionnées
      const selectedAttacks = userSelection.selectedAttacks || {};
      for (const [position, attacks] of Object.entries(selectedAttacks)) {
        const attackList = attacks as string[];
        for (const attack of attackList) {
          for (const technique of allTechniques) {
            if (technique.position === position && technique.attack === attack) {
              const key = `${technique.attack}-${technique.technique}-${technique.position}`;
              if (!usedTechniques.has(key) && techniqueSet.has(key)) {
                usedTechniques.add(key);
                selectedTechniques.push({ ...technique });
              }
            }
          }
        }
      }
    } else {
      // Mode all: sélectionner les techniques spécifiques sélectionnées
      const selectedTechniquesMap = userSelection.selectedTechniques || {};
      for (const [key, techniques] of Object.entries(selectedTechniquesMap)) {
        // key format: "Position-Attaque"
        const [position, attack] = key.split('-');
        const techniqueList = techniques as string[];
        
        for (const techniqueName of techniqueList) {
          for (const technique of allTechniques) {
            if (
              technique.position === position &&
              technique.attack === attack &&
              technique.technique === techniqueName
            ) {
              const techKey = `${technique.attack}-${technique.technique}-${technique.position}`;
              if (!usedTechniques.has(techKey) && techniqueSet.has(techKey)) {
                usedTechniques.add(techKey);
                selectedTechniques.push({ ...technique });
              }
            }
          }
        }
      }
    }

    // Organiser les techniques selon l'ordre strict des positions
    const techniquesByPosition = this.groupTechniquesByPosition(selectedTechniques);
    const orderedTechniques: Technique[] = [];

    for (const position of this.STRICT_POSITION_ORDER) {
      const positionTechniques = techniquesByPosition.get(position);
      if (positionTechniques && positionTechniques.length > 0) {
        orderedTechniques.push(...positionTechniques);
      }
    }

    return orderedTechniques;
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
   * Extrait le nom de l'arme d'une technique d'armes
   * @param technique La technique à analyser
   * @returns Le nom de l'arme (ex: "Tanto Dori", "Jo Dori") ou null si ce n'est pas une arme
   * @private
   */
  private extractWeaponName(technique: Technique): string | null {
    if (technique.position !== 'Armes') {
      return null;
    }
    // Pour les armes, l'attaque peut être "Tanto Dori-Chudan Tsuki" ou "Jo Dori"
    if (technique.attack.includes('-')) {
      const [weapon] = technique.attack.split('-', 2);
      return weapon.trim();
    } else {
      return technique.attack.trim();
    }
  }

  /**
   * Organise les techniques par position puis par attaque
   * Structure: Map<Position, Map<Attack, Technique[]>>
   * @param techniques Liste de toutes les techniques
   * @returns Map hiérarchique Position → Attaque → Techniques[]
   * @private
   */
  private groupTechniquesByPositionAndAttack(techniques: Technique[]): Map<Position, Map<string, Technique[]>> {
    const grouped = new Map<Position, Map<string, Technique[]>>();

    // Initialiser la structure pour toutes les positions
    for (const position of this.STRICT_POSITION_ORDER) {
      grouped.set(position, new Map<string, Technique[]>());
    }

    // Grouper les techniques par position et attaque
    for (const technique of techniques) {
      const positionMap = grouped.get(technique.position);
      if (positionMap) {
        if (!positionMap.has(technique.attack)) {
          positionMap.set(technique.attack, []);
        }
        const attackTechniques = positionMap.get(technique.attack);
        if (attackTechniques) {
          attackTechniques.push(technique);
        }
      }
    }

    return grouped;
  }

  /**
   * Organise les techniques de progression par position puis par attaque
   * Préserve l'ordre de progression des techniques dans chaque attaque (facile → difficile)
   * Structure: Map<Position, Map<Attack, Technique[]>>
   * @param techniques Liste de toutes les techniques (déjà dans l'ordre de progression)
   * @returns Map hiérarchique Position → Attaque → Techniques[] (ordre de progression préservé)
   * @private
   */
  private groupProgressionTechniquesByPositionAndAttack(techniques: Technique[]): Map<Position, Map<string, Technique[]>> {
    const grouped = new Map<Position, Map<string, Technique[]>>();

    // Initialiser la structure pour toutes les positions
    for (const position of this.STRICT_POSITION_ORDER) {
      grouped.set(position, new Map<string, Technique[]>());
    }

    // Grouper les techniques par position et attaque en préservant l'ordre
    // Les techniques sont déjà dans l'ordre de progression (6e Kyū → grade sélectionné)
    for (const technique of techniques) {
      const positionMap = grouped.get(technique.position);
      if (positionMap) {
        if (!positionMap.has(technique.attack)) {
          positionMap.set(technique.attack, []);
        }
        const attackTechniques = positionMap.get(technique.attack);
        if (attackTechniques) {
          // Vérifier qu'on n'ajoute pas de doublon (sécurité supplémentaire)
          const key = `${technique.attack}-${technique.technique}-${technique.position}`;
          const alreadyExists = attackTechniques.some(t => 
            `${t.attack}-${t.technique}-${t.position}` === key
          );
          if (!alreadyExists) {
            attackTechniques.push(technique);
          }
        }
      }
    }

    return grouped;
  }

  /**
   * Sélectionne les techniques dans l'ordre hiérarchique strict : Position → Attaque → Techniques
   * Respecte la contrainte de 30% pour les positions assises
   * Ne revient jamais en arrière sur une position ou une attaque déjà traitée
   * Mélange aléatoirement l'ordre des attaques et ajoute un facteur aléatoire pour la distribution du temps
   * @param techniquesByPositionAndAttack Techniques organisées par Position → Attaque → Techniques[]
   * @param estimatedTotalTechniques Nombre total estimé de techniques pour le passage
   * @param maxTechniquesForSittingPositions Maximum de techniques pour Suwariwaza + Hanmi Handachi Waza
   * @param shuffle Si true, mélange aléatoirement les techniques de chaque attaque
   * @returns Liste des techniques dans l'ordre hiérarchique strict
   * @private
   */
  private selectTechniquesInHierarchicalOrder(
    techniquesByPositionAndAttack: Map<Position, Map<string, Technique[]>>,
    estimatedTotalTechniques: number,
    maxTechniquesForSittingPositions: number,
    shuffle: boolean
  ): Technique[] {
    const selectedTechniques: Technique[] = [];
    const usedTechniques = new Set<string>(); // Pour éviter les doublons
    const usedWeapons = new Set<string>(); // Pour suivre les armes déjà utilisées (une fois utilisée, on ne revient plus dessus)
    let sittingPositionsCount = 0; // Compteur pour Suwariwaza + Hanmi Handachi Waza
    let totalSelected = 0; // Compteur total de techniques sélectionnées

    // Compter le nombre total d'attaques pour distribuer le temps
    let totalAttacks = 0;
    const attacksByPosition = new Map<Position, string[]>();
    for (const position of this.STRICT_POSITION_ORDER) {
      const positionMap = techniquesByPositionAndAttack.get(position);
      if (positionMap && positionMap.size > 0) {
        const attacks = Array.from(positionMap.keys());
        attacksByPosition.set(position, attacks);
        totalAttacks += attacks.length;
      }
    }

    // Calculer le nombre moyen de techniques par attaque (base)
    const avgTechniquesPerAttack = totalAttacks > 0 
      ? Math.max(1, Math.floor(estimatedTotalTechniques / totalAttacks))
      : 1;

    // Facteur de variation aléatoire pour la distribution du temps (±30% par défaut)
    const variationFactor = 0.3; // 30% de variation

    // Parcourir les positions dans l'ordre strict (pas de retour en arrière)
    for (const position of this.STRICT_POSITION_ORDER) {
      const positionMap = techniquesByPositionAndAttack.get(position);
      
      if (!positionMap || positionMap.size === 0) {
        continue; // Passer à la position suivante si aucune attaque disponible
      }

      const isSittingPosition = position === 'Suwariwaza' || position === 'Hanmi Handachi';

      // Vérifier la contrainte de 30% pour les positions assises
      if (isSittingPosition && sittingPositionsCount >= maxTechniquesForSittingPositions) {
        continue; // Passer à la position suivante si la limite est atteinte
      }

      // Obtenir les attaques pour cette position
      // Mélanger les attaques seulement si shuffle est true (mode aléatoire)
      const attacks = attacksByPosition.get(position) || [];
      const shuffledAttacks = shuffle ? this.shuffleArray([...attacks]) : [...attacks];

      // Calculer le temps disponible pour cette position
      // Règle : maximum 30% pour Suwariwaza + Hanmi Handachi Waza, minimum 70% pour Tachiwaza
      const remainingTechniques = estimatedTotalTechniques - totalSelected;
      
      let techniquesForThisPosition: number;
      if (isSittingPosition) {
        // Pour les positions assises : utiliser le minimum entre le quota restant (30%) et le temps total restant
        const remainingSittingTechniques = maxTechniquesForSittingPositions - sittingPositionsCount;
        techniquesForThisPosition = Math.min(remainingSittingTechniques, remainingTechniques);
      } else {
        // Pour Tachiwaza : garantir qu'on utilise au moins 70% du temps total
        // Calculer le minimum garanti pour Tachiwaza (70% du temps total = total - 30%)
        const minTechniquesForTachiwaza = estimatedTotalTechniques - maxTechniquesForSittingPositions;
        // Le temps disponible pour Tachiwaza est le maximum entre :
        // - Le temps restant actuel (ce qui reste après toutes les sélections précédentes)
        // - Le minimum garanti moins ce qui a déjà été sélectionné pour Tachiwaza (0 pour l'instant)
        // Cela garantit qu'on aura au moins 70% du temps pour Tachiwaza
        const alreadySelectedForTachiwaza = totalSelected - sittingPositionsCount;
        const guaranteedRemaining = minTechniquesForTachiwaza - alreadySelectedForTachiwaza;
        techniquesForThisPosition = Math.max(remainingTechniques, guaranteedRemaining, 0); // Au moins 0
      }

      // Parcourir les attaques dans l'ordre mélangé (pas de retour en arrière)
      let positionTechniquesSelected = 0;
      for (const attack of shuffledAttacks) {
        const attackTechniques = positionMap.get(attack);
        
        if (!attackTechniques || attackTechniques.length === 0) {
          continue; // Passer à l'attaque suivante si aucune technique disponible
        }

        // Vérifier la contrainte de 30% pour les positions assises
        if (isSittingPosition && sittingPositionsCount >= maxTechniquesForSittingPositions) {
          break; // Arrêter cette position si la limite est atteinte
        }

        // Vérifier si on a encore du temps pour cette position
        if (positionTechniquesSelected >= techniquesForThisPosition) {
          break; // Arrêter cette position si on a utilisé tout le temps alloué
        }

        // Préparer les techniques pour cette attaque
        // Pour les modes classique et aléatoire, toujours mélanger les techniques au sein de chaque attaque
        let techniquesToSelect = this.shuffleArray([...attackTechniques]);

        // Calculer le nombre de techniques à sélectionner pour cette attaque
        // avec un facteur aléatoire de variation
        const remainingAttacksInPosition = shuffledAttacks.length - shuffledAttacks.indexOf(attack);
        const remainingTechniquesInPosition = techniquesForThisPosition - positionTechniquesSelected;
        
        // Objectif : minimum de 2 techniques par attaque pour la génération du passage
        const minTechniquesPerAttack = 2;
        
        // Calculer le maximum disponible pour cette attaque
        let maxAvailableForThisAttack: number;
        if (isSittingPosition) {
          maxAvailableForThisAttack = Math.min(
            remainingTechniquesInPosition,
            maxTechniquesForSittingPositions - sittingPositionsCount
          );
        } else {
          // Pour Tachiwaza, utiliser le temps restant après les positions assises
          maxAvailableForThisAttack = Math.min(
            remainingTechniquesInPosition,
            estimatedTotalTechniques - totalSelected
          );
        }
        
        // Si on n'a pas assez de temps ou de techniques pour faire au moins 1 technique, on saute cette attaque
        // (ce n'est pas grave de ne pas faire toutes les attaques)
        if (maxAvailableForThisAttack < 1 || techniquesToSelect.length < 1) {
          continue; // Passer à l'attaque suivante
        }
        
        // Base : nombre moyen de techniques par attaque
        // On vise au moins 2 techniques par attaque, mais on peut en prendre moins si nécessaire
        let techniquesForThisAttack = Math.floor(remainingTechniquesInPosition / remainingAttacksInPosition);
        
        // Si on a assez de temps et de techniques, viser au moins 2 techniques
        if (maxAvailableForThisAttack >= minTechniquesPerAttack && techniquesToSelect.length >= minTechniquesPerAttack) {
          techniquesForThisAttack = Math.max(minTechniquesPerAttack, techniquesForThisAttack);
        }
        
        // Ajouter un facteur aléatoire de variation (±variationFactor)
        const randomVariation = 1 + (Math.random() * 2 - 1) * variationFactor; // Entre 0.7 et 1.3
        techniquesForThisAttack = Math.floor(techniquesForThisAttack * randomVariation);
        
        // Limiter au nombre de techniques disponibles et au temps restant
        techniquesForThisAttack = Math.min(
          techniquesForThisAttack,
          techniquesToSelect.length,
          maxAvailableForThisAttack
        );
        
        // S'assurer qu'on a au moins 1 technique (minimum absolu)
        techniquesForThisAttack = Math.max(1, techniquesForThisAttack);

        // Sélectionner les techniques pour cette attaque
        let selectedForThisAttack = 0;
        for (const technique of techniquesToSelect) {
          // Vérifier la contrainte de 30% pour les positions assises
          if (isSittingPosition && sittingPositionsCount >= maxTechniquesForSittingPositions) {
            break; // Arrêter si la limite est atteinte
          }

          // Vérifier le temps restant pour cette position
          if (positionTechniquesSelected >= techniquesForThisPosition) {
            break; // Arrêter si on a utilisé tout le temps alloué à cette position
          }

          // Vérifier le nombre maximum pour cette attaque
          if (selectedForThisAttack >= techniquesForThisAttack) {
            break; // Arrêter cette attaque si on a sélectionné assez
          }

          const key = `${technique.attack}-${technique.technique}-${technique.position}`;
          if (!usedTechniques.has(key)) {
            usedTechniques.add(key);
            selectedTechniques.push({ ...technique });
            totalSelected++;
            selectedForThisAttack++;
            positionTechniquesSelected++;
            if (isSittingPosition) {
              sittingPositionsCount++;
            }
          }
        }
      }
    }

    return selectedTechniques;
  }

  /**
   * Sélectionne les techniques de manière complètement aléatoire
   * Règles : 
   * - Pas de doublon (position + attaque + technique)
   * - 30% max du temps pour Suwariwaza + Hanmi Handachi Waza
   * Permet de revenir sur des positions/attaques déjà vues avec des techniques différentes
   * @param allTechniques Toutes les techniques disponibles
   * @param estimatedTotalTechniques Nombre estimé de techniques à sélectionner
   * @param maxTechniquesForSittingPositions Maximum de techniques pour les positions assises
   * @returns Liste des techniques sélectionnées dans un ordre aléatoire
   * @private
   */
  private selectTechniquesRandomly(
    allTechniques: Technique[],
    estimatedTotalTechniques: number,
    maxTechniquesForSittingPositions: number
  ): Technique[] {
    const selectedTechniques: Technique[] = [];
    const usedTechniques = new Set<string>(); // Règle 1: Éviter les doublons (position + attaque + technique)
    const usedWeapons = new Set<string>(); // Règle spéciale: Une fois qu'une arme est utilisée, on ne revient plus dessus
    let sittingPositionsCount = 0; // Compteur pour la règle 2: 30% max pour Suwariwaza + Hanmi Handachi Waza
    let totalSelected = 0;

    // Filtrer les techniques disponibles (exclure celles déjà utilisées et celles qui violeraient la contrainte de 30%)
    const getAvailableTechniques = (): Technique[] => {
      return allTechniques.filter(technique => {
        const key = `${technique.attack}-${technique.technique}-${technique.position}`;

        // Règle 1: Pas de doublon
        if (usedTechniques.has(key)) {
          return false;
        }

        // Règle spéciale: Pour les armes, vérifier si l'arme a déjà été utilisée
        const weaponName = this.extractWeaponName(technique);
        if (weaponName && usedWeapons.has(weaponName)) {
          return false; // Ignorer les techniques d'armes déjà utilisées
        }

        // Règle 2: Contrainte de 30% pour les positions assises
        const isSittingPosition = technique.position === 'Suwariwaza' || technique.position === 'Hanmi Handachi';
        if (isSittingPosition && sittingPositionsCount >= maxTechniquesForSittingPositions) {
          return false;
        }

        return true;
      });
    };

    // Sélectionner les techniques aléatoirement jusqu'à atteindre le nombre estimé
    while (totalSelected < estimatedTotalTechniques) {
      // Obtenir les techniques disponibles (filtrées selon les règles)
      const availableTechniques = getAvailableTechniques();
      
      // Si plus aucune technique disponible, arrêter
      if (availableTechniques.length === 0) {
        break;
      }

      // Mélanger et sélectionner une technique aléatoirement
      const shuffled = this.shuffleArray([...availableTechniques]);
      const selectedTechnique = shuffled[0];
      
      // Ajouter la technique
      const key = `${selectedTechnique.attack}-${selectedTechnique.technique}-${selectedTechnique.position}`;
      usedTechniques.add(key);
      
      // Si c'est une arme, la marquer comme utilisée (on ne reviendra plus dessus)
      const weaponName = this.extractWeaponName(selectedTechnique);
      if (weaponName) {
        usedWeapons.add(weaponName);
      }
      
      selectedTechniques.push({ ...selectedTechnique });
      totalSelected++;
      
      // Mettre à jour le compteur pour les positions assises
      const isSittingPosition = selectedTechnique.position === 'Suwariwaza' || selectedTechnique.position === 'Hanmi Handachi';
      if (isSittingPosition) {
        sittingPositionsCount++;
      }
    }

    return selectedTechniques;
  }

  /**
   * Sélectionne les techniques en mode progression avec sélection aléatoire dans l'ordre
   * Pour chaque attaque : choisit un point de départ aléatoire, puis continue dans l'ordre de progression
   * Exemple : ["Ikkyo", "Shihonage", "Kote Gaeshi", "Irimi Nage", ...]
   * Peut commencer à "Irimi Nage" et continuer : ["Irimi Nage", "Kaiten Nage", "Uchi Kaiten Nage", ...]
   * @param techniquesByPositionAndAttack Techniques organisées par Position → Attaque → Techniques[]
   * @param estimatedTotalTechniques Nombre estimé de techniques à sélectionner
   * @param maxTechniquesForSittingPositions Maximum de techniques pour les positions assises
   * @returns Liste des techniques sélectionnées
   * @private
   */
  private selectTechniquesInProgressionOrder(
    techniquesByPositionAndAttack: Map<Position, Map<string, Technique[]>>,
    estimatedTotalTechniques: number,
    maxTechniquesForSittingPositions: number
  ): Technique[] {
    const selectedTechniques: Technique[] = [];
    const usedTechniques = new Set<string>(); // Pour éviter les doublons
    let sittingPositionsCount = 0;
    let totalSelected = 0;

    // Compter le nombre total d'attaques pour distribuer le temps
    let totalAttacks = 0;
    const attacksByPosition = new Map<Position, string[]>();
    for (const position of this.STRICT_POSITION_ORDER) {
      const positionMap = techniquesByPositionAndAttack.get(position);
      if (positionMap && positionMap.size > 0) {
        const attacks = Array.from(positionMap.keys());
        attacksByPosition.set(position, attacks);
        totalAttacks += attacks.length;
      }
    }

    // Facteur de variation aléatoire pour la distribution du temps (±30% par défaut)
    const variationFactor = 0.3;

    // Parcourir les positions dans l'ordre strict
    for (const position of this.STRICT_POSITION_ORDER) {
      const positionMap = techniquesByPositionAndAttack.get(position);
      
      if (!positionMap || positionMap.size === 0) {
        continue;
      }

      const isSittingPosition = position === 'Suwariwaza' || position === 'Hanmi Handachi';

      // Vérifier la contrainte de 30% pour les positions assises
      if (isSittingPosition && sittingPositionsCount >= maxTechniquesForSittingPositions) {
        continue;
      }

      // Mélanger les attaques aléatoirement
      const attacks = attacksByPosition.get(position) || [];
      const shuffledAttacks = this.shuffleArray([...attacks]);

      // Calculer le temps disponible pour cette position
      const remainingTechniques = estimatedTotalTechniques - totalSelected;
      const remainingSittingTechniques = isSittingPosition 
        ? maxTechniquesForSittingPositions - sittingPositionsCount
        : remainingTechniques;
      
      const techniquesForThisPosition = isSittingPosition
        ? Math.min(remainingSittingTechniques, remainingTechniques)
        : remainingTechniques;

      // Parcourir les attaques mélangées
      let positionTechniquesSelected = 0;
      for (const attack of shuffledAttacks) {
        const attackTechniques = positionMap.get(attack);
        
        if (!attackTechniques || attackTechniques.length === 0) {
          continue;
        }

        // Vérifier la contrainte de 30% pour les positions assises
        if (isSittingPosition && sittingPositionsCount >= maxTechniquesForSittingPositions) {
          break;
        }

        // Vérifier si on a encore du temps pour cette position
        if (positionTechniquesSelected >= techniquesForThisPosition) {
          break;
        }

        // Sélection aléatoire d'un point de départ dans l'ordre de progression
        // Puis continuation dans l'ordre à partir de ce point
        const startIndex = Math.floor(Math.random() * attackTechniques.length);
        const orderedTechniques = [...attackTechniques]; // Liste déjà dans l'ordre de progression
        
        // Créer une liste qui commence au point de départ et continue dans l'ordre
        const techniquesFromStart = [
          ...orderedTechniques.slice(startIndex), // De startIndex à la fin
          ...orderedTechniques.slice(0, startIndex) // Puis du début à startIndex
        ];

        // Calculer le nombre de techniques à sélectionner pour cette attaque
        const remainingAttacksInPosition = shuffledAttacks.length - shuffledAttacks.indexOf(attack);
        const remainingTechniquesInPosition = techniquesForThisPosition - positionTechniquesSelected;
        
        const minTechniquesPerAttack = 2;
        const maxAvailableForThisAttack = Math.min(
          remainingTechniquesInPosition,
          isSittingPosition 
            ? maxTechniquesForSittingPositions - sittingPositionsCount
            : estimatedTotalTechniques - totalSelected
        );
        
        if (maxAvailableForThisAttack < 1 || techniquesFromStart.length < 1) {
          continue;
        }
        
        let techniquesForThisAttack = Math.floor(remainingTechniquesInPosition / remainingAttacksInPosition);
        
        if (maxAvailableForThisAttack >= minTechniquesPerAttack && techniquesFromStart.length >= minTechniquesPerAttack) {
          techniquesForThisAttack = Math.max(minTechniquesPerAttack, techniquesForThisAttack);
        }
        
        const randomVariation = 1 + (Math.random() * 2 - 1) * variationFactor;
        techniquesForThisAttack = Math.floor(techniquesForThisAttack * randomVariation);
        
        techniquesForThisAttack = Math.min(
          techniquesForThisAttack,
          techniquesFromStart.length,
          maxAvailableForThisAttack
        );
        
        techniquesForThisAttack = Math.max(1, techniquesForThisAttack);

        // Sélectionner les techniques dans l'ordre à partir du point de départ
        let selectedForThisAttack = 0;
        for (const technique of techniquesFromStart) {
          if (isSittingPosition && sittingPositionsCount >= maxTechniquesForSittingPositions) {
            break;
          }

          if (positionTechniquesSelected >= techniquesForThisPosition) {
            break;
          }

          if (selectedForThisAttack >= techniquesForThisAttack) {
            break;
          }

          const key = `${technique.attack}-${technique.technique}-${technique.position}`;
          if (!usedTechniques.has(key)) {
            usedTechniques.add(key);
            selectedTechniques.push({ ...technique });
            totalSelected++;
            selectedForThisAttack++;
            positionTechniquesSelected++;
            if (isSittingPosition) {
              sittingPositionsCount++;
            }
          }
        }
      }
    }

    return selectedTechniques;
  }

  /**
   * Compte le nombre d'attaques restantes à partir d'une position et attaque données
   * @param techniquesByPositionAndAttack Techniques organisées par Position → Attaque → Techniques[]
   * @param currentPosition Position actuelle
   * @param currentAttack Attaque actuelle
   * @returns Nombre d'attaques restantes
   * @private
   */
  private countRemainingAttacks(
    techniquesByPositionAndAttack: Map<Position, Map<string, Technique[]>>,
    currentPosition: Position,
    currentAttack: string
  ): number {
    let count = 0;
    let foundCurrent = false;

    for (const position of this.STRICT_POSITION_ORDER) {
      const positionMap = techniquesByPositionAndAttack.get(position);
      if (!positionMap || positionMap.size === 0) {
        continue;
      }

      const attacks = Array.from(positionMap.keys());
      
      for (const attack of attacks) {
        if (position === currentPosition && attack === currentAttack) {
          foundCurrent = true;
          continue; // Ne pas compter l'attaque actuelle
        }
        
        if (foundCurrent || position !== currentPosition) {
          const attackTechniques = positionMap.get(attack);
          if (attackTechniques && attackTechniques.length > 0) {
            count++;
          }
        }
      }
    }

    return count;
  }

  /**
   * Réorganise les techniques selon l'ordre strict et assure l'unicité
   * Applique la contrainte de 30% pour Suwariwaza + Hanmi Handachi Waza si config est fourni
   * @param techniquesByPosition Techniques groupées par position
   * @param filters Filtres appliqués
   * @param config Configuration du passage (optionnel, pour appliquer la contrainte de 30%)
   * @returns Liste des techniques dans l'ordre strict, sans doublons
   * @private
   */
  private selectRandomTechniques(
    techniquesByPosition: Map<Position, Technique[]>,
    filters: PassageFilters,
    config?: PassageConfig
  ): Technique[] {
    const orderedTechniques: Technique[] = [];
    const usedTechniques = new Set<string>(); // Pour éviter les doublons (clé: "attack-technique-position")

    // Calculer la contrainte de 30% pour Suwariwaza + Hanmi Handachi Waza si config est fourni
    let maxTechniquesForSittingPositions: number | null = null;
    let sittingPositionsCount = 0;

    if (config) {
      const timeBetweenTechniques = config.timeBetweenTechniques ?? 20; // secondes
      const totalDuration = config.totalDuration ?? 10; // minutes
      const totalTimeSeconds = totalDuration * 60; // convertir en secondes
      const maxTimeForSittingPositions = totalTimeSeconds * 0.3; // 30% du temps total
      maxTechniquesForSittingPositions = Math.floor(maxTimeForSittingPositions / timeBetweenTechniques);
    }

    // Parcourir les positions dans l'ordre strict
    for (const position of this.STRICT_POSITION_ORDER) {
      const positionTechniques = techniquesByPosition.get(position);

      if (!positionTechniques || positionTechniques.length === 0) {
        continue; // Passer à la position suivante si aucune technique disponible
      }

      // Vérifier si on est dans les positions assises (Suwariwaza ou Hanmi Handachi)
      const isSittingPosition = position === 'Suwariwaza' || position === 'Hanmi Handachi';

      // Mélanger aléatoirement les techniques de cette position (Fisher-Yates shuffle)
      const shuffledTechniques = this.shuffleArray([...positionTechniques]);

      // Ajouter les techniques uniques dans l'ordre
      for (const technique of shuffledTechniques) {
        // Appliquer la contrainte de 30% pour les positions assises
        if (isSittingPosition && maxTechniquesForSittingPositions !== null && 
            sittingPositionsCount >= maxTechniquesForSittingPositions) {
          break; // Arrêter d'ajouter des techniques pour ces positions
        }

        const key = `${technique.attack}-${technique.technique}-${technique.position}`;
        if (!usedTechniques.has(key)) {
          usedTechniques.add(key);
          orderedTechniques.push({ ...technique }); // Copie pour éviter mutation
          if (isSittingPosition) {
            sittingPositionsCount++;
          }
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
   * @param skip Si true, ajoute le temps entre techniques (skip manuel). Si false, utilise le temps déjà compté par le timer (passage automatique).
   */
  nextTechnique(skip: boolean = false): void {
    const currentState = this.passageState$.value;
    if (!currentState.currentPassage) {
      return;
    }

    const totalTechniques = this.getTotalTechniques();
    const currentIndex = currentState.currentTechniqueIndex;
    const timeBetweenTechniques = currentState.currentPassage.timeBetweenTechniques || 20;
    
    // Vérifier si on est déjà à la dernière technique
    if (currentIndex >= totalTechniques - 1) {
      // On est déjà à la dernière technique, le passage est terminé
      this.stopTimer();
      
      // Calculer la progression finale
      const finalProgress = 100;
      
      // Calculer le nouveau temps écoulé
      let newElapsedTime: number;
      if (skip) {
        // Skip manuel : mettre le temps au début de la technique suivante (qui n'existe pas, donc fin du passage)
        // Le temps devrait être : (totalTechniques) * timeBetweenTechniques
        newElapsedTime = totalTechniques * timeBetweenTechniques;
      } else {
        // Passage automatique : le timer a déjà compté le temps, on utilise le temps actuel
        newElapsedTime = currentState.elapsedTime;
      }
      
      // Mettre currentTechniqueIndex à totalTechniques pour déclencher la condition de fin
      this.updateState({
        isPlaying: false,
        isPaused: false,
        currentTechniqueIndex: totalTechniques, // Mettre à totalTechniques pour déclencher isPassageCompleted
        elapsedTime: newElapsedTime,
        progress: finalProgress
      });

      // Marquer le passage comme complété
      if (currentState.currentPassage) {
        currentState.currentPassage.completedAt = new Date();
      }
      return;
    }

    // Passer à la technique suivante
    const nextIndex = currentIndex + 1;

    // Calculer le nouveau temps écoulé
    let newElapsedTime: number;
    if (skip) {
      // Skip manuel : mettre le timer au temps où la technique suivante aurait dû commencer
      // Le temps devrait être : (nextIndex) * timeBetweenTechniques
      newElapsedTime = nextIndex * timeBetweenTechniques;
      // Redémarrer le timer pour synchroniser avec le nouveau temps
      // Cela évite que la première seconde après le skip passe trop vite
      this.stopTimer();
      this.startTimer();
    } else {
      // Passage automatique : le timer a déjà compté le temps, on utilise le temps actuel
      newElapsedTime = currentState.elapsedTime;
    }

    // Passer à la technique suivante
    const newProgress = (nextIndex / totalTechniques) * 100;
    this.updateState({
      currentTechniqueIndex: nextIndex,
      elapsedTime: newElapsedTime,
      progress: newProgress
    });
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
