import { Injectable } from '@angular/core';
import { Passage } from '../models/passage.model';

/**
 * Service pour exporter les passages
 * Responsabilité: Génération du fichier .txt avec les techniques et liens vidéo
 */
@Injectable({
  providedIn: 'root'
})
export class ExportService {
  constructor() {
    // Initialisation du service
  }

  /**
   * Exporte un passage dans un fichier .txt téléchargeable
   * @param passage Le passage à exporter
   */
  exportPassage(passage: Passage): void {
    // Implementation will be in future stories
  }

  /**
   * Formate un passage en texte pour l'export
   * @param passage Le passage à formater
   * @returns Le texte formaté du passage
   */
  formatPassageText(passage: Passage): string {
    // Implementation will be in future stories
    return '';
  }
}
