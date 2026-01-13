# Brainstorming: Interface Hiérarchique de Filtrage (Positions → Attaques → Techniques)

**Date:** 2025-01-10  
**Contexte:** Refonte des Stories 2.6, 2.7, 2.8 pour une interface unifiée  
**Objectif:** Concevoir la meilleure interface pour sélectionner positions, attaques et techniques de manière hiérarchique

---

## Contexte et Besoins

### Structure Hiérarchique
```
Position (niveau 1)
  └── Attaque (niveau 2)
      └── Technique (niveau 3)
```

### Cas d'Usage Identifiés

1. **Sélection par Position** (sélection large)
   - Utilisateur sélectionne des positions spécifiques
   - → Toutes les attaques et techniques de ces positions sont incluses

2. **Sélection par Attaque** (sélection moyenne)
   - Utilisateur sélectionne des attaques précises dans des positions
   - → Toutes les techniques des attaques sélectionnées sont incluses

3. **Sélection par Technique** (sélection fine)
   - Utilisateur sélectionne des techniques précises d'attaque et de position
   - → Seulement les techniques sélectionnées sont incluses

### Contraintes Techniques
- **Desktop:** Popup (fenêtre flottante)
- **Mobile:** Modal (plein écran ou presque)
- **Responsive:** Adaptation selon la taille d'écran
- **Accessibilité:** Navigation clavier, lecteurs d'écran

---

## Approches UX/UI Explorées

### Approche 1: Arbre Expandable/Collapsible (Tree View)

**Concept:**
- Structure arborescente avec expand/collapse
- Checkboxes à chaque niveau
- Sélection parente sélectionne automatiquement tous les enfants

**Avantages:**
- ✅ Vue d'ensemble claire de la hiérarchie
- ✅ Permet de voir toutes les options en même temps
- ✅ Navigation intuitive (expand/collapse)
- ✅ Bon pour desktop avec beaucoup d'espace

**Inconvénients:**
- ❌ Peut être encombré sur mobile
- ❌ Scroll long si beaucoup de données
- ❌ Complexité visuelle si beaucoup de niveaux

**Exemple Visuel:**
```
☑ Suwariwaza
  ├─ ☑ Shomen Uchi
  │   ├─ ☑ Ikkyo
  │   ├─ ☑ Nikyo
  │   └─ ☑ Sankyo
  └─ ☑ Yokomen Uchi
      └─ ☑ Irimi Nage
```

**Implémentation:**
- Composant Angular récursif pour l'arbre
- Gestion d'état pour expand/collapse
- Logique de sélection en cascade (parent → enfants)

---

### Approche 2: Navigation par Onglets/Étapes (Wizard-like)

**Concept:**
- 3 étapes/onglets: Positions → Attaques → Techniques
- Navigation séquentielle ou par onglets
- Chaque étape filtre la suivante

**Avantages:**
- ✅ Interface simple et claire
- ✅ Bon pour mobile (une étape à la fois)
- ✅ Réduit la complexité cognitive
- ✅ Facile à implémenter

**Inconvénients:**
- ❌ Nécessite de naviguer entre les étapes
- ❌ Moins de vue d'ensemble
- ❌ Peut être frustrant si besoin de revenir en arrière

**Exemple Visuel:**
```
[Positions] [Attaques] [Techniques]
────────────────────────────────────
Étape 1: Sélectionnez les positions
☑ Suwariwaza
☑ Hanmi Handachi
☐ Tashiwaza
☐ Armes

[Suivant] [Annuler]
```

**Implémentation:**
- Composant avec état d'étape actuelle
- Filtrage progressif des données
- Navigation avec boutons Précédent/Suivant

---

### Approche 3: Vue en Colonnes (Multi-Column Layout)

**Concept:**
- 3 colonnes côte à côte (desktop) ou empilées (mobile)
- Sélection dans une colonne filtre la suivante
- Vue d'ensemble de la hiérarchie

**Avantages:**
- ✅ Vue d'ensemble excellente
- ✅ Feedback visuel immédiat (filtrage en temps réel)
- ✅ Permet de voir les relations entre niveaux
- ✅ Très bon pour desktop

**Inconvénients:**
- ❌ Peut être encombré sur mobile
- ❌ Nécessite beaucoup d'espace horizontal
- ❌ Scroll horizontal possible sur petits écrans

**Exemple Visuel (Desktop):**
```
┌─────────────┬─────────────┬─────────────┐
│ Positions   │ Attaques    │ Techniques  │
├─────────────┼─────────────┼─────────────┤
│ ☑ Suwariwaza│ ☑ Shomen    │ ☑ Ikkyo     │
│ ☑ Hanmi     │   Uchi      │ ☑ Nikyo     │
│ ☐ Tashiwaza │ ☑ Yokomen   │ ☑ Sankyo    │
│ ☐ Armes     │   Uchi      │ ☑ Irimi     │
└─────────────┴─────────────┴─────────────┘
```

**Implémentation:**
- Layout CSS Grid ou Flexbox
- Filtrage réactif entre colonnes
- Responsive avec stack vertical sur mobile

---

### Approche 4: Accordéon Hiérarchique avec Sélection

**Concept:**
- Accordéons imbriqués pour chaque niveau
- Checkboxes à chaque niveau
- Expansion/collapse par section

**Avantages:**
- ✅ Économise l'espace vertical
- ✅ Bon pour mobile (sections empilées)
- ✅ Permet de se concentrer sur une section à la fois
- ✅ Vue organisée par catégories

**Inconvénients:**
- ❌ Nécessite plusieurs clics pour voir tout
- ❌ Moins de vue d'ensemble
- ❌ Peut être frustrant si beaucoup de sections

**Exemple Visuel:**
```
▼ Suwariwaza (3 attaques sélectionnées)
  ▼ Shomen Uchi (2 techniques sélectionnées)
    ☑ Ikkyo
    ☑ Nikyo
    ☐ Sankyo
  ▶ Yokomen Uchi
▶ Hanmi Handachi
```

**Implémentation:**
- Composants accordéon Angular
- Gestion d'état pour sections ouvertes/fermées
- Compteurs de sélection par section

---

### Approche 5: Vue Mixte (Recommandée)

**Concept:**
- **Desktop:** Vue en colonnes (Approche 3) avec arbre expandable optionnel
- **Mobile:** Navigation par étapes (Approche 2) ou accordéon (Approche 4)
- Bouton de bascule entre vue simplifiée et vue détaillée

**Avantages:**
- ✅ Optimisé pour chaque plateforme
- ✅ Flexibilité pour l'utilisateur
- ✅ Meilleure expérience sur tous les appareils
- ✅ Permet d'adapter selon les préférences

**Inconvénients:**
- ❌ Plus complexe à implémenter
- ❌ Nécessite plus de tests
- ❌ Plus de code à maintenir

**Implémentation:**
- Composant responsive avec breakpoints
- Détection de la taille d'écran
- Mode de vue configurable (simple/détaillé)

---

## Recommandations Spécifiques

### Structure de Données pour la Sélection

```typescript
/**
 * Mode d'affichage de la liste
 */
type DisplayMode = 'positions' | 'positions-attacks' | 'all';

/**
 * Sélection hiérarchique pour le mode révision
 */
interface HierarchicalSelection {
  // Mode d'affichage actuel
  displayMode: DisplayMode;
  
  // Sélections par niveau (structure hiérarchique)
  selectedPositions: Position[];
  selectedAttacks: Map<Position, string[]>; // Position → Attaques[]
  selectedTechniques: Map<string, string[]>; // "Position-Attaque" → Techniques[]
  
  // Résultat final (calculé)
  finalTechniques: Technique[];
  
  // Terme de recherche
  searchTerm: string;
}

interface Technique {
  position: Position;
  attack: string;
  technique: string;
}

/**
 * Structure pour l'affichage dans la liste
 */
interface HierarchicalItem {
  type: 'position' | 'attack' | 'technique';
  id: string;
  label: string;
  parentId?: string;
  children?: HierarchicalItem[];
  isSelected: boolean;
  isExpanded?: boolean; // Pour l'affichage expandable
}
```

### Logique de Sélection

**Règles de Sélection (Cascade):**
1. ✅ **Sélection parent → enfants:** Sélectionner une position sélectionne automatiquement toutes ses attaques et techniques
2. ✅ **Sélection attaque → techniques:** Sélectionner une attaque sélectionne automatiquement toutes ses techniques
3. ✅ **Désélection parent → enfants:** Désélectionner une position désélectionne automatiquement toutes ses attaques et techniques
4. ✅ **Désélection attaque → techniques:** Désélectionner une attaque désélectionne automatiquement toutes ses techniques

**Exemple:**
- Position "Suwariwaza" sélectionnée → toutes les attaques et techniques de Suwariwaza sont sélectionnées
- Si "Shomen Uchi" est désélectionné dans Suwariwaza → toutes les techniques de Shomen Uchi sont désélectionnées
- Si "Ikkyo" est explicitement désélectionné → Ikkyo est désélectionné même si Shomen Uchi est sélectionné

**Validation:**
- Au moins une sélection requise (position, attaque ou technique)
- Le bouton "Appliquer" est désactivé si aucune sélection

### Interface Utilisateur Finale

#### Desktop (Popup) - 4 Colonnes par Position
```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  Filtres de Techniques (Mode Révision)                                              │
│  ─────────────────────────────────────────────────────────────────────────────────  │
│                                                                                      │
│  🔍 [Rechercher...]                                    [P] [P+A] [Tout]             │
│                                                                                      │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐                    │
│  │ Suwariwaza    │ Hanmi        │ Tashiwaza    │ Armes        │                    │
│  ├──────────────┼──────────────┼──────────────┼──────────────┤                    │
│  │ ☐ Position   │ ☐ Position   │ ☐ Position   │ ☐ Position   │                    │
│  │              │              │              │              │                    │
│  │ ☐ Shomen Uchi│ ☐ Shomen Uchi│ ☐ Shomen Uchi│ ☐ Tanto Dori │                    │
│  │   ☐ Ikkyo    │   ☐ Ikkyo    │   ☐ Ikkyo    │   ☐ Chudan   │                    │
│  │   ☐ Nikyo    │   ☐ Nikyo    │   ☐ Nikyo    │     Tsuki    │                    │
│  │   ☐ Sankyo   │   ☐ Sankyo   │   ☐ Sankyo   │     ☐ Ikkyo   │                    │
│  │              │              │              │     ☐ Nikyo   │                    │
│  │ ☐ Yokomen    │ ☐ Yokomen    │ ☐ Yokomen    │              │                    │
│  │   Uchi       │   Uchi       │   Uchi       │ ☐ Jo Dori    │                    │
│  │   ☐ Irimi    │   ☐ Irimi    │   ☐ Irimi    │   ☐ Ikkyo     │                    │
│  │     Nage     │     Nage     │     Nage     │   ☐ Nikyo     │                    │
│  │              │              │              │              │                    │
│  │ ☐ ...        │ ☐ ...        │ ☐ ...        │ ☐ ...        │                    │
│  └──────────────┴──────────────┴──────────────┴──────────────┘                    │
│                                                                                      │
│  Résumé: 0 technique(s) sélectionnée(s)                                             │
│  ⚠️ Au moins une sélection requise                                                  │
│                                                                                      │
│  [Tout sélectionner] [Tout désélectionner]                                          │
│                                                                                      │
│  [Annuler]                                          [Appliquer]                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

**Note:** Chaque colonne affiche :
- Une checkbox pour la position (sélectionne tout dans cette colonne)
- Les attaques de cette position (avec leurs checkboxes)
- Les techniques de chaque attaque (avec leurs checkboxes)
- L'indentation visuelle montre la hiérarchie (attaque → techniques)

#### Mobile (Modal)
```
┌─────────────────────────────────┐
│  Filtres Techniques (Révision)  │
│  ─────────────────────────────  │
│                                 │
│  🔍 [Rechercher...]             │
│  [P] [P+A] [Tout]               │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  ☐ Suwariwaza                  │
│    ├─ ☐ Shomen Uchi            │
│    │   ├─ ☐ Ikkyo              │
│    │   ├─ ☐ Nikyo              │
│    │   └─ ☐ Sankyo             │
│    └─ ☐ Yokomen Uchi           │
│                                 │
│  ☐ Hanmi Handachi              │
│    └─ ☐ Shomen Uchi            │
│                                 │
│  ☐ Tashiwaza                   │
│                                 │
│  ☐ Armes                       │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  0 technique(s) sélectionnée(s) │
│  ⚠️ Au moins une sélection      │
│                                 │
│  [Tout sélectionner]            │
│  [Tout désélectionner]           │
│                                 │
│  [Annuler]      [Appliquer]     │
└─────────────────────────────────┘
```

#### Exemple avec Sélections (Desktop - 4 Colonnes)
```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  Filtres de Techniques (Mode Révision)                                              │
│  ─────────────────────────────────────────────────────────────────────────────────  │
│                                                                                      │
│  🔍 [Rechercher...]                                    [P] [P+A] [Tout] ✓           │
│                                                                                      │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐                    │
│  │ Suwariwaza    │ Hanmi        │ Tashiwaza    │ Armes        │                    │
│  ├──────────────┼──────────────┼──────────────┼──────────────┤                    │
│  │ ☑ Position   │ ☐ Position   │ ☐ Position   │ ☐ Position   │                    │
│  │              │              │              │              │                    │
│  │ ☑ Shomen Uchi│ ☐ Shomen Uchi│ ☐ Shomen Uchi│ ☐ Tanto Dori │                    │
│  │   ☑ Ikkyo    │   ☐ Ikkyo    │   ☐ Ikkyo    │   ☐ Chudan   │                    │
│  │   ☑ Nikyo    │   ☐ Nikyo    │   ☐ Nikyo    │     Tsuki    │                    │
│  │   ☑ Sankyo    │   ☐ Sankyo   │   ☐ Sankyo   │     ☐ Ikkyo   │                    │
│  │              │              │              │     ☐ Nikyo   │                    │
│  │ ☑ Yokomen    │ ☐ Yokomen    │ ☐ Yokomen    │              │                    │
│  │   Uchi       │   Uchi       │   Uchi       │ ☐ Jo Dori    │                    │
│  │   ☑ Irimi    │   ☐ Irimi    │   ☐ Irimi    │   ☐ Ikkyo     │                    │
│  │     Nage     │     Nage     │     Nage     │   ☐ Nikyo     │                    │
│  │              │              │              │              │                    │
│  │ ☐ ...        │ ☐ ...        │ ☐ ...        │ ☐ ...        │                    │
│  └──────────────┴──────────────┴──────────────┴──────────────┘                    │
│                                                                                      │
│  Résumé: 5 technique(s) sélectionnée(s) ✓                                             │
│                                                                                      │
│  [Tout sélectionner] [Tout désélectionner]                                          │
│                                                                                      │
│  [Annuler]                                          [Appliquer] ✓                   │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Spécifications Finales Validées

### 1. Mode de Sélection par Défaut
- ✅ **Par défaut, rien n'est sélectionné**
- ✅ **Validation:** Au moins une sélection requise pour lancer le passage
- ✅ **Mode de passage:** Uniquement disponible pour le mode "révision"
- ✅ **Visibilité:** Le bouton d'affichage de la liste sera invisible dans les autres modes de passage

### 2. Comportement des Sélections
- ✅ **Sélection en cascade:** Sélectionner une catégorie sélectionne automatiquement tous ses enfants
  - Sélectionner une position → sélectionne toutes ses attaques et techniques
  - Sélectionner une attaque → sélectionne toutes ses techniques
  - Désélectionner une catégorie → désélectionne tous ses enfants

### 3. Barre de Recherche
- ✅ **Recherche:** Barre de recherche pour filtrer et afficher uniquement les correspondances
- ✅ **Filtrage en temps réel:** La liste se met à jour pendant la saisie

### 4. Sauvegarde
- ✅ **localStorage:** Sauvegarder la sélection dans localStorage pour réutilisation

### 5. Affichage
- ✅ **Liste de sélection multiple:** Liste avec cases à cocher par catégorie et sous-catégorie
- ✅ **Boutons de filtre (en haut à droite):**
  - **Bouton 1:** Afficher que les positions
  - **Bouton 2:** Afficher positions + attaques
  - **Bouton 3:** Afficher tout (positions + attaques + techniques)

---

## Implémentation Technique

### Composant Angular

**Fichier:** `src/app/components/technique-filter/technique-filter.component.ts`

```typescript
@Component({
  selector: 'app-technique-filter',
  templateUrl: './technique-filter.component.html',
  styleUrls: ['./technique-filter.component.scss']
})
export class TechniqueFilterComponent {
  // Mode d'affichage
  displayMode: DisplayMode = 'all';
  
  // Terme de recherche
  searchTerm: string = '';
  
  // Structure hiérarchique des données
  hierarchicalData: HierarchicalItem[] = [];
  
  // Sélections
  selectedPositions: Set<Position> = new Set();
  selectedAttacks: Map<Position, Set<string>> = new Map();
  selectedTechniques: Map<string, Set<string>> = new Map(); // "Position-Attaque" → Set<Technique>
  
  // État d'expansion (pour l'affichage)
  expandedItems: Set<string> = new Set();
  
  // Validation
  get hasSelection(): boolean {
    return this.selectedPositions.size > 0 || 
           Array.from(this.selectedAttacks.values()).some(set => set.size > 0) ||
           Array.from(this.selectedTechniques.values()).some(set => set.size > 0);
  }
  
  get selectedTechniquesCount(): number {
    // Calculer le nombre total de techniques sélectionnées
    // (en tenant compte de la cascade)
  }
  
  // Méthodes
  onItemToggle(item: HierarchicalItem): void {
    // Gérer la sélection/désélection avec cascade
  }
  
  onDisplayModeChange(mode: DisplayMode): void {
    this.displayMode = mode;
    // Filtrer l'affichage selon le mode
  }
  
  onSearchChange(term: string): void {
    this.searchTerm = term;
    // Filtrer la liste selon le terme de recherche
  }
  
  selectAll(): void {
    // Sélectionner toutes les positions (cascade automatique)
  }
  
  deselectAll(): void {
    // Désélectionner tout
  }
  
  apply(): void {
    // Valider et retourner la sélection
    if (!this.hasSelection) {
      // Afficher erreur
      return;
    }
    // Émettre la sélection
  }
  
  loadFromLocalStorage(): void {
    // Charger la sélection sauvegardée
  }
  
  saveToLocalStorage(): void {
    // Sauvegarder la sélection
  }
}
```

### Intégration dans ConfigComponent

**Condition d'affichage:**
```typescript
get shouldShowTechniqueFilter(): boolean {
  return this.passageMode === 'revision';
}
```

**Ouverture de la popup/modal:**
```typescript
openTechniqueFilter(): void {
  // Détecter si on est sur mobile ou desktop
  const isMobile = window.innerWidth < 768;
  
  // Ouvrir popup (desktop) ou modal (mobile)
  const dialogRef = this.dialog.open(TechniqueFilterComponent, {
    width: isMobile ? '100vw' : '1200px', // Desktop: 4 colonnes nécessitent plus d'espace
    maxWidth: '100vw',
    maxHeight: '90vh',
    panelClass: isMobile ? 'technique-filter-modal-mobile' : 'technique-filter-popup-desktop',
    data: {
      grade: this.selectedGrade,
      currentSelection: this.currentTechniqueSelection,
      isMobile: isMobile
    }
  });
  
  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.currentTechniqueSelection = result;
      this.saveToLocalStorage();
    }
  });
}
```

**Template HTML pour Desktop (4 colonnes):**
```html
<div class="technique-filter-container" [class.mobile]="isMobile">
  <!-- Header avec recherche et filtres -->
  <div class="filter-header">
    <input 
      type="text" 
      class="search-input"
      placeholder="Rechercher..."
      [(ngModel)]="searchTerm"
      (input)="onSearchChange($event.target.value)">
    
    <div class="display-mode-buttons">
      <button 
        *ngFor="let mode of displayModes"
        [class.active]="displayMode === mode.id"
        (click)="onDisplayModeChange(mode.id)">
        {{ mode.label }}
      </button>
    </div>
  </div>
  
  <!-- Liste en 4 colonnes (Desktop) -->
  <div class="positions-grid" *ngIf="!isMobile">
    <div 
      *ngFor="let position of positions" 
      class="position-column">
      <div class="position-header">
        <label class="position-checkbox">
          <input 
            type="checkbox"
            [checked]="isPositionSelected(position)"
            (change)="onPositionToggle(position)">
          <span>{{ position }}</span>
        </label>
      </div>
      
      <div class="attacks-list">
        <div 
          *ngFor="let attack of getAttacksForPosition(position)"
          class="attack-item">
          <label class="attack-checkbox">
            <input 
              type="checkbox"
              [checked]="isAttackSelected(position, attack)"
              (change)="onAttackToggle(position, attack)">
            <span>{{ attack }}</span>
          </label>
          
          <div 
            *ngIf="displayMode === 'all'"
            class="techniques-list">
            <label 
              *ngFor="let technique of getTechniquesForPositionAttack(position, attack)"
              class="technique-checkbox">
              <input 
                type="checkbox"
                [checked]="isTechniqueSelected(position, attack, technique)"
                (change)="onTechniqueToggle(position, attack, technique)">
              <span>{{ technique }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Liste verticale (Mobile) -->
  <div class="positions-list" *ngIf="isMobile">
    <!-- Structure similaire mais en liste verticale -->
  </div>
  
  <!-- Footer avec actions -->
  <div class="filter-footer">
    <div class="selection-summary">
      {{ selectedTechniquesCount }} technique(s) sélectionnée(s)
      <span *ngIf="!hasSelection" class="error-message">
        ⚠️ Au moins une sélection requise
      </span>
    </div>
    
    <div class="action-buttons">
      <button (click)="selectAll()">Tout sélectionner</button>
      <button (click)="deselectAll()">Tout désélectionner</button>
    </div>
    
    <div class="dialog-actions">
      <button (click)="cancel()">Annuler</button>
      <button 
        [disabled]="!hasSelection"
        (click)="apply()">
        Appliquer
      </button>
    </div>
  </div>
</div>
```

**Styles SCSS pour Desktop (4 colonnes):**
```scss
.technique-filter-popup-desktop {
  .positions-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    padding: 1rem;
    max-height: 60vh;
    overflow-y: auto;
    
    .position-column {
      border-right: 1px solid var(--border-color);
      padding-right: 1rem;
      
      &:last-child {
        border-right: none;
      }
      
      .position-header {
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid var(--primary-color);
        
        .position-checkbox {
          font-weight: bold;
          font-size: 1.1rem;
        }
      }
      
      .attacks-list {
        .attack-item {
          margin-bottom: 0.75rem;
          
          .attack-checkbox {
            font-weight: 500;
            margin-bottom: 0.25rem;
          }
          
          .techniques-list {
            margin-left: 1.5rem;
            margin-top: 0.25rem;
            
            .technique-checkbox {
              font-size: 0.9rem;
              margin-bottom: 0.25rem;
            }
          }
        }
      }
    }
  }
  
  // Responsive: 2 colonnes sur tablettes
  @media (max-width: 1024px) {
    .positions-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}
```

### Styles Responsive

**Desktop (Popup - 4 Colonnes):**
- Largeur: 1000-1200px (pour accommoder 4 colonnes)
- Hauteur: 80vh max
- Position: centré à l'écran
- Backdrop: semi-transparent
- Layout: CSS Grid avec 4 colonnes égales
- Chaque colonne:
  - Scroll vertical indépendant si nécessaire
  - Padding uniforme
  - Bordure droite pour séparation (sauf dernière colonne)
- Responsive: Sur écrans moyens (tablette), passer à 2 colonnes (2x2)

**Mobile (Modal - Liste Verticale):**
- Largeur: 100vw
- Hauteur: 90vh max
- Position: en bas de l'écran (slide up)
- Backdrop: opaque
- Layout: Liste verticale avec sections par position
- Chaque position en section expandable/collapsible

## Prochaines Étapes

1. ✅ **Spécifications validées** avec l'utilisateur
2. **Créer le composant** `TechniqueFilterComponent`
3. **Implémenter la logique** de sélection en cascade
4. **Intégrer dans ConfigComponent** avec condition mode "révision"
5. **Ajouter popup/modal** responsive (desktop/mobile)
6. **Implémenter la sauvegarde** localStorage
7. **Tester** sur différents appareils et tailles d'écran
8. **Mettre à jour les stories** 2.6, 2.7, 2.8 avec la nouvelle approche unifiée

---

## Références

- [Angular Material Dialog](https://material.angular.io/components/dialog/overview) - Pour popup/modal
- [Angular CDK Overlay](https://material.angular.io/cdk/overlay/overview) - Alternative pour popup
- [Tree Component Patterns](https://www.patterns.dev/posts/tree-component-pattern) - Patterns pour composants arborescents
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) - Accessibilité
