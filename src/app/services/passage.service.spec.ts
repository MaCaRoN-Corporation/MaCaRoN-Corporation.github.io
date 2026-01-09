import { TestBed } from '@angular/core/testing';
import { PassageService } from './passage.service';

describe('PassageService', () => {
  let service: PassageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PassageService]
    });
    service = TestBed.inject(PassageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have generatePassage method', () => {
    expect(service.generatePassage).toBeDefined();
    expect(typeof service.generatePassage).toBe('function');
  });

  it('should have startPassage method', () => {
    expect(service.startPassage).toBeDefined();
    expect(typeof service.startPassage).toBe('function');
  });

  it('should have pausePassage method', () => {
    expect(service.pausePassage).toBeDefined();
    expect(typeof service.pausePassage).toBe('function');
  });

  it('should have resumePassage method', () => {
    expect(service.resumePassage).toBeDefined();
    expect(typeof service.resumePassage).toBe('function');
  });

  it('should have getCurrentTechnique method', () => {
    expect(service.getCurrentTechnique).toBeDefined();
    expect(typeof service.getCurrentTechnique).toBe('function');
  });

  it('should have getPassageState method', () => {
    expect(service.getPassageState).toBeDefined();
    expect(typeof service.getPassageState).toBe('function');
  });
});
