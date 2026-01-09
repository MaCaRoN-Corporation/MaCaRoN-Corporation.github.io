# API Specification

**N/A - Pas d'API backend**

Cette application fonctionne entièrement côté client sans backend. Les seules intégrations externes sont:

1. **API Elevenlabs (optionnelle):** Pour la synthèse vocale
   - Appelée directement depuis le navigateur
   - Authentification via clé API stockée côté client (limitation documentée)
   - Fallback vers audios locaux si API indisponible

---
