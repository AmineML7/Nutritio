# ⚡ Déploiement Rapide - 5 Minutes

## 🎯 Option 1 : Railway (Le Plus Simple)

### **Étape 1 : Créer un compte Railway**
👉 https://railway.app → Sign up with GitHub

### **Étape 2 : Créer un nouveau projet**
```bash
# Installer Railway CLI
npm install -g @railway/cli

# Se connecter
railway login

# Dans le dossier nutritio-nextjs
cd nutritio-nextjs
railway init
```

Choisir : **"Create a new project"** → Nommer : `nutritio-app`

### **Étape 3 : Configurer les Variables**
Dans Railway Dashboard → Variables :
```env
DATABASE_URL=file:/app/prisma/dev.db
NEXTAUTH_SECRET=<coller-le-secret-généré>
AUTH_TRUST_HOST=true
PORT=3006
NODE_ENV=production
```

**Générer le secret** :
```bash
openssl rand -base64 32
```

### **Étape 4 : Ajouter un Volume**
Railway Dashboard → Volumes → Add Volume :
- **Mount Path** : `/app/prisma`
- **Size** : 1 GB

### **Étape 5 : Déployer ! 🚀**
```bash
railway up
```

⏱️ **Attendre ~2 minutes...**

### **Étape 6 : Récupérer l'URL**
```bash
railway domain
```

Railway génère une URL du type : `nutritio-app-production.up.railway.app`

### **Étape 7 : Configurer NEXTAUTH_URL**
Retourner dans Variables → Modifier :
```env
NEXTAUTH_URL=https://nutritio-app-production.up.railway.app
```

Redéployer automatiquement.

### **✅ C'est Prêt !**
Visitez votre URL et créez votre premier compte !

---

## 🤖 Option 2 : GitHub Actions (Auto Deploy)

### **Prérequis** : Railway configuré (voir ci-dessus)

### **Étape 1 : Récupérer le Token Railway**
```bash
railway login --browserless
```
Copier le token affiché.

### **Étape 2 : Ajouter le Token à GitHub**
GitHub → Settings → Secrets and variables → Actions → New secret

- **Name** : `RAILWAY_TOKEN`
- **Value** : [coller votre token]

### **Étape 3 : Commit & Push**
```bash
git add .
git commit -m "feat: add deployment with Railway + GitHub Actions"
git push origin main
```

### **✅ Déploiement Automatique !**
À chaque push sur `main`, GitHub Actions déploie automatiquement ! 🎉

---

## 🛠️ Option 3 : Fly.io (Gratuit avec Volumes)

### **Étape 1 : Installer Fly CLI**
```bash
curl -L https://fly.io/install.sh | sh
```

### **Étape 2 : Créer un compte**
```bash
fly auth signup
```

### **Étape 3 : Lancer le projet**
```bash
cd nutritio-nextjs
fly launch
```

Répondre aux questions :
- App name : `nutritio-app`
- Region : `cdg` (Paris)
- Database : **Non**
- Deploy : **Non** (pas encore)

### **Étape 4 : Créer le Volume**
```bash
fly volumes create nutritio_data --size 1 --region cdg
```

### **Étape 5 : Configurer les Secrets**
```bash
# Générer un secret
SECRET=$(openssl rand -base64 32)

# Ajouter aux secrets Fly.io
fly secrets set NEXTAUTH_SECRET="$SECRET"
fly secrets set NEXTAUTH_URL="https://nutritio-app.fly.dev"
```

### **Étape 6 : Déployer**
```bash
fly deploy
```

⏱️ **Attendre ~3 minutes...**

### **✅ Terminé !**
```bash
fly open
```

---

## 🔍 Vérification Post-Déploiement

### **Checklist** :
```bash
# 1. L'app est accessible
curl https://votre-app-url.com

# 2. L'API auth fonctionne
curl https://votre-app-url.com/api/auth/session

# 3. Tester l'inscription
# → Ouvrir dans le navigateur et créer un compte
```

### **Debug** :
```bash
# Railway
railway logs

# Fly.io
fly logs

# Vérifier la BDD
railway run npx prisma studio
# ou
fly ssh console
```

---

## 🆘 Problèmes Courants

### ❌ **Erreur : UntrustedHost**
**Solution** : Vérifier que `AUTH_TRUST_HOST=true` et `NEXTAUTH_URL` est correct

### ❌ **Erreur : Database locked**
**Solution** : Le volume n'est pas monté. Vérifier la config du volume.

### ❌ **Erreur 500 après login**
**Solution** : Vérifier `NEXTAUTH_SECRET` est défini

### ❌ **Build timeout**
**Solution** : Railway/Fly.io gratuit peut être lent. Attendre ou upgrader.

---

## 💰 Coûts

| Plateforme | Plan Gratuit | Upgrade |
|------------|-------------|---------|
| **Railway** | $5/mois de crédit | $5/mois après épuisement |
| **Fly.io** | 3 VMs gratuites | $1.94/mois si dépassement |

**💡 Astuce** : Railway est plus simple pour débuter, Fly.io est mieux à long terme.

---

## 📞 Besoin d'Aide ?

1. Consulter [DEPLOY.md](./DEPLOY.md) pour plus de détails
2. Vérifier les logs : `railway logs` ou `fly logs`
3. Tester en local : `docker compose up`

---

**Bon Déploiement ! 🚀**

