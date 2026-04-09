"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const classSae_1 = require("./classSae");
const sae = new classSae_1.ControleurSae({
    // Boutons principaux
    btnAjt: document.getElementById("btnAjt"),
    btnEdt: document.getElementById("btnEdt"),
    btnSupp: document.getElementById("btnSupp"),
    // Le conteneur (Id HTML est nvlInter, nom dans le type est divNvlInter)
    divNvlInter: document.getElementById("nvlInter"),
    // Section Intervention
    numInter: document.getElementById("numInter"),
    dateInter: document.getElementById("dateInter"),
    objetInter: document.getElementById("objetInter"),
    observations: document.getElementById("observations"),
    // Section Contrat
    numContrat: document.getElementById("numContrat"),
    dateCreaContrat: document.getElementById("dateCreaContrat"),
    infoSite: document.getElementById("infoSite"),
    numClient: document.getElementById("numClient"),
    nomClient: document.getElementById("nomClient"),
    prenomClient: document.getElementById("prenomClient"),
    telClient: document.getElementById("telClient"),
    mailClient: document.getElementById("mailClient"),
    // Prestations
    btnNvlPresta: document.getElementById("btnNvlPresta"),
    btnModifPresta: document.getElementById("btnModifPresta"),
    btnSuppPresta: document.getElementById("btnSuppPresta"),
    // Totaux
    totalHT: document.getElementById("totalHT"),
    totalTVA: document.getElementById("totalTVA"),
    totalTTC: document.getElementById("totalTTC"),
    // Final
    btnValider: document.getElementById("btnValider"),
    btnAnnuler: document.getElementById("btnAnnuler"),
});
// Lancement
sae.init();
