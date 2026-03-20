<?php
require_once '../../includes/database.php';
header('Content-Type: application/json');

$id = $_GET['id'] ?? null;
if (!$id) {
    echo json_encode(['success' => false, 'message' => 'ID no proporcionado']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Datos no válidos']);
    exit;
}

$username = $data['username'] ?? '';
$fullname = $data['fullname'] ?? '';
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

if (empty($fullname) || empty($email)) {
    echo json_encode(['success' => false, 'message' => 'Los campos básicos son obligatorios']);
    exit;
}

try {
    $pdo = obtenerConexion();

    // Verificar si el email ya existe en otro usuario
    $check = $pdo->prepare("SELECT id FROM usuarios WHERE email = ? AND id != ?");
    $check->execute([$email, $id]);
    if ($check->fetch()) {
        echo json_encode(['success' => false, 'message' => 'El email ya está registrado por otro usuario']);
        exit;
    }

    if (!empty($password)) {
        $hash = password_hash($password, PASSWORD_DEFAULT);
        $sql = "UPDATE usuarios SET username = ?, nombre = ?, email = ?, password = ? WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$username, $fullname, $email, $hash, $id]);
    }
    else {
        $sql = "UPDATE usuarios SET username = ?, nombre = ?, email = ? WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$username, $fullname, $email, $id]);
    }

    echo json_encode(['success' => true, 'message' => 'Usuario actualizado correctamente']);
}
catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>