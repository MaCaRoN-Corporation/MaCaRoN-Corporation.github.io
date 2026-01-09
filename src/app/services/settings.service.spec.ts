import { TestBed } from '@angular/core/testing';
import { SettingsService } from './settings.service';

describe('SettingsService', () => {
  let service: SettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SettingsService]
    });
    service = TestBed.inject(SettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have getSettings method', () => {
    expect(service.getSettings).toBeDefined();
    expect(typeof service.getSettings).toBe('function');
  });

  it('should have updateSettings method', () => {
    expect(service.updateSettings).toBeDefined();
    expect(typeof service.updateSettings).toBe('function');
  });

  it('should have resetSettings method', () => {
    expect(service.resetSettings).toBeDefined();
    expect(typeof service.resetSettings).toBe('function');
  });

  it('should have applyTheme method', () => {
    expect(service.applyTheme).toBeDefined();
    expect(typeof service.applyTheme).toBe('function');
  });
});
