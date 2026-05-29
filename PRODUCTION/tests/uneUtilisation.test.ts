import { assertEquals } from "jsr:@std/assert/equals";
import { assertAlmostEquals } from "jsr:@std/assert/almost-equals";
import { assertThrows } from "jsr:@std/assert/throws";
import { UneUtilisation } from "../src/modele/entities.ts";

// Rappel : new UneUtilisation(numInter, codePrest, libPrest, tarifHt, qtePrest)

// ======================= constructeur =======================

Deno.test("constructeur, cas valide complet", () => {
    const u = new UneUtilisation(1, "MO", "Main d'oeuvre", 50, 2);
    assertEquals(u.numInter, 1);
    assertEquals(u.codePrest, "MO");
    assertEquals(u.libPrest, "Main d'oeuvre");
    assertEquals(u.tarifHt, 50);
    assertEquals(u.qtePrest, 2);
});

Deno.test("constructeur, num_interv = 0 (limite)", () => {
    assertThrows(() => new UneUtilisation(0, "MO", "Main d'oeuvre", 50, 2), Error, "num_interv");
});

Deno.test("constructeur, code_prest à 1 caractère (limite)", () => {
    assertThrows(() => new UneUtilisation(1, "A", "Main d'oeuvre", 50, 2), Error, "code_prest");
});

Deno.test("constructeur, code_prest vide (limite)", () => {
    assertThrows(() => new UneUtilisation(1, "", "Main d'oeuvre", 50, 2), Error, "code_prest");
});

Deno.test("constructeur, tarif_ht = 0 (limite)", () => {
    assertThrows(() => new UneUtilisation(1, "MO", "Main d'oeuvre", 0, 2), Error, "tarif_ht");
});

Deno.test("constructeur, tarif_ht négatif", () => {
    assertThrows(() => new UneUtilisation(1, "MO", "Main d'oeuvre", -1, 2), Error, "tarif_ht");
});

Deno.test("constructeur, qte_prest = 1 (limite basse) acceptée", () => {
    const u = new UneUtilisation(1, "MO", "Main d'oeuvre", 50, 1);
    assertEquals(u.qtePrest, 1);
});

Deno.test("constructeur, qte_prest = 0 (limite)", () => {
    assertThrows(() => new UneUtilisation(1, "MO", "Main d'oeuvre", 50, 0), Error, "qte_prest");
});

Deno.test("constructeur, qte_prest négative", () => {
    assertThrows(() => new UneUtilisation(1, "MO", "Main d'oeuvre", 50, -2), Error, "qte_prest");
});

Deno.test("constructeur, qte_prest non entière (1.5)", () => {
    assertThrows(() => new UneUtilisation(1, "MO", "Main d'oeuvre", 50, 1.5), Error, "qte_prest");
});

// ======================= get montantHt (réel → assertAlmostEquals) =======================

Deno.test("montantHt, produit tarif_ht * qte_prest (entier)", () => {
    const u = new UneUtilisation(1, "MO", "Main d'oeuvre", 50, 3);
    assertAlmostEquals(u.montantHt, 150);
});

Deno.test("montantHt, produit avec tarif réel (19.99 * 3)", () => {
    const u = new UneUtilisation(1, "MO", "Main d'oeuvre", 19.99, 3);
    assertAlmostEquals(u.montantHt, 59.97);
});

// ======================= set numInter =======================

Deno.test("set numInter, valeur valide", () => {
    const u = new UneUtilisation(1, "MO", "Main d'oeuvre", 50, 2);
    u.numInter = 9;
    assertEquals(u.numInter, 9);
});

Deno.test("set numInter, limite 0", () => {
    const u = new UneUtilisation(1, "MO", "Main d'oeuvre", 50, 2);
    assertThrows(() => { u.numInter = 0; }, Error, "num_interv");
});

// ======================= set codePrest =======================

Deno.test("set codePrest, valeur valide", () => {
    const u = new UneUtilisation(1, "MO", "Main d'oeuvre", 50, 2);
    u.codePrest = "DEP";
    assertEquals(u.codePrest, "DEP");
});

Deno.test("set codePrest, à 1 caractère (limite)", () => {
    const u = new UneUtilisation(1, "MO", "Main d'oeuvre", 50, 2);
    assertThrows(() => { u.codePrest = "A"; }, Error, "code_prest");
});

// ======================= set tarifHt =======================

Deno.test("set tarifHt, valeur valide", () => {
    const u = new UneUtilisation(1, "MO", "Main d'oeuvre", 50, 2);
    u.tarifHt = 30;
    assertEquals(u.tarifHt, 30);
});

Deno.test("set tarifHt, limite 0", () => {
    const u = new UneUtilisation(1, "MO", "Main d'oeuvre", 50, 2);
    assertThrows(() => { u.tarifHt = 0; }, Error, "tarif_ht");
});

// ======================= set qtePrest =======================

Deno.test("set qtePrest, valeur valide", () => {
    const u = new UneUtilisation(1, "MO", "Main d'oeuvre", 50, 2);
    u.qtePrest = 5;
    assertEquals(u.qtePrest, 5);
});

Deno.test("set qtePrest, met à jour montantHt", () => {
    const u = new UneUtilisation(1, "MO", "Main d'oeuvre", 20, 1);
    u.qtePrest = 4;
    assertAlmostEquals(u.montantHt, 80);
});

Deno.test("set qtePrest, limite 0", () => {
    const u = new UneUtilisation(1, "MO", "Main d'oeuvre", 50, 2);
    assertThrows(() => { u.qtePrest = 0; }, Error, "qte_prest");
});

Deno.test("set qtePrest, non entière (1.5)", () => {
    const u = new UneUtilisation(1, "MO", "Main d'oeuvre", 50, 2);
    assertThrows(() => { u.qtePrest = 1.5; }, Error, "qte_prest");
});
