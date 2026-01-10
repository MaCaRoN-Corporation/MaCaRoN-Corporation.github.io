import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap, filter, take } from 'rxjs/operators';

/**
 * Service pour gérer l'état de maintenance de l'application
 * Responsabilité: Charger et gérer l'état de maintenance depuis un fichier de configuration
 */
@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
  private readonly configPath = 'assets/data/maintenance-config.json';
  private maintenanceEnabled$ = new BehaviorSubject<boolean | null>(null);
  private configCache: { maintenanceEnabled: boolean } | null = null;
  private configLoaded = false;

  constructor(private http: HttpClient) {
    this.loadMaintenanceConfig();
  }

  /**
   * Charge la configuration de maintenance depuis le fichier JSON
   */
  private loadMaintenanceConfig(): void {
    this.http.get<{ maintenanceEnabled: boolean }>(this.configPath, { 
      // Désactiver le cache pour forcer le rechargement du fichier
      headers: { 'Cache-Control': 'no-cache' }
    })
      .pipe(
        tap(config => {
          this.configCache = config;
          this.configLoaded = true;
          this.maintenanceEnabled$.next(config.maintenanceEnabled);
          console.log('[MaintenanceService] Configuration chargée:', config);
        }),
        catchError(error => {
          console.error('[MaintenanceService] Erreur lors du chargement de la configuration:', error);
          // En cas d'erreur, par défaut on considère que la maintenance n'est pas activée
          this.configCache = { maintenanceEnabled: false };
          this.configLoaded = true;
          this.maintenanceEnabled$.next(false);
          return of({ maintenanceEnabled: false });
        })
      )
      .subscribe();
  }

  /**
   * Vérifie si le mode maintenance est activé
   * @returns Observable<booléen> indiquant si la maintenance est activée
   * Émet uniquement quand la configuration est chargée (filtre les valeurs null)
   */
  isMaintenanceEnabled(): Observable<boolean> {
    // Si le cache est déjà chargé, émettre immédiatement la valeur
    if (this.configLoaded && this.configCache !== null) {
      return of(this.configCache.maintenanceEnabled);
    }
    // Sinon, retourner l'observable qui émettra quand la config sera chargée
    // On filtre les valeurs null pour ne retourner que les valeurs réelles
    return this.maintenanceEnabled$.asObservable().pipe(
      filter((value): value is boolean => value !== null),
      take(1) // Prendre seulement la première valeur non-null
    );
  }

  /**
   * Vérifie de manière synchrone si le mode maintenance est activé (utilise le cache)
   * @returns booléen indiquant si la maintenance est activée
   */
  isMaintenanceEnabledSync(): boolean {
    return this.configCache?.maintenanceEnabled ?? false;
  }

  /**
   * Recharge la configuration de maintenance (utile après modification du fichier)
   */
  reloadConfig(): void {
    this.loadMaintenanceConfig();
  }
}
