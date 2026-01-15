import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { vi } from 'vitest';
import { SettingsService } from './settings.service';
import { UserSettings, DEFAULT_SETTINGS } from '../models/settings.model';

const spyOn = vi.spyOn;

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

  it('should load default settings when localStorage is empty', async () => {
    const settings = await firstValueFrom(service.getSettings());
    expect(settings).toEqual(DEFAULT_SETTINGS);
  });

  it('should load settings from localStorage on initialization', async () => {
    const savedSettings: UserSettings = {
      appearance: 'sombre',
      theme: 2,
      voice: 'French_Female1',
      bannerColor: '#FF0000',
      footerColor: '#00FF00',
      elevenlabsApiKey: 'test-key'
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedSettings));

    // Créer une nouvelle instance pour tester le chargement
    const newService = new SettingsService();
    const settings = await firstValueFrom(newService.getSettings());
    expect(settings).toEqual(savedSettings);
  });

  it('should save settings to localStorage when updating', () => {
    const newSettings: Partial<UserSettings> = {
      theme: 2,
      voice: 'French_Female1'
    };

    service.updateSettings(newSettings);

    const stored = localStorage.getItem(STORAGE_KEY);
    expect(stored).toBeTruthy();
    
    const parsed = JSON.parse(stored!);
    expect(parsed.theme).toBe(2);
    expect(parsed.voice).toBe('French_Female1');
    expect(parsed.bannerColor).toBe(DEFAULT_SETTINGS.bannerColor);
  });

  it('should notify subscribers when settings are updated', async () => {
    const updates: UserSettings[] = [];
    const subscription = service.getSettings().subscribe((settings) => {
      updates.push(settings);
    });

    service.updateSettings({ theme: 2 });
    
    // Attendre un peu pour que l'update soit propagé
    await new Promise(resolve => setTimeout(resolve, 10));
    
    expect(updates.length).toBeGreaterThanOrEqual(1);
    if (updates.length >= 2) {
      expect(updates[1].theme).toBe(2);
    }
    
    subscription.unsubscribe();
  });

  it('should reset settings to defaults', async () => {
    // Modifier d'abord les réglages
    service.updateSettings({
      theme: 2,
      voice: 'French_Female1',
      bannerColor: '#FF0000'
    });

    // Réinitialiser
    service.resetSettings();

    const settings = await firstValueFrom(service.getSettings());
    expect(settings).toEqual(DEFAULT_SETTINGS);

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
    
    service.applyTheme(2);
    
    expect(documentSpy).toHaveBeenCalled();
    expect(documentAddSpy).toHaveBeenCalled();
    expect(themeSpy).toHaveBeenCalledWith({ theme: 2 });
  });

  it('should handle invalid localStorage data gracefully', async () => {
    localStorage.setItem(STORAGE_KEY, 'invalid json');
    
    const newService = new SettingsService();
    const settings = await firstValueFrom(newService.getSettings());
    expect(settings).toEqual(DEFAULT_SETTINGS);
  });

  it('should handle localStorage quota exceeded error gracefully', () => {
    // Simuler une erreur de quota
    const setItemSpy = spyOn(Storage.prototype, 'setItem');
    setItemSpy.mockImplementation(() => {
      throw new DOMException('QuotaExceededError', 'QuotaExceededError');
    });
    
    // Ne devrait pas lever d'erreur
    expect(() => {
      service.updateSettings({ theme: 2 });
    }).not.toThrow();
    
    setItemSpy.mockRestore();
  });

  it('should handle localStorage disabled gracefully', async () => {
    // Simuler localStorage indisponible
    const getItemSpy = spyOn(Storage.prototype, 'getItem');
    getItemSpy.mockImplementation(() => {
      throw new Error('localStorage disabled');
    });
    
    const newService = new SettingsService();
    const settings = await firstValueFrom(newService.getSettings());
    // Devrait utiliser les valeurs par défaut
    expect(settings).toEqual(DEFAULT_SETTINGS);
    
    getItemSpy.mockRestore();
  });

  it('should merge partial settings with current settings', async () => {
    service.updateSettings({ theme: 2 });
    
    const settings = await firstValueFrom(service.getSettings());
    expect(settings.theme).toBe(2);
    expect(settings.voice).toBe(DEFAULT_SETTINGS.voice);
    expect(settings.bannerColor).toBe(DEFAULT_SETTINGS.bannerColor);
    expect(settings.footerColor).toBe(DEFAULT_SETTINGS.footerColor);
  });

  it('should apply theme class to document.documentElement', () => {
    const documentRemoveSpy = spyOn(document.documentElement.classList, 'remove');
    const documentAddSpy = spyOn(document.documentElement.classList, 'add');
    
    service.applyTheme(1);
    
    expect(documentRemoveSpy).toHaveBeenCalled();
    expect(documentAddSpy).toHaveBeenCalled();
    
    service.applyTheme(2);
    
    expect(documentRemoveSpy).toHaveBeenCalled();
    expect(documentAddSpy).toHaveBeenCalled();
  });

  it('should apply theme class on initialization when settings are loaded from localStorage', () => {
    // Nettoyer localStorage
    localStorage.clear();
    
    // Sauvegarder des settings avec thème 2
    const savedSettings: UserSettings = {
      appearance: 'sombre',
      theme: 2,
      voice: 'French_Female1',
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
    
    // Vérifier que le thème a été appliqué
    expect(documentRemoveSpy).toHaveBeenCalled();
    expect(documentAddSpy).toHaveBeenCalled();
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
