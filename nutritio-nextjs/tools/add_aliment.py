#!/usr/bin/env python3
"""
Script pour ajouter facilement des aliments à la base CIQUAL
"""

import csv
import sys

CSV_PATH = '../public/data/aliments.csv'

# Template d'aliment avec valeurs par défaut
ALIMENT_TEMPLATE = {
    'code': '',
    'nom': '',
    'groupe': '',
    'sous_groupe': '',
    'energie_kcal': '',
    'proteines': '',
    'glucides': '',
    'lipides': '',
    'fibres': '',
    'sucres': '',
    'eau': '',
    'calcium': '',
    'cuivre': '',
    'fer': '',
    'iode': '',
    'magnesium': '',
    'manganese': '',
    'phosphore': '',
    'potassium': '',
    'selenium': '',
    'sodium': '',
    'zinc': '',
    'retinol': '',
    'beta_carotene': '',
    'vitamine_D': '',
    'vitamine_E': '',
    'vitamine_K1': '',
    'vitamine_K2': '',
    'vitamine_C': '',
    'vitamine_B1': '',
    'vitamine_B2': '',
    'vitamine_B3': '',
    'vitamine_B5': '',
    'vitamine_B6': '',
    'vitamine_B9': '',
    'vitamine_B12': ''
}

def get_next_code():
    """Obtenir le prochain code disponible"""
    with open(CSV_PATH, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        codes = [int(row['code']) for row in reader if row['code'].isdigit()]
    return max(codes) + 1 if codes else 99000

def add_aliment():
    """Ajouter un aliment interactivement"""
    print("=" * 60)
    print("  AJOUT D'UN ALIMENT À LA BASE CIQUAL")
    print("=" * 60)
    print()
    
    # Générer un code automatiquement
    code = get_next_code()
    print(f"Code automatique : {code}")
    print()
    
    # Informations de base
    nom = input("Nom de l'aliment (ex: Œuf entier, cru) : ").strip()
    groupe = input("Groupe (ex: viandes, œufs, poissons et assimilés) : ").strip()
    sous_groupe = input("Sous-groupe (ex: œufs) : ").strip()
    
    print("\n" + "=" * 60)
    print("  MACRONUTRIMENTS (pour 100g)")
    print("=" * 60)
    
    # Macronutriments
    energie = input("Énergie (kcal) : ").strip() or ''
    proteines = input("Protéines (g) : ").strip() or ''
    glucides = input("Glucides (g) : ").strip() or ''
    lipides = input("Lipides (g) : ").strip() or ''
    fibres = input("Fibres (g) [optionnel] : ").strip() or ''
    sucres = input("Sucres (g) [optionnel] : ").strip() or ''
    eau = input("Eau (g) [optionnel] : ").strip() or ''
    
    print("\n" + "=" * 60)
    print("  MINÉRAUX (en mg pour 100g)")
    print("=" * 60)
    print("(Appuyez sur Entrée pour passer)")
    
    calcium = input("Calcium (mg) : ").strip() or ''
    fer = input("Fer (mg) : ").strip() or ''
    magnesium = input("Magnésium (mg) : ").strip() or ''
    potassium = input("Potassium (mg) : ").strip() or ''
    sodium = input("Sodium (mg) : ").strip() or ''
    zinc = input("Zinc (mg) : ").strip() or ''
    
    print("\n" + "=" * 60)
    print("  VITAMINES")
    print("=" * 60)
    print("(Appuyez sur Entrée pour passer)")
    
    vitamine_C = input("Vitamine C (mg) : ").strip() or ''
    vitamine_D = input("Vitamine D (µg) : ").strip() or ''
    vitamine_B9 = input("Vitamine B9/Folates (µg) : ").strip() or ''
    vitamine_B12 = input("Vitamine B12 (µg) : ").strip() or ''
    
    # Créer la ligne CSV
    aliment = {
        'code': str(code),
        'nom': nom,
        'groupe': groupe,
        'sous_groupe': sous_groupe,
        'energie_kcal': energie,
        'proteines': proteines,
        'glucides': glucides,
        'lipides': lipides,
        'fibres': fibres,
        'sucres': sucres,
        'eau': eau,
        'calcium': calcium,
        'cuivre': '',
        'fer': fer,
        'iode': '',
        'magnesium': magnesium,
        'manganese': '',
        'phosphore': '',
        'potassium': potassium,
        'selenium': '',
        'sodium': sodium,
        'zinc': zinc,
        'retinol': '',
        'beta_carotene': '',
        'vitamine_D': vitamine_D,
        'vitamine_E': '',
        'vitamine_K1': '',
        'vitamine_K2': '',
        'vitamine_C': vitamine_C,
        'vitamine_B1': '',
        'vitamine_B2': '',
        'vitamine_B3': '',
        'vitamine_B5': '',
        'vitamine_B6': '',
        'vitamine_B9': vitamine_B9,
        'vitamine_B12': vitamine_B12
    }
    
    # Afficher le résumé
    print("\n" + "=" * 60)
    print("  RÉSUMÉ")
    print("=" * 60)
    print(f"\nCode : {code}")
    print(f"Nom : {nom}")
    print(f"Groupe : {groupe}")
    print(f"\nMacronutriments :")
    print(f"  Énergie : {energie} kcal")
    print(f"  Protéines : {proteines} g")
    print(f"  Glucides : {glucides} g")
    print(f"  Lipides : {lipides} g")
    
    print("\n" + "=" * 60)
    confirmer = input("\nAjouter cet aliment ? (o/n) : ").strip().lower()
    
    if confirmer == 'o':
        # Lire le fichier existant
        with open(CSV_PATH, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Ajouter la nouvelle ligne
        with open(CSV_PATH, 'a', encoding='utf-8', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=ALIMENT_TEMPLATE.keys())
            writer.writerow(aliment)
        
        print(f"\n✅ Aliment ajouté avec succès ! (code: {code})")
        print(f"📝 Redémarrez le serveur pour voir les changements")
    else:
        print("\n❌ Ajout annulé")

if __name__ == '__main__':
    try:
        add_aliment()
    except KeyboardInterrupt:
        print("\n\n❌ Opération annulée")
        sys.exit(0)

