# Epic 2: Data Management & Configuration

**Objectif étendu :** Implémenter la gestion complète des données (chargement et parsing des fichiers JSON), créer le GradeService pour gérer la logique des grades et la nomenclature, et développer la page de configuration complète permettant à l'utilisateur de sélectionner le grade et tous les filtres nécessaires avant de générer un passage. Cet epic établit les fondations de données essentielles pour la génération de passages.

# Story 2.1: JSON Data Loading Service

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

## Story 2.2: JSON Parsing and Data Structure

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

## Story 2.3: Grade Selection Interface

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

## Story 2.4: Time Configuration Controls

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

## Story 2.5: Voice Selection Interface

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

## Story 2.6: Position Filtering Interface

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

## Story 2.7: Attack and Technique Filtering Interface

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

## Story 2.8: Weapons and Randori Configuration

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

## Story 2.9: Configuration Page Complete Integration

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
