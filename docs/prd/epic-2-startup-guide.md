# Epic 2: Data Management & Configuration - Guide de Démarrage

**Epic:** 2 - Data Management & Configuration  
**Status:** 🚀 **READY TO START**  
**Start Date:** 2025-01-10  
**Epic 1 Status:** ✅ **COMPLETE** (100% - Toutes les stories validées QA)

---

## Executive Summary

L'Epic 2 établit les fondations de données essentielles pour la génération de passages. Cet epic implémente le chargement et le parsing des fichiers JSON (nomenclature et vidéos), complète le GradeService, et développe la page de configuration complète permettant à l'utilisateur de sélectionner le grade et tous les filtres nécessaires.

**Objective:** Implémenter la gestion complète des données et la page de configuration complète.

**Total Stories:** 9 stories  
**Estimated Complexity:** Moyenne à Élevée  
**Dependencies from Epic 1:** ✅ Toutes les dépendances sont en place

---

## Stories Overview

### Phase 1: Data Management (Stories 2.1-2.2)
**Focus:** Chargement et parsing des données JSON

1. **Story 2.1: JSON Data Loading Service**
   - Charger `nomenclature.json` et `videos.json` depuis assets
   - HttpClient Angular asynchrone
   - Cache et singleton pattern
   - Gestion d'erreurs

2. **Story 2.2: JSON Parsing and Data Structure**
   - Parser les données JSON
   - Créer structures TypeScript typées
   - Validation des données
   - Méthodes d'accès et filtrage

### Phase 2: Configuration UI (Stories 2.3-2.8)
**Focus:** Interface utilisateur de configuration

3. **Story 2.3: Grade Selection Interface**
   - Sélection du grade (6e Kyū à 5e Dan)
   - Interface claire et responsive

4. **Story 2.4: Time Configuration Controls**
   - Contrôles temps entre techniques
   - Contrôles durée totale
   - Validation min/max

5. **Story 2.5: Voice Selection Interface**
   - Sélection voix (masculin/féminin)
   - Intégration SettingsService

6. **Story 2.6: Position Filtering Interface**
   - Filtres positions (Suwariwaza, Hanmi Handachi, Tashiwaza, Armes)
   - Checkboxes/toggles
   - Note: Randori n'est pas une position, mais une annonce audio finale (Story 2.8)

7. **Story 2.7: Attack and Technique Filtering Interface**
   - Filtres attaques et techniques
   - Options dynamiques selon grade
   - Recherche et sélection multiple

8. **Story 2.8: Weapons and Randori Configuration**
   - Options armes (selon grade)
   - Option Randori: booléen pour activer/désactiver l'annonce audio finale "Randori"
   - Temps personnalisable pour l'annonce Randori
   - Logique conditionnelle (armes à partir du 3e Dan)
   - Note: Randori = annonce audio finale uniquement, pas de techniques dans nomenclature.json

### Phase 3: Integration (Story 2.9)
**Focus:** Intégration complète de la page

9. **Story 2.9: Configuration Page Complete Integration**
   - Intégration de toutes les sections
   - Bouton "Générer le passage"
   - Validation complète
   - Responsive design

---

## Prerequisites Check

### ✅ From Epic 1 - All Met

- ✅ **Infrastructure Angular:** Projet Angular 21 configuré et fonctionnel
- ✅ **GradeService:** Structure créée avec méthodes vides (Story 1.4)
- ✅ **Models:** Interfaces TypeScript définies :
  - ✅ `NomenclatureData` (nomenclature.model.ts)
  - ✅ `VideosData` (videos.model.ts)
  - ✅ `PassageFilters` (passage-filters.model.ts)
  - ✅ `Position` (position.model.ts)
  - ✅ `Technique` (technique.model.ts)
- ✅ **ConfigComponent:** Structure de base créée (Story 1.2)
- ✅ **SettingsService:** Complet avec localStorage (Story 1.5)
- ✅ **Assets Folders:** `src/assets/data/` créé (Story 1.1)
- ✅ **HttpClient:** Disponible (Angular standard)

### ⚠️ Missing Critical Items

#### 🚨 **CRITICAL: Fichiers JSON manquants**

**Fichiers requis:**
- ❌ `src/assets/data/nomenclature.json` - **MANQUANT** (obligatoire)
- ❌ `src/assets/data/videos.json` - **MANQUANT** (obligatoire)

**Impact:** Ces fichiers sont **absolument nécessaires** pour démarrer Story 2.1. Sans ces fichiers, le chargement des données ne peut pas être testé ou validé.

**Action requise:** 
- Créer les fichiers JSON avec la structure définie dans l'architecture
- OU utiliser des fichiers JSON de test/placeholder pour le développement

**Structure attendue pour `nomenclature.json`:**
```json
{
  "6e Kyū": {
    "Suwariwaza": {
      "Shomen Uchi": ["Ikkyo", "Nikyo", "Sankyo"],
      "Yokomen Uchi": ["Ikkyo", "Irimi Nage"]
    },
    "Tashiwaza": {
      "Katate Dori": ["Ikkyo", "Shihonage"]
    }
  },
  "5e Kyū": {
    ...
  }
}
```

**Structure attendue pour `videos.json`:**
```json
{
  "Shomen Uchi-Ikkyo": "https://example.com/video1.mp4",
  "Yokomen Uchi-Ikkyo": "https://example.com/video2.mp4"
}
```

---

## Current State Analysis

### GradeService (`src/app/services/grade.service.ts`)

**Current Status:** Structure de base créée, méthodes vides

**Methods to Implement:**
- ✅ `loadNomenclature()` - À implémenter (Story 2.1)
- ✅ `loadVideos()` - À implémenter (Story 2.1)
- ✅ `getTechniquesForGrade()` - À implémenter (Story 2.2)
- ✅ `validateGrade()` - À implémenter (Story 2.2)

**Dependencies:**
- ✅ HttpClient injecté
- ✅ BehaviorSubjects créés (nomenclature$, videos$)
- ✅ Imports corrects

### ConfigComponent (`src/app/pages/config/config.ts`)

**Current Status:** Structure basique avec gestion navigation

**To Add:**
- ❌ Logique de sélection de grade
- ❌ Contrôles de temps
- ❌ Filtres (positions, attaques, techniques)
- ❌ Validation
- ❌ Intégration GradeService
- ❌ Bouton "Générer le passage"

### Models

**All Models Ready:**
- ✅ `NomenclatureData` - Interface complète
- ✅ `VideosData` - Interface complète
- ✅ `PassageFilters` - Interface complète
- ✅ `Position` - Type défini
- ✅ `Technique` - Interface complète

---

## Implementation Plan

### 🔴 Priority 1: Data Files (Blocking)

**Task:** Créer les fichiers JSON de données

**Options:**
1. **Option A (Recommended for MVP):** Créer des fichiers JSON de test/placeholder avec structure minimale
   - Permet de démarrer le développement immédiatement
   - Structure conforme à l'architecture
   - Données minimales pour tester (1-2 grades, quelques techniques)

2. **Option B:** Attendre les fichiers JSON complets
   - Nécessite données réelles complètes
   - Retarde le démarrage du développement

**Recommendation:** Option A - Créer des fichiers placeholder pour démarrer rapidement.

### 🟡 Priority 2: Story 2.1 - JSON Data Loading

**Dependencies:** Fichiers JSON (Priority 1)

**Tasks:**
- Implémenter `loadNomenclature()` avec HttpClient
- Implémenter `loadVideos()` avec HttpClient
- Ajouter chargement automatique au démarrage (singleton)
- Implémenter cache dans BehaviorSubjects
- Gestion d'erreurs avec messages appropriés
- Indicateur de chargement
- Tests unitaires

### 🟡 Priority 3: Story 2.2 - JSON Parsing

**Dependencies:** Story 2.1

**Tasks:**
- Parser nomenclature.json → structure TypeScript
- Parser videos.json → mapping clé-valeur
- Validation structure et types
- Méthodes d'accès (par grade, position, attaque, technique)
- Méthodes de filtrage
- Gestion erreurs parsing
- Tests unitaires

### 🟢 Priority 4: Stories 2.3-2.8 - Configuration UI

**Dependencies:** Stories 2.1-2.2

**Can be developed in parallel once data loading works**

**Order Recommended:**
1. Story 2.3 (Grade Selection) - Base nécessaire
2. Story 2.5 (Voice Selection) - Simple, utilise SettingsService existant
3. Story 2.4 (Time Controls) - Indépendant
4. Story 2.6 (Position Filters) - Dépend du grade sélectionné
5. Story 2.7 (Attack/Technique Filters) - Dépend du grade sélectionné
6. Story 2.8 (Weapons/Randori) - Logique conditionnelle selon grade

### 🔵 Priority 5: Story 2.9 - Integration

**Dependencies:** All Stories 2.1-2.8

**Tasks:**
- Intégrer toutes les sections dans ConfigComponent
- Organiser layout responsive
- Bouton "Générer le passage" (redirige vers /passage)
- Validation complète de configuration
- Messages d'erreur clairs
- Design cohérent avec thème

---

## Critical Dependencies & Blockers

### 🔴 Blocker 1: Fichiers JSON manquants

**Severity:** CRITICAL  
**Impact:** Bloque Story 2.1 et toutes les stories suivantes  
**Solution:** Créer fichiers placeholder (voir Priority 1)

### 🟡 Dependency 1: HttpClient Configuration

**Status:** ✅ Déjà configuré (Angular standard)  
**Action:** Vérifier que `provideHttpClient()` est dans `app.config.ts`

**Check Required:**
```typescript
// app.config.ts should have:
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    // ...
  ]
};
```

---

## Technical Considerations

### Grades Available

Selon l'architecture, les grades disponibles sont :
- 6e Kyū
- 5e Kyū
- 4e Kyū
- 3e Kyū
- 2e Kyū
- 1er Kyū
- 1er Dan
- 2e Dan
- 3e Dan
- 4e Dan
- 5e Dan

**Total: 11 grades**

### Positions

Type `Position` défini:
- 'Suwariwaza'
- 'Hanmi Handachi'
- 'Tashiwaza'
- 'Armes'

**Note:** Randori n'est pas une position avec techniques. C'est une annonce audio finale configurable via un booléen + temps personnalisable (voir Story 2.8).

### Order Strict

**CRITICAL:** L'ordre strict doit être respecté lors de la génération :
1. Suwariwaza (premier)
2. Hanmi Handachi (deuxième)
3. Tashiwaza (troisième)
4. Armes (quatrième, si applicable selon grade)
5. [Optionnel] Annonce audio "Randori" (dernier, si activé dans la configuration)

**Note:** Cet ordre sera implémenté dans Epic 3, mais doit être pris en compte dans les filtres de l'Epic 2.

### Weapons Condition

**Important:** Les armes (Bokken, etc.) ne sont disponibles qu'à partir du **3e Dan**.

Cette logique doit être implémentée dans Story 2.8.

---

## Testing Strategy

### Unit Tests Required

**GradeService:**
- Tests de chargement nomenclature.json
- Tests de chargement videos.json
- Tests de parsing et validation
- Tests de méthodes d'accès
- Tests de filtrage
- Tests de gestion d'erreurs

**ConfigComponent:**
- Tests de sélection de grade
- Tests de validation
- Tests des filtres
- Tests d'intégration avec GradeService

### Integration Tests

- Test de chargement des données au démarrage
- Test de la page de configuration complète
- Test de validation avant génération

---

## File Structure to Create

```
src/assets/data/
  ├── nomenclature.json    ← À CRÉER (CRITICAL)
  └── videos.json          ← À CRÉER (CRITICAL)

docs/stories/
  ├── 2.1.json-data-loading-service.md
  ├── 2.2.json-parsing-data-structure.md
  ├── 2.3.grade-selection-interface.md
  ├── 2.4.time-configuration-controls.md
  ├── 2.5.voice-selection-interface.md
  ├── 2.6.position-filtering-interface.md
  ├── 2.7.attack-technique-filtering-interface.md
  ├── 2.8.weapons-randori-configuration.md
  └── 2.9.configuration-page-complete-integration.md
```

---

## Next Immediate Actions

### Action 1: Create JSON Placeholder Files (URGENT)

**File:** `src/assets/data/nomenclature.json`

Créer un fichier minimal avec structure valide pour permettre le développement :

```json
{
  "6e Kyū": {
    "Suwariwaza": {
      "Shomen Uchi": ["Ikkyo", "Nikyo"],
      "Yokomen Uchi": ["Ikkyo"]
    },
    "Tashiwaza": {
      "Katate Dori": ["Ikkyo", "Shihonage"]
    }
  },
  "5e Kyū": {
    "Suwariwaza": {
      "Shomen Uchi": ["Ikkyo", "Nikyo", "Sankyo"],
      "Yokomen Uchi": ["Ikkyo", "Nikyo"]
    },
    "Tashiwaza": {
      "Katate Dori": ["Ikkyo", "Shihonage", "Kote Gaeshi"]
    }
  }
}
```

**File:** `src/assets/data/videos.json`

Créer un fichier minimal avec quelques entrées :

```json
{
  "Shomen Uchi-Ikkyo": "https://example.com/videos/shomen-uchi-ikkyo.mp4",
  "Yokomen Uchi-Ikkyo": "https://example.com/videos/yokomen-uchi-ikkyo.mp4",
  "Katate Dori-Ikkyo": "https://example.com/videos/katate-dori-ikkyo.mp4"
}
```

### Action 2: Verify HttpClient Configuration

Vérifier que `provideHttpClient()` est dans `app.config.ts`.

### Action 3: Create Story Files

Créer les fichiers de stories individuelles dans `docs/stories/` (format similaire à Epic 1).

---

## Success Criteria

### Epic 2 Complete When:

- ✅ Tous les fichiers JSON chargés et parsés correctement
- ✅ GradeService complet avec toutes les méthodes implémentées
- ✅ Page de configuration complète avec toutes les sections
- ✅ Validation de configuration fonctionnelle
- ✅ Toutes les stories implémentées et validées QA
- ✅ Tests unitaires complets
- ✅ Build production fonctionnel
- ✅ Prêt pour Epic 3 (Passage Generation)

---

## Risks & Mitigation

### Risk 1: Fichiers JSON volumineux

**Risk:** Les fichiers JSON complets pourraient être volumineux  
**Mitigation:** 
- Chargement asynchrone (déjà prévu)
- Cache dans service (déjà prévu)
- Optimisation si nécessaire

### Risk 2: Structure JSON complexe

**Risk:** La structure hiérarchique (Grade → Position → Attaque → Technique) peut être complexe à parser  
**Mitigation:**
- Interfaces TypeScript bien définies (déjà fait)
- Validation stricte des données
- Tests unitaires complets

### Risk 3: Performance lors du filtrage

**Risk:** Le filtrage de grandes quantités de données peut être lent  
**Mitigation:**
- Cache des résultats filtrés
- Optimisation algorithmes
- Tests de performance

---

## Timeline Estimate

**Total Stories:** 9  
**Estimated Duration:** ~5-7 jours de développement

- **Phase 1 (Data):** 2-3 jours (Stories 2.1-2.2)
- **Phase 2 (UI):** 2-3 jours (Stories 2.3-2.8)
- **Phase 3 (Integration):** 1 jour (Story 2.9)

**Note:** Timeline dépend de la complexité réelle des fichiers JSON et de la logique de filtrage.

---

## Ready to Start Checklist

- [x] Epic 1 complet et validé
- [x] Infrastructure Angular prête
- [x] Services de base créés
- [x] Modèles TypeScript définis
- [x] ConfigComponent structure créée
- [ ] **Fichiers JSON créés (nomenclature.json, videos.json)** ← **ACTION REQUISE**
- [ ] HttpClient vérifié dans app.config.ts
- [ ] Stories individuelles créées (optionnel, peut être fait pendant développement)

---

## Immediate Next Steps

1. **🚨 CRITICAL:** Créer les fichiers JSON placeholder (`nomenclature.json` et `videos.json`)
2. **Vérifier:** HttpClient configuré dans `app.config.ts`
3. **Démarrer:** Story 2.1 - JSON Data Loading Service
4. **Créer:** Fichiers de stories individuelles si nécessaire

---

**Status:** ✅ **READY TO START** (après création des fichiers JSON)  
**Blockers:** 1 (fichiers JSON manquants)  
**Estimated Start:** 2025-01-10  
**Estimated Completion:** ~2025-01-17

---

**Created By:** Auto (BMAD Orchestrator)  
**Date:** 2025-01-10  
**Status:** Ready for Dev Agent
