<?php
// modules/usuarios/listar_usuarios.php
require_once '../../includes/database.php';
header('Content-Type: application/json');

$pdo = obtenerConexion();
$sql = "SELECT id, nombre as username, nombre as fullname, email FROM usuarios ORDER BY id DESC";
$stmt = $pdo->query($sql);
$usuarios = $stmt->fetchAll();

echo json_encode($usuarios);
?>
