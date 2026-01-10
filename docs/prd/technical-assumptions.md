# Technical Assumptions

# Repository Structure: Monorepo

L'application utilise une structure **Monorepo** standard Angular :

- Un seul dépôt Git contenant tout le code source
- Structure Angular standard avec `src/` comme dossier principal
- Fichiers JSON et audios dans `src/assets/`
- Configuration Angular dans la racine du projet
- Pas de sous-projets ou modules séparés nécessaires pour le MVP

**Rationale :** Structure simple et standard pour une application SPA, facilitant le développement, le déploiement sur GitHub Pages, et la maintenance.

## Service Architecture

**Architecture :** Application SPA (Single Page Application) monolithique côté client, sans backend.

**Services Angular prévus :**
- **GradeService :** Chargement et parsing des fichiers JSON (nomenclature.json, videos.json), gestion de la logique de génération de passages
- **PassageService :** Gestion de l'état du passage en cours (techniques, timer, progression), logique de génération aléatoire
- **AudioService :** Gestion de la lecture audio (audios locaux et option Elevenlabs), contrôle de la lecture, pause, répétition
- **SettingsService :** Gestion des réglages utilisateur (thème, couleurs, voix), persistance dans localStorage
- **ExportService :** Génération du fichier .txt avec les techniques et liens vidéo

**Communication :** RxJS BehaviorSubject pour la communication réactive entre composants et services.

**Rationale :** Architecture simple et modulaire avec services Angular, permettant une séparation claire des responsabilités tout en restant dans une SPA monolithique. Pas de microservices nécessaires pour cette application côté client.

## Testing Requirements

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

## Additional Technical Assumptions and Requests

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
