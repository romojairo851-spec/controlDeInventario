// assets/js/logout.js

document.getElementById('logoutBtn').addEventListener('click', function() {
    if (confirm('¿Está seguro de cerrar sesión?')) {
        // Redirigir usando la ruta base para que funcione en cualquier nivel
        window.location.href = '/sistemaDeInventario/logout.php';
    }
});