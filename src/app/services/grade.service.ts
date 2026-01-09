import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
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
  private nomenclature$ = new BehaviorSubject<NomenclatureData | null>(null);
  private videos$ = new BehaviorSubject<VideosData | null>(null);

  constructor(private http: HttpClient) {
    // L'implémentation du chargement des données sera faite dans les stories suivantes
  }

  /**
   * Charge les données de nomenclature depuis assets/data/nomenclature.json
   * @returns Observable des données de nomenclature
   */
  loadNomenclature(): Observable<NomenclatureData> {
    // Implementation will be in future stories
    return this.nomenclature$.asObservable() as Observable<NomenclatureData>;
  }

  /**
   * Charge les données de vidéos depuis assets/data/videos.json
   * @returns Observable des données de vidéos
   */
  loadVideos(): Observable<VideosData> {
    // Implementation will be in future stories
    return this.videos$.asObservable() as Observable<VideosData>;
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
