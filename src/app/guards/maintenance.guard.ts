import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { of, timeout } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { MaintenanceService } from '../services/maintenance.service';

/**
 * Guard qui redirige vers la page de maintenance si le mode maintenance est activé
 * Permet l'accès uniquement à la route /maintenance quand la maintenance est activée
 */
export const maintenanceGuard: CanActivateFn = (route, state) => {
  const maintenanceService = inject(MaintenanceService);
  const router = inject(Router);

  // Si on essaie d'accéder à la page de maintenance, toujours autoriser
  if (state.url === '/maintenance') {
    return true;
  }

  // Vérifier si la maintenance est activée
  // Le service s'assure de ne retourner que des valeurs réelles (après chargement de la config)
  return maintenanceService.isMaintenanceEnabled().pipe(
    timeout(3000), // Timeout de 3 secondes au cas où la config ne charge jamais
    map(isEnabled => {
      console.log('[MaintenanceGuard] Vérification maintenance pour', state.url, ':', isEnabled);
      if (isEnabled) {
        // Rediriger vers la page de maintenance
        console.log('[MaintenanceGuard] Redirection vers /maintenance');
        router.navigate(['/maintenance'], { replaceUrl: true });
        return false;
      }
      // Si la maintenance n'est pas activée, autoriser l'accès
      return true;
    }),
    catchError((error) => {
      // En cas d'erreur ou de timeout, vérifier le cache synchrone en dernier recours
      const isEnabledSync = maintenanceService.isMaintenanceEnabledSync();
      if (isEnabledSync) {
        router.navigate(['/maintenance'], { replaceUrl: true });
        return of(false);
      }
      // Par défaut, autoriser l'accès si on ne peut pas déterminer l'état
      console.warn('[MaintenanceGuard] Impossible de charger la config, autorisation par défaut', error);
      return of(true);
    })
  );
};
