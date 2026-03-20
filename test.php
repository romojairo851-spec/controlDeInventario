<?php
require_once 'includes/database.php';

$pdo = obtenerConexion();
echo "Conexión exitosa a la base de datos<br>";

$stmt = $pdo->query("SELECT COUNT(*) as total FROM usuarios");
$row = $stmt->fetch();
echo "Total usuarios: " . $row['total'] . "<br>";

$stmt = $pdo->query("SELECT * FROM usuarios");
while ($row = $stmt->fetch()) {
    echo "Usuario: " . $row['nombre'] . " - " . $row['email'] . "<br>";
}
?>