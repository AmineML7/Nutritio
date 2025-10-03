# 📊 Guide des Bases de Données Nutritionnelles

## 1. USDA FoodData Central (USA) ⭐

### Caractéristiques
- **Aliments** : 300,000+
- **Nutriments** : ~150 par aliment
- **Mise à jour** : Régulière
- **Langue** : Anglais
- **API** : Gratuite

### Obtenir une clé API
1. Aller sur : https://fdc.nal.usda.gov/api-key-signup.html
2. S'inscrire (gratuit)
3. Recevoir la clé par email

### Exemples d'utilisation

#### Rechercher un aliment
```bash
curl "https://api.nal.usda.gov/fdc/v1/foods/search?query=banana&pageSize=5&api_key=DEMO_KEY" | jq
```

#### Obtenir les détails d'un aliment
```bash
curl "https://api.nal.usda.gov/fdc/v1/food/173944?api_key=DEMO_KEY" | jq
```

### Intégration Next.js

```typescript
// lib/usda.ts
const USDA_API_KEY = process.env.USDA_API_KEY;
const USDA_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

export async function searchUSDAFoods(query: string) {
  const response = await fetch(
    `${USDA_BASE_URL}/foods/search?query=${encodeURIComponent(query)}&pageSize=20&api_key=${USDA_API_KEY}`
  );
  return response.json();
}

export async function getUSDAFood(fdcId: number) {
  const response = await fetch(
    `${USDA_BASE_URL}/food/${fdcId}?api_key=${USDA_API_KEY}`
  );
  return response.json();
}
```

### Structure des données USDA

```json
{
  "fdcId": 173944,
  "description": "Banana, raw",
  "foodNutrients": [
    {
      "nutrientName": "Protein",
      "nutrientNumber": "203",
      "unitName": "G",
      "value": 1.09
    },
    {
      "nutrientName": "Potassium, K",
      "nutrientNumber": "306",
      "unitName": "MG",
      "value": 358
    }
  ]
}
```

### Mapping des nutriments USDA

```typescript
const USDA_NUTRIENT_IDS = {
  energy: '208',
  protein: '203',
  carbohydrate: '205',
  fat: '204',
  fiber: '291',
  sugar: '269',
  
  // Vitamines
  vitaminC: '401',
  vitaminD: '328',
  vitaminE: '323',
  vitaminB1: '404',
  vitaminB2: '405',
  vitaminB3: '406',
  vitaminB6: '415',
  vitaminB12: '418',
  folate: '417',
  
  // Minéraux
  calcium: '301',
  iron: '303',
  magnesium: '304',
  phosphorus: '305',
  potassium: '306',
  sodium: '307',
  zinc: '309',
  selenium: '317',
};
```

---

## 2. Open Food Facts (International) 🌐

### Caractéristiques
- **Produits** : 2.8M+
- **Codes-barres** : Oui
- **Langue** : Multilingue
- **API** : Gratuite, sans clé

### Exemples d'utilisation

#### Rechercher un produit
```bash
curl "https://world.openfoodfacts.org/cgi/search.pl?search_terms=pomme&page_size=10&json=1" | jq
```

#### Par code-barres
```bash
curl "https://world.openfoodfacts.org/api/v2/product/3017620422003.json" | jq
```

#### Produits français uniquement
```bash
curl "https://fr.openfoodfacts.org/cgi/search.pl?search_terms=pomme&json=1" | jq
```

### Intégration Next.js

```typescript
// lib/openfoodfacts.ts
const OFF_BASE_URL = 'https://world.openfoodfacts.org';

export async function searchOFFProducts(query: string) {
  const response = await fetch(
    `${OFF_BASE_URL}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&page_size=20&json=1`
  );
  return response.json();
}

export async function getOFFProduct(barcode: string) {
  const response = await fetch(
    `${OFF_BASE_URL}/api/v2/product/${barcode}.json`
  );
  return response.json();
}
```

---

## 3. CIQUAL 2025 (France) 🇫🇷

### Téléchargement
1. Aller sur : https://ciqual.anses.fr/
2. Cliquer sur "Télécharger les données"
3. Choisir "Table CIQUAL 2025" (Excel ou CSV)

### Format
- Fichier Excel avec plusieurs onglets
- Aliments + Composition nutritionnelle

### Avantages
- Données officielles françaises
- Aliments locaux (fromages français, charcuterie, etc.)
- Très précis et fiable
- Gratuit

---

## 4. FooDB (Canada) 🇨🇦

### Caractéristiques
- **Composés** : 30,000+ par aliment
- **Niveau** : Très scientifique
- **Accès** : API + Download

### URL
```
https://foodb.ca/downloads
```

---

## 📊 Comparaison

| Base | Aliments | Précision | Gratuit | API | Français | Facilité |
|------|----------|-----------|---------|-----|----------|----------|
| **USDA** | 300k+ | ⭐⭐⭐⭐⭐ | ✅ | ✅ | ❌ | ⭐⭐⭐⭐ |
| **Open Food Facts** | 2.8M+ | ⭐⭐⭐ | ✅ | ✅ | ✅ | ⭐⭐⭐⭐⭐ |
| **CIQUAL 2025** | 3.2k | ⭐⭐⭐⭐⭐ | ✅ | ❌ | ✅ | ⭐⭐⭐ |
| **FooDB** | 30k | ⭐⭐⭐⭐⭐ | ✅ | ✅ | ❌ | ⭐⭐ |

---

## 🎯 Stratégie Recommandée

### Approche Hybride (Best of All)

```typescript
async function searchAliment(query: string) {
  // 1. Chercher d'abord dans CIQUAL (base locale)
  const ciquatResults = await searchCIQUAL(query);
  
  // 2. Si moins de 5 résultats, compléter avec USDA
  if (ciquatResults.length < 5) {
    const usdaResults = await searchUSDA(query);
    return [...ciquatResults, ...usdaResults];
  }
  
  return ciquatResults;
}
```

### Avantages
- ✅ Aliments français en priorité (CIQUAL)
- ✅ Grande diversité (USDA)
- ✅ Données fiables
- ✅ Recherche exhaustive

---

## 🚀 Implémentation Rapide

### Installation
```bash
npm install node-fetch
```

### Créer route API
```typescript
// app/api/search-usda/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  
  const response = await fetch(
    `https://api.nal.usda.gov/fdc/v1/foods/search?query=${query}&api_key=${process.env.USDA_API_KEY}`
  );
  
  const data = await response.json();
  return Response.json(data);
}
```

---

## 📝 Notes

### Pour USDA
- Clé API : 1000 requêtes/heure (gratuit)
- Données en anglais → Traduire si besoin
- Très complet mais parfois trop technique

### Pour Open Food Facts
- Pas de limite de requêtes
- Qualité variable (communautaire)
- Excellent pour produits transformés

### Pour CIQUAL
- Pas d'API → Utiliser CSV
- Idéal pour aliments français
- Mise à jour tous les 3-5 ans

---

## 🔗 Liens Utiles

- USDA : https://fdc.nal.usda.gov/
- Open Food Facts : https://world.openfoodfacts.org/
- CIQUAL : https://ciqual.anses.fr/
- FooDB : https://foodb.ca/

---

**Besoin d'aide pour l'intégration ? Je peux créer les fichiers nécessaires !**

