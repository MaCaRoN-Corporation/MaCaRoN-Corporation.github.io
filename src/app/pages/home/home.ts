import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface PassageMode {
  id: string;
  name: string;
  description: string;
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  isMobile = false;
  currentModeIndex = 0;
  
  passageModes: PassageMode[] = [
    {
      id: 'classique',
      name: 'Classique',
      description: 'Technique selon l\'ordre traditionnel de passage'
    },
    {
      id: 'progression',
      name: 'Progression',
      description: 'Niveau de technique croissant'
    },
    {
      id: 'aleatoire',
      name: 'Aléatoire',
      description: 'Techniques sélectionnées au hasard'
    },
    {
      id: 'revision',
      name: 'Révision',
      description: 'Techniques sélectionnées par l\'utilisateur'
    }
  ];

  get currentMode(): PassageMode {
    return this.passageModes[this.currentModeIndex];
  }

  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {
    // Détecter si on est sur mobile
    this.checkMobile();
    window.addEventListener('resize', () => this.checkMobile());
  }

  checkMobile(): void {
    this.isMobile = window.innerWidth < 768;
  }

  previousMode(): void {
    this.currentModeIndex = (this.currentModeIndex - 1 + this.passageModes.length) % this.passageModes.length;
  }

  nextMode(): void {
    this.currentModeIndex = (this.currentModeIndex + 1) % this.passageModes.length;
  }

  startPassage(): void {
    // Rediriger vers la page de passage avec le mode sélectionné
    // La configuration sera gérée par le service dans les stories suivantes
    this.router.navigate(['/passage'], { queryParams: { mode: this.currentMode.id } });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
