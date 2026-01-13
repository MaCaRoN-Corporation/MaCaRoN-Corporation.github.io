# Dépannage : Erreur "NotServedByPagesError" - Domain does not resolve

## 🔴 Problème

Erreur dans GitHub Pages : `keikohub.fr is improperly configured - Domain does not resolve to the GitHub Pages server (NotServedByPagesError)`

## 🔍 Diagnostic

Cette erreur signifie que GitHub ne peut pas résoudre votre domaine vers ses serveurs. Causes possibles :

1. **Incohérence entre le domaine configuré dans GitHub et le DNS**
2. **DNS mal configuré dans IONOS**
3. **Propagation DNS incomplète**
4. **Domaine racine vs sous-domaine mal configuré**

---

## ✅ Solution Étape par Étape

### Étape 1 : Vérifier ce qui est configuré dans GitHub

1. Allez sur votre repository GitHub : `MaCaRoN-Corporation/MaCaRoN-Corporation.github.io`
2. Cliquez sur **Settings** → **Pages**
3. Regardez dans la section **"Custom domain"** :
   - Quel domaine est affiché ? `keikohub.fr` ou `www.keikohub.fr` ?
   - Y a-t-il un message d'erreur ?

**Notez ce que vous voyez** - c'est important pour la suite.

---

### Étape 2 : Vérifier la configuration DNS dans IONOS

#### Option A : Si vous avez configuré `www.keikohub.fr` (recommandé)

1. Connectez-vous à IONOS
2. Allez dans **Domaines & SSL** → `keikohub.fr` → **Gérer les sous-domaines**
3. Cliquez sur le sous-domaine `www` → **DNS**
4. Vérifiez qu'il y a un enregistrement **CNAME** :
   - **Type** : `CNAME`
   - **Hostname** : `www`
   - **Points vers** : `MaCaRoN-Corporation.github.io`

#### Option B : Si vous avez configuré `keikohub.fr` (sans www)

1. Connectez-vous à IONOS
2. Allez dans **Domaines & SSL** → `keikohub.fr` → **Gestion DNS** (du domaine racine)
3. Vérifiez qu'il y a **4 enregistrements A** avec ces IPs :
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`

⚠️ **Important** : Vérifiez les IPs à jour sur la [documentation GitHub](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-an-apex-domain)

---

### Étape 3 : Vérifier la résolution DNS depuis votre ordinateur

**Windows (PowerShell) :**
```powershell
# Pour www.keikohub.fr
nslookup www.keikohub.fr

# Pour keikohub.fr (sans www)
nslookup keikohub.fr
```

**Résultat attendu pour www.keikohub.fr :**
```
Nom:    MaCaRoN-Corporation.github.io
Address: [une adresse IP GitHub]
```

**Résultat attendu pour keikohub.fr (sans www) :**
```
Address:  185.199.108.153
Address:  185.199.109.153
Address:  185.199.110.153
Address:  185.199.111.153
```

**Si vous obtenez une erreur ou une IP différente**, le DNS n'est pas correctement configuré.

---

### Étape 4 : Vérifier en ligne

Utilisez ces outils pour vérifier la propagation DNS :

1. **[whatsmydns.net](https://www.whatsmydns.net)** - Entrez `www.keikohub.fr` ou `keikohub.fr`
2. **[mxtoolbox.com](https://mxtoolbox.com/CNAMELookup.aspx)** - Pour vérifier le CNAME

---

## 🔧 Solutions selon votre cas

### Solution 1 : Utiliser `www.keikohub.fr` (⭐ RECOMMANDÉ)

C'est la solution la plus simple et la plus stable.

#### Dans IONOS :
1. Assurez-vous d'avoir un **CNAME** pour `www` pointant vers `MaCaRoN-Corporation.github.io`
2. Si vous avez des enregistrements A pour le domaine racine `keikohub.fr`, **supprimez-les** (sauf si vous en avez besoin pour autre chose)

#### Dans GitHub :
1. Allez dans **Settings** → **Pages**
2. Dans **"Custom domain"**, entrez : `www.keikohub.fr`
3. Cochez **"Enforce HTTPS"**
4. Cliquez sur **"Save"**
5. Attendez quelques minutes

#### Vérification :
- Le fichier CNAME dans le workflow est déjà configuré pour `www.keikohub.fr` ✅
- Attendez 15-30 minutes après avoir changé la configuration GitHub
- Vérifiez que l'erreur disparaît dans GitHub

---

### Solution 2 : Utiliser `keikohub.fr` (sans www)

Si vous préférez utiliser le domaine racine (moins recommandé car plus complexe).

#### Dans IONOS :
1. Allez dans **Domaines & SSL** → `keikohub.fr` → **Gestion DNS**
2. Supprimez tout enregistrement CNAME pour `www` (si vous ne l'utilisez plus)
3. Ajoutez **4 enregistrements A** pour le domaine racine :
   - **Type** : `A`
   - **Hostname** : `@` (ou vide, ou `keikohub.fr`)
   - **Adresse IP** : `185.199.108.153` (premier enregistrement)
   - **Adresse IP** : `185.199.109.153` (deuxième enregistrement)
   - **Adresse IP** : `185.199.110.153` (troisième enregistrement)
   - **Adresse IP** : `185.199.111.153` (quatrième enregistrement)
   - **TTL** : `3600`

⚠️ **Important** : Vérifiez que ces IPs sont toujours à jour sur la [documentation GitHub](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-an-apex-domain)

#### Dans GitHub :
1. Allez dans **Settings** → **Pages**
2. Dans **"Custom domain"**, entrez : `keikohub.fr` (sans www)
3. Cochez **"Enforce HTTPS"**
4. Cliquez sur **"Save"**

#### Modifier le workflow :
Le workflow crée actuellement un CNAME pour `www.keikohub.fr`. Si vous utilisez `keikohub.fr`, vous devez soit :
- Supprimer la création du fichier CNAME (GitHub le créera automatiquement)
- Ou ne rien changer (le fichier CNAME avec www ne sera pas utilisé)

---

## 🎯 Solution Recommandée : Utiliser www.keikohub.fr

**Pourquoi ?**
- ✅ Plus simple (CNAME au lieu de 4 enregistrements A)
- ✅ Plus stable (pas besoin de mettre à jour les IPs)
- ✅ Meilleur pour le SEO (standard de l'industrie)
- ✅ Déjà configuré dans le workflow

**Étapes :**

1. **Dans IONOS** : Vérifiez que le CNAME pour `www` pointe vers `MaCaRoN-Corporation.github.io`
2. **Dans GitHub** : Configurez `www.keikohub.fr` dans Settings → Pages
3. **Attendez 15-30 minutes**
4. **Vérifiez** que l'erreur disparaît

---

## 🔍 Checklist de Vérification

- [ ] Le domaine dans GitHub Settings → Pages correspond à la configuration DNS
- [ ] Le DNS dans IONOS est correctement configuré (CNAME pour www ou A pour apex)
- [ ] La résolution DNS fonctionne (test avec nslookup)
- [ ] La propagation DNS est complète (vérification en ligne)
- [ ] Le fichier CNAME dans le workflow correspond au domaine configuré dans GitHub
- [ ] "Enforce HTTPS" est coché dans GitHub
- [ ] Attendu au moins 15-30 minutes après les modifications

---

## ⚠️ Problèmes Courants

### Problème 1 : Le domaine dans GitHub est `keikohub.fr` mais le DNS est configuré pour `www`

**Solution** : Changez le domaine dans GitHub pour `www.keikohub.fr` OU configurez des enregistrements A pour `keikohub.fr` dans IONOS.

### Problème 2 : Le CNAME dans IONOS pointe vers le mauvais domaine

**Solution** : Vérifiez que le CNAME pointe exactement vers `MaCaRoN-Corporation.github.io` (sans http://, https://, ou slash final).

### Problème 3 : Les enregistrements A ont les mauvaises IPs

**Solution** : Vérifiez les IPs GitHub Pages à jour et mettez-les à jour dans IONOS.

### Problème 4 : Propagation DNS incomplète après 3 jours

**Solution** : 
- Vérifiez que la configuration DNS est correcte dans IONOS
- Vérifiez avec des outils en ligne (whatsmydns.net)
- Contactez le support IONOS si nécessaire

---

## 📞 Si le problème persiste

1. **Vérifiez les logs DNS** dans IONOS
2. **Contactez le support IONOS** si la configuration DNS semble correcte mais ne fonctionne pas
3. **Vérifiez la documentation GitHub** pour les dernières mises à jour
4. **Essayez de supprimer et reconfigurer** le domaine dans GitHub (Settings → Pages → supprimez le domaine, attendez 5 minutes, puis reconfigurez)

---

## 🔗 Ressources

- [Documentation GitHub Pages - Custom Domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [GitHub Pages IPs pour domaine racine](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-an-apex-domain)
- [Tester la propagation DNS](https://www.whatsmydns.net)
- [Vérifier CNAME](https://mxtoolbox.com/CNAMELookup.aspx)
