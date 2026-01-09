# Coding Standards

# Critical Fullstack Rules

- **Service Injection:** Toujours utiliser `providedIn: 'root'` pour les services Angular
- **RxJS Unsubscription:** Toujours gérer les unsubscriptions dans `ngOnDestroy` pour éviter les memory leaks
- **Type Safety:** Utiliser TypeScript strict mode, éviter `any`, typer toutes les interfaces
- **Error Handling:** Tous les appels HTTP doivent gérer les erreurs avec `catchError`
- **State Management:** Utiliser BehaviorSubject pour l'état réactif, éviter les mutations directes
- **Component Lifecycle:** Implémenter `OnInit` et `OnDestroy` pour initialisation et nettoyage
- **localStorage:** Toujours gérer les erreurs de quota localStorage avec try/catch
- **Audio Loading:** Gérer les erreurs de chargement audio avec fallback gracieux
- **Responsive Design:** Utiliser CSS Variables pour thèmes, media queries pour responsive

## Naming Conventions

| Element | Frontend | Backend | Example |
|---------|----------|---------|---------|
| Components | PascalCase | - | `TimerDisplayComponent` |
| Services | camelCase with 'Service' | - | `gradeService` |
| Models/Interfaces | PascalCase | - | `Passage`, `Technique` |
| Files | kebab-case | - | `timer-display.component.ts` |
| Methods | camelCase | - | `generatePassage()` |
| Constants | UPPER_SNAKE_CASE | - | `MAX_HISTORY_SIZE` |
| CSS Classes | kebab-case | - | `.timer-display` |
| CSS Variables | kebab-case with -- | - | `--primary-color` |

---
