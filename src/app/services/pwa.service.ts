import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  private deferredPrompt: any = null;
  private initialized = false;

  constructor() {
    this.initialize();
  }

  /**
   * Initialise le service PWA et écoute les événements
   */
  private initialize(): void {
    if (this.initialized) {
      return;
    }
    
    this.initialized = true;
    
    // Écouter l'événement beforeinstallprompt (Chrome/Edge/Opera)
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();
      this.deferredPrompt = e;
    });

    // Écouter l'événement appinstalled pour réinitialiser le prompt
    window.addEventListener('appinstalled', () => {
      this.deferredPrompt = null;
    });
  }

  /**
   * Vérifie si l'application est déjà installée
   */
  isInstalled(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches || 
           !!(window.navigator as any).standalone;
  }

  /**
   * Déclenche l'installation de l'application PWA
   */
  async installPWA(): Promise<void> {
    // Si on a l'événement beforeinstallprompt (Chrome/Edge/Opera)
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
    } else {
      // Sur iOS ou autres navigateurs sans beforeinstallprompt
      console.log('[PWA Install] Installation manuelle requise (iOS ou autre)');
      // Pour iOS, l'utilisateur doit utiliser le menu "Partager" > "Sur l'écran d'accueil"
    }
  }

  /**
   * Vérifie si l'installation PWA est disponible
   */
  canInstall(): boolean {
    return !this.isInstalled();
  }
}
