# Configuration DNS IONOS pour www.keikohub.fr

Guide spécifique pour configurer le DNS sur IONOS afin de pointer `www.keikohub.fr` vers GitHub Pages.

## 📋 Étapes Détaillées pour IONOS

### Étape 1 : Se connecter à IONOS

1. Allez sur [IONOS.fr](https://www.ionos.fr) ou [IONOS.com](https://www.ionos.com)
2. Connectez-vous à votre compte IONOS avec vos identifiants

### Étape 2 : Accéder à la gestion DNS

1. Une fois connecté, dans le tableau de bord, cliquez sur **"Domaines & SSL"** (ou **"Domains & SSL"**)
2. Trouvez votre domaine `keikohub.fr` dans la liste
3. Cliquez sur l'**icône d'engrenage (⚙️)** dans la colonne **"Actions"** à droite du domaine
4. Dans le menu déroulant, sélectionnez **"Gérer les sous-domaines"** (ou **"Manage Subdomains"**)

### Étape 3 : Configurer le sous-domaine www

1. Dans la liste des sous-domaines, trouvez **`www`**
   - Si `www` n'existe pas encore, vous devrez peut-être le créer d'abord (IONOS le crée parfois automatiquement)
   
2. Cliquez sur l'**icône d'engrenage (⚙️)** à droite du sous-domaine `www`
3. Sélectionnez **"DNS"** dans le menu déroulant

### Étape 4 : Ajouter l'enregistrement CNAME

1. Dans la page de gestion DNS du sous-domaine `www`, cliquez sur **"AJOUTER UN ENREGISTREMENT"** (ou **"ADD RECORD"**)
2. Sélectionnez **"CNAME"** dans la liste des types d'enregistrements
3. Remplissez les champs :
   - **Hostname** (ou **Nom d'hôte**) : `www`
     - ⚠️ **Important** : Certaines interfaces IONOS demandent juste `www`, d'autres peuvent demander `www.keikohub.fr` ou laisser vide si vous êtes déjà dans la configuration du sous-domaine www
   - **Points vers** (ou **Points to**) : `MaCaRoN-Corporation.github.io`
     - ⚠️ **Important** : Entrez exactement `MaCaRoN-Corporation.github.io` (sans `http://` ou `https://`)
   - **TTL** (Time to Live) : Laissez la valeur par défaut (généralement 3600 secondes = 1 heure)
4. Cliquez sur **"Enregistrer"** (ou **"Save"**)

### Étape 5 : Vérifier la configuration

1. Une fois l'enregistrement créé, vous devriez voir l'enregistrement CNAME dans la liste :
   - Type : `CNAME`
   - Nom : `www` (ou `www.keikohub.fr`)
   - Valeur : `MaCaRoN-Corporation.github.io`
   - TTL : `3600` (ou la valeur que vous avez définie)

2. **Note importante** : 
   - Les modifications DNS prennent effet immédiatement dans IONOS
   - La propagation sur Internet peut prendre de **15 minutes à 48 heures**
   - Généralement, la propagation est complète en 1 à 4 heures

---

## 🔍 Vérification de la Configuration

### Vérifier depuis votre ordinateur

Une fois la propagation DNS terminée, vous pouvez vérifier avec ces commandes :

**Windows (PowerShell ou Invite de commande) :**
```powershell
nslookup www.keikohub.fr
```

**Résultat attendu :**
```
Nom:    MaCaRoN-Corporation.github.io
Address: [une adresse IP]
```

**Linux/Mac :**
```bash
dig www.keikohub.fr CNAME
# ou
nslookup www.keikohub.fr
```

### Vérifier en ligne

Vous pouvez également utiliser des outils en ligne pour vérifier la propagation DNS :
- [whatsmydns.net](https://www.whatsmydns.net) - Vérifie la propagation DNS dans le monde entier
- [mxtoolbox.com](https://mxtoolbox.com/CNAMELookup.aspx) - Outil de vérification CNAME

---

## ⚠️ Points Importants Spécifiques IONOS

### 1. Le sous-domaine www doit exister

- Si le sous-domaine `www` n'apparaît pas dans la liste, vous devrez peut-être le créer d'abord
- Dans certains cas, IONOS crée automatiquement le sous-domaine `www` lors de l'achat du domaine

### 2. Format du Hostname

Selon l'interface IONOS que vous utilisez :
- **Ancienne interface** : Vous entrez `www` dans le champ Hostname
- **Nouvelle interface** : Le champ peut être pré-rempli ou vous entrez juste `www`
- **Si vous êtes déjà dans la configuration DNS du sous-domaine www** : Le champ Hostname peut être vide ou pré-rempli avec `www`

### 3. Ne supprimez pas les autres enregistrements

- Gardez les enregistrements existants (A, MX pour les emails, etc.) si vous en avez
- Ne modifiez que le CNAME pour le sous-domaine `www`

### 4. Emails et autres services

- ⚠️ **Important** : Si vous avez des adresses email configurées avec `@keikohub.fr`, elles continueront de fonctionner normalement
- Seul le sous-domaine `www.keikohub.fr` pointera vers GitHub Pages
- Le domaine racine `keikohub.fr` (sans www) n'est pas affecté par cette configuration

---

## 🔄 Si vous voulez aussi configurer keikohub.fr (sans www)

Si vous souhaitez que `keikohub.fr` (sans www) fonctionne également, vous avez deux options :

### Option A : Rediriger keikohub.fr vers www.keikohub.fr (recommandé)

1. Dans IONOS, allez dans la gestion DNS du domaine racine `keikohub.fr` (pas le sous-domaine www)
2. Configurez une redirection :
   - **Type** : Redirection (si disponible dans IONOS)
   - **Source** : `keikohub.fr`
   - **Destination** : `www.keikohub.fr`
   - **Type de redirection** : 301 (permanente)

### Option B : Configurer des enregistrements A pour le domaine racine

Si vous voulez que `keikohub.fr` pointe directement vers GitHub Pages :

1. Dans la gestion DNS du domaine racine `keikohub.fr`, ajoutez des enregistrements **A**
2. Ajoutez les IPs GitHub Pages (consultez la [documentation GitHub](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-an-apex-domain) pour les IPs à jour)
3. ⚠️ **Note** : Les IPs GitHub Pages peuvent changer, il faut les mettre à jour régulièrement

**Recommandation** : Utilisez l'Option A (redirection) car c'est plus simple et plus stable.

---

## 📝 Résumé des Valeurs à Entrer

| Champ | Valeur |
|-------|--------|
| **Type d'enregistrement** | `CNAME` |
| **Hostname/Nom d'hôte** | `www` |
| **Points vers/Points to** | `MaCaRoN-Corporation.github.io` |
| **TTL** | `3600` (valeur par défaut) |

---

## ✅ Checklist IONOS

- [ ] Connecté à votre compte IONOS
- [ ] Accédé à "Domaines & SSL"
- [ ] Trouvé le domaine `keikohub.fr`
- [ ] Ouvert "Gérer les sous-domaines"
- [ ] Trouvé/accédé au sous-domaine `www`
- [ ] Ouvert la configuration DNS du sous-domaine `www`
- [ ] Ajouté un enregistrement CNAME
- [ ] Rempli correctement les champs (www → MaCaRoN-Corporation.github.io)
- [ ] Sauvegardé la configuration
- [ ] Vérifié que l'enregistrement apparaît dans la liste

---

## 🔗 Prochaines Étapes

Une fois le DNS configuré sur IONOS :

1. **Attendre la propagation DNS** (1-4 heures généralement)
2. **Configurer le domaine dans GitHub** :
   - Aller dans Settings → Pages du repository
   - Ajouter `www.keikohub.fr` dans "Custom domain"
   - Cocher "Enforce HTTPS"
3. **Attendre la génération du certificat SSL** (quelques minutes à quelques heures)
4. **Tester l'accès** : `https://www.keikohub.fr`

Voir aussi : [Configuration d'un Domaine Personnalisé pour GitHub Pages](./custom-domain-setup.md)
