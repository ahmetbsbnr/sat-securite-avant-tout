<?php
// Sécurité : cette API exécute les requêtes SQL envoyées par le client.
// Elle est réservée à un usage local : requêtes distantes refusées et
// CORS limité aux pages servies depuis localhost (quel que soit le port).
if (!in_array($_SERVER['REMOTE_ADDR'] ?? '', ['127.0.0.1', '::1'], true)) {
	http_response_code(403);
	exit('{}');
}
$origine = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origine !== '') {
	if (!preg_match('#^https?://(localhost|127\.0\.0\.1)(:\d+)?$#', $origine)) {
		http_response_code(403);
		exit('{}');
	}
	header("Access-Control-Allow-Origin: " . $origine);
	header("Vary: Origin");
}
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(0); }
// à installer sur votre serveur local
// dans dossier web
// puis dans /ihm/IHM_API/

	require_once ("./MyConnexionBdd.class.php");

	function bdOpen ($host, $port, $bdname, $user, $pwd, $charset, $driver)
	{
		return MyConnexion::getInstance($host, $port, $bdname, $user, $pwd, $charset, $driver);
	}

	function resultat ($sp)
	{
		$data = [];
	    $t = [];
	    while ($row = $sp->fetch(PDO::FETCH_ASSOC))
		{
			$t[]=$row;
		}
		$data['resultat'] = $t;

	    return json_encode($data);
	}
try {
	if (!isset($_POST['bd'])) {
		throw new RuntimeException("Paramètre bd manquant.");
	}

	$bdparams = json_decode($_POST['bd']);
	if (!$bdparams) {
		throw new RuntimeException("Paramètre bd invalide.");
	}

	$interrogation = !isset($_POST['req']) || ($_POST['req'] != 'manipulation');
	$bdd = bdOpen($bdparams->host, $bdparams->port, $bdparams->bdname, $bdparams->user, $bdparams->pwd, $bdparams->charset, $bdparams->driver);

	if (!isset($_POST['sp']) || $_POST['sp'] === '') {
		echo json_encode([]);
		exit(0);
	}

	$lesparams = json_decode(urldecode($_POST['params']));
	$sp = $bdd->prepare($_POST['sp']);
	if ($lesparams != "") {
	   for($i=0;$i<count($lesparams);$i++) {
			$unparam = trim($lesparams[$i]);
			if ( ($unparam == '') && ($interrogation) ) {
				$unparam = 'zzz';
			}
			$sp->bindValue($i+1, $unparam, PDO::PARAM_STR);
		}
	}

	$sp->execute();
	echo(resultat($sp));
} catch (Throwable $e) {
	http_response_code(500);
	echo json_encode([
		'erreur' => $e->getMessage(),
	]);
}

?>
