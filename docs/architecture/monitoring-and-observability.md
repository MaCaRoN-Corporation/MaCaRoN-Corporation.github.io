# Monitoring and Observability

# Monitoring Stack

- **Frontend Monitoring:** Optionnel - Google Analytics si souhaité pour usage
- **Backend Monitoring:** N/A - Pas de backend
- **Error Tracking:** Optionnel - Sentry ou similaire pour erreurs JavaScript
- **Performance Monitoring:** Optionnel - Lighthouse CI pour audits performance

**Note:** Pour MVP, monitoring optionnel. Focus sur tests manuels et validation.

## Key Metrics

**Frontend Metrics:**
- Core Web Vitals (LCP, FID, CLS)
- JavaScript errors (console errors)
- Temps de chargement initial
- Taille du bundle
- Utilisation localStorage (quota)

**Backend Metrics:**
- N/A - Pas de backend

**Métriques spécifiques à suivre:**
- Temps de chargement des fichiers JSON
- Taux d'erreur de chargement audio
- Performance des animations (60 FPS)
- Utilisation de l'API Elevenlabs (si activée)

---
