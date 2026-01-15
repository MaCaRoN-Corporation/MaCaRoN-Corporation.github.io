import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Technique } from '../models/technique.model';
import { VoiceId, parseVoiceId } from '../models/settings.model';
import { Position } from '../models/position.model';

/**
 * Service pour gérer la lecture audio
 * Responsabilité: Gestion de la lecture audio (audios locaux uniquement),
 * contrôle de la lecture, pause, répétition
 */
@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private currentAudio: HTMLAudioElement | null = null;
  private audioQueue: HTMLAudioElement[] = [];
  private isPaused = false;
  private lastTechnique: Technique | null = null;
  private lastVoiceId: VoiceId | null = null;
  
  // Stockage de la dernière technique pour comparaison hiérarchique
  private lastPosition: string | null = null;
  private lastAttack: string | null = null;
  private lastTechniqueName: string | null = null;

  // Observables pour les événements audio
  private audioFinishedSubject = new Subject<{ technique: Technique; voiceId: VoiceId }>();
  private audioErrorSubject = new Subject<{ error: Error; technique: Technique; voiceId: VoiceId }>();

  /**
   * Observable qui émet quand un audio est terminé
   */
  get audioFinished$(): Observable<{ technique: Technique; voiceId: VoiceId }> {
    return this.audioFinishedSubject.asObservable();
  }

  /**
   * Observable qui émet quand une erreur audio se produit
   */
  get audioError$(): Observable<{ error: Error; technique: Technique; voiceId: VoiceId }> {
    return this.audioErrorSubject.asObservable();
  }

  constructor() {
    // Initialisation du service
  }

  /**
   * Convertit un Position (type) en nom de fichier audio
   * Les fichiers audio utilisent les noms complets avec "Waza" : "Suwari Waza", "Hanmi Handachi Waza", "Tachi Waza"
   * @param position La position au format Position
   * @returns Le nom pour le fichier audio
   * @private
   */
  private positionToAudioName(position: Position): string {
    const positionMap: { [key in Position]: string } = {
      'Suwariwaza': 'Suwari Waza',
      'Hanmi Handachi': 'Hanmi Handachi Waza',
      'Tachiwaza': 'Tachi Waza',
      'Armes': 'Armes'
    };
    return positionMap[position] || position;
  }

  /**
   * Extrait les informations audio pour les armes (Tanto Dori, Jo Dori, Jo Nage, Tachi Dori, etc.)
   * Pour les armes, la structure est différente : l'arme (ex: "Tanto Dori") est la position, pas "Armes"
   * IMPORTANT : Si l'arme ne change pas entre deux techniques, l'audio de l'arme ne sera pas répété
   * (seulement l'attaque et/ou la technique seront jouées selon les règles hiérarchiques)
   * @param technique La technique à analyser
   * @returns Un objet avec position (arme), attack et technique pour l'audio, ou null si ce n'est pas une arme
   * @private
   */
  private extractWeaponAudioInfo(technique: Technique): { position: string; attack: string; technique: string } | null {
    // Vérifier si c'est une technique d'armes
    if (technique.position !== 'Armes') {
      return null;
    }

    // Pour les armes, l'attaque peut être au format "Tanto Dori-Chudan Tsuki" ou "Jo Dori"
    if (technique.attack.includes('-')) {
      // Format: "Tanto Dori-Chudan Tsuki"
      // Position = "Tanto Dori" (l'arme), Attack = "Chudan Tsuki", Technique = technique.technique
      // Si l'arme ne change pas, seule l'attaque et/ou la technique seront jouées
      const [weapon, weaponAttack] = technique.attack.split('-', 2);
      return {
        position: weapon.trim(), // "Tanto Dori", "Tachi Dori", etc. (sera comparé avec lastPosition)
        attack: weaponAttack.trim(), // "Chudan Tsuki", "Shomen Uchi", etc.
        technique: technique.technique
      };
    } else {
      // Format: "Jo Dori", "Jo Nage", etc. (arme directe, pas d'attaque sous-jacente)
      // Position = "Jo Dori" (l'arme), Attack = "", Technique = technique.technique
      // Si l'arme ne change pas, seule la technique sera jouée
      return {
        position: technique.attack.trim(), // "Jo Dori", "Jo Nage", etc. (sera comparé avec lastPosition)
        attack: '', // Pas d'attaque intermédiaire
        technique: technique.technique
      };
    }
  }

  /**
   * Normalise un nom de technique/attaque/position pour correspondre au format des fichiers audio
   * Les fichiers audio sont tous en minuscules avec des underscores pour les espaces
   * Exemples : "Shomen Uchi" → "shomen_uchi", "Suwari Waza" → "suwari_waza", "Hanmi Handachi Waza" → "hanmi_handachi_waza"
   * "Jo Taï Jo" → "jo_tai_jo", "Ken Taï Ken" → "ken_tai_ken"
   * @param name Le nom à normaliser
   * @returns Le nom normalisé en minuscules avec underscores (snake_case)
   */
  private normalizeAudioFileName(name: string): string {
    if (!name || name.trim().length === 0) {
      throw new Error('Audio file name cannot be empty');
    }
    
    return name
      .toLowerCase() // Convertir en minuscules uniquement
      .normalize('NFD') // Décomposer les caractères accentués (é → e + ́)
      .replace(/[\u0300-\u036f]/g, '') // Supprimer les diacritiques (accents)
      .trim() // Supprimer les espaces en début/fin
      .replace(/\s+/g, '_') // Remplacer tous les espaces (y compris multiples) par des underscores
      .replace(/[^a-z0-9_]/g, ''); // Supprimer les caractères non alphanumériques restants (sauf underscore)
  }

  /**
   * Construit le chemin complet d'un fichier audio
   * Vérifie que le format de voix correspond bien aux dossiers disponibles
   * Les fichiers audio sont organisés : assets/audio/{language}/{voiceId}/{filename}.mp3
   * Exemple : assets/audio/French/Male1/shomen_uchi.mp3
   * @param fileName Le nom du fichier (sera normalisé automatiquement en minuscules avec underscores)
   * @param voiceId L'ID complet de la voix (format: '{language}_{id}', ex: 'French_Male1', 'Japanese_Female2')
   * @returns Le chemin complet vers le fichier audio
   */
  private buildAudioPath(fileName: string, voiceId: VoiceId): string {
    if (!fileName || fileName.trim().length === 0) {
      throw new Error('File name cannot be empty');
    }

    const parsed = parseVoiceId(voiceId);
    if (!parsed) {
      throw new Error(`Invalid voiceId format: ${voiceId}. Expected format: '{language}_{id}' (e.g., 'French_Male1')`);
    }

    // Vérifier que la langue est valide
    if (parsed.language !== 'French' && parsed.language !== 'Japanese') {
      throw new Error(`Invalid language in voiceId: ${parsed.language}. Expected 'French' or 'Japanese'`);
    }

    // Vérifier que l'ID de voix n'est pas vide
    if (!parsed.id || parsed.id.trim().length === 0) {
      throw new Error(`Invalid voice ID in voiceId: ${voiceId}. Voice ID cannot be empty`);
    }

    // Normaliser le nom de fichier (minuscules + underscores uniquement)
    const normalizedFileName = this.normalizeAudioFileName(fileName);
    
    // Construire le chemin : assets/audio/{language}/{voiceId}/{filename}.mp3
    // Exemple : assets/audio/French/Male1/shomen_uchi.mp3
    const audioPath = `assets/audio/${parsed.language}/${parsed.id}/${normalizedFileName}.mp3`;
    
    return audioPath;
  }

  /**
   * Crée et configure un élément audio HTML
   * @param path Le chemin vers le fichier audio
   * @returns Une Promise qui se résout quand l'audio est chargé ou rejetée en cas d'erreur
   */
  private createAudioElement(path: string): Promise<HTMLAudioElement> {
    return new Promise((resolve, reject) => {
      const audio = new Audio(path);

      audio.addEventListener('loadeddata', () => {
        resolve(audio);
      });

      audio.addEventListener('error', (e) => {
        const error = new Error(`Failed to load audio: ${path}`);
        reject(error);
      });

      // Déclencher le chargement
      audio.load();
    });
  }

  /**
   * Joue un fichier audio et retourne une Promise qui se résout quand l'audio est terminé
   * @param path Le chemin vers le fichier audio
   * @returns Promise qui se résout quand l'audio est terminé
   */
  private playAudioFile(path: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.createAudioElement(path)
        .then((audio) => {
          // Ajouter l'audio à la file d'attente
          this.audioQueue.push(audio);
          this.currentAudio = audio;

          // Gérer la fin de l'audio
          const onEnded = () => {
            audio.removeEventListener('ended', onEnded);
            audio.removeEventListener('error', onError);
            
            // Retirer de la file d'attente
            const index = this.audioQueue.indexOf(audio);
            if (index > -1) {
              this.audioQueue.splice(index, 1);
            }

            // Si c'était l'audio actuel, le réinitialiser
            if (this.currentAudio === audio) {
              this.currentAudio = null;
            }

            resolve();
          };

          // Gérer les erreurs de lecture
          const onError = (e: Event) => {
            audio.removeEventListener('ended', onEnded);
            audio.removeEventListener('error', onError);
            
            const index = this.audioQueue.indexOf(audio);
            if (index > -1) {
              this.audioQueue.splice(index, 1);
            }

            if (this.currentAudio === audio) {
              this.currentAudio = null;
            }

            const error = new Error(`Failed to play audio: ${path}`);
            reject(error);
          };

          audio.addEventListener('ended', onEnded);
          audio.addEventListener('error', onError);

          // Jouer l'audio si pas en pause
          if (!this.isPaused) {
            audio.play().catch((playError) => {
              audio.removeEventListener('ended', onEnded);
              audio.removeEventListener('error', onError);
              reject(new Error(`Failed to play audio: ${playError.message}`));
            });
          } else {
            // Si en pause, résoudre immédiatement (l'audio sera joué au resume)
            resolve();
          }
        })
        .catch(reject);
    });
  }

  /**
   * Détermine quels éléments audio doivent être joués selon la logique hiérarchique
   * Ordre strict : Position → Attaque → Technique
   * Seuls les éléments qui ont changé (ou dont le parent a changé) sont annoncés
   * @param technique La technique actuelle
   * @returns Un objet indiquant quels éléments jouer
   */
  private determineAudioToPlay(technique: Technique): {
    playPosition: boolean;
    playAttack: boolean;
    playTechnique: boolean;
    audioPosition: string;
    audioAttack: string;
    audioTechnique: string;
  } {
    // Vérifier si c'est un randori (technique spéciale)
    // Le randori a attack: 'Randori' et technique: 'Randori'
    const isRandori = technique.attack === 'Randori' && technique.technique === 'Randori';
    
    // Pour le randori : toujours jouer l'audio une seule fois (ne pas répéter)
    if (isRandori) {
      // Si le randori a déjà été joué (lastTechniqueName === 'Randori'), ne pas le rejouer
      if (this.lastTechniqueName === 'Randori') {
        return {
          playPosition: false,
          playAttack: false,
          playTechnique: false,
          audioPosition: 'Randori',
          audioAttack: 'Randori',
          audioTechnique: 'Randori'
        };
      }
      // Sinon, jouer le randori une seule fois (juste l'audio "Randori", pas de position ni d'attaque)
      return {
        playPosition: false, // Pas de position pour le randori
        playAttack: false, // Pas d'attaque pour le randori
        playTechnique: true, // Jouer seulement "Randori" une seule fois
        audioPosition: 'Randori',
        audioAttack: 'Randori',
        audioTechnique: 'Randori'
      };
    }
    
    // Extraire les informations audio (gérer les armes différemment)
    // Note: Le randori n'est pas traité comme une arme, il est détecté avant
    const weaponInfo = this.extractWeaponAudioInfo(technique);
    
    let audioPosition: string;
    let audioAttack: string;
    let audioTechnique: string;

    if (weaponInfo) {
      // Pour les armes, utiliser les informations extraites
      audioPosition = weaponInfo.position;
      audioAttack = weaponInfo.attack;
      audioTechnique = weaponInfo.technique;
    } else {
      // Pour les positions normales, convertir le Position en nom de fichier audio
      audioPosition = this.positionToAudioName(technique.position);
      audioAttack = technique.attack;
      audioTechnique = technique.technique;
    }

    // Si c'est la première technique, tout jouer
    if (this.lastPosition === null) {
      return {
        playPosition: true,
        playAttack: audioAttack.length > 0, // Ne jouer l'attaque que si elle existe
        playTechnique: true,
        audioPosition,
        audioAttack,
        audioTechnique
      };
    }

    // Vérifier ce qui a changé
    // Pour les armes, on compare l'arme (position) pour déterminer si elle a changé
    // Si l'arme ne change pas, on ne répète pas l'audio de l'arme
    const positionChanged = this.lastPosition !== audioPosition;
    const attackChanged = this.lastAttack !== audioAttack;
    const techniqueChanged = this.lastTechniqueName !== audioTechnique;

    // Logique hiérarchique STRICTE :
    // - Si position/arme change → TOUJOURS jouer position/arme, attaque (si existe), technique
    //   (même si l'attaque et la technique sont identiques à la précédente)
    // - Si position/arme identique mais attaque change → jouer attaque (si existe), technique
    // - Si position/arme et attaque identiques mais technique change → jouer technique seulement
    // Pour les armes : si l'arme ne change pas, on ne répète pas l'audio de l'arme
    return {
      playPosition: positionChanged, // Pour les armes, ne joue que si l'arme change
      // Si la position change, TOUJOURS jouer l'attaque (même si identique)
      // Sinon, jouer l'attaque seulement si elle a changé
      playAttack: (positionChanged || attackChanged) && audioAttack.length > 0, // Ne jouer que si l'attaque existe
      // Si la position change, TOUJOURS jouer la technique (même si identique)
      // Sinon, jouer la technique seulement si l'attaque ou la technique a changé
      playTechnique: positionChanged || attackChanged || techniqueChanged,
      audioPosition,
      audioAttack,
      audioTechnique
    };
  }

  /**
   * Joue l'annonce audio d'une technique selon la logique hiérarchique
   * Ordre strict : Position → Attaque → Technique
   * Seuls les éléments qui ont changé par rapport à la technique précédente sont annoncés
   * Arrête automatiquement l'audio précédent avant de jouer le nouveau
   * @param technique La technique à annoncer
   * @param voiceId L'ID complet de la voix à utiliser (format: '{language}_{id}', ex: 'French_Male1', 'Japanese_Female2')
   * @returns Promise qui se résout quand tous les audios nécessaires sont terminés
   */
  async playTechnique(technique: Technique, voiceId: VoiceId): Promise<void> {
    try {
      // Arrêter l'audio précédent avant de jouer le nouveau
      this.stopAudio();

      // Stocker pour la répétition
      this.lastTechnique = technique;
      this.lastVoiceId = voiceId;

      // Déterminer quels audios jouer selon la logique hiérarchique
      const audioToPlay = this.determineAudioToPlay(technique);

      // Jouer les audios dans l'ordre strict : Position → Attaque → Technique
      // Seulement ceux qui doivent être joués

      if (audioToPlay.playPosition) {
        try {
          const positionPath = this.buildAudioPath(audioToPlay.audioPosition, voiceId);
          await this.playAudioFile(positionPath);
        } catch (error) {
          console.warn(`[AudioService] Failed to play position audio: ${audioToPlay.audioPosition}`, error);
          this.audioErrorSubject.next({
            error: error as Error,
            technique,
            voiceId
          });
          // Continuer même si la position échoue
        }
      }

      if (audioToPlay.playAttack) {
        try {
          const attackPath = this.buildAudioPath(audioToPlay.audioAttack, voiceId);
          await this.playAudioFile(attackPath);
        } catch (error) {
          console.warn(`[AudioService] Failed to play attack audio: ${audioToPlay.audioAttack}`, error);
          this.audioErrorSubject.next({
            error: error as Error,
            technique,
            voiceId
          });
          // Continuer même si l'attaque échoue
        }
      }

      if (audioToPlay.playTechnique) {
        try {
          const techniquePath = this.buildAudioPath(audioToPlay.audioTechnique, voiceId);
          await this.playAudioFile(techniquePath);
        } catch (error) {
          console.error(`[AudioService] Failed to play technique audio: ${audioToPlay.audioTechnique}`, error);
          this.audioErrorSubject.next({
            error: error as Error,
            technique,
            voiceId
          });
          throw error; // Re-throw pour que l'appelant sache qu'il y a eu une erreur
        }
      }

      // Mettre à jour les valeurs stockées après lecture réussie
      // Utiliser les valeurs audio (qui peuvent être différentes pour les armes)
      this.lastPosition = audioToPlay.audioPosition;
      this.lastAttack = audioToPlay.audioAttack;
      this.lastTechniqueName = audioToPlay.audioTechnique;

      // Émettre l'événement de fin
      this.audioFinishedSubject.next({ technique, voiceId });
    } catch (error) {
      console.error('[AudioService] Error playing technique:', error);
      this.audioErrorSubject.next({
        error: error as Error,
        technique,
        voiceId
      });
      throw error;
    }
  }

  /**
   * Met en pause l'audio en cours
   */
  pauseAudio(): void {
    this.isPaused = true;
    if (this.currentAudio) {
      this.currentAudio.pause();
    }
    // Mettre en pause tous les audios dans la file d'attente
    this.audioQueue.forEach((audio) => {
      if (!audio.paused) {
        audio.pause();
      }
    });
  }

  /**
   * Reprend la lecture de l'audio en pause
   */
  resumeAudio(): void {
    this.isPaused = false;
    if (this.currentAudio && this.currentAudio.paused) {
      this.currentAudio.play().catch((error) => {
        console.error('[AudioService] Failed to resume audio:', error);
      });
    }
    // Reprendre tous les audios en pause dans la file d'attente
    this.audioQueue.forEach((audio) => {
      if (audio.paused) {
        audio.play().catch((error) => {
          console.error('[AudioService] Failed to resume queued audio:', error);
        });
      }
    });
  }

  /**
   * Arrête complètement tous les audios en cours
   */
  stopAudio(): void {
    this.isPaused = false;
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    // Arrêter et nettoyer tous les audios dans la file d'attente
    this.audioQueue.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
    this.audioQueue = [];
  }

  /**
   * Réinitialise l'état de comparaison (utile quand on démarre un nouveau passage)
   * Cela force la lecture complète de la première technique du nouveau passage
   */
  resetComparisonState(): void {
    this.lastPosition = null;
    this.lastAttack = null;
    this.lastTechniqueName = null;
  }

  /**
   * Répète la dernière technique annoncée
   * Pour la répétition, on joue toujours tout (position + attaque + technique)
   * car c'est une action explicite de l'utilisateur
   */
  repeatLastTechnique(): void {
    if (this.lastTechnique && this.lastVoiceId) {
      // Arrêter l'audio actuel avant de répéter
      this.stopAudio();
      
      // Pour la répétition, on joue toujours tout (position + attaque + technique)
      // Sauvegarder temporairement les valeurs pour restaurer après
      const savedPosition = this.lastPosition;
      const savedAttack = this.lastAttack;
      const savedTechniqueName = this.lastTechniqueName;
      
      // Réinitialiser pour forcer la lecture complète
      this.lastPosition = null;
      this.lastAttack = null;
      this.lastTechniqueName = null;
      
      // Jouer la dernière technique (tout sera joué car lastPosition est null)
      this.playTechnique(this.lastTechnique, this.lastVoiceId)
        .then(() => {
          // Restaurer les valeurs après la répétition
          this.lastPosition = savedPosition;
          this.lastAttack = savedAttack;
          this.lastTechniqueName = savedTechniqueName;
        })
        .catch((error) => {
          console.error('[AudioService] Failed to repeat technique:', error);
          // Restaurer les valeurs même en cas d'erreur
          this.lastPosition = savedPosition;
          this.lastAttack = savedAttack;
          this.lastTechniqueName = savedTechniqueName;
        });
    } else {
      console.warn('[AudioService] No technique to repeat');
    }
  }
}
