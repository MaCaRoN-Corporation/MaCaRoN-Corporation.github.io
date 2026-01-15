import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, AfterViewChecked, HostListener, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { Subscription, combineLatest, take, switchMap } from 'rxjs';
import { PassageService } from '../../services/passage.service';
import { PassageState, PassageConfig as ServicePassageConfig } from '../../models/passage.model';
import { Technique } from '../../models/technique.model';
import { Position } from '../../models/position.model';
import { ConfigService } from '../../services/config.service';
import { DEFAULT_PASSAGE_CONFIG, PassageConfig } from '../../models/passage-config.model';
import { SettingsService } from '../../services/settings.service';
import { PassageFilters } from '../../models/passage-filters.model';
import { GradeService } from '../../services/grade.service';
import { AudioService } from '../../services/audio.service';

/**
 * Composant pour afficher et gérer l'exécution d'un passage de grade
 */
@Component({
  selector: 'app-passage',
  imports: [CommonModule],
  templateUrl: './passage.html',
  styleUrl: './passage.scss',
  animations: [
    trigger('countdownPulse', [
      transition('* => *', [
        animate(
          '{{duration}}s ease-out',
          keyframes([
            style({ transform: 'scale(1)', boxShadow: '0 0 0 rgba(0, 0, 0, 0)', offset: 0 }),
            style({ transform: 'scale(0.95)', boxShadow: '0 0 12px rgba(0, 0, 0, 0.12)', offset: 0.6 }),
            style({ transform: 'scale(1)', boxShadow: '0 0 0 rgba(0, 0, 0, 0)', offset: 1 })
          ])
        )
      ], { params: { duration: 1 } })
    ])
  ]
})
export class PassageComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {
  private subscriptions = new Subscription();
  private previousHistoryLength = 0;
  private countdownInterval: ReturnType<typeof setInterval> | null = null;
  private countdownTimeout: ReturnType<typeof setTimeout> | null = null;
  private lastTechniqueIndex: number | null = null;
  private confettiAnimationId: number | null = null;
  configuredCountdownSeconds = DEFAULT_PASSAGE_CONFIG.timeBetweenTechniques ?? 20; // Public pour le template

  @ViewChild('historyElement') historyElement?: ElementRef<HTMLElement>;
  @ViewChild('confettiCanvas') confettiCanvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('topBanner') topBanner?: ElementRef<HTMLElement>;
  
  // État du passage
  elapsedTime: number = 0;
  remainingTime: number = 0; // Temps restant (compte à rebours)
  totalPassageDuration: number = 0; // Durée totale du passage en secondes
  isPaused: boolean = false;
  currentState: PassageState | null = null;
  randoriTime: number = 3; // Temps du randori en minutes (depuis la config)
  private techniqueStartTime: number = 0; // Temps écoulé au début de la technique actuelle
  
  // État pour l'indicateur de scroll
  isScrollAtBottom = false;
  hasScroll = false;

  // État de fin de passage
  isPassageCompleted = false;
  showEndScreen = false; // Contrôle l'affichage de l'écran de fin
  passageSummary: {
    totalTechniques: number;
    duration: number;
    includeRandori: boolean;
  } | null = null;

  // Données dynamiques du passage
  countdown: number = 0; // Compte a rebours (secondes restantes)
  countdownAnimationToken = 0;
  countdownAnimationDuration = 1;
  currentTechnique: Technique | null = null;
  currentProgress: number = 0; // Technique actuelle
  totalTechniques: number = 0; // Total de techniques
  progressPercentage: number = 0; // Pourcentage de progression (0-100)
  
  // Historique des techniques déjà exécutées
  history: Technique[] = [];

  // Voix actuelle pour l'audio
  private currentVoiceId: string = 'French_Male1'; // Valeur par défaut

  // État d'erreur
  hasError = false;
  errorMessage: string | null = null;

  constructor(
    private passageService: PassageService,
    private configService: ConfigService,
    private settingsService: SettingsService,
    private gradeService: GradeService,
    private audioService: AudioService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Charger la nomenclature d'abord, puis la configuration et générer le passage
    this.subscriptions.add(
      this.gradeService.loadNomenclature().pipe(
        switchMap(() => combineLatest([
          this.configService.getConfig(),
          this.settingsService.getSettings()
        ])),
        take(1)
      ).subscribe({
        next: ([config, settings]) => {
          try {
            const timeBetween = config.timeBetweenTechniques ?? DEFAULT_PASSAGE_CONFIG.timeBetweenTechniques ?? 20;
            this.configuredCountdownSeconds = Math.max(1, Math.floor(timeBetween));

            // Stocker la voix actuelle
            this.currentVoiceId = settings.voice || 'French_Male1';
            console.log('[PassageComponent] Voice ID:', this.currentVoiceId);

          // Réinitialiser l'état de comparaison audio pour le nouveau passage
          try {
            this.audioService.resetComparisonState();
            console.log('[PassageComponent] Audio comparison state reset successfully');
          } catch (error) {
            console.warn('[PassageComponent] Error resetting audio comparison state:', error);
            // Continuer même si la réinitialisation échoue
          }

            // Générer et démarrer le passage
            this.generateAndStartPassage(config, settings.voice);
          } catch (error) {
            console.error('[PassageComponent] Error in next handler:', error);
            // Ne pas rediriger automatiquement, laisser l'erreur remonter
            throw error;
          }
        },
        error: (error) => {
          console.error('[PassageComponent] Error loading data:', error);
          // Rediriger vers la page d'accueil en cas d'erreur de chargement
          this.router.navigate(['/']);
        }
      })
    );

    // Souscrire aux changements de configuration pour le temps entre techniques
    this.subscriptions.add(
      this.configService.getConfig().subscribe((config) => {
        const timeBetween = config.timeBetweenTechniques ?? DEFAULT_PASSAGE_CONFIG.timeBetweenTechniques ?? 20;
        this.configuredCountdownSeconds = Math.max(1, Math.floor(timeBetween));
      })
    );

    // Souscrire a l'etat du passage
    this.subscriptions.add(
      this.passageService.getPassageState().subscribe((state: PassageState) => {
        this.handlePassageState(state);
      })
    );

    // Souscrire aux changements de voix pour mettre à jour currentVoiceId
    this.subscriptions.add(
      this.settingsService.getSettings().subscribe((settings) => {
        this.currentVoiceId = settings.voice || 'French_Male1';
      })
    );
  }

  /**
   * Génère et démarre un passage selon la configuration
   * @param config Configuration du passage (depuis ConfigService)
   * @param voice Voix sélectionnée (depuis SettingsService)
   * @private
   */
  private generateAndStartPassage(config: PassageConfig, voice: string): void {
    try {
      // Préparer les filtres
      const filters: PassageFilters = {
        positions: config.filters?.positions || [],
        attacks: config.filters?.attacks || [],
        techniques: config.filters?.techniques || [],
        includeWeapons: config.filters?.includeWeapons || config.includeWeaponTime || false,
        includeRandori: config.filters?.includeRandori || config.includeRandoriTime || false
      };

      // Préparer la configuration pour le service (interface différente)
      const serviceConfig: ServicePassageConfig = {
        duration: config.totalDuration ?? DEFAULT_PASSAGE_CONFIG.totalDuration ?? 10,
        timeBetweenTechniques: config.timeBetweenTechniques ?? DEFAULT_PASSAGE_CONFIG.timeBetweenTechniques ?? 20,
        voice: voice as any // VoiceId est un string
      };

      // Préparer la configuration complète pour la génération (avec passageMode et voice)
      const fullConfig: PassageConfig = {
        selectedGrade: config.selectedGrade,
        filters: filters,
        passageMode: config.passageMode || 'aleatoire',
        voice: voice,
        timeBetweenTechniques: config.timeBetweenTechniques ?? DEFAULT_PASSAGE_CONFIG.timeBetweenTechniques ?? 20,
        totalDuration: config.totalDuration ?? DEFAULT_PASSAGE_CONFIG.totalDuration ?? 10,
        weaponTime: config.weaponTime ?? DEFAULT_PASSAGE_CONFIG.weaponTime ?? 5,
        includeWeaponTime: config.includeWeaponTime ?? false,
        includeRandoriTime: config.includeRandoriTime ?? false,
        randoriTime: config.randoriTime ?? DEFAULT_PASSAGE_CONFIG.randoriTime ?? 3
      };

      // Charger la sélection utilisateur si mode révision
      let userSelection: any = null;
      if (fullConfig.passageMode === 'revision') {
        try {
          const key = `technique-filter-selection-${config.selectedGrade}`;
          const stored = localStorage.getItem(key);
          if (stored) {
            userSelection = JSON.parse(stored);
            // Vérifier que le grade correspond
            if (userSelection.grade !== config.selectedGrade) {
              console.warn('[PassageComponent] Grade mismatch in user selection, falling back to aleatoire mode');
              fullConfig.passageMode = 'aleatoire';
              userSelection = null;
            }
          } else {
            console.warn('[PassageComponent] No user selection found for revision mode, falling back to aleatoire mode');
            fullConfig.passageMode = 'aleatoire';
          }
        } catch (error) {
          console.error('[PassageComponent] Error loading user selection:', error);
          fullConfig.passageMode = 'aleatoire';
        }
      }

      // Générer le passage (le service attend PassageConfig avec passageMode)
      console.log('[PassageComponent] Generating passage with:', {
        grade: config.selectedGrade,
        mode: fullConfig.passageMode,
        filters
      });
      
      // Réinitialiser l'état d'erreur
      this.hasError = false;
      this.errorMessage = null;
      
      // Stocker randoriTime pour les calculs de temps
      this.randoriTime = fullConfig.randoriTime ?? DEFAULT_PASSAGE_CONFIG.randoriTime ?? 2;
      
      const passage = this.passageService.generatePassage(
        config.selectedGrade,
        filters,
        fullConfig,
        userSelection
      );

      console.log('[PassageComponent] Passage généré:', {
        totalTechniques: passage.techniques.length,
        mode: fullConfig.passageMode,
        firstTechnique: passage.techniques[0] || null
      });

      // Initialiser totalTechniques immédiatement pour éviter l'affichage "0/X"
      this.totalTechniques = passage.techniques.length;
      this.currentProgress = 0;
      this.progressPercentage = 0;

      // Démarrer le passage
      this.passageService.startPassage(passage);
      
      console.log('[PassageComponent] Passage démarré');
    } catch (error) {
      console.error('[PassageComponent] Error generating passage:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('[PassageComponent] Error details:', {
        message: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
        error
      });
      
      // Afficher l'erreur à l'utilisateur au lieu de rediriger
      this.hasError = true;
      
      // Améliorer le message d'erreur pour qu'il soit plus informatif
      if (errorMessage.includes('Aucune technique disponible')) {
        this.errorMessage = `Aucune technique disponible pour le grade "${config.selectedGrade}" avec les filtres sélectionnés.\n\nVeuillez ajuster vos filtres dans la page de configuration ou sélectionner un autre grade.`;
      } else {
        this.errorMessage = errorMessage;
      }
      
      this.cdr.detectChanges();
      
      // Ne pas rediriger automatiquement, laisser l'utilisateur voir l'erreur
      // et décider de retourner à la page d'accueil
    }
  }

  ngAfterViewInit(): void {
    // Vérifier le scroll après l'initialisation de la vue
    setTimeout(() => {
      this.checkScroll();
      this.previousHistoryLength = this.history.length;
    }, 100);
  }

  ngAfterViewChecked(): void {
    // Vérifier le scroll si la liste historique a changé
    if (this.history.length !== this.previousHistoryLength) {
      setTimeout(() => {
        this.checkScroll();
        this.previousHistoryLength = this.history.length;
      }, 0);
    }
  }

  ngOnDestroy(): void {
    // Nettoyer les subscriptions
    this.subscriptions.unsubscribe();
    this.stopCountdown();
    this.stopConfetti();
    // Arrêter tous les audios en cours
    this.audioService.stopAudio();
  }

  /**
   * Vérifie si un scroll est nécessaire dans l'historique
   */
  checkScroll(): void {
    if (!this.historyElement?.nativeElement) {
      this.hasScroll = false;
      return;
    }

    const element = this.historyElement.nativeElement;
    this.hasScroll = element.scrollHeight > element.clientHeight;
  }

  /**
   * Gère l'événement de scroll dans l'historique
   */
  onHistoryScroll(): void {
    if (!this.historyElement?.nativeElement) {
      return;
    }

    const element = this.historyElement.nativeElement;
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;
    
    // Vérifier si un scroll est nécessaire
    const needsScroll = scrollHeight > clientHeight;
    
    // Vérifier si on est près du bas (tolérance de 5px)
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;
    
    this.hasScroll = needsScroll;
    this.isScrollAtBottom = isAtBottom;
    
    // Forcer la détection de changement pour mettre à jour la vue
    this.cdr.detectChanges();
  }

  @HostListener('window:resize')
  onResize(): void {
    // Recalculer le scroll lors du redimensionnement
    setTimeout(() => {
      this.checkScroll();
      if (!this.hasScroll) {
        this.isScrollAtBottom = false;
      }
    }, 100);
    
    // Redimensionner le canvas de confetti
    if (this.confettiCanvas?.nativeElement) {
      this.confettiCanvas.nativeElement.width = window.innerWidth;
      this.confettiCanvas.nativeElement.height = window.innerHeight;
    }
  }

  /**
   * Formate le temps en secondes au format MM:SS
   * @param seconds Le nombre de secondes
   * @returns Le temps formaté (ex: "05:23")
   */
  formatTime(seconds: number): string {
    // Arrondir à la seconde près
    const roundedSeconds = Math.round(seconds);
    
    // Calculer les minutes et secondes
    const minutes = Math.floor(roundedSeconds / 60);
    const secs = roundedSeconds % 60;
    
    // Limiter à 99:59 maximum (4 chiffres : 2 pour minutes + 2 pour secondes)
    // Si on dépasse 99:59, afficher 99:59
    const maxMinutes = 99;
    const maxSeconds = 59;
    const finalMinutes = Math.min(minutes, maxMinutes);
    const finalSecs = minutes > maxMinutes ? maxSeconds : secs;
    
    return `${finalMinutes.toString().padStart(2, '0')}:${finalSecs.toString().padStart(2, '0')}`;
  }

  /**
   * Formate le temps restant pour l'affichage (compte à rebours)
   * Arrondit à la seconde près et limite à 4 chiffres maximum (99:59)
   * @returns Le temps restant formaté (ex: "05:23")
   */
  getRemainingTimeFormatted(): string {
    // Arrondir remainingTime à la seconde près avant de formater
    const roundedTime = Math.round(Math.max(0, this.remainingTime));
    return this.formatTime(roundedTime);
  }

  /**
   * Gere la mise a jour de l'etat du passage et le compte a rebours
   */
  private handlePassageState(state: PassageState): void {
    this.currentState = state;
    this.elapsedTime = state.elapsedTime;
    this.isPaused = state.isPaused;

    // Calculer le temps restant (compte à rebours)
    // Arrondir à la seconde près pour éviter les décimales
    if (state.currentPassage) {
      this.totalPassageDuration = state.currentPassage.duration * 60; // Convertir minutes en secondes
      
      // Vérifier si on est sur le randori (technique spéciale)
      const techniques = state.currentPassage.techniques || [];
      const currentTechnique = techniques[state.currentTechniqueIndex];
      const isRandori = currentTechnique && currentTechnique.attack === 'Randori' && currentTechnique.technique === 'Randori';
      
      if (isRandori) {
        // Pour le randori : calculer le temps restant à partir du temps configuré
        // Le randori dure randoriTime minutes, donc on calcule le temps écoulé depuis le début du randori
        // et on soustrait du temps configuré
        const randoriDurationSeconds = this.randoriTime * 60; // Convertir minutes en secondes
        
        // Calculer le temps écoulé depuis le début du passage
        const totalElapsed = state.elapsedTime;
        // Calculer le temps écoulé avant le randori (durée totale - temps du randori)
        const timeBeforeRandori = this.totalPassageDuration - randoriDurationSeconds;
        // Calculer le temps écoulé pendant le randori
        const elapsedInRandori = Math.max(0, totalElapsed - timeBeforeRandori);
        // Le temps restant pour le randori
        this.remainingTime = Math.round(Math.max(0, randoriDurationSeconds - elapsedInRandori));
      } else {
        // Pour les techniques normales : calculer normalement
        this.remainingTime = Math.round(Math.max(0, this.totalPassageDuration - state.elapsedTime));
      }
    } else {
      this.totalPassageDuration = 0;
      this.remainingTime = 0;
    }

    // Vérifier si le passage est terminé
    this.isPassageCompleted = this.isPassageCompletedState(state);
    if (this.isPassageCompleted) {
      // Arrêter tous les audios en cours
      this.audioService.stopAudio();
      
      // Mettre à jour la progression à 100% avant d'afficher l'écran de fin
      if (state.currentPassage) {
        this.totalTechniques = state.currentPassage.techniques.length;
        this.currentProgress = this.totalTechniques;
        this.progressPercentage = 100; // Forcer à 100%
        // Mettre à jour l'historique avec toutes les techniques
        this.history = state.currentPassage.techniques;
      }
      
      this.passageSummary = this.getPassageSummary(state);
      this.stopCountdown();
      this.remainingTime = 0;
      this.currentTechnique = null; // Plus de technique en cours
      // Afficher l'écran de fin automatiquement quand le passage est terminé
      this.showEndScreen = true;
      this.cdr.detectChanges();
      // Lancer l'animation de confetti après un court délai
      setTimeout(() => {
        this.startConfetti();
      }, 100);
      return;
    }

    if (!state.currentPassage) {
      // Pas de passage chargé, réinitialiser les données
      this.currentTechnique = null;
      this.totalTechniques = 0;
      this.currentProgress = 0;
      this.progressPercentage = 0;
      this.history = [];
      this.stopCountdown();
      this.lastTechniqueIndex = null;
      this.cdr.detectChanges();
      return;
    }

    // Mettre à jour totalTechniques dès que le passage est disponible
    const techniques = state.currentPassage.techniques || [];
    this.totalTechniques = techniques.length;
    this.currentProgress = Math.min(state.currentTechniqueIndex + 1, this.totalTechniques);
    this.progressPercentage = state.progress;

    // Mettre à jour la technique actuelle
    const currentTechnique = techniques[state.currentTechniqueIndex];
    const previousTechnique = this.currentTechnique;
    
    if (currentTechnique) {
      const isNewTechnique = !previousTechnique || (previousTechnique.order !== currentTechnique.order);
      this.currentTechnique = currentTechnique;
      
      // Jouer l'audio si c'est une nouvelle technique (ou la première)
      // L'audio joue immédiatement quand la technique change (avant le countdown)
      if (isNewTechnique) {
        // Utiliser setTimeout pour éviter les erreurs de timing avec le changement d'état
        // et permettre à Angular de terminer le cycle de détection de changement
        // Délai de 100ms pour s'assurer que tout est bien initialisé
        setTimeout(() => {
          // Vérifier à nouveau que la technique est toujours valide
          if (this.currentTechnique && this.currentTechnique === currentTechnique) {
            try {
              this.playTechniqueAudio(this.currentTechnique);
            } catch (error) {
              console.error('[PassageComponent] Error in playTechniqueAudio:', error);
              // Ne pas interrompre le passage en cas d'erreur audio
            }
          }
        }, 100);
      }
    } else {
      this.currentTechnique = null;
    }

    // Mettre à jour l'historique (techniques déjà exécutées)
    this.history = techniques.slice(0, state.currentTechniqueIndex);

    // Gérer le compte à rebours
    if (!state.isPlaying) {
      // Passage en pause ou arrêté, arrêter le countdown mais garder les données affichées
      this.stopCountdown();
    } else {
      // Démarrer le compte à rebours si on change de technique ou au démarrage
      if (this.lastTechniqueIndex !== state.currentTechniqueIndex || this.lastTechniqueIndex === null) {
        this.lastTechniqueIndex = state.currentTechniqueIndex;
        // Enregistrer le temps de début de la technique actuelle pour calculer le countdown
        this.techniqueStartTime = state.elapsedTime;
        // Démarrer le compte à rebours seulement si on a une technique valide
        if (currentTechnique) {
          // Vérifier si c'est un randori (technique spéciale avec un countdown basé sur randoriTime)
          const isRandori = currentTechnique.attack === 'Randori' && currentTechnique.technique === 'Randori';
          
          if (isRandori) {
            // Pour le randori : countdown basé sur randoriTime configuré (en minutes, converti en secondes)
            const randoriDurationSeconds = this.randoriTime * 60; // Convertir minutes en secondes
            this.countdown = randoriDurationSeconds;
          } else {
            // Pour les techniques normales : utiliser le countdown configuré
            this.countdown = this.configuredCountdownSeconds;
          }
          this.countdownAnimationDuration = 1;
          this.bumpCountdownAnimation();
        }
      }
      
      // Calculer le countdown basé sur le temps écoulé depuis le début de la technique
      // Cela synchronise le countdown avec le timer principal
      if (currentTechnique && !this.isPaused) {
        const elapsedSinceTechniqueStart = state.elapsedTime - this.techniqueStartTime;
        const isRandori = currentTechnique.attack === 'Randori' && currentTechnique.technique === 'Randori';
        const countdownDuration = isRandori ? (this.randoriTime * 60) : this.configuredCountdownSeconds;
        const newCountdown = Math.max(0, countdownDuration - elapsedSinceTechniqueStart);
        
        // Mettre à jour le countdown seulement si la valeur a changé (pour éviter les animations inutiles)
        if (Math.floor(newCountdown) !== Math.floor(this.countdown)) {
          this.countdown = newCountdown;
          this.bumpCountdownAnimation();
          
          // Quand le countdown arrive à 0, passer à la technique suivante
          if (this.countdown <= 0) {
            // Passage automatique : le timer a déjà compté le temps
            this.passageService.nextTechnique(false);
          }
        }
      }
    }

    // Forcer la détection de changement pour mettre à jour la vue
    this.cdr.detectChanges();
  }

  /**
   * Vérifie si le passage est terminé
   */
  private isPassageCompletedState(state: PassageState): boolean {
    if (!state.currentPassage) {
      return false;
    }

    const total = state.currentPassage.techniques.length;
    // Le passage est terminé si l'index est >= total OU si isPlaying est false et qu'on est à la dernière technique
    return state.currentTechniqueIndex >= total;
  }

  /**
   * Récupère le résumé du passage terminé
   */
  private getPassageSummary(state: PassageState): {
    totalTechniques: number;
    duration: number;
    includeRandori: boolean;
  } | null {
    if (!state.currentPassage) {
      return null;
    }

    return {
      totalTechniques: state.currentPassage.techniques.length,
      duration: state.elapsedTime,
      includeRandori: state.currentPassage.filters?.includeRandori || false
    };
  }

  /**
   * Retourne le nom de position formaté
   */
  getPositionLabel(position: Position): string {
    return position;
  }

  /**
   * Toggle pause/play
   */
  togglePause(): void {
    if (this.isPaused) {
      this.passageService.resumePassage();
      // Reprendre l'audio
      this.audioService.resumeAudio();
    } else {
      this.passageService.pausePassage();
      // Mettre en pause l'audio
      this.audioService.pauseAudio();
    }
  }

  /**
   * Joue l'audio d'une technique
   * @param technique La technique à annoncer
   * @private
   */
  private playTechniqueAudio(technique: Technique): void {
    try {
      // Vérifications de sécurité
      if (!technique) {
        console.warn('[PassageComponent] Cannot play audio: technique is null or undefined');
        return;
      }

      // Vérifier que la technique a les propriétés nécessaires
      if (!technique.attack || !technique.technique || !technique.position) {
        console.warn('[PassageComponent] Cannot play audio: technique is missing required properties', technique);
        return;
      }

      // Vérifier que la voix est valide
      if (!this.currentVoiceId || typeof this.currentVoiceId !== 'string' || this.currentVoiceId.trim().length === 0) {
        console.warn('[PassageComponent] Cannot play audio: voiceId is invalid', this.currentVoiceId);
        return;
      }

      // Ne pas jouer l'audio si le passage est en pause
      if (this.isPaused) {
        return;
      }

      // Jouer l'audio de la technique avec la voix actuelle
      // Utiliser setTimeout pour éviter les erreurs de timing et permettre à Angular de terminer le cycle
      setTimeout(() => {
        try {
          this.audioService.playTechnique(technique, this.currentVoiceId).catch((error) => {
            // Logger l'erreur mais ne pas interrompre le passage
            console.warn('[PassageComponent] Failed to play technique audio (async error):', error);
          });
        } catch (syncError) {
          // Capturer les erreurs synchrones (par exemple dans buildAudioPath)
          console.warn('[PassageComponent] Failed to play technique audio (sync error):', syncError);
        }
      }, 0);
    } catch (error) {
      // Capturer toutes les erreurs pour éviter qu'elles ne remontent et causent une redirection
      console.warn('[PassageComponent] Error in playTechniqueAudio:', error);
    }
  }

  /**
   * Lance le compte a rebours visuel avant chaque technique
   * Compte à rebours classique : décrémente chaque seconde
   */
  /**
   * Arrête le compte à rebours (nettoyage des timers si nécessaire)
   */
  private stopCountdown(): void {
    if (this.countdownInterval !== null) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
    if (this.countdownTimeout !== null) {
      clearTimeout(this.countdownTimeout);
      this.countdownTimeout = null;
    }
  }

  private bumpCountdownAnimation(): void {
    this.countdownAnimationToken += 1;
  }

  /**
   * Passe à la technique suivante (skip l'attaque en cours)
   */
  skipTechnique(): void {
    // Arrêter l'audio en cours avant de passer à la technique suivante
    this.audioService.stopAudio();
    
    // Arrêter le countdown actuel
    this.stopCountdown();
    
    // Passer à la technique suivante avec skip=true pour ajouter le temps entre techniques
    this.passageService.nextTechnique(true);
  }

  /**
   * Exporte le passage (placeholder pour Epic 5)
   */
  exportPassage(): void {
    // TODO: Implémenter l'export dans Epic 5
    console.log('Export passage - à implémenter dans Epic 5');
    // Placeholder: afficher un message ou désactiver le bouton
  }

  /**
   * Génère un nouveau passage avec les mêmes configurations
   * Recharge la page pour régénérer un nouveau passage
   */
  newPassage(): void {
    window.location.reload();
  }

  /**
   * Retourne à la page d'accueil
   */
  goHome(): void {
    this.router.navigate(['/']);
  }

  /**
   * Ferme l'écran de fin pour revenir à la vue du passage terminé
   */
  closeEndScreen(): void {
    this.showEndScreen = false;
    this.stopConfetti();
  }

  /**
   * Lance l'animation de confetti
   */
  private startConfetti(): void {
    if (!this.confettiCanvas?.nativeElement) {
      return;
    }

    const canvas = this.confettiCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    // Définir la taille du canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Couleurs du confetti (utilisant les couleurs du thème si possible)
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
      '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52BE80'
    ];

    interface ConfettiParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      rotation: number;
      rotationSpeed: number;
      shape: 'circle' | 'square' | 'triangle';
    }

    const particles: ConfettiParticle[] = [];
    const particleCount = 200; // Plus de particules pour couvrir toute la page

    // Créer les particules qui partent de toute la largeur de la page en haut
    for (let i = 0; i < particleCount; i++) {
      // Position X : répartie sur toute la largeur de la page
      const startX = Math.random() * canvas.width;
      
      // Position Y : depuis le haut de la page avec un petit décalage
      const startY = -10 - Math.random() * 50;
      
      // Vitesse : partir vers le bas avec une dispersion horizontale
      const angle = (Math.random() - 0.5) * Math.PI * 0.6; // Angle entre -54° et +54°
      const speed = Math.random() * 4 + 2;
      
      particles.push({
        x: startX,
        y: startY,
        vx: Math.sin(angle) * speed,
        vy: Math.cos(angle) * speed + 1, // Toujours vers le bas
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 10 + 5,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        shape: ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)] as 'circle' | 'square' | 'triangle'
      });
    }

    const startTime = Date.now();
    const duration = 3000; // 3 secondes

    const animate = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed > duration) {
        // Animation terminée
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.confettiAnimationId = null;
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        // Mettre à jour la position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.rotation += particle.rotationSpeed;
        particle.vy += 0.1; // Gravité

        // Dessiner la particule
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate((particle.rotation * Math.PI) / 180);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = 1 - (elapsed / duration);

        if (particle.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (particle.shape === 'square') {
          ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
        } else if (particle.shape === 'triangle') {
          ctx.beginPath();
          ctx.moveTo(0, -particle.size / 2);
          ctx.lineTo(-particle.size / 2, particle.size / 2);
          ctx.lineTo(particle.size / 2, particle.size / 2);
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      });

      this.confettiAnimationId = requestAnimationFrame(animate);
    };

    animate();
  }

  /**
   * Arrête l'animation de confetti
   */
  private stopConfetti(): void {
    if (this.confettiCanvas?.nativeElement) {
      const ctx = this.confettiCanvas.nativeElement.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, this.confettiCanvas.nativeElement.width, this.confettiCanvas.nativeElement.height);
      }
    }
  }
}
