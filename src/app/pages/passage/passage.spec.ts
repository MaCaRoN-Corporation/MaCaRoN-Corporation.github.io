import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ChangeDetectorRef, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { PassageComponent } from './passage';
import { PassageService } from '../../services/passage.service';
import { PassageState, Passage } from '../../models/passage.model';
import { Technique } from '../../models/technique.model';
import { Position } from '../../models/position.model';
import { ConfigService } from '../../services/config.service';
import { PassageConfig, DEFAULT_PASSAGE_CONFIG } from '../../models/passage-config.model';

describe('PassageComponent', () => {
  let component: PassageComponent;
  let fixture: ComponentFixture<PassageComponent>;
  let passageService: jasmine.SpyObj<PassageService>;
  let router: jasmine.SpyObj<Router>;
  let changeDetectorRef: jasmine.SpyObj<ChangeDetectorRef>;
  let passageStateSubject: BehaviorSubject<PassageState>;
  let configSubject: BehaviorSubject<PassageConfig>;

  const mockPassageState: PassageState = {
    currentPassage: null,
    currentTechniqueIndex: 0,
    isPlaying: false,
    isPaused: false,
    elapsedTime: 125, // 2 minutes 5 seconds
    progress: 0
  };

  beforeEach(async () => {
    passageStateSubject = new BehaviorSubject<PassageState>(mockPassageState);
    configSubject = new BehaviorSubject<PassageConfig>(DEFAULT_PASSAGE_CONFIG);

    const passageServiceSpy = jasmine.createSpyObj('PassageService', [
      'getPassageState',
      'pausePassage',
      'resumePassage',
      'nextTechnique'
    ]);
    const configServiceSpy = jasmine.createSpyObj('ConfigService', ['getConfig']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const changeDetectorRefSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    passageServiceSpy.getPassageState.and.returnValue(passageStateSubject.asObservable());
    configServiceSpy.getConfig.and.returnValue(configSubject.asObservable());

    await TestBed.configureTestingModule({
      imports: [PassageComponent],
      providers: [
        { provide: PassageService, useValue: passageServiceSpy },
        { provide: ConfigService, useValue: configServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ChangeDetectorRef, useValue: changeDetectorRefSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PassageComponent);
    component = fixture.componentInstance;
    passageService = TestBed.inject(PassageService) as jasmine.SpyObj<PassageService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    changeDetectorRef = TestBed.inject(ChangeDetectorRef) as jasmine.SpyObj<ChangeDetectorRef>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should subscribe to PassageService.getPassageState()', () => {
      component.ngOnInit();
      
      expect(passageService.getPassageState).toHaveBeenCalled();
      expect(component.elapsedTime).toBe(125);
      expect(component.isPaused).toBe(false);
      expect(component.currentState).toEqual(mockPassageState);
    });

    it('should update elapsedTime and isPaused when state changes', () => {
      component.ngOnInit();
      
      const newState: PassageState = {
        ...mockPassageState,
        elapsedTime: 245,
        isPaused: true
      };
      
      passageStateSubject.next(newState);
      
      expect(component.elapsedTime).toBe(245);
      expect(component.isPaused).toBe(true);
      expect(component.currentState).toEqual(newState);
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from subscriptions', () => {
      component.ngOnInit();
      const unsubscribeSpy = spyOn(component['subscriptions'], 'unsubscribe');
      
      component.ngOnDestroy();
      
      expect(unsubscribeSpy).toHaveBeenCalled();
    });
  });

  describe('formatTime', () => {
    it('should format seconds to MM:SS format', () => {
      expect(component.formatTime(0)).toBe('00:00');
      expect(component.formatTime(5)).toBe('00:05');
      expect(component.formatTime(65)).toBe('01:05');
      expect(component.formatTime(125)).toBe('02:05');
      expect(component.formatTime(3661)).toBe('61:01');
    });

    it('should pad minutes and seconds with zeros', () => {
      expect(component.formatTime(9)).toBe('00:09');
      expect(component.formatTime(60)).toBe('01:00');
      expect(component.formatTime(599)).toBe('09:59');
    });
  });

  describe('getPositionLabel', () => {
    it('should return the position as-is', () => {
      expect(component.getPositionLabel('Suwariwaza' as Position)).toBe('Suwariwaza');
      expect(component.getPositionLabel('Tashiwaza' as Position)).toBe('Tashiwaza');
      expect(component.getPositionLabel('Hanmi Handachi' as Position)).toBe('Hanmi Handachi');
    });
  });

  describe('togglePause', () => {
    it('should call pausePassage when not paused', () => {
      component.isPaused = false;
      
      component.togglePause();
      
      expect(passageService.pausePassage).toHaveBeenCalled();
      expect(passageService.resumePassage).not.toHaveBeenCalled();
    });

    it('should call resumePassage when paused', () => {
      component.isPaused = true;
      
      component.togglePause();
      
      expect(passageService.resumePassage).toHaveBeenCalled();
      expect(passageService.pausePassage).not.toHaveBeenCalled();
    });
  });

  describe('restartPassage', () => {
    it('should log restart message', () => {
      const consoleSpy = spyOn(console, 'log');
      
      component.restartPassage();
      
      expect(consoleSpy).toHaveBeenCalledWith('Restart passage');
    });
  });

  describe('checkScroll', () => {
    it('should set hasScroll to false when historyElement is not available', () => {
      component.historyElement = undefined;
      
      component.checkScroll();
      
      expect(component.hasScroll).toBe(false);
    });

    it('should set hasScroll to true when scrollHeight > clientHeight', () => {
      const mockElement = {
        nativeElement: {
          scrollHeight: 500,
          clientHeight: 300
        }
      } as ElementRef<HTMLElement>;
      
      component.historyElement = mockElement;
      
      component.checkScroll();
      
      expect(component.hasScroll).toBe(true);
    });

    it('should set hasScroll to false when scrollHeight <= clientHeight', () => {
      const mockElement = {
        nativeElement: {
          scrollHeight: 300,
          clientHeight: 500
        }
      } as ElementRef<HTMLElement>;
      
      component.historyElement = mockElement;
      
      component.checkScroll();
      
      expect(component.hasScroll).toBe(false);
    });
  });

  describe('onHistoryScroll', () => {
    it('should do nothing when historyElement is not available', () => {
      component.historyElement = undefined;
      
      component.onHistoryScroll();
      
      expect(changeDetectorRef.detectChanges).not.toHaveBeenCalled();
    });

    it('should update hasScroll and isScrollAtBottom when scrollable', () => {
      const mockElement = {
        nativeElement: {
          scrollTop: 100,
          scrollHeight: 500,
          clientHeight: 300
        }
      } as ElementRef<HTMLElement>;
      
      component.historyElement = mockElement;
      
      component.onHistoryScroll();
      
      expect(component.hasScroll).toBe(true);
      expect(component.isScrollAtBottom).toBe(false);
      expect(changeDetectorRef.detectChanges).toHaveBeenCalled();
    });

    it('should set isScrollAtBottom to true when near bottom', () => {
      const mockElement = {
        nativeElement: {
          scrollTop: 195,
          scrollHeight: 500,
          clientHeight: 300
        }
      } as ElementRef<HTMLElement>;
      
      component.historyElement = mockElement;
      
      component.onHistoryScroll();
      
      expect(component.hasScroll).toBe(true);
      expect(component.isScrollAtBottom).toBe(true);
      expect(changeDetectorRef.detectChanges).toHaveBeenCalled();
    });

    it('should set isScrollAtBottom to true with 5px tolerance', () => {
      const mockElement = {
        nativeElement: {
          scrollTop: 195.1,
          scrollHeight: 500,
          clientHeight: 300
        }
      } as ElementRef<HTMLElement>;
      
      component.historyElement = mockElement;
      
      component.onHistoryScroll();
      
      expect(component.isScrollAtBottom).toBe(true);
    });
  });

  describe('ngAfterViewChecked', () => {
    it('should check scroll when history length changes', fakeAsync(() => {
      const checkScrollSpy = spyOn(component, 'checkScroll');
      // Access private property via bracket notation for testing
      (component as any).previousHistoryLength = 5;
      component.history = [
        { attack: 'Test', technique: 'Test', position: 'Tashiwaza' as Position, order: 1, videoUrl: null },
        { attack: 'Test', technique: 'Test', position: 'Tashiwaza' as Position, order: 2, videoUrl: null }
      ];
      
      component.ngAfterViewChecked();
      tick(0);
      
      expect(checkScrollSpy).toHaveBeenCalled();
      expect((component as any).previousHistoryLength).toBe(2);
    }));

    it('should not check scroll when history length is unchanged', () => {
      const checkScrollSpy = spyOn(component, 'checkScroll');
      // history has 6 items by default, so previousHistoryLength should match
      (component as any).previousHistoryLength = 6;
      
      component.ngAfterViewChecked();
      
      expect(checkScrollSpy).not.toHaveBeenCalled();
    });
  });

  describe('countdown', () => {
    it('should call nextTechnique when countdown reaches zero', fakeAsync(() => {
      component.ngOnInit();

      configSubject.next({
        ...DEFAULT_PASSAGE_CONFIG,
        timeBetweenTechniques: 2
      });

      const mockPassage = {
        id: 'passage-test',
        grade: '1er Dan',
        techniques: [
          { attack: 'A', technique: 'B', position: 'Tashiwaza' as Position, order: 1, videoUrl: null },
          { attack: 'C', technique: 'D', position: 'Tashiwaza' as Position, order: 2, videoUrl: null }
        ],
        duration: 10,
        timeBetweenTechniques: 2,
        voice: 'default',
        filters: {
          positions: [],
          attacks: [],
          techniques: [],
          includeWeapons: false,
          includeRandori: false
        },
        createdAt: new Date(),
        completedAt: null
      };

      passageStateSubject.next({
        currentPassage: mockPassage,
        currentTechniqueIndex: 0,
        isPlaying: true,
        isPaused: false,
        elapsedTime: 0,
        progress: 0
      });

      tick(1000);
      expect(passageService.nextTechnique).not.toHaveBeenCalled();
      tick(1000);
      expect(passageService.nextTechnique).toHaveBeenCalledTimes(1);
    }));
  });

  describe('Template Integration', () => {
    it('should display formatted time', () => {
      component.elapsedTime = 125;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const timerDisplay = compiled.querySelector('.timer-display');
      
      expect(timerDisplay?.textContent?.trim()).toBe('02:05');
    });

    it('should apply paused class when isPaused is true', () => {
      component.isPaused = true;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const timerDisplay = compiled.querySelector('.timer-display.paused');
      
      expect(timerDisplay).toBeTruthy();
    });

    it('should display current technique information', () => {
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const attackElement = compiled.querySelector('.technique-attack');
      const nameElement = compiled.querySelector('.technique-name');
      const positionElement = compiled.querySelector('.technique-position');
      
      expect(attackElement?.textContent?.trim()).toBe('Katate Dori Men Uchi');
      expect(nameElement?.textContent?.trim()).toBe('Sokumen Irimi Nage');
      expect(positionElement?.textContent?.trim()).toBe('Tashiwaza');
    });

    it('should display progress information', () => {
      component.currentProgress = 3;
      component.totalTechniques = 15;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const progressText = compiled.querySelector('.progress-text');
      
      expect(progressText?.textContent?.trim()).toBe('3 / 15');
    });

    it('should display history items', () => {
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const historyItems = compiled.querySelectorAll('.history-item');
      
      expect(historyItems.length).toBe(component.history.length);
    });

    it('should display history in reverse order', () => {
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const historyItems = compiled.querySelectorAll('.history-item');
      const firstItem = historyItems[0];
      const lastItem = historyItems[historyItems.length - 1];
      
      // First displayed item should be the last in the array (due to reverse())
      const firstNumber = firstItem.querySelector('.history-number')?.textContent;
      expect(firstNumber).toContain(component.history.length.toString());
    });
  });

  // Story 3.5: Current Technique Display
  describe('Story 3.5: Current Technique Display', () => {
    it('should display current technique attack and name', () => {
      component.currentTechnique = {
        attack: 'Shomen Uchi',
        technique: 'Ikkyo',
        position: 'Suwariwaza' as Position,
        order: 1,
        videoUrl: null
      };
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const attackElement = compiled.querySelector('.technique-attack');
      const nameElement = compiled.querySelector('.technique-name');
      
      expect(attackElement?.textContent?.trim()).toBe('Shomen Uchi');
      expect(nameElement?.textContent?.trim()).toBe('Ikkyo');
    });

    it('should update current technique when state changes', () => {
      component.ngOnInit();
      
      const mockPassage: Passage = {
        id: 'test',
        grade: '6e Kyū',
        techniques: [
          { attack: 'A1', technique: 'T1', position: 'Suwariwaza' as Position, order: 1, videoUrl: null },
          { attack: 'A2', technique: 'T2', position: 'Tashiwaza' as Position, order: 2, videoUrl: null }
        ],
        duration: 10,
        timeBetweenTechniques: 20,
        voice: 'masculin',
        filters: { positions: [], attacks: [], techniques: [], includeWeapons: false, includeRandori: false },
        createdAt: new Date(),
        completedAt: null
      };

      passageStateSubject.next({
        currentPassage: mockPassage,
        currentTechniqueIndex: 1,
        isPlaying: true,
        isPaused: false,
        elapsedTime: 30,
        progress: 50
      });

      expect(component.currentTechnique.attack).toBe('A2');
      expect(component.currentTechnique.technique).toBe('T2');
    });

    it('should display technique position', () => {
      component.currentTechnique = {
        attack: 'Katate Dori',
        technique: 'Sankyo',
        position: 'Hanmi Handachi' as Position,
        order: 1,
        videoUrl: null
      };
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const positionElement = compiled.querySelector('.technique-position');
      
      expect(positionElement?.textContent?.trim()).toBe('Hanmi Handachi');
    });
  });

  // Story 3.6: Technique History Display
  describe('Story 3.6: Technique History Display', () => {
    it('should display history with attack, technique, and position', () => {
      component.history = [
        { attack: 'A1', technique: 'T1', position: 'Suwariwaza' as Position, order: 1, videoUrl: null },
        { attack: 'A2', technique: 'T2', position: 'Tashiwaza' as Position, order: 2, videoUrl: null }
      ];
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const historyItems = compiled.querySelectorAll('.history-item');
      const firstItem = historyItems[0];
      
      expect(historyItems.length).toBe(2);
      expect(firstItem.querySelector('.history-attack-technique')?.textContent).toContain('A2');
      expect(firstItem.querySelector('.history-attack-technique')?.textContent).toContain('T2');
    });

    it('should update history when passage state changes', () => {
      component.ngOnInit();
      
      const mockPassage: Passage = {
        id: 'test',
        grade: '6e Kyū',
        techniques: [
          { attack: 'A1', technique: 'T1', position: 'Suwariwaza' as Position, order: 1, videoUrl: null },
          { attack: 'A2', technique: 'T2', position: 'Tashiwaza' as Position, order: 2, videoUrl: null },
          { attack: 'A3', technique: 'T3', position: 'Tashiwaza' as Position, order: 3, videoUrl: null }
        ],
        duration: 10,
        timeBetweenTechniques: 20,
        voice: 'masculin',
        filters: { positions: [], attacks: [], techniques: [], includeWeapons: false, includeRandori: false },
        createdAt: new Date(),
        completedAt: null
      };

      passageStateSubject.next({
        currentPassage: mockPassage,
        currentTechniqueIndex: 2,
        isPlaying: true,
        isPaused: false,
        elapsedTime: 60,
        progress: 66.67
      });

      expect(component.history.length).toBe(2);
      expect(component.history[0].attack).toBe('A1');
      expect(component.history[1].attack).toBe('A2');
    });

    it('should show scroll indicator when history is scrollable', () => {
      component.hasScroll = true;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const scrollIndicator = compiled.querySelector('.history-scroll-indicator');
      
      expect(scrollIndicator).toBeTruthy();
      expect(scrollIndicator?.classList.contains('hidden')).toBe(false);
    });
  });

  // Story 3.7: Progress Indicator
  describe('Story 3.7: Progress Indicator', () => {
    it('should display progress as X / Y', () => {
      component.currentProgress = 5;
      component.totalTechniques = 15;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const progressText = compiled.querySelector('.progress-text');
      
      expect(progressText?.textContent?.trim()).toBe('5 / 15');
    });

    it('should update progress bar width based on percentage', () => {
      component.progressPercentage = 33.33;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const progressBar = compiled.querySelector('.progress-bar') as HTMLElement;
      
      expect(progressBar?.style.width).toBe('33.33%');
    });

    it('should update progress when passage state changes', () => {
      component.ngOnInit();
      
      const mockPassage: Passage = {
        id: 'test',
        grade: '6e Kyū',
        techniques: [
          { attack: 'A1', technique: 'T1', position: 'Suwariwaza' as Position, order: 1, videoUrl: null },
          { attack: 'A2', technique: 'T2', position: 'Tashiwaza' as Position, order: 2, videoUrl: null },
          { attack: 'A3', technique: 'T3', position: 'Tashiwaza' as Position, order: 3, videoUrl: null }
        ],
        duration: 10,
        timeBetweenTechniques: 20,
        voice: 'masculin',
        filters: { positions: [], attacks: [], techniques: [], includeWeapons: false, includeRandori: false },
        createdAt: new Date(),
        completedAt: null
      };

      passageStateSubject.next({
        currentPassage: mockPassage,
        currentTechniqueIndex: 1,
        isPlaying: true,
        isPaused: false,
        elapsedTime: 40,
        progress: 33.33
      });

      expect(component.currentProgress).toBe(2);
      expect(component.totalTechniques).toBe(3);
      expect(component.progressPercentage).toBe(33.33);
    });
  });

  // Story 3.8: Passage Completion End Screen
  describe('Story 3.8: Passage Completion End Screen', () => {
    it('should detect passage completion', () => {
      component.ngOnInit();
      
      const mockPassage: Passage = {
        id: 'test',
        grade: '6e Kyū',
        techniques: [
          { attack: 'A1', technique: 'T1', position: 'Suwariwaza' as Position, order: 1, videoUrl: null },
          { attack: 'A2', technique: 'T2', position: 'Tashiwaza' as Position, order: 2, videoUrl: null }
        ],
        duration: 10,
        timeBetweenTechniques: 20,
        voice: 'masculin',
        filters: { positions: [], attacks: [], techniques: [], includeWeapons: false, includeRandori: false },
        createdAt: new Date(),
        completedAt: null
      };

      passageStateSubject.next({
        currentPassage: mockPassage,
        currentTechniqueIndex: 2,
        isPlaying: false,
        isPaused: false,
        elapsedTime: 120,
        progress: 100
      });

      expect(component.isPassageCompleted).toBe(true);
      expect(component.passageSummary).not.toBeNull();
    });

    it('should display end screen when passage is completed', () => {
      component.isPassageCompleted = true;
      component.passageSummary = {
        totalTechniques: 10,
        duration: 300,
        includeRandori: false
      };
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const endScreen = compiled.querySelector('.end-screen');
      
      expect(endScreen).toBeTruthy();
    });

    it('should display passage summary with correct data', () => {
      component.isPassageCompleted = true;
      component.passageSummary = {
        totalTechniques: 15,
        duration: 450,
        includeRandori: true
      };
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const summary = compiled.querySelector('.summary');
      const summaryItems = summary?.querySelectorAll('.summary-item');
      
      expect(summary).toBeTruthy();
      expect(summaryItems?.length).toBe(3); // Techniques, Durée, Randori
    });

    it('should reload page when new passage button is clicked', () => {
      // Mock window.location.reload
      const originalReload = window.location.reload;
      let reloadCalled = false;
      Object.defineProperty(window.location, 'reload', {
        writable: true,
        value: function() {
          reloadCalled = true;
        }
      });
      
      component.newPassage();
      
      expect(reloadCalled).toBe(true);
      
      // Restore original
      Object.defineProperty(window.location, 'reload', {
        writable: true,
        value: originalReload
      });
    });

    it('should navigate to home page when home button is clicked', () => {
      component.goHome();
      
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should call exportPassage when export button is clicked', () => {
      const consoleSpy = spyOn(console, 'log');
      component.exportPassage();
      
      expect(consoleSpy).toHaveBeenCalledWith('Export passage - à implémenter dans Epic 5');
    });

    it('should format duration correctly in summary', () => {
      component.isPassageCompleted = true;
      component.passageSummary = {
        totalTechniques: 10,
        duration: 125,
        includeRandori: false
      };
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const summaryValue = compiled.querySelector('.summary-value');
      
      // Should show formatted time (02:05)
      expect(summaryValue?.textContent).toContain('02:05');
    });
  });
});