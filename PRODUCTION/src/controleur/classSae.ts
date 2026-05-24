import { sqlWeb } from "../modele/sqlWeb.js";
import "../modele/connexion.js"; //ouverture BD
import { TdataSet, TtabAsso } from "../modele/sqlWeb.js";
import { InterventionRepository } from "../modele/repositories.js";
import { SaeForm } from "./saeType.js";

export class ControleurSae {
    private _form!: SaeForm;
    private _modeFormulaire: "ajout" | "modif" = "ajout";
    private _lignePrestaEnModif: HTMLTableRowElement | null = null;

    private setListeVisible(visible: boolean): void {
        const table = document.getElementById("table_intervention") as HTMLElement | null;
        const divAction = document.querySelector(".divaction") as HTMLElement | null;
        const erreurListe = document.getElementById("erreurListe") as HTMLElement | null;
        if (table) table.hidden = !visible;
        if (divAction) divAction.hidden = !visible;
        if (erreurListe) erreurListe.hidden = !visible;
    }

    init(form: SaeForm): void {
        this._form = form;
        this._modeFormulaire = "ajout";
        this._lignePrestaEnModif = null;

        this._form.divNvlInter.hidden = true;
        this.setListeVisible(true);
        this.cacherErreur("erreurListe");
        this.cacherSucces();
        this.chargerInterventions();
        this.ajouterOptionPrestation();

        this._form.btnAjt.onclick = () => this.afficherNvlInter();
        this._form.btnEdt.onclick = () => this.prepaModifInter();
        this._form.btnVisu.onclick = () => this.afficherVisuInter();
        this._form.btnSupp.onclick = () => this.supprimerInter();
        this._form.btnAnnuler.onclick = () => this.init(form);
    }

    get form() {
        return this._form;
    }

    private afficherErreur(idElement: string, message: string): void {
        const el = document.getElementById(idElement);
        if (el) el.textContent = message;
    }

    private cacherErreur(idElement: string): void {
        const el = document.getElementById(idElement);
        if (el) el.textContent = "";
    }

    private afficherSucces(message: string): void {
        const el = document.getElementById("msgSucces");
        if (el) el.textContent = message;
    }

    private cacherSucces(): void {
        const el = document.getElementById("msgSucces");
        if (el) el.textContent = "";
    }

    chargerInterventions(): void {
        let dataSet: TdataSet = sqlWeb.SQLloadData(
            "SELECT i.num_interv, i.date_interv, i.num_cont, co.ville_site, c.num_cli, c.nom_cli, " +
                "COALESCE(SUM(tp.tarif_ht * u.qte_prest), 0) AS montant_ht " +
                "FROM intervention i " +
                "JOIN contrat co ON i.num_cont = co.num_cont " +
                "JOIN client c ON co.num_cli = c.num_cli " +
                "LEFT JOIN utilisation u ON i.num_interv = u.num_interv " +
                "LEFT JOIN tarifer_prestation tp ON u.code_prest = tp.code_prest " +
                "   AND tp.date_debut = (SELECT MAX(date_debut) FROM tarifer_prestation WHERE code_prest = u.code_prest AND date_debut <= i.date_interv) " +
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
                const rawDate: string = row["date_interv"] || "";
                if (rawDate && rawDate.includes("-")) {
                    const [y, m, d] = rawDate.split("-");
                    tdDate.textContent = `${d}/${m}/${y}`;
                } else {
                    tdDate.textContent = rawDate;
                }
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

    ajouterOptionPrestation(filtrerUtilisees = false): void {
        while (this._form.selectPrestation.options.length > 1) {
            this._form.selectPrestation.remove(1);
        }

        this._form.qtePrestation.value = "1";

        const codesUtilises = new Set<string>();
        if (filtrerUtilisees) {
            const lignes = this._form.tablePrestations.querySelectorAll("tbody tr");
            lignes.forEach((ligne) => {
                const code = (ligne as HTMLTableRowElement).cells[0]?.textContent || "";
                if (code) codesUtilises.add(code);
            });
        }

        const data = sqlWeb.SQLloadData(
            "SELECT p.code_prest, p.lib_prest, COALESCE(tp.tarif_ht, 0) AS tarif_ht " +
            "FROM prestation p " +
            "LEFT JOIN tarifer_prestation tp ON tp.code_prest = p.code_prest " +
            "   AND tp.date_debut = (SELECT MAX(date_debut) FROM tarifer_prestation WHERE code_prest = p.code_prest) " +
            "ORDER BY p.lib_prest, p.code_prest",
            [],
        );

        for (let d of data) {
            if (filtrerUtilisees && codesUtilises.has(d.code_prest)) continue;
            const opt = document.createElement("option");
            opt.value = d.code_prest;
            opt.textContent = `${d.lib_prest} — ${parseFloat(d.tarif_ht).toFixed(2)} €`;
            this._form.selectPrestation.appendChild(opt);
        }
    }

    afficherNvlInter(mode: "ajout" | "modif" = "ajout"): void {
        this._modeFormulaire = mode;

        if (mode === "ajout") {
            this.viderZonesTextes();
        }

        this._form.divNvlInter.hidden = false;
        this._form.divPrestationForm.hidden = true;
        this.cacherErreur("erreurPrestaAction");
        this.setListeVisible(false);

        if (mode === "ajout") {
            this._form.numInter.value = this.determinerNumInter();
            this._form.dateInter.value = this.determinerDate();
        }
        this._form.dateInter.min = this.determinerDate();

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

        this._form.numContrat.onkeydown = (event) => {
            if (event.key === "Enter") {
                this.ajouterInfoContrat();
            }
        };
        this._form.numContrat.onblur = () => {
            if (this._form.numContrat.value.trim() !== "") {
                this.ajouterInfoContrat();
            }
        };

        this._form.btnNvlPresta.onclick = () => {
            this._lignePrestaEnModif = null;
            this.cacherErreur("erreurPrestaAction");
            this._form.divPrestationForm.hidden = false;
            this._form.selectPrestation.value = "";
            this._form.qtePrestation.value = "1";
            this.ajouterOptionPrestation(true);
        };
        this._form.btnAnnulerPresta.onclick = () => {
            this._lignePrestaEnModif = null;
            this._form.divPrestationForm.hidden = true;
            this.cacherErreur("erreurPrestation");
        };
        this._form.btnModifPresta.onclick = () => this.modifierPresta();
        this._form.btnValider.onclick = () => this.verifierSaisie();
        this._form.btnAnnuler.onclick = () => {
            if (this._modeFormulaire === "modif" && !confirm("Annuler les modifications ?")) return;
            this.viderZonesTextes();
        };
        this._form.btnValiderPresta.onclick = () => this.ajouterPresta();
        this._form.btnSuppPresta.onclick = () => this.supprPresta();
    }

    supprPresta(): void {
        const sIndex = this._form.tablePrestations.querySelector(
            "tr.selected",
        ) as HTMLTableRowElement;

        if (sIndex) {
            if (!confirm(`Confirmer la suppression de la prestation "${sIndex.cells[1].textContent}" ?`)) return;
            this.cacherErreur("erreurPrestaAction");
            sIndex.remove();
            this.calculateurPrix();
        } else {
            this.afficherErreur("erreurPrestaAction", "Veuillez sélectionner une prestation à supprimer.");
        }
    }

    calculateurPrix(): void {
        const lignes = this._form.tablePrestations.querySelectorAll("tbody tr");

        let montantTotal = 0;
        lignes.forEach((ligne) => {
            montantTotal += Number(ligne.children[4].textContent);
        });

        this._form.totalHT.value = montantTotal.toFixed(2);
        this._form.totalTVA.value = (montantTotal * 0.1).toFixed(2);
        this._form.totalTTC.value = (montantTotal * 1.1).toFixed(2);
    }

    ajouterPresta(): void {
        this.cacherErreur("erreurPrestation");

        const codeSelectionne = this._form.selectPrestation.value;
        if (!codeSelectionne) {
            this.afficherErreur("erreurPrestation", "Aucune prestation choisie");
            return;
        }

        const nbPresta: number = Number(this._form.qtePrestation.value);
        if (!Number.isInteger(nbPresta) || nbPresta <= 0) {
            this.afficherErreur("erreurPrestation", "La quantité est un entier supérieur à 0");
            return;
        }

        const data = sqlWeb.SQLloadData(
            "SELECT p.code_prest, p.lib_prest, COALESCE(tp.tarif_ht, 0) AS tarif_ht " +
            "FROM prestation p " +
            "LEFT JOIN tarifer_prestation tp ON tp.code_prest = p.code_prest " +
            "   AND tp.date_debut = (SELECT MAX(date_debut) FROM tarifer_prestation WHERE code_prest = p.code_prest) " +
            "WHERE p.code_prest = ?",
            [codeSelectionne],
        );

        if (!data || data.length === 0) return;

        let tr: HTMLTableRowElement = document.createElement("tr");

        let tdPrest: HTMLTableCellElement = document.createElement("td");
        tdPrest.textContent = codeSelectionne;
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
        tdPrixT.textContent = (Number(prixU) * nbPresta).toString();
        tr.appendChild(tdPrixT);

        tr.addEventListener("click", () => {
            this._form.tablePrestations
                .querySelectorAll("tbody tr")
                .forEach((r) => r.classList.remove("selected"));
            tr.classList.add("selected");
        });

        let tbody = this._form.tablePrestations.querySelector("tbody");
        if (tbody) {
            if (this._lignePrestaEnModif) {
                tbody.replaceChild(tr, this._lignePrestaEnModif);
                this._lignePrestaEnModif = null;
            } else {
                tbody.appendChild(tr);
            }
        }

        this._form.divPrestationForm.hidden = true;
        this.cacherErreur("erreurPrestaAction");
        this.calculateurPrix();
    }

    ajouterInfoContrat(): void {
        const numContrat = this._form.numContrat.value.trim();

        const result = sqlWeb.SQLloadData(
            `SELECT c.date_cont, c.adr_site, c.cp_site, c.ville_site,
                    cl.num_cli, cl.nom_cli, cl.prenom_cli, cl.tel_cli, cl.mel_cli
            FROM contrat c
            INNER JOIN client cl ON c.num_cli = cl.num_cli
            WHERE c.num_cont = ?`,
            [numContrat],
        );

        if (result.length > 0) {
            const ligne = result[0];

            this._form.dateCreaContrat.value = ligne.date_cont.toString();
            this._form.infoSite.value =
                `${ligne.adr_site}\n${ligne.cp_site} ${ligne.ville_site}`;
            this._form.numClient.value = ligne.num_cli.toString();
            this._form.nomClient.value = ligne.nom_cli.toString();
            this._form.prenomClient.value = ligne.prenom_cli.toString();
            this._form.telClient.value = ligne.tel_cli
                ? ligne.tel_cli.toString()
                : "";
            this._form.mailClient.value = ligne.mel_cli
                ? ligne.mel_cli.toString()
                : "";
            this.cacherErreur("erreurFormulaire");
        } else if (numContrat !== "") {
            this.afficherErreur(
                "erreurFormulaire",
                "Le numéro de contrat doit être renseigné",
            );
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
        this.cacherErreur("erreurFormulaire");

        const numInter = this._form.numInter.value.trim();
        const dateInter = this._form.dateInter.value.trim();
        const objetInter = this._form.objetInter.value.trim();
        const numContrat = this._form.numContrat.value.trim();

        if (numContrat === "") {
            this.afficherErreur(
                "erreurFormulaire",
                "Le numéro de contrat doit être renseigné",
            );
            return;
        }

        if (!numInter || !dateInter || !objetInter) {
            this.afficherErreur(
                "erreurFormulaire",
                "Tous les champs obligatoires doivent être renseignés",
            );
            return;
        }

        const lignesPresta =
            this._form.tablePrestations.querySelectorAll("tbody tr");
        if (lignesPresta.length === 0) {
            this.afficherErreur(
                "erreurFormulaire",
                "L'intervention doit comporter au moins une prestation",
            );
            return;
        }

        const numInterNum = Number(numInter);
        const numContratNum = Number(numContrat);
        const doublon = InterventionRepository.existsWithDate(
            numContratNum,
            dateInter,
            this._modeFormulaire === "modif" ? numInterNum : undefined,
        );
        if (doublon) {
            this.afficherErreur(
                "erreurFormulaire",
                "Une intervention pour le contrat est déjà planifiée à la même date d'intervention",
            );
            return;
        }

        if (this._modeFormulaire === "modif") {
            this.modifierInter();
        } else {
            this.ajouterInter();
        }
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
            const lignes =
                this._form.tablePrestations.querySelectorAll("tbody tr");

            lignes.forEach((element) => {
                const tr = element as HTMLTableRowElement;
                sqlWeb.SQLexec(
                    "INSERT INTO utilisation (num_interv, code_prest, qte_prest) VALUES (?, ?, ?)",
                    [
                        this._form.numInter.value,
                        tr.cells[0].textContent!,
                        tr.cells[3].textContent!,
                    ],
                );
            });
        } else {
            this.afficherErreur(
                "erreurFormulaire",
                "Erreur lors de l'ajout de l'intervention",
            );
            return;
        }

        this.init(this._form);
        this.afficherSucces("Intervention ajoutée avec succès.");
    }

    modifierInter(): void {
        const numInter = this._form.numInter.value;
        const succes = sqlWeb.SQLexec(
            "UPDATE intervention SET date_interv = ?, objet_interv = ?, obs_interv = ?, num_cont = ? WHERE num_interv = ?",
            [
                this._form.dateInter.value,
                this._form.objetInter.value,
                this._form.observations.value,
                this._form.numContrat.value,
                numInter,
            ],
        );

        if (succes) {
            sqlWeb.SQLexec(
                "DELETE FROM utilisation WHERE num_interv = ?",
                [numInter],
            );

            const lignes =
                this._form.tablePrestations.querySelectorAll("tbody tr");
            lignes.forEach((element) => {
                const tr = element as HTMLTableRowElement;
                sqlWeb.SQLexec(
                    "INSERT INTO utilisation (num_interv, code_prest, qte_prest) VALUES (?, ?, ?)",
                    [
                        numInter,
                        tr.cells[0].textContent!,
                        tr.cells[3].textContent!,
                    ],
                );
            });
        } else {
            this.afficherErreur(
                "erreurFormulaire",
                "Erreur lors de la modification de l'intervention",
            );
            return;
        }

        this.init(this._form);
        this.afficherSucces("Intervention modifiée avec succès.");
    }

    modifierPresta(): void {
        const table = document.querySelector(
            "#tablePrestations tbody",
        ) as HTMLTableSectionElement;

        const sIndex = table.querySelector(
            "tr.selected",
        ) as HTMLTableRowElement;

        if (!sIndex) {
            this.afficherErreur("erreurPrestaAction", "Veuillez sélectionner une prestation à modifier.");
        } else {
            this.cacherErreur("erreurPrestaAction");
            this._lignePrestaEnModif = sIndex;
            this.ajouterOptionPrestation(false);
            this._form.selectPrestation.value =
                sIndex.cells[0].textContent || "";
            this._form.qtePrestation.value =
                sIndex.cells[3].textContent || "1";
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
            this.afficherErreur("erreurListe", "Veuillez sélectionner une intervention à modifier.");
            return;
        }
        this.cacherErreur("erreurListe");

        const numInter = ligneSelectionne.cells[0].textContent || "";
        const numContrat = ligneSelectionne.cells[2].textContent || "";

        let data;

        data = sqlWeb.SQLloadData(
            "SELECT date_interv FROM intervention WHERE num_interv = ?",
            [numInter],
        );
        const dateInterv: string = data[0]["date_interv"];

        // R1 : blocage si la date d'intervention est aujourd'hui ou déjà passée
        const dateObj = new Date(dateInterv);
        const aujourdhui = new Date();
        aujourdhui.setHours(0, 0, 0, 0);
        dateObj.setHours(0, 0, 0, 0);
        if (aujourdhui >= dateObj) {
            this.afficherErreur("erreurListe",
                "Modification impossible : la date d'intervention est aujourd'hui ou déjà passée. " +
                "La modification n'est autorisée que jusqu'à la veille de l'intervention.",
            );
            return;
        }

        this.form.numInter.value = numInter;
        this.form.numContrat.value = numContrat;
        this.form.dateInter.value = dateInterv;

        data = sqlWeb.SQLloadData(
            "SELECT objet_interv, obs_interv FROM intervention WHERE num_interv = ?",
            [numInter],
        );
        this.form.objetInter.value = data[0]["objet_interv"];
        this.form.observations.value = data[0]["obs_interv"] || "";

        this.ajouterInfoContrat();

        let tbody = this._form.tablePrestations.querySelector("tbody");
        if (tbody) {
            tbody.innerHTML = "";

            const prestationsLiees = sqlWeb.SQLloadData(
                "SELECT u.code_prest, u.qte_prest, p.lib_prest, COALESCE(tp.tarif_ht, 0) AS tarif_ht " +
                "FROM utilisation u " +
                "JOIN intervention i ON i.num_interv = u.num_interv " +
                "JOIN prestation p ON u.code_prest = p.code_prest " +
                "LEFT JOIN tarifer_prestation tp ON u.code_prest = tp.code_prest " +
                "   AND tp.date_debut = (SELECT MAX(date_debut) FROM tarifer_prestation WHERE code_prest = u.code_prest AND date_debut <= i.date_interv) " +
                "WHERE u.num_interv = ?",
                [numInter],
            );

            prestationsLiees.forEach((prest) => {
                let tr: HTMLTableRowElement = document.createElement("tr");

                let tdPrest: HTMLTableCellElement =
                    document.createElement("td");
                tdPrest.textContent = prest.code_prest;
                tr.appendChild(tdPrest);

                let tdLib: HTMLTableCellElement = document.createElement("td");
                tdLib.textContent = prest.lib_prest;
                tr.appendChild(tdLib);

                let tdPrixU: HTMLTableCellElement =
                    document.createElement("td");
                tdPrixU.textContent = parseFloat(prest.tarif_ht).toFixed(2);
                tr.appendChild(tdPrixU);

                let tdQte: HTMLTableCellElement = document.createElement("td");
                tdQte.textContent = prest.qte_prest.toString();
                tr.appendChild(tdQte);

                let tdPrixT: HTMLTableCellElement =
                    document.createElement("td");
                tdPrixT.textContent = (
                    Number(prest.tarif_ht) * Number(prest.qte_prest)
                ).toFixed(2);
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

    afficherVisuInter(): void {
        const table = document.querySelector(
            "#table_intervention tbody",
        ) as HTMLTableSectionElement;

        const ligneSelectionne = table.querySelector(
            "tr.selected",
        ) as HTMLTableRowElement;

        if (!ligneSelectionne) {
            this.afficherErreur("erreurListe", "Veuillez sélectionner une intervention à afficher.");
            return;
        }
        this.cacherErreur("erreurListe");

        const numInter = ligneSelectionne.cells[0].textContent || "";

        // Récupérer intervention
        let data = sqlWeb.SQLloadData(
            "SELECT i.date_interv, i.objet_interv, i.obs_interv, i.num_cont, co.num_cli, co.adr_site, co.ville_site, c.nom_cli, c.prenom_cli " +
                "FROM intervention i JOIN contrat co ON i.num_cont = co.num_cont JOIN client c ON co.num_cli = c.num_cli WHERE i.num_interv = ?",
            [numInter],
        );

        if (!data || data.length === 0) {
            this.afficherErreur("erreurListe", "Détails introuvables pour cette intervention.");
            return;
        }

        const info = data[0];

        const setVal = (id: string, val: string) => {
            const el = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | null;
            if (el) el.value = val || "";
        };

        setVal("v_numInter", numInter);
        const rawInterv: string = info.date_interv || "";
        if (rawInterv.includes("-")) {
            const [y, m, d] = rawInterv.split("-");
            setVal("v_dateInter", `${d}/${m}/${y}`);
        } else {
            setVal("v_dateInter", rawInterv);
        }
        setVal("v_objetInter", info.objet_interv || "");
        setVal("v_observations", info.obs_interv || "");
        setVal("v_numContrat", info.num_cont || "");
        setVal("v_client", (info.nom_cli ? info.nom_cli + ' ' : '') + (info.prenom_cli || ''));

        // Calculer total TTC
        const prestations = sqlWeb.SQLloadData(
            `SELECT u.code_prest, u.qte_prest, p.lib_prest, p.tarif_ht FROM utilisation u JOIN prestation p ON u.code_prest = p.code_prest WHERE u.num_interv = ?`,
            [numInter],
        );

        let montantTotal = 0;
        for (let p of prestations) {
            montantTotal += Number(p.tarif_ht) * Number(p.qte_prest);
        }
        setVal("v_totalTTC", (montantTotal * 1.1).toFixed(2));

        // Afficher modal
        const modal = document.getElementById("modalDetail");
        if (modal) modal.classList.remove("hidden");

        const btnClose = document.getElementById("btnCloseVisu");
        if (btnClose) btnClose.onclick = () => {
            if (modal) modal.classList.add("hidden");
        };
    }

    determinerNumInter(): string {
        let nbIntervMax: number;

        const bruteVal = this.determinerNumInterBis();
        nbIntervMax = Number(bruteVal);

        if (isNaN(nbIntervMax)) {
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
            this.afficherErreur("erreurListe", "Veuillez sélectionner une intervention à supprimer.");
        } else {
            if (!confirm(`Confirmer la suppression de l'intervention n°${sIndex.cells[0].textContent} ?`)) return;
            this.cacherErreur("erreurListe");
            const numInter = sIndex.cells[0].textContent;

            const requeteUtilisation =
                "DELETE FROM utilisation WHERE num_interv = ?";
            const requeteIntervention =
                "DELETE FROM intervention WHERE num_interv = ?";
            const parametres = [numInter!];

            const succes1 = sqlWeb.SQLexec(requeteUtilisation, parametres);

            if (succes1) {
                const succes2 = sqlWeb.SQLexec(requeteIntervention, parametres);

                if (succes2) {
                    sIndex.remove();
                    this.init(this._form);
                    this.afficherSucces("Intervention supprimée avec succès.");
                } else {
                    this.afficherErreur("erreurListe", "Erreur lors de la suppression de l'intervention en base de données.");
                }
            } else {
                this.afficherErreur("erreurListe", "Erreur lors de la suppression des prestations liées.");
            }
        }
    }
}

let sae = new ControleurSae();
export { sae };
