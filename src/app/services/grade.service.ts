import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { catchError, tap, shareReplay } from 'rxjs/operators';
import { NomenclatureData } from '../models/nomenclature.model';
import { VideosData } from '../models/videos.model';
import { Technique } from '../models/technique.model';
import { PassageFilters } from '../models/passage-filters.model';
import { Position } from '../models/position.model';

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
   * Retourne la liste de tous les grades disponibles dans la nomenclature
   * @returns Liste des grades triés (6e Kyū → 5e Dan)
   */
  getGrades(): string[] {
    const nomenclature = this.nomenclatureCache;
    if (!nomenclature) {
      return [];
    }

    const grades = Object.keys(nomenclature);
    return this.sortGrades(grades);
  }

  /**
   * Valide qu'un grade est valide selon la nomenclature
   * @param grade Le grade à valider
   * @returns true si le grade est valide, false sinon
   */
  validateGrade(grade: string): boolean {
    const nomenclature = this.nomenclatureCache;
    if (!nomenclature) {
      return false;
    }

    return grade in nomenclature;
  }

  /**
   * Retourne les positions disponibles pour un grade donné
   * @param grade Le grade sélectionné (ex: "6e Kyū", "1er Dan")
   * @returns Liste des positions disponibles (exclut "Randori")
   */
  getPositionsForGrade(grade: string): Position[] {
    const nomenclature = this.nomenclatureCache;
    if (!nomenclature || !this.validateGrade(grade)) {
      return [];
    }

    const gradeData = nomenclature[grade];
    if (!gradeData) {
      return [];
    }

    // Normaliser les noms de positions du JSON vers le type Position
    // Le JSON utilise "Suwari Waza", "Hanmi Handachi Waza", "Tachi Waza"
    // Le type Position utilise "Suwariwaza", "Hanmi Handachi", "Tachiwaza"
    const positionMap: { [key: string]: Position } = {
      'Suwari Waza': 'Suwariwaza',
      'Suwariwaza': 'Suwariwaza',
      'Hanmi Handachi Waza': 'Hanmi Handachi',
      'Hanmi Handachi': 'Hanmi Handachi',
      'Tachi Waza': 'Tachiwaza',
      'Tachiwaza': 'Tachiwaza',
      'Armes': 'Armes'
    };

    const positions: Position[] = [];
    for (const pos of Object.keys(gradeData)) {
      const normalizedPos = positionMap[pos];
      if (normalizedPos) {
        positions.push(normalizedPos);
      }
    }

    return positions;
  }

  /**
   * Convertit un Position (type) en nom de clé JSON
   * @param position La position au format Position
   * @returns Le nom de clé dans le JSON
   * @private
   */
  private positionToJsonKey(position: Position): string {
    const positionMap: { [key in Position]: string } = {
      'Suwariwaza': 'Suwari Waza',
      'Hanmi Handachi': 'Hanmi Handachi Waza',
      'Tachiwaza': 'Tachi Waza',
      'Armes': 'Armes'
    };
    return positionMap[position] || position;
  }

  /**
   * Retourne les attaques disponibles pour un grade et une position donnés
   * @param grade Le grade sélectionné
   * @param position La position sélectionnée
   * @returns Liste des attaques disponibles
   */
  getAttacksForGradeAndPosition(grade: string, position: Position): string[] {
    const nomenclature = this.nomenclatureCache;
    if (!nomenclature || !this.validateGrade(grade)) {
      return [];
    }

    const gradeData = nomenclature[grade];
    if (!gradeData) {
      return [];
    }

    // Convertir le Position en nom de clé JSON
    const jsonPositionKey = this.positionToJsonKey(position);
    if (!(jsonPositionKey in gradeData)) {
      return [];
    }

    const positionData = gradeData[jsonPositionKey];
    if (!positionData) {
      return [];
    }

    // Pour les positions normales (Suwariwaza, Hanmi Handachi, Tachiwaza)
    // positionData est un objet { attack: techniques[] }
    if (position !== 'Armes') {
      if (Array.isArray(positionData)) {
        // Cas spécial où positionData serait directement un tableau (ne devrait pas arriver)
        return [];
      }
      return Object.keys(positionData);
    }

    // Pour "Armes", la structure est plus complexe
    // Peut être : { "Tanto Dori": { "Chudan Tsuki": [...] }, "Jo Dori": [...], "Ken Taï Ken": [] }
    const attacks: string[] = [];
    for (const key of Object.keys(positionData)) {
      const weaponData = positionData[key];
      
      if (Array.isArray(weaponData)) {
        // Arme avec techniques directes (ex: "Jo Dori": [...])
        // L'attaque est le nom de l'arme
        attacks.push(key);
      } else if (typeof weaponData === 'object' && weaponData !== null) {
        // Arme avec attaques (ex: "Tanto Dori": { "Chudan Tsuki": [...] })
        // L'attaque est le nom de l'arme + attaque
        const weaponAttacks = Object.keys(weaponData);
        for (const attack of weaponAttacks) {
          attacks.push(`${key}-${attack}`);
        }
      }
      // Ignorer les armes avec tableau vide (Jiyu Waza comme "Ken Taï Ken": [])
    }

    return attacks;
  }

  /**
   * Retourne les techniques disponibles pour un grade, position et attaque donnés
   * @param grade Le grade sélectionné
   * @param position La position sélectionnée
   * @param attack L'attaque sélectionnée
   * @returns Liste des techniques disponibles
   */
  getTechniquesForGradePositionAttack(grade: string, position: Position, attack: string): string[] {
    const nomenclature = this.nomenclatureCache;
    if (!nomenclature || !this.validateGrade(grade)) {
      return [];
    }

    const gradeData = nomenclature[grade];
    if (!gradeData) {
      return [];
    }

    // Convertir le Position en nom de clé JSON
    const jsonPositionKey = this.positionToJsonKey(position);
    if (!(jsonPositionKey in gradeData)) {
      return [];
    }

    const positionData = gradeData[jsonPositionKey];
    if (!positionData) {
      return [];
    }

    // Pour les positions normales
    if (position !== 'Armes') {
      if (Array.isArray(positionData)) {
        return [];
      }
      
      const attackData = positionData[attack];
      if (Array.isArray(attackData)) {
        return [...attackData]; // Copie pour éviter mutation
      }
      return [];
    }

    // Pour "Armes", gérer la structure complexe
    // L'attaque peut être "Jo Dori" (directe) ou "Tanto Dori-Chudan Tsuki" (arme-attaque)
    if (attack.includes('-')) {
      // Format: "Tanto Dori-Chudan Tsuki"
      const [weapon, weaponAttack] = attack.split('-', 2);
      const weaponData = positionData[weapon];
      
      if (typeof weaponData === 'object' && weaponData !== null && !Array.isArray(weaponData)) {
        const techniques = weaponData[weaponAttack];
        if (Array.isArray(techniques)) {
          return [...techniques];
        }
      }
      return [];
    } else {
      // Format: "Jo Dori" (arme avec techniques directes)
      const weaponData = positionData[attack];
      if (Array.isArray(weaponData)) {
        return [...weaponData];
      }
      return [];
    }
  }

  /**
   * Retourne les URLs vidéo pour une attaque-technique donnée
   * @param attack L'attaque (ex: "Shomen Uchi" ou "Tanto Dori-Chudan Tsuki" pour les armes)
   * @param technique La technique (ex: "Ikkyo")
   * @returns Liste des URLs vidéo ou null si aucune vidéo disponible
   */
  getVideoUrls(attack: string, technique: string): string[] | null {
    const videos = this.videosCache;
    if (!videos) {
      return null;
    }

    // Pour les armes, l'attaque peut être au format "Tanto Dori-Chudan Tsuki"
    // Dans videos.json, la clé est "Chudan Tsuki-Ikkyo" (pas "Tanto Dori-Chudan Tsuki-Ikkyo")
    // Il faut extraire la partie attaque réelle
    let actualAttack = attack;
    if (attack.includes('-')) {
      // Format: "Tanto Dori-Chudan Tsuki" -> utiliser "Chudan Tsuki" pour la clé vidéo
      const parts = attack.split('-');
      actualAttack = parts[parts.length - 1]; // Prendre la dernière partie
    }

    // Format de la clé: "Attaque-Technique" (ex: "Shomen Uchi-Ikkyo" ou "Chudan Tsuki-Ikkyo")
    const key = `${actualAttack}-${technique}`;
    const urls = videos[key];

    if (Array.isArray(urls) && urls.length > 0) {
      return [...urls]; // Copie pour éviter mutation
    }

    return null;
  }

  /**
   * Retourne les positions d'armes disponibles pour un grade donné
   * Règles: Armes disponibles à partir du 1er Dan
   * @param grade Le grade sélectionné
   * @returns Liste des positions/armes disponibles (ex: ["Tanto Dori", "Jo Dori", "Jo Nage"])
   */
  getWeaponPositions(grade: string): string[] {
    const nomenclature = this.nomenclatureCache;
    if (!nomenclature || !this.validateGrade(grade)) {
      return [];
    }

    const gradeData = nomenclature[grade];
    if (!gradeData || !('Armes' in gradeData)) {
      return [];
    }

    const weaponsData = gradeData['Armes'];
    if (!weaponsData || typeof weaponsData !== 'object') {
      return [];
    }

    const weapons: string[] = [];
    for (const weaponKey of Object.keys(weaponsData)) {
      const weaponData = weaponsData[weaponKey];
      
      // Inclure toutes les armes, même celles avec tableau vide (Jiyu Waza)
      weapons.push(weaponKey);
    }

    return weapons;
  }

  /**
   * Vérifie si une technique existe pour un grade/position/attaque donné
   * @param grade Le grade
   * @param position La position
   * @param attack L'attaque
   * @param technique La technique à vérifier
   * @returns true si la technique existe, false sinon
   */
  hasTechnique(grade: string, position: Position, attack: string, technique: string): boolean {
    const techniques = this.getTechniquesForGradePositionAttack(grade, position, attack);
    return techniques.includes(technique);
  }

  /**
   * Récupère les techniques disponibles pour un grade donné selon les filtres
   * @param grade Le grade sélectionné (ex: "6e Kyū", "1er Dan")
   * @param filters Les filtres à appliquer (positions, attaques, techniques)
   * @returns Liste des techniques correspondantes
   */
  getTechniquesForGrade(grade: string, filters: PassageFilters): Technique[] {
    if (!this.validateGrade(grade)) {
      return [];
    }

    const techniques: Technique[] = [];
    let order = 1;

    // Obtenir les positions à traiter
    let positions = this.getPositionsForGrade(grade);
    
    // Appliquer le filtre de positions
    if (filters.positions.length > 0) {
      positions = positions.filter(pos => filters.positions.includes(pos));
    }

    // Inclure les armes si demandé
    if (filters.includeWeapons && positions.includes('Armes' as Position)) {
      const weapons = this.getWeaponPositions(grade);
      // Les armes sont déjà incluses dans positions via getPositionsForGrade
      // On les traitera normalement
    } else if (filters.includeWeapons && !positions.includes('Armes' as Position)) {
      // Ajouter les armes si elles sont disponibles pour ce grade
      const weapons = this.getWeaponPositions(grade);
      if (weapons.length > 0) {
        positions.push('Armes' as Position);
      }
    }

    // Parcourir chaque position
    for (const position of positions) {
      if (position === 'Armes' && !filters.includeWeapons) {
        continue;
      }

      const attacks = this.getAttacksForGradeAndPosition(grade, position);
      
      // Appliquer le filtre d'attaques
      let filteredAttacks = attacks;
      if (filters.attacks.length > 0) {
        filteredAttacks = attacks.filter(attack => {
          // Pour les armes, l'attaque peut être au format "Tanto Dori-Chudan Tsuki"
          // Vérifier si l'attaque correspond à un filtre (début de chaîne)
          return filters.attacks.some(filterAttack => attack.includes(filterAttack));
        });
      }

      // Parcourir chaque attaque
      for (const attack of filteredAttacks) {
        const attackTechniques = this.getTechniquesForGradePositionAttack(grade, position, attack);
        
        // Appliquer le filtre de techniques
        let filteredTechniques = attackTechniques;
        if (filters.techniques.length > 0) {
          filteredTechniques = attackTechniques.filter(tech => filters.techniques.includes(tech));
        }

        // Filtrer "Jiyu Waza" si nécessaire (optionnel, à définir selon besoins)
        // Pour l'instant, on l'inclut

        // Créer les objets Technique
        for (const technique of filteredTechniques) {
          const videoUrls = this.getVideoUrls(attack, technique);
          
          techniques.push({
            attack,
            technique,
            position,
            order: order++,
            videoUrl: videoUrls
          });
        }
      }
    }

    return techniques;
  }

  /**
   * Trie les grades dans l'ordre logique (6e Kyū → 5e Dan)
   * @param grades Liste des grades à trier
   * @returns Liste triée
   */
  private sortGrades(grades: string[]): string[] {
    const gradeOrder = [
      '6e Kyū', '5e Kyū', '4e Kyū', '3e Kyū', '2e Kyū', '1er Kyū',
      '1er Dan', '2e Dan', '3e Dan', '4e Dan', '5e Dan'
    ];

    return grades.sort((a, b) => {
      const indexA = gradeOrder.indexOf(a);
      const indexB = gradeOrder.indexOf(b);
      
      // Si le grade n'est pas dans la liste de référence, le mettre à la fin
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      
      return indexA - indexB;
    });
  }
}
