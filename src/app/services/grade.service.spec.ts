import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GradeService } from './grade.service';
import { NomenclatureData } from '../models/nomenclature.model';
import { VideosData } from '../models/videos.model';
import { PassageFilters } from '../models/passage-filters.model';

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
            expect('6e Kyū' in data).toBe(true);
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
            expect('Shomen Uchi-Ikkyo' in data).toBe(true);
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

  describe('getGrades', () => {
    it('should return all grades in order', () => {
      service.loadNomenclature().subscribe(() => {
        const grades = service.getGrades();
        expect(grades.length).toBeGreaterThan(0);
        expect(grades[0]).toBe('6e Kyū');
        expect(grades[grades.length - 1]).toBe('5e Dan');
      });

      const req = httpMock.expectOne('assets/data/nomenclature.json');
      req.flush(mockNomenclature);
    });

    it('should return empty array if nomenclature not loaded', () => {
      const grades = service.getGrades();
      expect(grades).toEqual([]);
    });
  });

  describe('validateGrade', () => {
    it('should return true for valid grade', () => {
      return new Promise<void>((resolve, reject) => {
        service.loadNomenclature().subscribe(() => {
          expect(service.validateGrade('6e Kyū')).toBe(true);
          resolve();
        }, reject);

        const req = httpMock.expectOne('assets/data/nomenclature.json');
        req.flush(mockNomenclature);
      });
    });

    it('should return false for invalid grade', () => {
      return new Promise<void>((resolve, reject) => {
        service.loadNomenclature().subscribe(() => {
          expect(service.validateGrade('Invalid Grade')).toBe(false);
          resolve();
        }, reject);

        const req = httpMock.expectOne('assets/data/nomenclature.json');
        req.flush(mockNomenclature);
      });
    });

    it('should return false if nomenclature not loaded', () => {
      expect(service.validateGrade('6e Kyū')).toBe(false);
    });
  });

  describe('getPositionsForGrade', () => {
    it('should return positions for valid grade', () => {
      return new Promise<void>((resolve, reject) => {
        service.loadNomenclature().subscribe(() => {
          const positions = service.getPositionsForGrade('6e Kyū');
          expect(positions.length).toBeGreaterThan(0);
          expect(positions).toContain('Suwariwaza');
          expect(positions).toContain('Tashiwaza');
          resolve();
        }, reject);

        const req = httpMock.expectOne('assets/data/nomenclature.json');
        req.flush(mockNomenclature);
      });
    });

    it('should return empty array for invalid grade', () => {
      return new Promise<void>((resolve, reject) => {
        service.loadNomenclature().subscribe(() => {
          const positions = service.getPositionsForGrade('Invalid Grade');
          expect(positions).toEqual([]);
          resolve();
        }, reject);

        const req = httpMock.expectOne('assets/data/nomenclature.json');
        req.flush(mockNomenclature);
      });
    });
  });

  describe('getAttacksForGradeAndPosition', () => {
    it('should return attacks for valid grade and position', () => {
      return new Promise<void>((resolve, reject) => {
        service.loadNomenclature().subscribe(() => {
          const attacks = service.getAttacksForGradeAndPosition('6e Kyū', 'Suwariwaza');
          expect(attacks.length).toBeGreaterThan(0);
          expect(attacks).toContain('Shomen Uchi');
          resolve();
        }, reject);

        const req = httpMock.expectOne('assets/data/nomenclature.json');
        req.flush(mockNomenclature);
      });
    });

    it('should return empty array for invalid grade', () => {
      return new Promise<void>((resolve, reject) => {
        service.loadNomenclature().subscribe(() => {
          const attacks = service.getAttacksForGradeAndPosition('Invalid Grade', 'Suwariwaza');
          expect(attacks).toEqual([]);
          resolve();
        }, reject);

        const req = httpMock.expectOne('assets/data/nomenclature.json');
        req.flush(mockNomenclature);
      });
    });
  });

  describe('getTechniquesForGradePositionAttack', () => {
    it('should return techniques for valid parameters', () => {
      return new Promise<void>((resolve, reject) => {
        service.loadNomenclature().subscribe(() => {
          const techniques = service.getTechniquesForGradePositionAttack('6e Kyū', 'Suwariwaza', 'Shomen Uchi');
          expect(techniques.length).toBeGreaterThan(0);
          expect(techniques).toContain('Ikkyo');
          expect(techniques).toContain('Nikyo');
          resolve();
        }, reject);

        const req = httpMock.expectOne('assets/data/nomenclature.json');
        req.flush(mockNomenclature);
      });
    });

    it('should return empty array for invalid parameters', () => {
      return new Promise<void>((resolve, reject) => {
        service.loadNomenclature().subscribe(() => {
          const techniques = service.getTechniquesForGradePositionAttack('Invalid Grade', 'Suwariwaza', 'Shomen Uchi');
          expect(techniques).toEqual([]);
          resolve();
        }, reject);

        const req = httpMock.expectOne('assets/data/nomenclature.json');
        req.flush(mockNomenclature);
      });
    });
  });

  describe('getVideoUrls', () => {
    it('should return video URLs for existing attack-technique', () => {
      return new Promise<void>((resolve, reject) => {
        service.loadVideos().subscribe(() => {
          const urls = service.getVideoUrls('Shomen Uchi', 'Ikkyo');
          expect(urls).not.toBeNull();
          expect(Array.isArray(urls)).toBe(true);
          expect(urls!.length).toBeGreaterThan(0);
          resolve();
        }, reject);

        const req = httpMock.expectOne('assets/data/videos.json');
        req.flush(mockVideos);
      });
    });

    it('should return null for non-existent attack-technique', () => {
      return new Promise<void>((resolve, reject) => {
        service.loadVideos().subscribe(() => {
          const urls = service.getVideoUrls('Non Existent', 'Technique');
          expect(urls).toBeNull();
          resolve();
        }, reject);

        const req = httpMock.expectOne('assets/data/videos.json');
        req.flush(mockVideos);
      });
    });

    it('should handle weapons with hyphenated attack format', () => {
      return new Promise<void>((resolve, reject) => {
        const mockVideosWithWeapons: VideosData = {
          'Chudan Tsuki-Ikkyo': ['https://example.com/video1.mp4'],
          'Jo Dori-Ikkyo': ['https://example.com/video2.mp4']
        };

        service.loadVideos().subscribe(() => {
          // Pour "Tanto Dori-Chudan Tsuki", extraire "Chudan Tsuki"
          const urls = service.getVideoUrls('Tanto Dori-Chudan Tsuki', 'Ikkyo');
          expect(urls).not.toBeNull();
          expect(urls![0]).toContain('video1');
          resolve();
        }, reject);

        const req = httpMock.expectOne('assets/data/videos.json');
        req.flush(mockVideosWithWeapons);
      });
    });
  });

  describe('getWeaponPositions', () => {
    it('should return weapon positions for grades with weapons', () => {
      return new Promise<void>((resolve, reject) => {
        const mockNomenclatureWithWeapons: NomenclatureData = {
          '1er Dan': {
            'Tashiwaza': {
              'Katate Dori': ['Ikkyo']
            },
            'Armes': {
              'Tanto Dori': {
                'Chudan Tsuki': ['Ikkyo']
              },
              'Jo Dori': ['Ikkyo']
            }
          }
        };

        service.loadNomenclature().subscribe(() => {
          const weapons = service.getWeaponPositions('1er Dan');
          expect(weapons.length).toBeGreaterThan(0);
          expect(weapons).toContain('Tanto Dori');
          expect(weapons).toContain('Jo Dori');
          resolve();
        }, reject);

        const req = httpMock.expectOne('assets/data/nomenclature.json');
        req.flush(mockNomenclatureWithWeapons);
      });
    });

    it('should return empty array for grades without weapons', () => {
      return new Promise<void>((resolve, reject) => {
        service.loadNomenclature().subscribe(() => {
          const weapons = service.getWeaponPositions('6e Kyū');
          // 6e Kyū n'a pas d'armes dans mockNomenclature
          expect(weapons).toEqual([]);
          resolve();
        }, reject);

        const req = httpMock.expectOne('assets/data/nomenclature.json');
        req.flush(mockNomenclature);
      });
    });
  });

  describe('hasTechnique', () => {
    it('should return true if technique exists', () => {
      return new Promise<void>((resolve, reject) => {
        service.loadNomenclature().subscribe(() => {
          expect(service.hasTechnique('6e Kyū', 'Suwariwaza', 'Shomen Uchi', 'Ikkyo')).toBe(true);
          resolve();
        }, reject);

        const req = httpMock.expectOne('assets/data/nomenclature.json');
        req.flush(mockNomenclature);
      });
    });

    it('should return false if technique does not exist', () => {
      return new Promise<void>((resolve, reject) => {
        service.loadNomenclature().subscribe(() => {
          expect(service.hasTechnique('6e Kyū', 'Suwariwaza', 'Shomen Uchi', 'Non Existent')).toBe(false);
          resolve();
        }, reject);

        const req = httpMock.expectOne('assets/data/nomenclature.json');
        req.flush(mockNomenclature);
      });
    });
  });

  describe('getTechniquesForGrade', () => {
    it('should return techniques with filters', () => {
      return new Promise<void>((resolve, reject) => {
        service.loadNomenclature().subscribe(() => {
          service.loadVideos().subscribe(() => {
            const filters: PassageFilters = {
              positions: ['Suwariwaza'],
              attacks: ['Shomen Uchi'],
              techniques: [],
              includeWeapons: false,
              includeRandori: false
            };

            const techniques = service.getTechniquesForGrade('6e Kyū', filters);
            expect(techniques.length).toBeGreaterThan(0);
            expect(techniques[0].position).toBe('Suwariwaza');
            expect(techniques[0].attack).toBe('Shomen Uchi');
            expect(techniques[0].order).toBe(1);
            resolve();
          }, reject);

          const req2 = httpMock.expectOne('assets/data/videos.json');
          req2.flush(mockVideos);
        }, reject);

        const req1 = httpMock.expectOne('assets/data/nomenclature.json');
        req1.flush(mockNomenclature);
      });
    });

    it('should return empty array for invalid grade', () => {
      const filters: PassageFilters = {
        positions: [],
        attacks: [],
        techniques: [],
        includeWeapons: false,
        includeRandori: false
      };

      const techniques = service.getTechniquesForGrade('Invalid Grade', filters);
      expect(techniques).toEqual([]);
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
