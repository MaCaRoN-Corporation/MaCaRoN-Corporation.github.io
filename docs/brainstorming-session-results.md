# Résultats de la Session de Brainstorming

**Date de la session:** 2024-12-19  
**Facilitateur:** Analyste (Mary)  
**Participant:** Utilisateur

## Résumé Exécutif

**Sujet:** Application web Angular pour l'entraînement aux passages de grade Aikido

**Objectifs de la session:** Exploration large des fonctionnalités, de l'UX et des approches techniques, suivie d'un affinement

**Contraintes identifiées:**
- Framework: Angular
- Hébergement: GitHub Pages (gratuit)
- Budget: 0€
- Temps: Développement le plus rapide possible

**Fonctionnalités essentielles identifiées:**
- Simulation audio de passage de grade (voix qui annonce techniques et attaques)
- Sélection du grade visé
- Configuration du temps entre chaque technique
- Configuration de la durée totale du test
- Sélection/filtrage de techniques spécifiques
- Filtrage par type d'attaque (ex: seulement Shomen Uchi)
- Choix du type de voix (masculin/féminin)
- Mode démarrage rapide avec gros bouton
- Interface très intuitive

**Techniques utilisées:** 
- Mind Mapping (Nomenclature Aïkido)
- First Principles Thinking (Expérience utilisateur)
- What If Scenarios (Fonctionnalités avancées)
- Morphological Analysis (Architecture technique)
- SCAMPER (Interface utilisateur)

**Total d'idées générées:** 50+ idées organisées en catégories

**Durée de la session:** ~1 heure

## Thèmes Clés Identifiés

1. **Nomenclature complète de l'Aïkido**
   - Structure hiérarchique: Grade → Position → Attaque → Technique
   - Grades: 6e Kyū à 5e Dan
   - Ordre strict: Suwariwaza → Hanmi Handachi → Tashiwaza → Armes → Randori

2. **Architecture technique Angular**
   - Multi-pages avec routing
   - RxJS BehaviorSubject pour état réactif
   - JSON statique pour données
   - localStorage pour persistance
   - Tout côté client (budget zéro)

3. **Expérience utilisateur optimale**
   - Interface épurée et intuitive
   - Mode plein écran pour immersion
   - Raccourcis clavier
   - Responsive design multi-appareils
   - Animations fluides

4. **Fonctionnalités essentielles**
   - Simulation réaliste de passage de grade
   - Configuration flexible (filtres avancés)
   - Export des passages (.txt)
   - Personnalisation visuelle (thèmes, couleurs)
   - Modes d'entraînement avancés (post-MVP)

5. **Système audio**
   - Audios pré-enregistrés intégrés
   - Option Elevenlabs API
   - Répétition automatique (max 10x)
   - Réglages (vitesse, volume)

---

## Sessions de Techniques

### Technique 1: Mind Mapping - Nomenclature Aïkido

**Description:** Cartographie de la structure complète de la nomenclature Aïkido pour l'application

**Structure identifiée:**
- **Grades:** 6e Kyū → 5e Dan
- **Source de données:** JSON fourni par l'utilisateur
- **Organisation:** Grade → Positions → Attaques → Techniques

**Positions (dans l'ordre):**
1. Suwariwaza (techniques assises)
2. Hanmi Handachi Waza (un genou au sol, un debout)
3. Tashiwaza (techniques debout)
4. Armes
5. Randori (à la fin)

**Armes identifiées:**
- Tanto (tous grades concernés)
- Bokken (à partir du 3e Dan)
- Jo (Jo Taijo, Jo Dori, Jo Nage)
- Ken (Ken Taiken, Tachidori)

**Idées générées:**

1. **Structure de données JSON:**
   - Format hiérarchique : Grade → Position → Attaque → Techniques
   - Chaque grade a un nombre variable de positions
   - Chaque position contient plusieurs attaques
   - Chaque attaque contient plusieurs techniques

2. **Algorithme de génération:**
   - Respecter l'ordre strict : Suwariwaza → Hanmi Handachi → Tashiwaza → Armes → Randori
   - Sélectionner aléatoirement dans chaque catégorie selon le grade
   - Gérer les conditions (ex: Bokken seulement à partir du 3e Dan)

3. **Gestion des armes:**
   - Tanto : disponible pour tous les grades concernés
   - Bokken : conditionnel (3e Dan+)
   - Jo : 3 sous-catégories (Jo Taijo, Jo Dori, Jo Nage)
   - Ken : 2 sous-catégories (Ken Taiken, Tachidori)

4. **Interface de sélection:**
   - Sélection du grade (6e Kyū à 5e Dan)
   - Filtrage par position (ex: seulement Tashiwaza)
   - Filtrage par attaque (ex: seulement Shomen Uchi)
   - Filtrage par technique spécifique
   - Inclusion/exclusion des armes
   - Inclusion/exclusion du Randori

5. **Configuration du passage:**
   - Durée totale configurable
   - Temps entre chaque annonce configurable
   - Mode rapide (2-3 min) vs mode complet
   - Possibilité de sauter certaines sections

**Insights découverts:**
- La structure JSON sera la base de données de l'application
- L'ordre strict doit être respecté dans la génération
- Les armes nécessitent une logique conditionnelle selon le grade
- Le Randori est toujours en dernier (s'il est inclus)

**Connexions notables:**
- Structure JSON ↔ Algorithme de génération
- Ordre strict ↔ Expérience utilisateur (simulation réaliste)
- Filtrage avancé ↔ Mode rapide (2-3 min)

### Technique 2: First Principles Thinking - Expérience Utilisateur

**Description:** Décomposition des besoins fondamentaux de l'utilisateur pendant le passage

**Idées générées:**

1. **Interface pendant le passage:**
   - Page dédiée avec timer visible
   - Compte à rebours visuel avant la prochaine technique
   - Attaque et technique en cours affichées en grand
   - Historique de toutes les techniques énoncées (liste déroulante)
   - Indicateur de progression : "Technique X sur Y total"
   - Bouton pause/reprendre
   - Bouton réécouter la dernière technique/technique en cours

2. **Fonctionnalités de fin de passage:**
   - Message "Passage terminé"
   - Export PDF de l'ensemble des techniques énumérées
   - Format PDF à définir (liste simple, format examen, etc.)

3. **Gestion audio:**
   - Synthèse vocale (Web Speech API ou service externe)
   - Choix voix masculine/féminine
   - Bouton réécouter (répéter la dernière annonce)
   - Gestion de la pause (arrêter/reprendre l'audio)

4. **Expérience utilisateur:**
   - Interface épurée pendant le passage (pas de distractions)
   - Éléments visuels clairs et lisibles
   - Feedback visuel pour le compte à rebours
   - Historique consultable sans interrompre le passage

**Insights découverts:**
- L'interface doit être optimale pour une utilisation debout (mobile)
- Le PDF doit être généré côté client (pas de backend nécessaire)
- La synthèse vocale doit être fluide et naturelle
- Le mode pause permet de s'entraîner de manière flexible

**Connexions notables:**
- Interface épurée ↔ Utilisation mobile (responsive)
- Export PDF ↔ Pas de backend (tout côté client)
- Synthèse vocale ↔ Budget zéro (API gratuite nécessaire)

### Technique 3: What If Scenarios - Fonctionnalités Avancées

**Description:** Exploration de scénarios hypothétiques pour identifier des fonctionnalités supplémentaires

**Idées générées:**

1. **Modes d'entraînement (Scénario 1 - IMPLÉMENTÉ):**
   - **Mode entraînement ciblé:** Sélectionner 3-5 techniques spécifiques à répéter
   - **Mode révision:** Refaire uniquement les techniques d'une catégorie (ex: toutes les techniques sur Shomen Uchi)
   - **Mode progression:** Commencer par les techniques faciles, puis augmenter progressivement la difficulté

2. **Export et partage (Scénario 2 - IMPLÉMENTÉ):**
   - Export PDF de l'ensemble des techniques énumérées
   - Export fichier texte (.txt) comme alternative
   - Chaque technique dans l'export contient un lien vers une vidéo présentant la technique
   - Format d'export à définir (liste numérotée, format examen, etc.)

3. **Fonctionnalité hors ligne (Scénario 3 - NON IMPLÉMENTÉ):**
   - Pas nécessaire (site en ligne uniquement)
   - Pas de Service Worker requis

4. **Personnalisation audio (Scénario 4 - IMPLÉMENTÉ):**
   - Vitesse de lecture configurable : 0.5x à 2x (dans les réglages)
   - Volume ajustable (slider dans les réglages)
   - Option "répéter automatiquement" la dernière technique annoncée
   - Réglages sauvegardés (localStorage)

**Insights découverts:**
- Les modes d'entraînement offrent une grande flexibilité pour différents besoins
- Les liens vidéo dans l'export ajoutent de la valeur pédagogique
- Les réglages audio doivent être persistants (localStorage)
- L'export PDF/TXT doit être généré côté client (bibliothèque comme jsPDF ou simple texte)

**Connexions notables:**
- Modes d'entraînement ↔ Interface de sélection avancée
- Liens vidéo ↔ Base de données de vidéos (URLs dans le JSON ?)
- Réglages audio ↔ localStorage pour persistance
- Export PDF ↔ Bibliothèque jsPDF (gratuite, côté client)

### Technique 4: Morphological Analysis - Architecture Technique

**Description:** Analyse des choix techniques pour chaque composant de l'application

**Décisions techniques prises:**

1. **Synthèse vocale:**
   - **Solution:** Elevenlabs API (avec clé API fournie)
   - **Alternative:** Audios pré-enregistrés fournis par l'utilisateur, intégrés directement au site
   - **Avantage:** Qualité audio élevée, pas de limitation de synthèse vocale
   - **Implémentation:** Service Angular pour gérer l'API Elevenlabs + service pour les audios locaux

2. **Export de données:**
   - **Format:** Fichier texte (.txt) uniquement
   - **Contenu:** Liste des techniques énumérées avec liens vidéo
   - **Implémentation:** Génération côté client (pas de bibliothèque externe nécessaire)

3. **Gestion des données:**
   - **Structure JSON statique** dans assets/
   - **Fichier 1:** nomenclature.json (grades → positions → attaques → techniques)
   - **Fichier 2:** videos.json (clés: "attaque-technique", valeurs: URLs vidéo)
   - **Service Angular:** Service dédié pour charger et parser les JSON

4. **Gestion de l'état:**
   - **Solution:** RxJS avec BehaviorSubject
   - **Services:** 
     - PassageService (état du passage en cours)
     - SettingsService (réglages utilisateur)
     - GradeService (données des grades)

5. **Stockage des réglages:**
   - **Solution:** localStorage
   - **Données stockées:**
     - Voix sélectionnée (masculin/féminin)
     - Vitesse de lecture (0.5x - 2x)
     - Volume
     - Option répétition automatique
     - Thème (clair/sombre)
     - Couleurs personnalisées

6. **Architecture de l'application:**
   - **Type:** Multi-pages/routes (Angular Router)
   - **Routes prévues:**
     - `/` - Page d'accueil (gros bouton démarrer)
     - `/config` - Page de configuration
     - `/passage` - Page du passage en cours
     - `/settings` - Page des réglages
     - `/history` - Historique des passages (optionnel)

7. **Thèmes et personnalisation:**
   - **Thèmes:** Clair et sombre
   - **Couleurs personnalisables:** Bannière, footer, accents
   - **Stockage:** localStorage
   - **Implémentation:** CSS variables + service de thème

8. **Animations et transitions:**
   - **Transitions entre techniques:** Animations fluides
   - **Compte à rebours:** Animation visuelle
   - **Bibliothèque:** Angular Animations (intégré)

9. **Mode répétition automatique:**
   - **Limite:** Maximum 10 répétitions par technique
   - **Contrôle:** Bouton pour arrêter la répétition
   - **Feedback visuel:** Indicateur du nombre de répétitions restantes

**Insights découverts:**
- L'utilisation d'audios pré-enregistrés évite les limitations de l'API Elevenlabs
- Le JSON séparé pour les vidéos permet une mise à jour facile sans toucher à la nomenclature
- RxJS BehaviorSubject est parfait pour gérer l'état réactif du passage
- Les couleurs personnalisables ajoutent une touche d'individualisation
- Les animations améliorent l'expérience utilisateur sans surcharger

**Connexions notables:**
- Audios locaux ↔ Pas de dépendance API en production (sauf option Elevenlabs)
- JSON statique ↔ Chargement rapide, pas de backend
- Multi-routes ↔ Navigation claire, UX améliorée
- Thèmes personnalisables ↔ localStorage pour persistance
- Animations ↔ Angular Animations (gratuit, intégré)

### Technique 5: SCAMPER - Interface Utilisateur

**Description:** Exploration créative de l'interface utilisateur avec la méthode SCAMPER

**Décisions prises:**

1. **Page d'accueil:**
   - **Pas d'aperçu** des dernières configurations utilisées
   - Interface épurée avec gros bouton "Démarrer"
   - Accès rapide aux réglages

2. **Mode plein écran pendant le passage:**
   - **Implémentation:** Fullscreen API (natif navigateur)
   - **Avantage:** Élimine les distractions, immersion totale
   - **Sortie:** Bouton pour quitter le plein écran

3. **Raccourcis clavier:**
   - **Espace:** Pause/Reprendre
   - **R:** Répéter la dernière technique
   - **Échap:** Quitter le plein écran (optionnel)
   - **Implémentation:** @HostListener dans Angular

4. **Indicateur de progression:**
   - **Type:** Barre de progression visuelle
   - **Affichage:** Technique X sur Y total
   - **Style:** S'adapte au thème et aux couleurs personnalisées
   - **Animation:** Mise à jour fluide à chaque technique

5. **Mode landscape optimisé:**
   - **Détection automatique:** Orientation API (natif)
   - **Adaptation:** Layout optimisé pour tablette en mode horizontal
   - **Responsive:** Media queries + détection d'orientation
   - **Interface:** Réorganisation des éléments pour meilleure lisibilité

**Idées supplémentaires générées:**
- Utilisation des vibrations (optionnel, si compatible)
- Notifications pour rappels d'entraînement (futur)
- Mode sombre adaptatif selon l'heure (futur)

**Insights découverts:**
- Le plein écran améliore l'immersion et réduit les distractions
- Les raccourcis clavier facilitent l'utilisation sur desktop
- La détection d'orientation améliore l'expérience sur tablette
- La barre de progression donne un feedback visuel clair

**Connexions notables:**
- Plein écran ↔ Interface épurée pendant le passage
- Raccourcis clavier ↔ Accessibilité améliorée
- Barre de progression ↔ Feedback utilisateur en temps réel
- Détection orientation ↔ UX optimale multi-appareils

---

## Catégorisation des Idées

### Opportunités Immédiates (MVP - À implémenter en priorité)

1. **Structure de base de l'application Angular**
   - Configuration Angular avec routing multi-pages
   - Services Angular (PassageService, SettingsService, GradeService)
   - RxJS BehaviorSubject pour gestion d'état
   - localStorage pour persistance des réglages

2. **Chargement et gestion des données**
   - Service pour charger nomenclature.json
   - Service pour charger videos.json
   - Parsing et structure de données

3. **Page d'accueil**
   - Interface épurée
   - Gros bouton "Démarrer"
   - Accès aux réglages

4. **Page de configuration**
   - Sélection du grade (6e Kyū à 5e Dan)
   - Configuration du temps entre techniques
   - Configuration de la durée totale
   - Sélection voix (masculin/féminin)
   - Filtrage par position, attaque, technique
   - Inclusion/exclusion des armes
   - Inclusion/exclusion du Randori

5. **Page de passage**
   - Timer visible
   - Compte à rebours visuel
   - Attaque et technique en grand
   - Historique des techniques
   - Indicateur "Technique X sur Y"
   - Barre de progression
   - Boutons pause/reprendre
   - Bouton répéter
   - Mode plein écran
   - Raccourcis clavier (Espace, R)

6. **Système audio**
   - Intégration des audios fournis
   - Option Elevenlabs API (avec clé)
   - Gestion de la lecture audio
   - Répétition automatique (max 10x)

7. **Export**
   - Export .txt des techniques énumérées
   - Inclusion des liens vidéo dans l'export

8. **Thèmes et personnalisation**
   - Thème clair/sombre
   - Couleurs personnalisables (bannière, footer)
   - Persistance dans localStorage

9. **Responsive design**
   - Adaptation mobile/desktop
   - Détection d'orientation (landscape)
   - Optimisation tablette

10. **Animations et transitions**
    - Transitions entre techniques
    - Animations de compte à rebours
    - Animations de la barre de progression

### Innovations Futures (Post-MVP)

1. **Modes d'entraînement avancés**
   - Mode entraînement ciblé (3-5 techniques)
   - Mode révision (par catégorie)
   - Mode progression (difficulté croissante)

2. **Fonctionnalités supplémentaires**
   - Historique des passages
   - Statistiques d'entraînement
   - Partage de passages
   - Notifications de rappel

3. **Améliorations UX**
   - Mode sombre adaptatif (selon l'heure)
   - Vibrations pour signaler les techniques
   - Suggestions de techniques à réviser

### Moonshots (Concepts ambitieux)

1. **Intelligence artificielle**
   - Recommandations personnalisées de techniques à travailler
   - Analyse de progression
   - Adaptation automatique de la difficulté

2. **Social et communauté**
   - Partage de passages avec professeurs
   - Système de notation/évaluation
   - Communauté d'Aïkidoka

3. **Réalité augmentée**
   - Visualisation 3D des techniques
   - Guide de positionnement

### Insights & Apprentissages Clés

1. **Architecture technique:**
   - Angular avec routing multi-pages
   - RxJS pour réactivité
   - JSON statique pour données (pas de backend)
   - localStorage pour persistance
   - Tout côté client (budget zéro)

2. **Expérience utilisateur:**
   - Interface épurée et intuitive
   - Mode plein écran pour immersion
   - Raccourcis clavier pour accessibilité
   - Responsive design multi-appareils
   - Animations fluides

3. **Fonctionnalités essentielles:**
   - Simulation réaliste de passage de grade
   - Configuration flexible
   - Export des passages
   - Personnalisation visuelle

4. **Contraintes respectées:**
   - Budget: 0€ (tout gratuit/open-source)
   - Framework: Angular
   - Hébergement: GitHub Pages
   - Développement rapide possible

---

## Plan d'Action

### Priorité #1: Structure de base et données

**Rationale:** Fondation nécessaire pour tout le reste

**Prochaines étapes:**
1. Créer le projet Angular
2. Configurer le routing (accueil, config, passage, settings)
3. Créer les services de base (GradeService, PassageService, SettingsService)
4. Intégrer les fichiers JSON (nomenclature.json, videos.json)
5. Implémenter le chargement et parsing des données

**Ressources nécessaires:**
- Fichiers JSON fournis par l'utilisateur
- Angular CLI
- Documentation Angular

**Timeline:** 2-3 jours

---

### Priorité #2: Page de configuration et génération de passage

**Rationale:** Permet de configurer et générer un passage de grade

**Prochaines étapes:**
1. Créer la page de configuration avec tous les filtres
2. Implémenter l'algorithme de génération aléatoire
3. Respecter l'ordre strict (Suwariwaza → Hanmi Handachi → Tashiwaza → Armes → Randori)
4. Gérer les conditions (ex: Bokken à partir du 3e Dan)
5. Sauvegarder la configuration dans le service

**Ressources nécessaires:**
- Logique de génération aléatoire
- Validation des filtres

**Timeline:** 3-4 jours

---

### Priorité #3: Page de passage et système audio

**Rationale:** Cœur de l'application, fonctionnalité principale

**Prochaines étapes:**
1. Créer la page de passage avec tous les éléments visuels
2. Intégrer le système audio (audios locaux + option Elevenlabs)
3. Implémenter le timer et compte à rebours
4. Ajouter les boutons (pause, répéter)
5. Implémenter le mode plein écran
6. Ajouter les raccourcis clavier
7. Créer la barre de progression
8. Gérer l'historique des techniques

**Ressources nécessaires:**
- Audios fournis par l'utilisateur
- Clé API Elevenlabs (optionnelle)
- Fullscreen API
- Angular Animations

**Timeline:** 5-6 jours

---

### Priorité #4: Export, thèmes et responsive

**Rationale:** Finalise l'expérience utilisateur de base

**Prochaines étapes:**
1. Implémenter l'export .txt avec liens vidéo
2. Créer le système de thèmes (clair/sombre)
3. Implémenter les couleurs personnalisables
4. Adapter le responsive design
5. Détecter l'orientation (landscape)
6. Optimiser pour tablette

**Ressources nécessaires:**
- CSS variables
- Orientation API
- Media queries

**Timeline:** 3-4 jours

---

### Priorité #5: Modes d'entraînement avancés (Post-MVP)

**Rationale:** Améliore la valeur de l'application

**Prochaines étapes:**
1. Implémenter le mode entraînement ciblé
2. Implémenter le mode révision
3. Implémenter le mode progression
4. Ajouter les réglages audio (vitesse, volume, répétition auto)

**Timeline:** 4-5 jours

---

## Réflexion & Suivi

### Ce qui a bien fonctionné

- **Exploration structurée:** Les techniques de brainstorming ont permis d'explorer tous les aspects
- **Décisions techniques claires:** Tous les choix techniques sont documentés
- **Priorisation:** Distinction claire entre MVP et fonctionnalités futures
- **Respect des contraintes:** Budget zéro, Angular, GitHub Pages

### Domaines nécessitant une exploration supplémentaire

1. **Structure exacte du JSON:**
   - Format précis de nomenclature.json
   - Format précis de videos.json
   - Validation des données

2. **Qualité audio:**
   - Test des audios fournis
   - Intégration Elevenlabs (si nécessaire)
   - Gestion des erreurs audio

3. **Performance:**
   - Optimisation du chargement des JSON
   - Lazy loading des routes
   - Optimisation des animations

4. **Accessibilité:**
   - Support lecteurs d'écran
   - Navigation au clavier
   - Contraste des couleurs

### Techniques recommandées pour les sessions de suivi

- **Prototypage rapide:** Tester l'interface avant développement complet
- **Tests utilisateurs:** Valider l'UX avec de vrais Aïkidoka
- **Itération:** Affiner basé sur les retours

### Questions émergentes

1. Comment gérer les variations entre écoles d'Aïkido ?
2. Faut-il un système de mise à jour des JSON sans redéployer ?
3. Comment gérer les erreurs de chargement audio ?
4. Faut-il un mode "démo" pour tester sans configuration complète ?

### Prochaines sessions suggérées

- **Session technique:** Détails d'implémentation Angular
- **Session UX:** Wireframes et maquettes
- **Session données:** Structure exacte des JSON
- **Session test:** Scénarios de test et validation

---

*Session facilitée en utilisant le framework de brainstorming BMAD-METHOD™*
