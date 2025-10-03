# Nutritio - Application Next.js

Application moderne de suivi des micronutriments construite avec Next.js, TypeScript et Tailwind CSS.

## 🚀 Démarrage Rapide

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:3006](http://localhost:3006) dans votre navigateur.

## 🧪 Tests

```bash
# Tests API rapides
npm test

# Tests détaillés
npm run test:detailed

# Tests des calculs nutritionnels
npm run test:nutrients
```

## 📁 Structure

```
nutritio-nextjs/
├── app/                    # Pages et API Next.js
│   ├── api/               # Routes API REST
│   ├── page.tsx           # Page principale
│   ├── layout.tsx         # Layout
│   └── types.ts           # Types TypeScript
├── components/            # Composants React
├── lib/                   # Logique métier
│   └── data.ts           # Gestion données CSV
├── public/
│   └── data/             # Fichiers CSV (aliments, recommandations)
└── tests/                # Suite de tests
```

## 🎨 Technologies

- **Next.js 15** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS 3** - Framework CSS
- **CSV Parse** - Lecture des données

## 📊 Données

- **Base CIQUAL 2020** - 3,185 aliments français
- **Recommandations ANSES** - Valeurs nutritionnelles de référence
- **36 nutriments** par aliment

## ✨ Fonctionnalités

- Recherche intelligente avec tri par pertinence
- Pagination progressive des résultats
- Calculs nutritionnels personnalisés (Homme/Femme)
- Visualisation des macronutriments et micronutriments
- Interface minimaliste et élégante
- Design responsive

## 📝 License

Données nutritionnelles © ANSES
