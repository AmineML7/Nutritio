# Nutritio - Version Next.js

Application moderne de suivi des micronutriments construite avec Next.js 14, TypeScript et Tailwind CSS.

## 🚀 Fonctionnalités

- ✨ Interface moderne et responsive avec Tailwind CSS
- 🔍 Recherche d'aliments en temps réel
- 📊 Visualisation des macronutriments et micronutriments
- 👤 Recommandations personnalisées par genre
- 📋 Gestion de liste d'aliments
- 🎨 Animations et transitions fluides
- 📱 Design mobile-first

## 🛠️ Technologies

- **Next.js 14** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **API Routes** - API REST intégrée

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📁 Structure du projet

```
nutritio-nextjs/
├── app/
│   ├── api/              # Routes API
│   │   ├── search/       # Recherche d'aliments
│   │   ├── aliment/      # Détails d'un aliment
│   │   ├── calculate/    # Calcul des nutriments
│   │   └── recommandations/ # Recommandations nutritionnelles
│   ├── page.tsx          # Page principale
│   ├── layout.tsx        # Layout de l'application
│   ├── globals.css       # Styles globaux
│   └── types.ts          # Types TypeScript
├── components/           # Composants React
│   ├── Header.tsx
│   ├── GenderSelector.tsx
│   ├── SearchBar.tsx
│   ├── SelectedAliment.tsx
│   ├── AlimentsList.tsx
│   └── NutrientsResults.tsx
├── lib/
│   └── data.ts          # Gestion des données CSV
└── public/
    └── data/            # Fichiers CSV
```

## 🎨 Design

L'application utilise un design moderne avec:

- **Dégradés de couleurs** pour les en-têtes et cartes
- **Animations CSS** pour les transitions
- **Ombres et effets hover** pour l'interactivité
- **Design responsive** adapté à tous les écrans
- **Thème vert/teal** pour une ambiance nature et santé

## 📊 Données

Les données nutritionnelles proviennent de:
- **Table CIQUAL 2020** - ANSES (Agence nationale de sécurité sanitaire)
- **Références nutritionnelles** - ANSES

## 🚀 Déploiement

Pour déployer en production:

```bash
# Build de production
npm run build

# Lancer le serveur de production
npm start
```

## 📝 License

Données nutritionnelles © ANSES
