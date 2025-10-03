#!/bin/bash

echo "🚀 Démarrage de Nutritio avec USDA"
echo "=================================="
echo ""

# Vérifier que .env.local existe
if [ ! -f .env.local ]; then
    echo "📝 Création du fichier .env.local..."
    echo "USDA_API_KEY=vAtINa40I4HcNQPHEKboNlA8J9Tax5aU5jPINcej" > .env.local
    echo "✅ Fichier .env.local créé"
else
    echo "✅ Fichier .env.local trouvé"
fi

echo ""
echo "🛑 Arrêt des anciens serveurs..."
pkill -f "next dev" 2>/dev/null
pkill -f "flask" 2>/dev/null
pkill -f "python.*app.py" 2>/dev/null
sleep 2

echo "🚀 Démarrage du serveur Next.js sur le port 3006..."
npm run dev

echo ""
echo "✅ Serveur démarré !"
echo "🌐 URL: http://localhost:3006"

