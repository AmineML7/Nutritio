# 🎨 Design Minimaliste - Nutritio

## ✨ Nouveau Design Sobre et Élégant

### 🎯 Philosophie du Design

**Minimalisme** : Seulement l'essentiel, rien de superflu
**Sobriété** : Couleurs douces et apaisantes
**Ergonomie** : Utilisation optimale de l'espace
**Élégance** : Typographie légère et espacements généreux

---

## 🎨 Palette de Couleurs

### Couleurs Principales
- **Blanc** : `#FFFFFF` - Fond principal
- **Emerald-600** : `#059669` - Vert principal (boutons actifs)
- **Emerald-50** : `#ECFDF5` - Vert très clair (arrière-plans)
- **Gray-50** : `#F9FAFB` - Gris très clair
- **Gray-100** : `#F3F4F6` - Bordures légères
- **Gray-400** : `#9CA3AF` - Textes secondaires
- **Gray-900** : `#111827` - Textes principaux

### Hiérarchie Visuelle
```
Titres principaux    → Gray-900 (très foncé)
Textes normaux       → Gray-700 (foncé)
Textes secondaires   → Gray-500 (moyen)
Textes tertiaires    → Gray-400 (clair)
Bordures             → Gray-100 (très clair)
Arrière-plans        → Gray-50 (presque blanc)
```

---

## 📐 Structure de la Page

### Layout en 2 Colonnes

```
┌─────────────────────────────────────────────────────────┐
│  Header (minimaliste, bordure fine en bas)              │
├─────────────────┬───────────────────────────────────────┤
│                 │                                       │
│  Colonne Gauche │  Colonne Droite                      │
│  (33%)          │  (67%)                               │
│                 │                                       │
│  • Profil       │  • Liste d'aliments                  │
│  • Recherche    │  • Résultats macros                  │
│  • Sélection    │  • Résultats micros                  │
│                 │                                       │
└─────────────────┴───────────────────────────────────────┘
```

### Avantages de cette Structure
- ✅ **Contrôles toujours visibles** (colonne gauche fixe)
- ✅ **Résultats en temps réel** (colonne droite)
- ✅ **Pas de scroll inutile** (tout est organisé)
- ✅ **Espace bien utilisé** (profite de la largeur)

---

## 🧩 Composants

### 1. Header
```
Nutritio                                    [Icon]
Suivi des micronutriments
─────────────────────────────────────────────────
```
- Typographie légère (font-light)
- Bordure fine en bas
- Icon SVG minimaliste
- Pas de couleurs vives

### 2. Sélecteur de Genre
```
┌─────────────────────────┐
│ Profil                  │
│                         │
│ [Homme]  [Femme]       │
└─────────────────────────┘
```
- Bordure fine grise
- Boutons sobres
- Vert uniquement pour l'actif
- Pas d'emojis

### 3. Recherche
```
┌─────────────────────────┐
│ Rechercher un aliment   │
│                         │
│ [_________________]     │
└─────────────────────────┘
```
- Input simple et épuré
- Focus ring vert subtil
- Dropdown minimaliste
- Pas de décorations

### 4. Aliment Sélectionné
```
┌─────────────────────────┐
│ Nom de l'aliment    [×] │
│ Catégorie               │
│                         │
│ [100] grammes          │
│ [Ajouter à ma liste]   │
└─────────────────────────┘
```
- Fond vert très clair
- Bordure verte subtile
- Bouton de fermeture discret

### 5. Liste d'Aliments
```
┌─────────────────────────────────────┐
│ Ma liste (3)              [Vider]   │
│                                     │
│ ┌─────────────────────────────┐    │
│ │ Pomme 150g           [×]    │    │
│ │ 52 kcal P:0.3g G:12g L:0.2g│    │
│ └─────────────────────────────┘    │
└─────────────────────────────────────┘
```
- Cartes compactes
- Hover subtil
- Bouton supprimer au hover
- Informations essentielles

### 6. Macronutriments
```
┌──────────────────────────────────────────┐
│ Macronutriments                          │
│                                          │
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐            │
│ │450 │ │ 25 │ │ 60 │ │ 15 │            │
│ │Éner│ │Prot│ │Gluc│ │Lipi│            │
│ │kcal│ │ g  │ │ g  │ │ g  │            │
│ └────┘ └────┘ └────┘ └────┘            │
└──────────────────────────────────────────┘
```
- Grille 4 colonnes
- Fond gris très clair
- Typographie légère
- Nombres mis en valeur

### 7. Micronutriments
```
┌──────────────────────────────────────────┐
│ Micronutriments (% besoins quotidiens)   │
│                                          │
│ Vitamine C              75%   45.2 mg   │
│ ████████████░░░░░░░░░░░░░░              │
│                                          │
│ Calcium                 95%   650 mg    │
│ ███████████████████████░░░              │
└──────────────────────────────────────────┘
```
- Barres fines et discrètes
- Couleurs selon pourcentage :
  - < 40% : Gris
  - 40-70% : Jaune
  - 70-100% : Vert clair
  - > 100% : Vert foncé
- Alignement parfait

---

## 🎭 Interactions

### Transitions
- **Durée** : 200-300ms
- **Type** : ease-out
- **Propriétés** : colors, opacity, transform

### Hover States
- Changement de couleur subtil
- Pas d'effets exagérés
- Feedback visuel discret

### Focus States
- Ring vert autour des inputs
- Pas de outline par défaut
- Accessible (WCAG AA)

---

## 📱 Responsive

### Desktop (> 1024px)
```
[ Gauche 33% ][ Droite 67% ]
```

### Tablet (768-1024px)
```
[ Gauche 40% ][ Droite 60% ]
```

### Mobile (< 768px)
```
[ Pleine largeur ]
[ Tout empilé    ]
```

---

## ✨ Caractéristiques Uniques

### 1. Pas d'Emojis
- Icons SVG minimalistes à la place
- Plus professionnel
- Meilleure cohérence visuelle

### 2. Typographie
- **Font** : System fonts (rapide et natif)
- **Weights** : Light (300) pour titres, Regular (400) pour texte
- **Sizes** : Hiérarchie claire (text-3xl → text-xs)

### 3. Espacements
- Padding généreux (p-6)
- Gaps constants (gap-4, gap-6)
- Marges cohérentes

### 4. Bordures
- Toutes en `border-gray-100` (très fines)
- Coins arrondis `rounded-lg` (8px)
- Jamais de bordures épaisses

### 5. Ombres
- Ombres très subtiles `shadow-lg`
- Seulement sur les dropdowns
- Pas d'ombres partout

---

## 🎯 Améliorations par rapport à l'Ancien Design

| Aspect | Avant | Maintenant |
|--------|-------|------------|
| **Couleurs** | Dégradés partout | Vert + Blanc uniquement |
| **Layout** | Tout empilé | 2 colonnes intelligentes |
| **Emojis** | Partout | Aucun (SVG à la place) |
| **Typographie** | Bold partout | Light et Regular |
| **Ombres** | Beaucoup | Minimal |
| **Animations** | Exagérées | Subtiles |
| **Espace** | Compact | Aéré |

---

## 📊 Accessibilité

✅ **Contraste** : WCAG AA (4.5:1)
✅ **Focus** : Visible et clair
✅ **Tailles** : Lisible (14px minimum)
✅ **Hover** : États distincts
✅ **Mobile** : Touch-friendly (44px minimum)

---

## 🚀 Performance

- **CSS optimisé** : Seulement les classes utilisées
- **Pas d'images** : SVG inline
- **Fonts system** : Pas de chargement externe
- **Transitions simples** : GPU-accelerated

---

**Design sobre, élégant et professionnel** ✨

