# Documentation - Intégration Google Analytics

## Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Configuration initiale](#configuration-initiale)
3. [Service Analytics](#service-analytics)
4. [Tracking des événements](#tracking-des-événements)
5. [Tracking des pages vues](#tracking-des-pages-vues)
6. [Métriques personnalisées](#métriques-personnalisées)
7. [Exemples d'utilisation](#exemples-dutilisation)
8. [Bonnes pratiques](#bonnes-pratiques)
9. [Dépannage](#dépannage)

---

## Vue d'ensemble

Cette documentation explique comment intégrer et utiliser Google Analytics 4 (GA4) dans l'application Keiko Hub pour suivre l'utilisation et les métriques importantes.

### État actuel

- ✅ **Script Google Analytics intégré** dans `src/index.html` avec l'ID `G-H0MY2T492N`
- ✅ **Service Analytics** existant dans `src/app/services/analytics.service.ts`
- ⚠️ **Service actuellement orienté** vers la récupération de métriques (nécessite un backend)
- ❌ **Tracking d'événements** non encore implémenté

### Objectifs

1. Tracker les événements utilisateur (clics, actions, etc.)
2. Suivre la navigation entre les pages
3. Mesurer l'engagement utilisateur
4. Analyser les fonctionnalités les plus utilisées

---

## Configuration initiale

### 1. Vérification de l'intégration de base

Le script Google Analytics est déjà intégré dans `src/index.html` :

```61:68:src/index.html
  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-H0MY2T492N"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-H0MY2T492N');
  </script>
```

### 2. ID de propriété Google Analytics

L'ID actuel est : **`G-H0MY2T492N`**

Pour le modifier :
1. Récupérer votre ID de propriété GA4 depuis [Google Analytics](https://analytics.google.com/)
2. Remplacer `G-H0MY2T492N` dans `src/index.html`
3. Mettre à jour la constante `GA_PROPERTY_ID` dans le service Analytics

---

## Service Analytics

### Structure actuelle

Le service `AnalyticsService` existe dans `src/app/services/analytics.service.ts` mais est actuellement conçu pour récupérer des métriques depuis l'API Google Analytics (nécessite un backend).

### Extension du service pour le tracking

Pour ajouter le tracking d'événements, vous devez étendre le service avec les méthodes suivantes :

#### Déclaration TypeScript pour gtag

Ajoutez cette déclaration dans un fichier de types (ex: `src/app/types/gtag.d.ts`) :

```typescript
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
```

#### Méthodes à ajouter au service

```typescript
/**
 * Envoie un événement à Google Analytics
 * @param eventName Nom de l'événement (ex: 'button_click', 'page_view')
 * @param eventParams Paramètres additionnels de l'événement
 */
trackEvent(eventName: string, eventParams?: Record<string, any>): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
}

/**
 * Envoie une page vue à Google Analytics
 * @param pagePath Chemin de la page (ex: '/config', '/passage')
 * @param pageTitle Titre de la page
 */
trackPageView(pagePath: string, pageTitle?: string): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', this.GA_PROPERTY_ID, {
      page_path: pagePath,
      page_title: pageTitle
    });
  }
}

/**
 * Définit un paramètre utilisateur personnalisé
 * @param name Nom du paramètre
 * @param value Valeur du paramètre
 */
setUserProperty(name: string, value: string): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('set', { [name]: value });
  }
}
```

---

## Tracking des événements

### Événements standards Google Analytics

Google Analytics 4 utilise des événements prédéfinis et personnalisés. Voici les événements recommandés pour Keiko Hub :

#### Événements automatiques (déjà trackés)
- `page_view` - Affichage de page
- `first_visit` - Première visite
- `session_start` - Début de session

#### Événements recommandés pour l'application

| Événement | Catégorie | Description |
|-----------|-----------|-------------|
| `start_training` | Training | Démarrage d'un entraînement |
| `stop_training` | Training | Arrêt d'un entraînement |
| `technique_announced` | Training | Technique annoncée |
| `technique_completed` | Training | Technique complétée |
| `export_passage` | Export | Export d'un passage |
| `settings_changed` | Settings | Modification des paramètres |
| `voice_selected` | Settings | Sélection d'une voix |
| `grade_selected` | Config | Sélection d'un grade |
| `filter_applied` | Config | Application d'un filtre |
| `audio_played` | Audio | Lecture d'un fichier audio |
| `audio_error` | Audio | Erreur de lecture audio |

### Exemple d'implémentation

```typescript
// Dans un composant ou service
constructor(private analytics: AnalyticsService) {}

startTraining(): void {
  // Votre logique métier
  this.analytics.trackEvent('start_training', {
    category: 'Training',
    grade: this.selectedGrade,
    technique_count: this.techniques.length
  });
}
```

---

## Tracking des pages vues

### Configuration avec Angular Router

Pour tracker automatiquement les changements de page dans une SPA Angular, vous pouvez utiliser un service qui écoute les événements du routeur :

#### Création d'un service de tracking de navigation

```typescript
import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AnalyticsService } from './analytics.service';

@Injectable({
  providedIn: 'root'
})
export class NavigationTrackingService {
  constructor(
    private router: Router,
    private analytics: AnalyticsService
  ) {
    this.trackPageViews();
  }

  private trackPageViews(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.analytics.trackPageView(event.urlAfterRedirects);
      });
  }
}
```

#### Intégration dans app.config.ts

```typescript
import { ApplicationConfig, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
// ... autres imports

export const appConfig: ApplicationConfig = {
  providers: [
    // ... autres providers
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        const tracking = inject(NavigationTrackingService);
        return () => {};
      },
      multi: true
    }
  ]
};
```

---

## Métriques personnalisées

### Paramètres personnalisés

Vous pouvez envoyer des paramètres personnalisés avec vos événements :

```typescript
this.analytics.trackEvent('start_training', {
  category: 'Training',
  grade: '5e Kyu',
  technique_count: 15,
  duration_minutes: 30,
  voice_type: 'elevenlabs',
  custom_parameter_1: 'value'
});
```

### Dimensions personnalisées

Pour créer des dimensions personnalisées dans Google Analytics :

1. Aller dans **Admin** > **Événements personnalisés**
2. Créer un événement personnalisé ou modifier un événement existant
3. Ajouter des paramètres personnalisés

---

## Exemples d'utilisation

### 1. Tracking du démarrage d'un entraînement

```typescript
// Dans PassageComponent ou HomeComponent
startTraining(): void {
  this.analytics.trackEvent('start_training', {
    category: 'Training',
    grade: this.selectedGrade,
    technique_count: this.techniques.length,
    mode: this.trainingMode
  });
  
  // Votre logique de démarrage
}
```

### 2. Tracking de la sélection d'une voix

```typescript
// Dans SettingsComponent ou ConfigComponent
selectVoice(voice: string): void {
  this.analytics.trackEvent('voice_selected', {
    category: 'Settings',
    voice_name: voice,
    voice_type: this.getVoiceType(voice)
  });
  
  // Votre logique de sélection
}
```

### 3. Tracking d'un export

```typescript
// Dans ExportService
exportPassage(passage: Passage): void {
  this.analytics.trackEvent('export_passage', {
    category: 'Export',
    format: 'txt',
    technique_count: passage.techniques.length,
    grade: passage.grade
  });
  
  // Votre logique d'export
}
```

### 4. Tracking d'une erreur audio

```typescript
// Dans AudioService
playAudio(url: string): void {
  this.audio.load();
  this.audio.src = url;
  this.audio.play().catch(error => {
    this.analytics.trackEvent('audio_error', {
      category: 'Audio',
      error_type: error.name,
      audio_url: url
    });
  });
}
```

### 5. Tracking d'un changement de paramètres

```typescript
// Dans SettingsComponent
updateSettings(settings: Settings): void {
  this.analytics.trackEvent('settings_changed', {
    category: 'Settings',
    setting_type: 'appearance', // ou 'theme', 'audio', etc.
    old_value: this.previousSettings.appearance,
    new_value: settings.appearance
  });
  
  // Votre logique de mise à jour
}
```

---

## Bonnes pratiques

### 1. Nommage des événements

- Utilisez des noms en **snake_case** : `start_training`, `voice_selected`
- Soyez **descriptifs** : `export_passage` plutôt que `export`
- Utilisez des **verbes d'action** : `start_`, `stop_`, `select_`, `change_`

### 2. Structure des paramètres

- Incluez toujours une **catégorie** pour grouper les événements
- Ajoutez des **paramètres contextuels** pertinents
- Évitez les **données sensibles** (mots de passe, emails, etc.)

### 3. Performance

- Le tracking ne doit **jamais bloquer** l'interface utilisateur
- Utilisez des **appels asynchrones** (gtag est déjà asynchrone)
- Évitez de tracker **trop fréquemment** (ex: pas à chaque frame d'animation)

### 4. Respect de la vie privée

- Informez les utilisateurs du tracking (mention dans les paramètres)
- Respectez le **RGPD** si applicable
- Considérez une option de **désactivation** du tracking

### 5. Tests

- Testez en **mode développement** avec la console ouverte
- Vérifiez les événements dans **Google Analytics DebugView**
- Utilisez l'extension **Google Analytics Debugger** pour Chrome

---

## Dépannage

### Les événements n'apparaissent pas dans Google Analytics

1. **Vérifiez l'ID de propriété** dans `index.html` et le service
2. **Attendez 24-48h** pour les données en temps réel (DebugView montre en temps réel)
3. **Vérifiez la console** pour les erreurs JavaScript
4. **Testez avec DebugView** : https://analytics.google.com/analytics/web/#/debugview

### Le script gtag n'est pas chargé

1. Vérifiez que le script est dans le `<head>` de `index.html`
2. Vérifiez la connexion internet (le script est chargé depuis Google)
3. Vérifiez les bloqueurs de publicité (peuvent bloquer GA)

### Les événements ne sont pas trackés en développement local

- C'est normal, Google Analytics fonctionne mieux en production
- Utilisez **DebugView** pour voir les événements en temps réel
- Vérifiez que `window.gtag` est défini avant d'appeler les méthodes

### Erreur TypeScript : "gtag is not defined"

Ajoutez la déclaration de type dans `src/app/types/gtag.d.ts` :

```typescript
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export {};
```

---

## Ressources supplémentaires

- [Documentation Google Analytics 4](https://developers.google.com/analytics/devguides/collection/ga4)
- [Guide des événements GA4](https://developers.google.com/analytics/devguides/collection/ga4/events)
- [DebugView GA4](https://support.google.com/analytics/answer/7201382)
- [Extension Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechfna)

---

## Checklist d'intégration

- [ ] Vérifier que le script GA est présent dans `index.html`
- [ ] Vérifier l'ID de propriété Google Analytics
- [ ] Ajouter les déclarations TypeScript pour `gtag`
- [ ] Étendre `AnalyticsService` avec les méthodes de tracking
- [ ] Implémenter le tracking de navigation (pages vues)
- [ ] Ajouter le tracking des événements principaux
- [ ] Tester avec DebugView
- [ ] Vérifier les événements dans Google Analytics (après 24-48h)
- [ ] Documenter les événements trackés pour l'équipe

---

**Dernière mise à jour** : 2024-12-19  
**Version** : 1.0
