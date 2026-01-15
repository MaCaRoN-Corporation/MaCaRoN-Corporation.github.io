import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { PassageService } from './passage.service';
import { GradeService } from './grade.service';
import { Passage, PassageConfig } from '../models/passage.model';
import { Technique } from '../models/technique.model';
import { PassageFilters } from '../models/passage-filters.model';
import { VoiceId } from '../models/settings.model';

describe('PassageService', () => {
  let service: PassageService;
  let gradeServiceSpy: { getTechniquesForGrade: (grade: string, filters: PassageFilters) => Technique[] };

  const mockTechniques: Technique[] = [
    {
      attack: 'Shomen Uchi',
      technique: 'Ikkyo',
      position: 'Suwariwaza',
      order: 1,
      videoUrl: ['https://example.com/video1.mp4']
    },
    {
      attack: 'Yokomen Uchi',
      technique: 'Ikkyo',
      position: 'Suwariwaza',
      order: 2,
      videoUrl: ['https://example.com/video2.mp4']
    },
    {
      attack: 'Katate Dori',
      technique: 'Ikkyo',
      position: 'Tashiwaza',
      order: 3,
      videoUrl: ['https://example.com/video3.mp4']
    },
    {
      attack: 'Shomen Uchi',
      technique: 'Ikkyo',
      position: 'Hanmi Handachi',
      order: 4,
      videoUrl: ['https://example.com/video4.mp4']
    }
  ];

  beforeEach(() => {
    gradeServiceSpy = {
      getTechniquesForGrade: (grade: string, filters: PassageFilters) => [...mockTechniques]
    };

    TestBed.configureTestingModule({
      providers: [
        PassageService,
        { provide: GradeService, useValue: gradeServiceSpy }
      ]
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

  describe('generatePassage', () => {
    const mockGrade = '6e Kyū';
    const mockFilters: PassageFilters = {
      positions: [],
      attacks: [],
      techniques: [],
      includeWeapons: false,
      includeRandori: false
    };
    const mockConfig: PassageConfig = {
      duration: 10,
      timeBetweenTechniques: 20,
      voice: 'masculin' as VoiceId
    };

    it('should generate a passage with correct structure', () => {
      const passage = service.generatePassage(mockGrade, mockFilters, mockConfig);

      expect(passage).toBeDefined();
      expect(passage.id).toBeDefined();
      expect(passage.id).toContain('passage-');
      expect(passage.grade).toBe(mockGrade);
      expect(passage.techniques).toBeDefined();
      expect(Array.isArray(passage.techniques)).toBe(true);
      expect(passage.duration).toBe(mockConfig.duration);
      expect(passage.timeBetweenTechniques).toBe(mockConfig.timeBetweenTechniques);
      expect(passage.voice).toBe(mockConfig.voice);
      expect(passage.filters).toEqual(mockFilters);
      expect(passage.createdAt).toBeInstanceOf(Date);
      expect(passage.completedAt).toBeNull();
    });

    it('should respect strict order: Suwariwaza → Hanmi Handachi → Tashiwaza → Armes', () => {
      const passage = service.generatePassage(mockGrade, mockFilters, mockConfig);
      const techniquesWithoutRandori = passage.techniques.filter(t => t.attack !== 'Randori');
      const positions = techniquesWithoutRandori.map(t => t.position);

      // Vérifier que les positions respectent l'ordre strict
      const strictOrder = ['Suwariwaza', 'Hanmi Handachi', 'Tashiwaza', 'Armes'];
      let lastPositionIndex = -1;

      for (const position of positions) {
        const currentIndex = strictOrder.indexOf(position);
        expect(currentIndex).toBeGreaterThanOrEqual(lastPositionIndex);
        if (currentIndex > lastPositionIndex) {
          lastPositionIndex = currentIndex;
        }
      }
    });

    it('should assign correct order to techniques (1-based)', () => {
      const passage = service.generatePassage(mockGrade, mockFilters, mockConfig);

      passage.techniques.forEach((technique, index) => {
        expect(technique.order).toBe(index + 1);
      });
    });

    it('should include all required fields in each technique', () => {
      const passage = service.generatePassage(mockGrade, mockFilters, mockConfig);

      passage.techniques.forEach(technique => {
        expect(technique.attack).toBeDefined();
        expect(typeof technique.attack).toBe('string');
        expect(technique.technique).toBeDefined();
        expect(typeof technique.technique).toBe('string');
        expect(technique.position).toBeDefined();
        expect(['Suwariwaza', 'Hanmi Handachi', 'Tashiwaza', 'Armes']).toContain(technique.position);
        expect(technique.order).toBeDefined();
        expect(typeof technique.order).toBe('number');
        expect(technique.order).toBeGreaterThan(0);
      });
    });

    it('should ensure techniques are unique (no duplicates)', () => {
      const passage = service.generatePassage(mockGrade, mockFilters, mockConfig);
      const techniqueKeys = new Set<string>();

      passage.techniques.forEach(technique => {
        const key = `${technique.attack}-${technique.technique}-${technique.position}`;
        expect(techniqueKeys.has(key)).toBe(false);
        techniqueKeys.add(key);
      });
    });

    it('should throw error when no techniques are available', () => {
      gradeServiceSpy.getTechniquesForGrade = () => [];

      expect(() => {
        service.generatePassage(mockGrade, mockFilters, mockConfig);
      }).toThrow(`Aucune technique disponible pour le grade "${mockGrade}" avec les filtres sélectionnés.`);
    });

    it('should add Randori as final technique when includeRandori is true', () => {
      const filtersWithRandori: PassageFilters = {
        ...mockFilters,
        includeRandori: true
      };

      const passage = service.generatePassage(mockGrade, filtersWithRandori, mockConfig);
      const lastTechnique = passage.techniques[passage.techniques.length - 1];

      expect(lastTechnique.attack).toBe('Randori');
      expect(lastTechnique.technique).toBe('Randori');
      expect(lastTechnique.position).toBe('Armes');
      expect(lastTechnique.order).toBe(passage.techniques.length);
      expect(lastTechnique.videoUrl).toBeNull();
    });

    it('should not add Randori when includeRandori is false', () => {
      const filtersWithoutRandori: PassageFilters = {
        ...mockFilters,
        includeRandori: false
      };

      const passage = service.generatePassage(mockGrade, filtersWithoutRandori, mockConfig);
      const hasRandori = passage.techniques.some(t => t.attack === 'Randori' && t.technique === 'Randori');

      expect(hasRandori).toBe(false);
    });

    it('should generate unique passage IDs', () => {
      const passage1 = service.generatePassage(mockGrade, mockFilters, mockConfig);
      const passage2 = service.generatePassage(mockGrade, mockFilters, mockConfig);

      expect(passage1.id).not.toBe(passage2.id);
    });

    it('should reorganize techniques by position while maintaining strict order', () => {
      // Créer des techniques dans un ordre désordonné
      const unorderedTechniques: Technique[] = [
        { attack: 'A', technique: 'T1', position: 'Tashiwaza', order: 1, videoUrl: null },
        { attack: 'B', technique: 'T2', position: 'Suwariwaza', order: 2, videoUrl: null },
        { attack: 'C', technique: 'T3', position: 'Hanmi Handachi', order: 3, videoUrl: null },
        { attack: 'D', technique: 'T4', position: 'Suwariwaza', order: 4, videoUrl: null }
      ];

      gradeServiceSpy.getTechniquesForGrade = () => unorderedTechniques;
      const passage = service.generatePassage(mockGrade, mockFilters, mockConfig);

      // Vérifier que l'ordre est respecté : Suwariwaza d'abord, puis Hanmi Handachi, puis Tashiwaza
      const positions = passage.techniques
        .filter(t => t.attack !== 'Randori') // Exclure Randori
        .map(t => t.position);

      const strictOrder = ['Suwariwaza', 'Hanmi Handachi', 'Tashiwaza', 'Armes'];
      let lastIndex = -1;

      for (const pos of positions) {
        const currentIndex = strictOrder.indexOf(pos);
        expect(currentIndex).toBeGreaterThanOrEqual(lastIndex);
        if (currentIndex > lastIndex) {
          lastIndex = currentIndex;
        }
      }
    });

    it('should handle techniques with only one position', () => {
      const singlePositionTechniques: Technique[] = [
        { attack: 'A', technique: 'T1', position: 'Tashiwaza', order: 1, videoUrl: null }
      ];

      gradeServiceSpy.getTechniquesForGrade = () => singlePositionTechniques;
      const passage = service.generatePassage(mockGrade, mockFilters, mockConfig);

      expect(passage.techniques.length).toBeGreaterThan(0);
      expect(passage.techniques[0].position).toBe('Tashiwaza');
    });
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

  it('should return Observable from getPassageState', () => {
    const state$ = service.getPassageState();
    expect(state$).toBeDefined();
    expect(state$.subscribe).toBeDefined();
  });

  describe('State Management', () => {
    const mockPassage: Passage = {
      id: 'test-passage-1',
      grade: '6e Kyū',
      techniques: mockTechniques,
      duration: 10,
      timeBetweenTechniques: 20,
      voice: 'masculin' as VoiceId,
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

    beforeEach(() => {
      gradeServiceSpy.getTechniquesForGrade = () => [...mockTechniques];
    });

    it('should initialize state with default values', async () => {
      const state = await firstValueFrom(service.getPassageState());
      expect(state.currentPassage).toBeNull();
      expect(state.currentTechniqueIndex).toBe(0);
      expect(state.isPlaying).toBe(false);
      expect(state.isPaused).toBe(false);
      expect(state.elapsedTime).toBe(0);
      expect(state.progress).toBe(0);
    });

    it('should start a passage and update state correctly', async () => {
      service.startPassage(mockPassage);

      const state = await firstValueFrom(service.getPassageState());
      expect(state.currentPassage).toEqual(mockPassage);
      expect(state.currentTechniqueIndex).toBe(0);
      expect(state.isPlaying).toBe(true);
      expect(state.isPaused).toBe(false);
      expect(state.elapsedTime).toBe(0);
      expect(state.progress).toBe(0);
    });

    it('should pause a passage correctly', async () => {
      service.startPassage(mockPassage);
      service.pausePassage();

      const state = await firstValueFrom(service.getPassageState());
      expect(state.isPaused).toBe(true);
      expect(state.isPlaying).toBe(true);
    });

    it('should resume a paused passage correctly', async () => {
      service.startPassage(mockPassage);
      service.pausePassage();
      service.resumePassage();

      const state = await firstValueFrom(service.getPassageState());
      expect(state.isPaused).toBe(false);
      expect(state.isPlaying).toBe(true);
    });

    it('should get current technique correctly', () => {
      service.startPassage(mockPassage);
      const currentTechnique = service.getCurrentTechnique();

      expect(currentTechnique).not.toBeNull();
      expect(currentTechnique?.attack).toBe(mockTechniques[0].attack);
      expect(currentTechnique?.technique).toBe(mockTechniques[0].technique);
    });

    it('should return null for current technique if no passage is started', () => {
      const currentTechnique = service.getCurrentTechnique();
      expect(currentTechnique).toBeNull();
    });

    it('should move to next technique correctly', async () => {
      service.startPassage(mockPassage);
      service.nextTechnique();

      const state = await firstValueFrom(service.getPassageState());
      expect(state.currentTechniqueIndex).toBe(1);
      expect(state.progress).toBeGreaterThan(0);
    });

    it('should complete passage when reaching the last technique', async () => {
      service.startPassage(mockPassage);
      
      // Move to the last technique
      const totalTechniques = mockPassage.techniques.length;
      for (let i = 0; i < totalTechniques; i++) {
        service.nextTechnique();
      }

      const state = await firstValueFrom(service.getPassageState());
      expect(state.isPlaying).toBe(false);
      expect(state.isPaused).toBe(false);
      expect(state.currentTechniqueIndex).toBe(totalTechniques - 1);
      expect(mockPassage.completedAt).toBeInstanceOf(Date);
    });

    it('should calculate progress correctly', async () => {
      service.startPassage(mockPassage);
      service.nextTechnique();
      service.nextTechnique();

      const state = await firstValueFrom(service.getPassageState());
      const expectedProgress = (state.currentTechniqueIndex / mockPassage.techniques.length) * 100;
      expect(state.progress).toBeCloseTo(expectedProgress, 1);
    });

    it('should handle pause when not playing', () => {
      // No passage started
      service.pausePassage();
      
      service.getPassageState().subscribe((state) => {
        expect(state.isPlaying).toBe(false);
        expect(state.isPaused).toBe(false);
      });
    });

    it('should handle resume when not paused', () => {
      service.startPassage(mockPassage);
      service.resumePassage(); // Already playing, not paused
      
      service.getPassageState().subscribe((state) => {
        expect(state.isPlaying).toBe(true);
        expect(state.isPaused).toBe(false);
      });
    });
  });
});
