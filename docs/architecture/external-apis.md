# External APIs

# Elevenlabs API (Optionnelle)

- **Purpose:** Synthèse vocale pour les annonces audio des techniques
- **Documentation:** https://elevenlabs.io/docs
- **Base URL(s):** https://api.elevenlabs.io/v1
- **Authentication:** API Key dans header `xi-api-key`
- **Rate Limits:** Selon plan utilisateur (gratuit: limité)

**Key Endpoints Used:**
- `POST /v1/text-to-speech/{voice_id}` - Génère l'audio à partir du texte

**Integration Notes:**
- Clé API stockée côté client dans localStorage (limitation de sécurité documentée)
- Fallback automatique vers audios locaux si API indisponible ou erreur
- Cache des audios générés pour éviter appels répétés
- Gestion d'erreurs gracieuse avec messages utilisateur clairs

---
