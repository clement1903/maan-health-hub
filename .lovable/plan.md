# Repositionner MAAN : clinique de téléconsultation masculine, pas pharmacie en ligne

## Objectif stratégique
Transformer la perception du site pour qu'il soit lu comme une **clinique de santé masculine en ligne** (diagnostic médical + prescription + suivi), et non comme un e-commerce de médicaments.

## Changements prioritaires

### 1. Vocabulaire global
- Remplacer partout :
  - "médicaments" → "traitements" / "options thérapeutiques" / "solutions prescrites"
  - "acheter" / "commander" / "ajouter au panier" → "commencer ma consultation" / "voir mon éligibilité" / "obtenir mon ordonnance"
  - "prix" / "à partir de X€" en premier plan → "consultation médicale gratuite" / "traitement à partir de X€ si prescrit"
  - "livraison" → "suivi de mon traitement" / "envoi de mon ordonnance"

### 2. Hero et CTAs page d'accueil
- Mettre en avant : médecin en ligne, réponse sous 24h, consultation gratuite et sans engagement, prescription si éligible.
- CTA principal : "Commencer ma consultation en ligne".
- Ajouter un bandeau de confiance : "Prescription médicale obligatoire" + "Médecins certifiés BIG".

### 3. Section "Nos soins / Qu'est-ce qui vous préoccupe ?"
- Garder les 4 expertises mais les présenter comme des **programmes de soins** (questionnaire + avis médical + suivi), pas comme des produits.
- Retirer les prix des tuiles d'accueil.
- CTA : "Faire le questionnaire".

### 4. Pages `/soins/$domaine`
- Réorganiser la page :
  1. Problème + chiffres de santé publique
  2. Comment fonctionne la téléconsultation MAAN
  3. Options thérapeutiques possibles (avec mention "sur ordonnance, si le médecin estime cela adapté")
- Bouton principal : "Commencer mon bilan en ligne".
- Déplacer les informations de prix en bas de page, jamais en hero.

### 5. Header et navigation
- Retirer tout langage e-commerce (panier, commander).
- Ajouter un lien explicite : "Comment ça marche ?" vers `/parcours`.
- Menu déroulant "Soins" reste, mais les intitulés deviennent "Programme [X]".

### 6. Page `/parcours`
- Renforcer le côté clinique : 5 étapes = parcours patient, pas parcours d'achat.
- Insister sur : questionnaire médical, avis du médecin, ordonnance, suivi.

### 7. Espace patient
- Renommer "Mes commandes" → "Mes soins" / "Mon parcours".
- Renommer "Commande" → "Traitement en cours".
- Ajouter une étape "Consultation médicale" avant "Ordonnance".

### 8. Mentions légales et conformité
- Ajouter sur chaque page produit/soin : "Les traitements ne sont délivrés que sur prescription médicale après consultation en ligne."
- Renforcer la page `/conformite` avec ce message.

## Livrables
- Mise à jour des fichiers i18n FR/EN (`src/lib/i18n.tsx` et traductions).
- Refonte des CTAs et wording sur `src/routes/index.tsx`, `src/routes/soins.index.tsx`, `src/routes/soins.$domaine.tsx`, `src/routes/parcours.tsx`, `src/routes/patient/*`.
- Ajout d'un bandeau "Prescription médicale obligatoire" sur les pages concernées.
- Suppression des prix en hero et des formulations e-commerce.

## Non inclus dans ce plan
- Refonte graphique globale (hors wording/CTA).
- Nouvelles photos ou illustrations.
- Modifications du backend.
