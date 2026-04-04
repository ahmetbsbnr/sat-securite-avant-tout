import * as APIsql from "../modele/sqlWeb.js"

//APIsql.sqlWeb.init("http://localhost/sat/","http://localhost/sat/")


//LOCAL
APIsql.sqlWeb.init("http://localhost:8080/vue/", "http://localhost:8080/api/")

class Connexion {
	constructor() {
		this.init();
	}
	init(): void {
		// à adapter avec voter nom de base et vos identifiants de connexion
		// APIsql.sqlWeb.bdOpen('localhost','3306','nombase', 'appli','***SUPPRIME***', 'utf8');

		//LOCAL
		APIsql.sqlWeb.bdOpen('127.0.0.1', '3306', 'sae', 'root', '', 'utf8');
	}
}
let connexion = new Connexion;

export { connexion, APIsql }
