# Application Web d'Entraînement aux Passages de Grade Aïkido - Product Requirements Document (PRD)

**Version:** 1.0  
**Date:** 2024-12-19  
**Auteur:** Product Manager (John)

---

## Goals and Background Context

### Goals

- Permettre aux Aïkidoka de s'entraîner seuls pour leurs passages de grade avec une simulation réaliste d'examen
- Fournir une application web gratuite et accessible depuis n'importe quel navigateur
- Simuler fidèlement l'expérience d'un passage de grade réel avec annonces audio dans l'ordre traditionnel strict
- Offrir une personnalisation complète permettant des entraînements ciblés (techniques spécifiques, durées courtes)
- Créer une interface intuitive et épurée optimisée pour l'utilisation mobile pendant l'entraînement
- Générer des passages de grade aléatoires respectant la structure traditionnelle (Suwariwaza → Hanmi Handachi → Tashiwaza → Armes → Randori)
- Permettre l'export des passages générés pour révision et partage
- Offrir une expérience personnalisable (thèmes, couleurs, voix) adaptée aux préférences individuelles

### Background Context

Les Aïkidoka préparant un passage de grade font face à un défi majeur : l'absence d'outil numérique gratuit qui simule fidèlement l'expérience d'un examen réel. Les solutions existantes sont soit statiques (listes papier/PDF), soit payantes, et aucune ne combine audio, ordre traditionnel correct, et personnalisation avancée.

Cette application répond à ce besoin en offrant une simulation complète d'un passage de grade avec annonces audio, génération aléatoire respectant l'ordre strict traditionnel, et configuration flexible permettant des entraînements adaptés (de sessions complètes à entraînements ultra-ciblés de 2-3 minutes sur une technique spécifique).

L'application fonctionne entièrement côté client (budget zéro), utilise Angular pour une expérience réactive, et s'héberge gratuitement sur GitHub Pages, la rendant accessible à tous les Aïkidoka sans barrière financière.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2024-12-19 | 1.0 | Création initiale du PRD | John (PM) |
| 2024-12-19 | 1.1 | Validation architecture - Architecture technique validée et alignée avec le PRD | John (PM) |

---

## Requirements

### Functional

1. FR1: L'application doit permettre à l'utilisateur de sélectionner un grade parmi les options disponibles (6e Kyū à 5e Dan) pour générer un passage de grade approprié.

2. FR2: L'application doit générer aléatoirement une séquence de techniques selon le grade sélectionné, en respectant l'ordre strict traditionnel : Suwariwaza → Hanmi Handachi Waza → Tashiwaza → Armes → Randori.

3. FR3: L'application doit gérer les conditions spécifiques selon le grade (ex: Bokken uniquement à partir du 3e Dan) lors de la génération du passage.

4. FR4: L'application doit permettre à l'utilisateur de configurer le temps entre chaque technique annoncée.

5. FR5: L'utilisateur doit pouvoir configurer la durée totale du passage de grade.

6. FR6: L'application doit permettre la sélection du type de voix (masculin ou féminin) pour les annonces audio.

7. FR7: L'application doit permettre le filtrage par position (Suwariwaza, Hanmi Handachi, Tashiwaza, Armes, Randori) lors de la génération.

8. FR8: L'application doit permettre le filtrage par type d'attaque (ex: seulement Shomen Uchi) lors de la génération.

9. FR9: L'application doit permettre le filtrage par technique spécifique lors de la génération.

10. FR10: L'application doit afficher un timer visible indiquant le temps écoulé depuis le début du passage.

11. FR11: L'application doit afficher un compte à rebours visuel avant l'annonce de la prochaine technique.

12. FR12: L'application doit afficher l'attaque et la technique en cours en grand et de manière lisible.

13. FR13: L'application doit maintenir et afficher un historique de toutes les techniques énoncées au fur et à mesure du passage.

14. FR14: L'application doit afficher un indicateur de progression "Technique X sur Y total" pendant le passage.

15. FR15: L'application doit afficher une barre de progression visuelle indiquant l'avancement du passage.

16. FR16: L'application doit fournir un bouton pour mettre en pause le passage en cours.

17. FR17: L'application doit fournir un bouton pour reprendre un passage mis en pause.

18. FR18: L'application doit fournir un bouton pour répéter la dernière technique annoncée ou la technique en cours.

19. FR19: L'application doit permettre d'activer le mode plein écran pendant le passage pour éliminer les distractions.

20. FR20: L'application doit supporter le raccourci clavier Espace pour mettre en pause/reprendre le passage.

21. FR21: L'application doit supporter le raccourci clavier R pour répéter la dernière technique.

22. FR22: L'application doit charger et utiliser les fichiers audio pré-enregistrés intégrés dans les assets/ pour annoncer les techniques et attaques.

23. FR23: L'application doit supporter l'option d'utiliser l'API Elevenlabs (avec clé API) pour la synthèse vocale en alternative aux audios pré-enregistrés.

24. FR24: L'application doit annoncer audio chaque technique et attaque dans l'ordre généré.

25. FR25: L'application doit permettre l'export du passage généré au format fichier texte (.txt).

26. FR26: L'export .txt doit inclure la liste complète des techniques énumérées pendant le passage.

27. FR27: L'export .txt doit inclure les liens vidéo associés à chaque technique (selon le fichier videos.json).

28. FR28: L'application doit permettre à l'utilisateur de sélectionner le thème (clair ou sombre).

29. FR29: L'application doit permettre la personnalisation des couleurs de la bannière.

30. FR30: L'application doit permettre la personnalisation des couleurs du footer.

31. FR31: L'application doit sauvegarder les réglages utilisateur (voix, thème, couleurs) dans le localStorage du navigateur.

32. FR32: L'application doit charger automatiquement les réglages sauvegardés depuis le localStorage au démarrage.

33. FR33: L'application doit charger les fichiers JSON (nomenclature.json et videos.json) depuis le dossier assets/ au démarrage.

34. FR34: L'application doit parser et structurer les données JSON pour permettre la génération de passages.

35. FR35: L'application doit s'adapter de manière responsive aux différentes tailles d'écran (mobile, tablette, desktop).

36. FR36: L'application doit détecter automatiquement l'orientation de l'appareil (portrait/landscape).

37. FR37: L'application doit optimiser l'interface pour les tablettes en mode landscape.

38. FR38: L'application doit afficher une page d'accueil avec un gros bouton "Démarrer" pour un accès rapide.

39. FR39: L'application doit fournir une page de configuration permettant de paramétrer tous les filtres et options avant de générer un passage.

40. FR40: L'application doit fournir une page de passage dédiée affichant tous les éléments visuels nécessaires pendant l'exécution.

41. FR41: L'application doit fournir une page de réglages permettant de modifier les préférences (thème, couleurs, voix).

42. FR42: L'application doit afficher un message de fin de passage lorsque toutes les techniques ont été énoncées.

43. FR43: L'application doit permettre l'export du passage immédiatement après la fin du passage.

44. FR44: L'application doit gérer les transitions visuelles fluides entre les différentes techniques annoncées.

45. FR45: L'application doit animer le compte à rebours de manière visuelle et claire.

46. FR46: L'application doit animer la barre de progression de manière fluide lors de l'avancement.

47. FR47: L'application doit gérer les erreurs de chargement des fichiers JSON et afficher un message d'erreur approprié.

48. FR48: L'application doit gérer les erreurs de chargement/lecture audio et fournir un fallback approprié.

49. FR49: L'application doit permettre à l'utilisateur de quitter le mode plein écran à tout moment.

50. FR50: L'application doit afficher l'état du passage (en cours, en pause, terminé) de manière claire.

### Non Functional

1. NFR1: L'application doit charger initialement en moins de 2 secondes sur une connexion internet standard.

2. NFR2: L'application doit maintenir un taux de 60 FPS pour toutes les animations et transitions.

3. NFR3: L'application doit fonctionner sur les navigateurs modernes (Chrome, Firefox, Safari, Edge - dernières versions).

4. NFR4: L'application doit être entièrement fonctionnelle côté client sans nécessiter de backend.

5. NFR5: L'application doit utiliser uniquement des technologies gratuites/open-source (budget zéro).

6. NFR6: L'application doit être hébergeable gratuitement sur GitHub Pages.

7. NFR7: L'application doit être responsive et fonctionnelle sur mobile (téléphone), tablette et desktop.

8. NFR8: L'application doit utiliser Angular comme framework frontend obligatoire.

9. NFR9: L'application doit utiliser RxJS avec BehaviorSubject pour la gestion d'état réactive.

10. NFR10: L'application doit utiliser localStorage pour la persistance des données utilisateur (pas de base de données).

11. NFR11: L'application doit charger les fichiers JSON de manière asynchrone sans bloquer l'interface utilisateur.

12. NFR12: L'application doit gérer les fichiers JSON volumineux (tous les grades) de manière efficace sans impact sur les performances.

13. NFR13: L'application doit être accessible via HTTPS lorsqu'hébergée sur GitHub Pages.

14. NFR14: L'application ne doit pas collecter de données personnelles des utilisateurs.

15. NFR15: L'application doit être compatible avec les APIs navigateur modernes (Fullscreen API, Web Speech API si utilisé, Orientation API).

16. NFR16: L'application doit gérer gracieusement les cas où certaines APIs navigateur ne sont pas supportées (fallbacks).

17. NFR17: L'application doit utiliser Angular Animations pour toutes les animations (pas de bibliothèque externe).

18. NFR18: L'application doit être optimisée pour une utilisation mobile pendant l'entraînement physique (grandes zones tactiles, interface épurée).

19. NFR19: L'application doit maintenir la synchronisation audio-visuelle entre les annonces et l'affichage des techniques.

20. NFR20: L'application doit être maintenable avec une structure de code claire et modulaire (services Angular, composants).

21. NFR21: L'application doit être testable avec des tests unitaires pour les services de logique métier.

22. NFR22: L'application doit être déployable via GitHub Actions ou processus Git simple vers GitHub Pages.

23. NFR23: L'application doit supporter les thèmes clair/sombre avec transition fluide entre les deux.

24. NFR24: L'application doit permettre la personnalisation des couleurs sans nécessiter de rechargement de page.

25. NFR25: L'application doit être utilisable sans connexion internet après le chargement initial (pour la lecture des passages générés, mais pas pour le chargement initial des JSON).

---

## User Interface Design Goals

### Overall UX Vision

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

### Key Interaction Paradigms

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

### Core Screens and Views

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

### Accessibility: WCAG AA

L'application doit respecter les standards WCAG AA pour l'accessibilité :

- **Contraste des couleurs :** Ratio minimum de 4.5:1 pour le texte normal, 3:1 pour le texte large
- **Navigation au clavier :** Tous les éléments interactifs accessibles au clavier
- **Lecteurs d'écran :** Support basique des lecteurs d'écran pour les éléments critiques
- **Zones tactiles :** Minimum 44x44 pixels pour les éléments interactifs sur mobile
- **Alternatives textuelles :** Textes alternatifs pour les éléments non-textuels importants
- **Focus visible :** Indicateurs de focus clairs pour la navigation au clavier

**Note :** WCAG AAA n'est pas requis pour le MVP, mais WCAG AA est nécessaire pour garantir une accessibilité de base, surtout pour une application utilisée pendant l'entraînement physique où la visibilité peut varier.

### Branding

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

### Target Device and Platforms: Web Responsive

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

## Technical Assumptions

### Repository Structure: Monorepo

L'application utilise une structure **Monorepo** standard Angular :

- Un seul dépôt Git contenant tout le code source
- Structure Angular standard avec `src/` comme dossier principal
- Fichiers JSON et audios dans `src/assets/`
- Configuration Angular dans la racine du projet
- Pas de sous-projets ou modules séparés nécessaires pour le MVP

**Rationale :** Structure simple et standard pour une application SPA, facilitant le développement, le déploiement sur GitHub Pages, et la maintenance.

### Service Architecture

**Architecture :** Application SPA (Single Page Application) monolithique côté client, sans backend.

**Services Angular prévus :**
- **GradeService :** Chargement et parsing des fichiers JSON (nomenclature.json, videos.json), gestion de la logique de génération de passages
- **PassageService :** Gestion de l'état du passage en cours (techniques, timer, progression), logique de génération aléatoire
- **AudioService :** Gestion de la lecture audio (audios locaux et option Elevenlabs), contrôle de la lecture, pause, répétition
- **SettingsService :** Gestion des réglages utilisateur (thème, couleurs, voix), persistance dans localStorage
- **ExportService :** Génération du fichier .txt avec les techniques et liens vidéo

**Communication :** RxJS BehaviorSubject pour la communication réactive entre composants et services.

**Rationale :** Architecture simple et modulaire avec services Angular, permettant une séparation claire des responsabilités tout en restant dans une SPA monolithique. Pas de microservices nécessaires pour cette application côté client.

### Testing Requirements

**Approche :** Tests unitaires pour les services de logique métier.

**Couverture de test :**
- **Services critiques :** GradeService (génération de passages, parsing JSON), PassageService (logique de génération, gestion d'état), AudioService (gestion audio)
- **Logique métier :** Algorithme de génération aléatoire, respect de l'ordre strict, gestion des conditions (ex: Bokken à partir du 3e Dan)
- **Utilitaires :** Parsing JSON, génération d'export

**Non testé pour MVP :**
- Tests E2E (non nécessaires pour MVP)
- Tests d'intégration complets (tests unitaires suffisants)
- Tests manuels de l'interface (validation manuelle acceptée)

**Rationale :** Focus sur les tests unitaires des services critiques pour garantir la fiabilité de la logique métier (génération de passages, gestion audio). Les tests E2E et d'intégration peuvent être ajoutés post-MVP si nécessaire.

### Additional Technical Assumptions and Requests

1. **Framework et versions :**
   - Angular (version LTS recommandée, minimum Angular 15+)
   - RxJS (inclus avec Angular)
   - TypeScript (version compatible avec Angular)

2. **Gestion d'état :**
   - RxJS BehaviorSubject pour l'état réactif
   - Pas de NgRx (trop complexe pour cette application)
   - Services Angular comme source de vérité

3. **Données :**
   - Fichiers JSON statiques dans `src/assets/data/`
   - Fichiers audio dans `src/assets/audio/`
   - Logo dans `src/assets/images/` ou similaire
   - Chargement asynchrone via HttpClient Angular

4. **Routing :**
   - Angular Router pour navigation multi-pages
   - Routes : `/` (accueil), `/config` (configuration), `/passage` (passage en cours), `/settings` (réglages), `/history` (historique)
   - Lazy loading optionnel pour optimiser le chargement initial

5. **Styling :**
   - CSS/SCSS standard (pas de framework CSS externe requis, mais possible si souhaité)
   - CSS Variables pour les thèmes et couleurs personnalisables
   - Angular Animations pour toutes les animations

6. **APIs externes :**
   - Elevenlabs API (optionnelle, avec clé API fournie par l'utilisateur)
   - Gestion des erreurs API avec fallback vers audios locaux

7. **APIs navigateur :**
   - Fullscreen API (mode plein écran)
   - Orientation API (détection landscape/portrait)
   - Web Speech API (non utilisé, on utilise audios locaux ou Elevenlabs)
   - localStorage API (persistance des réglages)

8. **Déploiement :**
   - GitHub Pages (hébergement statique)
   - Build Angular (`ng build`) avec output dans `docs/` ou `dist/`
   - Configuration GitHub Pages pour servir depuis le dossier de build
   - Pas de CI/CD complexe nécessaire pour MVP (déploiement manuel acceptable)

9. **Performance :**
   - Optimisation du bundle Angular (tree-shaking, lazy loading si nécessaire)
   - Compression des fichiers JSON si volumineux
   - Optimisation des fichiers audio (formats compressés)

10. **Sécurité :**
    - Pas de données sensibles côté client
    - Clé API Elevenlabs stockée côté client (à documenter comme limitation)
    - Pas de backend = pas de risques de sécurité serveur
    - Validation des données JSON côté client

11. **Compatibilité :**
    - Support des navigateurs modernes (dernières versions)
    - Détection de support des APIs navigateur avec fallbacks
    - Polyfills si nécessaire pour compatibilité

12. **Structure des fichiers JSON :**
    - `nomenclature.json` : Structure hiérarchique Grade → Position → Attaque → Technique
    - `videos.json` : Clés "attaque-technique" avec valeurs URLs vidéo
    - Format JSON standard, validation côté client

13. **Gestion de l'historique :**
    - Stockage dans localStorage (limité par la taille du localStorage)
    - Format de stockage à définir (JSON stringifié)
    - Limite de passages historiques à définir (ex: 50 derniers passages)

14. **Export :**
    - Génération côté client (pas de bibliothèque externe nécessaire pour .txt)
    - Format texte simple avec liens vidéo
    - Téléchargement via Blob API du navigateur

---

## Epic List

1. **Epic 1: Foundation & Project Setup** - Établir la structure de base du projet Angular, les services fondamentaux, le routing, et la page d'accueil avec le bouton "Démarrer" pour permettre un démarrage rapide de l'application.

2. **Epic 2: Data Management & Configuration** - Implémenter le chargement et le parsing des fichiers JSON (nomenclature et vidéos), créer le service GradeService, et développer la page de configuration complète permettant la sélection du grade et tous les filtres.

3. **Epic 3: Passage Generation & Core Execution** - Développer l'algorithme de génération aléatoire de passages respectant l'ordre strict, créer le PassageService, et implémenter la page de passage avec timer, compte à rebours, affichage des techniques, historique et barre de progression.

4. **Epic 4: Audio System & User Controls** - Intégrer le système audio (audios locaux et option Elevenlabs), créer l'AudioService, implémenter les contrôles utilisateur (pause, répéter, plein écran), et ajouter les raccourcis clavier.

5. **Epic 5: Personalization & Export** - Développer le système de thèmes et couleurs personnalisables, créer le SettingsService avec persistance localStorage, implémenter la page de réglages, et créer la fonctionnalité d'export .txt avec liens vidéo.

6. **Epic 6: History & Final Polish** - Implémenter la page d'historique des passages avec stockage localStorage, ajouter les animations et transitions fluides, optimiser le responsive design et la détection d'orientation, et finaliser toutes les optimisations de performance et UX.

---

## Epic 1: Foundation & Project Setup

**Objectif étendu :** Établir les fondations techniques de l'application Keiko Hub en configurant le projet Angular, la structure de base, le routing multi-pages, et les services fondamentaux. Cet epic délivre une application fonctionnelle avec une page d'accueil permettant de naviguer vers les différentes sections, établissant ainsi l'infrastructure nécessaire pour tous les epics suivants tout en fournissant une valeur immédiate à l'utilisateur.

### Story 1.1: Project Initialization and Basic Structure

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

### Story 1.2: Routing Setup and Navigation

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

### Story 1.3: Home Page with Quick Start Button

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

### Story 1.4: Core Services Structure

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

### Story 1.5: Settings Service with LocalStorage

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

### Story 1.6: Theme System Implementation

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

## Epic 2: Data Management & Configuration

**Objectif étendu :** Implémenter la gestion complète des données (chargement et parsing des fichiers JSON), créer le GradeService pour gérer la logique des grades et la nomenclature, et développer la page de configuration complète permettant à l'utilisateur de sélectionner le grade et tous les filtres nécessaires avant de générer un passage. Cet epic établit les fondations de données essentielles pour la génération de passages.

### Story 2.1: JSON Data Loading Service

As a developer,
I want charger les fichiers JSON (nomenclature.json et videos.json) depuis les assets,
so que l'application peut accéder aux données des grades et des vidéos.

**Acceptance Criteria:**

1. Le `GradeService` est créé avec une méthode pour charger `nomenclature.json` depuis `src/assets/data/`
2. Le service charge `videos.json` depuis `src/assets/data/` (ou le même dossier)
3. Le chargement utilise HttpClient Angular de manière asynchrone
4. Les fichiers JSON sont chargés une seule fois au démarrage de l'application (singleton pattern)
5. Les données chargées sont mises en cache dans le service
6. Les erreurs de chargement sont gérées gracieusement avec des messages d'erreur appropriés
7. Un indicateur de chargement est affiché pendant le chargement des données
8. Le service expose des observables RxJS pour notifier lorsque les données sont prêtes

### Story 2.2: JSON Parsing and Data Structure

As a developer,
I want parser et structurer les données JSON chargées,
so que je peux accéder facilement aux grades, positions, attaques et techniques.

**Acceptance Criteria:**

1. Le `GradeService` parse le fichier `nomenclature.json` et crée une structure de données TypeScript typée
2. La structure de données représente la hiérarchie : Grade → Position → Attaque → Technique
3. Le service parse le fichier `videos.json` et crée une structure clé-valeur (attaque-technique → URL)
4. Des interfaces TypeScript sont définies pour typer toutes les structures de données
5. Le service expose des méthodes pour accéder aux données par grade, position, attaque, technique
6. Le service peut filtrer les données selon différents critères (grade, position, etc.)
7. La validation des données JSON est effectuée (structure attendue, types corrects)
8. Les erreurs de parsing sont gérées et rapportées clairement

### Story 2.3: Grade Selection Interface

As a user,
I want sélectionner le grade pour lequel je veux m'entraîner,
so que l'application génère un passage approprié à mon niveau.

**Acceptance Criteria:**

1. La page de configuration (`/config`) affiche une section pour la sélection du grade
2. Les grades disponibles (6e Kyū à 5e Dan) sont affichés sous forme de liste déroulante, cartes visuelles ou boutons
3. La sélection du grade est sauvegardée dans le service ou le composant
4. Le grade sélectionné est validé (doit être dans la liste des grades disponibles)
5. Un grade par défaut est sélectionné si aucun n'est choisi (ex: 6e Kyū)
6. L'interface est claire et intuitive pour la sélection
7. Le design est responsive et fonctionne sur mobile et desktop

### Story 2.4: Time Configuration Controls

As a user,
I want configurer le temps entre chaque technique et la durée totale du passage,
so que je peux adapter le rythme de l'entraînement à mes besoins.

**Acceptance Criteria:**

1. La page de configuration affiche des contrôles pour configurer le temps entre techniques (en secondes)
2. Des contrôles pour configurer la durée totale du passage sont disponibles (en minutes)
3. Les contrôles utilisent des sliders ou des inputs numériques avec validation
4. Des valeurs par défaut sensées sont proposées (ex: 5 secondes entre techniques, 10 minutes total)
5. Les valeurs sont validées (minimum/maximum raisonnables)
6. Les valeurs configurées sont sauvegardées dans le composant ou service
7. Un aperçu ou indication visuelle montre l'impact des réglages

### Story 2.5: Voice Selection Interface

As a user,
I want choisir le type de voix (masculin ou féminin) pour les annonces,
so que je peux personnaliser l'expérience audio selon mes préférences.

**Acceptance Criteria:**

1. La page de configuration affiche une section pour la sélection de la voix
2. Deux options sont disponibles : "Masculin" et "Féminin" (boutons radio ou toggle)
3. La sélection est sauvegardée dans le SettingsService
4. La valeur par défaut est "Masculin" si aucune préférence n'est sauvegardée
5. La sélection est persistée dans localStorage via le SettingsService
6. L'interface est claire et intuitive

### Story 2.6: Position Filtering Interface

As a user,
I want filtrer par position (Suwariwaza, Hanmi Handachi, Tashiwaza, Armes, Randori),
so que je peux me concentrer sur certaines catégories de techniques.

**Acceptance Criteria:**

1. La page de configuration affiche des filtres pour les positions disponibles
2. Chaque position peut être incluse ou excluse via des checkboxes ou toggles
3. Par défaut, toutes les positions sont incluses
4. Les filtres sont sauvegardés dans le composant ou service
5. L'interface permet de sélectionner/désélectionner toutes les positions rapidement
6. Les filtres sont clairement étiquetés et organisés

### Story 2.7: Attack and Technique Filtering Interface

As a user,
I want filtrer par type d'attaque ou technique spécifique,
so que je peux créer des entraînements ultra-ciblés (ex: seulement Shomen Uchi).

**Acceptance Criteria:**

1. La page de configuration affiche des filtres pour les attaques disponibles (basés sur le grade sélectionné)
2. Des filtres pour les techniques spécifiques sont disponibles
3. Les filtres utilisent des listes avec recherche ou sélection multiple
4. Les options de filtrage sont dynamiques selon le grade sélectionné
5. Les filtres permettent de sélectionner plusieurs attaques/techniques
6. Un indicateur montre combien d'attaques/techniques sont sélectionnées
7. Les filtres sont sauvegardés et appliqués lors de la génération

### Story 2.8: Weapons and Randori Configuration

As a user,
I want inclure ou exclure les armes et le Randori dans le passage,
so que je peux adapter le passage selon mes besoins d'entraînement.

**Acceptance Criteria:**

1. La page de configuration affiche des options pour inclure/exclure les armes
2. Une option pour inclure/exclure le Randori est disponible
3. Les options sont des toggles ou checkboxes clairs
4. Les armes sont automatiquement exclues si le grade ne les inclut pas (ex: Bokken à partir du 3e Dan)
5. Les options sont sauvegardées et appliquées lors de la génération
6. L'interface indique clairement quelles options sont disponibles selon le grade

### Story 2.9: Configuration Page Complete Integration

As a user,
I want voir toutes les options de configuration sur une seule page organisée,
so que je peux configurer mon passage de manière complète avant de le générer.

**Acceptance Criteria:**

1. La page de configuration (`/config`) intègre toutes les sections précédentes de manière organisée
2. Les sections sont logiquement groupées (Grade, Timing, Audio, Filtres)
3. Un bouton "Générer le passage" bien visible est présent en bas de la page
4. Le bouton génère le passage et redirige vers `/passage` avec la configuration
5. La configuration est validée avant la génération (grade sélectionné, au moins une position incluse)
6. Des messages d'erreur clairs sont affichés si la configuration est invalide
7. La page est responsive et fonctionne sur tous les appareils
8. Le design est cohérent avec le reste de l'application (thème, style)

---

## Epic 3: Passage Generation & Core Execution

**Objectif étendu :** Développer le cœur fonctionnel de l'application en créant l'algorithme de génération aléatoire de passages respectant l'ordre strict traditionnel (Suwariwaza → Hanmi Handachi → Tashiwaza → Armes → Randori), implémenter le PassageService pour gérer l'état et la logique des passages, et créer la page de passage complète avec tous les éléments visuels nécessaires (timer, compte à rebours, affichage des techniques, historique, progression). Cet epic délivre la fonctionnalité principale permettant à l'utilisateur de s'entraîner avec des passages de grade générés.

### Story 3.1: Passage Generation Algorithm

As a developer,
I want un algorithme qui génère aléatoirement une séquence de techniques selon le grade et les filtres,
so que l'application peut créer des passages variés et réalistes.

**Acceptance Criteria:**

1. Le `PassageService` contient une méthode de génération de passage qui prend en paramètres : grade, filtres (positions, attaques, techniques), configuration (armes, Randori)
2. L'algorithme respecte l'ordre strict : Suwariwaza → Hanmi Handachi → Tashiwaza → Armes → Randori
3. La génération est aléatoire mais respecte les contraintes (grade, filtres, conditions comme Bokken à partir du 3e Dan)
4. Chaque technique générée inclut : l'attaque, la technique, la position, et l'ordre dans la séquence
5. L'algorithme gère les cas où aucun filtre ne correspond (message d'erreur approprié)
6. La génération est déterministe en termes de structure mais aléatoire en termes de sélection
7. Les techniques sont uniques dans le passage (pas de doublons)
8. Le service expose la séquence générée via un observable RxJS

### Story 3.2: Passage State Management

As a developer,
I want gérer l'état du passage en cours (techniques, progression, timer),
so que l'application peut suivre l'avancement et contrôler l'exécution.

**Acceptance Criteria:**

1. Le `PassageService` maintient l'état du passage en cours (liste de techniques, index actuel, état pause/play)
2. Le service utilise RxJS BehaviorSubject pour exposer l'état de manière réactive
3. L'état inclut : techniques générées, technique actuelle, index, temps écoulé, état (en cours, en pause, terminé)
4. Le service expose des méthodes pour : démarrer, mettre en pause, reprendre, passer à la technique suivante
5. Le service calcule automatiquement le nombre total de techniques
6. Le service gère la transition entre techniques selon le temps configuré
7. L'état est accessible depuis n'importe quel composant via injection du service

### Story 3.3: Passage Page Layout and Timer

As a user,
I want voir une page dédiée au passage avec un timer visible,
so que je peux suivre le temps écoulé pendant mon entraînement.

**Acceptance Criteria:**

1. La page de passage (`/passage`) est créée avec un layout épuré et centré
2. Un timer visible en haut de la page affiche le temps écoulé depuis le début (format MM:SS)
3. Le timer se met à jour en temps réel (toutes les secondes)
4. Le timer est bien visible et lisible (grande taille de police, contraste approprié)
5. Le timer s'arrête quand le passage est en pause
6. Le timer reprend quand le passage est repris
7. Le design est optimisé pour être visible à distance (utilisation mobile debout)

### Story 3.4: Countdown Visual Display

As a user,
I want voir un compte à rebours visuel avant chaque technique,
so que je peux me préparer à l'exécution de la prochaine technique.

**Acceptance Criteria:**

1. Un compte à rebours visuel est affiché avant l'annonce de chaque technique
2. Le compte à rebours utilise un cercle animé, une barre, ou un affichage numérique
3. Le compte à rebours démarre au temps configuré entre techniques et descend jusqu'à zéro
4. L'animation est fluide et visuellement claire
5. Le compte à rebours est bien visible et centré
6. Quand le compte à rebours atteint zéro, la prochaine technique est annoncée
7. Le compte à rebours utilise Angular Animations pour une animation fluide

### Story 3.5: Current Technique Display

As a user,
I want voir l'attaque et la technique en cours affichées en grand,
so que je peux facilement lire ce que je dois exécuter même à distance.

**Acceptance Criteria:**

1. L'attaque et la technique en cours sont affichées de manière très visible au centre de l'écran
2. Le texte est très grand (minimum 48px sur mobile, plus grand sur desktop)
3. L'attaque et la technique sont clairement séparées visuellement
4. Le contraste est élevé pour une lisibilité maximale
5. L'affichage se met à jour automatiquement quand une nouvelle technique est annoncée
6. La transition entre techniques est fluide (fade in/out ou slide)
7. Le design est épuré sans distractions autour du texte principal

### Story 3.6: Technique History Display

As a user,
I want voir l'historique de toutes les techniques énoncées,
so que je peux me rappeler ce qui a déjà été fait.

**Acceptance Criteria:**

1. Un historique des techniques est affiché sur la page de passage
2. L'historique montre toutes les techniques déjà énoncées dans l'ordre
3. L'historique est affiché sous forme de liste déroulante, sidebar, ou section scrollable
4. Chaque entrée de l'historique montre : l'attaque, la technique, et la position
5. L'historique se met à jour automatiquement quand une nouvelle technique est annoncée
6. L'historique est visible mais non intrusif (ne distrait pas de la technique en cours)
7. Sur mobile, l'historique peut être masqué/affiché via un bouton

### Story 3.7: Progress Indicator

As a user,
I want voir ma progression dans le passage (Technique X sur Y),
so que je peux savoir où j'en suis dans l'entraînement.

**Acceptance Criteria:**

1. Un indicateur "Technique X sur Y total" est affiché sur la page de passage
2. L'indicateur se met à jour automatiquement à chaque nouvelle technique
3. L'indicateur est bien visible mais non intrusif
4. Le format est clair et lisible (ex: "3 / 15")
5. Une barre de progression visuelle est également affichée
6. La barre de progression se remplit progressivement (X/Y * 100%)
7. La barre de progression est animée de manière fluide lors des mises à jour

### Story 3.8: Passage Completion and End Screen

As a user,
I want voir un message de fin quand le passage est terminé,
so que je sais que l'entraînement est complet.

**Acceptance Criteria:**

1. Quand toutes les techniques ont été énoncées, un écran de fin s'affiche
2. L'écran de fin affiche un message de félicitations/completion
3. Un résumé du passage est affiché (nombre de techniques, durée totale)
4. Un bouton "Exporter" est disponible pour exporter le passage
5. Un bouton "Nouveau passage" permet de générer un nouveau passage
6. Un bouton "Retour à l'accueil" permet de revenir à la page d'accueil
7. L'écran de fin est clair et encourageant

---

## Epic 4: Audio System & User Controls

**Objectif étendu :** Intégrer le système audio complet permettant l'annonce des techniques et attaques via audios pré-enregistrés ou l'API Elevenlabs, créer l'AudioService pour gérer toute la logique audio, et implémenter tous les contrôles utilisateur (pause, répéter, plein écran, raccourcis clavier) pour offrir une expérience d'entraînement complète et contrôlable.

### Story 4.1: Audio Service with Local Audio Files

As a developer,
I want un service qui gère la lecture des fichiers audio pré-enregistrés,
so que l'application peut annoncer les techniques et attaques avec des audios locaux.

**Acceptance Criteria:**

1. L'`AudioService` est créé avec la gestion de la lecture audio
2. Le service charge les fichiers audio depuis `src/assets/audio/` selon le nom de la technique/attaque
3. Le service peut jouer un audio pour une technique et une attaque données
4. Le service gère la file d'attente des audios à jouer
5. Le service expose des méthodes pour : jouer, mettre en pause, arrêter, répéter
6. Le service gère les erreurs de chargement audio gracieusement (fichier manquant, format non supporté)
7. Le service notifie les composants via observables RxJS quand un audio est terminé
8. Le service supporte la sélection de voix (masculin/féminin) en chargeant les bons fichiers audio

### Story 4.2: Elevenlabs API Integration (Optional)

As a user,
I want pouvoir utiliser l'API Elevenlabs pour la synthèse vocale,
so que je peux avoir une alternative aux audios pré-enregistrés si je préfère.

**Acceptance Criteria:**

1. L'`AudioService` supporte l'option d'utiliser l'API Elevenlabs
2. La clé API Elevenlabs peut être configurée (dans les réglages ou environnement)
3. Le service peut générer de l'audio via l'API Elevenlabs pour une technique/attaque donnée
4. Le service utilise l'API Elevenlabs comme fallback si les audios locaux ne sont pas disponibles
5. Les erreurs API sont gérées gracieusement avec fallback vers audios locaux
6. L'utilisation de l'API est optionnelle et peut être désactivée
7. Le service cache les audios générés pour éviter les appels API répétés

### Story 4.3: Audio Playback During Passage

As a user,
I want entendre l'annonce audio de chaque technique et attaque pendant le passage,
so que l'expérience simule fidèlement un vrai passage de grade.

**Acceptance Criteria:**

1. Pendant le passage, chaque technique est annoncée audio au moment approprié
2. L'annonce audio se synchronise avec l'affichage visuel de la technique
3. L'audio joue après le compte à rebours (ou pendant selon le design)
4. L'audio est clair et compréhensible
5. Le volume audio est approprié (configurable via les réglages système)
6. L'audio ne se chevauche pas (un audio se termine avant que le suivant commence)
7. L'audio respecte la sélection de voix (masculin/féminin)

### Story 4.4: Pause and Resume Controls

As a user,
I want pouvoir mettre en pause et reprendre le passage,
so que je peux prendre une pause pendant l'entraînement si nécessaire.

**Acceptance Criteria:**

1. Un bouton "Pause" est visible sur la page de passage
2. Le bouton met en pause le passage (timer, audio, compte à rebours)
3. Quand en pause, le bouton change pour "Reprendre"
4. Le bouton "Reprendre" reprend le passage exactement où il s'est arrêté
5. L'état de pause est géré par le PassageService
6. Le raccourci clavier Espace fonctionne pour pause/reprendre
7. L'interface indique clairement l'état pause/play

### Story 4.5: Repeat Last Technique Control

As a user,
I want pouvoir répéter la dernière technique annoncée,
so que je peux réécouter si je n'ai pas bien compris.

**Acceptance Criteria:**

1. Un bouton "Répéter" est visible sur la page de passage
2. Le bouton répète l'annonce audio de la dernière technique (ou technique en cours)
3. Le bouton peut être utilisé même si le passage est en pause
4. Le raccourci clavier R fonctionne pour répéter
5. L'interface indique clairement quelle technique sera répétée
6. La répétition ne perturbe pas le flux du passage (ne remet pas en pause si en cours)

### Story 4.6: Fullscreen Mode Implementation

As a user,
I want pouvoir activer le mode plein écran pendant le passage,
so que je peux éliminer toutes les distractions et me concentrer sur l'entraînement.

**Acceptance Criteria:**

1. Un bouton ou icône permet d'activer le mode plein écran
2. Le mode plein écran utilise la Fullscreen API du navigateur
3. Tous les éléments de l'interface restent fonctionnels en plein écran
4. Un moyen de quitter le plein écran est disponible (bouton, raccourci Échap, ou geste)
5. Le mode plein écran fonctionne sur les navigateurs qui le supportent
6. Un fallback gracieux est fourni si le plein écran n'est pas supporté
7. L'état plein écran est géré et peut être restauré

### Story 4.7: Keyboard Shortcuts

As a user,
I want utiliser des raccourcis clavier pour contrôler le passage,
so que je peux interagir rapidement sans utiliser la souris.

**Acceptance Criteria:**

1. Le raccourci Espace met en pause/reprend le passage
2. Le raccourci R répète la dernière technique
3. Les raccourcis fonctionnent uniquement quand la page de passage est active
4. Les raccourcis ne sont pas interceptés par d'autres éléments de la page
5. Un indicateur visuel ou aide-mémoire montre les raccourcis disponibles (optionnel)
6. Les raccourcis fonctionnent même en mode plein écran

---

## Epic 5: Personalization & Export

**Objectif étendu :** Développer le système complet de personnalisation (thèmes, couleurs personnalisables), finaliser le SettingsService avec toute la persistance nécessaire, créer la page de réglages complète, et implémenter la fonctionnalité d'export .txt avec liens vidéo pour permettre aux utilisateurs de sauvegarder et partager leurs passages.

### Story 5.1: Settings Page Layout

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

### Story 5.2: Color Customization Interface

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

### Story 5.3: Theme Persistence and Application

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

### Story 5.4: Export Service Implementation

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

### Story 5.5: Export Functionality in UI

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

## Epic 6: History & Final Polish

**Objectif étendu :** Implémenter la page d'historique des passages avec stockage localStorage, ajouter toutes les animations et transitions fluides pour améliorer l'expérience utilisateur, optimiser le responsive design et la détection d'orientation pour une expérience optimale sur tous les appareils, et finaliser toutes les optimisations de performance et UX pour livrer une application complète et polie.

### Story 6.1: History Storage Service

As a developer,
I want un service qui stocke l'historique des passages dans localStorage,
so que l'application peut conserver les passages précédents pour référence.

**Acceptance Criteria:**

1. Le `PassageService` ou un nouveau `HistoryService` gère le stockage de l'historique
2. Chaque passage terminé est sauvegardé avec : date, grade, durée, nombre de techniques, liste des techniques
3. L'historique est stocké dans localStorage avec une limite de 50 passages
4. Quand la limite est atteinte, les passages les plus anciens sont supprimés (FIFO)
5. Le service peut récupérer l'historique complet ou filtré
6. Le service peut supprimer des passages de l'historique
7. Les erreurs de localStorage (quota dépassé) sont gérées gracieusement

### Story 6.2: History Page Implementation

As a user,
I want voir l'historique de mes passages précédents,
so que je peux revoir mes entraînements passés.

**Acceptance Criteria:**

1. La page d'historique (`/history`) est créée avec un layout clair
2. La page affiche la liste des passages précédents avec : date, grade, durée, nombre de techniques
3. Les passages sont triés par date (plus récents en premier)
4. Chaque passage peut être cliqué pour voir les détails
5. Un bouton permet de réexporter un passage précédent
6. Un bouton permet de générer un nouveau passage similaire (même grade, même configuration)
7. La page est responsive et fonctionne sur tous les appareils
8. Un message s'affiche si l'historique est vide

### Story 6.3: Animations and Transitions

As a user,
I want voir des animations fluides entre les techniques et les transitions de page,
so que l'expérience est agréable et professionnelle.

**Acceptance Criteria:**

1. Les transitions entre techniques utilisent Angular Animations (fade, slide, etc.)
2. Les transitions de page (routing) sont animées de manière fluide
3. Le compte à rebours utilise une animation visuelle claire (cercle, barre, etc.)
4. La barre de progression est animée lors des mises à jour
5. Les animations respectent les préférences de réduction de mouvement (accessibilité)
6. Toutes les animations maintiennent 60 FPS pour une expérience fluide
7. Les animations sont subtiles et non distrayantes

### Story 6.4: Responsive Design Optimization

As a user,
I want que l'application fonctionne parfaitement sur mobile, tablette et desktop,
so que je peux l'utiliser sur n'importe quel appareil.

**Acceptance Criteria:**

1. Toutes les pages sont optimisées pour mobile (grandes zones tactiles, texte lisible)
2. L'interface s'adapte aux différentes tailles d'écran (breakpoints appropriés)
3. Les tablettes bénéficient d'un layout optimisé (meilleure utilisation de l'espace)
4. Le desktop offre une expérience complète avec plus d'espace pour l'historique et les contrôles
5. Les media queries sont utilisées efficacement pour chaque breakpoint
6. Le design mobile-first est respecté
7. Tous les éléments sont accessibles et utilisables sur tous les appareils

### Story 6.5: Orientation Detection and Adaptation

As a user,
I want que l'application s'adapte automatiquement à l'orientation de mon appareil,
so que j'ai la meilleure expérience possible en mode portrait ou landscape.

**Acceptance Criteria:**

1. L'application détecte l'orientation de l'appareil via l'Orientation API
2. Le layout s'adapte automatiquement quand l'orientation change
3. Les tablettes en mode landscape bénéficient d'un layout optimisé
4. La page de passage est particulièrement optimisée pour le mode landscape sur tablette
5. Les changements d'orientation sont gérés sans perte de données ou d'état
6. Un fallback est fourni si l'Orientation API n'est pas supportée
7. L'adaptation est fluide sans rechargement de page

### Story 6.6: Performance Optimization

As a user,
I want que l'application charge rapidement et fonctionne de manière fluide,
so que je peux commencer mon entraînement sans attendre.

**Acceptance Criteria:**

1. Le chargement initial de l'application est optimisé (< 2 secondes sur connexion standard)
2. Les fichiers JSON sont chargés de manière asynchrone sans bloquer l'interface
3. Le bundle Angular est optimisé (tree-shaking, lazy loading si nécessaire)
4. Les fichiers audio sont chargés à la demande (pas tous en même temps)
5. Les images et assets sont optimisés (compression, formats appropriés)
6. Les performances sont testées et validées sur différents appareils
7. Le Lighthouse score est acceptable (> 80 pour Performance)

### Story 6.7: Error Handling and User Feedback

As a user,
I want recevoir des messages clairs en cas d'erreur,
so que je comprends ce qui s'est passé et comment le résoudre.

**Acceptance Criteria:**

1. Toutes les erreurs critiques sont gérées avec des messages utilisateur clairs
2. Les erreurs de chargement JSON affichent un message approprié
3. Les erreurs audio affichent un message et utilisent un fallback si disponible
4. Les erreurs de localStorage (quota) sont gérées gracieusement
5. Les messages d'erreur sont en français et compréhensibles
6. Des solutions ou actions sont proposées quand possible
7. Les erreurs non critiques n'interrompent pas l'expérience utilisateur

### Story 6.8: Final UI/UX Polish

As a user,
I want une interface polie et professionnelle,
so que l'expérience est agréable et inspire confiance.

**Acceptance Criteria:**

1. Tous les éléments UI sont cohérents en termes de style, espacement, typographie
2. Les couleurs respectent le contraste WCAG AA
3. Les états interactifs (hover, focus, active) sont bien définis
4. Les icônes et images sont de qualité et cohérentes
5. Le logo Keiko Hub est intégré de manière appropriée
6. Les micro-interactions sont polies (boutons, transitions, feedbacks)
7. L'application a une apparence professionnelle et soignée

---

## Checklist Results Report

### Executive Summary

**Overall PRD Completeness:** 95%

**MVP Scope Appropriateness:** Just Right - Le scope est bien défini avec des fonctionnalités essentielles clairement identifiées et des fonctionnalités post-MVP bien séparées.

**Readiness for Architecture Phase:** Ready - Le PRD est complet, bien structuré, et contient toutes les informations nécessaires pour que l'Architect puisse commencer le travail de design.

**Most Critical Gaps or Concerns:** Aucun gap critique identifié. Le PRD est solide et prêt pour la phase d'architecture.

### Category Analysis Table

| Category                         | Status | Critical Issues |
| -------------------------------- | ------ | -------------- |
| 1. Problem Definition & Context   | PASS   | Aucun          |
| 2. MVP Scope Definition          | PASS   | Aucun          |
| 3. User Experience Requirements  | PASS   | Aucun          |
| 4. Functional Requirements       | PASS   | Aucun          |
| 5. Non-Functional Requirements  | PASS   | Aucun          |
| 6. Epic & Story Structure        | PASS   | Aucun          |
| 7. Technical Guidance            | PASS   | Aucun          |
| 8. Cross-Functional Requirements | PASS   | Aucun          |
| 9. Clarity & Communication       | PASS   | Aucun          |

### Detailed Category Analysis

#### 1. Problem Definition & Context - PASS (100%)

✅ **Problem Statement:** Clairement articulé dans le Project Brief avec état actuel, points de douleur, impact, et différenciation des solutions existantes.

✅ **Business Goals & Success Metrics:** Objectifs business et KPIs bien définis dans le PRD (accessibilité, adoption, qualité, maintenance zéro).

✅ **User Research & Insights:** Personas utilisateurs bien définis (Aïkidoka préparant un passage de grade, Professeurs), besoins et pain points documentés, contexte marché fourni.

#### 2. MVP Scope Definition - PASS (100%)

✅ **Core Functionality:** Fonctionnalités essentielles clairement distinguées des nice-to-haves. 9 catégories de fonctionnalités core identifiées.

✅ **Scope Boundaries:** Section "Hors Portée pour le MVP" claire avec modes d'entraînement avancés, fonctionnalités sociales, et fonctionnalités avancées identifiées comme post-MVP.

✅ **MVP Validation Approach:** Critères de succès du MVP définis (fonctionnalité, audio, interface, performance, responsive, export).

#### 3. User Experience Requirements - PASS (95%)

✅ **User Journeys & Flows:** Flows principaux couverts (accueil → config → passage → fin → export). Navigation multi-pages bien définie.

✅ **Usability Requirements:** Accessibilité WCAG AA spécifiée, compatibilité plateformes définie (Web Responsive), performance attendue (< 2s), gestion d'erreurs planifiée.

✅ **UI Requirements:** Architecture d'information claire (5 pages principales), composants critiques identifiés, structure de navigation définie.

⚠️ **Note:** Quelques détails de design spécifiques pourraient être ajoutés, mais suffisant pour l'Architect.

#### 4. Functional Requirements - PASS (100%)

✅ **Feature Completeness:** 50 Functional Requirements (FR) couvrant toutes les fonctionnalités MVP. Chaque requirement est testable.

✅ **Requirements Quality:** Requirements spécifiques, non-ambigus, focus sur WHAT pas HOW, terminologie cohérente.

✅ **User Stories & Acceptance Criteria:** 43 stories avec format cohérent, critères d'acceptation testables, taille appropriée (2-4h de travail), dépendances documentées.

#### 5. Non-Functional Requirements - PASS (100%)

✅ **Performance Requirements:** NFR1-NFR25 couvrent performance (chargement < 2s, 60 FPS), sécurité (pas de données personnelles), fiabilité, contraintes techniques.

✅ **Security & Compliance:** Pas de données personnelles, pas de backend = pas de risques serveur, clé API Elevenlabs documentée comme limitation.

✅ **Reliability & Resilience:** Gestion d'erreurs spécifiée, fallbacks planifiés, localStorage avec gestion de quota.

✅ **Technical Constraints:** Angular obligatoire, GitHub Pages, budget zéro, tout côté client - tous bien documentés.

#### 6. Epic & Story Structure - PASS (100%)

✅ **Epic Definition:** 6 epics cohérents, focus sur valeur utilisateur, objectifs clairs, séquence logique, taille appropriée.

✅ **Story Breakdown:** 43 stories bien dimensionnées, valeur indépendante, critères d'acceptation complets, dépendances documentées, alignement avec epics.

✅ **First Epic Completeness:** Epic 1 inclut setup projet, routing, services, page d'accueil - infrastructure complète avec valeur immédiate.

#### 7. Technical Guidance - PASS (100%)

✅ **Architecture Guidance:** Architecture SPA monolithique côté client, 5 services identifiés, RxJS BehaviorSubject, structure données JSON - tout documenté.

✅ **Technical Decision Framework:** Rationale pour chaque décision technique fournie (Monorepo, services Angular, localStorage, etc.).

✅ **Implementation Considerations:** Approche développement, tests unitaires, déploiement GitHub Pages, monitoring - tous spécifiés.

#### 8. Cross-Functional Requirements - PASS (95%)

✅ **Data Requirements:** Structure JSON identifiée (nomenclature.json, videos.json), stockage localStorage, format données défini.

✅ **Integration Requirements:** API Elevenlabs optionnelle documentée, pas d'autres intégrations externes nécessaires.

✅ **Operational Requirements:** Déploiement GitHub Pages, pas de CI/CD complexe nécessaire, monitoring basique.

⚠️ **Note:** Schema JSON exact à valider avec l'utilisateur, mais structure générale bien définie.

#### 9. Clarity & Communication - PASS (100%)

✅ **Documentation Quality:** PRD bien structuré, langage clair et cohérent, termes techniques définis, organisation logique.

✅ **Stakeholder Alignment:** Input utilisateur intégré (brainstorming, Project Brief), contraintes respectées, approbation implicite via validation continue.

### Top Issues by Priority

**BLOCKERS:** Aucun

**HIGH:** Aucun

**MEDIUM:** 
- Structure exacte des fichiers JSON à valider avec l'utilisateur (format précis de nomenclature.json et videos.json)
- Quelques détails de design UI pourraient être ajoutés, mais suffisant pour commencer

**LOW:**
- Diagrammes visuels pourraient aider mais ne sont pas essentiels
- Exemples de données JSON pourraient être fournis

### MVP Scope Assessment

**Features Appropriately Scoped:** ✅ Toutes les fonctionnalités core sont essentielles pour le MVP. Aucune fonctionnalité ne devrait être coupée.

**Missing Essential Features:** ✅ Aucune fonctionnalité essentielle manquante identifiée.

**Complexity Concerns:** ⚠️ L'algorithme de génération aléatoire avec ordre strict peut être complexe, mais bien documenté dans les stories.

**Timeline Realism:** ✅ Scope réaliste pour un développement MVP. Les 6 epics sont bien séquencés et de taille appropriée.

### Technical Readiness

**Clarity of Technical Constraints:** ✅ Excellent - Toutes les contraintes techniques sont clairement documentées (Angular, GitHub Pages, budget zéro, côté client).

**Identified Technical Risks:** ✅ Risques identifiés dans le Project Brief (qualité audio, performance JSON, compatibilité navigateurs, maintenance données).

**Areas Needing Architect Investigation:** 
- Structure exacte des fichiers JSON et validation
- Optimisation du chargement des gros fichiers JSON
- Gestion de la synchronisation audio-visuelle
- Optimisation des performances pour mobile

### Recommendations

**Specific Actions:**
1. ✅ PRD est prêt pour la phase d'architecture
2. ⚠️ Valider la structure exacte des fichiers JSON avec l'utilisateur avant l'implémentation
3. ✅ L'Architect peut commencer avec les informations disponibles

**Suggested Improvements:**
- Fournir des exemples de fichiers JSON (nomenclature.json et videos.json) pour clarifier la structure
- Ajouter des diagrammes de flux utilisateur si nécessaire (optionnel)

**Next Steps:**
1. Passer à l'Architect pour créer l'architecture technique
2. Valider la structure JSON avec l'utilisateur pendant l'architecture
3. Commencer le développement avec l'Epic 1

### Final Decision

**✅ READY FOR ARCHITECT:** Le PRD et les epics sont complets, bien structurés, et prêts pour le design architectural. Tous les éléments nécessaires sont en place pour que l'Architect puisse créer l'architecture technique détaillée.

---

## Next Steps

### UX Expert Prompt

Le PRD pour **Keiko Hub** (Application Web d'Entraînement aux Passages de Grade Aïkido) est complet et prêt. Veuillez créer la spécification front-end (front-end-spec.md) en utilisant le template front-end-spec-tmpl.yaml. 

**Points clés à retenir:**
- Application Angular responsive (mobile-first)
- 5 pages principales : accueil, configuration, passage, réglages, historique
- Style minimaliste japonais avec logo Keiko Hub
- Thèmes clair/sombre + couleurs personnalisables (bannière, footer)
- Interface épurée optimisée pour utilisation mobile pendant l'entraînement
- Mode plein écran pour immersion totale
- Accessibilité WCAG AA requise

Le PRD contient tous les détails nécessaires dans la section "User Interface Design Goals" et les Functional Requirements. Veuillez créer la spécification front-end complète.

### Architect Prompt

Le PRD pour **Keiko Hub** (Application Web d'Entraînement aux Passages de Grade Aïkido) est complet et validé. Veuillez créer l'architecture technique (fullstack-architecture.md) en utilisant le template fullstack-architecture-tmpl.yaml.

**Points clés techniques:**
- Framework: Angular (LTS) - obligatoire
- Architecture: SPA monolithique côté client, pas de backend
- Services: GradeService, PassageService, AudioService, SettingsService, ExportService
- État: RxJS BehaviorSubject
- Données: JSON statique (nomenclature.json, videos.json) dans assets/
- Stockage: localStorage pour réglages et historique
- Hébergement: GitHub Pages (gratuit)
- Budget: 0€ (tout gratuit/open-source)

**Contraintes critiques:**
- Respect de l'ordre strict: Suwariwaza → Hanmi Handachi → Tashiwaza → Armes → Randori
- Gestion des conditions (ex: Bokken à partir du 3e Dan)
- Performance: chargement < 2s, 60 FPS animations
- Responsive: mobile, tablette, desktop

Le PRD contient 43 stories organisées en 6 epics avec tous les détails fonctionnels. La section "Technical Assumptions" contient toutes les décisions techniques. Veuillez créer l'architecture technique complète avec structure de code, services, composants, et patterns de design.

### Architecture Validation

**Date de validation:** 2024-12-19  
**Architecture document:** `docs/architecture.md`

**Résultat de la review:** ✅ **ARCHITECTURE VALIDÉE ET ALIGNÉE**

L'architecture technique créée par l'Architect (Winston) est parfaitement alignée avec ce PRD. Toutes les décisions techniques documentées dans la section "Technical Assumptions" ont été confirmées et détaillées dans l'architecture :

- ✅ **Services Angular:** Les 5 services prévus (GradeService, PassageService, AudioService, SettingsService, ExportService) sont documentés avec leurs interfaces
- ✅ **Structure du projet:** Structure Angular standard confirmée, alignée avec les assumptions du PRD
- ✅ **Technologies:** Angular LTS, TypeScript, RxJS - toutes confirmées
- ✅ **Déploiement:** GitHub Pages confirmé comme plateforme de déploiement
- ✅ **Data Models:** Interfaces TypeScript définies pour tous les modèles de données
- ✅ **Architecture patterns:** Patterns documentés (SPA, Component-Based, Service-Oriented, Reactive State Management)
- ✅ **Workflows:** Diagrammes de séquence pour les workflows critiques
- ✅ **Testing Strategy:** Stratégie de tests unitaires confirmée (Jasmine/Karma)

**Aucun changement requis au PRD.** L'architecture apporte des détails d'implémentation supplémentaires qui complètent le PRD sans le contredire.

**Prochaine étape:** Validation par le PO (Step 7) puis fragmentation des documents (Step 8).

---
