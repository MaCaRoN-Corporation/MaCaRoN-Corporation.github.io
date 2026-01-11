# Dépannage : Erreur de Vérification du Domaine GitHub Pages

## 🔴 Erreur Rencontrée

```
Both keikohub.fr and its alternate name are improperly configured
Domain does not resolve to the GitHub Pages server. For more information, see documentation (NotServedByPagesError).
```

## 📋 Causes Possibles

Cette erreur peut avoir plusieurs causes :

1. **Les deux domaines configurés dans GitHub Pages** : Vous avez peut-être ajouté à la fois `keikohub.fr` et `www.keikohub.fr` dans GitHub Pages, mais GitHub Pages ne peut avoir qu'un seul domaine personnalisé principal à la fois.

2. **Configuration DNS incorrecte** : Le CNAME ou les enregistrements A ne pointent pas correctement vers GitHub Pages.

3. **Propagation DNS incomplète** : Les modifications DNS n'ont pas encore été propagées (peut prendre jusqu'à 48 heures).

4. **Conflit entre domaine racine et sous-domaine** : Configuration mixte entre enregistrements A et CNAME.

## ✅ Solution Recommandée : Configuration avec www uniquement

### Étape 1 : Vérifier et Corriger la Configuration GitHub Pages

1. **Allez dans votre repository GitHub**
   - Ouvrez votre repository : `MaCaRoN-Corporation/MaCaRoN-Corporation.github.io`
   - Cliquez sur **Settings** (Paramètres)
   - Dans le menu de gauche, cliquez sur **Pages**

2. **Vérifiez le domaine personnalisé**
   - Dans la section **"Custom domain"**, vous devriez voir un champ avec votre domaine
   - ⚠️ **IMPORTANT** : Il ne doit y avoir qu'**UN SEUL** domaine dans ce champ
   - Le domaine doit être : `www.keikohub.fr` (avec www)

3. **Si vous voyez les deux domaines ou keikohub.fr sans www :**
   - Supprimez tous les domaines de la liste
   - Cliquez sur **"Remove"** ou **"Supprimer"** pour chaque domaine
   - Attendez quelques secondes
   - Ajoutez uniquement : `www.keikohub.fr`
   - Cliquez sur **"Save"** (Enregistrer)
   - ⚠️ **Ne cochez PAS** "Enforce HTTPS" pour l'instant (on le fera après la vérification)

4. **Vérifiez que le fichier CNAME est correct**
   - Le workflow GitHub Actions crée automatiquement un fichier CNAME avec `www.keikohub.fr`
   - Vérifiez que le fichier existe dans votre repository (il devrait être dans la branche `gh-pages` ou dans le dossier de déploiement)

### Étape 2 : Vérifier la Configuration DNS dans IONOS

1. **Connectez-vous à IONOS**
   - Allez sur [IONOS.fr](https://www.ionos.fr) ou [IONOS.com](https://www.ionos.com)
   - Connectez-vous avec vos identifiants

2. **Vérifiez le CNAME pour www**
   - Allez dans **"Domaines & SSL"** → Trouvez `keikohub.fr` → **"Gérer les sous-domaines"**
   - Cliquez sur le sous-domaine `www` → **"DNS"**
   - Vous devriez voir un enregistrement CNAME avec :
     - **Type** : `CNAME`
     - **Hostname** : `www` (ou `www.keikohub.fr`)
     - **Points vers** : `MaCaRoN-Corporation.github.io` (⚠️ **EXACTEMENT** ce nom, sans http:// ni https://)
     - **TTL** : `3600` (ou valeur par défaut)

3. **Si le CNAME n'existe pas ou est incorrect :**
   - Supprimez les anciens enregistrements CNAME incorrects
   - Ajoutez un nouveau CNAME :
     - **Type** : `CNAME`
     - **Hostname** : `www`
     - **Points vers** : `MaCaRoN-Corporation.github.io`
     - **TTL** : `3600`
   - Sauvegardez

4. **Vérifiez qu'il n'y a PAS d'enregistrements A pour www**
   - ⚠️ **IMPORTANT** : Il ne doit PAS y avoir d'enregistrements A pour `www.keikohub.fr`
   - Si vous en voyez, supprimez-les (un sous-domaine ne peut pas avoir à la fois un CNAME et des enregistrements A)

5. **Vérifiez le domaine racine keikohub.fr**
   - Allez dans la gestion DNS du domaine racine `keikohub.fr` (pas le sous-domaine www)
   - ⚠️ **IMPORTANT** : Pour l'instant, ne configurez PAS d'enregistrements A pour `keikohub.fr` (sans www)
   - Si vous avez déjà ajouté des enregistrements A pour `keikohub.fr`, supprimez-les temporairement
   - On configurera la redirection après que `www.keikohub.fr` fonctionne

### Étape 3 : Vérifier la Propagation DNS

Attendez que la propagation DNS soit terminée (15 minutes à 48 heures, généralement 1-4 heures).

**Vérifiez avec ces commandes :**

**Windows (PowerShell) :**
```powershell
nslookup www.keikohub.fr
```

**Résultat attendu :**
```
Nom:    MaCaRoN-Corporation.github.io
Address: [une adresse IP GitHub]
```

**Ou utilisez des outils en ligne :**
- [whatsmydns.net](https://www.whatsmydns.net/#CNAME/www.keikohub.fr) - Vérifie la propagation DNS dans le monde entier
- [mxtoolbox.com](https://mxtoolbox.com/CNAMELookup.aspx) - Outil de vérification CNAME

### Étape 4 : Vérifier dans GitHub Pages

1. **Retournez dans GitHub Pages Settings**
   - Repository → **Settings** → **Pages**
   - Dans la section **"Custom domain"**, vous devriez voir `www.keikohub.fr`
   - Cliquez sur **"Check"** ou attendez que GitHub vérifie automatiquement

2. **Si la vérification échoue encore :**
   - Attendez encore 1-2 heures (propagation DNS)
   - Vérifiez à nouveau avec `nslookup` que le DNS est correct
   - Vérifiez que vous n'avez qu'un seul domaine dans GitHub Pages

3. **Une fois la vérification réussie :**
   - Cochez **"Enforce HTTPS"** (Forcer HTTPS)
   - Attendez quelques minutes pour que le certificat SSL soit généré

### Étape 5 : Configurer la Redirection keikohub.fr → www.keikohub.fr (Optionnel)

Une fois que `www.keikohub.fr` fonctionne correctement, vous pouvez configurer la redirection pour que `keikohub.fr` (sans www) redirige vers `www.keikohub.fr`.

**Voir le guide détaillé :** [Configuration DNS IONOS](./ionos-dns-setup.md#option-a--rediriger-keikohubfr-vers-wwwkeikohubfr--recommandé)

## 🔍 Vérifications de Dépannage

### Checklist Complète

- [ ] Un seul domaine dans GitHub Pages : `www.keikohub.fr`
- [ ] CNAME correct dans IONOS : `www` → `MaCaRoN-Corporation.github.io`
- [ ] Pas d'enregistrements A pour `www.keikohub.fr`
- [ ] Propagation DNS vérifiée avec `nslookup` ou outils en ligne
- [ ] Fichier CNAME présent dans le repository (créé automatiquement par GitHub Actions)
- [ ] Pas de conflit entre domaine racine et sous-domaine

### Commandes de Vérification

**Vérifier le CNAME :**
```powershell
nslookup -type=CNAME www.keikohub.fr
```

**Vérifier la résolution DNS :**
```powershell
nslookup www.keikohub.fr
```

**Tester l'accès HTTP :**
```powershell
curl -I http://www.keikohub.fr
```

**Tester l'accès HTTPS (après activation) :**
```powershell
curl -I https://www.keikohub.fr
```

## ⚠️ Erreurs Courantes

### Erreur 1 : "Domain does not resolve to the GitHub Pages server"

**Cause :** Le DNS ne pointe pas vers GitHub Pages.

**Solution :**
- Vérifiez que le CNAME pointe vers `MaCaRoN-Corporation.github.io` (exactement, sans http://)
- Vérifiez qu'il n'y a pas d'enregistrements A pour www
- Attendez la propagation DNS

### Erreur 2 : "Both keikohub.fr and its alternate name are improperly configured"

**Cause :** Les deux domaines sont configurés dans GitHub Pages, ou configuration DNS mixte.

**Solution :**
- Supprimez tous les domaines de GitHub Pages
- Ajoutez uniquement `www.keikohub.fr`
- Vérifiez qu'il n'y a pas d'enregistrements A pour le domaine racine (pour l'instant)

### Erreur 3 : "CNAME already exists"

**Cause :** Conflit entre CNAME et enregistrements A.

**Solution :**
- Supprimez tous les enregistrements A pour `www.keikohub.fr`
- Gardez uniquement le CNAME

## 📚 Ressources

- [Documentation GitHub Pages - Domaines personnalisés](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [Guide IONOS DNS](./ionos-dns-setup.md)
- [Configuration Domaine Personnalisé](./custom-domain-setup.md)

## 🆘 Si le Problème Persiste

Si après avoir suivi toutes ces étapes le problème persiste :

1. **Vérifiez les logs GitHub Actions**
   - Allez dans **Actions** dans votre repository
   - Vérifiez que le déploiement s'est bien passé
   - Vérifiez que le fichier CNAME a été créé

2. **Vérifiez le fichier CNAME dans le repository**
   - Le fichier devrait être dans la branche `gh-pages` ou dans le dossier de déploiement
   - Le contenu doit être exactement : `www.keikohub.fr` (sans http:// ni https://)

3. **Contactez le support IONOS**
   - Si vous avez des doutes sur la configuration DNS dans IONOS
   - Le support peut vérifier que la configuration est correcte

4. **Attendez 24-48 heures**
   - Parfois, la propagation DNS peut prendre jusqu'à 48 heures
   - GitHub peut aussi prendre du temps pour vérifier le domaine

---

**Date de création :** 2024-12-20  
**Dernière mise à jour :** 2024-12-20
