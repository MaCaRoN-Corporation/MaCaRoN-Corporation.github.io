import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserSettings, DEFAULT_SETTINGS } from '../models/settings.model';

/**
 * Clé utilisée pour stocker les réglages dans localStorage
 */
const STORAGE_KEY = 'keiko-hub-settings';

/**
 * Service pour gérer les réglages utilisateur
 * Responsabilité: Gestion des réglages utilisateur (thème, couleurs, voix),
 * persistance dans localStorage
 */
@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private settings$ = new BehaviorSubject<UserSettings>(DEFAULT_SETTINGS);

  constructor() {
    // Charger les réglages depuis localStorage au démarrage
    const loadedSettings = this.loadSettings();
    this.settings$.next(loadedSettings);
    
    // Appliquer les couleurs au démarrage
    this.applyColors();
  }

  /**
   * Récupère les réglages utilisateur en tant qu'Observable
   * @returns Observable des réglages utilisateur
   */
  getSettings(): Observable<UserSettings> {
    return this.settings$.asObservable();
  }

  /**
   * Met à jour les réglages utilisateur
   * @param settings Les réglages partiels à mettre à jour
   */
  updateSettings(settings: Partial<UserSettings>): void {
    const currentSettings = this.settings$.getValue();
    const updatedSettings: UserSettings = {
      ...currentSettings,
      ...settings
    };
    this.settings$.next(updatedSettings);
    this.saveSettings(updatedSettings);
    
    // Si les couleurs ou le thème ont changé, appliquer les nouvelles couleurs
    if (settings.bannerColor || settings.footerColor || settings.theme) {
      this.applyColors();
    }
  }

  /**
   * Réinitialise les réglages aux valeurs par défaut
   */
  resetSettings(): void {
    this.settings$.next(DEFAULT_SETTINGS);
    this.saveSettings(DEFAULT_SETTINGS);
  }

  /**
   * Applique un thème (clair ou sombre) à l'application
   * @param theme Le thème à appliquer
   */
  applyTheme(theme: 'clair' | 'sombre'): void {
    const rootElement = document.documentElement;
    // Retirer toutes les classes de thème existantes
    rootElement.classList.remove('theme-clair', 'theme-sombre');
    // Ajouter la nouvelle classe de thème
    rootElement.classList.add(`theme-${theme}`);
    
    // Sauvegarder le thème dans les réglages
    this.updateSettings({ theme });
    
    // Appliquer également les couleurs de bannière et footer
    this.applyColors();
  }

  /**
   * Applique les couleurs de bannière et footer depuis les réglages
   */
  private applyColors(): void {
    const settings = this.settings$.getValue();
    const rootElement = document.documentElement;
    
    // Appliquer les couleurs de bannière et footer (pour accents, bordures, etc.)
    rootElement.style.setProperty('--banner-color', settings.bannerColor);
    rootElement.style.setProperty('--footer-color', settings.footerColor);
    
    // Adapter les fonds selon le thème
    const currentTheme = settings.theme;
    if (currentTheme === 'sombre') {
      // Pour le thème sombre, créer un voile sombre avec la couleur personnalisée assombrie
      // Convertir la couleur hex en rgba et l'assombrir pour créer un effet "nuit"
      const bannerRgb = this.hexToRgb(settings.bannerColor);
      const footerRgb = this.hexToRgb(settings.footerColor);
      
      if (bannerRgb) {
        // Pour le thème sombre avec fond nocturne, créer un voile sombre mais moins opaque pour préserver l'image
        // Assombrir la couleur (réduire de 85% pour créer un effet sombre) mais avec moins d'opacité
        const darkBannerR = Math.max(0, Math.floor(bannerRgb.r * 0.15));
        const darkBannerG = Math.max(0, Math.floor(bannerRgb.g * 0.15));
        const darkBannerB = Math.max(0, Math.floor(bannerRgb.b * 0.15));
        // Opacité réduite pour mieux voir l'image Background_night.png
        rootElement.style.setProperty('--banner-bg', `rgba(${darkBannerR}, ${darkBannerG}, ${darkBannerB}, 0.65)`);
      }
      if (footerRgb) {
        // Footer avec opacité un peu plus élevée mais toujours adapté au fond nocturne
        const darkFooterR = Math.max(0, Math.floor(footerRgb.r * 0.12));
        const darkFooterG = Math.max(0, Math.floor(footerRgb.g * 0.12));
        const darkFooterB = Math.max(0, Math.floor(footerRgb.b * 0.12));
        rootElement.style.setProperty('--footer-bg', `rgba(${darkFooterR}, ${darkFooterG}, ${darkFooterB}, 0.75)`);
      }
    } else {
      // Pour le thème clair, utiliser un fond clair avec une légère teinte de la couleur personnalisée
      const bannerRgb = this.hexToRgb(settings.bannerColor);
      const footerRgb = this.hexToRgb(settings.footerColor);
      
      // Créer un fond clair avec une très légère teinte de la couleur personnalisée
      if (bannerRgb) {
        // Mélanger avec blanc (ajouter 200 aux composantes pour créer un fond clair teinté)
        rootElement.style.setProperty('--banner-bg', `rgba(${Math.min(255, bannerRgb.r + 200)}, ${Math.min(255, bannerRgb.g + 200)}, ${Math.min(255, bannerRgb.b + 200)}, 0.75)`);
      }
      if (footerRgb) {
        rootElement.style.setProperty('--footer-bg', `rgba(${Math.min(255, footerRgb.r + 200)}, ${Math.min(255, footerRgb.g + 200)}, ${Math.min(255, footerRgb.b + 200)}, 0.6)`);
      }
    }
  }

  /**
   * Convertit une couleur hex en RGB
   * @param hex La couleur hex (ex: #4A90E2)
   * @returns Un objet avec r, g, b ou null si invalide
   */
  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null;
  }

  /**
   * Charge les réglages depuis localStorage
   * @returns Les réglages chargés ou les valeurs par défaut en cas d'erreur
   */
  private loadSettings(): UserSettings {
    try {
      if (!this.isLocalStorageAvailable()) {
        return DEFAULT_SETTINGS;
      }

      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return DEFAULT_SETTINGS;
      }

      const parsed: unknown = JSON.parse(stored);
      if (!this.isValidSettings(parsed)) {
        console.warn('[SettingsService] Invalid settings in localStorage, using defaults');
        return DEFAULT_SETTINGS;
      }

      return parsed as UserSettings;
    } catch (error) {
      console.error('[SettingsService] Error loading settings from localStorage:', error);
      return DEFAULT_SETTINGS;
    }
  }

  /**
   * Sauvegarde les réglages dans localStorage
   * @param settings Les réglages à sauvegarder
   */
  private saveSettings(settings: UserSettings): void {
    try {
      if (!this.isLocalStorageAvailable()) {
        console.warn('[SettingsService] localStorage is not available');
        return;
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.error('[SettingsService] localStorage quota exceeded');
      } else {
        console.error('[SettingsService] Error saving settings to localStorage:', error);
      }
      // Ne pas bloquer l'application en cas d'erreur de sauvegarde
    }
  }

  /**
   * Vérifie si localStorage est disponible
   * @returns true si localStorage est disponible, false sinon
   */
  private isLocalStorageAvailable(): boolean {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Vérifie si un objet est une instance valide de UserSettings
   * @param obj L'objet à valider
   * @returns true si l'objet est valide, false sinon
   */
  private isValidSettings(obj: unknown): obj is UserSettings {
    if (!obj || typeof obj !== 'object') {
      return false;
    }

    const settings = obj as Record<string, unknown>;

    // Vérifier theme
    if (settings['theme'] !== 'clair' && settings['theme'] !== 'sombre') {
      return false;
    }

    // Vérifier voice
    if (settings['voice'] !== 'masculin' && settings['voice'] !== 'féminin') {
      return false;
    }

    // Vérifier bannerColor
    if (typeof settings['bannerColor'] !== 'string') {
      return false;
    }

    // Vérifier footerColor
    if (typeof settings['footerColor'] !== 'string') {
      return false;
    }

    // Vérifier elevenlabsApiKey (peut être null ou string)
    if (settings['elevenlabsApiKey'] !== null && typeof settings['elevenlabsApiKey'] !== 'string') {
      return false;
    }

    return true;
  }
}
