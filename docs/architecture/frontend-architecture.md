# Frontend Architecture

# Component Architecture

### Component Organization

```
src/app/
├── components/              # Composants réutilisables
│   ├── navigation/
│   │   └── navigation.component.ts
│   ├── timer/
│   │   └── timer-display.component.ts
│   ├── progress/
│   │   └── progress-bar.component.ts
│   └── technique/
│       └── technique-display.component.ts
├── pages/                   # Composants de page (routes)
│   ├── home/
│   │   └── home.component.ts
│   ├── config/
│   │   └── config.component.ts
│   ├── passage/
│   │   └── passage.component.ts
│   ├── settings/
│   │   └── settings.component.ts
│   └── history/
│       └── history.component.ts
├── services/                # Services Angular
│   ├── grade.service.ts
│   ├── passage.service.ts
│   ├── audio.service.ts
│   ├── settings.service.ts
│   └── export.service.ts
├── models/                  # Interfaces TypeScript
│   ├── passage.model.ts
│   ├── technique.model.ts
│   └── settings.model.ts
├── guards/                  # Route guards (si nécessaire)
├── interceptors/           # HTTP interceptors (si nécessaire)
└── utils/                  # Utilitaires
    └── date.utils.ts
```

### Component Template

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss']
})
export class ExampleComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();

  constructor(
    private exampleService: ExampleService
  ) {}

  ngOnInit(): void {
    // Initialisation
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
```

## State Management Architecture

### State Structure

```typescript
// Passage State (via PassageService)
interface PassageState {
  currentPassage: Passage | null;
  currentTechniqueIndex: number;
  isPlaying: boolean;
  isPaused: boolean;
  elapsedTime: number;
  progress: number; // 0-100
}

// Settings State (via SettingsService)
interface SettingsState {
  settings: UserSettings;
  isLoaded: boolean;
}
```

### State Management Patterns

- **BehaviorSubject pour état réactif:** Chaque service expose un BehaviorSubject pour l'état
- **Observables pour souscriptions:** Composants souscrivent aux observables des services
- **Unsubscribe pattern:** Tous les composants gèrent proprement les unsubscriptions
- **Pas de store global:** Pas besoin de NgRx, services suffisants pour cette taille d'application

## Routing Architecture

### Route Organization

```typescript
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'config', component: ConfigComponent },
  { path: 'passage', component: PassageComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'history', component: HistoryComponent },
  { path: '**', redirectTo: '' } // 404 -> Home
];
```

### Protected Route Pattern

**N/A - Pas de routes protégées**

Application publique sans authentification. Toutes les routes sont accessibles.

## Frontend Services Layer

### API Client Setup

**N/A - Pas d'API backend**

Les services communiquent avec:
- **Assets JSON:** Via HttpClient Angular pour charger les fichiers statiques
- **localStorage:** Via l'API native du navigateur
- **Elevenlabs API:** Via Fetch API directement depuis le service

### Service Example

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GradeService {
  private nomenclature$ = new BehaviorSubject<NomenclatureData | null>(null);
  private videos$ = new BehaviorSubject<VideosData | null>(null);

  constructor(private http: HttpClient) {
    this.loadData();
  }

  private loadData(): void {
    this.http.get<NomenclatureData>('assets/data/nomenclature.json')
      .subscribe(data => this.nomenclature$.next(data));
    
    this.http.get<VideosData>('assets/data/videos.json')
      .subscribe(data => this.videos$.next(data));
  }

  getTechniquesForGrade(grade: string, filters: PassageFilters): Technique[] {
    // Logique de génération
  }
}
```

---
