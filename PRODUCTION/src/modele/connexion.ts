import * as APIsql from "../modele/sqlWeb.js"

APIsql.sqlWeb.init("http://localhost/sat/","http://localhost/sat/")

class Connexion {
	constructor() {
		this.init();
	}
	init():void {
		// à adapter avec voter nom de base et vos identifiants de connexion
		APIsql.sqlWeb.bdOpen('localhost','3306','bdsat', 'appli','***SUPPRIME***', 'utf8');
	}
}
let connexion = new Connexion;

export {connexion, APIsql}
