// assets/js/login.js

document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        alert('Por favor complete todos los campos');
        return;
    }
    
    try {
        // Aquí iría la petición al servidor
        // Por ahora simularemos el login
        console.log('Intentando login con:', { username, password });
        
        // Simulación de validación
        if (username === 'admin' && password === 'admin123') {
            // Redirigir al dashboard
            window.location.href = 'index.php';
        } else {
            alert('Usuario o contraseña incorrectos');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al intentar iniciar sesión');
    }
});

// Animación adicional
document.addEventListener('DOMContentLoaded', function() {
    // Crear partículas adicionales aleatorias
    const particlesContainer = document.querySelector('.particles');
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.width = (Math.random() * 5 + 1) + 'px';
        particle.style.height = particle.style.width;
        particlesContainer.appendChild(particle);
    }
});
