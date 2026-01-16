# Epic 5: Personalization & Export

**Objectif étendu :** Développer le système complet de personnalisation (thèmes, couleurs personnalisables), finaliser le SettingsService avec toute la persistance nécessaire, créer la page de réglages complète, et implémenter la fonctionnalité d'export .txt avec liens vidéo pour permettre aux utilisateurs de sauvegarder et partager leurs passages.

# Story 5.1: Settings Page Layout

**Status:** ✅ **COMPLÈTE**

As a user,
I want accéder à une page de réglages complète,
so que je peux personnaliser tous les aspects de l'application.

**Acceptance Criteria:**

1. ✅ La page de réglages (`/settings`) est créée avec un layout organisé (implémentée dans `settings.html`)
2. ✅ La page est accessible depuis la navigation principale (lien dans `navigation.html`)
3. ✅ Les sections de réglages sont logiquement groupées (Apparence, Thème, Autres réglages)
4. ✅ La page est responsive et fonctionne sur tous les appareils
5. ✅ Le design est cohérent avec le reste de l'application (glassmorphism)
6. ✅ Les changements sont sauvegardés automatiquement (pas de bouton "Sauvegarder" nécessaire - géré par SettingsService)

## Story 5.2: Color Customization Interface

**Status:** ⚠️ **PARTIELLEMENT FAIT** (infrastructure en place, UI manquante)

As a user,
I want personnaliser les couleurs de la bannière et du footer,
so que je peux adapter l'apparence de l'application à mes préférences.

**Acceptance Criteria:**

1. ⏳ La page de réglages affiche des color pickers pour la bannière et le footer (à implémenter)
2. ⏳ Les color pickers permettent de sélectionner n'importe quelle couleur (à implémenter)
3. ⏳ Les changements de couleur sont appliqués immédiatement (aperçu en temps réel) (à implémenter)
4. ✅ Les couleurs sont sauvegardées dans le SettingsService et localStorage (déjà implémenté - `bannerColor` et `footerColor` dans UserSettings)
5. ✅ Les couleurs sont appliquées globalement à l'application via CSS Variables (déjà implémenté dans `settings.service.ts` - méthode `applyColors()`)
6. ⏳ Les couleurs par défaut sont restaurées si l'utilisateur le souhaite (à implémenter dans l'UI)
7. ⏳ Le contraste des couleurs est validé pour l'accessibilité (WCAG AA) (à implémenter)

**Note :** L'infrastructure est en place (SettingsService gère `bannerColor` et `footerColor`, application via CSS Variables), mais l'interface utilisateur (color pickers) n'est pas encore implémentée dans la page settings.

## Story 5.3: Theme Persistence and Application

**Status:** ✅ **COMPLÈTE**

As a user,
I want que mon choix de thème (clair/sombre) soit sauvegardé et appliqué automatiquement,
so que je n'ai pas à le reconfigurer à chaque visite.

**Acceptance Criteria:**

1. ✅ Le SettingsService sauvegarde le thème sélectionné dans localStorage (implémenté dans Story 1.5)
2. ✅ Le thème est chargé automatiquement au démarrage de l'application (chargement dans le constructeur de SettingsService)
3. ✅ Le thème est appliqué globalement à toutes les pages (via classes CSS sur document.body)
4. ✅ Le changement de thème est immédiat sans rechargement (méthode `applyAppearance()` et `applyTheme()`)
5. ✅ La transition entre thèmes est fluide (CSS transitions dans `_themes.scss`)
6. ✅ Le thème est accessible depuis la page de réglages et depuis la navigation (toggle dans navigation.html pour desktop, dans settings.html pour mobile)

**Note :** Cette story est complète. Le système de thèmes inclut également 9 palettes de couleurs (Theme 1-9) qui s'adaptent à l'apparence claire/sombre.

## Story 5.4: Export Service Implementation

**Status:** ⚠️ **PARTIELLEMENT FAIT** (service créé mais vide)

As a developer,
I want un service qui génère un fichier .txt avec les techniques du passage,
so que l'application peut exporter les passages pour révision.

**Acceptance Criteria:**

1. ✅ L'`ExportService` est créé avec une méthode pour générer un fichier .txt (service existe dans `export.service.ts` mais méthodes vides)
2. ⏳ Le service prend en paramètre la liste des techniques du passage (à implémenter)
3. ⏳ Le service formate le texte avec les informations de chaque technique (attaque, technique, position) (à implémenter)
4. ⏳ Le service inclut les liens vidéo pour chaque technique (selon videos.json) (à implémenter)
5. ⏳ Le fichier généré est bien formaté et lisible (à implémenter)
6. ⏳ Le service utilise l'API Blob du navigateur pour créer le fichier (à implémenter)
7. ⏳ Le service gère les erreurs gracieusement (à implémenter)

**Note :** Le service `ExportService` existe déjà (`src/app/services/export.service.ts`) mais les méthodes `exportPassage()` et `formatPassageText()` sont des placeholders vides.

## Story 5.5: Export Functionality in UI

**Status:** ⚠️ **PARTIELLEMENT FAIT** (bouton UI présent, fonctionnalité manquante)

As a user,
I want pouvoir exporter mon passage en fichier .txt,
so que je peux le sauvegarder, le partager ou le réviser plus tard.

**Acceptance Criteria:**

1. ✅ Un bouton "Exporter" est disponible sur l'écran de fin de passage (implémenté dans `passage.html`)
2. ⏳ Le bouton génère et télécharge un fichier .txt avec toutes les techniques (méthode `exportPassage()` est un placeholder)
3. ⏳ Le fichier .txt contient : la liste numérotée des techniques avec attaque, technique, position (à implémenter)
4. ⏳ Chaque technique dans le fichier inclut un lien vidéo (si disponible dans videos.json) (à implémenter)
5. ⏳ Le nom du fichier est descriptif (ex: "keiko-hub-passage-2024-12-19.txt") (à implémenter)
6. ⏳ Le téléchargement fonctionne sur tous les navigateurs modernes (à implémenter)
7. ⏳ Un message de confirmation est affiché après l'export réussi (à implémenter)

**Note :** Le bouton "Exporter" existe dans l'écran de fin de passage (`passage.html` ligne 151) et appelle `exportPassage()`, mais cette méthode est actuellement un placeholder qui log simplement un message.

---
