import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GradeService } from './grade.service';

describe('GradeService', () => {
  let service: GradeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GradeService]
    });
    service = TestBed.inject(GradeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have loadNomenclature method', () => {
    expect(service.loadNomenclature).toBeDefined();
    expect(typeof service.loadNomenclature).toBe('function');
  });

  it('should have loadVideos method', () => {
    expect(service.loadVideos).toBeDefined();
    expect(typeof service.loadVideos).toBe('function');
  });

  it('should have getTechniquesForGrade method', () => {
    expect(service.getTechniquesForGrade).toBeDefined();
    expect(typeof service.getTechniquesForGrade).toBe('function');
  });

  it('should have validateGrade method', () => {
    expect(service.validateGrade).toBeDefined();
    expect(typeof service.validateGrade).toBe('function');
  });
});
