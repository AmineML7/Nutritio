"""
Application Flask pour le compteur de micronutriments Nutritio
"""

from flask import Flask, render_template, request, jsonify
import pandas as pd
import os

app = Flask(__name__)

# Charger les données au démarrage
ALIMENTS_PATH = 'data/aliments.csv'
RECOMMANDATIONS_PATH = 'data/recommandations.csv'

try:
    aliments_df = pd.read_csv(ALIMENTS_PATH)
    recommandations_df = pd.read_csv(RECOMMANDATIONS_PATH)
    print(f"✅ Données chargées: {len(aliments_df)} aliments")
except FileNotFoundError:
    print("❌ Fichiers de données non trouvés. Exécutez d'abord prepare_data.py")
    aliments_df = pd.DataFrame()
    recommandations_df = pd.DataFrame()

# Mapping des nutriments entre les noms de colonnes et les recommandations
NUTRIENT_MAPPING = {
    'vitamine_C': 'Vitamine C',
    'vitamine_D': 'Vitamine D',
    'vitamine_E': 'Vitamine E',
    'vitamine_B1': 'Vitamine B1',
    'vitamine_B2': 'Vitamine B2',
    'vitamine_B9': 'Folates',
    'vitamine_B12': 'Vitamine B12',
    'calcium': 'Calcium',
    'fer': 'Fer',
    'magnesium': 'Magnésium',
    'potassium': 'Potassium',
    'zinc': 'Zinc'
}

@app.route('/')
def index():
    """Page d'accueil"""
    return render_template('index.html')

@app.route('/api/search', methods=['GET'])
def search_aliments():
    """Recherche d'aliments par nom"""
    query = request.args.get('q', '').lower()
    
    if len(query) < 2:
        return jsonify([])
    
    # Filtrer les aliments correspondants
    results = aliments_df[
        aliments_df['nom'].str.lower().str.contains(query, na=False)
    ].head(20)
    
    # Convertir en liste de dictionnaires
    aliments_list = []
    for _, row in results.iterrows():
        aliments_list.append({
            'code': str(row['code']),
            'nom': row['nom'],
            'groupe': row['groupe'],
            'sous_groupe': row['sous_groupe']
        })
    
    return jsonify(aliments_list)

@app.route('/api/aliment/<code>', methods=['GET'])
def get_aliment(code):
    """Récupère les détails d'un aliment"""
    aliment = aliments_df[aliments_df['code'] == int(code)]
    
    if aliment.empty:
        return jsonify({'error': 'Aliment non trouvé'}), 404
    
    aliment_data = aliment.iloc[0].to_dict()
    
    # Convertir les NaN en None pour JSON
    for key, value in aliment_data.items():
        if pd.isna(value):
            aliment_data[key] = None
    
    return jsonify(aliment_data)

@app.route('/api/calculate', methods=['POST'])
def calculate_nutrients():
    """Calcule les nutriments pour une quantité donnée d'aliment"""
    data = request.json
    code = data.get('code')
    quantity = float(data.get('quantity', 100))
    gender = data.get('gender', 'Homme')
    
    # Récupérer l'aliment
    aliment = aliments_df[aliments_df['code'] == int(code)]
    
    if aliment.empty:
        return jsonify({'error': 'Aliment non trouvé'}), 404
    
    aliment_row = aliment.iloc[0]
    
    # Calculer les nutriments pour la quantité
    nutriments = {}
    recommandations = {}
    pourcentages = {}
    
    for col_name, reco_name in NUTRIENT_MAPPING.items():
        value = aliment_row.get(col_name)
        
        if pd.notna(value):
            # Calculer la valeur pour la quantité donnée (les valeurs sont pour 100g)
            calculated_value = float(value) * (quantity / 100)
            nutriments[reco_name] = round(calculated_value, 2)
            
            # Récupérer la recommandation
            reco_row = recommandations_df[recommandations_df['Nutriment'] == reco_name]
            if not reco_row.empty:
                reco_value = float(reco_row.iloc[0][gender])
                recommandations[reco_name] = reco_value
                
                # Calculer le pourcentage
                percentage = (calculated_value / reco_value) * 100
                pourcentages[reco_name] = round(percentage, 1)
    
    # Ajouter les macronutriments
    macros = {}
    for macro in ['energie_kcal', 'proteines', 'glucides', 'lipides', 'fibres']:
        value = aliment_row.get(macro)
        if pd.notna(value):
            macros[macro] = round(float(value) * (quantity / 100), 2)
    
    return jsonify({
        'aliment': {
            'code': str(aliment_row['code']),
            'nom': aliment_row['nom'],
            'groupe': aliment_row['groupe']
        },
        'quantity': quantity,
        'macros': macros,
        'micronutriments': nutriments,
        'recommandations': recommandations,
        'pourcentages': pourcentages
    })

@app.route('/api/recommandations', methods=['GET'])
def get_recommandations():
    """Récupère toutes les recommandations"""
    gender = request.args.get('gender', 'Homme')
    
    reco_list = []
    for _, row in recommandations_df.iterrows():
        reco_list.append({
            'nutriment': row['Nutriment'],
            'unite': row['Unité'],
            'valeur': float(row[gender])
        })
    
    return jsonify(reco_list)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3002, use_reloader=False)

