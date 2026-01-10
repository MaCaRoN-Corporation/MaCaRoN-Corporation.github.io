import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { ConfigComponent } from './pages/config/config';
import { PassageComponent } from './pages/passage/passage';
import { SettingsComponent } from './pages/settings/settings';
import { HistoryComponent } from './pages/history/history';
import { MaintenanceComponent } from './pages/maintenance/maintenance';
import { NotFoundComponent } from './pages/not-found/not-found';
import { maintenanceGuard } from './guards/maintenance.guard';

export const routes: Routes = [
  { path: 'maintenance', component: MaintenanceComponent },
  { path: '', component: HomeComponent, canActivate: [maintenanceGuard] },
  { path: 'config', component: ConfigComponent, canActivate: [maintenanceGuard] }, // Page dédiée pour mobile, panel intégré pour PC
  { path: 'passage', component: PassageComponent, canActivate: [maintenanceGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [maintenanceGuard] },
  { path: 'history', component: HistoryComponent, canActivate: [maintenanceGuard] },
  { path: '**', component: NotFoundComponent, canActivate: [maintenanceGuard] } // 404 -> Page non trouvée
];
