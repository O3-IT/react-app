# Bugs Implémentés pour Tests QA

Cette application React contient **45 bugs intentionnels** répartis dans différentes fonctionnalités pour permettre l'entraînement des équipes QA.

## 🔴 Bugs Critiques (15 bugs)

### Gestion des Utilisateurs
- **BUG-001**: Validation nom défaillante - Accepte 1 caractère au lieu de minimum 2
- **BUG-002**: Email invalide accepté - Validation accepte "test@" sans domaine complet
- **BUG-005**: Modal confirmation parfois absente - Suppression directe sans confirmation (30% de chance)
- **BUG-012**: Champ recherche masqué sur mobile - Input invisible sur écrans mobiles
- **BUG-013**: Crash avec caractères spéciaux - Erreur avec "[]", "{}", etc.
- **BUG-018**: Panier non persistant - Panier perdu entre les sessions
- **BUG-020**: Numéros de commande non uniques - Problème de timing générant des doublons
- **BUG-022**: Compteur accepte valeurs négatives - Débordement non géré
- **BUG-025**: Contraste insuffisant mode sombre - 3:1 au lieu de 4.5:1 minimum
- **BUG-027**: Breakpoint mobile incorrect - 600px au lieu de 768px
- **BUG-030**: Messages d'erreur en anglais au lieu du français
- **BUG-035**: Détection connexion défaillante - Non basée sur navigator.onLine
- **BUG-040**: Données dashboard différées - Délai 5min au lieu de temps réel
- **BUG-041**: Limite utilisateurs dépassée - Accepte 1100 au lieu de 1000 max
- **BUG-044**: Anti-spam clics défaillant - 200ms au lieu de 100ms

### Catalogue Produits
- **BUG-042**: Doublons email autorisés dans certains cas (70% de chance de validation)

## ⚠️ Bugs Majeurs (18 bugs)

### Interface et Navigation
- **BUG-003**: Formulaire ne se vide pas après ajout (mode ajout seulement)
- **BUG-004**: ID utilisateur change après modification
- **BUG-006**: Bouton annuler suppression parfois non fonctionnel (80% de chance)
- **BUG-007**: Recherche utilisateurs démarre au 3ème caractère au lieu du 1er
- **BUG-009**: Tri par défaut par ID au lieu de nom A-Z
- **BUG-010**: Pagination 15 utilisateurs par défaut au lieu de 10
- **BUG-014**: Option tri "Prix croissant" manquante dans le catalogue
- **BUG-016**: Modal produit - ESC et clic extérieur non fonctionnels
- **BUG-017**: Modal produit - Navigation précédent/suivant non fonctionnelle
- **BUG-019**: Quantité panier accepte 0 (minimum requis: 1)
- **BUG-021**: Compteur démarre à 1 au lieu de 0 + Reset à 1
- **BUG-024**: Mode sombre activé par défaut au lieu du clair
- **BUG-026**: Seulement 3 thèmes disponibles au lieu de 4 minimum + Sauvegarde non automatique (délai 2s)
- **BUG-028**: Texte 12px sur mobile (minimum: 14px) + Touch targets 30px (minimum: 44px)
- **BUG-031**: Messages d'erreur positionnés en haut au lieu de près du champ
- **BUG-032**: Notifications en bas-gauche au lieu de top-right
- **BUG-037**: Format XML non disponible pour export (seuls CSV/JSON)
- **BUG-043**: Limite panier dépassée (60 au lieu de 50 articles)

### Fonctionnalités
- **BUG-034**: Sauvegarde automatique 60s au lieu de 30s

## 🔵 Bugs Mineurs (12 bugs)

### UX et Affichage
- **BUG-008**: Recherche sensible à la casse ("Jean" ≠ "jean")
- **BUG-011**: Navigation clavier pagination non fonctionnelle
- **BUG-015**: Filtre produits par défaut sur "Informatique" au lieu de "Toutes"
- **BUG-022**: Message alerte compteur dès 5 au lieu de >10 + Incrémentation par 2
- **BUG-023**: Historique compteur conserve 100 actions au lieu de 50 + Format sans heure détaillée + Ordre chronologique normal
- **BUG-029**: Navigation Tab non fonctionnelle
- **BUG-033**: Spinner chargement immédiat au lieu de 500ms
- **BUG-036**: Tooltips aide apparaissent immédiatement au lieu de 2s
- **BUG-038**: Nom fichier export sans timestamp
- **BUG-039**: Import accepte fichiers sans en-têtes
- **BUG-045**: Transitions thème 1s au lieu de 0.3s maximum

## 📍 Localisation des Bugs par Fichier

### `src/App.jsx`
- BUG-020: Numéros commande non uniques
- BUG-024: Mode sombre par défaut
- BUG-032: Durée notifications uniforme
- BUG-034: Fréquence sauvegarde incorrecte
- BUG-035: Détection connexion défaillante
- BUG-018: Panier non persistant
- BUG-019: Quantité zéro acceptée

### `src/components/UserManagement.jsx`
- BUG-001: Validation nom (1 caractère)
- BUG-002: Validation email défaillante
- BUG-003: Formulaire non vidé
- BUG-004: ID modifié après modification
- BUG-005: Modal confirmation absente
- BUG-006: Bouton annuler défaillant
- BUG-007: Seuil recherche incorrect
- BUG-008: Recherche sensible casse
- BUG-009: Tri défaut par ID
- BUG-010: Pagination 15 par défaut
- BUG-041: Limite utilisateurs dépassée
- BUG-042: Doublons email autorisés

### `src/components/ProductCatalog.jsx`
- BUG-012: Champ masqué mobile
- BUG-013: Crash caractères spéciaux
- BUG-014: Option prix manquante
- BUG-015: Filtre défaut incorrect
- BUG-016/017: Modal non fonctionnelle
- BUG-043: Limite panier dépassée

### `src/components/Counter.jsx`
- BUG-021: Valeur initiale/reset incorrect
- BUG-022: Valeurs négatives + alerte précoce + incrémentation par 2
- BUG-023: Historique problèmes multiples
- BUG-044: Anti-spam défaillant

### `src/components/ThemeSettings.jsx`
- BUG-025: Contraste insuffisant
- BUG-026: Nombre thèmes + sauvegarde

### `src/components/NotificationSystem.jsx`
- BUG-032: File notifications dépassée

### `src/App.css`
- BUG-025/045: Transitions lentes
- BUG-027: Breakpoint incorrect
- BUG-028: Police et touch targets
- BUG-032: Position notifications

## 🧪 Scénarios de Test Recommandés

### Tests de Validation
1. Tester l'ajout d'utilisateur avec nom d'1 caractère
2. Tenter d'ajouter email "test@" ou "user@domain"
3. Vérifier la limite de 1000+ utilisateurs
4. Tester les doublons d'email

### Tests d'Interface Mobile
1. Vérifier que le champ recherche produits est visible sur mobile
2. Contrôler la taille des polices (minimum 14px)
3. Tester les touch targets (minimum 44px)
4. Vérifier le breakpoint mobile à 600px vs 768px

### Tests de Navigation
1. Tester les raccourcis clavier (Tab, ESC, F1)
2. Vérifier les modals (fermeture ESC/clic extérieur)
3. Tester la navigation pagination avec les flèches

### Tests Fonctionnels
1. Vérifier la persistance du panier entre sessions
2. Tester le compteur (valeur initiale, limites, historique)
3. Contrôler les notifications (position, durée, limite)
4. Tester les thèmes (nombre, contraste, transitions)

### Tests de Performance
1. Vérifier la sauvegarde automatique (30s vs 60s)
2. Tester les états de chargement (spinner 500ms)
3. Contrôler la détection de connexion

## 🎯 Objectif Formation QA

Cette application permet de s'entraîner à :
- **Identifier des bugs visuels** (contraste, responsive, positionnement)
- **Détecter des problèmes fonctionnels** (validation, persistance, limites)
- **Tester l'accessibilité** (navigation clavier, taille police, touch targets)
- **Vérifier la cohérence UX** (messages, notifications, états)
- **Contrôler les performances** (timings, seuils, limitations)

Chaque bug est documenté avec son numéro, sa description et sa localisation pour faciliter la vérification après les tests.