"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connexion = void 0;
const sqlWeb_js_1 = require("./sqlWeb.js");
// Initialisation des chemins de l'API
sqlWeb_js_1.sqlWeb.init("http://localhost/sat/", "http://localhost/sat/");
class Connexion {
    constructor() {
        this.init();
    }
    init() {
        sqlWeb_js_1.sqlWeb.bdOpen("localhost", "3306", "bdsat", // Nom de la base
        "appli", // Utilisateur (si ça plante, essaie juste 'utilisateur')
        "***SUPPRIME***", // Mot de passe
        "utf8");
    }
}
// On lance la connexion immédiatement
exports.connexion = new Connexion();
