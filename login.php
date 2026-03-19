<?php
// login.php - Página de inicio de sesión
require_once 'includes/config.php';
require_once 'includes/funciones.php';
require_once 'includes/database.php';

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = limpiarEntrada($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';
          
    if (empty($username) || empty($password)) {
        $error = 'Todos los campos son obligatorios';
    } else {
        // Buscar por email (asumimos que username es el email)
        $usuario = loginUsuario($username, $password);
        
        if ($usuario) {
            $_SESSION['usuario_id'] = $usuario['id'];
            $_SESSION['usuario_nombre'] = $usuario['nombre'];
            $_SESSION['usuario_email'] = $usuario['email'];
            $_SESSION['usuario_rol'] = $usuario['rol'];
            
            redireccionar('/index.php');
        } else {
            $error = 'Usuario o contraseña incorrectos';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="assets/css/styles.css">
    <title>Inicio de Sesión</title>
</head>
<body>
    <div class="dog-animation-container">
        <div class="running-dog">
            <div class="tail"></div>
            <div class="body"></div>
            <div class="head">
                <div class="ear"></div>
            </div>
            <div class="leg back-leg-1"></div>
            <div class="leg back-leg-2"></div>
            <div class="leg front-leg-1"></div>
            <div class="leg front-leg-2"></div>
        </div>
    </div>

    <div class="particles">
        <div class="particle" style="left:10%; animation-delay: 0s;"></div>
        <div class="particle" style="left:30%; animation-delay: 1s;"></div>
        <div class="particle" style="left:50%; animation-delay: 2s;"></div>
        <div class="particle" style="left:70%; animation-delay: 3s;"></div>
        <div class="particle" style="left:90%; animation-delay: 4s;"></div>
        <div class="particle" style="left:10%; animation-delay: 5s;"></div>
        <div class="particle" style="left:30%; animation-delay: 6s;"></div>
        <div class="particle" style="left:50%; animation-delay: 7s;"></div>
        <div class="particle" style="left:70%; animation-delay: 8s;"></div>
        <div class="particle" style="left:90%; animation-delay: 9s;"></div>
    </div>
    
    <div class="login-container">
        <img src="assets/img/logo.jpeg" alt="Logo del sistema" class="login-logo">

        <h1>Inicio de Sesión</h1>
        
        <?php if ($error): ?>
            <div style="background-color: #f8d7da; color: #721c24; padding: 10px; border-radius: 5px; margin-bottom: 15px;">
                <?php echo $error; ?>
            </div>
        <?php endif; ?>
        
        <form method="POST" action="" id="loginForm">
            <div>
                <label for="username">Nombre</label>
                <input type="text" id="username" name="username" placeholder="admin" required>
            </div>
            <div>
                <label for="password">Contraseña</label>
                <input type="password" id="password" name="password" placeholder="admin123" required>
            </div>
                       
            <button type="submit">Ingresar</button>         
 
            <div class="login-footer">
                <p>© <span>Sistema de Inventario</span> — versión 1.0</p>
                <p><span>Prueba admin --> admin123</span></p>
            </div>               
        </form>
    </div>
    <script defer src="assets/js/login.js"></script>
</body>
</html>
