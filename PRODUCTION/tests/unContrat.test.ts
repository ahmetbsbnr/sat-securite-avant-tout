import { assertEquals } from "jsr:@std/assert/equals";
import { assertThrows } from "jsr:@std/assert/throws";
import { UnContrat } from "../src/modele/entities.ts";

// Rappel : new UnContrat(numCont, numCli, dateCont, adrSite, villeSite, cpSite, telSite)

// ======================= constructeur =======================

Deno.test("constructeur, cas valide complet", () => {
    const c = new UnContrat(1, 1, "2024-01-15", "10 rue Test", "Paris", "75001", "0102030405");
    assertEquals(c.numCont, 1);
    assertEquals(c.numCli, 1);
    assertEquals(c.dateCont, "2024-01-15");
    assertEquals(c.adrSite, "10 rue Test");
    assertEquals(c.villeSite, "Paris");
    assertEquals(c.cpSite, "75001");
    assertEquals(c.telSite, "0102030405");
});

Deno.test("constructeur, tel_site vide (non obligatoire)", () => {
    const c = new UnContrat(1, 1, "2024-01-15", "10 rue Test", "Paris", "75001", "");
    assertEquals(c.telSite, "");
});

Deno.test("constructeur, num_cont = 0 (limite)", () => {
    assertThrows(() => new UnContrat(0, 1, "2024-01-15", "10 rue Test", "Paris", "75001", ""), Error, "num_cont");
});

Deno.test("constructeur, num_cli = 0 (limite)", () => {
    assertThrows(() => new UnContrat(1, 0, "2024-01-15", "10 rue Test", "Paris", "75001", ""), Error, "num_cli");
});

Deno.test("constructeur, date_cont vide (limite)", () => {
    assertThrows(() => new UnContrat(1, 1, "", "10 rue Test", "Paris", "75001", ""), Error, "date_cont");
});

Deno.test("constructeur, date_cont invalide", () => {
    assertThrows(() => new UnContrat(1, 1, "pasunedate", "10 rue Test", "Paris", "75001", ""), Error, "date_cont");
});

Deno.test("constructeur, adr_site à 50 caractères (limite haute) acceptée", () => {
    const adr = "A".repeat(50);
    const c = new UnContrat(1, 1, "2024-01-15", adr, "Paris", "75001", "");
    assertEquals(c.adrSite, adr);
});

Deno.test("constructeur, adr_site > 50 caractères", () => {
    assertThrows(() => new UnContrat(1, 1, "2024-01-15", "A".repeat(51), "Paris", "75001", ""), Error, "adr_site");
});

Deno.test("constructeur, ville_site > 30 caractères", () => {
    assertThrows(() => new UnContrat(1, 1, "2024-01-15", "10 rue Test", "A".repeat(31), "75001", ""), Error, "ville_site");
});

Deno.test("constructeur, cp_site vide (limite)", () => {
    assertThrows(() => new UnContrat(1, 1, "2024-01-15", "10 rue Test", "Paris", "", ""), Error, "cp_site");
});

Deno.test("constructeur, cp_site avec lettre", () => {
    assertThrows(() => new UnContrat(1, 1, "2024-01-15", "10 rue Test", "Paris", "7500A", ""), Error, "cp_site");
});

Deno.test("constructeur, cp_site > 5 chiffres", () => {
    assertThrows(() => new UnContrat(1, 1, "2024-01-15", "10 rue Test", "Paris", "123456", ""), Error, "cp_site");
});

Deno.test("constructeur, tel_site non numérique", () => {
    assertThrows(() => new UnContrat(1, 1, "2024-01-15", "10 rue Test", "Paris", "75001", "12 34"), Error, "tel_site");
});

// ======================= set numCont =======================

Deno.test("set numCont, valeur valide", () => {
    const c = new UnContrat(1, 1, "2024-01-15", "10 rue Test", "Paris", "75001", "");
    c.numCont = 12;
    assertEquals(c.numCont, 12);
});

Deno.test("set numCont, limite 0", () => {
    const c = new UnContrat(1, 1, "2024-01-15", "10 rue Test", "Paris", "75001", "");
    assertThrows(() => { c.numCont = 0; }, Error, "num_cont");
});

// ======================= set dateCont =======================

Deno.test("set dateCont, valeur valide", () => {
    const c = new UnContrat(1, 1, "2024-01-15", "10 rue Test", "Paris", "75001", "");
    c.dateCont = "2025-12-31";
    assertEquals(c.dateCont, "2025-12-31");
});

Deno.test("set dateCont, invalide (limite)", () => {
    const c = new UnContrat(1, 1, "2024-01-15", "10 rue Test", "Paris", "75001", "");
    assertThrows(() => { c.dateCont = "pasunedate"; }, Error, "date_cont");
});

// ======================= set adrSite =======================

Deno.test("set adrSite, valeur valide", () => {
    const c = new UnContrat(1, 1, "2024-01-15", "10 rue Test", "Paris", "75001", "");
    c.adrSite = "5 avenue des Lilas";
    assertEquals(c.adrSite, "5 avenue des Lilas");
});

Deno.test("set adrSite, > 50 caractères (limite)", () => {
    const c = new UnContrat(1, 1, "2024-01-15", "10 rue Test", "Paris", "75001", "");
    assertThrows(() => { c.adrSite = "A".repeat(51); }, Error, "adr_site");
});

// ======================= set villeSite =======================

Deno.test("set villeSite, valeur valide", () => {
    const c = new UnContrat(1, 1, "2024-01-15", "10 rue Test", "Paris", "75001", "");
    c.villeSite = "Lyon";
    assertEquals(c.villeSite, "Lyon");
});

Deno.test("set villeSite, > 30 caractères (limite)", () => {
    const c = new UnContrat(1, 1, "2024-01-15", "10 rue Test", "Paris", "75001", "");
    assertThrows(() => { c.villeSite = "A".repeat(31); }, Error, "ville_site");
});

// ======================= set cpSite =======================

Deno.test("set cpSite, valeur valide", () => {
    const c = new UnContrat(1, 1, "2024-01-15", "10 rue Test", "Paris", "75001", "");
    c.cpSite = "69001";
    assertEquals(c.cpSite, "69001");
});

Deno.test("set cpSite, avec lettre (limite)", () => {
    const c = new UnContrat(1, 1, "2024-01-15", "10 rue Test", "Paris", "75001", "");
    assertThrows(() => { c.cpSite = "6900A"; }, Error, "cp_site");
});

// ======================= set telSite =======================

Deno.test("set telSite, vide (effacement) accepté", () => {
    const c = new UnContrat(1, 1, "2024-01-15", "10 rue Test", "Paris", "75001", "0102030405");
    c.telSite = "";
    assertEquals(c.telSite, "");
});

Deno.test("set telSite, non numérique (limite)", () => {
    const c = new UnContrat(1, 1, "2024-01-15", "10 rue Test", "Paris", "75001", "");
    assertThrows(() => { c.telSite = "01 02"; }, Error, "tel_site");
});
