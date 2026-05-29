import { assertEquals } from "jsr:@std/assert/equals";
import { assertThrows } from "jsr:@std/assert/throws";
import { UneIntervention } from "../src/modele/entities.ts";

// Rappel : new UneIntervention(numInter, dateInter, objetInter, obsInter, numCont)

// ======================= constructeur =======================

Deno.test("constructeur, cas valide complet", () => {
    const i = new UneIntervention(1, "2024-01-01", "Visite", "RAS", 1);
    assertEquals(i.numInter, 1);
    assertEquals(i.dateInter, "2024-01-01");
    assertEquals(i.objetInter, "Visite");
    assertEquals(i.obsInter, "RAS");
    assertEquals(i.numCont, 1);
});

Deno.test("constructeur, date_interv vide (non obligatoire)", () => {
    const i = new UneIntervention(1, "", "Visite", "RAS", 1);
    assertEquals(i.dateInter, "");
});

Deno.test("constructeur, num_interv = 0 (limite)", () => {
    assertThrows(() => new UneIntervention(0, "", "Visite", "RAS", 1), Error, "num_interv");
});

Deno.test("constructeur, num_interv non entier (1.5)", () => {
    assertThrows(() => new UneIntervention(1.5, "", "Visite", "RAS", 1), Error, "num_interv");
});

Deno.test("constructeur, date_interv invalide si renseignée", () => {
    assertThrows(() => new UneIntervention(1, "xx", "Visite", "RAS", 1), Error, "date_interv");
});

Deno.test("constructeur, objet_interv à 300 caractères (limite haute) accepté", () => {
    const objet = "A".repeat(300);
    const i = new UneIntervention(1, "", objet, "RAS", 1);
    assertEquals(i.objetInter, objet);
});

Deno.test("constructeur, objet_interv > 300 caractères", () => {
    assertThrows(() => new UneIntervention(1, "", "A".repeat(301), "RAS", 1), Error, "objet_interv");
});

Deno.test("constructeur, obs_interv > 300 caractères", () => {
    assertThrows(() => new UneIntervention(1, "", "Visite", "A".repeat(301), 1), Error, "obs_interv");
});

Deno.test("constructeur, num_cont = 0 (limite)", () => {
    assertThrows(() => new UneIntervention(1, "", "Visite", "RAS", 0), Error, "num_cont");
});

// ======================= set numInter =======================

Deno.test("set numInter, valeur valide", () => {
    const i = new UneIntervention(1, "", "Visite", "RAS", 1);
    i.numInter = 42;
    assertEquals(i.numInter, 42);
});

Deno.test("set numInter, limite 0", () => {
    const i = new UneIntervention(1, "", "Visite", "RAS", 1);
    assertThrows(() => { i.numInter = 0; }, Error, "num_interv");
});

// ======================= set dateInter =======================

Deno.test("set dateInter, valeur valide", () => {
    const i = new UneIntervention(1, "", "Visite", "RAS", 1);
    i.dateInter = "2025-06-15";
    assertEquals(i.dateInter, "2025-06-15");
});

Deno.test("set dateInter, vide (effacement) accepté", () => {
    const i = new UneIntervention(1, "2024-01-01", "Visite", "RAS", 1);
    i.dateInter = "";
    assertEquals(i.dateInter, "");
});

Deno.test("set dateInter, invalide (limite)", () => {
    const i = new UneIntervention(1, "", "Visite", "RAS", 1);
    assertThrows(() => { i.dateInter = "pasunedate"; }, Error, "date_interv");
});

// ======================= set objetInter =======================

Deno.test("set objetInter, à 300 caractères (limite haute)", () => {
    const i = new UneIntervention(1, "", "Visite", "RAS", 1);
    const objet = "B".repeat(300);
    i.objetInter = objet;
    assertEquals(i.objetInter, objet);
});

Deno.test("set objetInter, > 300 caractères (limite)", () => {
    const i = new UneIntervention(1, "", "Visite", "RAS", 1);
    assertThrows(() => { i.objetInter = "B".repeat(301); }, Error, "objet_interv");
});

// ======================= set obsInter =======================

Deno.test("set obsInter, valeur valide", () => {
    const i = new UneIntervention(1, "", "Visite", "RAS", 1);
    i.obsInter = "Nouvelle observation";
    assertEquals(i.obsInter, "Nouvelle observation");
});

Deno.test("set obsInter, > 300 caractères (limite)", () => {
    const i = new UneIntervention(1, "", "Visite", "RAS", 1);
    assertThrows(() => { i.obsInter = "B".repeat(301); }, Error, "obs_interv");
});

// ======================= set numCont =======================

Deno.test("set numCont, valeur valide", () => {
    const i = new UneIntervention(1, "", "Visite", "RAS", 1);
    i.numCont = 7;
    assertEquals(i.numCont, 7);
});

Deno.test("set numCont, limite 0", () => {
    const i = new UneIntervention(1, "", "Visite", "RAS", 1);
    assertThrows(() => { i.numCont = 0; }, Error, "num_cont");
});
