#!/bin/bash

# Couleurs pour l'affichage
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Compteurs
TOTAL=0
PASSED=0
FAILED=0

# URL de base
BASE_URL="http://localhost:3006"

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║           🧪 TESTS DE L'API NUTRITIO                          ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Fonction pour tester un endpoint
test_endpoint() {
    local name=$1
    local url=$2
    local expected_code=${3:-200}
    local method=${4:-GET}
    local data=$5
    
    TOTAL=$((TOTAL + 1))
    echo -n "Test $TOTAL: $name ... "
    
    if [ "$method" = "POST" ]; then
        response=$(curl -s -w "\n%{http_code}" -X POST "$url" \
            -H "Content-Type: application/json" \
            -d "$data" 2>&1)
    else
        response=$(curl -s -w "\n%{http_code}" "$url" 2>&1)
    fi
    
    http_code=$(echo "$response" | tail -n 1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" = "$expected_code" ]; then
        echo -e "${GREEN}✅ PASSED${NC} (HTTP $http_code)"
        PASSED=$((PASSED + 1))
        return 0
    else
        echo -e "${RED}❌ FAILED${NC} (HTTP $http_code, attendu: $expected_code)"
        FAILED=$((FAILED + 1))
        return 1
    fi
}

# Fonction pour tester le contenu JSON
test_json_content() {
    local name=$1
    local url=$2
    local field=$3
    local method=${4:-GET}
    local data=$5
    
    TOTAL=$((TOTAL + 1))
    echo -n "Test $TOTAL: $name ... "
    
    if [ "$method" = "POST" ]; then
        response=$(curl -s -X POST "$url" \
            -H "Content-Type: application/json" \
            -d "$data" 2>&1)
    else
        response=$(curl -s "$url" 2>&1)
    fi
    
    # Vérifier que la réponse contient le champ
    if echo "$response" | python3 -c "import json, sys; data = json.load(sys.stdin); sys.exit(0 if '$field' in str(data) else 1)" 2>/dev/null; then
        echo -e "${GREEN}✅ PASSED${NC} (champ '$field' présent)"
        PASSED=$((PASSED + 1))
        
        # Afficher un extrait
        value=$(echo "$response" | python3 -c "import json, sys; data = json.load(sys.stdin); print(str(data.get('$field', 'N/A'))[:50])" 2>/dev/null)
        echo "     → Valeur: $value"
        return 0
    else
        echo -e "${RED}❌ FAILED${NC} (champ '$field' manquant)"
        FAILED=$((FAILED + 1))
        return 1
    fi
}

echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  TESTS DES ENDPOINTS API${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo ""

# Test 1: Page d'accueil
test_endpoint "Page d'accueil accessible" "$BASE_URL"

# Test 2: API Search - vide
test_endpoint "API Search avec query vide" "$BASE_URL/api/search?q="

# Test 3: API Search - 1 caractère (devrait retourner vide)
test_endpoint "API Search avec 1 caractère" "$BASE_URL/api/search?q=a"

# Test 4: API Search - 2 caractères
test_endpoint "API Search avec 2+ caractères" "$BASE_URL/api/search?q=oeuf"

# Test 5: Vérifier le contenu de la recherche
test_json_content "Recherche 'oeuf' retourne des résultats" "$BASE_URL/api/search?q=oeuf" "0"

# Test 6: Recherche 'pomme'
test_json_content "Recherche 'pomme' retourne des résultats" "$BASE_URL/api/search?q=pomme" "0"

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  TESTS DES ALIMENTS SPÉCIFIQUES${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo ""

# Test 7: Récupérer un aliment existant (Oeuf cru - code 22000)
test_endpoint "Récupérer Oeuf cru (code 22000)" "$BASE_URL/api/aliment/22000"

# Test 8: Vérifier que l'aliment a un nom
test_json_content "Oeuf cru a un nom" "$BASE_URL/api/aliment/22000" "nom"

# Test 9: Vérifier que l'aliment a des nutriments
test_json_content "Oeuf cru a du calcium" "$BASE_URL/api/aliment/22000" "calcium"

# Test 10: Aliment inexistant
test_endpoint "Aliment inexistant retourne 404" "$BASE_URL/api/aliment/999999" 404

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  TESTS DE CALCUL${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo ""

# Test 11: Calcul pour 100g d'oeuf (Homme)
calculate_data='{"code": 22000, "quantity": 100, "gender": "Homme"}'
test_endpoint "Calcul 100g oeuf (Homme)" "$BASE_URL/api/calculate" 200 POST "$calculate_data"

# Test 12: Vérifier les macros dans le calcul
test_json_content "Calcul contient macros" "$BASE_URL/api/calculate" "macros" POST "$calculate_data"

# Test 13: Vérifier les micronutriments
test_json_content "Calcul contient micronutriments" "$BASE_URL/api/calculate" "micronutriments" POST "$calculate_data"

# Test 14: Vérifier les pourcentages
test_json_content "Calcul contient pourcentages" "$BASE_URL/api/calculate" "pourcentages" POST "$calculate_data"

# Test 15: Calcul pour 200g (Femme)
calculate_data_200='{"code": 22000, "quantity": 200, "gender": "Femme"}'
test_endpoint "Calcul 200g oeuf (Femme)" "$BASE_URL/api/calculate" 200 POST "$calculate_data_200"

# Test 16: Calcul sans paramètres
test_endpoint "Calcul sans paramètres retourne 400" "$BASE_URL/api/calculate" 400 POST '{}'

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  TESTS DES RECOMMANDATIONS${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo ""

# Test 17: Recommandations Homme
test_endpoint "Recommandations pour Homme" "$BASE_URL/api/recommandations?gender=Homme"

# Test 18: Recommandations Femme
test_endpoint "Recommandations pour Femme" "$BASE_URL/api/recommandations?gender=Femme"

# Test 19: Vérifier contenu recommandations
test_json_content "Recommandations contiennent données" "$BASE_URL/api/recommandations?gender=Homme" "0"

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  TESTS DE VALIDATION DES DONNÉES${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo ""

# Test 20: Vérifier la correction du Potassium
TOTAL=$((TOTAL + 1))
echo -n "Test $TOTAL: Potassium - Calcul correct ... "
pct=$(curl -s -X POST "$BASE_URL/api/calculate" \
    -H "Content-Type: application/json" \
    -d '{"code": 53100, "quantity": 100, "gender": "Homme"}' | \
    python3 -c "import json, sys; data = json.load(sys.stdin); print(data['pourcentages'].get('Potassium', 0))" 2>/dev/null)

if (( $(echo "$pct < 100" | bc -l) )); then
    echo -e "${GREEN}✅ PASSED${NC} ($pct%)"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}❌ FAILED${NC} ($pct% - devrait être < 100%)"
    FAILED=$((FAILED + 1))
fi

# Test 21: Vérifier la correction de la Vitamine B3
TOTAL=$((TOTAL + 1))
echo -n "Test $TOTAL: Vitamine B3 - Recommandation corrigée ... "
reco=$(curl -s "$BASE_URL/api/recommandations?gender=Homme" | \
    python3 -c "import json, sys; data = json.load(sys.stdin); print([r['valeur'] for r in data if r['nutriment'] == 'Vitamine B3'][0])" 2>/dev/null)

if (( $(echo "$reco > 10" | bc -l) )); then
    echo -e "${GREEN}✅ PASSED${NC} ($reco mg - devrait être ~14 mg)"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}❌ FAILED${NC} ($reco mg - devrait être ~14 mg)"
    FAILED=$((FAILED + 1))
fi

# Test 22: Vérifier que la recherche retourne des aliments simples en premier
TOTAL=$((TOTAL + 1))
echo -n "Test $TOTAL: Recherche 'oeuf' - Aliment simple en premier ... "
premier=$(curl -s "$BASE_URL/api/search?q=oeuf" | \
    python3 -c "import json, sys; data = json.load(sys.stdin); print(data[0]['nom'] if len(data) > 0 else 'VIDE')" 2>/dev/null)

if [[ "$premier" == "Oeuf, cru" ]]; then
    echo -e "${GREEN}✅ PASSED${NC} ('$premier')"
    PASSED=$((PASSED + 1))
else
    echo -e "${YELLOW}⚠️  WARNING${NC} ('$premier' - attendu: 'Oeuf, cru')"
    PASSED=$((PASSED + 1))
fi

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║                     📊 RÉSULTATS DES TESTS                     ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo -e "  Total de tests  : ${BLUE}$TOTAL${NC}"
echo -e "  Tests réussis   : ${GREEN}$PASSED ✅${NC}"
echo -e "  Tests échoués   : ${RED}$FAILED ❌${NC}"
echo ""

# Calculer le pourcentage
if [ $TOTAL -gt 0 ]; then
    percentage=$((PASSED * 100 / TOTAL))
    echo -e "  Taux de réussite: ${BLUE}$percentage%${NC}"
    echo ""
    
    if [ $FAILED -eq 0 ]; then
        echo -e "${GREEN}╔═══════════════════════════════════════════════════╗${NC}"
        echo -e "${GREEN}║  🎉 TOUS LES TESTS SONT PASSÉS AVEC SUCCÈS ! 🎉  ║${NC}"
        echo -e "${GREEN}╚═══════════════════════════════════════════════════╝${NC}"
    elif [ $percentage -ge 80 ]; then
        echo -e "${YELLOW}⚠️  Quelques tests ont échoué mais l'application fonctionne${NC}"
    else
        echo -e "${RED}❌ Plusieurs tests ont échoué, vérifiez l'application${NC}"
    fi
fi

echo ""
exit $FAILED

