import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, AfterViewChecked, HostListener, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { PassageService } from '../../services/passage.service';
import { PassageState } from '../../models/passage.model';
import { Technique } from '../../models/technique.model';
import { Position } from '../../models/position.model';

/**
 * Composant pour afficher et gérer l'exécution d'un passage de grade
 */
@Component({
  selector: 'app-passage',
  imports: [CommonModule],
  templateUrl: './passage.html',
  styleUrl: './passage.scss',
})
export class PassageComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {
  private subscriptions = new Subscription();
  private previousHistoryLength = 0;

  @ViewChild('historyElement') historyElement?: ElementRef<HTMLElement>;
  
  // État du passage
  elapsedTime: number = 0;
  isPaused: boolean = false;
  currentState: PassageState | null = null;
  
  // État pour l'indicateur de scroll
  isScrollAtBottom = false;
  hasScroll = false;

  // Données mockées pour le rendu complet
  countdown: number = 3; // Compte à rebours (secondes restantes)
  currentTechnique: Technique = {
    attack: 'Katate Dori Men Uchi', // 19 caractères (la plus longue)
    technique: 'Sokumen Irimi Nage', // 18 caractères (la plus longue)
    position: 'Tashiwaza' as Position, // 10 caractères (combinaison valide la plus longue)
    order: 1,
    videoUrl: null
  };
  currentProgress: number = 3; // Technique actuelle
  totalTechniques: number = 15; // Total de techniques
  progressPercentage: number = 20; // Pourcentage de progression (0-100)
  
  // Historique mocké
  history: Technique[] = [
    {
      attack: 'Shomen Uchi',
      technique: 'Ikkyo',
      position: 'Suwariwaza' as Position,
      order: 1,
      videoUrl: null
    },
    {
      attack: 'Yokomen Uchi',
      technique: 'Nikyo',
      position: 'Suwariwaza' as Position,
      order: 2,
      videoUrl: null
    },
    {
      attack: 'Katate Dori',
      technique: 'Sankyo',
      position: 'Suwariwaza' as Position,
      order: 3,
      videoUrl: null
    },
    {
      attack: 'Shomen Uchi',
      technique: 'Yonkyo',
      position: 'Hanmi Handachi' as Position,
      order: 4,
      videoUrl: null
    },
    {
      attack: 'Katate Dori',
      technique: 'Gokyo',
      position: 'Tachiwaza' as Position,
      order: 5,
      videoUrl: null
    },
    {
      attack: 'Ryote Dori',
      technique: 'Kokyu Nage',
      position: 'Tachiwaza' as Position,
      order: 6,
      videoUrl: null
    }
  ];

  constructor(
    private passageService: PassageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Souscrire à l'état du passage
    this.subscriptions.add(
      this.passageService.getPassageState().subscribe((state: PassageState) => {
        this.currentState = state;
        this.elapsedTime = state.elapsedTime;
        this.isPaused = state.isPaused;
      })
    );
  }

  ngAfterViewInit(): void {
    // Vérifier le scroll après l'initialisation de la vue
    setTimeout(() => {
      this.checkScroll();
      this.previousHistoryLength = this.history.length;
    }, 100);
  }

  ngAfterViewChecked(): void {
    // Vérifier le scroll si la liste historique a changé
    if (this.history.length !== this.previousHistoryLength) {
      setTimeout(() => {
        this.checkScroll();
        this.previousHistoryLength = this.history.length;
      }, 0);
    }
  }

  ngOnDestroy(): void {
    // Nettoyer les subscriptions
    this.subscriptions.unsubscribe();
  }

  /**
   * Vérifie si un scroll est nécessaire dans l'historique
   */
  checkScroll(): void {
    if (!this.historyElement?.nativeElement) {
      this.hasScroll = false;
      return;
    }

    const element = this.historyElement.nativeElement;
    this.hasScroll = element.scrollHeight > element.clientHeight;
  }

  /**
   * Gère l'événement de scroll dans l'historique
   */
  onHistoryScroll(): void {
    if (!this.historyElement?.nativeElement) {
      return;
    }

    const element = this.historyElement.nativeElement;
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;
    
    // Vérifier si un scroll est nécessaire
    const needsScroll = scrollHeight > clientHeight;
    
    // Vérifier si on est près du bas (tolérance de 5px)
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;
    
    this.hasScroll = needsScroll;
    this.isScrollAtBottom = isAtBottom;
    
    // Forcer la détection de changement pour mettre à jour la vue
    this.cdr.detectChanges();
  }

  @HostListener('window:resize')
  onResize(): void {
    // Recalculer le scroll lors du redimensionnement
    setTimeout(() => {
      this.checkScroll();
      if (!this.hasScroll) {
        this.isScrollAtBottom = false;
      }
    }, 100);
  }

  /**
   * Formate le temps en secondes au format MM:SS
   * @param seconds Le nombre de secondes
   * @returns Le temps formaté (ex: "05:23")
   */
  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Retourne le nom de position formaté
   */
  getPositionLabel(position: Position): string {
    return position;
  }

  /**
   * Toggle pause/play
   */
  togglePause(): void {
    if (this.isPaused) {
      this.passageService.resumePassage();
    } else {
      this.passageService.pausePassage();
    }
  }

  /**
   * Recommence le passage
   */
  restartPassage(): void {
    // TODO: Implémenter la logique de redémarrage dans PassageService
    // Pour l'instant, juste une méthode placeholder
    console.log('Restart passage');
  }
}
