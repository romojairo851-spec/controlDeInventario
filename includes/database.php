<?php
// includes/database.php
// Conexión a la base de datos y funciones CRUD

require_once __DIR__ . '/config.php';

/**
 * Obtiene una conexión a la base de datos
 */
function obtenerConexion() {
    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $pdo = new PDO($dsn, DB_USER, DB_PASS);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        return $pdo;
    } catch (PDOException $e) {
        die("Error de conexión: " . $e->getMessage());
    }
}

// ========== FUNCIONES DE USUARIOS ==========

/**
 * Verifica las credenciales de login
 */
function loginUsuario($email, $password) {
    $pdo = obtenerConexion();
    $sql = "SELECT id, nombre, email, password, rol FROM usuarios WHERE email = :email AND estado = 1";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    
    $usuario = $stmt->fetch();
    
    if ($usuario && password_verify($password, $usuario['password'])) {
        return $usuario;
    }
    return false;
}

/**
 * Registra un nuevo usuario
 */
function registrarUsuario($nombre, $email, $password, $rol = 'bodeguero') {
    $pdo = obtenerConexion();
    $hash = password_hash($password, PASSWORD_DEFAULT);
    
    $sql = "INSERT INTO usuarios (nombre, email, password, rol) VALUES (:nombre, :email, :password, :rol)";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':nombre', $nombre);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':password', $hash);
    $stmt->bindParam(':rol', $rol);
    
    return $stmt->execute();
}

/**
 * Obtiene todos los usuarios
 */
function obtenerUsuarios() {
    $pdo = obtenerConexion();
    $sql = "SELECT id, nombre, email, rol, fecha_creacion FROM usuarios ORDER BY id DESC";
    $stmt = $pdo->query($sql);
    return $stmt->fetchAll();
}
?>
