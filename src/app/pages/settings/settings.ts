import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { SettingsService } from '../../services/settings.service';
import { PwaService } from '../../services/pwa.service';
import { AnalyticsService } from '../../services/analytics.service';
import { UserSettings, Appearance, Theme } from '../../models/settings.model';

@Component({
  selector: 'app-settings',
  imports: [CommonModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class SettingsComponent implements OnInit, OnDestroy {
  isMobile = false;
  currentAppearance: Appearance = 'clair';
  currentTheme: Theme = 1;
  availableThemes: { value: Theme; label: string }[] = [
    { value: 1, label: 'Par défaut' },
    { value: 2, label: 'Violet' },
    { value: 3, label: 'Cyan' },
    { value: 4, label: 'Or' },
    { value: 5, label: 'Menthe' },
    { value: 6, label: 'Indigo' },
    { value: 7, label: 'Saphir' },
    { value: 8, label: 'Corail' },
    { value: 9, label: 'Lavande' }
  ];
  private subscriptions = new Subscription();
  canInstallPWA = false;
  isPWAInstalled = false;

  // Métriques Google Analytics
  visitorsToday: number | null = null;
  visitorsThisMonth: number | null = null;

  constructor(
    private settingsService: SettingsService,
    private pwaService: PwaService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit(): void {
    this.checkMobile();
    window.addEventListener('resize', () => this.checkMobile());
    
    // Vérifier l'état de l'installation PWA
    this.checkPWAStatus();
    
    // S'abonner aux réglages pour connaître l'apparence et le thème actuel
    this.subscriptions.add(
      this.settingsService.getSettings().subscribe((settings: UserSettings) => {
        this.currentAppearance = settings.appearance;
        this.currentTheme = settings.theme;
      })
    );

    // Charger les métriques Google Analytics
    this.loadAnalyticsMetrics();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  @HostListener('window:resize', [])
  onResize(): void {
    this.checkMobile();
  }

  private checkMobile(): void {
    this.isMobile = window.innerWidth < 768;
  }

  private checkPWAStatus(): void {
    this.isPWAInstalled = this.pwaService.isInstalled();
    this.canInstallPWA = this.pwaService.canInstall() && !this.isPWAInstalled;
  }

  async installPWA(): Promise<void> {
    await this.pwaService.installPWA();
    // Mettre à jour le statut après l'installation
    this.checkPWAStatus();
  }

  resetAppData(): void {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser toutes les données de l\'application ? Cette action effacera vos réglages, votre historique, vos configurations et toutes vos sélections de techniques. Cette action est irréversible.')) {
      try {
        // Liste des clés fixes à supprimer
        const fixedKeysToRemove = [
          'keiko-hub-settings',
          'keiko-hub-config',
          'keiko-hub-history',
          'keiko-hub-last-grade',
          'pwa-install-notification-dismissed'
        ];
        
        // Supprimer les clés fixes
        fixedKeysToRemove.forEach(key => {
          localStorage.removeItem(key);
        });
        
        // Supprimer toutes les clés dynamiques de sélection de techniques
        // Format: technique-filter-selection-{grade}
        const allGrades = [
          '6e Kyū', '5e Kyū', '4e Kyū', '3e Kyū', '2e Kyū', '1er Kyū',
          '1er Dan', '2e Dan', '3e Dan', '4e Dan', '5e Dan'
        ];
        
        allGrades.forEach(grade => {
          const key = `technique-filter-selection-${grade}`;
          localStorage.removeItem(key);
        });
        
        // Par sécurité, parcourir toutes les clés localStorage et supprimer celles qui commencent par nos préfixes
        const prefixesToRemove = ['keiko-hub-', 'technique-filter-selection-', 'pwa-install-notification-dismissed'];
        
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const key = localStorage.key(i);
          if (key) {
            // Supprimer si la clé commence par un de nos préfixes
            if (prefixesToRemove.some(prefix => key.startsWith(prefix))) {
              localStorage.removeItem(key);
            }
          }
        }
        
        // Recharger la page pour appliquer les changements
        window.location.reload();
      } catch (error) {
        console.error('[Settings] Erreur lors de la réinitialisation des données:', error);
        alert('Une erreur est survenue lors de la réinitialisation des données.');
      }
    }
  }

  toggleAppearance(): void {
    const newAppearance: Appearance = this.currentAppearance === 'clair' ? 'sombre' : 'clair';
    this.settingsService.applyAppearance(newAppearance);
  }

  onThemeChange(theme: Theme): void {
    this.settingsService.applyTheme(theme);
  }

  onAppearanceChange(appearance: Appearance): void {
    this.settingsService.applyAppearance(appearance);
  }

  getThemeColor(theme: Theme, type: 'primary' | 'accent' | 'secondary'): string {
    // Couleurs de prévisualisation pour chaque thème (basées sur l'apparence claire)
    const colors: Record<Theme, { primary: string; accent: string; secondary: string }> = {
      1: { primary: '#3d2f1f', accent: '#b85c38', secondary: '#5a4a3a' }, // Par défaut
      2: { primary: '#4a2d5a', accent: '#8a5aa8', secondary: '#6b4a7a' }, // Violet
      3: { primary: '#1a4a5a', accent: '#4aa8c8', secondary: '#2d6b7a' }, // Cyan
      4: { primary: '#5a3d1a', accent: '#c8a85a', secondary: '#7a5a2d' }, // Or
      5: { primary: '#2d5a4a', accent: '#5ac8a8', secondary: '#3d7a6b' }, // Menthe
      6: { primary: '#2d3d5a', accent: '#6a8ac8', secondary: '#3d5a7a' }, // Indigo
      7: { primary: '#1a3d5a', accent: '#4a8ab8', secondary: '#2d5a7a' }, // Saphir
      8: { primary: '#5a2d1a', accent: '#e87a5a', secondary: '#7a4a2d' }, // Corail
      9: { primary: '#5a4a6b', accent: '#b8a8d8', secondary: '#7a6b8a' }  // Lavande
    };
    return colors[theme][type];
  }

  getThemeGradient(theme: Theme): string {
    // Génère un gradient conique pour le cercle de prévisualisation
    const primary = this.getThemeColor(theme, 'primary');
    const accent = this.getThemeColor(theme, 'accent');
    const secondary = this.getThemeColor(theme, 'secondary');
    // Gradient conique qui fait un tour complet avec les 3 couleurs
    return `conic-gradient(from 0deg, ${primary} 0deg, ${accent} 120deg, ${secondary} 240deg, ${primary} 360deg)`;
  }

  /**
   * Charge les métriques Google Analytics
   */
  private loadAnalyticsMetrics(): void {
    this.subscriptions.add(
      this.analyticsService.getMetrics().subscribe(metrics => {
        this.visitorsToday = metrics.visitorsToday;
        this.visitorsThisMonth = metrics.visitorsThisMonth;
      })
    );
  }
}
