# 🚀 Démarrage Rapide - Nutritio

## Installation en 3 étapes

### 1. Installer les dépendances
```bash
cd Webapp
pip install -r requirements.txt
```

### 2. Lancer l'application
```bash
./start.sh
```

Ou manuellement :
```bash
python3 prepare_data.py  # Première fois seulement
python3 app.py
```

### 3. Ouvrir votre navigateur
```
http://localhost:5000
```

## 🎯 Utilisation rapide

1. **Profil** : Choisissez Homme ou Femme
2. **Recherche** : Tapez un aliment (ex: "pomme")
3. **Sélection** : Cliquez sur un résultat
4. **Quantité** : Ajustez si nécessaire (défaut: 100g)
5. **Résultats** : Consultez vos nutriments et % des besoins quotidiens

## ❓ Problèmes fréquents

### Les données ne se chargent pas
```bash
python3 prepare_data.py
```

### Port déjà utilisé
Modifiez le port dans `app.py` :
```python
app.run(debug=True, host='0.0.0.0', port=5001)  # Changez 5000 en 5001
```

### Erreur de module
```bash
pip install -r requirements.txt --upgrade
```

## 📊 Exemples d'aliments à tester

- Fruits : pomme, banane, orange
- Légumes : brocoli, carotte, tomate
- Viandes : poulet, boeuf
- Poissons : saumon, thon
- Céréales : riz, pâtes, pain

---

Bon appétit et bonne nutrition ! 🥗

