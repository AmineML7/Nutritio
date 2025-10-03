#!/bin/bash

echo "📊 Fusion des aliments complémentaires dans la base CIQUAL"
echo "==========================================================="
echo ""

CSV_PRINCIPAL="../public/data/aliments.csv"
CSV_COMPLEMENT="aliments_bruts_complets.csv"
CSV_BACKUP="../public/data/aliments_backup_$(date +%Y%m%d_%H%M%S).csv"

# Vérifier que les fichiers existent
if [ ! -f "$CSV_PRINCIPAL" ]; then
    echo "❌ Fichier principal non trouvé : $CSV_PRINCIPAL"
    exit 1
fi

if [ ! -f "$CSV_COMPLEMENT" ]; then
    echo "❌ Fichier complémentaire non trouvé : $CSV_COMPLEMENT"
    exit 1
fi

# Sauvegarder l'original
echo "💾 Sauvegarde de l'original..."
cp "$CSV_PRINCIPAL" "$CSV_BACKUP"
echo "✅ Sauvegarde créée : $CSV_BACKUP"
echo ""

# Compter les lignes avant
AVANT=$(wc -l < "$CSV_PRINCIPAL")

# Ajouter les aliments (sans la ligne d'en-tête du fichier complémentaire)
echo "➕ Ajout des aliments complémentaires..."
tail -n +2 "$CSV_COMPLEMENT" >> "$CSV_PRINCIPAL"

# Compter les lignes après
APRES=$(wc -l < "$CSV_PRINCIPAL")
AJOUTES=$((APRES - AVANT))

echo "✅ Fusion terminée !"
echo ""
echo "📊 Statistiques :"
echo "  Avant : $AVANT lignes"
echo "  Après : $APRES lignes"
echo "  Ajoutés : $AJOUTES aliments"
echo ""
echo "🔄 Redémarrez le serveur pour voir les nouveaux aliments :"
echo "  pkill -f 'next dev'"
echo "  npm run dev"

