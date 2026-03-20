<?php
require_once '../../includes/database.php';
header('Content-Type: application/json');

$pdo = obtenerConexion();
$sql = "SELECT COUNT(*) as total FROM productos WHERE estado = 1";
$stmt = $pdo->query($sql);
$resultado = $stmt->fetch();

echo json_encode(['total' => $resultado['total']]);
?>