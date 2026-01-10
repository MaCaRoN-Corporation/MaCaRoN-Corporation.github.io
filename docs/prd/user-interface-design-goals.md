# User Interface Design Goals

# Overall UX Vision

L'interface utilisateur doit être **ultra-simple et intuitive**, optimisée pour une utilisation pendant l'entraînement physique. L'objectif principal est de créer une expérience immersive qui simule fidèlement un passage de grade réel, sans distractions ni complexité inutile.

**Principes de design clés :**
- **Simplicité avant tout :** Interface épurée avec un minimum d'éléments visuels pendant le passage
- **Accessibilité immédiate :** Mode "démarrage rapide" permettant de commencer en un clic
- **Immersion totale :** Mode plein écran pour éliminer toutes les distractions pendant l'entraînement
- **Feedback visuel clair :** Indicateurs visuels immédiats (timer, compte à rebours, progression)
- **Personnalisation discrète :** Options de personnalisation disponibles mais non intrusives
- **Optimisation mobile-first :** Conçue pour être utilisée debout avec un téléphone/tablette pendant l'entraînement

**Expérience utilisateur cible :**
L'utilisateur doit pouvoir arriver sur le site, cliquer sur "Démarrer", et commencer un passage de grade en moins de 10 secondes. Pendant le passage, l'interface doit être si claire et simple que l'utilisateur peut se concentrer entièrement sur l'exécution des techniques sans être distrait par l'interface.

## Key Interaction Paradigms

1. **Paradigme "Démarrage Rapide" :**
   - Page d'accueil avec un seul gros bouton "Démarrer" pour les utilisateurs pressés
   - Configuration par défaut intelligente (derniers réglages ou valeurs par défaut sensées)
   - Accès aux options avancées disponible mais non obligatoire

2. **Paradigme "Configuration Flexible" :**
   - Page de configuration dédiée pour les utilisateurs souhaitant personnaliser
   - Filtres progressifs (commencer simple, options avancées disponibles)
   - Prévisualisation des options avant de générer le passage

3. **Paradigme "Immersion Totale" :**
   - Mode plein écran automatique ou manuel pendant le passage
   - Interface minimale pendant le passage (seulement l'essentiel visible)
   - Contrôles accessibles mais discrets (pause, répéter)

4. **Paradigme "Feedback Immédiat" :**
   - Compte à rebours visuel avant chaque technique
   - Affichage en grand de l'attaque et de la technique en cours
   - Historique visible mais non intrusif
   - Barre de progression claire

5. **Paradigme "Personnalisation Persistante" :**
   - Réglages sauvegardés automatiquement
   - Thèmes et couleurs appliqués immédiatement
   - Préférences respectées à chaque session

6. **Paradigme "Raccourcis Clavier" :**
   - Support des raccourcis pour utilisation desktop
   - Raccourcis simples et mémorisables (Espace, R)
   - Indication visuelle des raccourcis disponibles

## Core Screens and Views

1. **Page d'Accueil (`/`)**
   - Gros bouton "Démarrer" central et visible
   - Accès rapide aux réglages (optionnel, discret)
   - Message de bienvenue simple
   - Pas d'aperçu des dernières configurations (selon spécifications)

2. **Page de Configuration (`/config`)**
   - Sélection du grade (liste déroulante ou cartes visuelles)
   - Configuration du temps entre techniques (slider ou input)
   - Configuration de la durée totale (slider ou input)
   - Sélection de la voix (boutons radio ou toggle)
   - Filtres par position (checkboxes ou toggles)
   - Filtres par attaque (liste avec recherche ou sélection multiple)
   - Filtres par technique (liste avec recherche ou sélection multiple)
   - Inclusion/exclusion des armes (toggle)
   - Inclusion/exclusion du Randori (toggle)
   - Bouton "Générer le passage" bien visible

3. **Page de Passage (`/passage`)**
   - Timer visible en haut (grand et lisible)
   - Compte à rebours visuel (cercle animé ou barre)
   - Attaque et technique en cours (texte très grand, centré)
   - Historique des techniques (liste déroulante ou sidebar)
   - Indicateur "Technique X sur Y" (texte visible)
   - Barre de progression (barre horizontale animée)
   - Boutons de contrôle (pause, répéter) bien visibles mais non intrusifs
   - Bouton plein écran (icône discrète)
   - Message de fin de passage (modal ou écran dédié)

4. **Page de Réglages (`/settings`)**
   - Sélection du thème (toggle clair/sombre)
   - Personnalisation des couleurs (color pickers pour bannière et footer)
   - Sélection de la voix par défaut
   - Sauvegarde automatique des réglages
   - Aperçu en temps réel des changements

5. **Page d'Historique (`/history`)**
   - Liste des passages générés précédemment
   - Informations sur chaque passage (date, grade, durée, nombre de techniques)
   - Option de réexporter un passage précédent
   - Option de régénérer un passage similaire
   - Filtrage/recherche dans l'historique

6. **Écran de Fin de Passage**
   - Message de félicitations/completion
   - Résumé du passage (nombre de techniques, durée)
   - Bouton "Exporter" bien visible
   - Option de générer un nouveau passage
   - Retour à l'accueil

## Accessibility: WCAG AA

L'application doit respecter les standards WCAG AA pour l'accessibilité :

- **Contraste des couleurs :** Ratio minimum de 4.5:1 pour le texte normal, 3:1 pour le texte large
- **Navigation au clavier :** Tous les éléments interactifs accessibles au clavier
- **Lecteurs d'écran :** Support basique des lecteurs d'écran pour les éléments critiques
- **Zones tactiles :** Minimum 44x44 pixels pour les éléments interactifs sur mobile
- **Alternatives textuelles :** Textes alternatifs pour les éléments non-textuels importants
- **Focus visible :** Indicateurs de focus clairs pour la navigation au clavier

**Note :** WCAG AAA n'est pas requis pour le MVP, mais WCAG AA est nécessaire pour garantir une accessibilité de base, surtout pour une application utilisée pendant l'entraînement physique où la visibilité peut varier.

## Branding

**Nom de l'application :** Keiko Hub

**Style général :**
- Design épuré et minimaliste, inspiré de l'esthétique japonaise (simplicité, élégance)
- Logo fourni dans le code source (à intégrer dans l'interface)
- Couleurs personnalisables par l'utilisateur (bannière, footer)
- Typographie claire et lisible (sans-serif moderne pour la lisibilité)

**Éléments de style :**
- Transitions fluides et douces (inspirées des mouvements Aïkido)
- Animations subtiles et non distrayantes
- Espacement généreux pour la clarté visuelle
- Hiérarchie visuelle claire (éléments importants en grand, secondaires plus petits)

**Thèmes :**
- Thème clair : Fond clair, texte sombre, couleurs douces
- Thème sombre : Fond sombre, texte clair, couleurs moins saturées
- Transition fluide entre les thèmes

**Note :** Le branding est minimal mais cohérent avec le nom "Keiko Hub" et le logo fourni. L'utilisateur peut personnaliser les couleurs pour s'approprier l'application tout en conservant l'identité de base.

## Target Device and Platforms: Web Responsive

L'application est conçue pour être **Web Responsive**, fonctionnant de manière optimale sur :

- **Mobile (téléphone) :** Interface optimisée pour utilisation debout pendant l'entraînement
  - Grandes zones tactiles
  - Texte lisible même à distance
  - Interface épurée
  - Support portrait et landscape

- **Tablette :** Expérience optimisée pour mode landscape
  - Détection automatique de l'orientation
  - Layout adapté pour écran plus large
  - Meilleure utilisation de l'espace disponible

- **Desktop :** Fonctionnalité complète avec avantages supplémentaires
  - Raccourcis clavier
  - Plus d'espace pour l'historique et les contrôles
  - Meilleure expérience de configuration

**Priorité de design :** Mobile-first, avec améliorations progressives pour tablette et desktop.

**Compatibilité :**
- Navigateurs modernes (Chrome, Firefox, Safari, Edge - dernières versions)
- Support des APIs navigateur modernes (Fullscreen, Orientation, etc.)
- Fallbacks gracieux pour les fonctionnalités non supportées

---
