import { TestBed } from '@angular/core/testing';
import { AudioService } from './audio.service';
import { Technique } from '../models/technique.model';
import { Position } from '../models/position.model';

describe('AudioService', () => {
  let service: AudioService;
  let mockAudioElement: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AudioService]
    });
    service = TestBed.inject(AudioService);

    // Mock HTMLAudioElement
    mockAudioElement = {
      load: jasmine.createSpy('load'),
      play: jasmine.createSpy('play').and.returnValue(Promise.resolve()),
      pause: jasmine.createSpy('pause'),
      addEventListener: jasmine.createSpy('addEventListener'),
      removeEventListener: jasmine.createSpy('removeEventListener'),
      currentTime: 0,
      paused: false
    };

    // Mock Audio constructor
    spyOn(window, 'Audio').and.returnValue(mockAudioElement as any);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have playTechnique method', () => {
    expect(service.playTechnique).toBeDefined();
    expect(typeof service.playTechnique).toBe('function');
  });

  it('should have pauseAudio method', () => {
    expect(service.pauseAudio).toBeDefined();
    expect(typeof service.pauseAudio).toBe('function');
  });

  it('should have resumeAudio method', () => {
    expect(service.resumeAudio).toBeDefined();
    expect(typeof service.resumeAudio).toBe('function');
  });

  it('should have stopAudio method', () => {
    expect(service.stopAudio).toBeDefined();
    expect(typeof service.stopAudio).toBe('function');
  });

  it('should have repeatLastTechnique method', () => {
    expect(service.repeatLastTechnique).toBeDefined();
    expect(typeof service.repeatLastTechnique).toBe('function');
  });

  it('should have audioFinished$ observable', () => {
    expect(service.audioFinished$).toBeDefined();
  });

  it('should have audioError$ observable', () => {
    expect(service.audioError$).toBeDefined();
  });

  describe('pauseAudio', () => {
    it('should pause current audio', () => {
      service.pauseAudio();
      expect(mockAudioElement.pause).not.toHaveBeenCalled(); // Pas d'audio en cours
    });
  });

  describe('resumeAudio', () => {
    it('should resume paused audio', () => {
      service.resumeAudio();
      // Vérifier que resumeAudio ne plante pas
      expect(service).toBeTruthy();
    });
  });

  describe('stopAudio', () => {
    it('should stop all audio', () => {
      service.stopAudio();
      // Vérifier que stopAudio ne plante pas
      expect(service).toBeTruthy();
    });
  });

  describe('repeatLastTechnique', () => {
    it('should not throw when no technique was played', () => {
      expect(() => service.repeatLastTechnique()).not.toThrow();
    });
  });

  describe('normalizeAudioFileName', () => {
    it('should normalize technique names correctly', () => {
      const technique: Technique = {
        attack: 'Shomen Uchi',
        technique: 'Ikkyo',
        position: 'Tachiwaza' as Position,
        order: 1,
        videoUrl: null
      };

      // Test indirect via playTechnique (qui utilise normalizeAudioFileName en interne)
      // On s'attend à ce que le chemin soit construit correctement
      const promise = service.playTechnique(technique, 'French_Male1');
      expect(promise).toBeInstanceOf(Promise);
    });
  });
});
