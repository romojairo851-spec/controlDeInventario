<?php
// index.php - Dashboard página principal
require_once 'includes/config.php';
require_once 'includes/funciones.php';
require_once 'includes/database.php';

// Verificar si el usuario está logueado
if (!estaLogueado()) {
  redireccionar('/login.php');
}

// Obtener nombre del usuario
$nombreUsuario = $_SESSION['usuario_nombre'] ?? 'Usuario';

// Obtener productos con bajo stock
function obtenerProductosBajoStock()
{
  $pdo = obtenerConexion();
  $sql = "SELECT id, nombre, stock, stock_minimo 
            FROM productos 
            WHERE stock <= stock_minimo AND estado = 1
            ORDER BY stock ASC";
  $stmt = $pdo->query($sql);
  return $stmt->fetchAll();
}

$productosBajoStock = obtenerProductosBajoStock();
?>
<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Dashboard de Productos</title>
  <link rel="stylesheet" href="assets/css/styles.css" />
</head>

<body>
  <aside class="sidebar">
    <nav>
      <ul>
        <li><a class="nav-btn active" href="index.php">Dashboard</a></li>
        <li><a class="nav-btn" href="modules/usuarios/usuarios.php">Usuarios</a></li>
        <li><a class="nav-btn" href="modules/productos/productos.php">Productos</a></li>
        <li><a class="nav-btn" href="modules/proveedores/proveedores.php">Proveedores</a></li>
        <li><a class="nav-btn" href="modules/entradas/entradas.php">Entradas</a></li>
        <li><a class="nav-btn" href="modules/salidas/salidas.php">Salidas</a></li>
        <li><a class="nav-btn" href="modules/reportes/reportes.php">Reportes</a></li>
      </ul>
    </nav>
    <button id="logoutBtn" class="logout-btn">Cerrar sesión</button>
  </aside>

  <div class="dashboard" role="main" aria-label="Dashboard de productos">
    <img class="login-logo" src="assets/img/logo.jpeg" alt="">
    <h1>Bienvenido,
      <?php echo $nombreUsuario; ?>
    </h1>
    <h2>Productos con bajo Stock</h2>

    <div>
      <?php if (empty($productosBajoStock)): ?>
      <p class="alert alert-success">No hay productos con stock bajo.</p>
      <?php
else: ?>
      <ul class="listaBajoStock" id="bajoStockList">
        <?php foreach ($productosBajoStock as $producto): ?>
        <li class="stock-item <?php echo $producto['stock'] == 0 ? 'stock-cero' : 'stock-bajo'; ?>">
          <span class="producto-nombre">
            <?php echo htmlspecialchars($producto['nombre']); ?>
          </span>
          <span class="producto-stock">
            Stock:
            <?php echo $producto['stock']; ?>
            (Mínimo:
            <?php echo $producto['stock_minimo']; ?>)
          </span>
          <a href="modules/productos/productos.php?editar=<?php echo $producto['id']; ?>"
            class="btn-small">Reabastecer</a>
        </li>
        <?php
  endforeach; ?>
      </ul>
      <?php
endif; ?>
    </div>

    <div class="dashboard-stats">
      <div class="stat-card">
        <h3>Total Productos</h3>
        <p class="stat-number" id="totalProductos">Cargando...</p>
      </div>
      <h3>Stock Bajo</h3>
      <p class="stat-number" id="totalBajoStock">
        <?php echo count($productosBajoStock); ?>
      </p>
    </div>
  </div>
  </div>

  <script src="assets/js/logout.js"></script>
  <script src="assets/js/dashboard.js"></script>
</body>

</html>