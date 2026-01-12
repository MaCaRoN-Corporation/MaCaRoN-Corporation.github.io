import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Voice, AVAILABLE_VOICES } from '../models/settings.model';

/**
 * Service pour gérer les voix disponibles
 * Responsabilité: Chargement dynamique des voix depuis assets/audio/voices.json
 */
@Injectable({
  providedIn: 'root'
})
export class VoiceService {
  private voicesCache: Voice[] | null = null;

  constructor(private http: HttpClient) {}

  /**
   * Charge les voix disponibles depuis le fichier JSON
   * Utilise un cache pour éviter de recharger à chaque appel
   * @returns Observable des voix disponibles
   */
  getAvailableVoices(): Observable<Voice[]> {
    if (this.voicesCache) {
      return of(this.voicesCache);
    }

    return this.http.get<Voice[]>('assets/audio/voices.json').pipe(
      map((voices) => {
        // Valider et cacher les voix
        this.voicesCache = voices;
        return voices;
      }),
      catchError((error) => {
        console.warn('[VoiceService] Error loading voices.json, using default voices', error);
        // En cas d'erreur, utiliser les voix par défaut
        this.voicesCache = AVAILABLE_VOICES;
        return of(AVAILABLE_VOICES);
      })
    );
  }

  /**
   * Réinitialise le cache (utile pour le développement ou après modification du JSON)
   */
  clearCache(): void {
    this.voicesCache = null;
  }
}
