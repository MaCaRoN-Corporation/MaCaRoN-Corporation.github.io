import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { of, timeout } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { MaintenanceService } from '../services/maintenance.service';

/**
 * Guard qui redirige vers la page de maintenance si le mode maintenance est activé
 * Permet l'accès uniquement à la route /maintenance quand la maintenance est activée
 * Les IPs dans la liste allowedIPs du fichier de configuration ne sont pas bloquées
 */
export const maintenanceGuard: CanActivateFn = (route, state) => {
  const maintenanceService = inject(MaintenanceService);
  const router = inject(Router);

  // Si on essaie d'accéder à la page de maintenance, toujours autoriser
  if (state.url === '/maintenance') {
    return true;
  }

  // Vérifier si la maintenance est activée et si l'IP est autorisée
  // Le service s'assure de ne retourner que des valeurs réelles (après chargement de la config)
  return maintenanceService.isMaintenanceEnabled().pipe(
    timeout(3000), // Timeout de 3 secondes au cas où la config ne charge jamais
    switchMap(isEnabled => {
      console.log('[MaintenanceGuard] Vérification maintenance pour', state.url, ':', isEnabled);
      
      // Si la maintenance n'est pas activée, autoriser l'accès
      if (!isEnabled) {
        return of(true);
      }

      // Si la maintenance est activée, vérifier si l'IP est autorisée
      return maintenanceService.isIPAllowed().pipe(
        timeout(5000), // Timeout de 5 secondes pour la récupération de l'IP
        map(isIPAllowed => {
          if (isIPAllowed) {
            // L'IP est autorisée, permettre l'accès
            console.log('[MaintenanceGuard] IP autorisée, accès permis');
            return true;
          } else {
            // L'IP n'est pas autorisée, rediriger vers la page de maintenance
            console.log('[MaintenanceGuard] IP non autorisée, redirection vers /maintenance');
            router.navigate(['/maintenance'], { replaceUrl: true });
            return false;
          }
        }),
        catchError((ipError) => {
          // En cas d'erreur lors de la vérification de l'IP, bloquer par sécurité
          console.warn('[MaintenanceGuard] Erreur lors de la vérification de l\'IP, blocage par sécurité', ipError);
          router.navigate(['/maintenance'], { replaceUrl: true });
          return of(false);
        })
      );
    }),
    catchError((error) => {
      // En cas d'erreur ou de timeout, vérifier le cache synchrone en dernier recours
      const isEnabledSync = maintenanceService.isMaintenanceEnabledSync();
      if (isEnabledSync) {
        // Vérifier si l'IP est autorisée de manière synchrone
        const isIPAllowedSync = maintenanceService.isIPAllowedSync();
        if (!isIPAllowedSync) {
          router.navigate(['/maintenance'], { replaceUrl: true });
          return of(false);
        }
        // Si l'IP est autorisée ou si on ne peut pas la vérifier (pas encore chargée), autoriser
        return of(true);
      }
      // Par défaut, autoriser l'accès si on ne peut pas déterminer l'état
      console.warn('[MaintenanceGuard] Impossible de charger la config, autorisation par défaut', error);
      return of(true);
    })
  );
};
