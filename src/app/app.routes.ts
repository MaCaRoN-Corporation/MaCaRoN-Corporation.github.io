import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { ConfigComponent } from './pages/config/config';
import { PassageComponent } from './pages/passage/passage';
import { SettingsComponent } from './pages/settings/settings';
import { HistoryComponent } from './pages/history/history';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'config', component: ConfigComponent }, // Page dédiée pour mobile, panel intégré pour PC
  { path: 'passage', component: PassageComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'history', component: HistoryComponent },
  { path: '**', redirectTo: '' } // 404 -> Home
];
