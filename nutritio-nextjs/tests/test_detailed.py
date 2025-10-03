#!/usr/bin/env python3
"""
Tests détaillés de l'application Nutritio
"""

import requests
import json
import sys
from typing import Dict, Any, Tuple

BASE_URL = "http://localhost:3006"

# Couleurs
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
CYAN = '\033[96m'
RESET = '\033[0m'

# Compteurs
tests_total = 0
tests_passed = 0
tests_failed = 0
tests_results = []

def print_header(title: str):
    """Afficher un en-tête de section"""
    print(f"\n{BLUE}{'=' * 60}{RESET}")
    print(f"{BLUE}  {title}{RESET}")
    print(f"{BLUE}{'=' * 60}{RESET}\n")

def test(name: str, function, *args) -> bool:
    """Exécuter un test et afficher le résultat"""
    global tests_total, tests_passed, tests_failed
    
    tests_total += 1
    print(f"Test {tests_total}: {name} ... ", end='', flush=True)
    
    try:
        success, message = function(*args)
        if success:
            print(f"{GREEN}✅ PASSED{RESET}")
            if message:
                print(f"     → {message}")
            tests_passed += 1
            tests_results.append((name, True, message))
            return True
        else:
            print(f"{RED}❌ FAILED{RESET}")
            if message:
                print(f"     → {message}")
            tests_failed += 1
            tests_results.append((name, False, message))
            return False
    except Exception as e:
        print(f"{RED}❌ ERROR{RESET}")
        print(f"     → Exception: {str(e)}")
        tests_failed += 1
        tests_results.append((name, False, f"Exception: {str(e)}"))
        return False

# ============================================================================
# TESTS DES ENDPOINTS
# ============================================================================

def test_page_accueil() -> Tuple[bool, str]:
    """Test de la page d'accueil"""
    r = requests.get(f"{BASE_URL}/")
    return (r.status_code == 200, f"HTTP {r.status_code}")

def test_search_empty() -> Tuple[bool, str]:
    """Test recherche vide"""
    r = requests.get(f"{BASE_URL}/api/search?q=")
    data = r.json()
    return (len(data) == 0, f"{len(data)} résultats")

def test_search_oeuf() -> Tuple[bool, str]:
    """Test recherche 'oeuf'"""
    r = requests.get(f"{BASE_URL}/api/search?q=oeuf")
    data = r.json()
    return (len(data) > 0, f"{len(data)} résultats trouvés")

def test_search_first_result() -> Tuple[bool, str]:
    """Test que le premier résultat pour 'oeuf' est pertinent"""
    r = requests.get(f"{BASE_URL}/api/search?q=oeuf")
    data = r.json()
    if len(data) > 0:
        first = data[0]['nom']
        # Vérifier que c'est un aliment simple (commence par Oeuf)
        is_simple = first.lower().startswith('oeuf')
        return (is_simple, f"Premier: '{first}'")
    return (False, "Aucun résultat")

def test_get_aliment() -> Tuple[bool, str]:
    """Test récupération d'un aliment (Oeuf cru)"""
    r = requests.get(f"{BASE_URL}/api/aliment/22000")
    if r.status_code != 200:
        return (False, f"HTTP {r.status_code}")
    
    data = r.json()
    has_nom = 'nom' in data
    has_calcium = 'calcium' in data
    
    return (has_nom and has_calcium, f"Nom: {data.get('nom', 'N/A')[:30]}")

def test_get_aliment_404() -> Tuple[bool, str]:
    """Test aliment inexistant"""
    r = requests.get(f"{BASE_URL}/api/aliment/999999")
    return (r.status_code == 404, f"HTTP {r.status_code}")

def test_calculate_nutrients() -> Tuple[bool, str]:
    """Test calcul des nutriments"""
    payload = {
        "code": 22000,
        "quantity": 100,
        "gender": "Homme"
    }
    r = requests.post(f"{BASE_URL}/api/calculate", json=payload)
    
    if r.status_code != 200:
        return (False, f"HTTP {r.status_code}")
    
    data = r.json()
    has_macros = 'macros' in data
    has_micros = 'micronutriments' in data
    has_pct = 'pourcentages' in data
    
    return (has_macros and has_micros and has_pct, "Toutes les données présentes")

def test_potassium_calculation() -> Tuple[bool, str]:
    """Test correction du calcul du Potassium"""
    payload = {
        "code": 53100,  # Banane plantain
        "quantity": 100,
        "gender": "Homme"
    }
    r = requests.post(f"{BASE_URL}/api/calculate", json=payload)
    data = r.json()
    
    pct = data['pourcentages'].get('Potassium', 0)
    # Le pourcentage devrait être raisonnable (< 100%)
    is_valid = pct < 100 and pct > 0
    
    return (is_valid, f"Potassium: {pct}% (attendu: 10-20%)")

def test_vitamine_b3_recommendation() -> Tuple[bool, str]:
    """Test correction de la recommandation Vitamine B3"""
    r = requests.get(f"{BASE_URL}/api/recommandations?gender=Homme")
    data = r.json()
    
    b3 = [x for x in data if x['nutriment'] == 'Vitamine B3']
    if len(b3) > 0:
        valeur = b3[0]['valeur']
        is_correct = valeur > 10  # Devrait être 14, pas 1.6
        return (is_correct, f"Vitamine B3: {valeur} mg (attendu: 14 mg)")
    
    return (False, "Vitamine B3 non trouvée")

def test_calculate_different_quantities() -> Tuple[bool, str]:
    """Test calcul avec différentes quantités"""
    # 100g
    r1 = requests.post(f"{BASE_URL}/api/calculate", 
                       json={"code": 22000, "quantity": 100, "gender": "Homme"})
    data1 = r1.json()
    
    # 200g
    r2 = requests.post(f"{BASE_URL}/api/calculate", 
                       json={"code": 22000, "quantity": 200, "gender": "Homme"})
    data2 = r2.json()
    
    # Les valeurs pour 200g devraient être ~2x celles de 100g
    prot1 = data1['macros'].get('proteines', 0)
    prot2 = data2['macros'].get('proteines', 0)
    
    ratio = prot2 / prot1 if prot1 > 0 else 0
    is_valid = 1.9 < ratio < 2.1  # Tolérance de 10%
    
    return (is_valid, f"Ratio 200g/100g: {ratio:.2f} (attendu: ~2.0)")

def test_gender_differences() -> Tuple[bool, str]:
    """Test que les recommandations diffèrent selon le genre"""
    r_h = requests.get(f"{BASE_URL}/api/recommandations?gender=Homme")
    r_f = requests.get(f"{BASE_URL}/api/recommandations?gender=Femme")
    
    data_h = r_h.json()
    data_f = r_f.json()
    
    # Trouver un nutriment qui diffère (ex: Fer)
    fer_h = [x['valeur'] for x in data_h if x['nutriment'] == 'Fer']
    fer_f = [x['valeur'] for x in data_f if x['nutriment'] == 'Fer']
    
    if len(fer_h) > 0 and len(fer_f) > 0:
        differs = fer_h[0] != fer_f[0]
        return (differs, f"Fer H:{fer_h[0]}mg vs F:{fer_f[0]}mg")
    
    return (False, "Fer non trouvé")

# ============================================================================
# EXÉCUTION DES TESTS
# ============================================================================

if __name__ == '__main__':
    print("╔════════════════════════════════════════════════════════════════╗")
    print("║                                                                ║")
    print("║           🧪 TESTS DÉTAILLÉS DE L'API NUTRITIO                ║")
    print("║                                                                ║")
    print("╚════════════════════════════════════════════════════════════════╝")
    
    print_header("TESTS DE BASE")
    test("Page d'accueil accessible", test_page_accueil)
    test("API Search avec query vide", test_search_empty)
    test("API Search 'oeuf' retourne résultats", test_search_oeuf)
    test("Premier résultat pour 'oeuf' est pertinent", test_search_first_result)
    
    print_header("TESTS DES ALIMENTS")
    test("Récupérer Oeuf cru (22000)", test_get_aliment)
    test("Aliment inexistant retourne 404", test_get_aliment_404)
    
    print_header("TESTS DE CALCUL")
    test("Calcul des nutriments (100g)", test_calculate_nutrients)
    test("Calcul avec différentes quantités", test_calculate_different_quantities)
    
    print_header("TESTS DE VALIDATION DES DONNÉES")
    test("Potassium - Calcul correct (bug corrigé)", test_potassium_calculation)
    test("Vitamine B3 - Recommandation corrigée", test_vitamine_b3_recommendation)
    test("Recommandations différentes H/F", test_gender_differences)
    
    # Résumé final
    print("\n" + "=" * 60)
    print(f"\n{CYAN}📊 RÉSUMÉ DES TESTS{RESET}\n")
    print(f"  Total de tests  : {BLUE}{tests_total}{RESET}")
    print(f"  Tests réussis   : {GREEN}{tests_passed} ✅{RESET}")
    print(f"  Tests échoués   : {RED}{tests_failed} ❌{RESET}")
    
    if tests_total > 0:
        percentage = (tests_passed * 100) // tests_total
        print(f"  Taux de réussite: {BLUE}{percentage}%{RESET}")
    
    print("\n" + "=" * 60)
    
    # Liste détaillée
    print(f"\n{CYAN}📋 DÉTAILS DES TESTS{RESET}\n")
    for i, (name, passed, message) in enumerate(tests_results, 1):
        status = f"{GREEN}✅{RESET}" if passed else f"{RED}❌{RESET}"
        print(f"{i:2}. {status} {name}")
        if message:
            print(f"      → {message}")
    
    print("")
    
    # Code de sortie
    if tests_failed == 0:
        print(f"{GREEN}╔═══════════════════════════════════════════════════════╗{RESET}")
        print(f"{GREEN}║  🎉 TOUS LES TESTS SONT PASSÉS AVEC SUCCÈS ! 🎉      ║{RESET}")
        print(f"{GREEN}╚═══════════════════════════════════════════════════════╝{RESET}")
        sys.exit(0)
    else:
        print(f"{RED}╔═══════════════════════════════════════════════════════╗{RESET}")
        print(f"{RED}║  ❌ {tests_failed} TEST(S) ONT ÉCHOUÉ                           ║{RESET}")
        print(f"{RED}╚═══════════════════════════════════════════════════════╝{RESET}")
        sys.exit(1)

