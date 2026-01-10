# Epic 5: Personalization & Export

**Objectif étendu :** Développer le système complet de personnalisation (thèmes, couleurs personnalisables), finaliser le SettingsService avec toute la persistance nécessaire, créer la page de réglages complète, et implémenter la fonctionnalité d'export .txt avec liens vidéo pour permettre aux utilisateurs de sauvegarder et partager leurs passages.

# Story 5.1: Settings Page Layout

As a user,
I want accéder à une page de réglages complète,
so que je peux personnaliser tous les aspects de l'application.

**Acceptance Criteria:**

1. La page de réglages (`/settings`) est créée avec un layout organisé
2. La page est accessible depuis la navigation principale
3. Les sections de réglages sont logiquement groupées (Apparence, Audio, etc.)
4. La page est responsive et fonctionne sur tous les appareils
5. Le design est cohérent avec le reste de l'application
6. Les changements sont sauvegardés automatiquement (pas de bouton "Sauvegarder" nécessaire)

## Story 5.2: Color Customization Interface

As a user,
I want personnaliser les couleurs de la bannière et du footer,
so que je peux adapter l'apparence de l'application à mes préférences.

**Acceptance Criteria:**

1. La page de réglages affiche des color pickers pour la bannière et le footer
2. Les color pickers permettent de sélectionner n'importe quelle couleur
3. Les changements de couleur sont appliqués immédiatement (aperçu en temps réel)
4. Les couleurs sont sauvegardées dans le SettingsService et localStorage
5. Les couleurs sont appliquées globalement à l'application via CSS Variables
6. Les couleurs par défaut sont restaurées si l'utilisateur le souhaite
7. Le contraste des couleurs est validé pour l'accessibilité (WCAG AA)

## Story 5.3: Theme Persistence and Application

As a user,
I want que mon choix de thème (clair/sombre) soit sauvegardé et appliqué automatiquement,
so que je n'ai pas à le reconfigurer à chaque visite.

**Acceptance Criteria:**

1. Le SettingsService sauvegarde le thème sélectionné dans localStorage
2. Le thème est chargé automatiquement au démarrage de l'application
3. Le thème est appliqué globalement à toutes les pages
4. Le changement de thème est immédiat sans rechargement
5. La transition entre thèmes est fluide
6. Le thème est accessible depuis la page de réglages et peut-être depuis la navigation

## Story 5.4: Export Service Implementation

As a developer,
I want un service qui génère un fichier .txt avec les techniques du passage,
so que l'application peut exporter les passages pour révision.

**Acceptance Criteria:**

1. L'`ExportService` est créé avec une méthode pour générer un fichier .txt
2. Le service prend en paramètre la liste des techniques du passage
3. Le service formate le texte avec les informations de chaque technique (attaque, technique, position)
4. Le service inclut les liens vidéo pour chaque technique (selon videos.json)
5. Le fichier généré est bien formaté et lisible
6. Le service utilise l'API Blob du navigateur pour créer le fichier
7. Le service gère les erreurs gracieusement

## Story 5.5: Export Functionality in UI

As a user,
I want pouvoir exporter mon passage en fichier .txt,
so que je peux le sauvegarder, le partager ou le réviser plus tard.

**Acceptance Criteria:**

1. Un bouton "Exporter" est disponible sur l'écran de fin de passage
2. Le bouton génère et télécharge un fichier .txt avec toutes les techniques
3. Le fichier .txt contient : la liste numérotée des techniques avec attaque, technique, position
4. Chaque technique dans le fichier inclut un lien vidéo (si disponible dans videos.json)
5. Le nom du fichier est descriptif (ex: "keiko-hub-passage-2024-12-19.txt")
6. Le téléchargement fonctionne sur tous les navigateurs modernes
7. Un message de confirmation est affiché après l'export réussi

---
