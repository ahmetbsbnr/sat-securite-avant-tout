import { assertEquals } from "jsr:@std/assert/equals";
import { assertThrows } from "jsr:@std/assert/throws";
import { UnClient } from "../src/modele/entities.ts";

// Rappel des paramètres : new UnClient(numCli, civCli, nomCli, prenomCli, telCli, melCli)

// ======================= constructeur =======================

Deno.test("constructeur, cas valide complet", () => {
    const c = new UnClient(1, "M.", "Dupont", "Marie", "0612345678", "a@b.fr");
    assertEquals(c.numCli, 1);
    assertEquals(c.civCli, "M.");
    assertEquals(c.nomCli, "Dupont");
    assertEquals(c.prenomCli, "Marie");
    assertEquals(c.telCli, "0612345678");
    assertEquals(c.melCli, "a@b.fr");
});

Deno.test("constructeur, tel_cli et mel_cli vides (non obligatoires)", () => {
    const c = new UnClient(1, "Mme", "Dupont", "Marie", "", "");
    assertEquals(c.telCli, "");
    assertEquals(c.melCli, "");
});

Deno.test("constructeur, num_cli = 0 (limite)", () => {
    assertThrows(() => new UnClient(0, "M.", "Dupont", "Marie", "", ""), Error, "num_cli");
});

Deno.test("constructeur, num_cli négatif", () => {
    assertThrows(() => new UnClient(-1, "M.", "Dupont", "Marie", "", ""), Error, "num_cli");
});

Deno.test("constructeur, num_cli non entier (1.5)", () => {
    assertThrows(() => new UnClient(1.5, "M.", "Dupont", "Marie", "", ""), Error, "num_cli");
});

Deno.test("constructeur, civ_cli = Mr (limite anglo-saxonne)", () => {
    assertThrows(() => new UnClient(1, "Mr", "Dupont", "Marie", "", ""), Error, "civ_cli");
});

Deno.test("constructeur, civ_cli vide (limite)", () => {
    assertThrows(() => new UnClient(1, "", "Dupont", "Marie", "", ""), Error, "civ_cli");
});

Deno.test("constructeur, nom_cli trop court (1 caractère)", () => {
    assertThrows(() => new UnClient(1, "M.", "A", "Marie", "", ""), Error, "nom_cli");
});

Deno.test("constructeur, nom_cli trop long (21 caractères)", () => {
    assertThrows(() => new UnClient(1, "M.", "A".repeat(21), "Marie", "", ""), Error, "nom_cli");
});

Deno.test("constructeur, nom_cli avec chiffre", () => {
    assertThrows(() => new UnClient(1, "M.", "Jean2", "Marie", "", ""), Error, "nom_cli");
});

Deno.test("constructeur, prenom_cli vide (limite)", () => {
    assertThrows(() => new UnClient(1, "M.", "Dupont", "", "", ""), Error, "prenom_cli");
});

Deno.test("constructeur, tel_cli non numérique", () => {
    assertThrows(() => new UnClient(1, "M.", "Dupont", "Marie", "06ab", ""), Error, "tel_cli");
});

Deno.test("constructeur, tel_cli trop long (17 chiffres)", () => {
    assertThrows(() => new UnClient(1, "M.", "Dupont", "Marie", "1".repeat(17), ""), Error, "tel_cli");
});

Deno.test("constructeur, mel_cli invalide (sans @)", () => {
    assertThrows(() => new UnClient(1, "M.", "Dupont", "Marie", "", "pasdemail"), Error, "mel_cli");
});

Deno.test("constructeur, mel_cli trop long (51 caractères)", () => {
    assertThrows(() => new UnClient(1, "M.", "Dupont", "Marie", "", "a".repeat(46) + "@b.fr"), Error, "mel_cli");
});

// ======================= set numCli =======================

Deno.test("set numCli, valeur valide", () => {
    const c = new UnClient(1, "M.", "Dupont", "Marie", "", "");
    c.numCli = 99;
    assertEquals(c.numCli, 99);
});

Deno.test("set numCli, limite 0", () => {
    const c = new UnClient(1, "M.", "Dupont", "Marie", "", "");
    assertThrows(() => { c.numCli = 0; }, Error, "num_cli");
});

// ======================= set civCli (exemple setCivilite) =======================

Deno.test("set civCli, valeur valide \"M.\"", () => {
    const c = new UnClient(1, "Mme", "Dupont", "Marie", "", "");
    c.civCli = "M.";
    assertEquals(c.civCli, "M.");
});

Deno.test("set civCli, valeur valide \"Mme\"", () => {
    const c = new UnClient(1, "M.", "Dupont", "Marie", "", "");
    c.civCli = "Mme";
    assertEquals(c.civCli, "Mme");
});

Deno.test("set civCli, valeur valide \"Mlle\"", () => {
    const c = new UnClient(1, "M.", "Dupont", "Marie", "", "");
    c.civCli = "Mlle";
    assertEquals(c.civCli, "Mlle");
});

Deno.test("set civCli, limite \"Mr\"", () => {
    const c = new UnClient(1, "M.", "Dupont", "Marie", "", "");
    assertThrows(() => { c.civCli = "Mr"; }, Error, "civ_cli");
});

Deno.test("set civCli, limite \"\"", () => {
    const c = new UnClient(1, "M.", "Dupont", "Marie", "", "");
    assertThrows(() => { c.civCli = ""; }, Error, "civ_cli");
});

// ======================= set nomCli =======================

Deno.test("set nomCli, valeur valide", () => {
    const c = new UnClient(1, "M.", "Dupont", "Marie", "", "");
    c.nomCli = "Martin";
    assertEquals(c.nomCli, "Martin");
});

Deno.test("set nomCli, avec chiffre (limite)", () => {
    const c = new UnClient(1, "M.", "Dupont", "Marie", "", "");
    assertThrows(() => { c.nomCli = "Martin9"; }, Error, "nom_cli");
});

// ======================= set prenomCli =======================

Deno.test("set prenomCli, valeur valide", () => {
    const c = new UnClient(1, "M.", "Dupont", "Marie", "", "");
    c.prenomCli = "Jean-Pierre";
    assertEquals(c.prenomCli, "Jean-Pierre");
});

Deno.test("set prenomCli, trop court (limite)", () => {
    const c = new UnClient(1, "M.", "Dupont", "Marie", "", "");
    assertThrows(() => { c.prenomCli = "A"; }, Error, "prenom_cli");
});

// ======================= set telCli =======================

Deno.test("set telCli, vide (effacement) accepté", () => {
    const c = new UnClient(1, "M.", "Dupont", "Marie", "0612345678", "");
    c.telCli = "";
    assertEquals(c.telCli, "");
});

Deno.test("set telCli, non numérique (limite)", () => {
    const c = new UnClient(1, "M.", "Dupont", "Marie", "", "");
    assertThrows(() => { c.telCli = "06ab"; }, Error, "tel_cli");
});

// ======================= set melCli =======================

Deno.test("set melCli, valeur valide", () => {
    const c = new UnClient(1, "M.", "Dupont", "Marie", "", "");
    c.melCli = "test@exemple.fr";
    assertEquals(c.melCli, "test@exemple.fr");
});

Deno.test("set melCli, invalide (limite)", () => {
    const c = new UnClient(1, "M.", "Dupont", "Marie", "", "");
    assertThrows(() => { c.melCli = "pasdemail"; }, Error, "mel_cli");
});
