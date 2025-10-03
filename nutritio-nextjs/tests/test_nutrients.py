#!/usr/bin/env python3
"""
Tests spécifiques des nutriments et calculs
"""

import requests
import json

BASE_URL = "http://localhost:3006"

def test_nutrient_calculation(code: int, quantity: int, gender: str, aliment_name: str):
    """Tester le calcul pour un aliment spécifique"""
    print(f"\n{'=' * 70}")
    print(f"  TEST: {aliment_name} ({quantity}g, {gender})")
    print(f"{'=' * 70}\n")
    
    payload = {
        "code": code,
        "quantity": quantity,
        "gender": gender
    }
    
    response = requests.post(f"{BASE_URL}/api/calculate", json=payload)
    
    if response.status_code != 200:
        print(f"❌ Erreur HTTP {response.status_code}")
        return
    
    data = response.json()
    
    # Afficher les macronutriments
    print("MACRONUTRIMENTS:")
    for key, value in data.get('macros', {}).items():
        print(f"  {key:20} : {value:8.2f}")
    
    # Afficher les micronutriments avec pourcentages
    print("\nMICRONUTRIMENTS (avec % des besoins):")
    micros = data.get('micronutriments', {})
    pourcentages = data.get('pourcentages', {})
    
    # Trier par nutriment
    for nutrient in sorted(micros.keys()):
        value = micros[nutrient]
        pct = pourcentages.get(nutrient, 0)
        unit = data.get('units', {}).get(nutrient.lower().replace(' ', '_'), 'mg')
        
        # Couleur selon le pourcentage
        if pct >= 100:
            color = '\033[94m'  # Bleu
        elif pct >= 70:
            color = '\033[92m'  # Vert
        elif pct >= 40:
            color = '\033[93m'  # Jaune
        else:
            color = '\033[91m'  # Rouge
        
        status = f"{color}{pct:6.1f}%\033[0m"
        print(f"  {nutrient:20} : {value:8.2f} {unit:3} ({status})")
    
    # Vérifications
    print("\n✅ VÉRIFICATIONS:")
    
    # Check 1: Potassium et Sodium < 1000%
    pct_k = pourcentages.get('Potassium', 0)
    pct_na = pourcentages.get('Sodium', 0)
    
    if pct_k < 1000:
        print(f"  ✅ Potassium: {pct_k}% (< 1000%)")
    else:
        print(f"  ❌ Potassium: {pct_k}% (ERREUR: devrait être < 1000%)")
    
    if pct_na < 1000:
        print(f"  ✅ Sodium: {pct_na}% (< 1000%)")
    else:
        print(f"  ❌ Sodium: {pct_na}% (ERREUR: devrait être < 1000%)")
    
    # Check 2: Vitamine B3
    pct_b3 = pourcentages.get('Vitamine B3', 0)
    if pct_b3 < 1000:
        print(f"  ✅ Vitamine B3: {pct_b3}% (< 1000%)")
    else:
        print(f"  ❌ Vitamine B3: {pct_b3}% (ERREUR: devrait être < 1000%)")
    
    # Check 3: Énergie cohérente
    energie = data.get('macros', {}).get('energie_kcal', 0)
    if 0 < energie < 1000:
        print(f"  ✅ Énergie: {energie} kcal (cohérente)")
    else:
        print(f"  ⚠️  Énergie: {energie} kcal (vérifier)")

if __name__ == '__main__':
    print("╔════════════════════════════════════════════════════════════════╗")
    print("║                                                                ║")
    print("║         🔬 TESTS DÉTAILLÉS DES CALCULS NUTRITIONNELS          ║")
    print("║                                                                ║")
    print("╚════════════════════════════════════════════════════════════════╝")
    
    # Test 1: Oeuf cru 100g (Homme)
    test_nutrient_calculation(22000, 100, "Homme", "Oeuf cru")
    
    # Test 2: Oeuf cru 200g (Femme)
    test_nutrient_calculation(22000, 200, "Femme", "Oeuf cru")
    
    # Test 3: Banane plantain 150g (Homme)
    test_nutrient_calculation(53100, 150, "Homme", "Banane plantain")
    
    # Test 4: Poulet 150g (Homme)
    test_nutrient_calculation(36007, 150, "Homme", "Poulet blanc cru")
    
    print("\n" + "=" * 70)
    print("  ✅ Tests terminés !")
    print("=" * 70 + "\n")

