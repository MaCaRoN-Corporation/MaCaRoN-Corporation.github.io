import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Technique } from '../models/technique.model';
import { VoiceId } from '../models/settings.model';

/**
 * Service pour gérer la lecture audio
 * Responsabilité: Gestion de la lecture audio (audios locaux et option Elevenlabs),
 * contrôle de la lecture, pause, répétition
 */
@Injectable({
  providedIn: 'root'
})
export class AudioService {
  constructor() {
    // Initialisation du service
  }

  /**
   * Joue l'annonce audio d'une technique
   * @param technique La technique à annoncer
   * @param voiceId L'ID complet de la voix à utiliser (format: '{language}_{id}', ex: 'French_Male1', 'Japanese_Female2')
   * @returns Promise qui se résout quand l'audio est terminé
   */
  playTechnique(technique: Technique, voiceId: VoiceId): Promise<void> {
    // Implementation will be in future stories
    return Promise.resolve();
  }

  /**
   * Met en pause l'audio en cours
   */
  pauseAudio(): void {
    // Implementation will be in future stories
  }

  /**
   * Reprend la lecture de l'audio en pause
   */
  resumeAudio(): void {
    // Implementation will be in future stories
  }

  /**
   * Répète la dernière technique annoncée
   */
  repeatLastTechnique(): void {
    // Implementation will be in future stories
  }

  /**
   * Configure l'utilisation de l'API Elevenlabs pour la synthèse vocale
   * @param apiKey La clé API Elevenlabs
   */
  useElevenlabs(apiKey: string): void {
    // Implementation will be in future stories
  }
}
