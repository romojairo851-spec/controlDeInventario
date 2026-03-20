// Cargar estadísticas del dashboard
async function cargarEstadisticas() {
    try {
        // Total productos
        const responseProductos = await fetch('modules/productos/total_productos.php');
        const totalProductos = await responseProductos.json();
        document.getElementById('totalProductos').textContent = totalProductos.total || 0;

    } catch (error) {
        console.error('Error al cargar estadísticas:', error);
        document.getElementById('totalProductos').textContent = 'Error';
    }
}

// Cargar al iniciar
document.addEventListener('DOMContentLoaded', cargarEstadisticas);