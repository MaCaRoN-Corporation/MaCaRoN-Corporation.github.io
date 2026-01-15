import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { ConfigComponent } from './config';
import { GradeService } from '../../services/grade.service';
import { ConfigService } from '../../services/config.service';
import { SettingsService } from '../../services/settings.service';
import { NomenclatureData } from '../../models/nomenclature.model';
import { DEFAULT_SETTINGS } from '../../models/settings.model';

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
      getCurrentConfig: () => ({ selectedGrade: '1er Dan', filters: { positions: [], attacks: [], techniques: [], includeWeapons: false, includeRandori: false }, passageMode: 'classique', timeBetweenTechniques: 20, totalDuration: 10 }),
      updateConfig: () => {},
      updateGrade: () => {},
      updateFilters: () => {},
      updatePassageMode: () => {},
      updateTimeBetweenTechniques: () => {},
      updateTotalDuration: () => {},
      updateWeaponTime: () => {},
      updateIncludeWeaponTime: () => {},
      updateIncludeRandoriTime: () => {},
      resetConfig: () => {}
    };

    const settingsServiceSpy = {
      getSettings: () => of(DEFAULT_SETTINGS),
      updateSettings: () => {}
    };

    await TestBed.configureTestingModule({
      imports: [ConfigComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: GradeService, useValue: gradeServiceSpy },
        { provide: ConfigService, useValue: configServiceSpy },
        { provide: SettingsService, useValue: settingsServiceSpy }
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

  it('should select grade when onGradeSelect is called', () => {
    component.onGradeSelect('5e Kyū');
    
    expect(component.selectedGrade).toBe('5e Kyū');
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

  it('should unsubscribe on destroy', () => {
    // Vérifier que ngOnDestroy peut être appelé sans erreur
    expect(() => component.ngOnDestroy()).not.toThrow();
  });

  // ============================================
  // Tests pour Story 2.4: Time Configuration Controls
  // ============================================

  describe('Time Configuration Controls', () => {
    let configService: ConfigService;

    beforeEach(() => {
      configService = TestBed.inject(ConfigService);
    });

    it('should display time configuration section', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const section = compiled.querySelector('.time-configuration-section');
      expect(section).toBeTruthy();
    });

    it('should have correct default values for time configuration', () => {
      expect(component.timeBetweenTechniques).toBe(20); // secondes
      expect(component.totalDuration).toBe(10); // minutes
    });

    it('should have correct validation constants', () => {
      expect(component.MIN_TIME_BETWEEN).toBe(5);
      expect(component.MAX_TIME_BETWEEN).toBe(120);
      expect(component.MIN_DURATION).toBe(5);
      expect(component.MAX_DURATION).toBe(60);
    });

    it('should validate time between techniques correctly', () => {
      expect(component.validateTimeBetween(5)).toBe(true);
      expect(component.validateTimeBetween(20)).toBe(true);
      expect(component.validateTimeBetween(120)).toBe(true);
      expect(component.validateTimeBetween(4)).toBe(false);
      expect(component.validateTimeBetween(121)).toBe(false);
    });

    it('should validate duration correctly', () => {
      expect(component.validateDuration(5)).toBe(true);
      expect(component.validateDuration(10)).toBe(true);
      expect(component.validateDuration(60)).toBe(true);
      expect(component.validateDuration(4)).toBe(false);
      expect(component.validateDuration(61)).toBe(false);
    });

    it('should increment time between techniques', () => {
      const initialValue = component.timeBetweenTechniques;
      
      component.incrementTimeBetween();
      
      expect(component.timeBetweenTechniques).toBe(initialValue + component.TIME_STEP);
    });

    it('should not increment time between techniques beyond maximum', () => {
      component.timeBetweenTechniques = component.MAX_TIME_BETWEEN;
      
      component.incrementTimeBetween();
      
      expect(component.timeBetweenTechniques).toBe(component.MAX_TIME_BETWEEN);
    });

    it('should decrement time between techniques', () => {
      component.timeBetweenTechniques = 30;
      
      component.decrementTimeBetween();
      
      expect(component.timeBetweenTechniques).toBe(25);
    });

    it('should not decrement time between techniques below minimum', () => {
      component.timeBetweenTechniques = component.MIN_TIME_BETWEEN;
      
      component.decrementTimeBetween();
      
      expect(component.timeBetweenTechniques).toBe(component.MIN_TIME_BETWEEN);
    });

    it('should increment total duration', () => {
      const initialValue = component.totalDuration;
      
      component.incrementDuration();
      
      expect(component.totalDuration).toBe(initialValue + 1);
    });

    it('should not increment total duration beyond maximum', () => {
      component.totalDuration = component.MAX_DURATION;
      
      component.incrementDuration();
      
      expect(component.totalDuration).toBe(component.MAX_DURATION);
    });

    it('should decrement total duration', () => {
      component.totalDuration = 15;
      
      component.decrementDuration();
      
      expect(component.totalDuration).toBe(14);
    });

    it('should not decrement total duration below minimum', () => {
      component.totalDuration = component.MIN_DURATION;
      
      component.decrementDuration();
      
      expect(component.totalDuration).toBe(component.MIN_DURATION);
    });

    it('should calculate estimated technique count correctly', () => {
      component.totalDuration = 10; // 10 minutes = 600 secondes
      component.timeBetweenTechniques = 20; // 20 secondes
      component.includeWeaponTime = false;
      component.includeRandoriTime = false;
      
      const expectedCount = Math.floor((10 * 60) / 20); // 600 / 20 = 30
      expect(component.estimatedTechniqueCount).toBe(expectedCount);
    });

    it('should calculate estimated technique count excluding weapon time', () => {
      component.totalDuration = 10; // 10 minutes = 600 secondes
      component.timeBetweenTechniques = 20; // 20 secondes
      component.weaponTime = 5; // 5 minutes
      component.includeWeaponTime = true;
      component.includeRandoriTime = false;
      component.selectedGrade = '1er Dan'; // >= 1er Kyū, so weapon time is shown
      
      // Available time: 10 - 5 = 5 minutes = 300 secondes
      // Estimated count: 300 / 20 = 15
      const expectedCount = Math.floor(((10 - 5) * 60) / 20);
      expect(component.estimatedTechniqueCount).toBe(expectedCount);
    });

    it('should calculate estimated technique count excluding randori time', () => {
      component.totalDuration = 10; // 10 minutes = 600 secondes
      component.timeBetweenTechniques = 20; // 20 secondes
      component.randoriTime = 3; // 3 minutes
      component.includeWeaponTime = false;
      component.includeRandoriTime = true;
      
      // Available time: 10 - 3 = 7 minutes = 420 secondes
      // Estimated count: 420 / 20 = 21
      const expectedCount = Math.floor(((10 - 3) * 60) / 20);
      expect(component.estimatedTechniqueCount).toBe(expectedCount);
    });

    it('should display time configuration controls in template', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      
      const timeControls = compiled.querySelectorAll('.time-control');
      expect(timeControls.length).toBeGreaterThan(0);
      
      const timeBetweenLabel = compiled.querySelector('.time-control-label');
      expect(timeBetweenLabel).toBeTruthy();
    });

    it('should display time preview with estimated technique count', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      
      const preview = compiled.querySelector('.time-preview');
      expect(preview).toBeTruthy();
      
      const previewText = compiled.querySelector('.time-preview-text');
      expect(previewText).toBeTruthy();
      expect(previewText?.textContent).toContain('Environ');
    });

    it('should have accessible buttons with aria-labels', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      
      const buttons = compiled.querySelectorAll('.time-input-button');
      expect(buttons.length).toBeGreaterThan(0);
      
      buttons.forEach(button => {
        const ariaLabel = button.getAttribute('aria-label');
        expect(ariaLabel).toBeTruthy();
        expect(ariaLabel?.length).toBeGreaterThan(0);
      });
    });

    it('should disable increment button when at maximum', () => {
      component.timeBetweenTechniques = component.MAX_TIME_BETWEEN;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const buttons = compiled.querySelectorAll('.time-input-button');
      // Le deuxième bouton est généralement le bouton d'incrémentation
      const incrementButton = buttons[1] as HTMLButtonElement;
      
      expect(incrementButton?.disabled).toBe(true);
    });

    it('should disable decrement button when at minimum', () => {
      component.timeBetweenTechniques = component.MIN_TIME_BETWEEN;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const buttons = compiled.querySelectorAll('.time-input-button');
      // Le premier bouton est généralement le bouton de décrémentation
      const decrementButton = buttons[0] as HTMLButtonElement;
      
      expect(decrementButton?.disabled).toBe(true);
    });
  });

  // ============================================
  // Tests pour Story 2.5: Voice Selection Interface
  // ============================================

  describe('Voice Selection Interface', () => {
    let settingsService: SettingsService;

    beforeEach(() => {
      settingsService = TestBed.inject(SettingsService);
    });

    it('should display voice selection section', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const section = compiled.querySelector('.voice-selection-section');
      expect(section).toBeTruthy();
    });

    it('should have correct default voice value', () => {
      expect(component.selectedVoice).toBe(DEFAULT_SETTINGS.voice);
    });

    it('should load voice from SettingsService on init', () => {
      const settingsSpy = spyOn(settingsService, 'getSettings').and.returnValue(of({ ...DEFAULT_SETTINGS, voice: 'French_Female1' }));
      
      component.ngOnInit();
      
      expect(settingsSpy).toHaveBeenCalled();
    });

    it('should change voice when onVoiceChange is called', () => {
      const updateSpy = spyOn(settingsService, 'updateSettings');
      const mockVoice = { id: 'Female1', label: 'Voix féminine 1', displayName: 'Sophie', gender: 'female' as const, language: 'French' as const };
      
      component.onVoiceChange(mockVoice);
      
      expect(component.selectedVoice).toBe('French_Female1');
      expect(updateSpy).toHaveBeenCalledWith({ voice: 'French_Female1' });
    });

    it('should display both voice options in template', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      
      const buttons = compiled.querySelectorAll('.voice-toggle-button');
      expect(buttons.length).toBe(2);
      
      const buttonTexts = Array.from(buttons).map(btn => btn.textContent?.trim());
      expect(buttonTexts).toContain('Masculin');
      expect(buttonTexts).toContain('Féminin');
    });

    it('should mark active voice button correctly', () => {
      component.selectedVoice = 'féminin';
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const buttons = compiled.querySelectorAll('.voice-toggle-button');
      
      const masculinButton = Array.from(buttons).find(btn => btn.textContent?.trim() === 'Masculin') as HTMLElement;
      const femininButton = Array.from(buttons).find(btn => btn.textContent?.trim() === 'Féminin') as HTMLElement;
      
      expect(masculinButton?.classList.contains('active')).toBe(false);
      expect(femininButton?.classList.contains('active')).toBe(true);
    });

    it('should have accessible buttons with aria-labels', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      
      const buttons = compiled.querySelectorAll('.voice-toggle-button');
      expect(buttons.length).toBe(2);
      
      buttons.forEach(button => {
        const ariaLabel = button.getAttribute('aria-label');
        expect(ariaLabel).toBeTruthy();
        expect(ariaLabel?.length).toBeGreaterThan(0);
        
        const ariaChecked = button.getAttribute('aria-checked');
        expect(ariaChecked).toBeTruthy();
        if (ariaChecked) {
          expect(['true', 'false']).toContain(ariaChecked);
        }
      });
    });

    it('should have role="radio" on voice toggle buttons', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      
      const buttons = compiled.querySelectorAll('.voice-toggle-button');
      buttons.forEach(button => {
        expect(button.getAttribute('role')).toBe('radio');
      });
    });
  });
});
