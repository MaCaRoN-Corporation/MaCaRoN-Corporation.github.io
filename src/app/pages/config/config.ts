import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { RouterLink, Router, NavigationStart } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { GradeService } from '../../services/grade.service';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-config',
  imports: [CommonModule, RouterLink],
  templateUrl: './config.html',
  styleUrl: './config.scss',
})
export class ConfigComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  isLeaving = false; // État pour l'animation de sortie

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
  selectedGrade: string = '1er Dan'; // Grade par défaut
  isGradeDropdownOpen = false; // État du dropdown

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

  constructor(
    private router: Router,
    private gradeService: GradeService,
    private configService: ConfigService
  ) {}

  ngOnInit(): void {
    // Détecter quand on quitte la page (navigation vers une autre route)
    this.subscriptions.add(
      this.router.events
        .pipe(filter(event => event instanceof NavigationStart))
        .subscribe((event: any) => {
          // Si on navigue vers une autre page, déclencher l'animation de sortie
          if (event.url !== '/config') {
            this.isLeaving = true;
          }
        })
    );

    // Détecter le retour arrière du navigateur
    window.addEventListener('popstate', this.handlePopState);

    // Charger la configuration depuis localStorage
    this.loadConfigFromStorage();
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
   * et en soustrayant le temps dédié aux armes et le temps de préparation aux armes
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

  @HostListener('window:popstate', ['$event'])
  private handlePopState = (event: PopStateEvent) => {
    // Lors du retour arrière, déclencher l'animation de sortie
    this.isLeaving = true;
  };

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    // Fermer le dropdown si on clique en dehors
    const target = event.target as HTMLElement;
    if (this.isGradeDropdownOpen && !target.closest('.grade-selector')) {
      this.closeGradeDropdown();
    }
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
      // Sauvegarder le grade valide si le grade sauvegardé était invalide
      this.configService.updateGrade(this.selectedGrade);
    }
    
    // Déclencher la mise à jour des filtres pour le grade sélectionné
    this.updateFiltersForGrade(this.selectedGrade);

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

    // Mettre à jour les filtres disponibles pour ce grade
    this.updateFiltersForGrade(grade);
  }

  /**
   * Met à jour les filtres disponibles pour le grade sélectionné
   * Cette méthode sera complétée dans les stories suivantes
   * @param grade Le grade sélectionné
   */
  private updateFiltersForGrade(grade: string): void {
    // Cette méthode sera complétée dans les stories suivantes (2.6, 2.7, etc.)
    // Pour l'instant, elle est préparée pour les futures implémentations
    // Les filtres seront mis à jour dans les stories suivantes
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


  /**
   * Valide le temps dédié aux armes
   * @param value La valeur à valider (en secondes)
   * @returns true si la valeur est valide
   */
  validateWeaponTime(value: number): boolean {
    return value >= this.MIN_WEAPON_TIME && value <= this.MAX_WEAPON_TIME;
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
   * Gère le clic sur le bouton retour
   * @param event L'événement de clic
   */
  onBackClick(event: Event): void {
    event.preventDefault();
    this.isLeaving = true;
    // Attendre la fin de l'animation avant de naviguer
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 300); // Durée de l'animation
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    window.removeEventListener('popstate', this.handlePopState);
  }
}
