<?php
require_once '../../includes/config.php';
require_once '../../includes/funciones.php';
require_once '../../includes/database.php';

// Verificar si el usuario está logueado
if (!estaLogueado()) {
  redireccionar('/login.php');
}
?>
<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Gestión de Usuarios</title>
  <link rel="stylesheet" href="../../assets/css/styles.css" />
</head>

<body>
  <aside class="sidebar">
    <nav>
      <ul>
        <li><a class="nav-btn" href="../../index.php">Dashboard</a></li>
        <li><a class="nav-btn active" href="usuarios.php">Usuarios</a></li>
        <li><a class="nav-btn" href="../productos/productos.php">Productos</a></li>
        <li><a class="nav-btn" href="../proveedores/proveedores.php">Proveedores</a></li>
        <li><a class="nav-btn" href="../entradas/entradas.php">Entradas</a></li>
        <li><a class="nav-btn" href="../salidas/salidas.php">Salidas</a></li>
        <li><a class="nav-btn" href="../reportes/reportes.php">Reportes</a></li>
      </ul>
      <button id="logoutBtn" class="logout-btn">Cerrar sesión</button>
    </nav>
  </aside>

  <main class="main-content">
    <img class="login-logo" src="../../assets/img/logo.jpeg" alt="">
    <h1>Gestión de Usuarios</h1>

    <div class="search-container">
      <input type="text" id="searchInput" placeholder="Buscar usuario...">
      <button id="openUserModalBtn" class="btn-primary">Registrar Usuario</button>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>Usuario</th>
          <th>Nombre Completo</th>
          <th>Email</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody id="userList">
        <!-- Usuarios cargados vía JavaScript -->
      </tbody>
    </table>

    <!-- Modal registro/edición usuario -->
    <div id="userModal" class="modal">
      <div class="modal-content">
        <span id="closeUserModalBtn" class="modal-close">&times;</span>
        <h2 id="userModalTitle">Registrar Usuario</h2>
        <form id="userForm">
          <label for="username">Usuario:</label>
          <input type="text" id="username" name="username" required minlength="3" />

          <label for="fullname">Nombre Completo:</label>
          <input type="text" id="fullname" name="fullname" required />

          <label for="email">Email:</label>
          <input type="email" id="email" name="email" required />

          <label for="password">Contraseña:</label>
          <input type="password" id="password" name="password" required minlength="6" />

          <button type="submit" class="btn-primary">Guardar</button>
        </form>
      </div>
    </div>

    <script src="../../assets/js/usuarios.js"></script>
    <script src="../../assets/js/logout.js"></script>
  </main>
</body>

</html>