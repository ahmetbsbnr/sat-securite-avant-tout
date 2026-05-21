import { sqlWeb } from "./sqlWeb.js";

// Option 2 : API hébergée sur l'espace distant de l'étudiant
sqlWeb.init(
    "http://localhost/sat/",
    "http://localhost/sat/"
);
// Skip automatic DB connection when running on common Live Server ports
const isLocal = location.hostname === '127.0.0.1' || location.hostname === 'localhost' || location.port === '5500' || location.port === '5501';
// Allow forcing remote DB connection via URL when, e.g., you're on the distant VPN:
// add `?useRemoteDb=1` to the page URL to enable.
const urlParams = new URL(window.location.href).searchParams;
const forceRemote = urlParams.get('useRemoteDb') === '1';

class Connexion {
    constructor() {
        this.init();
    }

    init(): void {
        sqlWeb.bdOpen(
            "localhost",
            "3306",
            "bdsat", // Nom de la base
            "appli", // Utilisateur (si ça plante, essaie juste 'utilisateur')
            "***SUPPRIME***", // Mot de passe
            "utf8",
        );
    }
}

let connexionInstance: Connexion | null = null;
if (!isLocal || forceRemote) {
    connexionInstance = new Connexion();
} else {
    console.warn("Connexion skipped in local dev (Live Server). Start API to enable DB access or add ?useRemoteDb=1 to force remote connection.");
}

// Export null when skipped to avoid runtime errors in local environment
export const connexion = connexionInstance;
