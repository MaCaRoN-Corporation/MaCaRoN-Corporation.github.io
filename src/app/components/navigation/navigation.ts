import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SettingsService } from '../../services/settings.service';
import { UserSettings, Appearance } from '../../models/settings.model';

@Component({
  selector: 'app-navigation',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navigation.html',
  styleUrl: './navigation.scss',
})
export class NavigationComponent implements OnInit, OnDestroy {
  isFullscreen = false;
  isMobile = false;
  currentAppearance: Appearance = 'clair';
  isMaintenancePage = false;
  private subscriptions = new Subscription();

  constructor(
    private settingsService: SettingsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkFullscreen();
    this.checkMobile();
    window.addEventListener('resize', () => this.checkMobile());
    
    // Vérifier si on est sur la page de maintenance
    this.checkMaintenancePage();
    
    // Écouter les changements de route pour détecter la page de maintenance
    this.subscriptions.add(
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        this.checkMaintenancePage();
      })
    );
    
    // S'abonner aux réglages pour connaître l'apparence actuelle
    this.subscriptions.add(
      this.settingsService.getSettings().subscribe((settings: UserSettings) => {
        this.currentAppearance = settings.appearance;
      })
    );
  }
  
  private checkMaintenancePage(): void {
    this.isMaintenancePage = this.router.url === '/maintenance';
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  @HostListener('document:fullscreenchange', [])
  @HostListener('document:webkitfullscreenchange', [])
  @HostListener('document:mozfullscreenchange', [])
  @HostListener('document:MSFullscreenChange', [])
  onFullscreenChange(): void {
    this.checkFullscreen();
  }

  toggleFullscreen(): void {
    if (!document.fullscreenElement && 
        !(document as any).webkitFullscreenElement && 
        !(document as any).mozFullScreenElement && 
        !(document as any).msFullscreenElement) {
      // Entrer en plein écran
      const docEl = document.documentElement;
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen();
      } else if ((docEl as any).webkitRequestFullscreen) {
        (docEl as any).webkitRequestFullscreen();
      } else if ((docEl as any).mozRequestFullScreen) {
        (docEl as any).mozRequestFullScreen();
      } else if ((docEl as any).msRequestFullscreen) {
        (docEl as any).msRequestFullscreen();
      }
    } else {
      // Sortir du plein écran
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  }

  private checkFullscreen(): void {
    this.isFullscreen = !!(
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement
    );
  }

  private checkMobile(): void {
    this.isMobile = window.innerWidth < 768;
  }

  toggleAppearance(): void {
    const newAppearance: Appearance = this.currentAppearance === 'clair' ? 'sombre' : 'clair';
    this.settingsService.applyAppearance(newAppearance);
  }
}
