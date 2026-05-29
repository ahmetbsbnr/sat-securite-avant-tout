// =====================================================================
//  Validateurs partagés des objets métier (couche M du MVC)
//
//  Chaque règle de gestion est définie UNE seule fois pour interdire toute
//  duplication de code :
//    - un prédicat booléen `est…`  : réutilisable (ex. par les `fromArray`) ;
//    - un validateur  `exiger…`     : lance une Error au message parlant si la
//                                      valeur n'est pas conforme.
//  Les setters des entités délèguent leur contrôle à ces fonctions, et les
//  constructeurs délèguent aux setters : la validation n'existe qu'à un endroit.
// =====================================================================

// ----------------------------- Prédicats -----------------------------

function estEntierStrictPositif(valeur: number): boolean {
    return Number.isInteger(valeur) && valeur > 0;
}

function estReelStrictPositif(valeur: number): boolean {
    return typeof valeur === "number" && !isNaN(valeur) && valeur > 0;
}

function estCivilite(valeur: string): boolean {
    return ["M.", "Mme", "Mlle"].includes(valeur);
}

const REGEX_NOM = /^[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ \-]{1,19}$/;
function estNomPropre(valeur: string): boolean {
    return REGEX_NOM.test(valeur);
}

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function estEmail(valeur: string, maxLong = 50): boolean {
    return valeur.length <= maxLong && REGEX_EMAIL.test(valeur);
}

function estChiffres(valeur: string, maxLong: number): boolean {
    return valeur.length <= maxLong && /^\d+$/.test(valeur);
}

function estCodePostal(valeur: string): boolean {
    return /^\d{1,5}$/.test(valeur);
}

function estDateValide(valeur: string): boolean {
    return !isNaN(Date.parse(valeur));
}

function estLongueurEntre(valeur: string, min: number, max: number): boolean {
    return valeur.length >= min && valeur.length <= max;
}

// ---------------------------- Validateurs -----------------------------

function exigerEntierStrictPositif(valeur: number, champ: string): void {
    if (!estEntierStrictPositif(valeur))
        throw new Error(`${champ} invalide : entier strictement positif requis, reçu ${valeur}`);
}

function exigerReelStrictPositif(valeur: number, champ: string): void {
    if (!estReelStrictPositif(valeur))
        throw new Error(`${champ} invalide : réel strictement positif requis, reçu ${valeur}`);
}

function exigerCivilite(valeur: string, champ: string): void {
    if (!estCivilite(valeur))
        throw new Error(`${champ} invalide : doit être "M.", "Mme" ou "Mlle", reçu "${valeur}"`);
}

function exigerNomPropre(valeur: string, champ: string): void {
    if (!estNomPropre(valeur))
        throw new Error(`${champ} invalide : chaîne alphabétique (espaces/tirets), 2 à 20 caractères, reçu "${valeur}"`);
}

function exigerEmailOptionnel(valeur: string, champ: string, maxLong = 50): void {
    if (valeur !== "" && !estEmail(valeur, maxLong))
        throw new Error(`${champ} invalide : adresse e-mail valide d'au plus ${maxLong} caractères, reçu "${valeur}"`);
}

function exigerChiffresOptionnel(valeur: string, champ: string, maxLong: number): void {
    if (valeur !== "" && !estChiffres(valeur, maxLong))
        throw new Error(`${champ} invalide : chiffres uniquement, au plus ${maxLong} caractères, reçu "${valeur}"`);
}

function exigerCodePostal(valeur: string, champ: string): void {
    if (!estCodePostal(valeur))
        throw new Error(`${champ} invalide : 1 à 5 chiffres uniquement, reçu "${valeur}"`);
}

function exigerChaineMaxLongueur(valeur: string, maxLong: number, champ: string): void {
    if (valeur.length > maxLong)
        throw new Error(`${champ} invalide : au plus ${maxLong} caractères, reçu ${valeur.length}`);
}

function exigerLongueurEntre(valeur: string, min: number, max: number, champ: string): void {
    if (!estLongueurEntre(valeur, min, max))
        throw new Error(`${champ} invalide : entre ${min} et ${max} caractères, reçu ${valeur.length}`);
}

function exigerDateObligatoire(valeur: string, champ: string): void {
    if (!estDateValide(valeur))
        throw new Error(`${champ} invalide : date valide requise, reçu "${valeur}"`);
}

function exigerDateOptionnelle(valeur: string, champ: string): void {
    if (valeur !== "" && !estDateValide(valeur))
        throw new Error(`${champ} invalide : date valide requise si renseignée, reçu "${valeur}"`);
}

// =====================================================================
//  Objets métier
// =====================================================================

export class UnClient {
    private _numCli!: number;
    private _civCli!: string;
    private _nomCli!: string;
    private _prenomCli!: string;
    private _telCli!: string;
    private _melCli!: string;

    // Le constructeur délègue chaque contrôle au setter correspondant :
    // la validation n'est donc écrite qu'à un seul endroit.
    constructor(numCli: number, civCli: string, nomCli: string, prenomCli: string, telCli: string, melCli: string) {
        this.numCli = numCli;
        this.civCli = civCli;
        this.nomCli = nomCli;
        this.prenomCli = prenomCli;
        this.telCli = telCli;
        this.melCli = melCli;
    }

    get numCli(): number { return this._numCli; }
    set numCli(v: number) { exigerEntierStrictPositif(v, "num_cli"); this._numCli = v; }

    get civCli(): string { return this._civCli; }
    set civCli(v: string) { exigerCivilite(v, "civ_cli"); this._civCli = v; }

    get nomCli(): string { return this._nomCli; }
    set nomCli(v: string) { exigerNomPropre(v, "nom_cli"); this._nomCli = v; }

    get prenomCli(): string { return this._prenomCli; }
    set prenomCli(v: string) { exigerNomPropre(v, "prenom_cli"); this._prenomCli = v; }

    get telCli(): string { return this._telCli; }
    set telCli(v: string) { exigerChiffresOptionnel(v, "tel_cli", 16); this._telCli = v; }

    get melCli(): string { return this._melCli; }
    set melCli(v: string) { exigerEmailOptionnel(v, "mel_cli", 50); this._melCli = v; }

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

    static fromArray(row: Record<string, string>): UnClient {
        const civCli = estCivilite(String(row.civ_cli)) ? String(row.civ_cli) : "M.";
        const nomRaw = String(row.nom_cli || "");
        const nomCli = estNomPropre(nomRaw) ? nomRaw : "Inconnu";
        const prenomRaw = String(row.prenom_cli || "");
        const prenomCli = estNomPropre(prenomRaw) ? prenomRaw : "Inconnu";
        const telRaw = String(row.tel_cli || "");
        const telCli = telRaw === "" || estChiffres(telRaw, 16) ? telRaw : "";
        const melRaw = String(row.mel_cli || "");
        const melCli = melRaw === "" || estEmail(melRaw, 50) ? melRaw : "";
        return new UnClient(
            Math.max(1, Number.parseInt(String(row.num_cli), 10) || 1),
            civCli, nomCli, prenomCli, telCli, melCli,
        );
    }
}

export class UnContrat {
    private _numCont!: number;
    private _numCli!: number;
    private _dateCont!: string;
    private _adrSite!: string;
    private _villeSite!: string;
    private _cpSite!: string;
    private _telSite!: string;

    constructor(numCont: number, numCli: number, dateCont: string, adrSite: string, villeSite: string, cpSite: string, telSite: string) {
        this.numCont = numCont;
        this.numCli = numCli;
        this.dateCont = dateCont;
        this.adrSite = adrSite;
        this.villeSite = villeSite;
        this.cpSite = cpSite;
        this.telSite = telSite;
    }

    get numCont(): number { return this._numCont; }
    set numCont(v: number) { exigerEntierStrictPositif(v, "num_cont"); this._numCont = v; }

    get numCli(): number { return this._numCli; }
    set numCli(v: number) { exigerEntierStrictPositif(v, "num_cli"); this._numCli = v; }

    get dateCont(): string { return this._dateCont; }
    set dateCont(v: string) { exigerDateObligatoire(v, "date_cont"); this._dateCont = v; }

    get adrSite(): string { return this._adrSite; }
    set adrSite(v: string) { exigerChaineMaxLongueur(v, 50, "adr_site"); this._adrSite = v; }

    get villeSite(): string { return this._villeSite; }
    set villeSite(v: string) { exigerChaineMaxLongueur(v, 30, "ville_site"); this._villeSite = v; }

    get cpSite(): string { return this._cpSite; }
    set cpSite(v: string) { exigerCodePostal(v, "cp_site"); this._cpSite = v; }

    get telSite(): string { return this._telSite; }
    set telSite(v: string) { exigerChiffresOptionnel(v, "tel_site", 16); this._telSite = v; }

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

    static fromArray(row: Record<string, string>): UnContrat {
        const cpRaw = String(row.cp_site || "00000");
        const cpSite = estCodePostal(cpRaw) ? cpRaw : "00000";
        const telRaw = String(row.tel_site || "");
        const telSite = telRaw === "" || estChiffres(telRaw, 16) ? telRaw : "";
        const dateRaw = String(row.date_cont);
        const dateCont = estDateValide(dateRaw) ? dateRaw : "2000-01-01";
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
    private _numInter!: number;
    private _dateInter!: string;
    private _objetInter!: string;
    private _obsInter!: string;
    private _numCont!: number;

    constructor(numInter: number, dateInter: string, objetInter: string, obsInter: string, numCont: number) {
        this.numInter = numInter;
        this.dateInter = dateInter;
        this.objetInter = objetInter;
        this.obsInter = obsInter;
        this.numCont = numCont;
    }

    get numInter(): number { return this._numInter; }
    set numInter(v: number) { exigerEntierStrictPositif(v, "num_interv"); this._numInter = v; }

    get dateInter(): string { return this._dateInter; }
    set dateInter(v: string) { exigerDateOptionnelle(v, "date_interv"); this._dateInter = v; }

    get objetInter(): string { return this._objetInter; }
    set objetInter(v: string) { exigerChaineMaxLongueur(v, 300, "objet_interv"); this._objetInter = v; }

    get obsInter(): string { return this._obsInter; }
    set obsInter(v: string) { exigerChaineMaxLongueur(v, 300, "obs_interv"); this._obsInter = v; }

    get numCont(): number { return this._numCont; }
    set numCont(v: number) { exigerEntierStrictPositif(v, "num_cont"); this._numCont = v; }

    toArray() {
        return {
            num_interv: this._numInter,
            date_interv: this._dateInter,
            objet_interv: this._objetInter,
            obs_interv: this._obsInter,
            num_cont: this._numCont,
        };
    }

    static fromArray(row: Record<string, string>): UneIntervention {
        const dateRaw = String(row.date_interv || "");
        const dateInter = dateRaw !== "" && estDateValide(dateRaw) ? dateRaw : "";
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
    private _codePrest!: string;
    private _libPrest!: string;
    private _tarifHt!: number;

    constructor(codePrest: string, libPrest: string, tarifHt: number) {
        this.codePrest = codePrest;
        this.libPrest = libPrest;
        this.tarifHt = tarifHt;
    }

    get codePrest(): string { return this._codePrest; }
    set codePrest(v: string) { exigerLongueurEntre(v, 2, 6, "code_prest"); this._codePrest = v; }

    get libPrest(): string { return this._libPrest; }
    set libPrest(v: string) { exigerLongueurEntre(v, 5, 50, "lib_prest"); this._libPrest = v; }

    get tarifHt(): number { return this._tarifHt; }
    set tarifHt(v: number) { exigerReelStrictPositif(v, "tarif_ht"); this._tarifHt = v; }

    toArray() {
        return {
            code_prest: this._codePrest,
            lib_prest: this._libPrest,
            tarif_ht: this._tarifHt,
        };
    }

    static fromArray(row: Record<string, string>): UnePrestation {
        const codeRaw = String(row.code_prest || "XX");
        const codePrest = estLongueurEntre(codeRaw, 2, 6) ? codeRaw : codeRaw.slice(0, 6).padEnd(2, "X");
        const libRaw = String(row.lib_prest || "Inconnu");
        const libPrest = libRaw.length >= 5 ? libRaw.slice(0, 50) : libRaw.padEnd(5, " ");
        const tarifHt = Math.max(0.01, Number.parseFloat(String(row.tarif_ht)) || 0.01);
        return new UnePrestation(codePrest, libPrest, tarifHt);
    }
}

export class UneUtilisation {
    private _numInter!: number;
    private _codePrest!: string;
    private _libPrest!: string;
    private _tarifHt!: number;
    private _qtePrest!: number;

    constructor(numInter: number, codePrest: string, libPrest: string, tarifHt: number, qtePrest: number) {
        this.numInter = numInter;
        this.codePrest = codePrest;
        this.libPrest = libPrest;
        this.tarifHt = tarifHt;
        this.qtePrest = qtePrest;
    }

    get numInter(): number { return this._numInter; }
    set numInter(v: number) { exigerEntierStrictPositif(v, "num_interv"); this._numInter = v; }

    get codePrest(): string { return this._codePrest; }
    set codePrest(v: string) { exigerLongueurEntre(v, 2, 6, "code_prest"); this._codePrest = v; }

    // lib_prest n'a pas de règle de gestion propre côté Utilisation (issu d'une jointure).
    get libPrest(): string { return this._libPrest; }
    set libPrest(v: string) { this._libPrest = v; }

    get tarifHt(): number { return this._tarifHt; }
    set tarifHt(v: number) { exigerReelStrictPositif(v, "tarif_ht"); this._tarifHt = v; }

    get qtePrest(): number { return this._qtePrest; }
    set qtePrest(v: number) { exigerEntierStrictPositif(v, "qte_prest"); this._qtePrest = v; }

    get montantHt(): number { return this._tarifHt * this._qtePrest; }

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

    static fromArray(row: Record<string, string>): UneUtilisation {
        const codeRaw = String(row.code_prest || "XX");
        const codePrest = estLongueurEntre(codeRaw, 2, 6) ? codeRaw : codeRaw.slice(0, 6).padEnd(2, "X");
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
