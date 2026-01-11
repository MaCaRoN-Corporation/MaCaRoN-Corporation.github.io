# Configuration d'un Domaine Personnalisé pour GitHub Pages

Ce guide explique comment configurer un domaine personnalisé pour votre site GitHub Pages et comment automatiser cette configuration.

## Vue d'ensemble

Pour utiliser un domaine personnalisé (par exemple `www.votredomaine.com`) au lieu de l'URL GitHub Pages par défaut (`MaCaRoN-Corporation.github.io`), vous devez :

1. ✅ **Configurer les DNS** chez votre registrar de domaine
2. ✅ **Ajouter un fichier CNAME** dans votre repository (automatisé via workflow)
3. ✅ **Configurer le domaine dans GitHub** (paramètres du repository)

---

## 📋 Liste des Étapes Détaillées

### Étape 1 : Configuration DNS chez votre Registrar

> **📘 Guide spécifique IONOS** : Si vous utilisez IONOS, consultez le guide détaillé : [Configuration DNS IONOS pour www.keikohub.fr](./ionos-dns-setup.md)

Selon le type d'enregistrement que vous souhaitez utiliser :

#### Option A : Utiliser un sous-domaine (recommandé : `www`)

**Exemple : `www.votredomaine.com`**

1. Connectez-vous à votre registrar (GoDaddy, Namecheap, OVH, etc.)
2. Accédez à la gestion DNS de votre domaine
3. Ajoutez/modifiez un enregistrement **CNAME** :
   - **Type** : `CNAME`
   - **Nom/Host** : `www` (ou le sous-domaine souhaité)
   - **Valeur/Point vers** : `MaCaRoN-Corporation.github.io`
   - **TTL** : `3600` (ou la valeur par défaut)

#### Option B : Utiliser le domaine racine (apex)

**Exemple : `votredomaine.com`**

GitHub Pages ne supporte **pas** les enregistrements CNAME pour le domaine racine (c'est une limitation DNS). Vous devez utiliser des enregistrements **A** :

1. Ajoutez/modifiez des enregistrements **A** :
   - **Type** : `A`
   - **Nom/Host** : `@` (ou racine)
   - **Valeur** : IPs GitHub Pages (elles peuvent changer, vérifiez la [documentation GitHub](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-an-apex-domain))
   - **TTL** : `3600`

**⚠️ Important** : Les IPs GitHub Pages peuvent changer. Consultez régulièrement la [documentation officielle](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-an-apex-domain) pour les IPs à jour.

#### Option C : Utiliser les deux (www + apex)

Pour rediriger le domaine racine vers `www`, vous pouvez :
- Configurer le domaine racine avec des enregistrements A vers GitHub Pages
- Configurer `www` avec un CNAME
- Dans GitHub, ajouter les deux domaines (le domaine racine redirigera automatiquement vers `www`)

### Étape 2 : Ajouter le fichier CNAME (✅ AUTOMATISÉ)

Le workflow GitHub Actions est **déjà configuré** pour créer automatiquement le fichier CNAME avec `www.keikohub.fr` à chaque déploiement.

✅ **Vous n'avez rien à faire** - le fichier CNAME sera créé automatiquement lors du prochain déploiement.

**Si vous préférez la méthode manuelle** (non recommandé) :
1. Créez un fichier `CNAME` à la racine du dossier `public/` (sera copié dans le build)
2. Le contenu doit être votre domaine : `www.keikohub.fr` (sans `http://` ni `https://`)
3. Commit et push

### Étape 3 : Configurer le domaine dans GitHub

1. Allez sur votre repository GitHub : `MaCaRoN-Corporation/MaCaRoN-Corporation.github.io`
2. Cliquez sur **Settings** (Paramètres)
3. Dans le menu de gauche, cliquez sur **Pages**
4. Dans la section **Custom domain**, entrez votre domaine : `www.keikohub.fr`
5. Cochez **Enforce HTTPS** (recommandé) - GitHub générera automatiquement un certificat SSL
6. Cliquez sur **Save**

**Note** : GitHub peut prendre quelques minutes à quelques heures pour valider et configurer le certificat SSL.

### Étape 4 : Vérifier la Configuration

1. Attendez que la propagation DNS soit complète (peut prendre jusqu'à 48h, généralement moins)
2. Vérifiez que le domaine est configuré correctement :
   ```bash
   # Vérifier le CNAME
   nslookup www.keikohub.fr
   
   # Vérifier si le site est accessible
   curl -I https://www.keikohub.fr
   ```
3. Accédez à votre site via le nouveau domaine
4. Vérifiez que le certificat SSL est valide (cadenas vert dans le navigateur)

---

## 🤖 Automatisation

### Configuration Automatique via GitHub Actions

Le workflow `.github/workflows/deploy.yml` peut être configuré pour créer automatiquement le fichier CNAME lors de chaque déploiement.

**Avantages :**
- ✅ Pas besoin de créer/maintenir le fichier CNAME manuellement
- ✅ Le fichier est toujours présent dans le build
- ✅ Configuration centralisée dans le workflow

**Comment activer l'automatisation :**

1. Ouvrez `.github/workflows/deploy.yml`
2. Modifiez la section `build` pour inclure la création du fichier CNAME (voir exemple ci-dessous)
3. Remplacez `votredomaine.com` par votre domaine réel
4. Commit et push - le prochain déploiement inclura automatiquement le fichier CNAME

**Exemple de modification du workflow :**

```yaml
- name: Create .nojekyll file
  run: |
    touch ./dist/keiko-hub/browser/.nojekyll

- name: Create CNAME file
  run: |
    echo "www.votredomaine.com" > ./dist/keiko-hub/browser/CNAME

- name: Setup Pages
  uses: actions/configure-pages@v4
```

### Variable d'Environnement (Option Avancée)

Pour rendre le domaine configurable sans modifier le workflow :

1. Ajoutez une variable dans les secrets GitHub (Settings → Secrets and variables → Actions)
   - Nom : `CUSTOM_DOMAIN`
   - Valeur : `www.votredomaine.com`

2. Modifiez le workflow pour utiliser cette variable :
   ```yaml
   - name: Create CNAME file
     run: |
       echo "${{ secrets.CUSTOM_DOMAIN }}" > ./dist/keiko-hub/browser/CNAME
   ```

---

## ⚠️ Points Importants

### Domaine racine vs sous-domaine

- **Sous-domaine (www)** : Plus simple, utilise CNAME, recommandé
- **Domaine racine (apex)** : Nécessite des enregistrements A, IPs peuvent changer
- **Les deux** : Possible, le domaine racine redirigera vers www

### Propagation DNS

- La propagation DNS peut prendre de **15 minutes à 48 heures**
- Utilisez des outils comme [whatsmydns.net](https://www.whatsmydns.net) pour vérifier la propagation
- Ne modifiez pas la configuration GitHub tant que les DNS ne sont pas propagés

### Certificat SSL

- GitHub génère automatiquement un certificat SSL via Let's Encrypt
- La génération peut prendre quelques minutes à quelques heures
- Activez **Enforce HTTPS** dans les paramètres GitHub Pages
- Si le certificat n'apparaît pas après 24h, vérifiez la configuration DNS

### Après Configuration

- L'ancienne URL GitHub Pages (`MaCaRoN-Corporation.github.io`) continuera de fonctionner
- Les deux URLs pointeront vers le même site
- Pour rediriger l'ancienne URL vers le nouveau domaine, vous pouvez utiliser un script JavaScript (optionnel)

---

## 🔧 Dépannage

### Le domaine ne fonctionne pas

1. **Vérifiez les DNS** :
   ```bash
   nslookup www.votredomaine.com
   dig www.votredomaine.com CNAME
   ```

2. **Vérifiez le fichier CNAME** :
   - Allez sur votre site GitHub Pages
   - Ajoutez `/CNAME` à l'URL (ex: `https://MaCaRoN-Corporation.github.io/CNAME`)
   - Vérifiez que le contenu est correct

3. **Vérifiez les paramètres GitHub** :
   - Settings → Pages → Custom domain
   - Assurez-vous que le domaine est correctement configuré
   - Vérifiez les messages d'erreur éventuels

### Erreur "DNS configuration error"

- Vérifiez que les enregistrements DNS sont corrects
- Attendez que la propagation DNS soit complète
- Pour un domaine racine, vérifiez que les IPs GitHub Pages sont à jour

### Certificat SSL non généré

- Vérifiez que les DNS pointent correctement vers GitHub Pages
- Attendez quelques heures (génération automatique)
- Vérifiez que "Enforce HTTPS" est activé dans GitHub

---

## 📚 Ressources

- [Documentation officielle GitHub Pages - Custom Domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [GitHub Pages IPs pour domaine racine](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-an-apex-domain)
- [Tester la propagation DNS](https://www.whatsmydns.net)

---

## ✅ Checklist de Configuration

Avant de commencer, assurez-vous d'avoir :
- [ ] Acheté votre nom de domaine
- [ ] Accès au panneau de gestion DNS de votre registrar
- [ ] Accès aux paramètres du repository GitHub

Étapes à suivre :
- [ ] Configuré les enregistrements DNS (CNAME pour www ou A pour apex)
- [ ] Ajouté/automatisé le fichier CNAME dans le workflow
- [ ] Configuré le domaine dans GitHub Settings → Pages
- [ ] Activé "Enforce HTTPS"
- [ ] Vérifié la propagation DNS (attendu quelques heures)
- [ ] Vérifié que le certificat SSL est généré
- [ ] Testé l'accès au site via le nouveau domaine
