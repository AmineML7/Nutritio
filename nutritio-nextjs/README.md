# 🥗 Nutritio - Suivi des Micronutriments

Application web pour calculer et suivre l'apport en micronutriments de votre alimentation quotidienne.

## ✨ Fonctionnalités

- 🔐 **Authentification multi-utilisateur** (NextAuth.js v5)
- 🔍 **Recherche d'aliments** (base CIQUAL 2020)
- 📊 **Calcul automatique** des macros et micronutriments
- 📈 **Graphiques d'évolution** personnalisés
- 💾 **Historique quotidien** sauvegardé
- 👤 **Profils personnalisés** (Homme/Femme)
- 🎯 **Recommandations ANSES**

---

## 🚀 Démarrage Rapide

### **Prérequis**

- Node.js 18+
- Docker (optionnel mais recommandé)

### **Installation Locale**

```bash
# 1. Cloner le projet
git clone https://github.com/votre-username/Nutritio.git
cd Nutritio/nutritio-nextjs

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env

# 4. Initialiser la base de données
npx prisma generate
npx prisma db push

# 5. Lancer l'application
npm run dev
```

Ouvrez http://localhost:3006 🎉

### **Avec Docker**

```bash
# Démarrer l'application
docker compose up -d

# Voir les logs
docker compose logs -f

# Arrêter
docker compose down
```

---

## 🗄️ Architecture

```
nutritio-nextjs/
├── app/
│   ├── api/              # API Routes
│   │   ├── auth/         # NextAuth endpoints
│   │   ├── history/      # Historique quotidien
│   │   ├── calculate/    # Calcul nutritionnel
│   │   └── search/       # Recherche aliments
│   ├── auth/             # Pages login/signup
│   └── page.tsx          # Page principale
├── components/           # Composants React
├── lib/
│   ├── auth.ts           # Configuration NextAuth
│   ├── prisma.ts         # Client Prisma
│   └── data.ts           # Chargement CSV
├── prisma/
│   ├── schema.prisma     # Schéma BDD
│   └── dev.db            # SQLite (local)
├── public/data/
│   ├── aliments.csv      # Base CIQUAL
│   └── recommandations.csv
└── docker-compose.yml
```

---

## 🔐 Authentification

- **NextAuth.js v5** avec stratégie JWT
- **Credentials Provider** (email + password)
- Mots de passe hashés avec **bcrypt**
- Sessions sécurisées
- Protection des routes API

📖 Voir [AUTH.md](./AUTH.md) pour plus de détails

---

## 📊 Base de Données

### **Modèles Prisma**

```prisma
model User {
  id       String
  email    String @unique
  password String
  name     String?
  gender   String
  
  foodLists    FoodList[]
  dailyHistory DailyHistory[]
}

model DailyHistory {
  id            String
  date          String  # YYYY-MM-DD
  aliments      String  # JSON
  totalCalories Float
  userId        String
  
  @@unique([userId, date])
}
```

---

## 🐳 Docker

### **Variables d'Environnement**

```env
DATABASE_URL="file:/app/prisma/dev.db"
NEXTAUTH_URL="http://localhost:3006"
NEXTAUTH_SECRET="votre-secret-ici"
AUTH_TRUST_HOST="true"
```

### **Volumes**

- `nutritio-db:/app/prisma` - Persistance de la base de données

---

## 🌐 Déploiement

Consultez [DEPLOY.md](./DEPLOY.md) pour déployer sur :
- ✅ **Railway** (recommandé - facile et gratuit)
- ✅ **Fly.io** (gratuit avec volumes)
- ⚠️ **Vercel** (nécessite PostgreSQL)

### **Déploiement Automatique**

GitHub Actions déploie automatiquement sur Railway à chaque push sur `main`.

```bash
# 1. Créer un projet Railway
railway init

# 2. Ajouter RAILWAY_TOKEN aux secrets GitHub

# 3. Pousser sur main
git push origin main

# ✅ Déploiement automatique !
```

---

## 🧪 Tests

```bash
# Tests API
npm run test

# Tests détaillés
npm run test:detailed

# Tests nutriments
npm run test:nutrients
```

---

## 📚 Documentation

- [AUTH.md](./AUTH.md) - Système d'authentification
- [DEPLOY.md](./DEPLOY.md) - Guide de déploiement
- [DOCKER.md](./DOCKER.md) - Configuration Docker
- [GRAPHIQUES.md](./GRAPHIQUES.md) - Graphiques d'évolution

---

## 🛠️ Technologies

- **Framework** : Next.js 15.5
- **Auth** : NextAuth.js v5
- **BDD** : Prisma + SQLite (PostgreSQL en prod)
- **Styling** : TailwindCSS
- **Charts** : Recharts
- **Container** : Docker

---

## 📝 Données

- **Aliments** : Base CIQUAL 2020 (ANSES)
- **Recommandations** : ANSES (Homme/Femme)
- **Format** : CSV → chargé au démarrage

---

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

---

## 📄 Licence

Ce projet est sous licence MIT.

---

## 🙏 Remerciements

- **ANSES** pour la base de données CIQUAL
- **NextAuth.js** pour l'authentification
- **Prisma** pour l'ORM

---

**Développé avec ❤️ pour suivre votre santé nutritionnelle**
