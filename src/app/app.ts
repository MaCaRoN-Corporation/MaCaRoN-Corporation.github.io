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
    // Charger et appliquer l'apparence et le thème sauvegardés au démarrage
    // (déjà fait dans le constructeur du service, mais on s'assure que c'est bien appliqué)
    this.settingsService.getSettings().subscribe((settings) => {
      this.settingsService.applyAppearanceAndTheme(settings.appearance, settings.theme);
    });
  }
}
