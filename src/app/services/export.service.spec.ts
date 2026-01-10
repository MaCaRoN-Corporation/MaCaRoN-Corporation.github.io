import { TestBed } from '@angular/core/testing';
import { ExportService } from './export.service';

describe('ExportService', () => {
  let service: ExportService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExportService]
    });
    service = TestBed.inject(ExportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have exportPassage method', () => {
    expect(service.exportPassage).toBeDefined();
    expect(typeof service.exportPassage).toBe('function');
  });

  it('should have formatPassageText method', () => {
    expect(service.formatPassageText).toBeDefined();
    expect(typeof service.formatPassageText).toBe('function');
  });
});
