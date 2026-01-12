# Guide d'ajout d'une nouvelle voix

Ce document détaille toutes les étapes nécessaires pour ajouter une nouvelle voix dans l'application.

## Vue d'ensemble

L'application gère les voix de manière dynamique via un fichier JSON de configuration. Chaque voix nécessite :
1. Une entrée dans le fichier de configuration `voices.json`
2. Un dossier contenant les fichiers audio MP3
3. Une image d'avatar pour l'affichage dans l'interface
4. (Optionnel) Mise à jour de la liste de fallback dans le modèle TypeScript

## Structure des fichiers

### Organisation des dossiers

Les fichiers audio sont organisés selon la structure suivante :
```
src/assets/audio/
├── French/
│   ├── Male1/
│   │   ├── ai_hanmi_katate_dori.mp3
│   │   ├── ikkyo.mp3
│   │   └── ... (autres fichiers MP3)
│   ├── Male2/
│   ├── Male3/
│   ├── Female1/
│   ├── Female2/
│   └── Female3/
├── Japanese/
│   ├── Male1/
│   ├── Male2/
│   ├── Male3/
│   ├── Female1/
│   ├── Female2/
│   └── Female3/
└── voices.json
```

**Format du chemin audio :** `assets/audio/{language}/{voiceId}/{filename}.mp3`

## Étapes détaillées

### Étape 1 : Ajouter l'entrée dans `voices.json`

**Fichier :** `src/assets/audio/voices.json`

Ajoutez une nouvelle entrée JSON avec les propriétés suivantes :

```json
{
  "id": "Male4",
  "label": "Voix masculine 4",
  "displayName": "NouveauNom",
  "gender": "male",
  "language": "French"
}
```

**Propriétés requises :**
- `id` : Identifiant unique de la voix (ex: "Male4", "Female4"). **Important :** Cet ID doit correspondre au nom du dossier contenant les fichiers audio.
- `label` : Libellé descriptif de la voix (ex: "Voix masculine 4", "Voix féminine 4")
- `displayName` : Prénom à afficher dans l'interface utilisateur (ex: "Alexandre", "Sophie")
- `gender` : Genre de la voix (`"male"` ou `"female"`)
- `language` : Langue de la voix (`"French"` ou `"Japanese"`)

**Exemple complet :**
```json
[
  {
    "id": "Male1",
    "label": "Voix masculine 1",
    "displayName": "Alexandre",
    "gender": "male",
    "language": "French"
  },
  {
    "id": "Male4",
    "label": "Voix masculine 4",
    "displayName": "Pierre",
    "gender": "male",
    "language": "French"
  }
]
```

**Note :** Les IDs peuvent être dupliqués entre différentes langues (ex: "Male1" existe en French et en Japanese), mais doivent être uniques au sein d'une même langue.

### Étape 2 : Créer le dossier et ajouter les fichiers audio

**Structure :** `src/assets/audio/{language}/{voiceId}/`

1. Créez un nouveau dossier avec le nom correspondant à l'`id` de la voix
   - Exemple : Pour `"id": "Male4"` et `"language": "French"`, créez `src/assets/audio/French/Male4/`

2. Ajoutez tous les fichiers audio MP3 nécessaires dans ce dossier

**Liste des fichiers audio requis :**

Les fichiers audio doivent suivre la convention de nommage suivante (en minuscules avec underscores) :
- `ai_hanmi_katate_dori.mp3`
- `aiki_otoshi.mp3`
- `chudan_tsuki.mp3`
- `gokyo.mp3`
- `gyaku_hanmi_katate_dori.mp3`
- `hanmi_handachi_waza.mp3`
- `hiji_kime_osae.mp3`
- `ikkyo.mp3`
- `irimi_nage.mp3`
- `jo_dori.mp3`
- `jo_nage.mp3`
- `jo_tai_jo.mp3`
- `jodan_tsuki.mp3`
- `kata_dori_men_uchi.mp3`
- `kata_dori.mp3`
- `katate_dori.mp3`
- `katate_ryote_dori.mp3`
- `ken_tai_ken.mp3`
- `kokyu_nage.mp3`
- `koshi_nage.mp3`
- `kote_gaeshi.mp3`
- `kubi_nage.mp3`
- `kumijo.mp3`
- `mae_ryo_kata_dori.mp3`
- `muna_dori.mp3`
- `naname_kokyu_nage.mp3`
- `nikyo.mp3`
- `omote.mp3`
- `ryote_dori.mp3`
- `sankyo.mp3`
- `shiho_nage.mp3`
- `shomen_uchi.mp3`
- `sokumen_irimi_nage.mp3`
- `soto_kaiten_nage.mp3`
- `sumi_otoshi.mp3`
- `suwari_waza.mp3`
- `tachi_waza.mp3`
- `tanto_dori.mp3`
- `tenchi_nage.mp3`
- `uchi_kaiten_nage.mp3`
- `ude_garami.mp3`
- `ura.mp3`
- `ushiro_eri_dori.mp3`
- `ushiro_katate_dori_kubishime.mp3`
- `ushiro_ryo_kata_dori.mp3`
- `ushiro_ryote_dori.mp3`
- `yokomen_uchi.mp3`
- `yonkyo.mp3`

**Note :** Tous les fichiers ne sont pas obligatoires, mais il est recommandé d'avoir au minimum les techniques de base pour que la voix fonctionne correctement.

### Étape 3 : Ajouter l'image d'avatar

**Structure :** `src/assets/images/avatar/{language}/{voiceId}.png`

L'interface utilisateur affiche une image d'avatar pour chaque voix. Vous devez créer une image d'avatar pour la nouvelle voix.

1. Créez le dossier si nécessaire : `src/assets/images/avatar/{language}/`
   - Exemple : `src/assets/images/avatar/French/` ou `src/assets/images/avatar/Japanese/`

2. Ajoutez l'image d'avatar avec le nom correspondant à l'`id` de la voix
   - Format : `{voiceId}.png`
   - Exemple : Pour `"id": "Male4"` et `"language": "French"`, créez `src/assets/images/avatar/French/Male4.png`

**Spécifications recommandées pour l'image :**
- Format : PNG (avec transparence de préférence)
- Taille : 200x200 pixels ou plus (sera redimensionnée par CSS)
- Ratio : 1:1 (carré)
- Contenu : Portrait ou icône représentant la voix

**Note :** Si l'image n'existe pas, l'interface affichera une image cassée. Il est donc important de fournir une image d'avatar pour chaque voix.

### Étape 4 : (Optionnel) Mettre à jour la liste de fallback

**Fichier :** `src/app/models/settings.model.ts`

**Ligne :** ~64-71 (constante `AVAILABLE_VOICES`)

Cette liste sert de fallback si le fichier `voices.json` ne peut pas être chargé. Il est recommandé de l'ajouter pour maintenir la cohérence :

```typescript
export const AVAILABLE_VOICES: Voice[] = [
  { id: 'Male1', label: 'Voix masculine 1', displayName: 'Alexandre', gender: 'male', language: 'French' },
  { id: 'Male2', label: 'Voix masculine 2', displayName: 'Thomas', gender: 'male', language: 'French' },
  { id: 'Male3', label: 'Voix masculine 3', displayName: 'Lucas', gender: 'male', language: 'French' },
  { id: 'Male4', label: 'Voix masculine 4', displayName: 'Pierre', gender: 'male', language: 'French' }, // NOUVELLE VOIX
  { id: 'Female1', label: 'Voix féminine 1', displayName: 'Sophie', gender: 'female', language: 'French' },
  { id: 'Female2', label: 'Voix féminine 2', displayName: 'Emma', gender: 'female', language: 'French' },
  { id: 'Female3', label: 'Voix féminine 3', displayName: 'Léa', gender: 'female', language: 'French' }
];
```

**Note :** Cette étape est optionnelle car l'application charge dynamiquement les voix depuis `voices.json`. Cependant, elle garantit que la voix sera disponible même en cas d'erreur de chargement du JSON.

## Génération des fichiers audio avec ElevenLabs

Si vous souhaitez générer les fichiers audio via l'API ElevenLabs, utilisez le script Python fourni.

### Utilisation du script `generate-elevens-audio.py`

**Fichier :** `scripts/generate-elevens-audio.py`

**Configuration requise :**

1. Modifiez les variables de configuration en haut du script :
   ```python
   API_KEY = "votre_cle_api_elevenlabs"
   VOICE_ID = "id_de_la_voix_elevenlabs"  # Ex: "6wdSVG3CMjPfAthsnMv9" pour Male3
   OUTPUT_DIR = "../src/assets/audio/French/Male4"  # Chemin vers le nouveau dossier
   MODEL_ID = "eleven_multilingual_v2"
   ```

2. Exécutez le script :
   ```bash
   cd scripts
   python generate-elevens-audio.py
   ```

**Notes importantes :**
- Le script génère automatiquement tous les fichiers audio listés dans `TEXT_LIST`
- Les noms de fichiers sont automatiquement sanitizés (minuscules, underscores, etc.)
- Le script crée le dossier de sortie s'il n'existe pas
- Assurez-vous d'avoir une clé API ElevenLabs valide

**IDs de voix ElevenLabs disponibles (exemples) :**
- M1 (Male1) : `"3JDquces8E8bkmvbh6Bc"`
- F1 (Female1) : `"wcs09USXSN5Bl7FXohVZ"`
- M2 (Male2) : `"LIisRj2veIKEBdr6KZ5y"`
- F2 (Female2) : `"GxhGYQesaQaYKePCZDEC"`
- F3 (Female3) : `"8kgj5469z1URcH4MB2G4"`
- M3 (Male3) : `"6wdSVG3CMjPfAthsnMv9"`

## Vérification et test

### 1. Vérifier le chargement des voix

1. Démarrez l'application
2. Allez dans la page de configuration (`/config`)
3. Vérifiez que la nouvelle voix apparaît dans la liste de sélection
4. Sélectionnez la nouvelle voix et testez la prévisualisation audio

### 2. Vérifier le format de l'ID complet

L'application utilise un format d'ID complet : `{language}_{id}`

- Exemple : `French_Male4` ou `Japanese_Female1`
- Cette construction est automatique via la fonction `getFullVoiceId()` dans `settings.model.ts`

### 3. Vérifier le cache du VoiceService

Si vous modifiez `voices.json` pendant le développement, vous devrez peut-être vider le cache :

Le `VoiceService` met en cache les voix. Pour forcer un rechargement :
- Redémarrez l'application, ou
- Utilisez la méthode `clearCache()` du service (si disponible dans les outils de développement)

## Architecture technique

### Flux de chargement des voix

1. **VoiceService** (`src/app/services/voice.service.ts`)
   - Charge `assets/audio/voices.json` via HTTP
   - Met en cache les résultats
   - Retourne un Observable de `Voice[]`

2. **ConfigComponent** (`src/app/pages/config/config.ts`)
   - Appelle `voiceService.getAvailableVoices()`
   - Filtre les voix par langue (`frenchVoices`, `japaneseVoices`)
   - Affiche les voix dans l'interface utilisateur

3. **SettingsService** (`src/app/services/settings.service.ts`)
   - Persiste la voix sélectionnée dans `localStorage`
   - Format de stockage : `{language}_{id}` (ex: `"French_Male4"`)

4. **AudioService** (`src/app/services/audio.service.ts`) - À implémenter
   - Utilisera le `voiceId` pour construire le chemin audio
   - Format attendu : `assets/audio/{language}/{voiceId}/{technique}.mp3`

### Format de l'ID de voix

L'application utilise deux formats :

1. **Format complet** (pour le stockage et l'utilisation) : `{language}_{id}`
   - Exemple : `"French_Male4"`, `"Japanese_Female1"`
   - Utilisé dans `UserSettings.voice`

2. **Format simple** (dans `voices.json`) : `{id}`
   - Exemple : `"Male4"`, `"Female1"`
   - La langue est spécifiée séparément dans le champ `language`

Les fonctions utilitaires dans `settings.model.ts` gèrent la conversion :
- `getFullVoiceId(voice: Voice)` : Construit l'ID complet
- `parseVoiceId(fullVoiceId: VoiceId)` : Extrait la langue et l'ID

## Résolution de problèmes

### La voix n'apparaît pas dans la liste

1. Vérifiez que `voices.json` est valide (syntaxe JSON correcte)
2. Vérifiez que l'entrée JSON contient tous les champs requis
3. Vérifiez la console du navigateur pour les erreurs de chargement
4. Videz le cache du navigateur et rechargez la page

### Les fichiers audio ne se chargent pas

1. Vérifiez que le dossier existe : `src/assets/audio/{language}/{voiceId}/`
2. Vérifiez que le nom du dossier correspond exactement à l'`id` dans `voices.json`
3. Vérifiez que les fichiers MP3 sont présents et nommés correctement
4. Vérifiez que les fichiers ne sont pas corrompus

### L'avatar ne s'affiche pas

1. Vérifiez que le fichier existe : `src/assets/images/avatar/{language}/{voiceId}.png`
2. Vérifiez que le nom du fichier correspond exactement à l'`id` dans `voices.json` (avec l'extension `.png`)
3. Vérifiez que le fichier image n'est pas corrompu
4. Vérifiez la console du navigateur pour les erreurs 404 (fichier non trouvé)

### Erreur de prévisualisation audio

1. Vérifiez qu'au moins un fichier audio de prévisualisation existe dans le dossier
2. Les fichiers de prévisualisation utilisés sont listés dans `PREVIEW_AUDIO_FILES` dans `config.ts`
3. Vérifiez la console pour les erreurs de chargement audio

## Checklist complète

- [ ] Ajout de l'entrée dans `src/assets/audio/voices.json`
- [ ] Création du dossier `src/assets/audio/{language}/{voiceId}/`
- [ ] Ajout des fichiers audio MP3 dans le dossier
- [ ] Création de l'image d'avatar `src/assets/images/avatar/{language}/{voiceId}.png`
- [ ] (Optionnel) Mise à jour de `AVAILABLE_VOICES` dans `settings.model.ts`
- [ ] Test de l'affichage dans la page de configuration
- [ ] Test de la prévisualisation audio
- [ ] Vérification que l'avatar s'affiche correctement
- [ ] Vérification que la voix est persistée dans les réglages
- [ ] Vérification que les fichiers audio se chargent correctement

## Notes importantes

1. **Nommage des fichiers** : Les noms de fichiers doivent être en minuscules avec des underscores (ex: `ai_hanmi_katate_dori.mp3`)

2. **Cohérence des IDs** : L'`id` dans `voices.json` doit correspondre exactement au nom du dossier contenant les fichiers audio

3. **Langues supportées** : Actuellement, seules `"French"` et `"Japanese"` sont supportées dans le type `VoiceLanguage`

4. **Extension future** : Pour ajouter une nouvelle langue, il faudra :
   - Ajouter la langue dans le type `VoiceLanguage` dans `settings.model.ts`
   - Créer un nouveau dossier `src/assets/audio/{nouvelle_langue}/`
   - Ajouter les voix dans `voices.json` avec `"language": "{nouvelle_langue}"`

5. **Performance** : Les fichiers audio sont chargés à la demande. Assurez-vous que les fichiers ne sont pas trop volumineux pour une bonne performance.

## Exemple complet : Ajout de "Male4" en français

### 1. Modifier `voices.json`

```json
[
  // ... voix existantes ...
  {
    "id": "Male4",
    "label": "Voix masculine 4",
    "displayName": "Pierre",
    "gender": "male",
    "language": "French"
  }
]
```

### 2. Créer le dossier et les fichiers audio

```bash
mkdir -p src/assets/audio/French/Male4
# Copier ou générer les fichiers MP3 dans ce dossier
```

### 3. Créer l'image d'avatar

```bash
mkdir -p src/assets/images/avatar/French
# Créer ou copier l'image Male4.png dans ce dossier
```

### 4. (Optionnel) Mettre à jour `settings.model.ts`

```typescript
export const AVAILABLE_VOICES: Voice[] = [
  // ... voix existantes ...
  { id: 'Male4', label: 'Voix masculine 4', displayName: 'Pierre', gender: 'male', language: 'French' }
];
```

### 5. Tester

1. Démarrer l'application
2. Aller dans `/config`
3. Vérifier que "Pierre" apparaît dans la liste des voix masculines françaises
4. Vérifier que l'avatar s'affiche correctement
5. Sélectionner la voix et tester la prévisualisation audio

---

**Dernière mise à jour :** Ce guide est basé sur l'architecture actuelle de l'application. Si des modifications sont apportées à la structure, ce document devra être mis à jour en conséquence.
