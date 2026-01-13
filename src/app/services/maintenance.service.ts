import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap, filter, take, map } from 'rxjs/operators';

/**
 * Interface pour la configuration de maintenance
 */
interface MaintenanceConfig {
  maintenanceEnabled: boolean;
  allowedIPs?: string[];
}

/**
 * Service pour gérer l'état de maintenance de l'application
 * Responsabilité: Charger et gérer l'état de maintenance depuis un fichier de configuration
 */
@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
  private readonly configPath = 'assets/data/maintenance-config.json';
  private readonly ipServiceUrl = 'https://api.ipify.org?format=json';
  private maintenanceEnabled$ = new BehaviorSubject<boolean | null>(null);
  private configCache: MaintenanceConfig | null = null;
  private configLoaded = false;
  private userIP: string | null = null;

  constructor(private http: HttpClient) {
    this.loadMaintenanceConfig();
  }

  /**
   * Charge la configuration de maintenance depuis le fichier JSON
   */
  private loadMaintenanceConfig(): void {
    this.http.get<MaintenanceConfig>(this.configPath, { 
      // Désactiver le cache pour forcer le rechargement du fichier
      headers: { 'Cache-Control': 'no-cache' }
    })
      .pipe(
        tap(config => {
          this.configCache = {
            maintenanceEnabled: config.maintenanceEnabled,
            allowedIPs: config.allowedIPs || []
          };
          this.configLoaded = true;
          this.maintenanceEnabled$.next(config.maintenanceEnabled);
          console.log('[MaintenanceService] Configuration chargée:', this.configCache);
        }),
        catchError(error => {
          console.error('[MaintenanceService] Erreur lors du chargement de la configuration:', error);
          // En cas d'erreur, par défaut on considère que la maintenance n'est pas activée
          this.configCache = { maintenanceEnabled: false, allowedIPs: [] };
          this.configLoaded = true;
          this.maintenanceEnabled$.next(false);
          return of({ maintenanceEnabled: false, allowedIPs: [] });
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

  /**
   * Obtient l'adresse IP publique de l'utilisateur
   * @returns Observable<string> contenant l'adresse IP
   */
  getUserIP(): Observable<string> {
    // Si l'IP est déjà en cache, la retourner immédiatement
    if (this.userIP) {
      return of(this.userIP);
    }

    // Sinon, la récupérer depuis le service externe
    return this.http.get<{ ip: string }>(this.ipServiceUrl).pipe(
      map(response => {
        this.userIP = response.ip;
        console.log('[MaintenanceService] IP utilisateur récupérée:', this.userIP);
        return this.userIP;
      }),
      catchError(error => {
        console.error('[MaintenanceService] Erreur lors de la récupération de l\'IP:', error);
        // En cas d'erreur, retourner une chaîne vide
        return of('');
      })
    );
  }

  /**
   * Vérifie si l'IP de l'utilisateur est dans la liste des IPs autorisées
   * @returns Observable<boolean> indiquant si l'IP est autorisée
   */
  isIPAllowed(): Observable<boolean> {
    // Si la maintenance n'est pas activée ou qu'il n'y a pas d'IPs autorisées, retourner true
    if (!this.configCache?.maintenanceEnabled || !this.configCache.allowedIPs || this.configCache.allowedIPs.length === 0) {
      return of(true);
    }

    // Récupérer l'IP de l'utilisateur et vérifier si elle est dans la liste
    return this.getUserIP().pipe(
      map(userIP => {
        if (!userIP) {
          // Si on ne peut pas obtenir l'IP, bloquer par sécurité
          console.warn('[MaintenanceService] Impossible d\'obtenir l\'IP, accès refusé');
          return false;
        }

        const isAllowed = this.configCache!.allowedIPs!.includes(userIP);
        console.log('[MaintenanceService] Vérification IP:', userIP, 'Autorisée:', isAllowed);
        return isAllowed;
      }),
      catchError(error => {
        console.error('[MaintenanceService] Erreur lors de la vérification de l\'IP:', error);
        // En cas d'erreur, bloquer par sécurité
        return of(false);
      })
    );
  }

  /**
   * Vérifie de manière synchrone si l'IP est autorisée (utilise le cache)
   * Note: Cette méthode ne peut pas obtenir l'IP si elle n'est pas déjà en cache
   * @returns booléen indiquant si l'IP est autorisée (ou true si l'IP n'est pas encore chargée)
   */
  isIPAllowedSync(): boolean {
    // Si la maintenance n'est pas activée ou qu'il n'y a pas d'IPs autorisées, retourner true
    if (!this.configCache?.maintenanceEnabled || !this.configCache.allowedIPs || this.configCache.allowedIPs.length === 0) {
      return true;
    }

    // Si l'IP n'est pas encore chargée, on ne peut pas vérifier de manière synchrone
    // On retourne false par sécurité
    if (!this.userIP) {
      return false;
    }

    return this.configCache.allowedIPs.includes(this.userIP);
  }
}
