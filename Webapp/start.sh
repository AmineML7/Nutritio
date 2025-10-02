#!/bin/bash

echo "🚀 Démarrage de Nutritio..."
echo ""

# Vérifier si les données existent
if [ ! -f "data/aliments.csv" ]; then
    echo "📊 Préparation des données..."
    python3 prepare_data.py
    echo ""
fi

echo "🌐 Lancement du serveur Flask..."
echo "📍 Ouvrez votre navigateur à : http://localhost:3002"
echo "⏹️  Appuyez sur Ctrl+C pour arrêter"
echo ""

python3 app.py

