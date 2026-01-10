import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { SettingsService } from '../../services/settings.service';
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
    { value: 2, label: 'Forêt' },
    { value: 3, label: 'Océan' },
    { value: 4, label: 'Coucher' }
  ];
  private subscriptions = new Subscription();

  constructor(private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.checkMobile();
    window.addEventListener('resize', () => this.checkMobile());
    
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
    // Couleurs de prévisualisation pour chaque thème
    const colors: Record<Theme, { primary: string; accent: string; secondary: string }> = {
      1: { primary: '#3d2f1f', accent: '#b85c38', secondary: '#5a4a3a' }, // Default
      2: { primary: '#2d4a2d', accent: '#5a9d5a', secondary: '#3d6b3d' }, // Forest
      3: { primary: '#1a3d5a', accent: '#4a90b8', secondary: '#2d5a7a' }, // Ocean
      4: { primary: '#5a3d2d', accent: '#d87a4a', secondary: '#7a5a4a' }  // Sunset
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
