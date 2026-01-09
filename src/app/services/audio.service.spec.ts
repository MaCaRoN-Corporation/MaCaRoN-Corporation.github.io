import { TestBed } from '@angular/core/testing';
import { AudioService } from './audio.service';

describe('AudioService', () => {
  let service: AudioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AudioService]
    });
    service = TestBed.inject(AudioService);
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

  it('should have repeatLastTechnique method', () => {
    expect(service.repeatLastTechnique).toBeDefined();
    expect(typeof service.repeatLastTechnique).toBe('function');
  });

  it('should have useElevenlabs method', () => {
    expect(service.useElevenlabs).toBeDefined();
    expect(typeof service.useElevenlabs).toBe('function');
  });
});
