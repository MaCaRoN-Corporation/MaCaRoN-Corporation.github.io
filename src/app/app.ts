import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './components/navigation/navigation';
import { SettingsService } from './services/settings.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavigationComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  constructor(private settingsService: SettingsService) {}

  ngOnInit(): void {
    // Charger et appliquer le thème sauvegardé au démarrage
    this.settingsService.getSettings().subscribe((settings) => {
      this.settingsService.applyTheme(settings.theme);
    });
  }
}
