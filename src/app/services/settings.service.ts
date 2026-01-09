import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserSettings } from '../models/settings.model';

/**
 * Service pour gérer les réglages utilisateur
 * Responsabilité: Gestion des réglages utilisateur (thème, couleurs, voix),
 * persistance dans localStorage
 */
@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private settings$ = new BehaviorSubject<UserSettings | null>(null);

  constructor() {
    // L'implémentation du chargement depuis localStorage sera faite dans Story 1.5
  }

  /**
   * Récupère les réglages utilisateur en tant qu'Observable
   * @returns Observable des réglages utilisateur
   */
  getSettings(): Observable<UserSettings> {
    // Implementation will be in future stories
    return this.settings$.asObservable() as Observable<UserSettings>;
  }

  /**
   * Met à jour les réglages utilisateur
   * @param settings Les réglages partiels à mettre à jour
   */
  updateSettings(settings: Partial<UserSettings>): void {
    // Implementation will be in future stories
  }

  /**
   * Réinitialise les réglages aux valeurs par défaut
   */
  resetSettings(): void {
    // Implementation will be in future stories
  }

  /**
   * Applique un thème (clair ou sombre) à l'application
   * @param theme Le thème à appliquer
   */
  applyTheme(theme: 'clair' | 'sombre'): void {
    // Implementation will be in future stories
  }
}
