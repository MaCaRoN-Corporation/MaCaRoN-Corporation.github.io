import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { ConfigComponent } from './pages/config/config';
import { PassageComponent } from './pages/passage/passage';
import { SettingsComponent } from './pages/settings/settings';
import { HistoryComponent } from './pages/history/history';
import { MaintenanceComponent } from './pages/maintenance/maintenance';
import { NotFoundComponent } from './pages/not-found/not-found';

export const routes: Routes = [
  { path: 'maintenance', component: MaintenanceComponent },
  { path: '', component: HomeComponent },
  { path: 'config', component: ConfigComponent }, // Page dédiée pour mobile, panel intégré pour PC
  { path: 'passage', component: PassageComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'history', component: HistoryComponent },
  { path: '**', component: NotFoundComponent } // 404 -> Page non trouvée
];
