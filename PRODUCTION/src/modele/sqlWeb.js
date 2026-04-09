"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sqlWeb = void 0;
class SQLWeb {
    constructor() {
        this.spExec = "";
        this.cheminHTML = "";
        this.http = "";
        this.bd = { host: "", port: "", bdname: "", user: "", pwd: "", charset: "", driver: "" };
    }
    init(cheminHTML, http) {
        this.spExec = http + 'spExec.php';
        this.cheminHTML = cheminHTML;
        this.http = http;
    }
    getXhr() {
        if (window.XMLHttpRequest) {
            return new XMLHttpRequest();
        }
        return null;
    }
    SQLexec(sp, params) {
        this.SQLloadData(sp, params, 'manipulation');
        return true;
    }
    SQLloadData(sp, params, req = 'interrogation') {
        const xhr = this.getXhr();
        let resultat = [];
        if (xhr) {
            xhr.open("POST", this.spExec, false); // Mode synchrone
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            // CORRECTION MAJEURE ICI : On encode absolument tout pour protéger ton mot de passe (///)
            let encodedSp = encodeURIComponent(sp);
            let encodedBd = encodeURIComponent(JSON.stringify(this.bd));
            let encodedParams = encodeURIComponent(JSON.stringify(params));
            let encodedReq = encodeURIComponent(req);
            let payload = `sp=${encodedSp}&bd=${encodedBd}&params=${encodedParams}&req=${encodedReq}`;
            try {
                xhr.send(payload);
                if (xhr.status === 200) {
                    try {
                        let src = JSON.parse(xhr.responseText);
                        if (src['resultat']) {
                            resultat = src['resultat'];
                        }
                    }
                    catch (e) {
                        // SI ÇA PLANTE ENCORE, CA VA T'AFFICHER POURQUOI À L'ÉCRAN
                        console.error("Le serveur a refusé la connexion et a répondu ceci :", xhr.responseText);
                        alert("ERREUR SERVEUR BDD :\n" + xhr.responseText + "\n\nVérifie ton login/mot de passe dans connexion.ts !");
                    }
                }
            }
            catch (networkError) {
                console.error("Erreur réseau :", networkError);
            }
        }
        return resultat;
    }
    bdOpen(host, port, bdname, user, pwd, charset = 'utf8', driver = 'mysql') {
        this.bd = { host, port, bdname, user, pwd, charset, driver };
        this.SQLloadData("", []); // Test de connexion
    }
}
exports.sqlWeb = new SQLWeb();
