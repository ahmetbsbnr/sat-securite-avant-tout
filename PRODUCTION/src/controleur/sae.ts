import { ControleurSae } from "./classSae";

const sae = new ControleurSae({
    // Boutons principaux
    btnAjt: document.getElementById("btnAjt") as HTMLInputElement,
    btnEdt: document.getElementById("btnEdt") as HTMLInputElement,
    btnSupp: document.getElementById("btnSupp") as HTMLInputElement,

    // Le conteneur (Id HTML est nvlInter, nom dans le type est divNvlInter)
    divNvlInter: document.getElementById("nvlInter") as HTMLDivElement,

    // Section Intervention
    numInter: document.getElementById("numInter") as HTMLInputElement,
    dateInter: document.getElementById("dateInter") as HTMLInputElement,
    objetInter: document.getElementById("objetInter") as HTMLInputElement,
    observations: document.getElementById(
        "observations",
    ) as HTMLTextAreaElement,

    // Section Contrat
    numContrat: document.getElementById("numContrat") as HTMLInputElement,
    dateCreaContrat: document.getElementById(
        "dateCreaContrat",
    ) as HTMLInputElement,
    infoSite: document.getElementById("infoSite") as HTMLTextAreaElement,
    numClient: document.getElementById("numClient") as HTMLInputElement,
    nomClient: document.getElementById("nomClient") as HTMLInputElement,
    prenomClient: document.getElementById("prenomClient") as HTMLInputElement,
    telClient: document.getElementById("telClient") as HTMLInputElement,
    mailClient: document.getElementById("mailClient") as HTMLInputElement,

    // Prestations
    btnNvlPresta: document.getElementById("btnNvlPresta") as HTMLInputElement,
    btnModifPresta: document.getElementById(
        "btnModifPresta",
    ) as HTMLInputElement,
    btnSuppPresta: document.getElementById("btnSuppPresta") as HTMLInputElement,

    // Totaux
    totalHT: document.getElementById("totalHT") as HTMLInputElement,
    totalTVA: document.getElementById("totalTVA") as HTMLInputElement,
    totalTTC: document.getElementById("totalTTC") as HTMLInputElement,

    // Final
    btnValider: document.getElementById("btnValider") as HTMLInputElement,
    btnAnnuler: document.getElementById("btnAnnuler") as HTMLInputElement,
});

// Lancement
sae.init();
