// État de l'application
let currentGender = 'Homme';
let selectedAliment = null;
let searchTimeout = null;

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
            
            // Recalculer si un aliment est sélectionné
            if (selectedAliment) {
                calculateNutrients();
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

    // Calcul des nutriments
    calculateBtn.addEventListener('click', calculateNutrients);

    // Recalculer quand la quantité change
    quantityInput.addEventListener('input', () => {
        if (selectedAliment) {
            calculateNutrients();
        }
    });
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

async function calculateNutrients() {
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
        displayResults(results);
        
    } catch (error) {
        console.error('Erreur lors du calcul:', error);
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
                <span class="macro-value">${macros[key]}</span>
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
                    <span class="micro-values">${value} ${unit} / ${reco} ${unit}</span>
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
                        <span class="micro-values">${value} ${unit}</span>
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

