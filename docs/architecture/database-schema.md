# Database Schema

**N/A - Pas de base de données**

L'application utilise `localStorage` pour la persistance locale:

**localStorage Keys:**
- `keiko-hub-settings`: UserSettings (JSON stringifié)
- `keiko-hub-history`: Passage[] (JSON stringifié, limité à 50 passages)
- `keiko-hub-last-grade`: string (dernier grade utilisé, pour config par défaut)

**Structure localStorage:**
```typescript
// keiko-hub-settings
{
  theme: 'clair' | 'sombre',
  voice: 'masculin' | 'féminin',
  bannerColor: '#hex',
  footerColor: '#hex',
  elevenlabsApiKey: string | null
}

// keiko-hub-history
Passage[] // Array de passages, FIFO si > 50

// keiko-hub-last-grade
string // Grade string (ex: "6e Kyū")
```

---
