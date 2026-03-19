// assets/js/logout.js

document.getElementById('logoutBtn').addEventListener('click', function() {
    if (confirm('¿Está seguro de cerrar sesión?')) {
        // Redirigir al logout.php que procesará la destrucción de la sesión
        window.location.href = '../../logout.php';
    }
});