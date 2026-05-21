import { sqlWeb } from "./sqlWeb.js";
import { UneIntervention, UnContrat, UnClient, UnePrestation, UneUtilisation } from "./entities.js";

export class InterventionRepository {
    static getAll(): UneIntervention[] {
        const query = "SELECT i.num_interv, i.date_interv, i.objet_interv, i.obs_interv, i.num_cont " +
            "FROM intervention i " +
            "ORDER BY i.num_interv";
        const data = sqlWeb.SQLloadData(query, []);
        return data.map(row => UneIntervention.fromArray(row));
    }

    static getById(numInter: number): UneIntervention | null {
        const query = "SELECT i.num_interv, i.date_interv, i.objet_interv, i.obs_interv, i.num_cont " +
            "FROM intervention i " +
            "WHERE i.num_interv = ?";
        const data = sqlWeb.SQLloadData(query, [String(numInter)]);
        return data.length > 0 ? UneIntervention.fromArray(data[0]) : null;
    }

    static getNextId(): number {
        const data = sqlWeb.SQLloadData("SELECT COALESCE(MAX(num_interv), 0) + 1 AS next_num FROM intervention", []);
        return data.length > 0 ? Number.parseInt(String(data[0]["next_num"]), 10) : 1;
    }

    static add(intervention: UneIntervention): boolean {
        const query = "INSERT INTO intervention (date_interv, objet_interv, obs_interv, num_cont) VALUES (?, ?, ?, ?)";
        const arr = intervention.toArray();
        return sqlWeb.SQLexec(query, [
            String(arr.date_interv),
            String(arr.objet_interv),
            String(arr.obs_interv),
            String(arr.num_cont),
        ]);
    }

    static update(intervention: UneIntervention): boolean {
        const query = "UPDATE intervention SET date_interv = ?, objet_interv = ?, obs_interv = ?, num_cont = ? WHERE num_interv = ?";
        const arr = intervention.toArray();
        return sqlWeb.SQLexec(query, [
            String(arr.date_interv),
            String(arr.objet_interv),
            String(arr.obs_interv),
            String(arr.num_cont),
            String(arr.num_interv),
        ]);
    }

    static delete(numInter: number): boolean {
        return sqlWeb.SQLexec("DELETE FROM intervention WHERE num_interv = ?", [String(numInter)]);
    }

    static existsWithDate(numCont: number | string, dateInter: string, numInterExclu?: number | string): boolean {
        let query = "SELECT COUNT(*) AS nb FROM intervention WHERE num_cont = ? AND date_interv = ?";
        const params: string[] = [String(numCont), dateInter];
        if (numInterExclu !== undefined) {
            query += " AND num_interv <> ?";
            params.push(String(numInterExclu));
        }
        const data = sqlWeb.SQLloadData(query, params);
        const count = data.length > 0 ? Number.parseInt(String(data[0]["nb"] || "0"), 10) : 0;
        return count > 0;
    }

    static exists(numInter: number): boolean {
        const data = sqlWeb.SQLloadData("SELECT COUNT(*) AS nb FROM intervention WHERE num_interv = ?", [String(numInter)]);
        const count = data.length > 0 ? Number.parseInt(String(data[0]["nb"] || "0"), 10) : 0;
        return count > 0;
    }
}

export class ContratRepository {
    static getById(numCont: number): UnContrat | null {
        const query = "SELECT num_cont, num_cli, date_cont, adr_site, ville_site, cp_site, tel_site FROM contrat WHERE num_cont = ?";
        const data = sqlWeb.SQLloadData(query, [String(numCont)]);
        return data.length > 0 ? UnContrat.fromArray(data[0]) : null;
    }

    static getByClient(numCli: number): UnContrat[] {
        const query = "SELECT num_cont, num_cli, date_cont, adr_site, ville_site, cp_site, tel_site " +
            "FROM contrat WHERE num_cli = ? ORDER BY num_cont";
        const data = sqlWeb.SQLloadData(query, [String(numCli)]);
        return data.map(row => UnContrat.fromArray(row));
    }

    static exists(numCont: number): boolean {
        const data = sqlWeb.SQLloadData("SELECT COUNT(*) AS nb FROM contrat WHERE num_cont = ?", [String(numCont)]);
        const count = data.length > 0 ? Number.parseInt(String(data[0]["nb"] || "0"), 10) : 0;
        return count > 0;
    }
}

export class ClientRepository {
    static getAll(): UnClient[] {
        const query = "SELECT num_cli, civ_cli, nom_cli, prenom_cli, tel_cli, mel_cli FROM client ORDER BY nom_cli, prenom_cli";
        const data = sqlWeb.SQLloadData(query, []);
        return data.map(row => UnClient.fromArray(row));
    }

    static getById(numCli: number): UnClient | null {
        const query = "SELECT num_cli, civ_cli, nom_cli, prenom_cli, tel_cli, mel_cli FROM client WHERE num_cli = ?";
        const data = sqlWeb.SQLloadData(query, [String(numCli)]);
        return data.length > 0 ? UnClient.fromArray(data[0]) : null;
    }

    static getByContrat(numCont: number): UnClient | null {
        const query = "SELECT c.num_cli, c.civ_cli, c.nom_cli, c.prenom_cli, c.tel_cli, c.mel_cli " +
            "FROM client c JOIN contrat co ON c.num_cli = co.num_cli WHERE co.num_cont = ?";
        const data = sqlWeb.SQLloadData(query, [String(numCont)]);
        return data.length > 0 ? UnClient.fromArray(data[0]) : null;
    }

    static exists(numCli: number): boolean {
        const data = sqlWeb.SQLloadData("SELECT COUNT(*) AS nb FROM client WHERE num_cli = ?", [String(numCli)]);
        const count = data.length > 0 ? Number.parseInt(String(data[0]["nb"] || "0"), 10) : 0;
        return count > 0;
    }
}

export class PrestationRepository {
    static getAll(): UnePrestation[] {
        const query = "SELECT p.code_prest, p.lib_prest, COALESCE(tp.tarif_ht, 0) AS tarif_ht " +
            "FROM prestation p " +
            "LEFT JOIN tarifer_prestation tp ON tp.code_prest = p.code_prest " +
            "   AND tp.date_debut = (SELECT MAX(date_debut) FROM tarifer_prestation WHERE code_prest = p.code_prest) " +
            "ORDER BY p.lib_prest, p.code_prest";
        const data = sqlWeb.SQLloadData(query, []);
        return data.map(row => UnePrestation.fromArray(row));
    }

    static getByIntervention(numInter: number): UneUtilisation[] {
        const query = "SELECT u.num_interv, u.code_prest, p.lib_prest, COALESCE(tp.tarif_ht, 0) AS tarif_ht, u.qte_prest, " +
            "ROUND(COALESCE(tp.tarif_ht, 0) * u.qte_prest, 2) AS montant_ht " +
            "FROM utilisation u " +
            "JOIN intervention i ON i.num_interv = u.num_interv " +
            "JOIN prestation p ON u.code_prest = p.code_prest " +
            "LEFT JOIN tarifer_prestation tp ON u.code_prest = tp.code_prest " +
            "   AND tp.date_debut = (SELECT MAX(date_debut) FROM tarifer_prestation WHERE code_prest = tp.code_prest AND date_debut <= i.date_interv) " +
            "WHERE u.num_interv = ? " +
            "ORDER BY p.lib_prest, u.code_prest";
        const data = sqlWeb.SQLloadData(query, [String(numInter)]);
        return data.map(row => UneUtilisation.fromArray(row));
    }

    static exists(codePrest: string): boolean {
        const data = sqlWeb.SQLloadData("SELECT COUNT(*) AS nb FROM prestation WHERE code_prest = ?", [codePrest]);
        const count = data.length > 0 ? Number.parseInt(String(data[0]["nb"] || "0"), 10) : 0;
        return count > 0;
    }

    static addToIntervention(numInter: number, codePrest: string, qtePrest: number): boolean {
        return sqlWeb.SQLexec(
            "INSERT INTO utilisation (num_interv, code_prest, qte_prest) VALUES (?, ?, ?)",
            [String(numInter), codePrest, String(qtePrest)]
        );
    }

    static updateInIntervention(numInter: number, codePrest: string, qtePrest: number): boolean {
        return sqlWeb.SQLexec(
            "UPDATE utilisation SET qte_prest = ? WHERE num_interv = ? AND code_prest = ?",
            [String(qtePrest), String(numInter), codePrest]
        );
    }

    static deleteFromIntervention(numInter: number, codePrest: string): boolean {
        return sqlWeb.SQLexec(
            "DELETE FROM utilisation WHERE num_interv = ? AND code_prest = ?",
            [String(numInter), codePrest]
        );
    }

    static existsInIntervention(numInter: number, codePrest: string): boolean {
        const data = sqlWeb.SQLloadData(
            "SELECT COUNT(*) AS nb FROM utilisation WHERE num_interv = ? AND code_prest = ?",
            [String(numInter), codePrest]
        );
        const count = data.length > 0 ? Number.parseInt(String(data[0]["nb"] || "0"), 10) : 0;
        return count > 0;
    }
}
