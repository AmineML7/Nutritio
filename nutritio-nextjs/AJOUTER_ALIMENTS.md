# 📝 Guide : Ajouter des Aliments Manquants à CIQUAL

## 🎯 Aliments Présents vs Manquants

### ✅ Aliments déjà dans CIQUAL

**Œufs** (codes 220xx) :
- Œuf, blanc cuit (22008)
- Œuf, jaune cuit (22009)
- Œuf, dur (22010)
- Œuf, poché (22011)
- Œuf, à la coque (22014)
- Œuf, au plat frit (22501)

**Viandes** :
- 52 poulets (dont poulet cru)
- 87 bœufs
- 82 porcs

**Autres** :
- Riz blanc cru (9100)
- Tomate crue (20047)
- Carotte crue (20009)

### ❌ Aliments qui pourraient manquer

- Œuf entier cru
- Lait entier simple
- Bœuf haché cru
- Saumon cru
- Thon cru
- Etc.

---

## 📊 Structure des Données

### Format CSV

Le fichier `aliments.csv` a **36 colonnes** :

```csv
code,nom,groupe,sous_groupe,
energie_kcal,proteines,glucides,lipides,fibres,sucres,eau,
calcium,cuivre,fer,iode,magnesium,manganese,phosphore,potassium,selenium,sodium,zinc,
retinol,beta_carotene,vitamine_D,vitamine_E,vitamine_K1,vitamine_K2,
vitamine_C,vitamine_B1,vitamine_B2,vitamine_B3,vitamine_B5,vitamine_B6,vitamine_B9,vitamine_B12
```

### Exemple : Œuf entier cru

Pour ajouter un œuf entier cru, voici les valeurs (sources ANSES/USDA) :

```csv
99999,"Œuf de poule, entier, cru","viandes, œufs, poissons et assimilés",œufs,
143,12.6,0.72,9.51,0,0.37,76.15,
56,0.072,1.75,53.5,12,0.028,198,138,30.7,142,1.29,
160,88,2.0,1.05,0.3,0,
0,0.040,0.457,0.075,1.533,0.170,47,0.89
```

---

## 🛠️ Comment Ajouter des Aliments

### Méthode 1 : Modifier le CSV manuellement

```bash
# Ouvrir le fichier
nano public/data/aliments.csv

# Ajouter une ligne à la fin
# Utiliser un code unique (ex: 99001, 99002, etc.)
```

### Méthode 2 : Script Python (Recommandé)

Je vais créer un script pour vous qui permet d'ajouter facilement des aliments.

---

## 📚 Sources de Données Fiables

### Pour obtenir les valeurs nutritionnelles exactes :

1. **ANSES CIQUAL** (Français)
   - https://ciqual.anses.fr/
   - Chercher l'aliment et copier les valeurs

2. **USDA** (Anglais, très détaillé)
   - https://fdc.nal.usda.gov/
   - Chercher puis copier les nutriments

3. **Table Suisse** (Français)
   - https://naehrwertdaten.ch/fr/
   - Base suisse très précise

### Convertir les Unités

**Attention aux unités !**

Dans notre CSV :
- Énergie : **kcal**
- Macros (protéines, glucides, lipides, fibres, sucres, eau) : **g**
- Minéraux (calcium, fer, magnésium, etc.) : **mg**
- Vitamines B, C, E : **mg**
- Vitamines D, B9, B12, A (rétinol, bêta-carotène) : **µg**

---

## 🚀 Script d'Ajout d'Aliments

Voulez-vous que je crée :

1. **Un script Python** qui vous permet d'ajouter facilement des aliments ?
2. **Une interface web** dans l'app pour ajouter des aliments ?
3. **Un fichier CSV de compléments** avec les aliments bruts manquants ?

---

## 📋 Liste d'Aliments à Ajouter (Suggestions)

### Œufs
- [ ] Œuf entier, cru
- [ ] Œuf entier, brouillé
- [ ] Omelette nature

### Viandes Brutes
- [ ] Bœuf haché, cru (5% MG)
- [ ] Bœuf haché, cru (15% MG)
- [ ] Porc, côtelette, crue
- [ ] Agneau, gigot, cru

### Poissons Bruts
- [ ] Saumon, filet, cru
- [ ] Thon, filet, cru
- [ ] Cabillaud, filet, cru
- [ ] Sardine, fraîche, crue

### Produits Laitiers
- [ ] Lait entier
- [ ] Lait demi-écrémé
- [ ] Yaourt nature entier
- [ ] Fromage blanc 0%

### Légumineuses
- [ ] Lentilles, crues
- [ ] Pois chiches, crus
- [ ] Haricots rouges, crus

---

**Dites-moi ce que vous préférez et je vous aide à compléter la base !**

