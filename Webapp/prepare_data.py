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
        'alim_code', 
        'alim_nom_fr',
        'alim_grp_nom_fr', 
        'alim_ssgrp_nom_fr',
        'Energie, Règlement UE N° 1169/2011 (kcal/100 g)',
        'Protéines, N x facteur de Jones (g/100 g)',
        'Glucides (g/100 g)',
        'Lipides (g/100 g)',
        'Fibres alimentaires (g/100 g)',
        'Calcium (mg/100 g)',
        'Fer (mg/100 g)',
        'Magnésium (mg/100 g)',
        'Potassium (mg/100 g)',
        'Zinc (mg/100 g)',
        'Rétinol (µg/100 g)',
        'Beta-Carotène (µg/100 g)',
        'Vitamine D (µg/100 g)',
        'Vitamine E (mg/100 g)',
        'Vitamine C (mg/100 g)',
        'Vitamine B1 ou Thiamine (mg/100 g)',
        'Vitamine B2 ou Riboflavine (mg/100 g)',
        'Vitamine B9 ou Folates totaux (µg/100 g)',
        'Vitamine B12 (µg/100 g)'
    ]
    
    aliments_structures = aliments[colonnes_cles]
    aliments_structures = aliments_structures.drop(0).reset_index(drop=True)
    
    new_column_names = {
        'alim_code': 'code',
        'alim_nom_fr': 'nom',
        'alim_grp_nom_fr': 'groupe',
        'alim_ssgrp_nom_fr': 'sous_groupe',
        'Energie, Règlement UE N° 1169/2011 (kcal/100 g)': 'energie_kcal',
        'Protéines, N x facteur de Jones (g/100 g)': 'proteines',
        'Glucides (g/100 g)': 'glucides',
        'Lipides (g/100 g)': 'lipides',
        'Fibres alimentaires (g/100 g)': 'fibres',
        'Calcium (mg/100 g)': 'calcium',
        'Fer (mg/100 g)': 'fer',
        'Magnésium (mg/100 g)': 'magnesium',
        'Potassium (mg/100 g)': 'potassium',
        'Zinc (mg/100 g)': 'zinc',
        'Rétinol (µg/100 g)': 'retinol',
        'Beta-Carotène (µg/100 g)': 'beta_carotene',
        'Vitamine D (µg/100 g)': 'vitamine_D',
        'Vitamine E (mg/100 g)': 'vitamine_E',
        'Vitamine C (mg/100 g)': 'vitamine_C',
        'Vitamine B1 ou Thiamine (mg/100 g)': 'vitamine_B1',
        'Vitamine B2 ou Riboflavine (mg/100 g)': 'vitamine_B2',
        'Vitamine B9 ou Folates totaux (µg/100 g)': 'vitamine_B9',
        'Vitamine B12 (µg/100 g)': 'vitamine_B12'
    }
    
    aliments_structures = aliments_structures.rename(columns=new_column_names)
    
    nutrient_cols = [
        'energie_kcal', 'proteines', 'glucides', 'lipides', 'fibres',
        'calcium', 'fer', 'magnesium', 'potassium', 'zinc',
        'retinol', 'beta_carotene', 'vitamine_D', 'vitamine_E',
        'vitamine_C', 'vitamine_B1', 'vitamine_B2', 'vitamine_B9', 'vitamine_B12'
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

