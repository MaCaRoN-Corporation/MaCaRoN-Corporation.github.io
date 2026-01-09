# Requirements

# Functional

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

## Non Functional

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
