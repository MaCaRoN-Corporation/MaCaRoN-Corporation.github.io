import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { SettingsService } from '../../services/settings.service';
import { PwaService } from '../../services/pwa.service';
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

  constructor(
    private settingsService: SettingsService,
    private pwaService: PwaService
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
}
