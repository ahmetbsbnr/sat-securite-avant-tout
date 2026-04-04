import * as APIsql from "../modele/sqlWeb.js"

type TEnv = {
	baseHtml: string,
	baseApi: string,
	dbHost: string,
	dbPort: string,
	dbName: string,
	dbUser: string,
	dbPass: string,
	dbCharset: string,
}

// Choix simple pour les étudiants : LOCAL ou distant
const MODE: "LOCAL" | "distant" = "LOCAL";

const ENV: Record<"LOCAL" | "distant", TEnv> = {
	LOCAL: {
		baseHtml: "http://localhost:8080/vue/",
		baseApi: "http://localhost:8080/api/",
		dbHost: "127.0.0.1",
		dbPort: "3306",
		dbName: "sae",
		dbUser: "root",
		dbPass: "",
		dbCharset: "utf8",
	},
	distant: {
		baseHtml: "http://localhost/sat/",
		baseApi: "http://localhost/sat/",
		dbHost: "localhost",
		dbPort: "3306",
		dbName: "VOTRE_BASE",
		dbUser: "VOTRE_USER",
		dbPass: "VOTRE_MDP",
		dbCharset: "utf8",
	},
};

const config = ENV[MODE];
APIsql.sqlWeb.init(config.baseHtml, config.baseApi)

class Connexion {
	constructor() {
		this.init();
	}
	init(): void {
		APIsql.sqlWeb.bdOpen(
			config.dbHost,
			config.dbPort,
			config.dbName,
			config.dbUser,
			config.dbPass,
			config.dbCharset
		);
	}
}
let connexion = new Connexion;

export { connexion, APIsql }
