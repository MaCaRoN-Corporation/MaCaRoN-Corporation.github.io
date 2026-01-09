# Project Brief: Application Web d'Entraînement aux Passages de Grade Aïkido

**Date de création:** 2024-12-19  
**Auteur:** Analyste (Mary)  
**Version:** 1.0

---

## Résumé Exécutif

**Concept du produit:** Application web Angular permettant aux Aïkidoka de s'entraîner aux passages de grade en simulant un examen réel avec annonces audio de techniques dans l'ordre traditionnel.

**Problème principal résolu:** Les Aïkidoka ont besoin de s'entraîner seuls pour les passages de grade, mais manquent d'un outil qui simule fidèlement l'expérience d'un examen réel avec annonces vocales dans le bon ordre (Suwariwaza → Hanmi Handachi → Tashiwaza → Armes → Randori).

**Marché cible:** Aïkidoka de tous niveaux (6e Kyū à 5e Dan) cherchant à s'entraîner pour leurs passages de grade, avec un besoin particulier pour ceux qui s'entraînent seuls ou souhaitent une pratique supplémentaire.

**Proposition de valeur clé:** Simulation réaliste et personnalisable d'un passage de grade avec audio, interface intuitive, et configuration flexible permettant un entraînement adapté aux besoins individuels, le tout gratuitement accessible en ligne.

---

## Énoncé du Problème

### État actuel et points de douleur

Les Aïkidoka qui préparent un passage de grade font face à plusieurs défis :

1. **Manque de partenaire d'entraînement:** Beaucoup s'entraînent seuls et n'ont pas accès à un partenaire ou un professeur pour simuler les annonces d'un jury d'examen.

2. **Ordre et structure complexes:** Les passages de grade suivent un ordre strict (Suwariwaza → Hanmi Handachi → Tashiwaza → Armes → Randori) avec des techniques spécifiques selon le grade, ce qui est difficile à mémoriser et à pratiquer sans guide.

3. **Solutions existantes limitées:** 
   - Les listes papier/PDF sont statiques et ne simulent pas l'expérience réelle
   - Aucun outil numérique gratuit ne combine audio, ordre correct, et personnalisation
   - Les applications existantes sont soit payantes, soit ne couvrent pas tous les aspects

4. **Manque de flexibilité:** Les Aïkidoka ont besoin de s'entraîner sur des techniques spécifiques (ex: seulement Shomen Uchi) ou de créer des sessions courtes (2-3 minutes) pour des entraînements ciblés.

### Impact du problème

- **Temps perdu:** Les Aïkidoka doivent mémoriser manuellement les listes ou dépendre d'un partenaire
- **Préparation sous-optimale:** Sans simulation réaliste, les candidats sont moins bien préparés
- **Accessibilité:** Les outils payants excluent certains pratiquants
- **Flexibilité limitée:** Impossible de personnaliser l'entraînement selon les besoins

### Pourquoi les solutions existantes échouent

- **Listes statiques:** Ne fournissent pas l'expérience audio d'un vrai passage
- **Applications payantes:** Barrière d'entrée financière
- **Manque de personnalisation:** Ne permettent pas de filtrer par technique, attaque, ou durée
- **Ordre incorrect:** Ne respectent pas toujours l'ordre traditionnel strict
- **Interface complexe:** Trop de fonctionnalités inutiles pour un usage simple

### Urgence et importance

Les passages de grade sont des événements importants dans la progression d'un Aïkidoka. Une préparation adéquate améliore les chances de réussite et renforce la confiance. Un outil gratuit, accessible et facile à utiliser répond à un besoin réel de la communauté Aïkido.

---

## Solution Proposée

### Concept et approche

Application web Angular (SPA) qui :

1. **Simule un passage de grade réaliste:**
   - Génère aléatoirement une séquence de techniques selon le grade sélectionné
   - Respecte l'ordre strict traditionnel (Suwariwaza → Hanmi Handachi → Tashiwaza → Armes → Randori)
   - Annonce audio des techniques et attaques comme un vrai jury
   - Interface épurée avec timer, compte à rebours, et historique

2. **Offre une personnalisation complète:**
   - Sélection du grade (6e Kyū à 5e Dan)
   - Filtrage par position, attaque, ou technique spécifique
   - Configuration du temps entre techniques et durée totale
   - Choix de la voix (masculin/féminin)
   - Modes d'entraînement (ciblé, révision, progression)

3. **Fonctionne entièrement côté client:**
   - Pas de backend nécessaire (budget zéro)
   - Données JSON statiques (nomenclature + vidéos)
   - Hébergement gratuit sur GitHub Pages
   - localStorage pour persistance des réglages

### Différenciateurs clés

1. **Simulation audio réaliste:** Audios pré-enregistrés + option Elevenlabs pour une expérience authentique
2. **Respect de l'ordre traditionnel:** Algorithme qui garantit l'ordre correct selon la tradition Aïkido
3. **Personnalisation avancée:** Filtres permettant des entraînements ultra-ciblés (ex: seulement Shomen Uchi, 2-3 minutes)
4. **Interface intuitive:** Mode "démarrage rapide" avec gros bouton, interface épurée pendant le passage
5. **Gratuit et accessible:** Aucun coût, accessible depuis n'importe quel navigateur

### Pourquoi cette solution réussira

- **Répond à un besoin réel:** Les Aïkidoka ont besoin d'un outil de ce type
- **Technologie moderne:** Angular offre une expérience fluide et réactive
- **Budget zéro:** Accessible à tous sans barrière financière
- **Personnalisation:** S'adapte aux besoins individuels (débutant à expert)
- **Simulation réaliste:** L'audio et l'ordre correct créent une expérience authentique

### Vision de haut niveau

Une application web gratuite, intuitive et puissante qui devient l'outil de référence pour l'entraînement aux passages de grade Aïkido, utilisable par des Aïkidoka du monde entier, de tous niveaux, et adaptable à leurs besoins spécifiques d'entraînement.

---

## Utilisateurs Cibles

### Segment Principal: Aïkidoka Préparant un Passage de Grade

**Profil démographique:**
- Pratiquants d'Aïkido de tous âges
- Niveaux: 6e Kyū à 5e Dan
- Géographie: Monde entier (interface multilingue potentielle)
- Contexte: Dojos, entraînement à domicile, pratique individuelle

**Comportements actuels:**
- Mémorisation de listes papier/PDF
- Entraînement avec partenaire quand disponible
- Recherche de ressources en ligne (souvent limitées)
- Répétition mentale des techniques

**Besoins spécifiques:**
- Simulation réaliste d'un passage de grade
- Flexibilité pour s'entraîner seul
- Personnalisation selon les points à travailler
- Accès gratuit et facile
- Interface simple ne nécessitant pas de formation

**Objectifs:**
- Réussir leur passage de grade
- Améliorer leur mémorisation des techniques
- S'entraîner de manière autonome
- Gagner en confiance avant l'examen

### Segment Secondaire: Professeurs d'Aïkido

**Profil:**
- Instructeurs et sensei
- Responsables de préparation aux passages de grade

**Besoins:**
- Outil pour recommander à leurs élèves
- Vérification de la préparation des élèves
- Standardisation de l'entraînement

**Objectifs:**
- Améliorer le taux de réussite de leurs élèves
- Fournir des ressources d'entraînement supplémentaires

---

## Objectifs et Métriques de Succès

### Objectifs Business

1. **Accessibilité:** Application gratuite et accessible à tous les Aïkidoka
2. **Adoption:** Utilisation régulière par la communauté Aïkido
3. **Qualité:** Simulation réaliste et fidèle aux passages de grade réels
4. **Maintenance:** Coûts de maintenance zéro (tout côté client)

### Métriques de Succès Utilisateur

1. **Taux d'utilisation:** Nombre de passages générés par utilisateur
2. **Temps d'entraînement:** Durée moyenne des sessions
3. **Satisfaction:** Facilité d'utilisation (interface intuitive)
4. **Efficacité:** Amélioration perçue de la préparation

### Indicateurs Clés de Performance (KPIs)

1. **Utilisateurs actifs:** Nombre d'utilisateurs uniques par mois
2. **Sessions:** Nombre de passages générés
3. **Engagement:** Temps moyen par session
4. **Rétention:** Utilisateurs revenant régulièrement
5. **Export:** Nombre d'exports PDF/TXT (indicateur de valeur perçue)

---

## Portée du MVP

### Fonctionnalités Core (Must Have)

1. **Génération de passage:**
   - Sélection du grade (6e Kyū à 5e Dan)
   - Génération aléatoire respectant l'ordre strict
   - Gestion des conditions (ex: Bokken à partir du 3e Dan)

2. **Configuration de base:**
   - Temps entre techniques (configurable)
   - Durée totale (configurable)
   - Sélection voix (masculin/féminin)
   - Filtrage par position, attaque, technique

3. **Page de passage:**
   - Timer visible
   - Compte à rebours visuel
   - Attaque et technique affichées en grand
   - Historique des techniques
   - Indicateur "Technique X sur Y"
   - Barre de progression

4. **Contrôles:**
   - Bouton pause/reprendre
   - Bouton répéter la dernière technique
   - Mode plein écran
   - Raccourcis clavier (Espace = pause, R = répéter)

5. **Système audio:**
   - Intégration des audios pré-enregistrés (dans assets/)
   - Option Elevenlabs API (avec clé)
   - Lecture audio des techniques et attaques

6. **Export:**
   - Export .txt des techniques énumérées
   - Inclusion des liens vidéo dans l'export

7. **Thèmes:**
   - Thème clair/sombre
   - Couleurs personnalisables (bannière, footer)
   - Persistance dans localStorage

8. **Responsive design:**
   - Adaptation mobile/desktop
   - Détection d'orientation (landscape pour tablette)

9. **Animations:**
   - Transitions entre techniques
   - Animations de compte à rebours
   - Animations de la barre de progression

### Hors Portée pour le MVP

1. **Modes d'entraînement avancés:**
   - Mode entraînement ciblé (3-5 techniques)
   - Mode révision (par catégorie)
   - Mode progression (difficulté croissante)

2. **Fonctionnalités sociales:**
   - Partage de passages
   - Historique des passages
   - Statistiques d'entraînement

3. **Fonctionnalités avancées:**
   - Réglages audio avancés (vitesse, volume, répétition auto)
   - Notifications de rappel
   - Mode hors ligne

4. **Fonctionnalités premium:**
   - Aucune (application entièrement gratuite)

### Critères de Succès du MVP

1. **Fonctionnalité:** Génération correcte de passages selon le grade
2. **Audio:** Annonces claires et compréhensibles
3. **Interface:** Utilisation intuitive sans formation
4. **Performance:** Chargement rapide (< 2 secondes)
5. **Responsive:** Fonctionne sur mobile, tablette, desktop
6. **Export:** Export .txt fonctionnel avec liens vidéo

---

## Vision Post-MVP

### Phase 2 - Fonctionnalités

1. **Modes d'entraînement avancés:**
   - Mode entraînement ciblé: Sélectionner 3-5 techniques spécifiques à répéter
   - Mode révision: Refaire uniquement les techniques d'une catégorie
   - Mode progression: Difficulté croissante automatique

2. **Réglages audio avancés:**
   - Vitesse de lecture (0.5x à 2x)
   - Volume ajustable
   - Répétition automatique (max 10x par technique)

3. **Historique et statistiques:**
   - Historique des passages générés
   - Statistiques d'entraînement (temps, techniques pratiquées)
   - Graphiques de progression

### Vision à Long Terme

1. **Expansion de la communauté:**
   - Support multilingue (français, anglais, japonais)
   - Partage de passages avec professeurs
   - Système de notation/évaluation

2. **Améliorations techniques:**
   - Optimisation des performances
   - Mode hors ligne (Service Worker)
   - Application mobile native (optionnel)

3. **Contenu enrichi:**
   - Plus de vidéos de démonstration
   - Explications détaillées des techniques
   - Conseils de préparation

### Opportunités d'Expansion

1. **Autres arts martiaux:** Adapter le concept pour d'autres disciplines
2. **Version éducative:** Outil pédagogique pour les dojos
3. **API publique:** Permettre l'intégration dans d'autres applications

---

## Considérations Techniques

### Exigences de Plateforme

- **Plateformes cibles:** Navigateurs web modernes (Chrome, Firefox, Safari, Edge)
- **Support navigateur/OS:** Dernières versions des navigateurs principaux
- **Exigences de performance:** 
  - Chargement initial < 2 secondes
  - Transitions fluides (60 FPS)
  - Audio sans latence perceptible

### Préférences Technologiques

- **Frontend:** Angular (version récente, LTS recommandée)
- **Backend:** Aucun (application entièrement côté client)
- **Base de données:** JSON statique dans assets/
- **Hébergement/Infrastructure:** GitHub Pages (gratuit)

### Considérations d'Architecture

- **Structure du dépôt:** Monorepo Angular standard
- **Architecture de service:** 
  - Services Angular pour logique métier
  - RxJS BehaviorSubject pour gestion d'état réactive
  - Pas d'architecture microservices (tout dans une SPA)
- **Exigences d'intégration:** 
  - API Elevenlabs (optionnelle, avec clé API)
  - Chargement de fichiers JSON statiques
  - localStorage pour persistance
- **Sécurité/Conformité:** 
  - Pas de données personnelles collectées
  - Clé API Elevenlabs stockée côté client (à sécuriser si nécessaire)
  - Pas de backend = pas de risques de sécurité serveur

### Structure des Données

- **nomenclature.json:** Structure hiérarchique Grade → Position → Attaque → Technique (intégré dans les fichiers sources du site, dans assets/)
- **videos.json:** Clés "attaque-technique" avec valeurs URLs vidéo (intégré dans les fichiers sources du site, dans assets/)
- **localStorage:** Réglages utilisateur (thème, voix, couleurs, etc.)

---

## Contraintes et Hypothèses

### Contraintes

- **Budget:** 0€ (tout doit être gratuit/open-source)
- **Timeline:** Développement le plus rapide possible
- **Ressources:** Développement personnel (pas d'équipe)
- **Techniques:** 
  - Framework Angular obligatoire
  - Hébergement GitHub Pages (gratuit)
  - Pas de backend (tout côté client)
  - Données JSON fournies par l'utilisateur

### Hypothèses Clés

1. **Données disponibles:** Les fichiers JSON complets (nomenclature + vidéos) seront intégrés directement dans les fichiers sources du site (dans le dossier assets/)
2. **Audios intégrés:** Les fichiers audio pré-enregistrés seront intégrés directement dans les fichiers sources du site (dans le dossier assets/)
3. **Structure JSON:** Le format JSON sera conforme à la structure décrite et sera maintenu dans le code source
4. **Navigateurs:** Les utilisateurs utiliseront des navigateurs modernes supportant les APIs nécessaires
5. **Utilisation:** L'application sera principalement utilisée sur mobile/tablette pendant l'entraînement
6. **Communauté:** Il existe une demande pour ce type d'outil dans la communauté Aïkido
7. **Maintenance des données:** Les fichiers JSON seront versionnés avec le code source, permettant des mises à jour via des commits Git

---

## Risques et Questions Ouvertes

### Risques Clés

1. **Qualité audio:** 
   - **Risque:** Les audios intégrés peuvent être de qualité variable
   - **Impact:** Expérience utilisateur dégradée
   - **Mitigation:** Tester les audios avant intégration, option Elevenlabs en fallback

2. **Performance avec gros JSON:**
   - **Risque:** Les fichiers JSON peuvent être volumineux (tous les grades)
   - **Impact:** Chargement lent, expérience dégradée
   - **Mitigation:** Optimisation du chargement, lazy loading, compression

3. **Compatibilité navigateurs:**
   - **Risque:** Certaines APIs (Fullscreen, Speech Synthesis) peuvent ne pas être supportées partout
   - **Impact:** Fonctionnalités non disponibles sur certains navigateurs
   - **Mitigation:** Détection de support, fallbacks, messages d'information

4. **Maintenance des données:**
   - **Risque:** Les JSON intégrés dans le code source doivent être mis à jour si la nomenclature change
   - **Impact:** Nécessite un redéploiement pour mettre à jour les données
   - **Mitigation:** Documentation claire, structure JSON flexible, processus de mise à jour documenté

5. **Variations entre écoles:**
   - **Risque:** Différentes écoles d'Aïkido peuvent avoir des variations dans la nomenclature
   - **Impact:** Application non adaptée à certaines écoles
   - **Mitigation:** Structure JSON flexible permettant plusieurs variantes

### Questions Ouvertes

1. **Structure exacte du JSON:** Format précis de nomenclature.json et videos.json à valider
2. **Gestion des erreurs audio:** Comment gérer les erreurs de chargement/lecture audio ?
3. **Mise à jour des données:** Processus de mise à jour des JSON intégrés (workflow Git, validation, tests)
4. **Support multilingue:** Faut-il prévoir une interface multilingue dès le MVP ?
5. **Analytics:** Faut-il intégrer des analytics (Google Analytics) pour mesurer l'usage ?
6. **Versioning des données:** Comment gérer les versions des JSON si la nomenclature évolue ?

### Domaines Nécessitant des Recherches Supplémentaires

1. **APIs de synthèse vocale gratuites:** Alternatives à Elevenlabs si nécessaire
2. **Optimisation Angular:** Meilleures pratiques pour performance avec gros datasets
3. **Accessibilité:** Support lecteurs d'écran, navigation clavier
4. **SEO:** Optimisation pour GitHub Pages (même si SPA)

---

## Annexes

### A. Résumé de la Recherche

**Résultats du brainstorming:**
- Session de brainstorming complète réalisée le 2024-12-19
- 50+ idées générées et organisées
- Techniques utilisées: Mind Mapping, First Principles Thinking, What If Scenarios, Morphological Analysis, SCAMPER
- Document complet: `docs/brainstorming-session-results.md`

**Décisions techniques prises:**
- Framework: Angular avec routing multi-pages
- État: RxJS BehaviorSubject
- Données: JSON statique
- Stockage: localStorage
- Audio: Audios locaux + option Elevenlabs
- Export: Fichier .txt
- Thèmes: Clair/sombre + couleurs personnalisables

### B. Input des Parties Prenantes

**Contraintes utilisateur:**
- Budget: 0€
- Framework: Angular obligatoire
- Hébergement: GitHub Pages
- Développement rapide souhaité
- Interface très intuitive

**Fonctionnalités essentielles identifiées:**
- Simulation audio réaliste
- Configuration flexible
- Export des passages
- Personnalisation visuelle
- Modes d'entraînement avancés (post-MVP)

### C. Références

- Documentation Angular: https://angular.io/docs
- GitHub Pages: https://pages.github.com/
- Web Speech API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
- Elevenlabs API: https://elevenlabs.io/docs
- RxJS: https://rxjs.dev/

---

## Prochaines Étapes

### Actions Immédiates

1. **Validation du Project Brief:** Révision et validation par l'utilisateur
2. **Préparation des données:** Création des fichiers JSON (nomenclature + vidéos) à intégrer dans assets/
3. **Préparation des audios:** Préparation des fichiers audio pré-enregistrés à intégrer dans assets/
4. **Création du projet Angular:** Initialisation du projet avec Angular CLI et intégration des fichiers JSON/audio

### Handoff PM

Ce Project Brief fournit le contexte complet pour **{{project_name}}**. Veuillez démarrer en mode "Génération de PRD", examiner le brief en détail pour créer le PRD section par section comme indiqué dans le template, en demandant toute clarification nécessaire ou en suggérant des améliorations.

**Points clés à retenir:**
- Application entièrement côté client (pas de backend)
- Budget zéro (tout gratuit/open-source)
- Framework Angular obligatoire
- Données JSON intégrées directement dans les fichiers sources (assets/)
- Audios intégrés directement dans les fichiers sources (assets/)
- Focus sur MVP avec fonctionnalités essentielles
- Vision post-MVP clairement définie

---

*Document créé en utilisant le framework BMAD-METHOD™*
