# 🔬 Analyse Approfondie : Problème Potassium et Sodium

## 📊 Contexte

Le potassium et le sodium ont un traitement spécial dans le code car leurs **recommandations sont stockées en grammes** dans le CSV, alors que tous les autres nutriments sont en milligrammes.

---

## 🔍 Données Sources

### Fichier `recommandations.csv`
```csv
Potassium,g/j,3.5,3.5
Sodium,g/j,1.5,1.5
```

### Fichier `aliments.csv` (Banane plantain)
```
Potassium: 499 mg (pour 100g)
Sodium: 4 mg (pour 100g)
```

---

## 🧮 Calculs Actuels

### Pour 100g de Banane Plantain

**Potassium:**
- Valeur aliment: 499 mg
- Recommandation: 3.5 g = 3500 mg (après conversion)
- Pourcentage: (499 / 3500) × 100 = **14.3%** ✅

**Sodium:**
- Valeur aliment: 4 mg
- Recommandation: 1.5 g = 1500 mg (après conversion)
- Pourcentage: (4 / 1500) × 100 = **0.3%** ✅

---

## 💻 Code Actuel (lib/data.ts, lignes 164-171)

```typescript
if (colName === 'potassium' || colName === 'sodium') {
  nutriments[recoName] = Math.round(calculatedValue * 100) / 100;
  const reco = recommandations.find(r => r.Nutriment === recoName);
  if (reco) {
    const recoValueMg = reco[gender] * 1000;  // Conversion g → mg
    recommandationsMap[recoName] = recoValueMg;
    pourcentages[recoName] = Math.round((calculatedValue / recoValueMg) * 100 * 10) / 10;
  }
}
```

### Logique
1. Lit la recommandation en grammes (ex: 3.5 g)
2. Multiplie par 1000 pour convertir en mg (3500 mg)
3. Calcule le pourcentage avec la valeur en mg de l'aliment

---

## ⚠️ Problèmes Potentiels

### 1. **Incohérence d'unités dans l'affichage**

Le fichier `NUTRIENT_UNITS` définit:
```typescript
potassium: 'mg',
sodium: 'mg',
```

Mais dans le frontend (`NutrientsResults.tsx`), la fonction `getUnit()` ne fait pas de distinction spéciale pour K et Na:

```typescript
const getUnit = (nutrient: string): string => {
  if (
    nutrient.includes('Vitamine D') ||
    nutrient.includes('Vitamine B12') ||
    nutrient.includes('Folates') ||
    nutrient.includes('Iode') ||
    nutrient.includes('Sélénium')
  ) {
    return 'µg';
  }
  return 'mg';  // ← Potassium et Sodium reçoivent 'mg'
};
```

### 2. **Recommandations affichées en mg**

Dans l'interface, on affiche :
```
Potassium: 499 mg / 3500 mg (14.3%)
```

Ceci est correct MAIS pourrait être source de confusion car:
- L'utilisateur s'attend peut-être à voir "3.5 g" pour la recommandation
- Les valeurs sont très élevées (3500 mg vs 3.5 g)

### 3. **Comparaison avec d'autres nutriments**

```
Calcium: 34 mg / 950 mg (3.6%)       ← Ordre de grandeur similaire
Potassium: 499 mg / 3500 mg (14.3%)  ← Valeurs beaucoup plus grandes
```

---

## ✅ Vérification des Calculs

### Test avec différentes quantités

| Quantité | Potassium calculé | % de 3500 mg | Résultat attendu |
|----------|-------------------|--------------|------------------|
| 100g     | 499 mg           | 14.3%        | ✅ Correct       |
| 200g     | 998 mg           | 28.5%        | ✅ Correct       |
| 350g     | 1746.5 mg        | 49.9%        | ✅ Correct       |
| 700g     | 3493 mg          | 99.8%        | ✅ Correct       |

**Conclusion:** Les calculs sont mathématiquement corrects.

---

## 🎯 Problèmes Identifiés

### Problème 1: Unités incohérentes dans l'affichage
❌ **Recommandation affichée en mg** (3500 mg) alors qu'elle devrait être en g (3.5 g)

### Problème 2: Valeur de référence peu intuitive
❌ **3500 mg** est moins lisible que **3.5 g**

### Problème 3: Aucune distinction visuelle
❌ Potassium et Sodium affichés comme les autres nutriments

---

## 🔧 Solutions Proposées

### Solution 1: Afficher les recommandations en grammes
```typescript
// Dans NutrientsResults.tsx
const getUnit = (nutrient: string): string => {
  if (nutrient === 'Potassium' || nutrient === 'Sodium') {
    return 'mg'; // Pour la valeur de l'aliment
  }
  // ... reste du code
};

const getRecoUnit = (nutrient: string): string => {
  if (nutrient === 'Potassium' || nutrient === 'Sodium') {
    return 'g'; // Pour la recommandation
  }
  return getUnit(nutrient);
};

// Affichage:
// Potassium: 499 mg / 3.5 g (14.3%)
```

### Solution 2: Tout convertir en grammes pour K et Na
```typescript
// Affichage:
// Potassium: 0.499 g / 3.5 g (14.3%)
```

### Solution 3: Garder mg mais ajouter une note
```typescript
// Affichage:
// Potassium: 499 mg / 3500 mg (14.3%)
// Note: Recommandation = 3.5 g/jour
```

---

## 📈 Recommandation

**Solution 1** est la meilleure car:
- ✅ Conserve la précision des valeurs en mg pour les aliments
- ✅ Affiche les recommandations dans l'unité officielle (g/jour)
- ✅ Plus lisible et intuitif pour l'utilisateur
- ✅ Conforme aux références ANSES (qui utilisent g/j)

---

## 🧪 Tests Requis

1. ✅ Vérifier calcul avec 100g de banane
2. ✅ Vérifier calcul avec différentes quantités
3. ⚠️ Vérifier l'affichage dans l'interface utilisateur
4. ⚠️ Vérifier que les unités sont cohérentes
5. ⚠️ Tester avec plusieurs aliments cumulés

---

## 📝 Conclusion

**Les calculs backend sont CORRECTS** ✅

**Le problème est dans la PRÉSENTATION** ❌

Il faut améliorer l'affichage pour que les unités soient cohérentes et intuitives pour l'utilisateur.

