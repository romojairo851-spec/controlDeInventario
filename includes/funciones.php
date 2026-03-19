<?php
// includes/funciones.php
// Funciones auxiliares para todo el sistema

/**
 * Limpia los datos de entrada para prevenir XSS
 */
function limpiarEntrada($dato) {
    $dato = trim($dato);
    $dato = stripslashes($dato);
    $dato = htmlspecialchars($dato);
    return $dato;
}

/**
 * Redirecciona a una URL específica
 */
function redireccionar($url) {
    header("Location: " . BASE_URL . $url);
    exit;
}

/**
 * Verifica si el usuario está logueado
 */
function estaLogueado() {
    return isset($_SESSION['usuario_id']);
}

/**
 * Verifica si el usuario es administrador
 */
function esAdmin() {
    return (isset($_SESSION['usuario_rol']) && $_SESSION['usuario_rol'] === 'admin');
}

/**
 * Muestra mensajes de alerta
 */
function mostrarAlerta($mensaje, $tipo = 'info') {
    $tipos = [
        'success' => 'alert-success',
        'error' => 'alert-danger',
        'warning' => 'alert-warning',
        'info' => 'alert-info'
    ];
    $clase = $tipos[$tipo] ?? 'alert-info';
    echo "<div class='alert $clase alert-dismissible fade show' role='alert'>";
    echo $mensaje;
    echo "<button type='button' class='btn-close' data-bs-dismiss='alert'></button>";
    echo "</div>";
}

/**
 * Genera un token CSRF para seguridad
 */
function generarTokenCSRF() {
    if (empty($_SESSION['token'])) {
        $_SESSION['token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['token'];
}

/**
 * Verifica el token CSRF
 */
function verificarTokenCSRF($token) {
    return isset($_SESSION['token']) && hash_equals($_SESSION['token'], $token);
}
?>
