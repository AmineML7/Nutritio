# 🔐 Système d'Authentification - Nutritio

## ✅ Système Complet Implémenté !

### 🎯 Fonctionnalités

#### Authentification
- ✅ **Inscription** : Création de compte avec email/password
- ✅ **Connexion** : Login sécurisé
- ✅ **Déconnexion** : Logout depuis le header
- ✅ **Sessions JWT** : Gestion des sessions avec NextAuth
- ✅ **Protection des pages** : Redirection automatique si non connecté

#### Données Personnalisées
- ✅ **Profil utilisateur** : Nom, email, genre
- ✅ **Historique quotidien** : Sauvegarde automatique par jour
- ✅ **Graphiques d'évolution** : Données personnelles
- ✅ **Isolation des données** : Chaque utilisateur voit uniquement ses données

---

## 🗄️ Base de Données (SQLite + Prisma)

### Schéma

#### **User**
```prisma
model User {
  id            String
  email         String    @unique
  password      String    (hashé avec bcrypt)
  name          String?
  gender        String    (Homme/Femme)
  createdAt     DateTime
  updatedAt     DateTime
}
```

#### **DailyHistory**
```prisma
model DailyHistory {
  id            String
  date          String    (YYYY-MM-DD)
  aliments      String    (JSON)
  totalCalories Float
  userId        String
  
  @@unique([userId, date])
}
```

#### **FoodList** (préparé pour futur)
```prisma
model FoodList {
  id        String
  name      String
  aliments  String    (JSON)
  userId    String
}
```

---

## 🔒 Sécurité

### Hachage des mots de passe
- **bcrypt** avec salt rounds = 10
- Jamais de mots de passe en clair

### Sessions JWT
- **NextAuth.js** pour la gestion des sessions
- Token JWT sécurisé
- Expiration automatique

### Protection API
- Toutes les routes API vérifies l'authentification
- Retour 401 si non authentifié
- Isolation des données par utilisateur

---

## 📍 Routes

### Pages Publiques
- `/auth/login` - Page de connexion
- `/auth/signup` - Page d'inscription

### Pages Protégées
- `/` - Application principale (redirige vers login si non connecté)

### API Routes
- `POST /api/auth/signup` - Créer un compte
- `POST /api/auth/[...nextauth]` - NextAuth (login/logout)
- `GET /api/history` - Récupérer l'historique
- `POST /api/history` - Sauvegarder une journée
- `DELETE /api/history?date=YYYY-MM-DD` - Supprimer une journée
- `GET /api/lists` - Listes sauvegardées (à implémenter)
- `POST /api/lists` - Créer une liste
- `DELETE /api/lists?id=xxx` - Supprimer une liste

---

## 🎨 Interface

### Page de Connexion
```
┌─────────────────────────┐
│      Nutritio           │
│  Suivi micronutriments  │
├─────────────────────────┤
│  Email:  [__________]   │
│  Password: [________]   │
│  [Se connecter]         │
│                         │
│  Pas de compte ?        │
│  → S'inscrire           │
└─────────────────────────┘
```

### Page d'Inscription
```
┌─────────────────────────┐
│   Créer un compte       │
├─────────────────────────┤
│  Nom: [__________]      │
│  Email: [__________]    │
│  Profil: [Homme][Femme] │
│  Password: [________]   │
│  Confirmer: [_______]   │
│  [Créer mon compte]     │
│                         │
│  Déjà un compte ?       │
│  → Se connecter         │
└─────────────────────────┘
```

### Header (connecté)
```
┌──────────────────────────────────────┐
│ Nutritio          user@email.com  🟢 │
│                   [Déconnexion]      │
└──────────────────────────────────────┘
```

---

## 🚀 Utilisation

### 1. Créer un compte
```bash
# Ouvrir http://localhost:3006
# Cliquer sur "S'inscrire"
# Remplir le formulaire
# → Connexion automatique
```

### 2. Se connecter
```bash
# Email: votre@email.com
# Password: ••••••••
# → Redirection vers l'app
```

### 3. Utiliser l'application
- Vos données sont automatiquement sauvegardées
- L'historique est personnel
- Les graphiques montrent VOS données

### 4. Se déconnecter
- Cliquer sur "Déconnexion" dans le header
- → Redirection vers login

---

## 🐳 Docker

### Build avec authentification
```bash
docker build -t nutritio-app .
```

### Lancer avec volume pour la BDD
```bash
docker run -d \
  -p 3006:3006 \
  -v $(pwd)/prisma:/app/prisma \
  --name nutritio-app \
  nutritio-app
```

### Variables d'environnement
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3006"
NEXTAUTH_SECRET="votre-secret-ici"
```

---

## 🔧 Développement

### Modifier le schéma
```bash
# 1. Modifier prisma/schema.prisma
# 2. Générer et appliquer
npx prisma generate
npx prisma db push

# 3. Rebuild Docker
docker build -t nutritio-app .
```

### Voir la base de données
```bash
# Ouvrir Prisma Studio
npx prisma studio
```

### Reset la base
```bash
rm prisma/dev.db
npx prisma db push
```

---

## 📊 Données Migrées

### Avant (localStorage)
- ❌ Données locales au navigateur
- ❌ Perdues si cache nettoyé
- ❌ Pas de sync entre appareils

### Après (Base de données)
- ✅ Données persistantes
- ✅ Accessibles depuis n'importe où
- ✅ Sécurisées et isolées par utilisateur
- ✅ Prêt pour sync multi-appareils

---

## 🎉 Résultate

**Nutritio est maintenant une vraie application multi-utilisateurs !**
- 🔐 Authentification sécurisée
- 👤 Comptes personnalisés
- 💾 Données persistantes
- 📊 Historique personnel
- 🐳 Dockerisé et prêt pour production

---

**Testez maintenant : http://localhost:3006** 🚀


