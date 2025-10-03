# 📝 Changelog - Nutritio

## Version 2.0 - Liste d'aliments et cumul nutritionnel (2 octobre 2025)

### 🆕 Nouvelles fonctionnalités

#### 📋 Système de liste d'aliments
- **Ajout multiple d'aliments** : Vous pouvez maintenant ajouter plusieurs aliments à une liste
- **Calcul cumulé** : Les apports nutritionnels sont additionnés automatiquement
- **Gestion de la liste** : Retirez des aliments individuellement ou videz toute la liste

#### 📊 Statistiques enrichies
- **24 micronutriments** suivis (contre 12 auparavant)
- **21 nutriments avec recommandations** et pourcentages
- **3 nutriments informatifs** (Rétinol, Bêta-Carotène, Vitamine K1)

### 🎯 Utilisation

1. **Recherchez un aliment** dans la barre de recherche
2. **Sélectionnez-le** dans les résultats
3. **Ajustez la quantité** (défaut: 100g)
4. **Cliquez sur "➕ Ajouter à ma liste"**
5. **Répétez** pour ajouter d'autres aliments
6. **Consultez les totaux cumulés** dans la section "Résultats nutritionnels"

### 🔧 Fonctionnalités de la liste

#### Ajouter un aliment
- Cliquez sur "➕ Ajouter à ma liste" après avoir sélectionné un aliment et sa quantité
- L'aliment apparaît dans la section "📋 Ma liste d'aliments"
- Les totaux se recalculent automatiquement

#### Retirer un aliment
- Cliquez sur l'icône 🗑️ à droite de chaque aliment
- Les totaux sont recalculés sans cet aliment

#### Vider la liste
- Cliquez sur "🗑️ Vider la liste" en haut à droite
- Confirmer pour supprimer tous les aliments

#### Changer de profil
- Sélectionnez Homme ou Femme
- Les pourcentages se recalculent automatiquement selon les besoins

### 📈 Affichage des résultats

#### Section "Ma liste d'aliments"
Chaque aliment affiche :
- **Nom** de l'aliment
- **Quantité** en grammes
- **Résumé rapide** : Énergie, Protéines, Glucides, Lipides

#### Section "Résultats nutritionnels"
Affiche les **totaux cumulés** :
- **Macronutriments** (Énergie, Protéines, Glucides, Lipides, Fibres, Sucres, Eau)
- **Micronutriments** avec barres de progression et pourcentages des besoins quotidiens
- **Nutriments informatifs** (sans recommandations)

### 🎨 Interface améliorée

- **Badge de nombre** : "Total (3 aliments)" dans les résultats
- **Couleurs dynamiques** des barres selon le pourcentage :
  - 🟠 Orange : < 40% (faible)
  - 🟡 Jaune : 40-70% (moyen)
  - 🟢 Vert : 70-100% (bon)
  - 🔵 Bleu : > 100% (excellent)

### 💡 Cas d'usage

#### Planifier un repas
```
1. Ajouter : Riz (150g)
2. Ajouter : Poulet (120g)
3. Ajouter : Brocoli (100g)
→ Voir les totaux nutritionnels du repas
```

#### Suivre sa journée
```
Petit-déjeuner:
- Pain complet (60g)
- Beurre (10g)
- Orange (120g)

Déjeuner:
- Pâtes (200g)
- Sauce tomate (80g)
- Parmesan (20g)

→ Total de la journée affiché
```

#### Comparer des alternatives
```
Option A:
- Bœuf (150g)
- Riz blanc (150g)

Option B:
- Saumon (150g)
- Quinoa (150g)

→ Comparer les apports nutritionnels
```

### 🐛 Corrections

- Fix du calcul du Potassium et Sodium (conversion g → mg)
- Amélioration de l'arrondi des valeurs affichées
- Meilleure gestion des nutriments sans valeurs

### 📦 Données

- **Base CIQUAL 2020** : 3185 aliments
- **Recommandations ANSES** : 26 nutriments
- **Couverture** : 36 colonnes nutritionnelles par aliment

---

## Version 1.0 - Version initiale

### Fonctionnalités de base
- Recherche d'aliments
- Calcul nutritionnel pour un aliment
- Profil utilisateur (Homme/Femme)
- Affichage des macronutriments
- Affichage de 12 micronutriments

---

**Développé avec ❤️ pour une meilleure nutrition**


