<?php
// modules/usuarios/obtener_usuario.php
require_once '../../includes/database.php';
header('Content-Type: application/json');

$id = $_GET['id'] ?? 0;

if (!$id) {
    echo json_encode(null);
    exit;
}

$pdo = obtenerConexion();
$sql = "SELECT id, nombre, email FROM usuarios WHERE id = ?";
$stmt = $pdo->prepare($sql);
$stmt->execute([$id]);
$usuario = $stmt->fetch();

echo json_encode($usuario);
?>
