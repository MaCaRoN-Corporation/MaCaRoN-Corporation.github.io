import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { ConfigComponent } from './config';
import { GradeService } from '../../services/grade.service';
import { ConfigService } from '../../services/config.service';
import { NomenclatureData } from '../../models/nomenclature.model';

describe('ConfigComponent', () => {
  let component: ConfigComponent;
  let fixture: ComponentFixture<ConfigComponent>;
  let router: Router;
  let gradeService: GradeService;
  
  const mockGrades = ['6e Kyū', '5e Kyū', '4e Kyū', '3e Kyū', '2e Kyū', '1er Kyū', '1er Dan', '2e Dan', '3e Dan', '4e Dan', '5e Dan'];
  const mockNomenclature: NomenclatureData = {
    '6e Kyū': {
      'Suwariwaza': {
        'Shomen Uchi': ['Ikkyo', 'Nikyo']
      },
      'Tashiwaza': {
        'Katate Dori': ['Ikkyo', 'Shihonage']
      }
    }
  };

  beforeEach(async () => {
    const routerSpy = {
      navigate: async () => true,
      events: new BehaviorSubject({ url: '/config' }),
      // Ajouter d'autres méthodes nécessaires si besoin
    };

    const gradeServiceSpy = {
      loadNomenclature: () => of(mockNomenclature),
      loadVideos: () => of({}),
      isLoadingNomenclature$: new BehaviorSubject<boolean>(false),
      isLoadingVideos$: new BehaviorSubject<boolean>(false),
      getGrades: () => mockGrades,
      validateGrade: (grade: string) => mockGrades.includes(grade),
      getPositionsForGrade: (grade: string) => ['Suwariwaza', 'Tashiwaza'] as any,
      getAttacksForGradeAndPosition: () => [],
      getTechniquesForGradePositionAttack: () => [],
      getVideoUrls: () => null,
      getWeaponPositions: () => [],
      hasTechnique: () => false,
      getTechniquesForGrade: () => []
    };

    const configServiceSpy = {
      getConfig: () => of({ selectedGrade: '1er Dan', filters: { positions: [], attacks: [], techniques: [], includeWeapons: false, includeRandori: false }, passageMode: 'classique' }),
      getCurrentConfig: () => ({ selectedGrade: '1er Dan', filters: { positions: [], attacks: [], techniques: [], includeWeapons: false, includeRandori: false }, passageMode: 'classique' }),
      updateConfig: () => {},
      updateGrade: () => {},
      updateFilters: () => {},
      updatePassageMode: () => {},
      resetConfig: () => {}
    };

    await TestBed.configureTestingModule({
      imports: [ConfigComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: GradeService, useValue: gradeServiceSpy },
        { provide: ConfigService, useValue: configServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfigComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    gradeService = TestBed.inject(GradeService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default grade set to "1er Dan"', () => {
    expect(component.selectedGrade).toBe('1er Dan');
  });

  it('should load grades on init', () => {
    expect(component.grades.length).toBeGreaterThan(0);
    expect(component.grades).toEqual(mockGrades);
  });

  it('should select a grade when onGradeSelect is called with valid grade', () => {
    const newGrade = '5e Kyū';
    component.onGradeSelect(newGrade);
    
    expect(component.selectedGrade).toBe(newGrade);
  });

  it('should not select a grade when onGradeSelect is called with invalid grade', () => {
    const originalGrade = component.selectedGrade;
    const invalidGrade = 'Invalid Grade';
    
    component.onGradeSelect(invalidGrade);
    
    expect(component.selectedGrade).toBe(originalGrade);
  });

  it('should return true for isGradeSelected when grade is selected', () => {
    component.selectedGrade = '5e Kyū';
    
    expect(component.isGradeSelected('5e Kyū')).toBe(true);
    expect(component.isGradeSelected('1er Dan')).toBe(false);
  });

  it('should display grade selection section', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const section = compiled.querySelector('.grade-selection-section');
    expect(section).toBeTruthy();
  });

  it('should display grade selection title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('.grade-selection-section h2');
    expect(title).toBeTruthy();
    expect(title?.textContent?.trim()).toBe('Sélection du grade');
  });

  it('should display all grades in select dropdown', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const select = compiled.querySelector('.grade-select') as HTMLSelectElement;
    const options = select?.querySelectorAll('option');
    
    expect(select).toBeTruthy();
    expect(options?.length).toBe(mockGrades.length);
  });

  it('should have correct selected value in select', () => {
    component.selectedGrade = '5e Kyū';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const select = compiled.querySelector('.grade-select') as HTMLSelectElement;
    
    expect(select).toBeTruthy();
    expect(select?.value).toBe('5e Kyū');
  });

  it('should display select dropdown with grades', () => {
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const select = compiled.querySelector('.grade-select');
    expect(select).toBeTruthy();
  });

  it('should have select with correct number of options', () => {
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const select = compiled.querySelector('.grade-select') as HTMLSelectElement;
    expect(select).toBeTruthy();
    expect(select?.options.length).toBe(mockGrades.length);
  });

  it('should call gradeService.validateGrade when selecting a grade', () => {
    const validateSpy = spyOn(gradeService, 'validateGrade').and.returnValue(true);
    
    component.onGradeSelect('5e Kyū');
    
    expect(validateSpy).toHaveBeenCalledWith('5e Kyū');
  });

  it('should update filters when grade changes', () => {
    const updateFiltersSpy = spyOn(component as any, 'updateFiltersForGrade');
    
    component.onGradeSelect('5e Kyū');
    
    expect(updateFiltersSpy).toHaveBeenCalledWith('5e Kyū');
  });

  it('should have aria-label for accessibility', () => {
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const select = compiled.querySelector('.grade-select');
    expect(select?.getAttribute('aria-label')).toBe('Sélection du grade');
  });

  it('should handle select change event', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const select = compiled.querySelector('.grade-select') as HTMLSelectElement;
    
    select.value = '5e Kyū';
    select.dispatchEvent(new Event('change'));
    
    expect(component.selectedGrade).toBe('5e Kyū');
  });

  it('should show disabled option when no grades available', () => {
    component.grades = [];
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const select = compiled.querySelector('.grade-select') as HTMLSelectElement;
    const disabledOption = select?.querySelector('option[disabled]');
    
    expect(disabledOption).toBeTruthy();
    expect(disabledOption?.textContent).toContain('Chargement');
  });

  it('should unsubscribe on destroy', () => {
    const unsubscribeSpy = spyOn(component['subscriptions'], 'unsubscribe');
    
    component.ngOnDestroy();
    
    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
