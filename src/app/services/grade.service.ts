import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { catchError, tap, shareReplay } from 'rxjs/operators';
import { NomenclatureData } from '../models/nomenclature.model';
import { VideosData } from '../models/videos.model';
import { Technique } from '../models/technique.model';
import { PassageFilters } from '../models/passage-filters.model';

/**
 * Service pour gérer les données de nomenclature et de vidéos
 * Responsabilité: Chargement et parsing des fichiers JSON (nomenclature.json, videos.json),
 * gestion de la logique de génération de passages selon les grades et filtres
 */
@Injectable({
  providedIn: 'root'
})
export class GradeService {
  private readonly NOMENCLATURE_URL = 'assets/data/nomenclature.json';
  private readonly VIDEOS_URL = 'assets/data/videos.json';

  private nomenclature$ = new BehaviorSubject<NomenclatureData | null>(null);
  private videos$ = new BehaviorSubject<VideosData | null>(null);

  // États de chargement
  private loadingNomenclature$ = new BehaviorSubject<boolean>(false);
  private loadingVideos$ = new BehaviorSubject<boolean>(false);

  // Caches et flags de chargement
  private nomenclatureCache: NomenclatureData | null = null;
  private videosCache: VideosData | null = null;
  private isLoadingNomenclature = false;
  private isLoadingVideos = false;

  // Observables en cache pour éviter les appels multiples
  private nomenclatureLoad$: Observable<NomenclatureData> | null = null;
  private videosLoad$: Observable<VideosData> | null = null;

  constructor(private http: HttpClient) {}

  /**
   * Charge les données de nomenclature depuis assets/data/nomenclature.json
   * Implémente un pattern de cache pour ne charger qu'une seule fois
   * @returns Observable des données de nomenclature
   */
  loadNomenclature(): Observable<NomenclatureData> {
    // Si les données sont déjà en cache, retourner directement
    if (this.nomenclatureCache !== null) {
      return of(this.nomenclatureCache);
    }

    // Si un chargement est déjà en cours, retourner l'observable existant
    if (this.nomenclatureLoad$ !== null) {
      return this.nomenclatureLoad$;
    }

    // Déclencher le chargement
    this.loadingNomenclature$.next(true);
    this.isLoadingNomenclature = true;

    this.nomenclatureLoad$ = this.http.get<NomenclatureData>(this.NOMENCLATURE_URL).pipe(
      tap((data: NomenclatureData) => {
        this.nomenclatureCache = data;
        this.nomenclature$.next(data);
        this.loadingNomenclature$.next(false);
        this.isLoadingNomenclature = false;
      }),
      catchError((error: HttpErrorResponse) => {
        this.loadingNomenclature$.next(false);
        this.isLoadingNomenclature = false;
        this.nomenclatureLoad$ = null; // Réinitialiser pour permettre un nouvel essai
        console.error('Error loading nomenclature:', error);
        
        const errorMessage = this.getErrorMessage(error);
        return throwError(() => new Error(`Failed to load nomenclature data: ${errorMessage}`));
      }),
      shareReplay(1) // Partage le résultat entre tous les subscribers
    );

    return this.nomenclatureLoad$;
  }

  /**
   * Charge les données de vidéos depuis assets/data/videos.json
   * Implémente un pattern de cache pour ne charger qu'une seule fois
   * @returns Observable des données de vidéos
   */
  loadVideos(): Observable<VideosData> {
    // Si les données sont déjà en cache, retourner directement
    if (this.videosCache !== null) {
      return of(this.videosCache);
    }

    // Si un chargement est déjà en cours, retourner l'observable existant
    if (this.videosLoad$ !== null) {
      return this.videosLoad$;
    }

    // Déclencher le chargement
    this.loadingVideos$.next(true);
    this.isLoadingVideos = true;

    this.videosLoad$ = this.http.get<VideosData>(this.VIDEOS_URL).pipe(
      tap((data: VideosData) => {
        this.videosCache = data;
        this.videos$.next(data);
        this.loadingVideos$.next(false);
        this.isLoadingVideos = false;
      }),
      catchError((error: HttpErrorResponse) => {
        this.loadingVideos$.next(false);
        this.isLoadingVideos = false;
        this.videosLoad$ = null; // Réinitialiser pour permettre un nouvel essai
        console.error('Error loading videos:', error);
        
        const errorMessage = this.getErrorMessage(error);
        return throwError(() => new Error(`Failed to load videos data: ${errorMessage}`));
      }),
      shareReplay(1) // Partage le résultat entre tous les subscribers
    );

    return this.videosLoad$;
  }

  /**
   * Observable pour l'état de chargement de la nomenclature
   * @returns Observable<boolean> true si en cours de chargement
   */
  get isLoadingNomenclature$(): Observable<boolean> {
    return this.loadingNomenclature$.asObservable();
  }

  /**
   * Observable pour l'état de chargement des vidéos
   * @returns Observable<boolean> true si en cours de chargement
   */
  get isLoadingVideos$(): Observable<boolean> {
    return this.loadingVideos$.asObservable();
  }

  /**
   * Observable pour les données de nomenclature (mis à jour automatiquement)
   * @returns Observable<NomenclatureData | null>
   */
  get nomenclatureData$(): Observable<NomenclatureData | null> {
    return this.nomenclature$.asObservable();
  }

  /**
   * Observable pour les données de vidéos (mis à jour automatiquement)
   * @returns Observable<VideosData | null>
   */
  get videosData$(): Observable<VideosData | null> {
    return this.videos$.asObservable();
  }

  /**
   * Génère un message d'erreur approprié selon le type d'erreur HTTP
   * @param error L'erreur HTTP
   * @returns Message d'erreur lisible
   */
  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 0) {
      // Erreur réseau
      return 'Network error - please check your connection';
    } else if (error.status === 404) {
      // Fichier non trouvé
      return 'File not found (404)';
    } else if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      return `Client error: ${error.error.message}`;
    } else {
      // Erreur serveur
      return `Server error (${error.status}): ${error.message}`;
    }
  }

  /**
   * Récupère les techniques disponibles pour un grade donné selon les filtres
   * @param grade Le grade sélectionné (ex: "6e Kyū", "1er Dan")
   * @param filters Les filtres à appliquer (positions, attaques, techniques)
   * @returns Liste des techniques correspondantes
   */
  getTechniquesForGrade(grade: string, filters: PassageFilters): Technique[] {
    // Implementation will be in future stories
    return [];
  }

  /**
   * Valide qu'un grade est valide selon la nomenclature
   * @param grade Le grade à valider
   * @returns true si le grade est valide, false sinon
   */
  validateGrade(grade: string): boolean {
    // Implementation will be in future stories
    return false;
  }
}
