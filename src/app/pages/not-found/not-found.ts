import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [CommonModule, RouterLink],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
})
export class NotFoundComponent implements OnInit, OnDestroy {
  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    // Ajouter une classe sur l'élément html pour utiliser l'image de fond spécifique
    this.renderer.addClass(document.documentElement, 'not-found-mode');
  }

  ngOnDestroy(): void {
    // Retirer la classe de l'élément html
    this.renderer.removeClass(document.documentElement, 'not-found-mode');
  }
}
