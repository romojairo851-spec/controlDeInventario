<?php
// logout.php - Cerrar sesión
require_once 'includes/config.php';
require_once 'includes/funciones.php';

$_SESSION = [];
session_destroy();
redireccionar('/login.php');
