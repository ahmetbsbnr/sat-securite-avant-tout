import { assertEquals } from "jsr:@std/assert/equals";
import { assertThrows } from "jsr:@std/assert/throws";
import { UnePrestation } from "../src/modele/entities.ts";

// Rappel : new UnePrestation(codePrest, libPrest, tarifHt)

// ======================= constructeur =======================

Deno.test("constructeur, cas valide complet", () => {
    const p = new UnePrestation("MO", "Main d'oeuvre", 50);
    assertEquals(p.codePrest, "MO");
    assertEquals(p.libPrest, "Main d'oeuvre");
    assertEquals(p.tarifHt, 50);
});

Deno.test("constructeur, code_prest à 6 caractères (limite haute) accepté", () => {
    const p = new UnePrestation("ABCDEF", "Main d'oeuvre", 50);
    assertEquals(p.codePrest, "ABCDEF");
});

Deno.test("constructeur, code_prest à 1 caractère (limite)", () => {
    assertThrows(() => new UnePrestation("A", "Main d'oeuvre", 50), Error, "code_prest");
});

Deno.test("constructeur, code_prest à 7 caractères (limite)", () => {
    assertThrows(() => new UnePrestation("ABCDEFG", "Main d'oeuvre", 50), Error, "code_prest");
});

Deno.test("constructeur, code_prest vide (limite)", () => {
    assertThrows(() => new UnePrestation("", "Main d'oeuvre", 50), Error, "code_prest");
});

Deno.test("constructeur, lib_prest à 5 caractères (limite basse) accepté", () => {
    const lib = "A".repeat(5);
    const p = new UnePrestation("MO", lib, 50);
    assertEquals(p.libPrest, lib);
});

Deno.test("constructeur, lib_prest à 4 caractères (limite)", () => {
    assertThrows(() => new UnePrestation("MO", "ABCD", 50), Error, "lib_prest");
});

Deno.test("constructeur, lib_prest à 51 caractères (limite)", () => {
    assertThrows(() => new UnePrestation("MO", "A".repeat(51), 50), Error, "lib_prest");
});

Deno.test("constructeur, tarif_ht = 0.01 (limite basse) accepté", () => {
    const p = new UnePrestation("MO", "Main d'oeuvre", 0.01);
    assertEquals(p.tarifHt, 0.01);
});

Deno.test("constructeur, tarif_ht = 0 (limite)", () => {
    assertThrows(() => new UnePrestation("MO", "Main d'oeuvre", 0), Error, "tarif_ht");
});

Deno.test("constructeur, tarif_ht négatif", () => {
    assertThrows(() => new UnePrestation("MO", "Main d'oeuvre", -5), Error, "tarif_ht");
});

Deno.test("constructeur, tarif_ht = NaN", () => {
    assertThrows(() => new UnePrestation("MO", "Main d'oeuvre", NaN), Error, "tarif_ht");
});

// ======================= set codePrest =======================

Deno.test("set codePrest, valeur valide", () => {
    const p = new UnePrestation("MO", "Main d'oeuvre", 50);
    p.codePrest = "DEP";
    assertEquals(p.codePrest, "DEP");
});

Deno.test("set codePrest, à 1 caractère (limite)", () => {
    const p = new UnePrestation("MO", "Main d'oeuvre", 50);
    assertThrows(() => { p.codePrest = "A"; }, Error, "code_prest");
});

// ======================= set libPrest =======================

Deno.test("set libPrest, valeur valide", () => {
    const p = new UnePrestation("MO", "Main d'oeuvre", 50);
    p.libPrest = "Déplacement standard";
    assertEquals(p.libPrest, "Déplacement standard");
});

Deno.test("set libPrest, trop court (limite)", () => {
    const p = new UnePrestation("MO", "Main d'oeuvre", 50);
    assertThrows(() => { p.libPrest = "ABCD"; }, Error, "lib_prest");
});

// ======================= set tarifHt =======================

Deno.test("set tarifHt, valeur valide", () => {
    const p = new UnePrestation("MO", "Main d'oeuvre", 50);
    p.tarifHt = 75.5;
    assertEquals(p.tarifHt, 75.5);
});

Deno.test("set tarifHt, limite 0", () => {
    const p = new UnePrestation("MO", "Main d'oeuvre", 50);
    assertThrows(() => { p.tarifHt = 0; }, Error, "tarif_ht");
});

Deno.test("set tarifHt, négatif", () => {
    const p = new UnePrestation("MO", "Main d'oeuvre", 50);
    assertThrows(() => { p.tarifHt = -1; }, Error, "tarif_ht");
});
