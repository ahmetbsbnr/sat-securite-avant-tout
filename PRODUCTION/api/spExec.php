<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if (!isset($_POST['bd']) || !isset($_POST['sp'])) {
    echo json_encode(["resultat" => [], "error" => "Paramètres manquants ('bd' ou 'sp')"]);
    exit;
}

$bd = json_decode($_POST['bd'], true);
$sp = $_POST['sp'];
// $params can come as a JSON string, which sqlWeb.ts encodes twice (JSON stringify then urlencode)
$params = isset($_POST['params']) ? json_decode($_POST['params'], true) : [];

try {
    $dsn = $bd['driver'] . ":host=" . $bd['host'] . ";port=" . $bd['port'] . ";dbname=" . $bd['bdname'] . ";charset=" . $bd['charset'];
    $pdo = new PDO($dsn, $bd['user'], $bd['pwd']);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    $stmt = $pdo->prepare($sp);
    
    // Bind parameters if any
    if (is_array($params)) {
        foreach ($params as $k => $v) {
            $stmt->bindValue($k + 1, $v);
        }
    }

    $stmt->execute();

    if (preg_match('/^\s*(SELECT|SHOW|DESCRIBE|EXPLAIN|CALL)/i', $sp)) {
        $resultat = $stmt->fetchAll();
    } else {
        $resultat = []; // Insert, update, delete return no rowset usually
    }

    echo json_encode(["resultat" => $resultat]);
} catch (PDOException $e) {
    echo json_encode(["resultat" => [], "error" => $e->getMessage()]);
}
?>
