import { Component, OnInit, OnDestroy, HostListener, ChangeDetectorRef } from '@angular/core';
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
  
  // Notification d'installation PWA
  showInstallNotification = false;
  deferredPrompt: any = null;
  private readonly INSTALL_NOTIFICATION_DISMISSED_KEY = 'pwa-install-notification-dismissed';

  constructor(
    private settingsService: SettingsService,
    private router: Router,
    private cdr: ChangeDetectorRef
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
    
    // Gérer l'installation PWA
    this.setupPWAInstall();
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
    // Masquer la notification si on n'est plus sur mobile
    if (!this.isMobile) {
      this.showInstallNotification = false;
    }
  }

  toggleAppearance(): void {
    const newAppearance: Appearance = this.currentAppearance === 'clair' ? 'sombre' : 'clair';
    this.settingsService.applyAppearance(newAppearance);
  }

  /**
   * Configure l'installation PWA et gère l'affichage de la notification
   */
  private setupPWAInstall(): void {
    // Vérifier si l'app est déjà installée
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         (window.navigator as any).standalone ||
                         (window.navigator as any).standalone === true;
    
    if (isStandalone) {
      console.log('[PWA Install] App déjà installée, notification masquée');
      this.showInstallNotification = false;
      return;
    }

    // Vérifier si la notification a déjà été fermée
    const notificationDismissed = localStorage.getItem(this.INSTALL_NOTIFICATION_DISMISSED_KEY);
    if (notificationDismissed) {
      console.log('[PWA Install] Notification déjà fermée par l\'utilisateur');
      this.showInstallNotification = false;
      return;
    }

    // Vérifier si on est sur mobile
    if (!this.isMobile) {
      console.log('[PWA Install] Pas sur mobile, notification masquée');
      this.showInstallNotification = false;
      return;
    }
    
    console.log('[PWA Install] Configuration de l\'installation PWA');
    
    // Écouter l'événement beforeinstallprompt (Chrome/Edge/Opera)
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      console.log('[PWA Install] beforeinstallprompt déclenché');
      // Empêcher l'affichage automatique de la bannière
      e.preventDefault();
      // Sauvegarder l'événement pour l'utiliser plus tard
      this.deferredPrompt = e;
      
      // Afficher la notification si elle n'a pas été fermée
      if (!localStorage.getItem(this.INSTALL_NOTIFICATION_DISMISSED_KEY)) {
        console.log('[PWA Install] Affichage de la notification (beforeinstallprompt)');
        this.showInstallNotification = true;
        this.cdr.detectChanges(); // Forcer la détection de changement
      }
    });

    // Afficher la notification sur mobile après 2 secondes si elle n'a pas été fermée
    // (cela fonctionne aussi pour iOS où beforeinstallprompt n'existe pas)
    setTimeout(() => {
      const stillStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                              (window.navigator as any).standalone;
      const stillDismissed = localStorage.getItem(this.INSTALL_NOTIFICATION_DISMISSED_KEY);
      
      if (!stillStandalone && !stillDismissed && this.isMobile && !this.showInstallNotification) {
        console.log('[PWA Install] Affichage automatique de la notification après 2 secondes');
        this.showInstallNotification = true;
        this.cdr.detectChanges(); // Forcer la détection de changement
      }
    }, 2000);

    // Écouter l'événement appinstalled pour masquer la notification si l'app est installée
    window.addEventListener('appinstalled', () => {
      console.log('[PWA Install] App installée');
      this.showInstallNotification = false;
      this.deferredPrompt = null;
    });
  }

  /**
   * Déclenche l'installation de l'application PWA
   */
  async installPWA(): Promise<void> {
    // Si on a l'événement beforeinstallprompt (Chrome/Edge/Opera/Samsung Internet)
    if (this.deferredPrompt) {
      try {
        // Afficher l'invite d'installation
        this.deferredPrompt.prompt();

        // Attendre que l'utilisateur réponde à l'invite
        const { outcome } = await this.deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
          console.log('[PWA Install] L\'utilisateur a accepté l\'installation');
        } else {
          console.log('[PWA Install] L\'utilisateur a refusé l\'installation');
        }
      } catch (error) {
        console.error('[PWA Install] Erreur lors de l\'installation:', error);
      }

      // Réinitialiser l'événement
      this.deferredPrompt = null;
      this.showInstallNotification = false;
    } else {
      // Sur iOS ou autres navigateurs sans beforeinstallprompt
      console.log('[PWA Install] Installation programmatique non disponible sur ce navigateur');
      
      // Détecter iOS/Safari
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      
      if (isIOS || isSafari) {
        // Afficher des instructions pour iOS
        alert('Pour installer l\'application sur iOS:\n\n' +
              '1. Appuyez sur le bouton de partage (carré avec flèche)\n' +
              '2. Faites défiler et sélectionnez "Sur l\'écran d\'accueil"\n' +
              '3. Appuyez sur "Ajouter"');
      } else {
        // Pour d'autres navigateurs (Firefox desktop, etc.)
        console.log('[PWA Install] Ce navigateur ne supporte pas l\'installation PWA programmatique');
        alert('L\'installation automatique n\'est pas disponible sur ce navigateur.\n\n' +
              'Utilisez Chrome, Edge, Opera ou Samsung Internet pour installer l\'application.');
      }
      
      // Fermer la notification
      this.showInstallNotification = false;
    }
  }

  /**
   * Ferme la notification d'installation
   */
  dismissInstallNotification(): void {
    this.showInstallNotification = false;
    // Sauvegarder que l'utilisateur a fermé la notification
    localStorage.setItem(this.INSTALL_NOTIFICATION_DISMISSED_KEY, 'true');
  }
}
