# 🐳 Nutritio Dockerisé

## ✅ Application Dockerisée avec Succès !

### 🚀 Accès
**URL :** http://localhost:3006

---

## 📋 Commandes Docker

### Lancer l'application
```bash
docker run -d -p 3006:3006 --name nutritio-app nutritio-app
```

### Arrêter l'application
```bash
docker stop nutritio-app
```

### Redémarrer l'application
```bash
docker start nutritio-app
```

### Supprimer l'application
```bash
docker rm -f nutritio-app
```

### Voir les logs
```bash
docker logs nutritio-app
```

### Rebuild l'image
```bash
docker build -t nutritio-app .
```

---

## 🔧 Configuration

### Port
- **Application :** 3006
- **Mapping :** localhost:3006 → conteneur:3006

### Volumes
- **Données CSV :** Montées en lecture seule
- **Path :** `./public/data:/app/public/data:ro`

### Environnement
- **NODE_ENV :** production
- **PORT :** 3006
- **HOSTNAME :** 0.0.0.0

---

## 📊 Fonctionnalités Dockerisées

### ✅ Inclus
- **Interface Next.js** complète
- **Base de données CIQUAL** (CSV)
- **Graphiques d'évolution** (Recharts)
- **Historique quotidien** (localStorage)
- **Recherche d'aliments** avancée
- **Calculs nutritionnels** précis

### 🎯 Avantages Docker
- **Portabilité** : Fonctionne partout
- **Isolation** : Environnement propre
- **Performance** : Build optimisé
- **Sécurité** : Utilisateur non-root
- **Healthcheck** : Monitoring automatique

---

## 🛠️ Développement

### Modifier le code
1. Modifier les fichiers
2. Rebuild : `docker build -t nutritio-app .`
3. Redémarrer : `docker restart nutritio-app`

### Debug
```bash
# Entrer dans le conteneur
docker exec -it nutritio-app sh

# Voir les logs en temps réel
docker logs -f nutritio-app
```

---

## 📈 Monitoring

### Health Check
```bash
# Vérifier le statut
docker ps

# Tester l'endpoint
curl http://localhost:3006
```

### Ressources
```bash
# Utilisation CPU/Mémoire
docker stats nutritio-app
```

---

## 🚀 Production

### Variables d'environnement
```bash
docker run -d \
  -p 3006:3006 \
  -e NODE_ENV=production \
  -e PORT=3006 \
  --name nutritio-app \
  nutritio-app
```

### Persistance des données
```bash
# Sauvegarder l'historique
docker cp nutritio-app:/app/data ./backup/
```

---

**🎉 Nutritio est maintenant dockerisé et prêt pour la production !**
