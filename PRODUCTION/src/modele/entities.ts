import type { TtabAsso } from "./sqlWeb.js";

export class UnClient {
    private _numCli: number;
    private _civCli: string;
    private _nomCli: string;
    private _prenomCli: string;
    private _telCli: string;
    private _melCli: string;

    constructor(numCli: number, civCli: string, nomCli: string, prenomCli: string, telCli: string, melCli: string) {
        if (!Number.isInteger(numCli) || numCli <= 0)
            throw new Error(`num_cli invalide : entier > 0 requis, reçu ${numCli}`);
        if (!["M.", "Mme", "Mlle"].includes(civCli))
            throw new Error(`civ_cli invalide : doit être "M.", "Mme" ou "Mlle", reçu "${civCli}"`);
        if (!/^[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ \-]{1,19}$/.test(nomCli))
            throw new Error(`nom_cli invalide : alphabétique + espaces/tirets, 2-20 caractères, reçu "${nomCli}"`);
        if (!/^[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ \-]{1,19}$/.test(prenomCli))
            throw new Error(`prenom_cli invalide : alphabétique + espaces/tirets, 2-20 caractères, reçu "${prenomCli}"`);
        if (telCli !== "" && (telCli.length > 16 || !/^\d+$/.test(telCli)))
            throw new Error(`tel_cli invalide : chiffres uniquement, max 16 caractères, reçu "${telCli}"`);
        if (melCli !== "" && (melCli.length > 50 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(melCli)))
            throw new Error(`mel_cli invalide : adresse e-mail max 50 caractères, reçu "${melCli}"`);

        this._numCli = numCli;
        this._civCli = civCli;
        this._nomCli = nomCli;
        this._prenomCli = prenomCli;
        this._telCli = telCli;
        this._melCli = melCli;
    }

    get numCli(): number { return this._numCli; }
    get civCli(): string { return this._civCli; }
    get nomCli(): string { return this._nomCli; }
    get prenomCli(): string { return this._prenomCli; }
    get telCli(): string { return this._telCli; }
    get melCli(): string { return this._melCli; }

    toArray() {
        return {
            num_cli: this._numCli,
            civ_cli: this._civCli,
            nom_cli: this._nomCli,
            prenom_cli: this._prenomCli,
            tel_cli: this._telCli,
            mel_cli: this._melCli,
        };
    }

    static fromArray(row: TtabAsso): UnClient {
        const civCli = (["M.", "Mme", "Mlle"] as string[]).includes(String(row.civ_cli))
            ? String(row.civ_cli) : "M.";
        const nomRaw = String(row.nom_cli || "");
        const nomCli = /^[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ \-]{1,19}$/.test(nomRaw) ? nomRaw : "Inconnu";
        const prenomRaw = String(row.prenom_cli || "");
        const prenomCli = /^[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ \-]{1,19}$/.test(prenomRaw) ? prenomRaw : "Inconnu";
        const telRaw = String(row.tel_cli || "");
        const telCli = telRaw === "" || (telRaw.length <= 16 && /^\d+$/.test(telRaw)) ? telRaw : "";
        const melRaw = String(row.mel_cli || "");
        const melCli = melRaw === "" || (melRaw.length <= 50 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(melRaw)) ? melRaw : "";
        return new UnClient(
            Math.max(1, Number.parseInt(String(row.num_cli), 10) || 1),
            civCli, nomCli, prenomCli, telCli, melCli,
        );
    }
}

export class UnContrat {
    private _numCont: number;
    private _numCli: number;
    private _dateCont: string;
    private _adrSite: string;
    private _villeSite: string;
    private _cpSite: string;
    private _telSite: string;

    constructor(numCont: number, numCli: number, dateCont: string, adrSite: string, villeSite: string, cpSite: string, telSite: string) {
        if (!Number.isInteger(numCont) || numCont <= 0)
            throw new Error(`num_cont invalide : entier > 0 requis, reçu ${numCont}`);
        if (!Number.isInteger(numCli) || numCli <= 0)
            throw new Error(`num_cli invalide : entier > 0 requis, reçu ${numCli}`);
        if (isNaN(Date.parse(dateCont)))
            throw new Error(`date_cont invalide : date valide requise, reçu "${dateCont}"`);
        if (adrSite.length > 50)
            throw new Error(`adr_site invalide : max 50 caractères, reçu "${adrSite}"`);
        if (villeSite.length > 30)
            throw new Error(`ville_site invalide : max 30 caractères, reçu "${villeSite}"`);
        if (!/^\d{1,5}$/.test(cpSite))
            throw new Error(`cp_site invalide : 1-5 chiffres uniquement, reçu "${cpSite}"`);
        if (telSite !== "" && (telSite.length > 16 || !/^\d+$/.test(telSite)))
            throw new Error(`tel_site invalide : chiffres uniquement, max 16 caractères, reçu "${telSite}"`);

        this._numCont = numCont;
        this._numCli = numCli;
        this._dateCont = dateCont;
        this._adrSite = adrSite;
        this._villeSite = villeSite;
        this._cpSite = cpSite;
        this._telSite = telSite;
    }

    get numCont(): number { return this._numCont; }
    get numCli(): number { return this._numCli; }
    get dateCont(): string { return this._dateCont; }
    get adrSite(): string { return this._adrSite; }
    get villeSite(): string { return this._villeSite; }
    get cpSite(): string { return this._cpSite; }
    get telSite(): string { return this._telSite; }

    toArray() {
        return {
            num_cont: this._numCont,
            num_cli: this._numCli,
            date_cont: this._dateCont,
            adr_site: this._adrSite,
            ville_site: this._villeSite,
            cp_site: this._cpSite,
            tel_site: this._telSite,
        };
    }

    static fromArray(row: TtabAsso): UnContrat {
        const cpRaw = String(row.cp_site || "00000");
        const cpSite = /^\d{1,5}$/.test(cpRaw) ? cpRaw : "00000";
        const telRaw = String(row.tel_site || "");
        const telSite = telRaw === "" || (telRaw.length <= 16 && /^\d+$/.test(telRaw)) ? telRaw : "";
        const dateCont = !isNaN(Date.parse(String(row.date_cont))) ? String(row.date_cont) : "2000-01-01";
        return new UnContrat(
            Math.max(1, Number.parseInt(String(row.num_cont), 10) || 1),
            Math.max(1, Number.parseInt(String(row.num_cli), 10) || 1),
            dateCont,
            String(row.adr_site || "").slice(0, 50),
            String(row.ville_site || "").slice(0, 30),
            cpSite, telSite,
        );
    }
}

export class UneIntervention {
    private _numInter: number;
    private _dateInter: string;
    private _objetInter: string;
    private _obsInter: string;
    private _numCont: number;

    constructor(numInter: number, dateInter: string, objetInter: string, obsInter: string, numCont: number) {
        if (!Number.isInteger(numInter) || numInter < 1)
            throw new Error(`num_interv invalide : entier ≥ 1 requis, reçu ${numInter}`);
        if (dateInter !== "" && isNaN(Date.parse(dateInter)))
            throw new Error(`date_interv invalide : date valide requise si renseignée, reçu "${dateInter}"`);
        if (objetInter.length > 300)
            throw new Error(`objet_interv invalide : max 300 caractères, reçu ${objetInter.length} chars`);
        if (obsInter.length > 300)
            throw new Error(`obs_interv invalide : max 300 caractères, reçu ${obsInter.length} chars`);
        if (!Number.isInteger(numCont) || numCont <= 0)
            throw new Error(`num_cont invalide : entier > 0 requis, reçu ${numCont}`);

        this._numInter = numInter;
        this._dateInter = dateInter;
        this._objetInter = objetInter;
        this._obsInter = obsInter;
        this._numCont = numCont;
    }

    get numInter(): number { return this._numInter; }
    get dateInter(): string { return this._dateInter; }
    get objetInter(): string { return this._objetInter; }
    get obsInter(): string { return this._obsInter; }
    get numCont(): number { return this._numCont; }

    set dateInter(value: string) {
        if (value !== "" && isNaN(Date.parse(value)))
            throw new Error(`date_interv invalide : date valide requise, reçu "${value}"`);
        this._dateInter = value;
    }
    set objetInter(value: string) {
        if (value.length > 300)
            throw new Error(`objet_interv invalide : max 300 caractères`);
        this._objetInter = value;
    }
    set obsInter(value: string) {
        if (value.length > 300)
            throw new Error(`obs_interv invalide : max 300 caractères`);
        this._obsInter = value;
    }
    set numCont(value: number) {
        if (!Number.isInteger(value) || value <= 0)
            throw new Error(`num_cont invalide : entier > 0 requis`);
        this._numCont = value;
    }

    toArray() {
        return {
            num_interv: this._numInter,
            date_interv: this._dateInter,
            objet_interv: this._objetInter,
            obs_interv: this._obsInter,
            num_cont: this._numCont,
        };
    }

    static fromArray(row: TtabAsso): UneIntervention {
        const dateRaw = String(row.date_interv || "");
        const dateInter = dateRaw !== "" && !isNaN(Date.parse(dateRaw)) ? dateRaw : "";
        return new UneIntervention(
            Math.max(1, Number.parseInt(String(row.num_interv), 10) || 1),
            dateInter,
            String(row.objet_interv || "").slice(0, 300),
            String(row.obs_interv || "").slice(0, 300),
            Math.max(1, Number.parseInt(String(row.num_cont), 10) || 1),
        );
    }
}

export class UnePrestation {
    private _codePrest: string;
    private _libPrest: string;
    private _tarifHt: number;

    constructor(codePrest: string, libPrest: string, tarifHt: number) {
        if (codePrest.length < 2 || codePrest.length > 6)
            throw new Error(`code_prest invalide : 2-6 caractères, reçu "${codePrest}" (${codePrest.length} chars)`);
        if (libPrest.length < 5 || libPrest.length > 50)
            throw new Error(`lib_prest invalide : 5-50 caractères, reçu "${libPrest}" (${libPrest.length} chars)`);
        if (typeof tarifHt !== "number" || isNaN(tarifHt) || tarifHt <= 0)
            throw new Error(`tarif_ht invalide : réel strictement > 0, reçu ${tarifHt}`);

        this._codePrest = codePrest;
        this._libPrest = libPrest;
        this._tarifHt = tarifHt;
    }

    get codePrest(): string { return this._codePrest; }
    get libPrest(): string { return this._libPrest; }
    get tarifHt(): number { return this._tarifHt; }

    set tarifHt(value: number) {
        if (typeof value !== "number" || isNaN(value) || value <= 0)
            throw new Error(`tarif_ht invalide : réel strictement > 0`);
        this._tarifHt = value;
    }

    toArray() {
        return {
            code_prest: this._codePrest,
            lib_prest: this._libPrest,
            tarif_ht: this._tarifHt,
        };
    }

    static fromArray(row: TtabAsso): UnePrestation {
        const codeRaw = String(row.code_prest || "XX");
        const codePrest = codeRaw.length >= 2 && codeRaw.length <= 6 ? codeRaw : codeRaw.slice(0, 6).padEnd(2, "X");
        const libRaw = String(row.lib_prest || "Inconnu");
        const libPrest = libRaw.length >= 5 ? libRaw.slice(0, 50) : libRaw.padEnd(5, " ");
        const tarifHt = Math.max(0.01, Number.parseFloat(String(row.tarif_ht)) || 0.01);
        return new UnePrestation(codePrest, libPrest, tarifHt);
    }
}

export class UneUtilisation {
    private _numInter: number;
    private _codePrest: string;
    private _libPrest: string;
    private _tarifHt: number;
    private _qtePrest: number;

    constructor(numInter: number, codePrest: string, libPrest: string, tarifHt: number, qtePrest: number) {
        if (!Number.isInteger(numInter) || numInter < 1)
            throw new Error(`num_interv invalide : entier ≥ 1 requis, reçu ${numInter}`);
        if (codePrest.length < 2 || codePrest.length > 6)
            throw new Error(`code_prest invalide : 2-6 caractères, reçu "${codePrest}"`);
        if (typeof tarifHt !== "number" || isNaN(tarifHt) || tarifHt <= 0)
            throw new Error(`tarif_ht invalide : réel strictement > 0, reçu ${tarifHt}`);
        if (!Number.isInteger(qtePrest) || qtePrest <= 0)
            throw new Error(`qte_prest invalide : entier > 0 requis, reçu ${qtePrest}`);

        this._numInter = numInter;
        this._codePrest = codePrest;
        this._libPrest = libPrest;
        this._tarifHt = tarifHt;
        this._qtePrest = qtePrest;
    }

    get numInter(): number { return this._numInter; }
    get codePrest(): string { return this._codePrest; }
    get libPrest(): string { return this._libPrest; }
    get tarifHt(): number { return this._tarifHt; }
    get qtePrest(): number { return this._qtePrest; }
    get montantHt(): number { return this._tarifHt * this._qtePrest; }

    set qtePrest(value: number) {
        if (!Number.isInteger(value) || value <= 0)
            throw new Error(`qte_prest invalide : entier > 0 requis`);
        this._qtePrest = value;
    }

    toArray() {
        return {
            num_interv: this._numInter,
            code_prest: this._codePrest,
            lib_prest: this._libPrest,
            tarif_ht: this._tarifHt,
            qte_prest: this._qtePrest,
            montant_ht: this.montantHt,
        };
    }

    static fromArray(row: TtabAsso): UneUtilisation {
        const codeRaw = String(row.code_prest || "XX");
        const codePrest = codeRaw.length >= 2 && codeRaw.length <= 6 ? codeRaw : codeRaw.slice(0, 6).padEnd(2, "X");
        const tarifHt = Math.max(0.01, Number.parseFloat(String(row.tarif_ht)) || 0.01);
        const qtePrest = Math.max(1, Number.parseInt(String(row.qte_prest), 10) || 1);
        return new UneUtilisation(
            Math.max(1, Number.parseInt(String(row.num_interv), 10) || 1),
            codePrest,
            String(row.lib_prest || ""),
            tarifHt,
            qtePrest,
        );
    }
}
