import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, AfterViewChecked, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GradeService } from '../../services/grade.service';
import { Position } from '../../models/position.model';
import { 
  HierarchicalSelection, 
  HierarchicalPositionData, 
  DisplayMode,
  DEFAULT_HIERARCHICAL_SELECTION 
} from '../../models/hierarchical-selection.model';

/**
 * Composant pour la sélection hiérarchique des techniques (mode révision)
 * Affiche une interface avec 4 colonnes (desktop) ou liste verticale (mobile)
 * Permet de sélectionner positions → attaques → techniques avec cascade
 */
@Component({
  selector: 'app-technique-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './technique-filter.component.html',
  styleUrls: ['./technique-filter.component.scss']
})
export class TechniqueFilterComponent implements OnInit, AfterViewChecked {
  @Input() grade: string = '';
  @Input() currentSelection: HierarchicalSelection | null = null;
  @Input() isMobile: boolean = false;

  @Output() selectionApplied = new EventEmitter<HierarchicalSelection>();
  @Output() cancelled = new EventEmitter<void>();

  // Positions disponibles (toujours les 4 mêmes)
  readonly positions: Position[] = ['Suwariwaza', 'Hanmi Handachi', 'Tachiwaza', 'Armes'];

  // Mode d'affichage
  displayMode: DisplayMode = 'all';
  readonly displayModes: Array<{ id: DisplayMode; label: string }> = [
    { id: 'positions', label: 'P' },
    { id: 'positions-attacks', label: 'P+A' },
    { id: 'all', label: 'Tout' }
  ];

  // Terme de recherche
  searchTerm: string = '';

  // Structure hiérarchique des données
  hierarchicalData: Map<Position, HierarchicalPositionData> = new Map();

  // Sélections (seule source de vérité : selectedTechniques)
  selectedTechniques: Map<string, Set<string>> = new Map(); // Clé: "Position-Attaque"

  // État de chargement
  isLoading: boolean = false;

  // Références aux checkboxes de positions et attaques pour gérer l'état indéterminé
  @ViewChildren('positionCheckbox') positionCheckboxes!: QueryList<ElementRef<HTMLInputElement>>;
  @ViewChildren('attackCheckbox') attackCheckboxes!: QueryList<ElementRef<HTMLInputElement>>;

  constructor(
    private gradeService: GradeService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    if (!this.grade) {
      console.error('[TechniqueFilterComponent] Grade is required');
      return;
    }

    // Toujours réinitialiser le mode d'affichage à "Tout" à chaque ouverture
    this.displayMode = 'all';

    // Charger les données hiérarchiques pour le grade
    this.loadHierarchicalData(this.grade);

    // Charger la sélection sauvegardée ou appliquer la sélection passée
    if (this.currentSelection && this.currentSelection.grade === this.grade) {
      this.applySelection(this.currentSelection);
    } else {
      this.loadFromLocalStorage(this.grade);
    }
  }

  /**
   * Charge les données hiérarchiques pour un grade donné
   */
  loadHierarchicalData(grade: string): void {
    this.isLoading = true;

    // S'assurer que la nomenclature est chargée
    this.gradeService.loadNomenclature().subscribe({
      next: () => {
        this.hierarchicalData.clear();

        // Charger les positions disponibles pour ce grade
        const availablePositions = this.gradeService.getPositionsForGrade(grade);

        // Pour chaque position disponible, charger les attaques et techniques
        availablePositions.forEach(position => {
          const attacks = this.gradeService.getAttacksForGradeAndPosition(grade, position);
          const positionData: HierarchicalPositionData = {
            position,
            attacks: new Map()
          };

          attacks.forEach(attack => {
            const techniques = this.gradeService.getTechniquesForGradePositionAttack(grade, position, attack);
            positionData.attacks.set(attack, techniques);
          });

          this.hierarchicalData.set(position, positionData);
        });

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('[TechniqueFilterComponent] Error loading hierarchical data:', error);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  ngAfterViewChecked(): void {
    this.updateIndeterminateStates();
  }

  /**
   * Met à jour l'état indéterminé de tous les checkboxes
   */
  private updateIndeterminateStates(): void {
    // Mettre à jour l'état indéterminé des checkboxes de positions
    const filteredPositions = this.getFilteredPositions();
    this.positionCheckboxes.forEach((checkboxRef, index) => {
      const checkbox = checkboxRef.nativeElement;
      if (index < filteredPositions.length) {
        const position = filteredPositions[index];
        if (position && checkbox) {
          checkbox.indeterminate = this.isPositionIndeterminate(position);
        }
      }
    });

    // Mettre à jour l'état indéterminé des checkboxes d'attaques
    this.attackCheckboxes.forEach((checkboxRef) => {
      const checkbox = checkboxRef.nativeElement;
      // Récupérer la position et l'attaque depuis les attributs data
      const position = checkbox.getAttribute('data-position') as Position;
      const attack = checkbox.getAttribute('data-attack');
      if (position && attack && checkbox) {
        checkbox.indeterminate = this.isAttackIndeterminate(position, attack);
      }
    });
  }

  /**
   * Supprime les accents d'une chaîne
   */
  private removeAccents(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  /**
   * Normalise une chaîne en supprimant tous les espaces, en trimant et en supprimant les accents
   */
  private normalizeString(str: string): string {
    const noSpaces = str.trim().replace(/\s+/g, '');
    return this.removeAccents(noSpaces);
  }

  /**
   * Vérifie si une chaîne correspond au terme de recherche (tolérant aux espaces et accents)
   */
  private matchesSearch(text: string, searchTerm: string): boolean {
    const normalizedText = this.normalizeString(text).toLowerCase();
    const normalizedSearch = this.normalizeString(searchTerm).toLowerCase();
    return normalizedText.includes(normalizedSearch);
  }

  /**
   * Obtient les positions filtrées selon la recherche
   * Ne retourne que les positions qui ont au moins une attaque disponible
   */
  getFilteredPositions(): Position[] {
    // Filtrer d'abord les positions qui ont des attaques disponibles
    let positionsWithAttacks = this.positions.filter(position => {
      const positionData = this.hierarchicalData.get(position);
      return positionData && positionData.attacks.size > 0;
    });
    
    // Si pas de recherche, retourner toutes les positions avec attaques
    if (!this.searchTerm) {
      return positionsWithAttacks;
    }
    
    // Sinon, filtrer selon la recherche
    return positionsWithAttacks.filter(position => {
      // Vérifier si le nom de la position correspond
      if (this.matchesSearch(position, this.searchTerm)) {
        return true;
      }
      
      // Vérifier si une attaque ou technique de cette position correspond
      const positionData = this.hierarchicalData.get(position);
      if (!positionData) return false;
      
      for (const [attack, techniques] of positionData.attacks.entries()) {
        // Vérifier si le nom de l'attaque correspond
        if (this.matchesSearch(attack, this.searchTerm)) {
          return true;
        }
        
        // Vérifier si une technique correspond
        if (techniques.some(technique => this.matchesSearch(technique, this.searchTerm))) {
          return true;
        }
      }
      
      return false;
    });
  }

  /**
   * Obtient les attaques pour une position donnée
   */
  getAttacksForPosition(position: Position): string[] {
    const positionData = this.hierarchicalData.get(position);
    if (!positionData) return [];
    
    let attacks = Array.from(positionData.attacks.keys());
    
    // Filtrer selon le terme de recherche
    if (this.searchTerm) {
      // Si la recherche correspond au nom de la position, afficher toutes les attaques
      if (this.matchesSearch(position, this.searchTerm)) {
        return attacks.sort();
      }
      
      // Sinon, filtrer les attaques et techniques
      attacks = attacks.filter(attack => {
        // Si l'attaque correspond, l'inclure
        if (this.matchesSearch(attack, this.searchTerm)) {
          return true;
        }
        
        // Si une technique de cette attaque correspond, inclure l'attaque
        const techniques = positionData.attacks.get(attack) || [];
        return techniques.some(technique => 
          this.matchesSearch(technique, this.searchTerm)
        );
      });
    }
    
    return attacks.sort();
  }

  /**
   * Obtient les techniques pour une position et attaque données
   */
  getTechniquesForPositionAttack(position: Position, attack: string): string[] {
    const positionData = this.hierarchicalData.get(position);
    if (!positionData) return [];
    
    const techniques = positionData.attacks.get(attack) || [];
    
    // Filtrer selon le terme de recherche
    if (this.searchTerm) {
      // Si la recherche correspond au nom de la position ou de l'attaque, afficher toutes les techniques
      if (this.matchesSearch(position, this.searchTerm) || this.matchesSearch(attack, this.searchTerm)) {
        return techniques;
      }
      
      // Sinon, filtrer les techniques
      return techniques.filter(technique => 
        this.matchesSearch(technique, this.searchTerm)
      );
    }
    
    return techniques;
  }

  /**
   * Vérifie si une position est sélectionnée
   * Une position est sélectionnée uniquement si toutes ses attaques sont sélectionnées
   * Inclut même les attaques avec des listes vides (Jiyu Waza)
   */
  isPositionSelected(position: Position): boolean {
    const positionData = this.hierarchicalData.get(position);
    if (!positionData) return false;
    
    // Vérifier que toutes les attaques sont sélectionnées (y compris celles avec listes vides)
    for (const [attack, techniques] of positionData.attacks.entries()) {
      if (!this.isAttackSelected(position, attack)) {
        return false;
      }
    }
    
    // Si toutes les attaques sont sélectionnées, la position est sélectionnée
    return positionData.attacks.size > 0;
  }

  /**
   * Vérifie si une position est dans un état indéterminé (certaines attaques/techniques sélectionnées mais pas toutes)
   * Inclut même les attaques avec des listes vides (Jiyu Waza)
   */
  isPositionIndeterminate(position: Position): boolean {
    const positionData = this.hierarchicalData.get(position);
    if (!positionData) return false;
    
    // Si la position est complètement sélectionnée, elle n'est pas indéterminée
    if (this.isPositionSelected(position)) return false;
    
    // Vérifier si au moins une attaque/technique est sélectionnée
    let hasAnySelection = false;
    let allAttacksSelected = true;
    
    for (const [attack, techniques] of positionData.attacks.entries()) {
      const key = `${position}-${attack}`;
      const techniquesSet = this.selectedTechniques.get(key);
      
      // Pour les attaques avec liste vide (Jiyu Waza), vérifier si la clé existe
      if (techniques.length === 0) {
        if (techniquesSet !== undefined) {
          hasAnySelection = true;
        } else {
          allAttacksSelected = false;
        }
        continue;
      }
      
      // Pour les attaques avec techniques
      const selectedCount = techniquesSet ? techniquesSet.size : 0;
      
      if (selectedCount > 0) {
        hasAnySelection = true;
      }
      
      // Si toutes les techniques de cette attaque ne sont pas sélectionnées, toutes les attaques ne sont pas sélectionnées
      if (selectedCount < techniques.length) {
        allAttacksSelected = false;
      }
    }
    
    // Indéterminé si certaines attaques/techniques sont sélectionnées mais pas toutes
    return hasAnySelection && !allAttacksSelected;
  }

  /**
   * Vérifie si une attaque est sélectionnée
   * Une attaque est sélectionnée si toutes ses techniques sont sélectionnées
   * Pour les attaques avec liste vide (Jiyu Waza), elles sont sélectionnées si la clé existe avec un Set vide
   */
  isAttackSelected(position: Position, attack: string): boolean {
    const positionData = this.hierarchicalData.get(position);
    if (!positionData) return false;
    
    const techniques = positionData.attacks.get(attack) || [];
    const key = `${position}-${attack}`;
    const techniquesSet = this.selectedTechniques.get(key);
    
    // Si l'attaque n'a pas de techniques (Jiyu Waza), elle est sélectionnée si la clé existe
    if (techniques.length === 0) {
      return techniquesSet !== undefined;
    }
    
    // Si l'attaque a des techniques, elle est sélectionnée si toutes ses techniques sont sélectionnées
    if (!techniquesSet) return false;
    return techniquesSet.size === techniques.length;
  }

  /**
   * Vérifie si une attaque est dans un état indéterminé (certaines techniques sélectionnées mais pas toutes)
   * Les attaques avec liste vide (Jiyu Waza) ne peuvent pas être indéterminées
   */
  isAttackIndeterminate(position: Position, attack: string): boolean {
    const positionData = this.hierarchicalData.get(position);
    if (!positionData) return false;
    
    const techniques = positionData.attacks.get(attack) || [];
    // Les attaques avec liste vide (Jiyu Waza) ne peuvent pas être indéterminées
    if (techniques.length === 0) return false;
    
    // Si l'attaque est complètement sélectionnée, elle n'est pas indéterminée
    if (this.isAttackSelected(position, attack)) return false;
    
    // Vérifier combien de techniques sont sélectionnées
    const key = `${position}-${attack}`;
    const techniquesSet = this.selectedTechniques.get(key);
    const selectedCount = techniquesSet ? techniquesSet.size : 0;
    
    // Indéterminé si certaines techniques sont sélectionnées mais pas toutes
    return selectedCount > 0 && selectedCount < techniques.length;
  }

  /**
   * Vérifie si une technique est sélectionnée
   */
  isTechniqueSelected(position: Position, attack: string, technique: string): boolean {
    const key = `${position}-${attack}`;
    const techniquesSet = this.selectedTechniques.get(key);
    if (!techniquesSet) return false;
    return techniquesSet.has(technique);
  }

  /**
   * Gère le toggle d'une position (avec cascade)
   * Inclut même les attaques avec des listes vides (Jiyu Waza)
   */
  onPositionToggle(position: Position, event?: Event): void {
    // Empêcher la propagation de l'événement si fourni
    if (event) {
      event.stopPropagation();
    }
    
    const isSelected = this.isPositionSelected(position);
    const positionData = this.hierarchicalData.get(position);
    
    if (!positionData) {
      console.warn(`[TechniqueFilterComponent] No data found for position: ${position}`);
      return;
    }
    
    if (isSelected) {
      // Désélectionner toutes les techniques de cette position (y compris les listes vides)
      const keysToDelete: string[] = [];
      this.selectedTechniques.forEach((_, key) => {
        if (key.startsWith(`${position}-`)) {
          keysToDelete.push(key);
        }
      });
      keysToDelete.forEach(key => this.selectedTechniques.delete(key));
    } else {
      // Sélectionner toutes les techniques de toutes les attaques de cette position
      // Inclure même les attaques sans techniques (Jiyu Waza) avec un Set vide
      positionData.attacks.forEach((techniques, attack) => {
        const key = `${position}-${attack}`;
        // Pour les attaques avec techniques, créer un Set avec toutes les techniques
        // Pour les attaques sans techniques (Jiyu Waza), créer un Set vide pour marquer la sélection
        const techniquesSet = new Set<string>(techniques);
        this.selectedTechniques.set(key, techniquesSet);
      });
    }
    
    // Mettre à jour l'état indéterminé après le changement
    setTimeout(() => this.updateIndeterminateStates(), 0);
  }

  /**
   * Gère le toggle d'une attaque (avec cascade)
   */
  onAttackToggle(position: Position, attack: string): void {
    const isSelected = this.isAttackSelected(position, attack);
    const key = `${position}-${attack}`;
    
    if (isSelected) {
      // Désélectionner toutes les techniques de cette attaque
      this.selectedTechniques.delete(key);
    } else {
      // Sélectionner toutes les techniques de cette attaque
      const positionData = this.hierarchicalData.get(position);
      if (positionData) {
        const techniques = positionData.attacks.get(attack) || [];
        const techniquesSet = new Set<string>(techniques);
        this.selectedTechniques.set(key, techniquesSet);
      }
    }
    
    // Mettre à jour l'état indéterminé après le changement
    setTimeout(() => this.updateIndeterminateStates(), 0);
  }

  /**
   * Gère le toggle d'une technique
   */
  onTechniqueToggle(position: Position, attack: string, technique: string): void {
    const key = `${position}-${attack}`;
    const techniquesSet = this.selectedTechniques.get(key) || new Set();
    
    if (techniquesSet.has(technique)) {
      // Désélectionner la technique
      techniquesSet.delete(technique);
      
      if (techniquesSet.size === 0) {
        // Si plus de techniques, supprimer la clé
        this.selectedTechniques.delete(key);
      } else {
        this.selectedTechniques.set(key, techniquesSet);
      }
    } else {
      // Sélectionner la technique
      techniquesSet.add(technique);
      this.selectedTechniques.set(key, techniquesSet);
    }
    
    // Mettre à jour l'état indéterminé après le changement
    setTimeout(() => this.updateIndeterminateStates(), 0);
  }

  /**
   * Change le mode d'affichage
   */
  onDisplayModeChange(mode: DisplayMode): void {
    this.displayMode = mode;
  }

  /**
   * Sélectionne tout
   */
  selectAll(): void {
    this.hierarchicalData.forEach((positionData, position) => {
      positionData.attacks.forEach((techniques, attack) => {
        const key = `${position}-${attack}`;
        const techniquesSet = new Set<string>(techniques);
        this.selectedTechniques.set(key, techniquesSet);
      });
    });
    
    // Mettre à jour l'état indéterminé après le changement
    setTimeout(() => this.updateIndeterminateStates(), 0);
  }

  /**
   * Désélectionne tout
   */
  deselectAll(): void {
    this.selectedTechniques.clear();
    
    // Mettre à jour l'état indéterminé après le changement
    setTimeout(() => this.updateIndeterminateStates(), 0);
  }

  /**
   * Vérifie s'il y a au moins une sélection
   */
  get hasSelection(): boolean {
    for (const techniquesSet of this.selectedTechniques.values()) {
      if (techniquesSet.size > 0) return true;
    }
    
    return false;
  }

  /**
   * Calcule le nombre total de techniques sélectionnées
   */
  get selectedTechniquesCount(): number {
    let count = 0;
    
    // Compter toutes les techniques sélectionnées
    this.selectedTechniques.forEach(techniquesSet => {
      count += techniquesSet.size;
    });
    
    return count;
  }

  /**
   * Applique la sélection et émet l'événement
   */
  apply(): void {
    if (!this.hasSelection) {
      return;
    }

    // Calculer les positions sélectionnées (toutes les attaques sont sélectionnées)
    const selectedPositions: Position[] = [];
    this.positions.forEach(position => {
      if (this.isPositionSelected(position)) {
        selectedPositions.push(position);
      }
    });

    const selection: HierarchicalSelection = {
      grade: this.grade,
      displayMode: 'all', // Toujours 'all', ne pas sauvegarder le displayMode
      selectedPositions: selectedPositions,
      selectedAttacks: this.convertAttacksMapToRecord(),
      selectedTechniques: this.convertTechniquesMapToRecord(),
      searchTerm: this.searchTerm
    };

    // Sauvegarder dans localStorage
    this.saveToLocalStorage(selection);

    // Émettre l'événement
    this.selectionApplied.emit(selection);
  }

  /**
   * Annule et ferme
   */
  cancel(): void {
    this.cancelled.emit();
  }

  /**
   * Applique une sélection chargée
   */
  private applySelection(selection: HierarchicalSelection): void {
    // Ne pas restaurer le displayMode, toujours garder 'all'
    this.displayMode = 'all';
    this.searchTerm = selection.searchTerm || '';

    // Charger les techniques (source de vérité)
    this.selectedTechniques.clear();
    Object.entries(selection.selectedTechniques).forEach(([key, techniques]) => {
      this.selectedTechniques.set(key, new Set(techniques));
    });
    
    // Les positions et attaques seront calculées automatiquement par isPositionSelected et isAttackSelected
  }

  /**
   * Convertit la Map des attaques en Record
   * Calcule les attaques sélectionnées à partir de selectedTechniques
   */
  private convertAttacksMapToRecord(): Record<Position, string[]> {
    const record: Record<Position, string[]> = {} as Record<Position, string[]>;
    
    this.hierarchicalData.forEach((positionData, position) => {
      const selectedAttacks: string[] = [];
      
      positionData.attacks.forEach((techniques, attack) => {
        if (this.isAttackSelected(position, attack)) {
          selectedAttacks.push(attack);
        }
      });
      
      if (selectedAttacks.length > 0) {
        record[position] = selectedAttacks;
      }
    });
    
    return record;
  }

  /**
   * Convertit la Map des techniques en Record
   */
  private convertTechniquesMapToRecord(): Record<string, string[]> {
    const record: Record<string, string[]> = {};
    this.selectedTechniques.forEach((techniquesSet, key) => {
      record[key] = Array.from(techniquesSet);
    });
    return record;
  }

  /**
   * Charge la sélection depuis localStorage
   */
  private loadFromLocalStorage(grade: string): void {
    try {
      const key = `technique-filter-selection-${grade}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        const selection: HierarchicalSelection = JSON.parse(stored);
        if (selection.grade === grade) {
          this.applySelection(selection);
        }
      }
    } catch (error) {
      console.error('[TechniqueFilterComponent] Error loading from localStorage:', error);
    }
  }

  /**
   * Sauvegarde la sélection dans localStorage
   */
  private saveToLocalStorage(selection: HierarchicalSelection): void {
    try {
      const key = `technique-filter-selection-${selection.grade}`;
      localStorage.setItem(key, JSON.stringify(selection));
    } catch (error) {
      console.error('[TechniqueFilterComponent] Error saving to localStorage:', error);
      // Gérer le cas où localStorage est plein
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.warn('[TechniqueFilterComponent] localStorage quota exceeded');
      }
    }
  }
}
