// assets/js/usuarios.js

// Elementos del DOM
const modal = document.getElementById('userModal');
const openModalBtn = document.getElementById('openUserModalBtn');
const closeModalBtn = document.getElementById('closeUserModalBtn');
const userForm = document.getElementById('userForm');
const userList = document.getElementById('userList');
const searchInput = document.getElementById('searchInput');
const modalTitle = document.getElementById('userModalTitle');

let editingId = null;

// Abrir modal para registrar
openModalBtn.addEventListener('click', () => {
    editingId = null;
    modalTitle.textContent = 'Registrar Usuario';
    userForm.reset();
    modal.style.display = 'block';
});

// Cerrar modal
closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Cerrar modal si se hace clic fuera
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Manejar envío del formulario
userForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        username: document.getElementById('username').value,
        fullname: document.getElementById('fullname').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };
    
    const url = editingId 
        ? `../../modules/usuarios/actualizar_usuario.php?id=${editingId}`
        : '../../modules/usuarios/guardar_usuario.php';
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert(editingId ? 'Usuario actualizado' : 'Usuario registrado');
            modal.style.display = 'none';
            cargarUsuarios();
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al guardar el usuario');
    }
});

// Cargar usuarios
async function cargarUsuarios() {
    try {
        const response = await fetch('../../modules/usuarios/listar_usuarios.php');
        const usuarios = await response.json();
        
        userList.innerHTML = '';
        
        usuarios.forEach(usuario => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${usuario.username || usuario.nombre}</td>
                <td>${usuario.fullname || usuario.nombre_completo || usuario.nombre}</td>
                <td>${usuario.email}</td>
                <td>
                    <button class="btn-edit" onclick="editarUsuario(${usuario.id})">Editar</button>
                    <button class="btn-delete" onclick="eliminarUsuario(${usuario.id})">Eliminar</button>
                </td>
            `;
            userList.appendChild(row);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

// Editar usuario
window.editarUsuario = async (id) => {
    try {
        const response = await fetch(`../../modules/usuarios/obtener_usuario.php?id=${id}`);
        const usuario = await response.json();
        
        document.getElementById('username').value = usuario.username || usuario.nombre;
        document.getElementById('fullname').value = usuario.fullname || usuario.nombre_completo || usuario.nombre;
        document.getElementById('email').value = usuario.email;
        document.getElementById('password').value = ''; // No cargar contraseña
        
        editingId = id;
        modalTitle.textContent = 'Editar Usuario';
        modal.style.display = 'block';
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar el usuario');
    }
};

// Eliminar usuario
window.eliminarUsuario = async (id) => {
    if (!confirm('¿Está seguro de eliminar este usuario?')) return;
    
    try {
        const response = await fetch(`../../modules/usuarios/eliminar_usuario.php?id=${id}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('Usuario eliminado');
            cargarUsuarios();
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar el usuario');
    }
};

// Búsqueda en tiempo real
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const rows = userList.getElementsByTagName('tr');
    
    Array.from(rows).forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});

// Cargar usuarios al iniciar
cargarUsuarios();