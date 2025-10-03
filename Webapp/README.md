# 🥗 Nutritio - Compteur de Micronutriments Personnalisé

Application web moderne pour suivre vos apports en micronutriments par rapport à vos besoins personnalisés.

## 🎯 Fonctionnalités

- **Recherche d'aliments** : Base de données complète de 3185 aliments (Table CIQUAL 2020)
- **Liste d'aliments** : Ajoutez plusieurs aliments et consultez les totaux cumulés
- **24 micronutriments** : Suivi complet des vitamines et minéraux
- **Profil personnalisé** : Recommandations nutritionnelles adaptées (Homme/Femme)
- **Calcul automatique** : Nutriments calculés pour n'importe quelle quantité
- **Visualisation claire** : Barres de progression et pourcentages des besoins quotidiens
- **Interface moderne** : Design responsive et intuitif

## 🚀 Installation

### Prérequis

- Python 3.8 ou supérieur
- pip

### Étapes d'installation

1. **Installer les dépendances**
```bash
cd Webapp
pip install -r requirements.txt
```

2. **Préparer les données**
```bash
python3 prepare_data.py
```

Cette commande va :
- Charger les données de la Table CIQUAL 2020
- Nettoyer et structurer les informations nutritionnelles
- Créer les fichiers `data/aliments.csv` et `data/recommandations.csv`

3. **Lancer l'application**
```bash
python3 app.py
```

4. **Accéder à l'application**

Ouvrez votre navigateur et allez à : `http://localhost:5000`

## 📊 Utilisation

1. **Sélectionnez votre profil** : Homme ou Femme (pour adapter les recommandations)

2. **Recherchez un aliment** : Tapez au moins 2 caractères dans la barre de recherche
   - Exemple : "pomme", "poulet", "riz"

3. **Sélectionnez l'aliment** : Cliquez sur un résultat de recherche

4. **Ajustez la quantité** : Modifiez la quantité en grammes (défaut: 100g)

5. **Ajoutez à votre liste** : Cliquez sur "➕ Ajouter à ma liste"

6. **Répétez** pour ajouter d'autres aliments

7. **Consultez les totaux cumulés** :
   - **Macronutriments** : Énergie, protéines, glucides, lipides, fibres, sucres, eau
   - **21 Micronutriments** : Vitamines et minéraux avec pourcentage des besoins quotidiens
   - **3 Nutriments informatifs** : Rétinol, Bêta-Carotène, Vitamine K1

8. **Gérez votre liste** :
   - Retirez un aliment avec 🗑️
   - Videz toute la liste avec "Vider la liste"

## 📁 Structure du projet

```
Webapp/
├── app.py                  # Application Flask principale
├── prepare_data.py         # Script de préparation des données
├── requirements.txt        # Dépendances Python
├── README.md              # Documentation
├── data/                  # Données générées
│   ├── aliments.csv
│   └── recommandations.csv
├── templates/             # Templates HTML
│   └── index.html
└── static/                # Fichiers statiques
    ├── css/
    │   └── style.css
    └── js/
        └── app.js
```

## 🔧 API Endpoints

### GET `/api/search?q=<query>`
Recherche d'aliments par nom
- **Paramètres** : `q` (string, min 2 caractères)
- **Retour** : Liste d'aliments correspondants

### GET `/api/aliment/<code>`
Récupère les détails d'un aliment
- **Paramètres** : `code` (string, code CIQUAL)
- **Retour** : Informations complètes de l'aliment

### POST `/api/calculate`
Calcule les nutriments pour une quantité donnée
- **Body** :
  ```json
  {
    "code": "12345",
    "quantity": 150,
    "gender": "Homme"
  }
  ```
- **Retour** : Macros, micros, recommandations et pourcentages

### GET `/api/recommandations?gender=<gender>`
Récupère les recommandations nutritionnelles
- **Paramètres** : `gender` (Homme ou Femme)
- **Retour** : Liste des recommandations

## 📈 Données

- **Aliments** : Table CIQUAL 2020 (ANSES)
  - 3000+ aliments français
  - 23 nutriments par aliment

- **Recommandations** : Références nutritionnelles ANSES
  - Adaptées par sexe
  - Basées sur les besoins quotidiens adultes

## 🎨 Technologies utilisées

- **Backend** : Flask (Python)
- **Frontend** : HTML5, CSS3, JavaScript (Vanilla)
- **Données** : Pandas, NumPy
- **Design** : CSS moderne avec animations et gradients

## 📝 Notes

- Les valeurs nutritionnelles sont données pour 100g d'aliment
- Les recommandations sont basées sur les besoins d'un adulte en bonne santé
- Les pourcentages sont calculés par rapport aux besoins quotidiens

## 🤝 Contribution

N'hésitez pas à contribuer en :
- Signalant des bugs
- Proposant de nouvelles fonctionnalités
- Améliorant la documentation

## 📄 Licence

Projet éducatif - Données ANSES (Agence nationale de sécurité sanitaire de l'alimentation)

---

**Développé avec ❤️ pour une meilleure nutrition**

