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
            xhr.open("POST", this.spExec, false);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

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
                        if (src['erreur']) {
                            console.error("Le serveur a renvoyé une erreur BDD :", src['erreur']);
                            alert("ERREUR SERVEUR BDD :\n" + src['erreur']);
                            return resultat;
                        }
                        if (src['resultat']) {
                            resultat = src['resultat'];
                        }
                    } catch (e) {
                        console.error("Le serveur a renvoyé une réponse non JSON :", xhr.responseText);
                        alert("ERREUR SERVEUR BDD :\nLe serveur n'a pas renvoyé de JSON valide.\nVérifie que spExec.php est accessible et que la base répond.");
                    }
                } else {
                    console.error("Le serveur a répondu avec le statut HTTP", xhr.status, ":", xhr.responseText);
                    alert("ERREUR SERVEUR BDD :\nHTTP " + xhr.status + "\n" + xhr.responseText);
                }
            } catch (networkError) {
                console.error("Erreur réseau :", networkError);
            }
        }
        return resultat;
    }

    bdOpen(host: string, port: string, bdname: string, user: string, pwd: string, charset = 'utf8', driver = 'mysql'): void {
        this.bd = { host, port, bdname, user, pwd, charset, driver };
        this.SQLloadData("", []);
    }
}

export const sqlWeb = new SQLWeb();
export { TtabAsso, TdataSet };
