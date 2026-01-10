import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { SettingsService } from '../../services/settings.service';
import { UserSettings } from '../../models/settings.model';

@Component({
  selector: 'app-settings',
  imports: [CommonModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class SettingsComponent implements OnInit, OnDestroy {
  isMobile = false;
  currentTheme: 'clair' | 'sombre' = 'clair';
  private subscriptions = new Subscription();

  constructor(private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.checkMobile();
    window.addEventListener('resize', () => this.checkMobile());
    
    // S'abonner aux réglages pour connaître le thème actuel
    this.subscriptions.add(
      this.settingsService.getSettings().subscribe((settings: UserSettings) => {
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

  toggleTheme(): void {
    const newTheme = this.currentTheme === 'clair' ? 'sombre' : 'clair';
    this.settingsService.applyTheme(newTheme);
  }
}
