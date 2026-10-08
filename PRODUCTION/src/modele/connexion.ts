
import { sqlWeb } from "./sqlWeb.js";

// Configuration locale (ex. XAMPP) : projet copié dans htdocs/sat/
// et base importée depuis BDD/bdsat.sql.
// Adapter les chemins et identifiants à votre environnement.
sqlWeb.init(
    "http://localhost/sat/PRODUCTION/vue/",
    "http://localhost/sat/IHM_API/"
);

class Connexion {
    constructor() {
        this.init();
    }

    init(): void {
        sqlWeb.bdOpen(
            "localhost",
            "3306",
            "bdsat",
            "root",
            "",
            "utf8",
        );
    }
}

export const connexion = new Connexion();
