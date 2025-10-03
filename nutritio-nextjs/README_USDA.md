# 🎉 Migration USDA Terminée !

## ✅ Votre application utilise maintenant USDA avec 300,000+ aliments !

---

## 🚀 Démarrage Rapide

### Option 1 : Script automatique
```bash
./START_USDA.sh
```

### Option 2 : Manuel
```bash
# 1. Créer .env.local (si pas encore fait)
echo "USDA_API_KEY=vAtINa40I4HcNQPHEKboNlA8J9Tax5aU5jPINcej" > .env.local

# 2. Démarrer le serveur
npm run dev
```

---

## 🌐 Accès

Ouvrez votre navigateur sur : **http://localhost:3006**

---

## 🎯 Utilisation

### 1. Choisir la base de données

Dans l'interface, vous verrez :

```
┌──────────────────┬──────────────────┐
│ USDA ✓           │ CIQUAL           │
│ 300,000+ aliments│ 3,000 aliments FR│
└──────────────────┴──────────────────┘
```

**USDA est sélectionné par défaut !**

### 2. Rechercher un aliment

**En français** (traduit automatiquement) :
- pomme → apple
- banane → banana
- poulet → chicken

**En anglais** (direct) :
- apple
- banana
- chicken

### 3. Ajouter et calculer

Exactement comme avant ! La seule différence est que vous avez maintenant accès à **100x plus d'aliments**.

---

## 📊 Avantages USDA

| Aspect | CIQUAL | USDA |
|--------|--------|------|
| Aliments | 3,000 | 300,000+ ✅ |
| Diversité | FR uniquement | International ✅ |
| Marques | Non | Oui ✅ |
| Aliments bruts | Oui | Oui ✅ |
| Mise à jour | Tous les 5 ans | Mensuel ✅ |

---

## 🔄 Basculer entre les bases

Utilisez le sélecteur dans l'interface :
- **USDA** → Pour la diversité (300k aliments)
- **CIQUAL** → Pour les aliments français spécifiques (fromages, charcuterie...)

---

## 📝 Fichiers Importants

- `lib/usda.ts` → Module USDA principal
- `app/api/usda/` → Routes API
- `.env.local` → Clé API (NE PAS COMMIT)
- `MIGRATION_USDA.md` → Documentation complète

---

## 🆘 Aide

### Le serveur ne démarre pas

```bash
# Nettoyer et relancer
rm -rf .next
npm install
npm run dev
```

### Pas de résultats de recherche

1. Vérifiez que `.env.local` existe
2. Vérifiez la clé API
3. Essayez en anglais directement

### Erreur API

La clé gratuite a une limite de 1000 requêtes/heure.
Si dépassée, attendez 1h ou créez une nouvelle clé sur :
https://fdc.nal.usda.gov/api-key-signup.html

---

## 🎉 C'est Tout !

Profitez des **300,000+ aliments** disponibles ! 🥗🍎🥦🍗🥛

