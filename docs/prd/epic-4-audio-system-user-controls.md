# Epic 4: Audio System & User Controls

**Objectif étendu :** Intégrer le système audio complet permettant l'annonce des techniques et attaques via audios pré-enregistrés ou l'API Elevenlabs, créer l'AudioService pour gérer toute la logique audio, et implémenter tous les contrôles utilisateur (pause, répéter, plein écran, raccourcis clavier) pour offrir une expérience d'entraînement complète et contrôlable.

# Story 4.1: Audio Service with Local Audio Files

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

## Story 4.2: Elevenlabs API Integration (Optional)

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

## Story 4.3: Audio Playback During Passage

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

## Story 4.4: Pause and Resume Controls

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

## Story 4.5: Repeat Last Technique Control

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

## Story 4.6: Fullscreen Mode Implementation

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

## Story 4.7: Keyboard Shortcuts

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
