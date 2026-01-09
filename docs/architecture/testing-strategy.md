# Testing Strategy

# Testing Pyramid

```
        E2E Tests (Optionnel)
       /              \
  Integration Tests (Optionnel)
  /                        \
Frontend Unit Tests (Jasmine/Karma)
```

**Pour MVP:** Focus sur tests unitaires des services critiques (GradeService, PassageService, AudioService)

## Test Organization

**Frontend Tests:**
```
src/app/
├── services/
│   ├── grade.service.ts
│   ├── grade.service.spec.ts
│   ├── passage.service.ts
│   ├── passage.service.spec.ts
│   └── ...
└── components/
    ├── timer/
    │   ├── timer-display.component.ts
    │   └── timer-display.component.spec.ts
    └── ...
```

**Backend Tests:**
- N/A - Pas de backend

**E2E Tests:**
- Optionnel pour MVP
- Peut être ajouté post-MVP avec Cypress ou Protractor

## Test Examples

**Frontend Component Test:**
```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimerDisplayComponent } from './timer-display.component';

describe('TimerDisplayComponent', () => {
  let component: TimerDisplayComponent;
  let fixture: ComponentFixture<TimerDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimerDisplayComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TimerDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display time in MM:SS format', () => {
    component.elapsedTime = 125; // 2 minutes 5 seconds
    fixture.detectChanges();
    const displayed = fixture.nativeElement.textContent;
    expect(displayed).toContain('02:05');
  });
});
```

**Service Test:**
```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GradeService } from './grade.service';

describe('GradeService', () => {
  let service: GradeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(GradeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load nomenclature data', (done) => {
    service.loadNomenclature().subscribe(data => {
      expect(data).toBeTruthy();
      expect(data['6e Kyū']).toBeDefined();
      done();
    });
  });
});
```

---
