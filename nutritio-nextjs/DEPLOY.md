# 🚀 Guide de Déploiement - Nutritio

## 📋 Prérequis

- Compte GitHub
- Compte Railway (gratuit) : https://railway.app

---

## 🛤️ Déploiement sur Railway (Recommandé)

### **1. Préparer Railway**

1. Créer un compte sur https://railway.app
2. Installer Railway CLI :
   ```bash
   npm install -g @railway/cli
   ```
3. Se connecter :
   ```bash
   railway login
   ```

### **2. Créer un Nouveau Projet**

```bash
cd nutritio-nextjs
railway init
```

### **3. Configurer les Variables d'Environnement**

Dans le dashboard Railway, ajoutez ces variables :

```env
DATABASE_URL=file:/app/prisma/dev.db
NEXTAUTH_URL=https://votre-app.railway.app
NEXTAUTH_SECRET=<générez-un-secret-aléatoire>
AUTH_TRUST_HOST=true
PORT=3006
NODE_ENV=production
```

**Générer un secret aléatoire** :
```bash
openssl rand -base64 32
```

### **4. Ajouter un Volume pour la BDD**

Dans Railway Dashboard :
1. Allez dans votre service
2. Cliquez sur "Volumes"
3. Créez un nouveau volume :
   - **Mount Path** : `/app/prisma`
   - **Size** : 1 GB (gratuit)

### **5. Déployer**

**Option A - Déploiement Manuel** :
```bash
railway up
```

**Option B - GitHub Actions (Automatique)** :
1. Récupérer votre token Railway :
   ```bash
   railway login --browserless
   ```
2. Copier le token affiché
3. Sur GitHub :
   - Allez dans Settings → Secrets → Actions
   - Créez `RAILWAY_TOKEN` avec votre token
4. Pushez sur `main` → Déploiement automatique ! 🎉

---

## 🔧 Alternative : Déploiement sur Fly.io

### **1. Installation**

```bash
curl -L https://fly.io/install.sh | sh
fly auth signup
```

### **2. Lancement**

```bash
cd nutritio-nextjs
fly launch
```

### **3. Configuration**

Créer `fly.toml` :
```toml
app = "nutritio-app"
primary_region = "cdg"

[build]
  dockerfile = "Dockerfile"

[env]
  PORT = "3006"
  NODE_ENV = "production"
  AUTH_TRUST_HOST = "true"

[[services]]
  http_checks = []
  internal_port = 3006
  protocol = "tcp"

  [[services.ports]]
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443

[mounts]
  source = "nutritio_data"
  destination = "/app/prisma"
```

### **4. Créer le Volume**

```bash
fly volumes create nutritio_data --size 1
```

### **5. Déployer**

```bash
fly deploy
```

---

## 🌐 Alternative : Vercel (Nécessite PostgreSQL)

⚠️ **Important** : Vercel ne supporte pas SQLite. Il faut migrer vers PostgreSQL.

### **1. Modifier Prisma Schema**

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### **2. Créer une BDD PostgreSQL**

Utiliser **Neon.tech** (gratuit) ou **Supabase** :
```bash
# Exemple Neon
DATABASE_URL="postgresql://user:password@ep-xxx.neon.tech/nutritio"
```

### **3. Déployer sur Vercel**

```bash
npm i -g vercel
vercel login
vercel
```

---

## 📊 Vérification Post-Déploiement

### **Checklist** :

- [ ] L'application est accessible via HTTPS
- [ ] La page de login fonctionne
- [ ] Inscription d'un nouveau compte fonctionne
- [ ] Ajout d'aliments fonctionne
- [ ] Historique se sauvegarde
- [ ] Déconnexion/Reconnexion préserve les données

### **Commandes de Debug** :

```bash
# Railway
railway logs

# Fly.io
fly logs

# Vérifier la BDD
railway run npx prisma studio
```

---

## 🔒 Sécurité Production

### **À Faire Absolument** :

1. **Changer NEXTAUTH_SECRET** :
   ```bash
   openssl rand -base64 32
   ```

2. **Configurer CORS** (si API externe)

3. **Activer HTTPS only**

4. **Rate limiting** (optionnel)

5. **Monitoring** : Configurer des alertes Railway/Fly.io

---

## 🚀 GitHub Actions - Déploiement Automatique

Le workflow `.github/workflows/deploy-railway.yml` déploie automatiquement à chaque push sur `main`.

### **Configuration** :

1. Créer `RAILWAY_TOKEN` dans GitHub Secrets
2. Pousser sur `main`
3. ✅ Déploiement automatique !

---

## 💰 Coûts

| Plateforme | Gratuit | Limites |
|------------|---------|---------|
| **Railway** | $5/mois offerts | 500h/mois, 1GB RAM |
| **Fly.io** | Oui | 3 VMs, 1GB RAM |
| **Vercel** | Oui | 100GB bandwidth |

---

## 📞 Support

En cas de problème :
1. Consulter les logs : `railway logs` ou `fly logs`
2. Vérifier les variables d'environnement
3. Vérifier que le volume est bien monté
4. Tester en local avec Docker : `docker compose up`

---

**Bonne Chance ! 🎉**

