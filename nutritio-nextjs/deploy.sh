#!/bin/bash

# 🚀 Script de déploiement Nutritio

set -e

echo "🥗 Nutritio - Script de Déploiement"
echo "===================================="
echo ""

# Choix de la plateforme
echo "Choisissez votre plateforme de déploiement :"
echo "1) Railway (recommandé - simple)"
echo "2) Fly.io (gratuit - volumes)"
echo "3) Annuler"
echo ""
read -p "Votre choix (1-3) : " choice

case $choice in
  1)
    echo ""
    echo "�� Déploiement sur Railway..."
    echo ""
    
    # Vérifier Railway CLI
    if ! command -v railway &> /dev/null; then
      echo "⚠️  Railway CLI n'est pas installé."
      echo "Installation..."
      npm install -g @railway/cli
    fi
    
    # Login
    echo "🔐 Connexion à Railway..."
    railway login
    
    # Générer le secret
    SECRET=$(openssl rand -base64 32)
    echo ""
    echo "🔑 Secret généré : $SECRET"
    echo "⚠️  Copiez ce secret pour le coller dans Railway Dashboard!"
    echo ""
    
    # Init project
    echo "📝 Initialisation du projet..."
    railway init
    
    echo ""
    echo "✅ Configuration initiale terminée !"
    echo ""
    echo "📋 Prochaines étapes :"
    echo "1. Allez sur railway.app"
    echo "2. Ajoutez ces variables d'environnement :"
    echo "   DATABASE_URL=file:/app/prisma/dev.db"
    echo "   NEXTAUTH_SECRET=$SECRET"
    echo "   AUTH_TRUST_HOST=true"
    echo "   PORT=3006"
    echo "   NODE_ENV=production"
    echo ""
    echo "3. Ajoutez un Volume :"
    echo "   Mount Path: /app/prisma"
    echo "   Size: 1 GB"
    echo ""
    echo "4. Exécutez : railway up"
    echo ""
    ;;
    
  2)
    echo ""
    echo "✈️  Déploiement sur Fly.io..."
    echo ""
    
    # Vérifier Fly CLI
    if ! command -v flyctl &> /dev/null; then
      echo "⚠️  Fly.io CLI n'est pas installé."
      echo "Installation..."
      curl -L https://fly.io/install.sh | sh
    fi
    
    # Login
    echo "🔐 Connexion à Fly.io..."
    fly auth login
    
    # Générer le secret
    SECRET=$(openssl rand -base64 32)
    
    # Launch
    echo "📝 Configuration du projet..."
    fly launch --no-deploy
    
    # Créer le volume
    echo "💾 Création du volume de données..."
    fly volumes create nutritio_data --size 1 --region cdg
    
    # Ajouter les secrets
    echo "🔐 Configuration des secrets..."
    fly secrets set NEXTAUTH_SECRET="$SECRET"
    
    # Get app name
    APP_NAME=$(fly status --json | grep -o '"Name":"[^"]*' | cut -d'"' -f4)
    fly secrets set NEXTAUTH_URL="https://${APP_NAME}.fly.dev"
    
    # Deploy
    echo "🚀 Déploiement..."
    fly deploy
    
    echo ""
    echo "✅ Déploiement terminé !"
    echo "🌐 URL : https://${APP_NAME}.fly.dev"
    echo ""
    ;;
    
  3)
    echo "Annulé."
    exit 0
    ;;
    
  *)
    echo "❌ Choix invalide."
    exit 1
    ;;
esac
