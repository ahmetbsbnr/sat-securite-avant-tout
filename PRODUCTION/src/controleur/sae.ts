import "../modele/connexion.js";
import { APIsql } from "../modele/connexion.js";

class ControleurSae {
	constructor() {
		window.addEventListener('load', () => this.init());
	}

	init(): void {
		this.chargerInterventions();
	}

	chargerInterventions(): void {
		let dataSet = APIsql.sqlWeb.SQLloadData(
			"SELECT i.num_interv, i.date_interv, i.num_cont, co.ville_site, c.num_cli, c.nom_cli, " +
			"COALESCE(SUM(p.tarif_ht * u.qte_prest), 0) AS montant_ht " +
			"FROM intervention i " +
			"JOIN contrat co ON i.num_cont = co.num_cont " +
			"JOIN client c ON co.num_cli = c.num_cli " +
			"LEFT JOIN utilisation u ON i.num_interv = u.num_interv " +
			"LEFT JOIN prestation p ON u.code_prest = p.code_prest " +
			"GROUP BY i.num_interv, i.date_interv, i.num_cont, co.ville_site, c.num_cli, c.nom_cli " +
			"ORDER BY i.num_interv",
			[]
		);

		let tbody = document.querySelector("#table_intervention tbody");

		if (tbody) {
			tbody.innerHTML = "";

			dataSet.forEach((row: any) => {
				let tr = document.createElement("tr");

				let tdNum = document.createElement("td");
				tdNum.textContent = row["num_interv"];
				tr.appendChild(tdNum);

				let tdDate = document.createElement("td");
				tdDate.textContent = row["date_interv"];
				tr.appendChild(tdDate);

				let tdCont = document.createElement("td");
				tdCont.textContent = row["num_cont"];
				tr.appendChild(tdCont);

				let tdVille = document.createElement("td");
				tdVille.textContent = row["ville_site"];
				tr.appendChild(tdVille);

				let tdNumCli = document.createElement("td");
				tdNumCli.textContent = row["num_cli"];
				tr.appendChild(tdNumCli);

				let tdNomCli = document.createElement("td");
				tdNomCli.textContent = row["nom_cli"];
				tr.appendChild(tdNomCli);

				let tdMontant = document.createElement("td");
				tdMontant.textContent = parseFloat(row["montant_ht"]).toFixed(2) + " €";
				tr.appendChild(tdMontant);

				tr.addEventListener("click", () => {
					document.querySelectorAll("#table_intervention tbody tr").forEach(r => r.classList.remove("selected"));
					tr.classList.add("selected");
				});

				tbody.appendChild(tr);
			});
		}
	}
}

new ControleurSae();
