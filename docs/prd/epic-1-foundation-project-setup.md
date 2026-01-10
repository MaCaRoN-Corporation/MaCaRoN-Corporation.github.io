# Epic 1: Foundation & Project Setup

**Objectif étendu :** Établir les fondations techniques de l'application Keiko Hub en configurant le projet Angular, la structure de base, le routing multi-pages, et les services fondamentaux. Cet epic délivre une application fonctionnelle avec une page d'accueil permettant de naviguer vers les différentes sections, établissant ainsi l'infrastructure nécessaire pour tous les epics suivants tout en fournissant une valeur immédiate à l'utilisateur.

# Story 1.1: Project Initialization and Basic Structure

As a developer,
I want to initialiser le projet Angular avec la structure de base et la configuration nécessaire,
so that j'ai une fondation solide pour développer l'application.

**Acceptance Criteria:**

1. Le projet Angular est créé avec Angular CLI (version LTS recommandée)
2. La structure de dossiers standard Angular est en place (`src/app/`, `src/assets/`, etc.)
3. Les dossiers `src/assets/data/`, `src/assets/audio/`, et `src/assets/images/` sont créés pour les fichiers JSON, audios et logo
4. Le fichier `angular.json` est configuré correctement
5. TypeScript est configuré avec des règles appropriées
6. Le projet compile sans erreurs avec `ng build`
7. Un README.md de base est créé avec les instructions de démarrage

## Story 1.2: Routing Setup and Navigation

As a user,
I want naviguer entre les différentes pages de l'application,
so that je peux accéder à toutes les fonctionnalités.

**Acceptance Criteria:**

1. Angular Router est configuré dans le module principal
2. Les routes suivantes sont définies : `/` (accueil), `/config` (configuration), `/passage` (passage), `/settings` (réglages), `/history` (historique)
3. Un composant de navigation (header/navbar) est créé avec le logo Keiko Hub et les liens vers les pages principales
4. La navigation fonctionne correctement entre toutes les routes
5. Un composant de layout principal est créé pour contenir la navigation et le router-outlet
6. Les routes non définies redirigent vers la page d'accueil (404 handling)

## Story 1.3: Home Page with Quick Start Button

As a user,
I want voir une page d'accueil simple avec un gros bouton "Démarrer",
so que je peux commencer rapidement sans configuration complexe.

**Acceptance Criteria:**

1. Une page d'accueil (`HomeComponent`) est créée à la route `/`
2. La page affiche le logo Keiko Hub de manière visible
3. Un gros bouton "Démarrer" est centré et bien visible sur la page
4. Le bouton "Démarrer" redirige vers la page de configuration (`/config`)
5. Un lien discret vers les réglages est disponible (optionnel)
6. Le design est épuré et minimaliste, inspiré de l'esthétique japonaise
7. La page est responsive et fonctionne sur mobile, tablette et desktop
8. Le bouton est suffisamment grand pour être facilement cliquable sur mobile (minimum 44x44px)

## Story 1.4: Core Services Structure

As a developer,
I want créer la structure de base des services Angular,
so que je peux commencer à implémenter la logique métier de manière organisée.

**Acceptance Criteria:**

1. Les services suivants sont créés (vides pour l'instant) : `GradeService`, `PassageService`, `AudioService`, `SettingsService`, `ExportService`
2. Chaque service est injectable et fourni au niveau approprié (root ou module)
3. RxJS est importé et configuré pour l'utilisation de BehaviorSubject
4. Les services sont organisés dans un dossier `src/app/services/`
5. Chaque service a une structure de base avec des méthodes vides documentées
6. Les services peuvent être injectés dans les composants sans erreur

## Story 1.5: Settings Service with LocalStorage

As a user,
I want que mes réglages soient sauvegardés automatiquement,
so que je n'ai pas à les reconfigurer à chaque visite.

**Acceptance Criteria:**

1. Le `SettingsService` est créé avec la gestion du localStorage
2. Le service peut sauvegarder les réglages suivants : thème (clair/sombre), voix (masculin/féminin), couleurs personnalisées (bannière, footer)
3. Le service peut charger les réglages sauvegardés depuis le localStorage
4. Les réglages sont chargés automatiquement au démarrage de l'application
5. Les réglages par défaut sont appliqués si aucun réglage n'est sauvegardé
6. Le service utilise RxJS BehaviorSubject pour notifier les changements de réglages
7. Les méthodes de sauvegarde et chargement gèrent les erreurs de localStorage gracieusement

## Story 1.6: Theme System Implementation

As a user,
I want pouvoir choisir entre un thème clair et sombre,
so que je peux adapter l'interface à mes préférences visuelles.

**Acceptance Criteria:**

1. Un système de thèmes est implémenté utilisant CSS Variables
2. Les thèmes clair et sombre sont définis avec des couleurs appropriées
3. Le thème est appliqué globalement à l'application via une classe CSS sur le body ou un élément racine
4. Le SettingsService gère le thème actuel et sa persistance
5. Un toggle ou sélecteur de thème est disponible (peut être dans la navigation ou page de réglages)
6. Le changement de thème est appliqué immédiatement sans rechargement de page
7. Le thème par défaut est "clair" si aucun n'est sauvegardé
8. Les transitions entre thèmes sont fluides (CSS transitions)

---
