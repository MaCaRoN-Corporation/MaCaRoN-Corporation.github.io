# Epic 3: Passage Generation & Core Execution

**Status:** ✅ **COMPLETE**  
**Completion Date:** 2026-01-14  
**Summary:** `docs/prd/epic-3-completion-summary.md`

**Objectif étendu :** Développer le cœur fonctionnel de l'application en créant l'algorithme de génération aléatoire de passages respectant l'ordre strict traditionnel (Suwariwaza → Hanmi Handachi → Tashiwaza → Armes → Randori), implémenter le PassageService pour gérer l'état et la logique des passages, et créer la page de passage complète avec tous les éléments visuels nécessaires (timer, compte à rebours, affichage des techniques, historique, progression). Cet epic délivre la fonctionnalité principale permettant à l'utilisateur de s'entraîner avec des passages de grade générés.

# Story 3.1: Passage Generation Algorithm

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
9. **Randori:** Si `includeRandoriTime` est activé dans la configuration, l'algorithme doit :
   - Synchroniser `includeRandoriTime` (PassageConfig) avec `filters.includeRandori` (PassageFilters) lors de la génération
   - Ajouter une annonce audio finale "Randori" à la fin de la séquence de techniques
   - Utiliser le temps configuré (`randoriTime: 3 minutes` fixe) pour la durée de l'annonce Randori
   - L'annonce Randori n'est pas une technique avec position/attaque, mais une annonce audio finale optionnelle

## Story 3.2: Passage State Management

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
8. **Randori:** L'état du passage doit inclure l'information si l'annonce Randori est activée (`includeRandoriTime`), et gérer la transition vers l'annonce Randori après la dernière technique si activée

## Story 3.3: Passage Page Layout and Timer

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

## Story 3.4: Countdown Visual Display

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

## Story 3.5: Current Technique Display

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

## Story 3.6: Technique History Display

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

## Story 3.7: Progress Indicator

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

## Story 3.8: Passage Completion and End Screen

As a user,
I want voir un message de fin quand le passage est terminé,
so que je sais que l'entraînement est complet.

**Acceptance Criteria:**

1. Quand toutes les techniques ont été énoncées (et l'annonce Randori si activée), un écran de fin s'affiche
2. L'écran de fin affiche un message de félicitations/completion
3. Un résumé du passage est affiché (nombre de techniques, durée totale, incluant le temps Randori si activé)
4. Un bouton "Exporter" est disponible pour exporter le passage
5. Un bouton "Nouveau passage" permet de générer un nouveau passage
6. Un bouton "Retour à l'accueil" permet de revenir à la page d'accueil
7. L'écran de fin est clair et encourageant
8. **Randori:** Si `includeRandoriTime` était activé, l'écran de fin indique que l'annonce Randori a été incluse dans le passage

---
