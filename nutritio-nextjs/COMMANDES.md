# 🛠️ Commandes Utiles - Nutritio Next.js

## 📦 Installation

```bash
# Se déplacer dans le dossier
cd /home/amine/Documents/WORK/Nutritio/nutritio-nextjs

# Installer les dépendances
npm install
```

## 🚀 Développement

```bash
# Lancer le serveur de développement (http://localhost:3000)
npm run dev

# Lancer en mode production
npm run build
npm start

# Vérifier les lints
npm run lint
```

## 🔧 Maintenance

```bash
# Nettoyer le cache Next.js
rm -rf .next

# Nettoyer les node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install

# Rebuild complet
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

## 📊 Scripts Disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lance le serveur de développement |
| `npm run build` | Compile pour la production |
| `npm start` | Lance le serveur de production |
| `npm run lint` | Vérifie le code |

## 🌐 URLs

| Service | URL | Description |
|---------|-----|-------------|
| Application | http://localhost:3000 | Interface principale |
| API Search | http://localhost:3000/api/search?q=pomme | Recherche d'aliments |
| API Aliment | http://localhost:3000/api/aliment/11060 | Détails d'un aliment |
| API Calculate | http://localhost:3000/api/calculate | Calcul des nutriments (POST) |
| API Reco | http://localhost:3000/api/recommandations?gender=Homme | Recommandations |

## 🧪 Tests API (avec curl)

### Rechercher un aliment
```bash
curl "http://localhost:3000/api/search?q=pomme"
```

### Obtenir un aliment
```bash
curl "http://localhost:3000/api/aliment/11060"
```

### Calculer les nutriments
```bash
curl -X POST http://localhost:3000/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"code": 11060, "quantity": 150, "gender": "Homme"}'
```

### Obtenir les recommandations
```bash
curl "http://localhost:3000/api/recommandations?gender=Homme"
```

## 📝 Structure des Données

### Format CSV Aliments
```csv
code,nom,groupe,sous_groupe,energie_kcal,proteines,...
11060,Pomme,Fruits,Fruits frais,52,0.3,...
```

### Format CSV Recommandations
```csv
Nutriment,Unité,Homme,Femme
Vitamine C,mg,110,110
Calcium,mg,950,950
```

## 🔄 Workflow de Développement

1. **Développement**
   ```bash
   npm run dev
   # Modifier le code
   # Hot reload automatique
   ```

2. **Test**
   ```bash
   # Tester dans le navigateur
   # Vérifier la console
   # Tester les API avec curl
   ```

3. **Production**
   ```bash
   npm run build
   npm start
   ```

## 📂 Fichiers Importants

| Fichier | Description |
|---------|-------------|
| `app/page.tsx` | Page principale |
| `app/layout.tsx` | Layout global |
| `app/globals.css` | Styles globaux |
| `app/api/*/route.ts` | Routes API |
| `components/*.tsx` | Composants React |
| `lib/data.ts` | Gestion des données |
| `public/data/*.csv` | Données nutritionnelles |

## 🐛 Debugging

### Problème : Le serveur ne démarre pas
```bash
# Vérifier que le port 3000 est libre
lsof -ti:3000 | xargs kill -9

# Relancer
npm run dev
```

### Problème : Erreur de compilation
```bash
# Nettoyer et rebuild
rm -rf .next
npm run dev
```

### Problème : Erreur TypeScript
```bash
# Vérifier les types
npm run build

# Lire les erreurs et corriger
```

### Problème : Données CSV manquantes
```bash
# Vérifier que les CSV sont présents
ls -la public/data/

# Copier depuis l'ancienne version si nécessaire
cp ../Webapp/data/*.csv public/data/
```

## 📱 Test Mobile

### Avec le navigateur
1. Ouvrir DevTools (F12)
2. Toggle Device Toolbar (Ctrl+Shift+M)
3. Sélectionner un appareil mobile

### Sur un vrai mobile (même réseau)
```bash
# Trouver l'IP de votre machine
ip addr show | grep "inet "

# Sur mobile, aller à :
http://[VOTRE_IP]:3000
```

## 🚢 Déploiement

### Vercel (Recommandé)
```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel
```

### Docker
```bash
# Créer l'image
docker build -t nutritio-nextjs .

# Lancer le conteneur
docker run -p 3000:3000 nutritio-nextjs
```

### Serveur classique
```bash
# Build
npm run build

# Upload sur serveur
scp -r .next package.json server:/var/www/nutritio/

# Sur le serveur
cd /var/www/nutritio
npm install --production
npm start
```

## 🔐 Variables d'Environnement

Créer `.env.local` :
```env
# Port (optionnel, défaut: 3000)
PORT=3000

# Node env
NODE_ENV=development
```

## 📊 Monitoring

### Logs de développement
```bash
# Logs en temps réel
npm run dev

# Logs détaillés
DEBUG=* npm run dev
```

### Performance
```bash
# Analyser le bundle
npm run build

# Lighthouse dans Chrome DevTools
# Performance > Generate report
```

## 🎯 Bonnes Pratiques

1. **Git** : Toujours commit avant modifications majeures
2. **Backup** : Sauvegarder les données CSV
3. **Tests** : Tester après chaque modification
4. **Types** : Utiliser TypeScript correctement
5. **Performance** : Optimiser les images et données

---

💡 **Besoin d'aide ?** Consulter la [documentation Next.js](https://nextjs.org/docs)

