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
        this.ajouterOptionPrestation();

        this._form.btnAjt.onclick = () => this.afficherNvlInter();
        this._form.btnEdt.onclick = () => this.prepaModifInter();
        this._form.btnSupp.onclick = () => this.supprimerInter();
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

        let k = 0;
        if (tbody) {
            tbody.innerHTML = "";

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
                let montantht = dataSet[k].montant_ht;
                let montant = Number(montantht) * 1.1;
                tdMontant.textContent = montant.toFixed(2).toString() + " €";
                tr.appendChild(tdMontant);

                tr.addEventListener("click", () => {
                    document
                        .querySelectorAll("#table_intervention tbody tr")
                        .forEach((r) => r.classList.remove("selected"));
                    tr.classList.add("selected");
                });

                tbody.appendChild(tr);
                k++;
            });
        }
    }

    ajouterOptionPrestation() {
        while (this._form.selectPrestation.options.length > 1) {
            this._form.selectPrestation.remove(1);
        }

        this._form.qtePrestation.value = "0";

        const data = sqlWeb.SQLloadData(
            `SELECT prestation.code_prest, prestation.lib_prest, prestation.tarif_ht 
            FROM prestation`,
            [],
        );

        for (let d of data) {
            const lib = d.lib_prest;
            const valLib = d.code_prest;

            const opt = document.createElement("option");
            opt.value = valLib;
            opt.textContent = lib;

            this._form.selectPrestation.appendChild(opt);
        }
    }

    afficherNvlInter(mode: "ajout" | "modif" = "ajout"): void {
        if (mode === "ajout") this.viderZonesTextes();
        this._form.divNvlInter.hidden = false;
        this._form.divPrestationForm.hidden = true;
        this._form.numInter.value = this.determinerNumInter();
        this._form.dateInter.value = this.determinerDate();
        this.ajouterOptionPrestation();

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

        this._form.btnNvlPresta.onclick = () => {
            this._form.divPrestationForm.hidden = false;
            this._form.qtePrestation.value = "0";
            this.ajouterOptionPrestation();
            // console.log("Affiché");
        };
        this._form.btnAnnulerPresta.onclick = () => {
            this._form.divPrestationForm.hidden = true;
            this._form.qtePrestation.value = "0";
            this.ajouterOptionPrestation();
        };
        this._form.btnModifPresta.onclick = () => this.modifierPresta();
        this._form.btnValider.onclick = () => this.verifierSaisie();
        this._form.btnAnnuler.onclick = () => this.viderZonesTextes();
        this._form.btnValiderPresta.onclick = () => this.ajouterPresta();
        this._form.btnSuppPresta.onclick = () => this.supprPresta();
    }

    supprPresta() {
        const sIndex = this._form.tablePrestations.querySelector(
            "tr.selected",
        ) as HTMLTableRowElement;

        if (sIndex) {
            sIndex.remove();
            this.calculateurPrix();
        } else {
            alert("Veuillez sélectionner une prestation à supprimer.");
        }
    }

    calculateurPrix() {
        const lignes = this._form.tablePrestations.querySelectorAll("tbody tr");

        let montantTotal = 0;
        lignes.forEach((ligne) => {
            montantTotal += Number(ligne.children[4].textContent);
        });

        this._form.totalHT.value = montantTotal.toString();
        this._form.totalTVA.value = (montantTotal * 0.1).toFixed(2).toString();
        this._form.totalTTC.value = (montantTotal * 1.1).toFixed(2).toString();
    }

    ajouterPresta() {
        const data = sqlWeb.SQLloadData(
            `SELECT prestation.code_prest, prestation.lib_prest, prestation.tarif_ht 
            FROM prestation
            WHERE prestation.code_prest = ?`,
            [this._form.selectPrestation.value],
        );

        const nbPresta: number = Number(this._form.qtePrestation.value);

        let tbody = this._form.tablePrestations.querySelector("tbody");

        if (tbody) {
            if (!data || data.length === 0) return;

            let tr: HTMLTableRowElement = document.createElement("tr");

            const code_presta = this._form.selectPrestation.value;
            let tdPrest: HTMLTableCellElement = document.createElement("td");
            tdPrest.textContent = code_presta;
            tr.appendChild(tdPrest);

            const lib = data[0].lib_prest;
            let tdLib: HTMLTableCellElement = document.createElement("td");
            tdLib.textContent = lib;
            tr.appendChild(tdLib);

            const prixU = data[0].tarif_ht;
            let tdPrixU: HTMLTableCellElement = document.createElement("td");
            tdPrixU.textContent = prixU.toString();
            tr.appendChild(tdPrixU);

            let tdQte: HTMLTableCellElement = document.createElement("td");
            tdQte.textContent = nbPresta.toString();
            tr.appendChild(tdQte);

            let tdPrixT: HTMLTableCellElement = document.createElement("td");
            let prixTotal = (Number(prixU) * nbPresta).toString();
            tdPrixT.textContent = prixTotal;
            tr.appendChild(tdPrixT);

            tr.addEventListener("click", () => {
                this._form.tablePrestations
                    .querySelectorAll("tbody tr")
                    .forEach((r) => r.classList.remove("selected"));
                tr.classList.add("selected");
            });

            tbody.appendChild(tr);
        }
        this._form.divPrestationForm.hidden = true;
        this.calculateurPrix();
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

    viderZonesTextes(): void {
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

        const tbody = this._form.tablePrestations.querySelector("tbody");

        if (tbody) {
            tbody.innerHTML = "";

            this.calculateurPrix();
        }

        this.init(this.form);
    }

    verifierSaisie(): void {
        const champsAValider: (HTMLInputElement | HTMLTextAreaElement)[] = [
            this.form.numInter,
            this.form.dateInter,
            this.form.objetInter,
            this.form.numContrat,
        ];

        let bon = true;

        for (let champ of champsAValider) {
            if (champ.value.trim() === "") {
                bon = false;
            }
        }

        if (this._form.totalHT.value === "") {
            bon = false;
        }

        if (bon === true) {
            this.ajouterInter();
        } else {
            alert("Toutes les zones de saisies ne sont pas rempli");
        }
    }

    ajouterInter(): void {
        const requete1 =
            "INSERT INTO intervention (num_interv, date_interv, objet_interv, obs_interv, num_cont) VALUES (?, ?, ?, ?, ?)";

        const parametres1 = [
            this._form.numInter.value,
            this._form.dateInter.value,
            this._form.objetInter.value,
            this._form.observations.value,
            this._form.numContrat.value,
        ];

        const succes = sqlWeb.SQLexec(requete1, parametres1);

        if (succes) {
            const lignes =
                this._form.tablePrestations.querySelectorAll("tbody tr");

            lignes.forEach((element) => {
                const tr = element as HTMLTableRowElement;

                let requete2 =
                    "INSERT INTO utilisation (num_interv, code_prest, qte_prest) VALUES (?, ?, ?)";
                let parametres2 = [
                    this._form.numInter.value,
                    tr.cells[0].textContent,
                    tr.cells[3].textContent,
                ];

                const succes2 = sqlWeb.SQLexec(requete2, parametres2);

                if (succes2 && succes) {
                    //test
                    console.log(
                        "\ntr.cells[0].textContent",
                        tr.cells[0].textContent,
                        "\ntr.cells[3].textContent",
                        tr.cells[3].textContent,
                    );
                }
            });
        } else alert("Problème");

        this.init(this._form);
    }

    modifierPresta() {
        console.log("Modif");
        const table = document.querySelector(
            "#tablePrestations tbody",
        ) as HTMLTableSectionElement;

        const sIndex = table.querySelector(
            "tr.selected",
        ) as HTMLTableRowElement;

        if (!sIndex) {
            alert("Vous n'avez séléctionner aucune ligne");
        } else {
            console.log("ajout valeur");
            this.ajouterOptionPrestation();
            this._form.qtePrestation.value = sIndex.cells[3].textContent;
            this._form.divPrestationForm.hidden = false;
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
            alert("Vous n'avez séléctionner aucune ligne");
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

            let tbody = this._form.tablePrestations.querySelector("tbody");
            if (tbody) {
                tbody.innerHTML = "";

                const prestationsLies = sqlWeb.SQLloadData(
                    `SELECT u.code_prest, u.qte_prest, p.lib_prest, p.tarif_ht 
             FROM utilisation u 
             JOIN prestation p ON u.code_prest = p.code_prest 
             WHERE u.num_interv = ?`,
                    [numInter],
                );

                prestationsLies.forEach((prest) => {
                    let tr: HTMLTableRowElement = document.createElement("tr");

                    let tdPrest: HTMLTableCellElement =
                        document.createElement("td");
                    tdPrest.textContent = prest.code_prest;
                    tr.appendChild(tdPrest);

                    let tdLib: HTMLTableCellElement =
                        document.createElement("td");
                    tdLib.textContent = prest.lib_prest;
                    tr.appendChild(tdLib);

                    let tdPrixU: HTMLTableCellElement =
                        document.createElement("td");
                    tdPrixU.textContent = parseFloat(prest.tarif_ht).toFixed(2);
                    tr.appendChild(tdPrixU);

                    let tdQte: HTMLTableCellElement =
                        document.createElement("td");
                    tdQte.textContent = prest.qte_prest.toString();
                    tr.appendChild(tdQte);

                    let tdPrixT: HTMLTableCellElement =
                        document.createElement("td");
                    let prixTotal = (
                        Number(prest.tarif_ht) * Number(prest.qte_prest)
                    ).toFixed(2);
                    tdPrixT.textContent = prixTotal;
                    tr.appendChild(tdPrixT);

                    tr.addEventListener("click", () => {
                        this._form.tablePrestations
                            .querySelectorAll("tbody tr")
                            .forEach((r) => r.classList.remove("selected"));
                        tr.classList.add("selected");
                    });

                    tbody.appendChild(tr);
                });
            }

            this.calculateurPrix();

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

    determinerDate(): string {
        const demain = new Date();
        demain.setDate(demain.getDate() + 1);
        const dateFormatee = demain.toISOString().split("T")[0];
        return dateFormatee;
    }

    supprimerInter(): void {
        const table = document.querySelector(
            "#table_intervention tbody",
        ) as HTMLTableSectionElement;

        const sIndex = table.querySelector(
            "tr.selected",
        ) as HTMLTableRowElement;

        if (!sIndex) {
            alert("Vous n'avez sélectionné aucune intervention.");
            this.init(this.form);
        } else {
            const numInter = sIndex.cells[0].textContent;

            const requeteUtilisation =
                "DELETE FROM utilisation WHERE num_interv = ?";
            const requeteIntervention =
                "DELETE FROM intervention WHERE num_interv = ?";
            const parametres = [numInter];

            const succes1 = sqlWeb.SQLexec(requeteUtilisation, parametres);

            if (succes1) {
                const succes2 = sqlWeb.SQLexec(requeteIntervention, parametres);

                if (succes2) {
                    sIndex.remove();
                    this.init(this._form);
                } else {
                    alert(
                        "Erreur lors de la suppression de l'intervention en base de données.",
                    );
                }
            } else {
                alert("Erreur lors de la suppression des prestations liées.");
            }
        }
    }
}

let sae = new ControleurSae();
export { sae };
