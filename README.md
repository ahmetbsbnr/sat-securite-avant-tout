# S.A.T. — Sécurité Avant Tout

[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg)](LICENSE)

Application web de gestion des interventions d'une entreprise fictive d'installation et de maintenance de systèmes de sécurité : interventions, contrats, clients, prestations et calcul des montants (HT, TVA, TTC).

## Stack
TypeScript (modèle / contrôleur), HTML/CSS (vue), API PHP (PDO), base MySQL.

## Structure
```text
├── PRODUCTION/
│   ├── src/controleur/   # Contrôleur de la page (classSat.ts)
│   ├── src/modele/       # Entités, accès aux données, connexion (connexion.ts)
│   ├── tests/            # Tests unitaires des objets métier (Deno)
│   └── vue/              # Page HTML, CSS, images
├── IHM_API/              # API PHP d'accès à la base
├── BDD/bdsat.sql         # Script de création de la base (données fictives)
└── maquettes/            # Maquettes de l'interface
```

## Lancer en local
1. Installer un serveur local PHP + MySQL (ex. XAMPP) et copier le projet dans `htdocs/sat/`.
2. Créer une base `bdsat` et y importer `BDD/bdsat.sql`.
3. Adapter si besoin les chemins et identifiants dans `PRODUCTION/src/modele/connexion.ts`, puis compiler :
   ```bash
   cd PRODUCTION
   npm install
   npm run build
   ```
4. Ouvrir http://localhost/sat/PRODUCTION/vue/index.html

Tests : `deno test PRODUCTION/tests/`

> ⚠️ `IHM_API/spExec.php` exécute les requêtes SQL envoyées par le navigateur : l'API n'accepte que les requêtes locales et ne doit pas être déployée sur un serveur public.

## Auteurs
Ahmet BASBUNAR ([@ahmetbsbnr](https://github.com/ahmetbsbnr)) et Victor LELONG ([@Victorlng7](https://github.com/Victorlng7)).

Projet sous licence propriétaire : consultation du code uniquement (voir [LICENSE](LICENSE)).
