"""
Script de préparation des données pour l'application Nutritio
Nettoie et exporte les données d'aliments et recommandations
"""

import pandas as pd
import numpy as np
import json
import os

def clean_nutrient_value(x):
    """Convertit les valeurs textuelles en nombres"""
    if pd.isna(x) or x == '-':
        return None
    if isinstance(x, str):
        if x.startswith('<'):
            x = x.replace('<', '').strip()
        if 'j' in x:
            x = x.split()[0]
        x = x.replace(',', '.')
    try:
        return float(x)
    except (ValueError, TypeError):
        return None

def prepare_aliments():
    """Prépare et nettoie les données d'aliments"""
    print("📊 Chargement des données d'aliments...")
    aliments = pd.read_excel("../Test/Data/Aliments/Recherche/TABLE_CIQUAL_2020.xls")
    
    colonnes_cles = [
        # Identifiants
        'alim_code', 
        'alim_nom_fr',
        'alim_grp_nom_fr', 
        'alim_ssgrp_nom_fr',
        
        # Macronutriments
        'Energie, Règlement UE N° 1169/2011 (kcal/100 g)',
        'Protéines, N x facteur de Jones (g/100 g)',
        'Glucides (g/100 g)',
        'Lipides (g/100 g)',
        'Fibres alimentaires (g/100 g)',
        'Sucres (g/100 g)',
        'Eau (g/100 g)',
        
        # Minéraux
        'Calcium (mg/100 g)',
        'Cuivre (mg/100 g)',
        'Fer (mg/100 g)',
        'Iode (µg/100 g)',
        'Magnésium (mg/100 g)',
        'Manganèse (mg/100 g)',
        'Phosphore (mg/100 g)',
        'Potassium (mg/100 g)',
        'Sélénium (µg/100 g)',
        'Sodium (mg/100 g)',
        'Zinc (mg/100 g)',
        
        # Vitamines
        'Rétinol (µg/100 g)',
        'Beta-Carotène (µg/100 g)',
        'Vitamine D (µg/100 g)',
        'Vitamine E (mg/100 g)',
        'Vitamine K1 (µg/100 g)',
        'Vitamine K2 (µg/100 g)',
        'Vitamine C (mg/100 g)',
        'Vitamine B1 ou Thiamine (mg/100 g)',
        'Vitamine B2 ou Riboflavine (mg/100 g)',
        'Vitamine B3 ou PP ou Niacine (mg/100 g)',
        'Vitamine B5 ou Acide pantothénique (mg/100 g)',
        'Vitamine B6 (mg/100 g)',
        'Vitamine B9 ou Folates totaux (µg/100 g)',
        'Vitamine B12 (µg/100 g)'
    ]
    
    aliments_structures = aliments[colonnes_cles]
    aliments_structures = aliments_structures.drop(0).reset_index(drop=True)
    
    new_column_names = {
        # Identifiants
        'alim_code': 'code',
        'alim_nom_fr': 'nom',
        'alim_grp_nom_fr': 'groupe',
        'alim_ssgrp_nom_fr': 'sous_groupe',
        
        # Macronutriments
        'Energie, Règlement UE N° 1169/2011 (kcal/100 g)': 'energie_kcal',
        'Protéines, N x facteur de Jones (g/100 g)': 'proteines',
        'Glucides (g/100 g)': 'glucides',
        'Lipides (g/100 g)': 'lipides',
        'Fibres alimentaires (g/100 g)': 'fibres',
        'Sucres (g/100 g)': 'sucres',
        'Eau (g/100 g)': 'eau',
        
        # Minéraux
        'Calcium (mg/100 g)': 'calcium',
        'Cuivre (mg/100 g)': 'cuivre',
        'Fer (mg/100 g)': 'fer',
        'Iode (µg/100 g)': 'iode',
        'Magnésium (mg/100 g)': 'magnesium',
        'Manganèse (mg/100 g)': 'manganese',
        'Phosphore (mg/100 g)': 'phosphore',
        'Potassium (mg/100 g)': 'potassium',
        'Sélénium (µg/100 g)': 'selenium',
        'Sodium (mg/100 g)': 'sodium',
        'Zinc (mg/100 g)': 'zinc',
        
        # Vitamines
        'Rétinol (µg/100 g)': 'retinol',
        'Beta-Carotène (µg/100 g)': 'beta_carotene',
        'Vitamine D (µg/100 g)': 'vitamine_D',
        'Vitamine E (mg/100 g)': 'vitamine_E',
        'Vitamine K1 (µg/100 g)': 'vitamine_K1',
        'Vitamine K2 (µg/100 g)': 'vitamine_K2',
        'Vitamine C (mg/100 g)': 'vitamine_C',
        'Vitamine B1 ou Thiamine (mg/100 g)': 'vitamine_B1',
        'Vitamine B2 ou Riboflavine (mg/100 g)': 'vitamine_B2',
        'Vitamine B3 ou PP ou Niacine (mg/100 g)': 'vitamine_B3',
        'Vitamine B5 ou Acide pantothénique (mg/100 g)': 'vitamine_B5',
        'Vitamine B6 (mg/100 g)': 'vitamine_B6',
        'Vitamine B9 ou Folates totaux (µg/100 g)': 'vitamine_B9',
        'Vitamine B12 (µg/100 g)': 'vitamine_B12'
    }
    
    aliments_structures = aliments_structures.rename(columns=new_column_names)
    
    nutrient_cols = [
        # Macronutriments
        'energie_kcal', 'proteines', 'glucides', 'lipides', 'fibres', 'sucres', 'eau',
        # Minéraux
        'calcium', 'cuivre', 'fer', 'iode', 'magnesium', 'manganese', 
        'phosphore', 'potassium', 'selenium', 'sodium', 'zinc',
        # Vitamines
        'retinol', 'beta_carotene', 'vitamine_D', 'vitamine_E', 
        'vitamine_K1', 'vitamine_K2', 'vitamine_C',
        'vitamine_B1', 'vitamine_B2', 'vitamine_B3', 'vitamine_B5', 
        'vitamine_B6', 'vitamine_B9', 'vitamine_B12'
    ]
    
    for col in nutrient_cols:
        aliments_structures[col] = aliments_structures[col].apply(clean_nutrient_value)
    
    # Créer le dossier data s'il n'existe pas
    os.makedirs('data', exist_ok=True)
    
    # Sauvegarder en CSV
    aliments_structures.to_csv('data/aliments.csv', index=False)
    print(f"✅ {len(aliments_structures)} aliments sauvegardés dans data/aliments.csv")
    
    return aliments_structures

def prepare_recommandations():
    """Prépare les recommandations nutritionnelles"""
    print("📊 Chargement des recommandations nutritionnelles...")
    recommandations = pd.read_csv("../Test/Data/Recommandation/recommandation_genere.csv")
    
    # Créer le dossier data s'il n'existe pas
    os.makedirs('data', exist_ok=True)
    
    # Sauvegarder en CSV
    recommandations.to_csv('data/recommandations.csv', index=False)
    print(f"✅ Recommandations sauvegardées dans data/recommandations.csv")
    
    return recommandations

if __name__ == "__main__":
    print("🚀 Démarrage de la préparation des données...\n")
    
    aliments = prepare_aliments()
    recommandations = prepare_recommandations()
    
    print("\n✨ Préparation terminée avec succès!")
    print(f"Total aliments: {len(aliments)}")
    print(f"Total recommandations: {len(recommandations)}")

