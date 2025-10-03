# 🧪 Guide des Tests - Nutritio

## 📋 Fichiers de Tests Disponibles

### 1. **test_api.sh** - Tests API Rapides (Bash)
Tests rapides des endpoints API avec curl.

**Utilisation :**
```bash
cd tests
./test_api.sh
```

**Tests inclus :**
- ✅ Page d'accueil
- ✅ API Search (vide, court, normal)
- ✅ Récupération d'aliments
- ✅ Calculs de nutriments
- ✅ Recommandations
- ✅ Validation Potassium/Sodium
- ✅ Validation Vitamine B3
- ✅ Tri de recherche

**Sortie :**
```
Test 1: Page d'accueil accessible ... ✅ PASSED (HTTP 200)
Test 2: API Search avec query vide ... ✅ PASSED (HTTP 200)
...
Total: 22 tests
Réussis: 22 ✅
Échoués: 0 ❌
Taux de réussite: 100%
```

---

### 2. **test_detailed.py** - Tests Détaillés (Python)
Tests complets avec validation des données.

**Prérequis :**
```bash
pip install requests
```

**Utilisation :**
```bash
cd tests
python3 test_detailed.py
```

**Tests inclus :**
- ✅ Tous les endpoints
- ✅ Validation du contenu JSON
- ✅ Tests de cohérence des calculs
- ✅ Tests des bugs corrigés
- ✅ Tests des différences Homme/Femme

**Sortie :**
```
═══════════════════════════════════════
  TESTS DE BASE
═══════════════════════════════════════

Test 1: Page d'accueil accessible ... ✅ PASSED
     → HTTP 200
...
```

---

### 3. **test_nutrients.py** - Tests des Calculs (Python)
Tests approfondis des calculs nutritionnels.

**Utilisation :**
```bash
cd tests
python3 test_nutrients.py
```

**Tests inclus :**
- ✅ Calcul pour Oeuf cru (100g, 200g)
- ✅ Calcul pour Banane plantain
- ✅ Calcul pour Poulet
- ✅ Affichage détaillé de tous les nutriments
- ✅ Vérification Potassium/Sodium
- ✅ Vérification Vitamine B3

**Sortie :**
```
══════════════════════════════════════════════════════════════
  TEST: Oeuf cru (100g, Homme)
══════════════════════════════════════════════════════════════

MACRONUTRIMENTS:
  energie_kcal        :   140.00
  proteines           :    12.70
  glucides            :     0.27
  lipides             :     9.83

MICRONUTRIMENTS (avec % des besoins):
  Calcium              :    76.80 mg  (  8.1%)
  Fer                  :     1.88 mg  ( 17.1%)
  Vitamine B12         :     1.45 µg  ( 36.3%)
  ...
```

---

## 🚀 Lancer Tous les Tests

### Script Simple (Bash)
```bash
cd /home/amine/Documents/WORK/Nutritio/nutritio-nextjs/tests
./test_api.sh
```

### Script Détaillé (Python)
```bash
cd /home/amine/Documents/WORK/Nutritio/nutritio-nextjs/tests
python3 test_detailed.py
```

### Tests Nutritionnels
```bash
cd /home/amine/Documents/WORK/Nutritio/nutritio-nextjs/tests
python3 test_nutrients.py
```

---

## 📊 Types de Tests

### Tests Fonctionnels
- [x] Routes API accessibles
- [x] Recherche d'aliments
- [x] Récupération d'aliments
- [x] Calculs de nutriments
- [x] Recommandations

### Tests de Validation
- [x] Potassium/Sodium corrigés (pas 9000%+)
- [x] Vitamine B3 corrigée (14 mg pas 1.6 mg)
- [x] Tri de recherche (aliments simples en premier)
- [x] Calculs proportionnels (200g = 2x 100g)

### Tests de Cohérence
- [x] Différences Homme/Femme
- [x] Unités correctes (mg, µg, g)
- [x] Valeurs dans des ranges raisonnables

---

## ✅ Liste de Vérification

### Avant de Lancer les Tests

- [ ] Serveur démarré sur http://localhost:3006
- [ ] Fichiers CSV présents dans `public/data/`
- [ ] Pas d'erreurs dans les logs du serveur

### Commande Rapide

```bash
# Vérifier que le serveur tourne
curl -I http://localhost:3006

# Lancer les tests
cd /home/amine/Documents/WORK/Nutritio/nutritio-nextjs/tests
./test_api.sh
```

---

## 🐛 En Cas d'Échec

### Test échoue avec "Connection refused"
```bash
# Le serveur n'est pas démarré
cd /home/amine/Documents/WORK/Nutritio/nutritio-nextjs
npm run dev
```

### Test échoue avec "404"
```bash
# Vérifier les routes API
ls -la app/api/
```

### Calculs incorrects
```bash
# Vérifier les données CSV
head public/data/recommandations.csv
grep "22000" public/data/aliments.csv
```

---

## 📈 Résultats Attendus

### Tests API (test_api.sh)
```
✅ 22/22 tests passés (100%)
```

### Tests Détaillés (test_detailed.py)
```
✅ 13/13 tests passés (100%)
```

### Tests Nutriments (test_nutrients.py)
```
✅ 4 calculs testés, tous cohérents
```

---

## 🔄 Intégration Continue

### Ajouter dans package.json
```json
{
  "scripts": {
    "test": "cd tests && ./test_api.sh",
    "test:detailed": "cd tests && python3 test_detailed.py",
    "test:nutrients": "cd tests && python3 test_nutrients.py"
  }
}
```

### Utilisation
```bash
npm test
npm run test:detailed
npm run test:nutrients
```

---

## 📝 Ajouter des Tests

### Nouveau test Bash
Éditez `test_api.sh` :
```bash
test_endpoint "Mon nouveau test" "$BASE_URL/api/mon-endpoint"
```

### Nouveau test Python
Éditez `test_detailed.py` :
```python
def test_ma_fonction() -> Tuple[bool, str]:
    # Votre logique de test
    return (success, "message")

# Dans main:
test("Mon nouveau test", test_ma_fonction)
```

---

**Tests prêts à être exécutés ! 🧪✅**

