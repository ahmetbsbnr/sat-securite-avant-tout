type TtabAsso = { [key: string]: string };
type TdataSet = TtabAsso[];

class SQLWeb {
    spExec: string;
    cheminHTML: string;
    http: string;
    bd: { host: string, port: string, bdname: string, user: string, pwd: string, charset: string, driver: string };

    constructor() {
        this.spExec = "";
        this.cheminHTML = "";
        this.http = "";
        this.bd = { host: "", port: "", bdname: "", user: "", pwd: "", charset: "", driver: "" };
    }

    init(cheminHTML: string, http: string): void {
        this.spExec = http + 'spExec.php';
        this.cheminHTML = cheminHTML;
        this.http = http;
    }

    getXhr(): XMLHttpRequest | null {
        if (window.XMLHttpRequest) {
            return new XMLHttpRequest();
        }
        return null;
    }

    SQLexec(sp: string, params: string[]): boolean {
        this.SQLloadData(sp, params, 'manipulation');
        return true;
    }

    SQLloadData(sp: string, params: string[], req = 'interrogation'): TdataSet {
        const xhr = this.getXhr();
        let resultat: TdataSet = [];
        
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
                    } catch (e) {
                        // SI ÇA PLANTE ENCORE, CA VA T'AFFICHER POURQUOI À L'ÉCRAN
                        console.error("Le serveur a refusé la connexion et a répondu ceci :", xhr.responseText);
                        alert("ERREUR SERVEUR BDD :\n" + xhr.responseText + "\n\nVérifie ton login/mot de passe dans connexion.ts !");
                    }
                }
            } catch (networkError) {
                console.error("Erreur réseau :", networkError);
            }
        }
        return resultat;
    }

    bdOpen(host: string, port: string, bdname: string, user: string, pwd: string, charset = 'utf8', driver = 'mysql'): void {
        this.bd = { host, port, bdname, user, pwd, charset, driver };
        this.SQLloadData("", []); // Test de connexion
    }
}

export const sqlWeb = new SQLWeb();
export { TtabAsso, TdataSet };