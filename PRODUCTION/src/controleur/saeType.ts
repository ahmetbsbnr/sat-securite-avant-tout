export type saeForm = {
    // Boutons de navigation
    btnAjt: HTMLInputElement;
    btnEdt: HTMLInputElement;
    btnSupp: HTMLInputElement;

    // Le conteneur principal du formulaire
    divNvlInter: HTMLDivElement;

    // Section Intervention
    numInter: HTMLInputElement;
    dateInter: HTMLInputElement;
    objetInter: HTMLInputElement;
    observations: HTMLTextAreaElement;

    // Section Contrat Client
    numContrat: HTMLInputElement;
    dateCreaContrat: HTMLInputElement;
    infoSite: HTMLTextAreaElement;
    numClient: HTMLInputElement;
    nomClient: HTMLInputElement;
    prenomClient: HTMLInputElement;
    telClient: HTMLInputElement;
    mailClient: HTMLInputElement;

    // Boutons de la section Prestation
    btnNvlPresta: HTMLInputElement;
    btnModifPresta: HTMLInputElement;
    btnSuppPresta: HTMLInputElement;

    // Champs de calcul (Inputs en readonly)
    totalHT: HTMLInputElement;
    totalTVA: HTMLInputElement;
    totalTTC: HTMLInputElement;

    // Boutons de fin
    btnValider: HTMLInputElement;
    btnAnnuler: HTMLInputElement;
};
