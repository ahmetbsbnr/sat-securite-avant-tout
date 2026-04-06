<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if (!isset($_POST['bd']) || !isset($_POST['sp'])) {
    http_response_code(400);
    echo json_encode(["resultat" => [], "error" => "Paramètres manquants ('bd' ou 'sp')"]);
    exit;
}

$bd = json_decode($_POST['bd'], true);
$sp = trim((string) $_POST['sp']);
// $params can come as a JSON string, which sqlWeb.ts encodes twice (JSON stringify then urlencode)
$params = [];
if (isset($_POST['params'])) {
    $decodedParams = json_decode($_POST['params'], true);
    if (is_array($decodedParams)) {
        $params = $decodedParams;
    }
}

if (!is_array($bd)) {
    http_response_code(400);
    echo json_encode(["resultat" => [], "error" => "Paramètre 'bd' invalide"]);
    exit;
}

$requiredBdKeys = ['driver', 'host', 'port', 'bdname', 'charset', 'user', 'pwd'];
foreach ($requiredBdKeys as $key) {
    if (!array_key_exists($key, $bd)) {
        http_response_code(400);
        echo json_encode(["resultat" => [], "error" => "Configuration BDD incomplète: clé '$key' manquante"]);
        exit;
    }
}

if ($sp === '') {
    http_response_code(400);
    echo json_encode(["resultat" => [], "error" => "Requête SQL vide"]);
    exit;
}

try {
    $dsn = $bd['driver'] . ":host=" . $bd['host'] . ";port=" . $bd['port'] . ";dbname=" . $bd['bdname'] . ";charset=" . $bd['charset'];
    $pdo = new PDO($dsn, $bd['user'], $bd['pwd']);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    $stmt = $pdo->prepare($sp);
    
    // Bind parameters if any
    if (is_array($params)) {
        foreach ($params as $k => $v) {
            if (is_int($k)) {
                $stmt->bindValue($k + 1, $v);
            } else {
                $name = (string) $k;
                if ($name !== '' && $name[0] !== ':') {
                    $name = ':' . $name;
                }
                $stmt->bindValue($name, $v);
            }
        }
    }

    $stmt->execute();

    if (preg_match('/^\s*(SELECT|SHOW|DESCRIBE|EXPLAIN|CALL)/i', $sp)) {
        $resultat = $stmt->fetchAll();
    } else {
        $resultat = []; // Insert, update, delete return no rowset usually
    }

    echo json_encode(["resultat" => $resultat, "error" => null]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(["resultat" => [], "error" => $e->getMessage()]);
}
?>
