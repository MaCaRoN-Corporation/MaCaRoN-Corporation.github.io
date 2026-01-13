import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ChangeDetectorRef, ElementRef } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { PassageComponent } from './passage';
import { PassageService } from '../../services/passage.service';
import { PassageState } from '../../models/passage.model';
import { Technique } from '../../models/technique.model';
import { Position } from '../../models/position.model';

describe('PassageComponent', () => {
  let component: PassageComponent;
  let fixture: ComponentFixture<PassageComponent>;
  let passageService: jasmine.SpyObj<PassageService>;
  let changeDetectorRef: jasmine.SpyObj<ChangeDetectorRef>;
  let passageStateSubject: BehaviorSubject<PassageState>;

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

    const passageServiceSpy = jasmine.createSpyObj('PassageService', [
      'getPassageState',
      'pausePassage',
      'resumePassage'
    ]);

    const changeDetectorRefSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    passageServiceSpy.getPassageState.and.returnValue(passageStateSubject.asObservable());

    await TestBed.configureTestingModule({
      imports: [PassageComponent],
      providers: [
        { provide: PassageService, useValue: passageServiceSpy },
        { provide: ChangeDetectorRef, useValue: changeDetectorRefSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PassageComponent);
    component = fixture.componentInstance;
    passageService = TestBed.inject(PassageService) as jasmine.SpyObj<PassageService>;
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
});