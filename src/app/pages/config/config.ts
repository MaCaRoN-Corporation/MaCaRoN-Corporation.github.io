import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { RouterLink, Router, NavigationStart } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-config',
  imports: [CommonModule, RouterLink],
  templateUrl: './config.html',
  styleUrl: './config.scss',
})
export class ConfigComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  isLeaving = false; // État pour l'animation de sortie

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Détecter quand on quitte la page (navigation vers une autre route)
    this.subscriptions.add(
      this.router.events
        .pipe(filter(event => event instanceof NavigationStart))
        .subscribe((event: any) => {
          // Si on navigue vers une autre page, déclencher l'animation de sortie
          if (event.url !== '/config') {
            this.isLeaving = true;
          }
        })
    );

    // Détecter le retour arrière du navigateur
    window.addEventListener('popstate', this.handlePopState);
  }

  @HostListener('window:popstate', ['$event'])
  private handlePopState = (event: PopStateEvent) => {
    // Lors du retour arrière, déclencher l'animation de sortie
    this.isLeaving = true;
  };

  // Gérer le clic sur le bouton retour
  onBackClick(event: Event): void {
    event.preventDefault();
    this.isLeaving = true;
    // Attendre la fin de l'animation avant de naviguer
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 300); // Durée de l'animation
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    window.removeEventListener('popstate', this.handlePopState);
  }
}
