export type SaeForm = {
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
    dateCreaContrat: HTMLTextAreaElement;
    infoSite: HTMLTextAreaElement;
    numClient: HTMLInputElement;
    nomClient: HTMLTextAreaElement;
    prenomClient: HTMLTextAreaElement;
    telClient: HTMLTextAreaElement;
    mailClient: HTMLTextAreaElement;

    // Boutons de la section Prestation
    btnNvlPresta: HTMLInputElement;
    btnModifPresta: HTMLInputElement;
    btnSuppPresta: HTMLInputElement;

    // Champs de calcul
    totalHT: HTMLInputElement;
    totalTVA: HTMLInputElement;
    totalTTC: HTMLInputElement;

    // Boutons de fin
    btnValider: HTMLInputElement;
    btnAnnuler: HTMLInputElement;
};
