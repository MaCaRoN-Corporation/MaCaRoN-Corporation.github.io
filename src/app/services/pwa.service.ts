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
   * Retourne true si l'installation a été déclenchée, false sinon
   */
  async installPWA(): Promise<boolean> {
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
        
        // Réinitialiser l'événement après utilisation
        this.deferredPrompt = null;
        return outcome === 'accepted';
      } catch (error) {
        console.error('[PWA Install] Erreur lors de l\'installation:', error);
        this.deferredPrompt = null;
        return false;
      }
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
        // Pour d'autres navigateurs (Firefox, etc.)
        console.log('[PWA Install] Ce navigateur ne supporte pas l\'installation PWA programmatique');
      }
      
      return false;
    }
  }

  /**
   * Vérifie si l'installation PWA est disponible
   * Retourne true seulement si l'app n'est pas installée ET si l'événement beforeinstallprompt est disponible
   */
  canInstall(): boolean {
    // L'app ne doit pas être déjà installée
    if (this.isInstalled()) {
      return false;
    }
    
    // Vérifier si l'événement beforeinstallprompt est disponible (Chrome/Edge/Opera/Samsung Internet)
    // Sur Safari iOS, Firefox desktop, etc., cet événement n'existe pas
    return this.deferredPrompt !== null;
  }
  
  /**
   * Vérifie si le navigateur supporte l'installation PWA programmatique
   * (via beforeinstallprompt)
   */
  supportsProgrammaticInstall(): boolean {
    return this.deferredPrompt !== null;
  }
  
  /**
   * Récupère l'événement deferredPrompt (pour vérification externe si nécessaire)
   */
  getDeferredPrompt(): any {
    return this.deferredPrompt;
  }
}
