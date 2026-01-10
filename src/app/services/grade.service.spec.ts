import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GradeService } from './grade.service';
import { NomenclatureData } from '../models/nomenclature.model';
import { VideosData } from '../models/videos.model';

describe('GradeService', () => {
  let service: GradeService;
  let httpMock: HttpTestingController;

  const mockNomenclature: NomenclatureData = {
    '6e Kyū': {
      'Suwariwaza': {
        'Shomen Uchi': ['Ikkyo', 'Nikyo'],
        'Yokomen Uchi': ['Ikkyo']
      },
      'Tashiwaza': {
        'Katate Dori': ['Ikkyo', 'Shihonage']
      }
    }
  };

  const mockVideos: VideosData = {
    'Shomen Uchi-Ikkyo': ['https://example.com/videos/shomen-uchi-ikkyo-1.mp4'],
    'Yokomen Uchi-Ikkyo': ['https://example.com/videos/yokomen-uchi-ikkyo-1.mp4'],
    'Katate Dori-Ikkyo': ['https://example.com/videos/katate-dori-ikkyo-1.mp4']
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GradeService]
    });
    service = TestBed.inject(GradeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadNomenclature', () => {
    it('should load nomenclature data from assets', () => {
      return new Promise<void>((resolve, reject) => {
        service.loadNomenclature().subscribe({
          next: (data) => {
            expect(data).toEqual(mockNomenclature);
            resolve();
          },
          error: reject
        });

        const req = httpMock.expectOne('assets/data/nomenclature.json');
        expect(req.request.method).toBe('GET');
        req.flush(mockNomenclature);
      });
    });

    it('should cache nomenclature data and only make one HTTP call', () => {
      return new Promise<void>((resolve, reject) => {
        let callCount = 0;

        service.loadNomenclature().subscribe({
          next: (data) => {
            callCount++;
            expect(data).toEqual(mockNomenclature);
            
            if (callCount === 1) {
              // Second appel devrait utiliser le cache (pas de nouvel appel HTTP)
              service.loadNomenclature().subscribe({
                next: (cachedData) => {
                  expect(cachedData).toEqual(mockNomenclature);
                  httpMock.verify(); // Vérifie qu'un seul appel HTTP a été fait
                  resolve();
                },
                error: reject
              });
            }
          },
          error: reject
        });

        const req = httpMock.expectOne('assets/data/nomenclature.json');
        req.flush(mockNomenclature);
      });
    });

    it('should handle 404 errors gracefully', () => {
      return new Promise<void>((resolve, reject) => {
        service.loadNomenclature().subscribe({
          next: () => {
            reject(new Error('Should not succeed'));
          },
          error: (error) => {
            expect(error.message).toContain('Failed to load nomenclature data');
            expect(error.message).toContain('File not found (404)');
            resolve();
          }
        });

        const req = httpMock.expectOne('assets/data/nomenclature.json');
        req.flush(null, { status: 404, statusText: 'Not Found' });
      });
    });

    it('should handle network errors gracefully', () => {
      return new Promise<void>((resolve, reject) => {
        service.loadNomenclature().subscribe({
          next: () => {
            reject(new Error('Should not succeed'));
          },
          error: (error) => {
            expect(error.message).toContain('Failed to load nomenclature data');
            resolve();
          }
        });

        const req = httpMock.expectOne('assets/data/nomenclature.json');
        req.error(new ProgressEvent('network error'), { status: 0 });
      });
    });

    it('should update loading state correctly', () => {
      return new Promise<void>((resolve, reject) => {
        const loadingStates: boolean[] = [];

        service.isLoadingNomenclature$.subscribe((loading) => {
          loadingStates.push(loading);
          if (loadingStates.length === 2 && !loadingStates[1]) {
            expect(loadingStates[0]).toBe(true); // Début: loading = true
            expect(loadingStates[1]).toBe(false); // Fin: loading = false
            resolve();
          }
        });

        service.loadNomenclature().subscribe({
          error: reject
        });

        const req = httpMock.expectOne('assets/data/nomenclature.json');
        req.flush(mockNomenclature);
      });
    });

    it('should update nomenclature$ BehaviorSubject when data is loaded', () => {
      return new Promise<void>((resolve, reject) => {
        service.nomenclatureData$.subscribe((data) => {
          if (data !== null) {
            expect(data).toEqual(mockNomenclature);
            resolve();
          }
        });

        service.loadNomenclature().subscribe({
          error: reject
        });

        const req = httpMock.expectOne('assets/data/nomenclature.json');
        req.flush(mockNomenclature);
      });
    });

    it('should return Observable<NomenclatureData> with correct type', () => {
      return new Promise<void>((resolve, reject) => {
        service.loadNomenclature().subscribe({
          next: (data) => {
            expect(data).toBeDefined();
            expect(typeof data).toBe('object');
            expect(data).toHaveProperty('6e Kyū');
            resolve();
          },
          error: reject
        });

        const req = httpMock.expectOne('assets/data/nomenclature.json');
        req.flush(mockNomenclature);
      });
    });
  });

  describe('loadVideos', () => {
    it('should load videos data from assets', () => {
      return new Promise<void>((resolve, reject) => {
        service.loadVideos().subscribe({
          next: (data) => {
            expect(data).toEqual(mockVideos);
            resolve();
          },
          error: reject
        });

        const req = httpMock.expectOne('assets/data/videos.json');
        expect(req.request.method).toBe('GET');
        req.flush(mockVideos);
      });
    });

    it('should cache videos data and only make one HTTP call', () => {
      return new Promise<void>((resolve, reject) => {
        let callCount = 0;

        service.loadVideos().subscribe({
          next: (data) => {
            callCount++;
            expect(data).toEqual(mockVideos);
            
            if (callCount === 1) {
              // Second appel devrait utiliser le cache (pas de nouvel appel HTTP)
              service.loadVideos().subscribe({
                next: (cachedData) => {
                  expect(cachedData).toEqual(mockVideos);
                  httpMock.verify(); // Vérifie qu'un seul appel HTTP a été fait
                  resolve();
                },
                error: reject
              });
            }
          },
          error: reject
        });

        const req = httpMock.expectOne('assets/data/videos.json');
        req.flush(mockVideos);
      });
    });

    it('should handle 404 errors gracefully', () => {
      return new Promise<void>((resolve, reject) => {
        service.loadVideos().subscribe({
          next: () => {
            reject(new Error('Should not succeed'));
          },
          error: (error) => {
            expect(error.message).toContain('Failed to load videos data');
            expect(error.message).toContain('File not found (404)');
            resolve();
          }
        });

        const req = httpMock.expectOne('assets/data/videos.json');
        req.flush(null, { status: 404, statusText: 'Not Found' });
      });
    });

    it('should handle network errors gracefully', () => {
      return new Promise<void>((resolve, reject) => {
        service.loadVideos().subscribe({
          next: () => {
            reject(new Error('Should not succeed'));
          },
          error: (error) => {
            expect(error.message).toContain('Failed to load videos data');
            resolve();
          }
        });

        const req = httpMock.expectOne('assets/data/videos.json');
        req.error(new ProgressEvent('network error'), { status: 0 });
      });
    });

    it('should update loading state correctly', () => {
      return new Promise<void>((resolve, reject) => {
        const loadingStates: boolean[] = [];

        service.isLoadingVideos$.subscribe((loading) => {
          loadingStates.push(loading);
          if (loadingStates.length === 2 && !loadingStates[1]) {
            expect(loadingStates[0]).toBe(true); // Début: loading = true
            expect(loadingStates[1]).toBe(false); // Fin: loading = false
            resolve();
          }
        });

        service.loadVideos().subscribe({
          error: reject
        });

        const req = httpMock.expectOne('assets/data/videos.json');
        req.flush(mockVideos);
      });
    });

    it('should update videos$ BehaviorSubject when data is loaded', () => {
      return new Promise<void>((resolve, reject) => {
        service.videosData$.subscribe((data) => {
          if (data !== null) {
            expect(data).toEqual(mockVideos);
            resolve();
          }
        });

        service.loadVideos().subscribe({
          error: reject
        });

        const req = httpMock.expectOne('assets/data/videos.json');
        req.flush(mockVideos);
      });
    });

    it('should return Observable<VideosData> with correct type', () => {
      return new Promise<void>((resolve, reject) => {
        service.loadVideos().subscribe({
          next: (data) => {
            expect(data).toBeDefined();
            expect(typeof data).toBe('object');
            expect(data).toHaveProperty('Shomen Uchi-Ikkyo');
            expect(Array.isArray(data['Shomen Uchi-Ikkyo'])).toBe(true);
            resolve();
          },
          error: reject
        });

        const req = httpMock.expectOne('assets/data/videos.json');
        req.flush(mockVideos);
      });
    });
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
