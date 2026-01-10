import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsService } from '../../services/settings.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-maintenance',
  imports: [CommonModule],
  templateUrl: './maintenance.html',
  styleUrl: './maintenance.scss',
})
export class MaintenanceComponent implements OnInit, OnDestroy {
  private previousAppearance: 'clair' | 'sombre' | null = null;

  constructor(
    private settingsService: SettingsService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    // Ajouter une classe sur l'élément html pour utiliser l'image de fond spécifique
    this.renderer.addClass(document.documentElement, 'maintenance-mode');
    
    // Sauvegarder l'apparence actuelle et forcer l'apparence claire
    this.settingsService.getSettings()
      .pipe(take(1))
      .subscribe(settings => {
        this.previousAppearance = settings.appearance;
        // Forcer l'apparence claire pour la page de maintenance
        if (settings.appearance !== 'clair') {
          this.settingsService.applyAppearance('clair');
        }
      });
  }

  ngOnDestroy(): void {
    // Retirer la classe de l'élément html
    this.renderer.removeClass(document.documentElement, 'maintenance-mode');
    
    // Restaurer l'apparence précédente si elle était différente de clair
    // Note: Sur une page de maintenance, l'utilisateur ne devrait normalement pas pouvoir naviguer
    // mais on restaure quand même pour la robustesse du code
    if (this.previousAppearance && this.previousAppearance !== 'clair') {
      this.settingsService.applyAppearance(this.previousAppearance);
    }
  }
}
