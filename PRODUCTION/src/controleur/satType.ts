export type SatForm = {
    // Boutons de navigation
    btnAjt: HTMLInputElement;
    btnEdt: HTMLInputElement;
    btnVisu: HTMLInputElement;
    btnSupp: HTMLInputElement;

    // Différent conteneurs
    divNvlInter: HTMLDivElement;
    divPrestationForm: HTMLDivElement;

    // Section Intervention
    numInter: HTMLInputElement;
    dateInter: HTMLInputElement;
    objetInter: HTMLInputElement;
    observations: HTMLTextAreaElement;

    // Section Contrat Client
    numContrat: HTMLInputElement;
    dateCreaContrat: HTMLTextAreaElement;
    infoSite: HTMLTextAreaElement;
    numClient: HTMLTextAreaElement;
    nomClient: HTMLTextAreaElement;
    prenomClient: HTMLTextAreaElement;
    telClient: HTMLTextAreaElement;
    mailClient: HTMLTextAreaElement;

    // Elements de la section Prestation
    tablePrestations: HTMLTableElement;
    selectPrestation: HTMLSelectElement;
    qtePrestation: HTMLInputElement;

    // Boutons de la section Prestation
    btnNvlPresta: HTMLInputElement;
    btnModifPresta: HTMLInputElement;
    btnSuppPresta: HTMLInputElement;
    btnValiderPresta: HTMLInputElement;
    btnAnnulerPresta: HTMLInputElement;

    // Champs de calcul (Inputs en readonly)
    totalHT: HTMLInputElement;
    totalTVA: HTMLInputElement;
    totalTTC: HTMLInputElement;

    // Boutons de fin
    btnValider: HTMLInputElement;
    btnAnnuler: HTMLInputElement;
};
