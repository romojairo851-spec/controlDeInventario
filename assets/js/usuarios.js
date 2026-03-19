document.addEventListener('DOMContentLoaded', () => {  
  
  const usuarioActivo = localStorage.getItem('usuarioActivo') || localStorage.getItem('username');
  if (!usuarioActivo) {
    window.location.href = 'login.html';
  };
  const userModal = document.getElementById('userModal');
  const openUserModalBtn = document.getElementById('openUserModalBtn');
  const closeUserModalBtn = document.getElementById('closeUserModalBtn');

  const loginModal = document.getElementById('loginModal');
  const loginForm = document.getElementById('loginForm');

  const userList = document.getElementById('userList');
  const userForm = document.getElementById('userForm');

  // Inputs formulario usuario
  const usernameInput = document.getElementById('username');
  const fullnameInput = document.getElementById('fullname');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  let editingIndex = -1; // Para editar

 
  

  // Función para cargar usuarios a tabla
  function cargarUsuarios() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    userList.innerHTML = '';
    usuarios.forEach((user, i) => {
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td>${user.username}</td>
        <td>${user.fullname}</td>
        <td>${user.email}</td>
        <td>
          <button class="btn-edit">Editar</button>
          <button class="btn-delete">Eliminar</button>
        </td>
      `;
      userList.appendChild(tr);

      tr.querySelector('.btn-edit').addEventListener('click', () => editarUsuario(i));
      tr.querySelector('.btn-delete').addEventListener('click', () => eliminarUsuario(i));
    });
  }

  // Abrir modal nuevo usuario
  openUserModalBtn.addEventListener('click', () => {
    resetForm();
    editingIndex = -1;
    document.getElementById('userModalTitle').textContent = 'Registrar Usuario';
    userModal.style.display = 'block';
  });

  closeUserModalBtn.addEventListener('click', () => {
    userModal.style.display = 'none';
  });

  window.addEventListener('click', e => {
    if (e.target === userModal) userModal.style.display = 'none';
    if (e.target === loginModal) loginModal.style.display = 'none';
  });

  // Registrar o editar usuario
  userForm.addEventListener('submit', e => {
    e.preventDefault();

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    const newUser = {
      username: usernameInput.value.trim(),
      fullname: fullnameInput.value.trim(),
      email: emailInput.value.trim(),
      password: passwordInput.value.trim()
    };

    // Validar único username
    if (usuarios.some((u, idx) => u.username === newUser.username && idx !== editingIndex)) {
      alert('Este nombre de usuario ya existe.');
      return;
    }

    if (editingIndex >= 0) {
      usuarios[editingIndex] = newUser;
    } else {
      usuarios.push(newUser);
    }

    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    alert ('Usuario registrado con exito!!')
    cargarUsuarios();
    userModal.style.display = 'none';
    resetForm();
  });

  // Editar usuario
  function editarUsuario(index) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const u = usuarios[index];
    usernameInput.value = u.username;
    fullnameInput.value = u.fullname;
    emailInput.value = u.email;
    passwordInput.value = u.password;
    editingIndex = index;
    document.getElementById('userModalTitle').textContent = 'Editar Usuario';
    userModal.style.display = 'block';
  }

  // Eliminar usuario
  function eliminarUsuario(index) {
    if (confirm('¿Está seguro que desea eliminar este usuario?')) {
      const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
      usuarios.splice(index, 1);
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      cargarUsuarios();
    }
  }

  //Búsqueda

  searchInput.addEventListener('input', () => {
    const filtro = searchInput.value.toLowerCase();
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    const filtradas = usuarios.filter(usuario =>
      usuario.username.toLowerCase().includes(filtro) ||
      usuario.fullname.toLowerCase().includes(filtro) ||
      usuario.email.toLowerCase().includes(filtro)

    );

    userList.innerHTML = '';

    filtradas.forEach((usuario, index) => {
      const row = userList.insertRow();

      row.insertCell(0).textContent = usuario.username;
      row.insertCell(1).textContent = usuario.fullname;
      row.insertCell(2).textContent = usuario.email;
      

      const actions = row.insertCell(3);

      const verBtn = document.createElement('button');
      verBtn.textContent = 'Ver';
      verBtn.className = 'btn-ver';
      verBtn.onclick = () => abrirParaEditar(index);
      actions.appendChild(verBtn);
    });
  });


  // Resetear formulario
  function resetForm() {
    userForm.reset();
  }

  
  // Inicializar lista
  cargarUsuarios();
});
