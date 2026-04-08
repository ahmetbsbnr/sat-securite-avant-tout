import { sqlWeb } from "./sqlWeb.js";

// Initialisation des chemins de l'API
sqlWeb.init(
    "http://localhost/sat/",
    "http://localhost/sat/"
);

class Connexion {
    constructor() {
        this.init();
    }
    
    init(): void {
        sqlWeb.bdOpen(
            'localhost',
            '3306',
            'bdsat',   // Nom de la base
            'appli',      // Utilisateur (si ça plante, essaie juste 'utilisateur')
            '***SUPPRIME***',       // Mot de passe
            'utf8'
        );
    }
}

// On lance la connexion immédiatement
export const connexion = new Connexion();