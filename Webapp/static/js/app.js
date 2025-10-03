// État de l'application
let currentGender = 'Homme';
let selectedAliment = null;
let searchTimeout = null;
let alimentsList = []; // Liste des aliments ajoutés

// Éléments DOM
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const selectedAlimentSection = document.getElementById('selected-aliment');
const resultsSection = document.getElementById('results-section');
const genderButtons = document.querySelectorAll('.gender-btn');
const calculateBtn = document.getElementById('calculate-btn');
const quantityInput = document.getElementById('quantity');

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
});

function initEventListeners() {
    // Gestion du genre
    genderButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            genderButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentGender = btn.dataset.gender;
            
            // Recalculer les totaux si il y a des aliments
            if (alimentsList.length > 0) {
                calculateTotals();
            }
        });
    });

    // Recherche d'aliments
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim();

        if (query.length < 2) {
            hideSearchResults();
            return;
        }

        searchTimeout = setTimeout(() => {
            searchAliments(query);
        }, 300);
    });

    // Fermer les résultats de recherche en cliquant ailleurs
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            hideSearchResults();
        }
    });

    // Calcul des nutriments (ajout à la liste)
    calculateBtn.addEventListener('click', addToList);

    // Plus de recalcul automatique, on ajoute à la liste
    // L'utilisateur clique sur "Ajouter à ma liste"
}

async function searchAliments(query) {
    try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const aliments = await response.json();

        displaySearchResults(aliments);
    } catch (error) {
        console.error('Erreur lors de la recherche:', error);
    }
}

function displaySearchResults(aliments) {
    if (aliments.length === 0) {
        searchResults.innerHTML = '<div class="search-result-item">Aucun aliment trouvé</div>';
        searchResults.classList.add('show');
        return;
    }

    searchResults.innerHTML = aliments.map(aliment => `
        <div class="search-result-item" data-code="${aliment.code}">
            <span class="search-result-name">${aliment.nom}</span>
            <span class="search-result-category">${aliment.groupe}</span>
        </div>
    `).join('');

    // Ajouter les événements de clic
    document.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
            selectAliment(item.dataset.code, item.querySelector('.search-result-name').textContent);
        });
    });

    searchResults.classList.add('show');
}

function hideSearchResults() {
    searchResults.classList.remove('show');
}

async function selectAliment(code, name) {
    try {
        const response = await fetch(`/api/aliment/${code}`);
        selectedAliment = await response.json();

        // Afficher l'aliment sélectionné
        document.getElementById('aliment-name').textContent = selectedAliment.nom;
        document.getElementById('aliment-category').textContent = selectedAliment.groupe;
        
        selectedAlimentSection.style.display = 'block';
        
        // Réinitialiser la quantité
        quantityInput.value = 100;
        
        // Cacher les résultats de recherche
        hideSearchResults();
        searchInput.value = '';
        
        // Scroll vers l'aliment sélectionné
        selectedAlimentSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Calculer automatiquement
        calculateNutrients();
        
    } catch (error) {
        console.error('Erreur lors de la sélection de l\'aliment:', error);
    }
}

async function addToList() {
    if (!selectedAliment) return;

    const quantity = parseFloat(quantityInput.value);
    if (isNaN(quantity) || quantity <= 0) {
        alert('Veuillez entrer une quantité valide');
        return;
    }

    try {
        const response = await fetch('/api/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code: selectedAliment.code,
                quantity: quantity,
                gender: currentGender
            })
        });

        const results = await response.json();
        
        // Ajouter à la liste
        alimentsList.push({
            id: Date.now(), // ID unique
            aliment: results.aliment,
            quantity: quantity,
            macros: results.macros,
            micronutriments: results.micronutriments,
            nutriments_info: results.nutriments_info
        });
        
        // Réinitialiser la sélection
        selectedAlimentSection.style.display = 'none';
        searchInput.value = '';
        selectedAliment = null;
        
        // Mettre à jour l'affichage
        updateListDisplay();
        calculateTotals();
        
    } catch (error) {
        console.error('Erreur lors de l\'ajout:', error);
    }
}

function removeFromList(id) {
    alimentsList = alimentsList.filter(item => item.id !== id);
    updateListDisplay();
    calculateTotals();
}

function clearList() {
    if (confirm('Voulez-vous vraiment vider votre liste ?')) {
        alimentsList = [];
        updateListDisplay();
        resultsSection.style.display = 'none';
    }
}

function updateListDisplay() {
    const listContainer = document.getElementById('aliments-list');
    const listSection = document.getElementById('list-section');
    
    if (alimentsList.length === 0) {
        listSection.style.display = 'none';
        return;
    }
    
    listSection.style.display = 'block';
    
    listContainer.innerHTML = alimentsList.map(item => `
        <div class="list-item">
            <div class="list-item-header">
                <div class="list-item-info">
                    <span class="list-item-name">${item.aliment.nom}</span>
                    <span class="list-item-quantity">${item.quantity}g</span>
                </div>
                <button class="btn-remove" onclick="removeFromList(${item.id})" title="Retirer">
                    🗑️
                </button>
            </div>
            <div class="list-item-macros">
                <span>${Math.round((item.macros.energie_kcal || 0) * 10) / 10} kcal</span>
                <span>P: ${Math.round((item.macros.proteines || 0) * 10) / 10}g</span>
                <span>G: ${Math.round((item.macros.glucides || 0) * 10) / 10}g</span>
                <span>L: ${Math.round((item.macros.lipides || 0) * 10) / 10}g</span>
            </div>
        </div>
    `).join('');
}

async function calculateTotals() {
    if (alimentsList.length === 0) {
        resultsSection.style.display = 'none';
        return;
    }
    
    // Calculer les totaux de macros
    const totalMacros = {};
    const totalMicros = {};
    const totalNutrimentsInfo = {};
    
    alimentsList.forEach(item => {
        // Macros
        Object.keys(item.macros).forEach(key => {
            totalMacros[key] = (totalMacros[key] || 0) + item.macros[key];
        });
        
        // Micros
        Object.keys(item.micronutriments).forEach(key => {
            totalMicros[key] = (totalMicros[key] || 0) + item.micronutriments[key];
        });
        
        // Info
        if (item.nutriments_info) {
            Object.keys(item.nutriments_info).forEach(key => {
                totalNutrimentsInfo[key] = (totalNutrimentsInfo[key] || 0) + item.nutriments_info[key];
            });
        }
    });
    
    // Récupérer les recommandations
    try {
        const response = await fetch(`/api/recommandations?gender=${currentGender}`);
        const recommandations = await response.json();
        
        // Calculer les pourcentages
        const pourcentages = {};
        const recoValues = {};
        
        recommandations.forEach(reco => {
            const nutrient = reco.nutriment;
            if (totalMicros[nutrient] !== undefined) {
                recoValues[nutrient] = reco.valeur;
                pourcentages[nutrient] = ((totalMicros[nutrient] / reco.valeur) * 100).toFixed(1);
            }
        });
        
        // Afficher les résultats
        displayResults({
            aliment: { nom: `Total (${alimentsList.length} aliment${alimentsList.length > 1 ? 's' : ''})` },
            quantity: 'cumul',
            macros: totalMacros,
            micronutriments: totalMicros,
            nutriments_info: totalNutrimentsInfo,
            recommandations: recoValues,
            pourcentages: pourcentages
        });
        
    } catch (error) {
        console.error('Erreur lors du calcul des totaux:', error);
    }
}

function displayResults(results) {
    // Afficher les macronutriments
    const macrosGrid = document.getElementById('macros-grid');
    const macros = results.macros;
    
    const macroLabels = {
        'energie_kcal': { name: 'Énergie', unit: 'kcal', color: '#667eea' },
        'proteines': { name: 'Protéines', unit: 'g', color: '#f093fb' },
        'glucides': { name: 'Glucides', unit: 'g', color: '#4facfe' },
        'lipides': { name: 'Lipides', unit: 'g', color: '#43e97b' },
        'fibres': { name: 'Fibres', unit: 'g', color: '#fa709a' },
        'sucres': { name: 'Sucres', unit: 'g', color: '#ff6b6b' },
        'eau': { name: 'Eau', unit: 'g', color: '#4ecdc4' }
    };

    macrosGrid.innerHTML = Object.keys(macros).map(key => {
        const macro = macroLabels[key];
        if (!macro) return '';
        
        return `
            <div class="macro-item" style="background: ${macro.color}">
                <span class="macro-value">${Math.round(macros[key] * 10) / 10}</span>
                <span class="macro-name">${macro.name} (${macro.unit})</span>
            </div>
        `;
    }).join('');

    // Afficher les micronutriments
    const microsList = document.getElementById('micros-list');
    const micros = results.micronutriments;
    const nutriments_info = results.nutriments_info || {};
    const recommandations = results.recommandations;
    const pourcentages = results.pourcentages;
    const units = results.units || {};

    let microsHTML = '';
    
    // Micronutriments avec recommandations (avec pourcentages)
    microsHTML += Object.keys(micros).sort().map(nutrient => {
        const value = micros[nutrient];
        const reco = recommandations[nutrient];
        const percentage = pourcentages[nutrient];
        
        // Déterminer la classe de couleur selon le pourcentage
        let barClass = 'low';
        if (percentage >= 100) barClass = 'very-high';
        else if (percentage >= 70) barClass = 'high';
        else if (percentage >= 40) barClass = 'medium';

        // Déterminer l'unité basée sur le nom du nutriment
        let unit = 'mg';
        if (nutrient.includes('Vitamine D') || nutrient.includes('Vitamine B12') || 
            nutrient.includes('Folates') || nutrient.includes('Iode') || 
            nutrient.includes('Sélénium')) {
            unit = 'µg';
        }

        return `
            <div class="micro-item">
                <div class="micro-header">
                    <span class="micro-name">✓ ${nutrient}</span>
                    <span class="micro-values">${Math.round(value * 10) / 10} ${unit} / ${Math.round(reco * 10) / 10} ${unit}</span>
                </div>
                <div class="micro-bar">
                    <div class="micro-bar-fill ${barClass}" style="width: ${Math.min(percentage, 100)}%">
                        <span class="micro-percentage">${percentage}%</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Nutriments informatifs (sans recommandations)
    if (Object.keys(nutriments_info).length > 0) {
        microsHTML += `
            <div class="info-separator">
                <h4>ℹ️ Nutriments informatifs (sans recommandations)</h4>
            </div>
        `;
        
        microsHTML += Object.keys(nutriments_info).sort().map(nutrient => {
            const value = nutriments_info[nutrient];
            const unit = 'µg';  // Ces nutriments sont généralement en µg
            
            return `
                <div class="micro-item info-only">
                    <div class="micro-header">
                        <span class="micro-name">📋 ${nutrient}</span>
                        <span class="micro-values">${Math.round(value * 10) / 10} ${unit}</span>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    microsList.innerHTML = microsHTML;

    // Afficher la section résultats
    resultsSection.style.display = 'block';
    
    // Scroll vers les résultats
    setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

