import { Component, OnInit, OnDestroy, HostListener, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { filter, take } from 'rxjs/operators';
import { GradeService } from '../../services/grade.service';
import { ConfigService } from '../../services/config.service';
import { SettingsService } from '../../services/settings.service';
import { VoiceService } from '../../services/voice.service';
import { VoiceId, Voice, DEFAULT_SETTINGS, getFullVoiceId, parseVoiceId } from '../../models/settings.model';

interface PassageMode {
  id: string;
  name: string;
  description: string;
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  private subscriptions = new Subscription();
  isMobile = false;
  currentModeIndex = 0;
  
  @ViewChild('configContent') configContentElement?: ElementRef<HTMLElement>;
  isScrollAtBottom = false; // État pour masquer l'indicateur de scroll quand on est en bas
  hasScroll = false; // État pour afficher l'indicateur seulement si un scroll est nécessaire
  
  // Configuration de passage
  // Grades (liste statique toujours la même)
  readonly grades: string[] = [
    '6e Kyū',
    '5e Kyū',
    '4e Kyū',
    '3e Kyū',
    '2e Kyū',
    '1er Kyū',
    '1er Dan',
    '2e Dan',
    '3e Dan',
    '4e Dan',
    '5e Dan'
  ];
  selectedGrade: string = '1er Dan';
  isGradeDropdownOpen = false; // État du dropdown

  // Sélection de la voix
  selectedVoice: VoiceId = DEFAULT_SETTINGS.voice; // Voix par défaut
  availableVoices: Voice[] = []; // Liste des voix disponibles (chargée dynamiquement)
  
  // Références pour la prévisualisation audio (optimisation performance)
  private currentPreviewAudio: HTMLAudioElement | null = null;
  private previewDebounceTimer: any = null;

  // Configuration du temps
  timeBetweenTechniques: number = 20; // secondes, valeur par défaut
  totalDuration: number = 10; // minutes, valeur par défaut (sera mis à jour selon le grade)
  weaponTime: number = 5; // minutes, valeur par défaut
  includeWeaponTime: boolean = false; // par défaut, ne pas inclure de temps dédié aux armes
  includeRandoriTime: boolean = false; // par défaut, ne pas inclure de temps dédié au randori
  randoriTime: number = 3; // minutes - temps fixe pour le randori

  // Constantes de validation
  readonly MIN_TIME_BETWEEN = 5; // secondes
  readonly MAX_TIME_BETWEEN = 120; // secondes
  readonly TIME_STEP = 5; // pas de 5 secondes
  readonly MIN_DURATION = 5; // minutes
  readonly MAX_DURATION = 60; // minutes
  readonly MIN_WEAPON_TIME = 1; // minutes
  readonly MAX_WEAPON_TIME = 10; // minutes
  
  passageModes: PassageMode[] = [
    {
      id: 'classique',
      name: 'Classique',
      description: 'Déroulement de technique traditionnel'
    },
    {
      id: 'progression',
      name: 'Progression',
      description: 'Niveau de technique croissant'
    },
    {
      id: 'aleatoire',
      name: 'Aléatoire',
      description: 'Techniques sélectionnées au hasard'
    },
    {
      id: 'revision',
      name: 'Révision',
      description: 'Techniques sélectionnées par l\'utilisateur'
    }
  ];

  get currentMode(): PassageMode {
    return this.passageModes[this.currentModeIndex];
  }

  constructor(
    private router: Router,
    private gradeService: GradeService,
    private configService: ConfigService,
    private settingsService: SettingsService,
    private voiceService: VoiceService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Détecter si on est sur mobile
    this.checkMobile();
    window.addEventListener('resize', () => this.checkMobile());

    // Charger les voix disponibles dynamiquement
    this.loadVoices();

    // Charger la configuration depuis localStorage
    this.loadConfigFromStorage();

    // Écouter les changements de configuration (pour synchronisation entre mobile/PC)
    this.subscriptions.add(
      this.configService.getConfig().subscribe(config => {
        const savedGrade = config.selectedGrade || '1er Dan';
        // Valider que le grade sauvegardé existe dans la liste statique
        if (this.grades.includes(savedGrade)) {
          this.selectedGrade = savedGrade;
        } else {
          this.selectedGrade = '1er Dan';
          this.configService.updateGrade(this.selectedGrade);
        }
        
        if (config.passageMode) {
          const modeIndex = this.passageModes.findIndex(m => m.id === config.passageMode);
          if (modeIndex !== -1) {
            this.currentModeIndex = modeIndex;
          }
        }

        // Synchroniser les valeurs de temps (sans modifier la durée totale automatiquement)
        if (config.timeBetweenTechniques !== undefined) {
          this.timeBetweenTechniques = config.timeBetweenTechniques;
        }
        // La durée totale est chargée uniquement au démarrage (loadConfigFromStorage)
        // Elle n'est mise à jour que lors d'un changement de grade explicite (onGradeSelect)
        if (config.totalDuration !== undefined && this.totalDuration !== config.totalDuration) {
          // Synchroniser seulement si différente pour éviter les boucles
          this.totalDuration = config.totalDuration;
        }
        if (config.weaponTime !== undefined) {
          this.weaponTime = config.weaponTime;
        }
        // Synchroniser les toggles (false par défaut si non défini dans localStorage)
        if (config.includeWeaponTime !== undefined) {
          this.includeWeaponTime = config.includeWeaponTime;
        } else {
          this.includeWeaponTime = false;
        }
        if (config.includeRandoriTime !== undefined) {
          this.includeRandoriTime = config.includeRandoriTime;
        } else {
          this.includeRandoriTime = false;
        }
        if (config.randoriTime !== undefined) {
          this.randoriTime = config.randoriTime;
        } else {
          this.randoriTime = 3;
        }
      })
    );
  }

  checkMobile(): void {
    this.isMobile = window.innerWidth < 768;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    // Fermer le dropdown si on clique en dehors
    const target = event.target as HTMLElement;
    if (this.isGradeDropdownOpen && !target.closest('.grade-selector')) {
      this.closeGradeDropdown();
    }
  }

  /**
   * Charge les voix disponibles depuis le service
   */
  private loadVoices(): void {
    this.subscriptions.add(
      this.voiceService.getAvailableVoices().subscribe(voices => {
        this.availableVoices = voices;
      })
    );
  }

  /**
   * Getter pour les voix françaises
   */
  get frenchVoices(): Voice[] {
    return this.availableVoices.filter(voice => voice.language === 'French');
  }

  /**
   * Getter pour les voix japonaises
   */
  get japaneseVoices(): Voice[] {
    return this.availableVoices.filter(voice => voice.language === 'Japanese');
  }

  /**
   * Charge la configuration depuis localStorage
   */
  private loadConfigFromStorage(): void {
    const config = this.configService.getCurrentConfig();
    const savedGrade = config.selectedGrade || '1er Dan';
    
    // Valider que le grade sauvegardé existe dans la liste statique
    if (this.grades.includes(savedGrade)) {
      this.selectedGrade = savedGrade;
    } else {
      this.selectedGrade = '1er Dan';
      this.configService.updateGrade(this.selectedGrade);
    }
    
    if (config.passageMode) {
      const modeIndex = this.passageModes.findIndex(m => m.id === config.passageMode);
      if (modeIndex !== -1) {
        this.currentModeIndex = modeIndex;
      }
    }

    // Charger les paramètres de temps depuis la configuration
    let savedTimeBetween = config.timeBetweenTechniques ?? 20;
    // Arrondir au multiple de 5 le plus proche
    savedTimeBetween = Math.round(savedTimeBetween / this.TIME_STEP) * this.TIME_STEP;
    // Clamper entre min et max
    savedTimeBetween = Math.max(this.MIN_TIME_BETWEEN, Math.min(this.MAX_TIME_BETWEEN, savedTimeBetween));
    
    // Si pas de durée sauvegardée, utiliser celle du grade par défaut
    const defaultDurationForGrade = this.getDurationForGrade(this.selectedGrade);
    const savedDuration = config.totalDuration ?? defaultDurationForGrade;
    const savedWeaponTime = config.weaponTime ?? 5;
    const savedIncludeWeaponTime = config.includeWeaponTime ?? false;
    const savedIncludeRandoriTime = config.includeRandoriTime ?? false;
    const savedRandoriTime = config.randoriTime ?? 3;

    // Valider et appliquer les valeurs
    if (this.validateTimeBetween(savedTimeBetween)) {
      this.timeBetweenTechniques = savedTimeBetween;
    } else {
      this.timeBetweenTechniques = 20;
      this.configService.updateTimeBetweenTechniques(this.timeBetweenTechniques);
    }

    // Charger la durée totale depuis localStorage (garder la valeur même si elle ne correspond pas au grade)
    if (this.validateDuration(savedDuration)) {
      this.totalDuration = savedDuration;
    } else {
      // Seulement si la valeur est invalide, utiliser la durée par défaut du grade
      this.totalDuration = defaultDurationForGrade;
      this.configService.updateTotalDuration(this.totalDuration);
    }

    if (this.validateWeaponTime(savedWeaponTime)) {
      this.weaponTime = savedWeaponTime;
    } else {
      this.weaponTime = 5;
      this.configService.updateWeaponTime(this.weaponTime);
    }

    this.includeWeaponTime = savedIncludeWeaponTime;
    this.includeRandoriTime = savedIncludeRandoriTime;
    this.randoriTime = savedRandoriTime;

    // Charger la préférence de voix depuis SettingsService
    this.settingsService.getSettings()
      .pipe(take(1))
      .subscribe(settings => {
        this.selectedVoice = settings.voice || DEFAULT_SETTINGS.voice;
      });
  }

  ngAfterViewInit(): void {
    // Vérifier si on peut scroller au chargement
    // Utiliser requestAnimationFrame double pour s'assurer que le layout est complètement calculé
    if (!this.isMobile) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (this.configContentElement) {
            this.checkScrollNeeded();
            this.cdr.detectChanges(); // Forcer la détection de changement
            // Si un scroll est nécessaire, vérifier aussi la position
            if (this.hasScroll) {
              this.checkScrollPosition();
              this.cdr.detectChanges();
            }
          }
        });
      });
    }
  }
  
  /**
   * Écoute les changements de taille de fenêtre pour réévaluer si un scroll est nécessaire
   */
  @HostListener('window:resize')
  onWindowResize(): void {
    if (!this.isMobile && this.configContentElement) {
      // Utiliser requestAnimationFrame double pour s'assurer que le layout est mis à jour après le resize
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.checkScrollNeeded();
          this.cdr.detectChanges(); // Forcer la détection de changement
          // Si après resize il n'y a plus de scroll nécessaire, on peut réinitialiser isScrollAtBottom
          if (!this.hasScroll) {
            this.isScrollAtBottom = false;
          } else if (this.hasScroll) {
            // Si un scroll devient nécessaire, vérifier aussi la position
            this.checkScrollPosition();
          }
          this.cdr.detectChanges();
        });
      });
    }
  }

  /**
   * Vérifie si le contenu nécessite un scroll
   */
  checkScrollNeeded(): void {
    if (!this.configContentElement?.nativeElement) {
      this.hasScroll = false;
      return;
    }

    const element = this.configContentElement.nativeElement;
    // Vérifier si le contenu dépasse strictement la hauteur visible
    // scrollHeight doit être strictement supérieur à clientHeight pour qu'il y ait un scroll
    this.hasScroll = element.scrollHeight > element.clientHeight;
  }

  /**
   * Vérifie la position du scroll et met à jour isScrollAtBottom
   * Une fois que isScrollAtBottom est true, il reste true jusqu'au prochain rafraîchissement
   */
  checkScrollPosition(): void {
    if (!this.configContentElement?.nativeElement) {
      return;
    }

    // Vérifier d'abord si un scroll est nécessaire
    this.checkScrollNeeded();

    // Si l'indicateur est déjà masqué, ne plus le réafficher
    if (this.isScrollAtBottom) {
      return;
    }

    const element = this.configContentElement.nativeElement;
    const isAtBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 5; // 5px de tolérance
    
    // Une fois qu'on est en bas, on masque définitivement jusqu'au refresh
    if (isAtBottom) {
      this.isScrollAtBottom = true;
    }
  }

  /**
   * Gère l'événement de scroll sur config-content
   */
  onConfigContentScroll(): void {
    if (!this.isMobile) {
      // Vérifier si un scroll est nécessaire (au cas où le contenu aurait changé)
      this.checkScrollNeeded();
      // Vérifier la position du scroll
      this.checkScrollPosition();
      // Forcer la détection de changement pour mettre à jour l'affichage
      this.cdr.detectChanges();
    }
  }

  /**
   * Ouvre/ferme le dropdown de sélection de grade
   */
  toggleGradeDropdown(): void {
    this.isGradeDropdownOpen = !this.isGradeDropdownOpen;
  }

  /**
   * Ferme le dropdown de sélection de grade
   */
  closeGradeDropdown(): void {
    this.isGradeDropdownOpen = false;
  }

  /**
   * Gère la sélection d'un grade
   * @param grade Le grade sélectionné
   */
  onGradeSelect(grade: string): void {
    // Valider que le grade existe dans la liste statique
    if (!this.grades.includes(grade)) {
      console.warn(`Invalid grade selected: ${grade}`);
      return;
    }

    // Sauvegarder la sélection dans le composant
    this.selectedGrade = grade;

    // Sauvegarder dans localStorage via ConfigService
    this.configService.updateGrade(grade);

    // Mettre à jour la durée totale selon le grade sélectionné
    const newDuration = this.getDurationForGrade(grade);
    this.totalDuration = newDuration;
    this.configService.updateTotalDuration(this.totalDuration);

    // Fermer le dropdown
    this.closeGradeDropdown();
  }

  /**
   * Vérifie si un grade est sélectionné
   * @param grade Le grade à vérifier
   * @returns true si le grade est sélectionné
   */
  isGradeSelected(grade: string): boolean {
    return this.selectedGrade === grade;
  }

  /**
   * Détermine si le toggle pour le temps dédié aux armes doit être affiché
   * Afficher uniquement si le grade sélectionné est >= 1er Kyū
   * @returns true si le grade est >= 1er Kyū
   */
  get shouldShowWeaponToggle(): boolean {
    const kyūGrades = ['6e Kyū', '5e Kyū', '4e Kyū', '3e Kyū', '2e Kyū'];
    return !kyūGrades.includes(this.selectedGrade);
  }

  /**
   * Détermine si le temps dédié aux armes doit être affiché
   * Afficher uniquement si includeWeaponTime est true ET le grade sélectionné est >= 1er Kyū
   * @returns true si includeWeaponTime est true et le grade est >= 1er Kyū
   */
  get shouldShowWeaponTime(): boolean {
    if (!this.includeWeaponTime) {
      return false;
    }
    const kyūGrades = ['6e Kyū', '5e Kyū', '4e Kyū', '3e Kyū', '2e Kyū'];
    return !kyūGrades.includes(this.selectedGrade);
  }

  /**
   * Calcule la durée totale recommandée selon le grade sélectionné
   * - Kyū (6e à 1er) : 10 minutes
   * - 1er Dan : 15 minutes
   * - 2e Dan et au-dessus : 20 minutes
   * @param grade Le grade sélectionné
   * @returns Durée totale en minutes
   */
  private getDurationForGrade(grade: string): number {
    const kyūGrades = ['6e Kyū', '5e Kyū', '4e Kyū', '3e Kyū', '2e Kyū'];
    
    if (kyūGrades.includes(grade) || grade === '1er Kyū') {
      return 10; // Kyū : 10 minutes
    } else if (grade === '1er Dan') {
      return 15; // 1er Dan : 15 minutes
    } else {
      // 2e Dan et au-dessus
      return 20; // 2e Dan et plus : 20 minutes
    }
  }

  /**
   * Calcule le nombre estimé de techniques basé sur la durée totale, le temps entre techniques
   * et en soustrayant le temps dédié aux armes
   * @returns Nombre estimé de techniques (hors techniques spécifiques aux armes)
   */
  get estimatedTechniqueCount(): number {
    // Soustraction du temps dédié aux armes de la durée totale (si applicable)
    const weaponTimeToSubtract = this.shouldShowWeaponTime ? this.weaponTime : 0;
    // Soustraction du temps dédié au randori (si applicable)
    const randoriTimeToSubtract = this.includeRandoriTime ? this.randoriTime : 0;
    const availableTimeMinutes = Math.max(0, this.totalDuration - weaponTimeToSubtract - randoriTimeToSubtract);
    const availableSeconds = availableTimeMinutes * 60;
    return Math.floor(availableSeconds / this.timeBetweenTechniques);
  }

  /**
   * Génère le texte d'exclusion dynamique selon l'état des toggles
   * @returns Texte d'exclusion (hors techniques spécifiques aux armes, randori, etc.)
   */
  get exclusionText(): string {
    const exclusions: string[] = [];
    
    // Vérifier si le temps dédié aux armes est activé et visible
    if (this.shouldShowWeaponTime && this.includeWeaponTime) {
      exclusions.push('techniques spécifiques aux armes');
    }
    
    // Vérifier si le temps dédié au randori est activé
    if (this.includeRandoriTime) {
      exclusions.push('randori');
    }
    
    // Générer le texte final
    if (exclusions.length === 0) {
      return '';
    } else if (exclusions.length === 1) {
      return `(hors ${exclusions[0]})`;
    } else if (exclusions.length === 2) {
      return `(hors ${exclusions[0]} et ${exclusions[1]})`;
    }
    
    return '';
  }

  /**
   * Valide le temps entre techniques
   * @param value La valeur à valider (en secondes)
   * @returns true si la valeur est valide
   */
  validateTimeBetween(value: number): boolean {
    return value >= this.MIN_TIME_BETWEEN && value <= this.MAX_TIME_BETWEEN;
  }

  /**
   * Valide la durée totale
   * @param value La valeur à valider (en minutes)
   * @returns true si la valeur est valide
   */
  validateDuration(value: number): boolean {
    return value >= this.MIN_DURATION && value <= this.MAX_DURATION;
  }

  /**
   * Valide le temps dédié aux armes
   * @param value La valeur à valider (en minutes)
   * @returns true si la valeur est valide
   */
  validateWeaponTime(value: number): boolean {
    return value >= this.MIN_WEAPON_TIME && value <= this.MAX_WEAPON_TIME;
  }

  /**
   * Incrémente le temps entre techniques (par pas de 5 secondes)
   */
  incrementTimeBetween(): void {
    if (this.timeBetweenTechniques < this.MAX_TIME_BETWEEN) {
      const newValue = Math.min(this.timeBetweenTechniques + this.TIME_STEP, this.MAX_TIME_BETWEEN);
      this.timeBetweenTechniques = newValue;
      this.configService.updateTimeBetweenTechniques(this.timeBetweenTechniques);
    }
  }

  /**
   * Décrémente le temps entre techniques (par pas de 5 secondes)
   */
  decrementTimeBetween(): void {
    if (this.timeBetweenTechniques > this.MIN_TIME_BETWEEN) {
      const newValue = Math.max(this.timeBetweenTechniques - this.TIME_STEP, this.MIN_TIME_BETWEEN);
      this.timeBetweenTechniques = newValue;
      this.configService.updateTimeBetweenTechniques(this.timeBetweenTechniques);
    }
  }

  /**
   * Incrémente le temps dédié aux armes
   */
  incrementWeaponTime(): void {
    if (this.weaponTime < this.MAX_WEAPON_TIME) {
      this.weaponTime = Math.min(this.weaponTime + 1, this.MAX_WEAPON_TIME);
      this.configService.updateWeaponTime(this.weaponTime);
    }
  }

  /**
   * Décrémente le temps dédié aux armes
   */
  decrementWeaponTime(): void {
    if (this.weaponTime > this.MIN_WEAPON_TIME) {
      this.weaponTime = Math.max(this.weaponTime - 1, this.MIN_WEAPON_TIME);
      this.configService.updateWeaponTime(this.weaponTime);
    }
  }

  /**
   * Bascule l'inclusion du temps dédié aux armes
   */
  toggleIncludeWeaponTime(): void {
    this.includeWeaponTime = !this.includeWeaponTime;
    this.configService.updateIncludeWeaponTime(this.includeWeaponTime);
  }

  /**
   * Bascule l'inclusion du temps dédié au randori
   */
  toggleIncludeRandoriTime(): void {
    this.includeRandoriTime = !this.includeRandoriTime;
    this.configService.updateIncludeRandoriTime(this.includeRandoriTime);
  }

  /**
   * Vérifie si une voix est sélectionnée
   * @param voice La voix à vérifier
   * @returns true si la voix est sélectionnée
   */
  isVoiceSelected(voice: Voice): boolean {
    const fullVoiceId = getFullVoiceId(voice);
    return this.selectedVoice === fullVoiceId;
  }

  /**
   * Gère le changement de voix
   * @param voice La voix sélectionnée
   */
  onVoiceChange(voice: Voice): void {
    const fullVoiceId = getFullVoiceId(voice);
    this.selectedVoice = fullVoiceId;
    this.settingsService.updateSettings({ voice: fullVoiceId });
    // Jouer un extrait audio pour prévisualiser la voix
    this.playVoicePreview(voice);
  }
  
  /**
   * Liste des fichiers audio possibles pour la prévisualisation
   * Sélection aléatoire parmi cette liste
   */
  private readonly PREVIEW_AUDIO_FILES = [
    'ai_hanmi_katate_dori.mp3',
    'ikkyo.mp3',
    'nikyo.mp3',
    'sankyo.mp3',
    'yonkyo.mp3',
    'gokyo.mp3',
    'irimi_nage.mp3',
    'shiho_nage.mp3',
    'kote_gaeshi.mp3',
    'tenchi_nage.mp3',
    'uchi_kaiten_nage.mp3',
    'soto_kaiten_nage.mp3',
    'koshi_nage.mp3',
    'kokyu_nage.mp3',
    'shomen_uchi.mp3',
    'yokomen_uchi.mp3',
    'katate_dori.mp3',
    'ryote_dori.mp3',
    'kata_dori.mp3',
    'muna_dori.mp3'
  ];

  /**
   * Joue un extrait audio aléatoire pour prévisualiser la voix sélectionnée
   * @param voice La voix à prévisualiser
   */
  /**
   * Joue un extrait audio aléatoire pour prévisualiser la voix sélectionnée
   * Optimisé pour éviter les lags lors de clics rapides
   * @param voice La voix à prévisualiser
   */
  private playVoicePreview(voice: Voice): void {
    // Debounce : annuler le timer précédent si l'utilisateur clique rapidement
    if (this.previewDebounceTimer) {
      clearTimeout(this.previewDebounceTimer);
    }
    
    // Arrêter l'audio précédent s'il est en cours
    if (this.currentPreviewAudio) {
      this.currentPreviewAudio.pause();
      this.currentPreviewAudio.currentTime = 0;
      this.currentPreviewAudio = null;
    }
    
    // Debounce de 100ms pour éviter trop de clics rapides
    this.previewDebounceTimer = setTimeout(() => {
      this._playVoicePreviewInternal(voice);
      this.previewDebounceTimer = null;
    }, 100);
  }
  
  /**
   * Implémentation interne de la prévisualisation audio
   * @param voice La voix à prévisualiser
   */
  private _playVoicePreviewInternal(voice: Voice): void {
    // Sélectionner un fichier audio aléatoire
    const randomIndex = Math.floor(Math.random() * this.PREVIEW_AUDIO_FILES.length);
    const randomAudioFile = this.PREVIEW_AUDIO_FILES[randomIndex];
    const audioPath = `assets/audio/${voice.language}/${voice.id}/${randomAudioFile}`;
    
    // Utiliser l'API HTML Audio standard (volume par défaut)
    const audio = new Audio(audioPath);
    this.currentPreviewAudio = audio;
    
    // Nettoyer l'audio quand il se termine
    audio.addEventListener('ended', () => {
      this.currentPreviewAudio = null;
    });
    
    // Gérer les erreurs silencieusement
    audio.onerror = () => {
      this.currentPreviewAudio = null;
    };
    
    // Jouer l'audio
    audio.play().catch(error => {
      this.currentPreviewAudio = null;
      console.debug('[HomeComponent] Could not play voice preview:', error);
    });
  }
  
  /**
   * Récupère l'icône SVG pour une voix donnée
   * @param voiceId L'ID de la voix
   * @returns Le SVG correspondant à la voix
   */
  getVoiceIcon(voiceId: VoiceId): string {
    // Les icônes seront définies dans le template HTML
    return voiceId;
  }

  /**
   * Incrémente la durée totale
   */
  incrementDuration(): void {
    if (this.totalDuration < this.MAX_DURATION) {
      this.totalDuration = Math.min(this.totalDuration + 1, this.MAX_DURATION);
      this.configService.updateTotalDuration(this.totalDuration);
    }
  }

  /**
   * Décrémente la durée totale
   */
  decrementDuration(): void {
    if (this.totalDuration > this.MIN_DURATION) {
      this.totalDuration = Math.max(this.totalDuration - 1, this.MIN_DURATION);
      this.configService.updateTotalDuration(this.totalDuration);
    }
  }

  previousMode(): void {
    this.currentModeIndex = (this.currentModeIndex - 1 + this.passageModes.length) % this.passageModes.length;
    // Sauvegarder le mode dans localStorage
    this.configService.updatePassageMode(this.currentMode.id);
  }

  nextMode(): void {
    this.currentModeIndex = (this.currentModeIndex + 1) % this.passageModes.length;
    // Sauvegarder le mode dans localStorage
    this.configService.updatePassageMode(this.currentMode.id);
  }

  startPassage(): void {
    // Sauvegarder la configuration actuelle avant de démarrer
    this.configService.updateConfig({
      selectedGrade: this.selectedGrade,
      passageMode: this.currentMode.id
    });
    
    // Rediriger vers la page de passage avec le mode sélectionné
    // La configuration sera gérée par le service dans les stories suivantes
    this.router.navigate(['/passage'], { queryParams: { mode: this.currentMode.id } });
  }

  ngOnDestroy(): void {
    // Nettoyer les ressources audio
    if (this.currentPreviewAudio) {
      this.currentPreviewAudio.pause();
      this.currentPreviewAudio = null;
    }

    if (this.previewDebounceTimer) {
      clearTimeout(this.previewDebounceTimer);
      this.previewDebounceTimer = null;
    }
    
    this.subscriptions.unsubscribe();
  }
}
