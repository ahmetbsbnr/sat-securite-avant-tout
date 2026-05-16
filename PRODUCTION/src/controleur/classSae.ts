import { sqlWeb } from "../modele/sqlWeb.js";
import "../modele/connexion.js"; //ouverture BD
import { TdataSet, TtabAsso } from "../modele/sqlWeb.js";
import { SaeForm } from "./saeType.js";

export class ControleurSae {
    private _form!: SaeForm;

    init(form: SaeForm): void {
        this._form = form;

        this._form.divNvlInter.hidden = true;
        this.chargerInterventions();

        this._form.btnAjt.onclick = () => this.afficherNvlInter();
        this._form.btnEdt.onclick = () => this.prepaModifInter();
        this._form.btnAnnuler.onclick = () => this.init(form);
    }

    get form() {
        return this._form;
    }

    chargerInterventions(): void {
        let dataSet: TdataSet = sqlWeb.SQLloadData(
            "SELECT i.num_interv, i.date_interv, i.num_cont, co.ville_site, c.num_cli, c.nom_cli, " +
                "COALESCE(SUM(p.tarif_ht * u.qte_prest), 0) AS montant_ht " +
                "FROM intervention i " +
                "JOIN contrat co ON i.num_cont = co.num_cont " +
                "JOIN client c ON co.num_cli = c.num_cli " +
                "LEFT JOIN utilisation u ON i.num_interv = u.num_interv " +
                "LEFT JOIN prestation p ON u.code_prest = p.code_prest " +
                "GROUP BY i.num_interv, i.date_interv, i.num_cont, co.ville_site, c.num_cli, c.nom_cli " +
                "ORDER BY i.num_interv",
            [],
        );

        let tbody = document.querySelector(
            "#table_intervention tbody",
        ) as HTMLTableSectionElement | null;

        if (tbody) {
            tbody.innerHTML = "";

            // Si aucune donnée n'est reçue, on arrête ici
            if (!dataSet || dataSet.length === 0) return;

            dataSet.forEach((row: TtabAsso) => {
                let tr: HTMLTableRowElement = document.createElement("tr");

                let tdNum: HTMLTableCellElement = document.createElement("td");
                tdNum.textContent = row["num_interv"] || "";
                tr.appendChild(tdNum);

                let tdDate: HTMLTableCellElement = document.createElement("td");
                tdDate.textContent = row["date_interv"] || "";
                tr.appendChild(tdDate);

                let tdCont: HTMLTableCellElement = document.createElement("td");
                tdCont.textContent = row["num_cont"] || "";
                tr.appendChild(tdCont);

                let tdVille: HTMLTableCellElement =
                    document.createElement("td");
                tdVille.textContent = row["ville_site"] || "";
                tr.appendChild(tdVille);

                let tdNumCli: HTMLTableCellElement =
                    document.createElement("td");
                tdNumCli.textContent = row["num_cli"] || "";
                tr.appendChild(tdNumCli);

                let tdNomCli: HTMLTableCellElement =
                    document.createElement("td");
                tdNomCli.textContent = row["nom_cli"] || "";
                tr.appendChild(tdNomCli);

                let tdMontant: HTMLTableCellElement =
                    document.createElement("td");
                // Vérification au cas où le montant serait null
                let montant = row["montant_ht"]
                    ? parseFloat(row["montant_ht"]).toFixed(2)
                    : "0.00";
                tdMontant.textContent = montant + " €";
                tr.appendChild(tdMontant);

                tr.addEventListener("click", () => {
                    document
                        .querySelectorAll("#table_intervention tbody tr")
                        .forEach((r) => r.classList.remove("selected"));
                    tr.classList.add("selected");
                });

                tbody.appendChild(tr);
            });
        }
    }

    afficherNvlInter(mode: "ajout" | "modif" = "ajout"): void {
        this._form.divNvlInter.hidden = false;
        this._form.numInter.value = this.determinerNumInter();
        const titre = document.querySelector(
            "#nvlInter h2",
        ) as HTMLHeadingElement | null;

        if (titre) {
            titre.textContent =
                mode === "modif"
                    ? "Modifier une intervention"
                    : "Nouvelle intervention";
        }

        this._form.btnValider.value = mode === "modif" ? "Modifier" : "Valider";

        if (this._form.numContrat.value !== "") {
            this.ajouterInfoContrat();
        }

        this._form.numContrat.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                this.ajouterInfoContrat();
            }
        });

        this._form.btnValider.onclick = () => this.verifierSaisie();
        this._form.btnAnnuler.onclick = () => this.annulerNvlInter();
    }

    ajouterInfoContrat(): void {
        const numContrat = this._form.numContrat.value.trim();

        const result = sqlWeb.SQLloadData(
            `SELECT c.date_cont, cl.num_cli, cl.nom_cli, cl.prenom_cli, cl.tel_cli, cl.mel_cli 
            FROM contrat c 
            INNER JOIN client cl ON c.num_cli = cl.num_cli 
            WHERE c.num_cont = ?`,
            [numContrat],
        );

        if (result.length > 0) {
            const ligne = result[0];

            this._form.dateCreaContrat.value = ligne.date_cont.toString();
            this._form.numClient.value = ligne.num_cli.toString();
            this._form.nomClient.value = ligne.nom_cli.toString();
            this._form.prenomClient.value = ligne.prenom_cli.toString();
            this._form.telClient.value = ligne.tel_cli.toString();
            this._form.mailClient.value = ligne.mel_cli.toString();
        }
    }
    annulerNvlInter(): void {
        const champsRempli: (HTMLInputElement | HTMLTextAreaElement)[] = [
            this.form.numInter,
            this.form.dateInter,
            this.form.objetInter,
            this.form.observations,
            this.form.numContrat,
            this.form.dateCreaContrat,
            this.form.infoSite,
            this.form.numClient,
            this.form.nomClient,
            this.form.prenomClient,
            this.form.telClient,
            this.form.mailClient,
        ];

        for (let champ of champsRempli) {
            champ.value = "";
        }

        this._form.divNvlInter.hidden = true;
    }

    verifierSaisie(): void {
        const champsAValider: (HTMLInputElement | HTMLTextAreaElement)[] = [
            this.form.numInter,
            this.form.dateInter,
            this.form.objetInter,
            this.form.observations,
            this.form.numContrat,
        ];

        let bon = true;

        for (let champ of champsAValider) {
            if (champ.value.trim() === "") {
                bon = false;
            }
        }

        if (bon === true) {
            this.ajouterInter();
        }
        //else{afficher message "pas bon"}
    }

    ajouterInter(): void {
        const requete =
            "INSERT INTO intervention (num_interv, date_interv, objet_interv, obs_interv, num_cont) VALUES (?, ?, ?, ?, ?)";

        const parametres = [
            this._form.numInter.value,
            this._form.dateInter.value,
            this._form.objetInter.value,
            this._form.observations.value,
            this._form.numContrat.value,
        ];

        const succes = sqlWeb.SQLexec(requete, parametres);

        if (succes) {
            this._form.divNvlInter.hidden = true;
            this.chargerInterventions();
        } else {
            //message que ça n'a pas marché ?
        }
    }

    prepaModifInter(): void {
        const table = document.querySelector(
            "#table_intervention tbody",
        ) as HTMLTableSectionElement;

        const ligneSelectionne = table.querySelector(
            "tr.selected",
        ) as HTMLTableRowElement;

        if (!ligneSelectionne) {
            //afficher message "vous n'avez rien séléctionner"(pas d'alerte mais text HTML)
        } else {
            const numInter = ligneSelectionne.cells[0].textContent;
            const numContrat = ligneSelectionne.cells[2].textContent;
            const numClient = ligneSelectionne.cells[4].textContent;

            this.form.numInter.value = numInter;
            this.form.numContrat.value = numContrat;
            this.form.numClient.value = numClient;

            let data;

            data = sqlWeb.SQLloadData(
                "SELECT date_interv FROM intervention WHERE num_interv = ?",
                [numInter],
            );
            this.form.dateInter.value = data[0]["date_interv"];

            data = sqlWeb.SQLloadData(
                "SELECT objet_interv FROM intervention WHERE num_interv = ?",
                [numInter],
            );
            this.form.objetInter.value = data[0]["objet_interv"];

            data = sqlWeb.SQLloadData(
                "SELECT obs_interv FROM intervention WHERE num_interv = ?",
                [numInter],
            );
            this.form.observations.value = data[0]["obs_interv"];

            data = sqlWeb.SQLloadData(
                "SELECT nom_cli FROM client WHERE num_cli = ?",
                [numClient],
            );
            this.form.nomClient.value = data[0]["nom_cli"];

            data = sqlWeb.SQLloadData(
                "SELECT prenom_cli FROM client WHERE num_cli = ?",
                [numClient],
            );
            this.form.prenomClient.value = data[0]["prenom_cli"];

            data = sqlWeb.SQLloadData(
                "SELECT mel_cli FROM client WHERE num_cli = ?",
                [numClient],
            );
            this.form.mailClient.value = data[0]["mel_cli"];

            this.afficherNvlInter("modif");
        }
    }

    determinerNumInter(): string {
        let nbIntervMax: number;

        const bruteVal = this.determinerNumInterBis();
        nbIntervMax = Number(bruteVal);

        if (isNaN(nbIntervMax)) {
            console.error("La valeur récupérée n'est pas un nombre valide");
            return "1";
        }

        return (nbIntervMax + 1).toString();
    }

    determinerNumInterBis(): string {
        const query = "SELECT MAX(num_interv) AS maxId FROM intervention";
        const data = sqlWeb.SQLloadData(query, []);

        if (data && data.length > 0) {
            const row = data[0];

            const maxVal = row.maxId;

            if (maxVal !== null && maxVal !== undefined) {
                return maxVal.toString();
            }
        }

        console.error("Impossible de récupérer l'ID maximum");
        return "0";
    }

    // ajoutInfoClient() {
    //     const client = this.form.numClient.value;

    //     let data = sqlWeb.SQLloadData(
    //         "SELECT nom_cli, prenom_cli, tel_cli, mel_cli FROM client WHERE num_cli = ?",
    //         [client],
    //     );

    //     this.form.nomClient.value = data[0]["nom_cli"];
    //     this.form.prenomClient.value = data[0]["prenom_cli"];
    //     this.form.telClient.value = data[0]["tel_cli"];
    //     this.form.mailClient.value = data[0]["mel_cli"];
    // }
}

let sae = new ControleurSae();
export { sae };
