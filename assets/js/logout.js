document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logoutBtn');

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      
      // Eliminar los datos del usuario guardados en localStorage
      localStorage.removeItem('usuarioActivo');
      localStorage.removeItem('logged');
      localStorage.removeItem('username');

      // Mostrar confirmación y redirigir al login
      alert('Sesión cerrada correctamente.');
      window.location.href = 'login.html';
    });
  }
});
