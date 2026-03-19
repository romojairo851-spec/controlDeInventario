<?php
// includes/config.php
// Configuración principal del sistema

// Configuración de la base de datos
define('DB_HOST', 'localhost');
define('DB_NAME', 'inventario_db');
define('DB_USER', 'root');
define('DB_PASS', ''); // En XAMPP Linux suele estar vacío
define('DB_CHARSET', 'utf8mb4');

// Configuración del sistema
define('BASE_URL', 'http://localhost/sistema-inventario');
define('NOMBRE_SISTEMA', 'Sistema de Gestión de Inventario');
define('VERSION', '1.0.0');

// Configuración de zona horaria
date_default_timezone_set('America/Bogota');

// Configuración de sesión
session_name('inventario_session');
session_start();

// Configuración de errores (desactivar en producción)
error_reporting(E_ALL);
ini_set('display_errors', 1);
?>

