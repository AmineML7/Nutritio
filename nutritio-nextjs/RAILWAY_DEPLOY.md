# 🚂 Guide de Déploiement Railway - Simple et Rapide

## ✨ Pourquoi Railway ?

- ✅ **$5 de crédit gratuit** par mois (~500h)
- ✅ Supporte **Docker + SQLite** (pas de migration BDD)
- ✅ **Volumes persistants** gratuits
- ✅ Configuration **automatique** avec `railway.json`
- ✅ Déploiement depuis GitHub

---

## 🚀 Déploiement en 10 Minutes

### **ÉTAPE 1 : Créer un compte Railway**

1. Allez sur 👉 https://railway.app
2. Cliquez **"Login"** → **"Login with GitHub"**
3. Autorisez Railway à accéder à vos repos

---

### **ÉTAPE 2 : Pousser votre code vers GitHub**

```bash
cd /home/amine/Documents/WORK/Nutritio

# Ajouter la config Railway
git add nutritio-nextjs/railway.json nutritio-nextjs/RAILWAY_DEPLOY.md
git commit -m "feat: add Railway deployment config"
git push origin main
```

---

### **ÉTAPE 3 : Créer un nouveau projet sur Railway**

1. **Dashboard Railway** → **"New Project"**
2. Choisissez **"Deploy from GitHub repo"**
3. Sélectionnez **`AmineML7/Nutritio`**
4. Railway détecte automatiquement `railway.json` ✅

---

### **ÉTAPE 4 : Configurer les Variables d'Environnement**

Railway va ouvrir la page de configuration :

1. Cliquez sur votre service (il s'appelle probablement "Nutritio")
2. Allez dans l'onglet **"Variables"**
3. Ajoutez ces variables :

```env
DATABASE_URL=file:/app/prisma/dev.db
NEXTAUTH_SECRET=<générer-un-secret>
AUTH_TRUST_HOST=true
PORT=3006
NODE_ENV=production
```

#### **Générer NEXTAUTH_SECRET** :

Ouvrez un terminal et exécutez :
```bash
openssl rand -base64 32
```

Copiez le résultat et collez-le dans `NEXTAUTH_SECRET`.

---

### **ÉTAPE 5 : Ajouter un Volume pour la Base de Données**

**C'est CRUCIAL pour que vos données persistent !**

1. Dans votre service, cliquez sur l'onglet **"Volumes"**
2. Cliquez **"New Volume"**
3. Configuration :
   - **Mount Path** : `/app/prisma`
   - Cliquez **"Add"**

Railway créera automatiquement un volume de 1GB (gratuit).

---

### **ÉTAPE 6 : Configurer NEXTAUTH_URL**

1. Railway déploie automatiquement votre app
2. Attendez que le déploiement se termine (~5 min)
3. Railway génère une URL du type : `nutritio-production.up.railway.app`
4. **Copiez cette URL**
5. Retournez dans **"Variables"**
6. Ajoutez une nouvelle variable :

```env
NEXTAUTH_URL=https://nutritio-production.up.railway.app
```

7. Railway redéploie automatiquement (~2 min)

---

### **ÉTAPE 7 : Tester votre application !**

Visitez votre URL : `https://nutritio-production.up.railway.app`

✅ **Checklist** :
- [ ] Page de login s'affiche
- [ ] Créer un compte fonctionne
- [ ] Ajouter des aliments fonctionne
- [ ] Se déconnecter et reconnecter → les données sont toujours là !

---

## 🔄 Déploiement Automatique

Maintenant, **chaque fois que vous pushez sur GitHub**, Railway redéploie automatiquement !

```bash
# Faire une modification
git add .
git commit -m "update: nouvelle feature"
git push origin main

# → Railway détecte le push et redéploie automatiquement ! 🎉
```

---

## 📊 Monitoring

### **Dashboard Railway**

Accédez à https://railway.app/dashboard

Vous pouvez voir :
- 📈 **Metrics** : CPU, RAM, Network
- 📝 **Logs** : En temps réel
- 💾 **Volumes** : Utilisation du stockage
- 💰 **Usage** : Crédit restant

### **Voir les Logs**

1. Dashboard → Votre projet
2. Cliquez sur votre service
3. Onglet **"Deployments"**
4. Cliquez sur le déploiement actuel
5. Voir les logs en temps réel

---

## 💰 Limites Gratuites

Railway offre :
- **$5 de crédit gratuit par mois**
- Environ **500 heures** d'uptime
- **1 GB de stockage** (volume)
- **100 GB de bandwidth**

**Largement suffisant pour tester et utiliser quotidiennement !** ✅

---

## 🔧 Dépannage

### ❌ **Erreur : Failed to fetch session**

**Cause** : `NEXTAUTH_URL` manquant ou incorrect

**Solution** :
1. Vérifier que `NEXTAUTH_URL` correspond exactement à votre URL Railway
2. Vérifier que `AUTH_TRUST_HOST=true` est présent
3. Redéployer

### ❌ **Erreur : Database is locked**

**Cause** : Le volume n'est pas monté correctement

**Solution** :
1. Vérifier que le volume existe (onglet Volumes)
2. Vérifier que le mount path est `/app/prisma`
3. Redéployer

### ❌ **Build timeout**

**Cause** : Premier build peut être lent

**Solution** :
- Attendre patiemment (~10 min max)
- Vérifier les logs pour voir où ça bloque

---

## 🆙 Custom Domain (Optionnel)

Si vous voulez un domaine personnalisé :

1. Railway → Settings → Domains
2. **Generate Domain** (gratuit .railway.app)
   - OU -
3. **Custom Domain** (votre propre domaine)
   - Railway configure automatiquement HTTPS ✅

---

## 📝 Résumé des Variables

| Variable | Valeur | Description |
|----------|--------|-------------|
| `DATABASE_URL` | `file:/app/prisma/dev.db` | Chemin SQLite dans le volume |
| `NEXTAUTH_URL` | `https://votre-app.railway.app` | URL de votre app |
| `NEXTAUTH_SECRET` | `[généré avec openssl]` | Secret pour JWT |
| `AUTH_TRUST_HOST` | `true` | Pour NextAuth v5 |
| `PORT` | `3006` | Port de l'app |
| `NODE_ENV` | `production` | Mode production |

---

## 🎉 C'est Terminé !

Votre app Nutritio est maintenant :
- ✅ Déployée en production
- ✅ Accessible depuis n'importe où
- ✅ Avec authentification multi-utilisateur
- ✅ Données persistantes dans un volume
- ✅ Déploiement automatique via GitHub

**Partagez votre URL et profitez ! 🚀**

---

## 📞 Besoin d'Aide ?

- Documentation Railway : https://docs.railway.app
- Logs : Dashboard → Deployments
- Support : Discord Railway (très réactif)

**Bon déploiement ! 🚂💨**

