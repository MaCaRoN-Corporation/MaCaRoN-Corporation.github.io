import { TestBed } from '@angular/core/testing';
import { SettingsService } from './settings.service';
import { UserSettings, DEFAULT_SETTINGS } from '../models/settings.model';

describe('SettingsService', () => {
  let service: SettingsService;
  const STORAGE_KEY = 'keiko-hub-settings';

  beforeEach(() => {
    // Nettoyer localStorage avant chaque test
    localStorage.clear();
    
    TestBed.configureTestingModule({
      providers: [SettingsService]
    });
    service = TestBed.inject(SettingsService);
  });

  afterEach(() => {
    // Nettoyer localStorage après chaque test
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load default settings when localStorage is empty', (done) => {
    service.getSettings().subscribe((settings) => {
      expect(settings).toEqual(DEFAULT_SETTINGS);
      done();
    });
  });

  it('should load settings from localStorage on initialization', (done) => {
    const savedSettings: UserSettings = {
      theme: 'sombre',
      voice: 'féminin',
      bannerColor: '#FF0000',
      footerColor: '#00FF00',
      elevenlabsApiKey: 'test-key'
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedSettings));

    // Créer une nouvelle instance pour tester le chargement
    const newService = new SettingsService();
    newService.getSettings().subscribe((settings) => {
      expect(settings).toEqual(savedSettings);
      done();
    });
  });

  it('should save settings to localStorage when updating', () => {
    const newSettings: Partial<UserSettings> = {
      theme: 'sombre',
      voice: 'féminin'
    };

    service.updateSettings(newSettings);

    const stored = localStorage.getItem(STORAGE_KEY);
    expect(stored).toBeTruthy();
    
    const parsed = JSON.parse(stored!);
    expect(parsed.theme).toBe('sombre');
    expect(parsed.voice).toBe('féminin');
    expect(parsed.bannerColor).toBe(DEFAULT_SETTINGS.bannerColor);
  });

  it('should notify subscribers when settings are updated', (done) => {
    const updates: UserSettings[] = [];
    service.getSettings().subscribe((settings) => {
      updates.push(settings);
      if (updates.length === 2) {
        expect(updates[1].theme).toBe('sombre');
        done();
      }
    });

    service.updateSettings({ theme: 'sombre' });
  });

  it('should reset settings to defaults', (done) => {
    // Modifier d'abord les réglages
    service.updateSettings({
      theme: 'sombre',
      voice: 'féminin',
      bannerColor: '#FF0000'
    });

    // Réinitialiser
    service.resetSettings();

    service.getSettings().subscribe((settings) => {
      expect(settings).toEqual(DEFAULT_SETTINGS);
      done();
    });

    // Vérifier que localStorage contient les valeurs par défaut
    const stored = localStorage.getItem(STORAGE_KEY);
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed).toEqual(DEFAULT_SETTINGS);
  });

  it('should apply theme using updateSettings', () => {
    const themeSpy = spyOn(service, 'updateSettings');
    const documentSpy = spyOn(document.documentElement.classList, 'remove');
    const documentAddSpy = spyOn(document.documentElement.classList, 'add');
    
    service.applyTheme('sombre');
    
    expect(documentSpy).toHaveBeenCalledWith('theme-clair', 'theme-sombre');
    expect(documentAddSpy).toHaveBeenCalledWith('theme-sombre');
    expect(themeSpy).toHaveBeenCalledWith({ theme: 'sombre' });
  });

  it('should handle invalid localStorage data gracefully', (done) => {
    localStorage.setItem(STORAGE_KEY, 'invalid json');
    
    const newService = new SettingsService();
    newService.getSettings().subscribe((settings) => {
      expect(settings).toEqual(DEFAULT_SETTINGS);
      done();
    });
  });

  it('should handle localStorage quota exceeded error gracefully', () => {
    // Simuler une erreur de quota
    spyOn(Storage.prototype, 'setItem').and.throwError(new DOMException('QuotaExceededError', 'QuotaExceededError'));
    
    // Ne devrait pas lever d'erreur
    expect(() => {
      service.updateSettings({ theme: 'sombre' });
    }).not.toThrow();
  });

  it('should handle localStorage disabled gracefully', (done) => {
    // Simuler localStorage indisponible
    spyOn(Storage.prototype, 'getItem').and.throwError(new Error('localStorage disabled'));
    
    const newService = new SettingsService();
    newService.getSettings().subscribe((settings) => {
      // Devrait utiliser les valeurs par défaut
      expect(settings).toEqual(DEFAULT_SETTINGS);
      done();
    });
  });

  it('should merge partial settings with current settings', (done) => {
    service.updateSettings({ theme: 'sombre' });
    
    service.getSettings().subscribe((settings) => {
      if (settings.theme === 'sombre') {
        expect(settings.voice).toBe(DEFAULT_SETTINGS.voice);
        expect(settings.bannerColor).toBe(DEFAULT_SETTINGS.bannerColor);
        expect(settings.footerColor).toBe(DEFAULT_SETTINGS.footerColor);
        done();
      }
    });
  });

  it('should apply theme class to document.documentElement', () => {
    const documentRemoveSpy = spyOn(document.documentElement.classList, 'remove');
    const documentAddSpy = spyOn(document.documentElement.classList, 'add');
    
    service.applyTheme('clair');
    
    expect(documentRemoveSpy).toHaveBeenCalledWith('theme-clair', 'theme-sombre');
    expect(documentAddSpy).toHaveBeenCalledWith('theme-clair');
    
    service.applyTheme('sombre');
    
    expect(documentRemoveSpy).toHaveBeenCalledWith('theme-clair', 'theme-sombre');
    expect(documentAddSpy).toHaveBeenCalledWith('theme-sombre');
  });

  it('should apply theme class on initialization when settings are loaded from localStorage', () => {
    // Nettoyer localStorage
    localStorage.clear();
    
    // Sauvegarder des settings avec thème sombre
    const savedSettings: UserSettings = {
      theme: 'sombre',
      voice: 'féminin',
      bannerColor: '#FF0000',
      footerColor: '#00FF00',
      elevenlabsApiKey: 'test-key'
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedSettings));
    
    // Créer des spies pour vérifier l'application du thème
    const documentRemoveSpy = spyOn(document.documentElement.classList, 'remove');
    const documentAddSpy = spyOn(document.documentElement.classList, 'add');
    
    // Créer une nouvelle instance - le constructeur devrait appliquer le thème
    const newService = new SettingsService();
    
    // Vérifier que le thème sombre a été appliqué
    expect(documentRemoveSpy).toHaveBeenCalledWith('theme-clair', 'theme-sombre');
    expect(documentAddSpy).toHaveBeenCalledWith('theme-sombre');
  });

  it('should apply default theme (clair) on initialization when localStorage is empty', () => {
    // S'assurer que localStorage est vide
    localStorage.clear();
    
    // Créer des spies pour vérifier l'application du thème
    const documentRemoveSpy = spyOn(document.documentElement.classList, 'remove');
    const documentAddSpy = spyOn(document.documentElement.classList, 'add');
    
    // Créer une nouvelle instance - le constructeur devrait appliquer le thème par défaut
    const newService = new SettingsService();
    
    // Vérifier que le thème clair (par défaut) a été appliqué
    expect(documentAddSpy).toHaveBeenCalledWith('theme-clair');
  });
});
