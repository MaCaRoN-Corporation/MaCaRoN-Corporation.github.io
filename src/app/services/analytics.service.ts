import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

/**
 * Interface pour les métriques Google Analytics
 */
export interface AnalyticsMetrics {
  visitorsToday: number | null;
  visitorsThisMonth: number | null;
  lastUpdated?: string;
}

/**
 * Service pour gérer les métriques Google Analytics
 * Responsabilité: Récupération des métriques depuis Google Analytics
 * 
 * Note: Pour récupérer les métriques depuis Google Analytics, il faut utiliser
 * l'API Google Analytics Data API qui nécessite une authentification côté serveur.
 * Ce service peut être étendu pour utiliser un backend proxy ou une fonction serverless.
 * 
 * SÉCURITÉ: Les valeurs par défaut sont publiques et peuvent être dans le repo.
 * Pour des secrets, utiliser analytics.config.ts (non versionné) - voir docs/security-google-analytics.md
 */
@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  // ID Measurement Google Analytics - PUBLIC (visible dans le code source du site)
  // C'est normal et attendu pour GA4
  private readonly GA_PROPERTY_ID = 'G-H0MY2T492N';
  
  // URL de l'API Google Apps Script
  // IMPORTANT: Si vous avez une clé API, utilisez analytics.config.ts (non versionné)
  // Voir docs/security-google-analytics.md pour la sécurisation
  private readonly METRICS_API_URL = 'https://script.google.com/macros/s/AKfycbyURxdAhitjOSShrRlpCwjaK1iSPVZJTiq7w1ePtS9j5dXjBDUZ0meF5kHvQF5i93RHTg/exec';
  
  // Clé API optionnelle (à configurer dans analytics.config.ts si nécessaire)
  private readonly METRICS_API_KEY: string | null = null;
  
  private metrics$ = new BehaviorSubject<AnalyticsMetrics>({
    visitorsToday: null,
    visitorsThisMonth: null
  });

  // Cache pour éviter trop de requêtes
  private lastFetchTime: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor(private http: HttpClient) {
    // Charger les métriques au démarrage
    this.loadMetrics();
    
    // Rafraîchir périodiquement (toutes les 10 minutes)
    setInterval(() => this.loadMetrics(), 10 * 60 * 1000);
  }

  /**
   * Récupère les métriques en tant qu'Observable
   * @returns Observable des métriques Google Analytics
   */
  getMetrics(): Observable<AnalyticsMetrics> {
    return this.metrics$.asObservable();
  }

  /**
   * Charge les métriques depuis l'API Google Apps Script
   * 
   * Cette méthode appelle un endpoint Google Apps Script qui fait office de proxy
   * pour récupérer les métriques depuis l'API Google Analytics Data API.
   * 
   * Voir la documentation: docs/google-analytics-metrics-setup.md
   */
  private loadMetrics(): void {
    // Vérifier le cache pour éviter trop de requêtes
    const now = Date.now();
    if (now - this.lastFetchTime < this.CACHE_DURATION) {
      return; // Utiliser les données en cache
    }

    // Si l'URL n'est pas configurée, ne rien faire
    if (this.METRICS_API_URL.includes('YOUR_SCRIPT_ID')) {
      console.warn('[AnalyticsService] URL de l\'API non configurée. Voir docs/google-analytics-metrics-setup.md');
      return;
    }

    // Préparer les paramètres de requête
    let params = new HttpParams();
    if (this.METRICS_API_KEY) {
      params = params.set('key', this.METRICS_API_KEY);
    }

    this.http.get<AnalyticsMetrics>(this.METRICS_API_URL, { params })
      .pipe(
        catchError(error => {
          console.error('[AnalyticsService] Error loading analytics metrics:', error);
          // Ne pas mettre à jour les métriques en cas d'erreur
          // Garder les dernières valeurs connues (ou null si première erreur)
          return of(null);
        }),
        tap(metrics => {
          if (metrics) {
            this.lastFetchTime = now;
            this.metrics$.next({
              visitorsToday: metrics.visitorsToday,
              visitorsThisMonth: metrics.visitorsThisMonth,
              lastUpdated: metrics.lastUpdated
            });
          }
        })
      )
      .subscribe();
  }

  /**
   * Récupère le nombre de visiteurs aujourd'hui
   * @returns Observable du nombre de visiteurs aujourd'hui
   */
  getVisitorsToday(): Observable<number | null> {
    return this.metrics$.pipe(
      map(metrics => metrics.visitorsToday)
    );
  }

  /**
   * Récupère le nombre de visiteurs ce mois
   * @returns Observable du nombre de visiteurs ce mois
   */
  getVisitorsThisMonth(): Observable<number | null> {
    return this.metrics$.pipe(
      map(metrics => metrics.visitorsThisMonth)
    );
  }

  /**
   * Rafraîchit les métriques manuellement (force le rechargement même si en cache)
   */
  refreshMetrics(): void {
    this.lastFetchTime = 0; // Forcer le rechargement en réinitialisant le cache
    this.loadMetrics();
  }
}
