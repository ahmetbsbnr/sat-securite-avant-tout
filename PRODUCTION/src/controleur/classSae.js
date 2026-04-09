"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControleurSae = void 0;
const sqlWeb_js_1 = require("../modele/sqlWeb.js");
require("../modele/connexion.js"); //ouverture BD
class ControleurSae {
    constructor(form) {
        this._form = form;
    }
    init() {
        this._form.divNvlInter.hidden = true;
        this.chargerInterventions();
        this._form.btnAjt.onclick = () => this.afficherNvlInter();
        this._form.btnEdt.onclick = () => this.prepaModifInter();
    }
    get form() {
        return this._form;
    }
    chargerInterventions() {
        let dataSet = sqlWeb_js_1.sqlWeb.SQLloadData("SELECT i.num_interv, i.date_interv, i.num_cont, co.ville_site, c.num_cli, c.nom_cli, " +
            "COALESCE(SUM(p.tarif_ht * u.qte_prest), 0) AS montant_ht " +
            "FROM intervention i " +
            "JOIN contrat co ON i.num_cont = co.num_cont " +
            "JOIN client c ON co.num_cli = c.num_cli " +
            "LEFT JOIN utilisation u ON i.num_interv = u.num_interv " +
            "LEFT JOIN prestation p ON u.code_prest = p.code_prest " +
            "GROUP BY i.num_interv, i.date_interv, i.num_cont, co.ville_site, c.num_cli, c.nom_cli " +
            "ORDER BY i.num_interv", []);
        let tbody = document.querySelector("#table_intervention tbody");
        if (tbody) {
            tbody.innerHTML = "";
            // Si aucune donnée n'est reçue, on arrête ici
            if (!dataSet || dataSet.length === 0)
                return;
            dataSet.forEach((row) => {
                let tr = document.createElement("tr");
                let tdNum = document.createElement("td");
                tdNum.textContent = row["num_interv"] || "";
                tr.appendChild(tdNum);
                let tdDate = document.createElement("td");
                tdDate.textContent = row["date_interv"] || "";
                tr.appendChild(tdDate);
                let tdCont = document.createElement("td");
                tdCont.textContent = row["num_cont"] || "";
                tr.appendChild(tdCont);
                let tdVille = document.createElement("td");
                tdVille.textContent = row["ville_site"] || "";
                tr.appendChild(tdVille);
                let tdNumCli = document.createElement("td");
                tdNumCli.textContent = row["num_cli"] || "";
                tr.appendChild(tdNumCli);
                let tdNomCli = document.createElement("td");
                tdNomCli.textContent = row["nom_cli"] || "";
                tr.appendChild(tdNomCli);
                let tdMontant = document.createElement("td");
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
    afficherNvlInter() {
        this._form.divNvlInter.hidden = false;
        this._form.btnValider.onclick = () => this.verifierSaisie();
        this._form.btnAnnuler.onclick = () => this.annulerNvlInter();
    }
    annulerNvlInter() {
        const champsRempli = [
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
    verifierSaisie() {
        const champsAValider = [
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
        //else{afficher message "pas bon"}
    }
    ajouterInter() {
        const requete = "INSERT INTO intervention (num_interv, date_interv, objet_interv, obs_interv, num_cont) VALUES (?, ?, ?, ?, ?)";
        const parametres = [
            this._form.numInter.value,
            this._form.dateInter.value,
            this._form.objetInter.value,
            this._form.observations.value,
            this._form.numContrat.value,
        ];
        const succes = sqlWeb_js_1.sqlWeb.SQLexec(requete, parametres);
        if (succes) {
            this._form.divNvlInter.hidden = true;
            this.chargerInterventions();
        }
        else {
            //message que ça n'a pas marché ?
        }
    }
    prepaModifInter() {
        const table = document.querySelector("#table_intervention tbody");
        const ligneSelectionne = table.querySelector("tr.selected");
        if (!ligneSelectionne) {
            //afficher message "vous n'avez rien séléctionner"(pas d'alerte mais text HTML)
        }
        else {
            const numInter = ligneSelectionne.cells[0].textContent; // Généralement index 0
            const numContrat = ligneSelectionne.cells[2].textContent;
            const numClient = ligneSelectionne.cells[4].textContent;
            this.form.numInter.value = numInter;
            this.form.numContrat.value = numContrat;
            this.form.numClient.value = numClient;
            let data;
            data = sqlWeb_js_1.sqlWeb.SQLloadData("SELECT date_interv FROM intervention WHERE num_interv = ?", [numInter]);
            this.form.dateInter.value = data[0]["date_interv"];
            data = sqlWeb_js_1.sqlWeb.SQLloadData("SELECT objet_interv FROM intervention WHERE num_interv = ?", [numInter]);
            this.form.objetInter.value = data[0]["objet_interv"];
            data = sqlWeb_js_1.sqlWeb.SQLloadData("SELECT obs_interv FROM intervention WHERE num_interv = ?", [numInter]);
            this.form.observations.value = data[0]["obs_interv"];
            data = sqlWeb_js_1.sqlWeb.SQLloadData("SELECT nom_cli FROM client WHERE num_cli = ?", [numClient]);
            this.form.nomClient.value = data[0]["nom_cli"];
            data = sqlWeb_js_1.sqlWeb.SQLloadData("SELECT prenom_cli FROM client WHERE num_cli = ?", [numClient]);
            this.form.prenomClient.value = data[0]["prenom_cli"];
            data = sqlWeb_js_1.sqlWeb.SQLloadData("SELECT mel_cli FROM client WHERE num_cli = ?", [numClient]);
            this.form.mailClient.value = data[0]["mel_cli"];
            this.afficherNvlInter();
        }
    }
}
exports.ControleurSae = ControleurSae;
