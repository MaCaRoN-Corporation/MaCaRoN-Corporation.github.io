# Data Models

# Passage

**Purpose:** Représente un passage de grade généré avec sa séquence de techniques

**Key Attributes:**
- `id`: string - Identifiant unique du passage
- `grade`: string - Grade sélectionné (ex: "6e Kyū", "1er Dan")
- `techniques`: Technique[] - Liste ordonnée des techniques du passage
- `duration`: number - Durée totale configurée (en minutes)
- `timeBetweenTechniques`: number - Temps entre chaque technique (en secondes)
- `voice`: 'masculin' | 'féminin' - Type de voix sélectionné
- `filters`: PassageFilters - Filtres appliqués lors de la génération
- `createdAt`: Date - Date de création du passage
- `completedAt`: Date | null - Date de fin du passage (null si non terminé)

**TypeScript Interface:**
```typescript
interface Passage {
  id: string;
  grade: string;
  techniques: Technique[];
  duration: number;
  timeBetweenTechniques: number;
  voice: 'masculin' | 'féminin';
  filters: PassageFilters;
  createdAt: Date;
  completedAt: Date | null;
}
```

**Relationships:**
- Contient plusieurs `Technique`
- Stocké dans `localStorage` pour l'historique
- Généré par `PassageService` à partir de `GradeService`

## Technique

**Purpose:** Représente une technique individuelle dans un passage

**Key Attributes:**
- `attack`: string - Type d'attaque (ex: "Shomen Uchi")
- `technique`: string - Nom de la technique (ex: "Ikkyo")
- `position`: Position - Position de la technique (Suwariwaza, Hanmi Handachi, Tashiwaza, Armes, Randori)
- `order`: number - Ordre dans la séquence du passage
- `videoUrl`: string | null - URL de la vidéo associée (depuis videos.json)

**TypeScript Interface:**
```typescript
interface Technique {
  attack: string;
  technique: string;
  position: Position;
  order: number;
  videoUrl: string | null;
}
```

**Relationships:**
- Appartient à un `Passage`
- Référence une vidéo optionnelle depuis `videos.json`
- Utilisée par `AudioService` pour l'annonce audio

## NomenclatureData

**Purpose:** Structure des données de nomenclature chargées depuis nomenclature.json

**Key Attributes:**
- `grades`: Record<string, GradeData> - Données organisées par grade
- Chaque grade contient: `positions` → `attacks` → `techniques`

**TypeScript Interface:**
```typescript
interface NomenclatureData {
  [grade: string]: {
    [position: string]: {
      [attack: string]: string[]; // Liste des techniques
    };
  };
}

type Position = 'Suwariwaza' | 'Hanmi Handachi' | 'Tashiwaza' | 'Armes' | 'Randori';
```

**Relationships:**
- Chargé par `GradeService` depuis `assets/data/nomenclature.json`
- Utilisé pour générer les passages selon le grade sélectionné

## VideosData

**Purpose:** Mapping des techniques vers leurs URLs vidéo

**Key Attributes:**
- Clé: string - Format "attaque-technique" (ex: "Shomen Uchi-Ikkyo")
- Valeur: string - URL de la vidéo

**TypeScript Interface:**
```typescript
interface VideosData {
  [key: string]: string; // "attaque-technique": "url"
}
```

**Relationships:**
- Chargé par `GradeService` depuis `assets/data/videos.json`
- Utilisé par `ExportService` pour inclure les liens vidéo dans l'export

## PassageFilters

**Purpose:** Filtres appliqués lors de la génération d'un passage

**Key Attributes:**
- `positions`: Position[] - Positions incluses (par défaut toutes)
- `attacks`: string[] - Attaques spécifiques (optionnel, vide = toutes)
- `techniques`: string[] - Techniques spécifiques (optionnel, vide = toutes)
- `includeWeapons`: boolean - Inclure les armes (selon grade)
- `includeRandori`: boolean - Inclure le Randori

**TypeScript Interface:**
```typescript
interface PassageFilters {
  positions: Position[];
  attacks: string[];
  techniques: string[];
  includeWeapons: boolean;
  includeRandori: boolean;
}
```

**Relationships:**
- Utilisé par `PassageService` pour générer le passage
- Sauvegardé avec le passage dans l'historique

## UserSettings

**Purpose:** Réglages utilisateur persistés dans localStorage

**Key Attributes:**
- `theme`: 'clair' | 'sombre' - Thème sélectionné
- `voice`: 'masculin' | 'féminin' - Voix par défaut
- `bannerColor`: string - Couleur personnalisée de la bannière (hex)
- `footerColor`: string - Couleur personnalisée du footer (hex)
- `elevenlabsApiKey`: string | null - Clé API Elevenlabs (optionnelle)

**TypeScript Interface:**
```typescript
interface UserSettings {
  theme: 'clair' | 'sombre';
  voice: 'masculin' | 'féminin';
  bannerColor: string;
  footerColor: string;
  elevenlabsApiKey: string | null;
}
```

**Relationships:**
- Géré par `SettingsService`
- Persisté dans `localStorage`
- Appliqué globalement à l'application

---
