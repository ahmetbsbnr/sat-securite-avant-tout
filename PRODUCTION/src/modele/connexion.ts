import { sqlWeb } from "./sqlWeb.js";

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
            "localhost",
            "3306",
            "bdsat",
            "appli",
            "***SUPPRIME***",
            "utf8",
        );
    }
}

export const connexion = new Connexion();
