import { sqlWeb } from "../modele/sqlWeb.js";
import "../modele/connexion.js"; //ouverture BD
import { TdataSet, TtabAsso } from "../modele/sqlWeb.js";
import { SaeForm } from "./saeType.js";

export class ControleurSae {
    private _form: SaeForm;

    constructor(form: SaeForm) {
        this._form = form;
    }

    init(): void {
        this._form.divNvlInter.hidden = true;
        this.chargerInterventions();

        this._form.btnAjt.onclick = () => this.afficherNvlInter();
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

    afficherNvlInter(): void {
        this._form.divNvlInter.hidden = false;

        this._form.btnValider.onclick = () => this.verifierSaisie();
        this._form.btnAnnuler.onclick = () => this.annulerNvlInter();
    }

    annulerNvlInter(): void {
        //
    }

    verifierSaisie(): void {
        const champsAValider: (HTMLInputElement | HTMLTextAreaElement)[] = [
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

        let bon = true;

        for (let champ of champsAValider) {
            if (champ.value.trim() === "") {
                bon = false;
            }
        }

        if (bon === true) {
            this.ajouterInter();
        }
        //else{}
    }

    ajouterInter(): void {}
}
