# Configuration des Enregistrements A pour keikohub.fr (sans www) dans IONOS

Guide détaillé pour configurer le domaine racine `keikohub.fr` avec des enregistrements A dans IONOS.

## 📋 Vue d'ensemble

Pour utiliser `keikohub.fr` (sans www) au lieu de `www.keikohub.fr`, vous devez configurer **4 enregistrements A** dans IONOS pointant vers les IPs GitHub Pages.

**IPs GitHub Pages (à utiliser) :**
- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

⚠️ **Important** : Ces IPs peuvent changer. Vérifiez régulièrement la [documentation GitHub](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-an-apex-domain).

---

## 🔧 Étapes Détaillées dans IONOS

### Étape 1 : Se connecter à IONOS

1. Allez sur [IONOS.fr](https://www.ionos.fr) ou [IONOS.com](https://www.ionos.com)
2. Connectez-vous à votre compte IONOS

### Étape 2 : Accéder à la gestion DNS du domaine racine

1. Dans le tableau de bord, cliquez sur **"Domaines & SSL"** (ou **"Domains & SSL"**)
2. Trouvez votre domaine `keikohub.fr` dans la liste
3. Cliquez sur l'**icône d'engrenage (⚙️)** dans la colonne **"Actions"** à droite du domaine
4. Dans le menu déroulant, sélectionnez **"Gestion DNS"** (ou **"DNS Management"** ou **"DNS Settings"**)

⚠️ **Important** : Vous devez être dans la gestion DNS du **domaine racine** `keikohub.fr`, PAS dans la gestion DNS d'un sous-domaine.

### Étape 3 : Supprimer les enregistrements existants (si nécessaire)

Si vous avez déjà un enregistrement CNAME pour `www` que vous ne voulez plus utiliser :
- Vous pouvez le laisser (il ne gênera pas)
- Ou le supprimer si vous voulez nettoyer

Si vous avez déjà des enregistrements A pour `keikohub.fr` avec de vieilles IPs :
- **Supprimez-les** avant d'ajouter les nouveaux

### Étape 4 : Ajouter les 4 enregistrements A

Vous devez créer **4 enregistrements A séparés**, un pour chaque IP.

#### Premier enregistrement A :

1. Cliquez sur **"AJOUTER UN ENREGISTREMENT"** (ou **"ADD RECORD"**)
2. Sélectionnez **"A"** dans la liste des types d'enregistrements
3. Remplissez les champs :
   - **Hostname** (ou **Nom d'hôte**) : `@` (ou laissez vide, ou `keikohub.fr`)
     - ⚠️ **Important** : Dans IONOS, pour le domaine racine, utilisez `@` ou laissez le champ vide
   - **Adresse IP** (ou **Points vers** / **Value**) : `185.199.108.153`
   - **TTL** (Time to Live) : `3600` (ou laissez la valeur par défaut)
4. Cliquez sur **"Enregistrer"** (ou **"Save"**)

#### Deuxième enregistrement A :

1. Cliquez à nouveau sur **"AJOUTER UN ENREGISTREMENT"**
2. Sélectionnez **"A"**
3. Remplissez les champs :
   - **Hostname** : `@` (ou vide)
   - **Adresse IP** : `185.199.109.153`
   - **TTL** : `3600`
4. Cliquez sur **"Enregistrer"**

#### Troisième enregistrement A :

1. Cliquez sur **"AJOUTER UN ENREGISTREMENT"**
2. Sélectionnez **"A"**
3. Remplissez les champs :
   - **Hostname** : `@` (ou vide)
   - **Adresse IP** : `185.199.110.153`
   - **TTL** : `3600`
4. Cliquez sur **"Enregistrer"**

#### Quatrième enregistrement A :

1. Cliquez sur **"AJOUTER UN ENREGISTREMENT"**
2. Sélectionnez **"A"**
3. Remplissez les champs :
   - **Hostname** : `@` (ou vide)
   - **Adresse IP** : `185.199.111.153`
   - **TTL** : `3600`
4. Cliquez sur **"Enregistrer"**

### Étape 5 : Vérifier la configuration

Une fois les 4 enregistrements créés, vous devriez voir dans la liste :

| Type | Hostname | Adresse IP | TTL |
|------|----------|------------|-----|
| A | @ (ou vide) | 185.199.108.153 | 3600 |
| A | @ (ou vide) | 185.199.109.153 | 3600 |
| A | @ (ou vide) | 185.199.110.153 | 3600 |
| A | @ (ou vide) | 185.199.111.153 | 3600 |

---

## 🔍 Vérification

### Vérifier depuis votre ordinateur

**Windows (PowerShell) :**
```powershell
nslookup keikohub.fr
```

**Résultat attendu :**
```
Nom:    keikohub.fr
Addresses:  185.199.108.153
            185.199.109.153
            185.199.110.153
            185.199.111.153
```

**Linux/Mac :**
```bash
dig keikohub.fr A
# ou
nslookup keikohub.fr
```

### Vérifier en ligne

- [whatsmydns.net](https://www.whatsmydns.net) - Entrez `keikohub.fr` et vérifiez que les 4 IPs apparaissent
- [mxtoolbox.com](https://mxtoolbox.com/DNSLookup.aspx) - Outil de vérification DNS

---

## ⚙️ Configuration dans GitHub

Une fois les enregistrements A configurés dans IONOS :

1. Allez sur votre repository GitHub : `MaCaRoN-Corporation/MaCaRoN-Corporation.github.io`
2. Cliquez sur **Settings** → **Pages**
3. Dans la section **"Custom domain"**, entrez : `keikohub.fr` (sans www)
4. Cochez **"Enforce HTTPS"** (recommandé)
5. Cliquez sur **"Save"**

**Note** : GitHub créera automatiquement un fichier CNAME avec `keikohub.fr` dans votre repository.

---

## ⚠️ Points Importants

### 1. Format du Hostname dans IONOS

Selon l'interface IONOS :
- **Ancienne interface** : Utilisez `@` pour le domaine racine
- **Nouvelle interface** : Vous pouvez utiliser `@`, laisser vide, ou entrer `keikohub.fr`
- **Si le champ est pré-rempli** : Laissez-le tel quel s'il contient déjà `@` ou est vide

### 2. Ne supprimez pas les autres enregistrements

- Gardez les enregistrements existants (MX pour les emails, etc.) si vous en avez
- Ne modifiez que les enregistrements A pour le domaine racine

### 3. Emails et autres services

- ⚠️ **Important** : Si vous avez des adresses email configurées avec `@keikohub.fr`, elles continueront de fonctionner normalement
- Les enregistrements A n'affectent que la résolution du domaine racine pour le web
- Les enregistrements MX (pour les emails) restent indépendants

### 4. Propagation DNS

- Les modifications DNS prennent effet immédiatement dans IONOS
- La propagation sur Internet peut prendre de **15 minutes à 48 heures**
- Généralement, la propagation est complète en 1 à 4 heures

### 5. Mise à jour des IPs

- ⚠️ **Important** : Les IPs GitHub Pages peuvent changer (rarement, mais c'est possible)
- Vérifiez régulièrement la [documentation GitHub](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-an-apex-domain)
- Si les IPs changent, mettez à jour les 4 enregistrements A dans IONOS

---

## 📝 Résumé des Valeurs à Entrer

| Enregistrement | Type | Hostname | Adresse IP | TTL |
|----------------|------|----------|------------|-----|
| 1 | A | @ (ou vide) | 185.199.108.153 | 3600 |
| 2 | A | @ (ou vide) | 185.199.109.153 | 3600 |
| 3 | A | @ (ou vide) | 185.199.110.153 | 3600 |
| 4 | A | @ (ou vide) | 185.199.111.153 | 3600 |

---

## ✅ Checklist

- [ ] Connecté à votre compte IONOS
- [ ] Accédé à "Domaines & SSL"
- [ ] Trouvé le domaine `keikohub.fr`
- [ ] Ouvert "Gestion DNS" du domaine racine (pas un sous-domaine)
- [ ] Ajouté le premier enregistrement A (185.199.108.153)
- [ ] Ajouté le deuxième enregistrement A (185.199.109.153)
- [ ] Ajouté le troisième enregistrement A (185.199.110.153)
- [ ] Ajouté le quatrième enregistrement A (185.199.111.153)
- [ ] Vérifié que les 4 enregistrements apparaissent dans la liste
- [ ] Configuré `keikohub.fr` dans GitHub Settings → Pages
- [ ] Activé "Enforce HTTPS" dans GitHub
- [ ] Vérifié la résolution DNS (nslookup ou outils en ligne)
- [ ] Attendu la propagation DNS (1-4 heures)

---

## 🔄 Si vous voulez aussi configurer www.keikohub.fr

Si vous voulez que `www.keikohub.fr` fonctionne également (redirection vers `keikohub.fr`) :

1. **Dans IONOS** : Ajoutez un enregistrement CNAME pour `www` pointant vers `keikohub.fr`
2. **Dans GitHub** : Ajoutez `www.keikohub.fr` comme domaine supplémentaire dans Settings → Pages
3. GitHub redirigera automatiquement `www.keikohub.fr` vers `keikohub.fr`

---

## 🔗 Prochaines Étapes

Une fois les enregistrements A configurés :

1. **Attendre la propagation DNS** (1-4 heures généralement)
2. **Configurer le domaine dans GitHub** : `keikohub.fr` (sans www)
3. **Attendre la génération du certificat SSL** (quelques minutes à quelques heures)
4. **Tester l'accès** : `https://keikohub.fr`

Voir aussi : 
- [Configuration d'un Domaine Personnalisé pour GitHub Pages](./custom-domain-setup.md)
- [Dépannage DNS](./troubleshooting-dns-error.md)
