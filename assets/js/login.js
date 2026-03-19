// Código corregido y con creación de usuario por defecto

const form = document.getElementById("loginForm");

// ============================
// 1. Crear usuarios por defecto si no existen
// ============================
if (!localStorage.getItem("usuarios")) {
  const defaultUser = [
    {
      username: "admin",
      fullname: "Administrador",
      email: "admin@gmail.com",
      password: "admin123"
    }
  ];

  localStorage.setItem("usuarios", JSON.stringify(defaultUser));
  console.log("Usuarios por defecto creados en login.js");
}

// ============================
// 2. Validar login
// ============================
if (!form) {
  console.error("No se encontró el formulario con id 'loginForm'.");
} else {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const inputUser = document.getElementById("username");
    const inputPass = document.getElementById("password");

    if (!inputUser || !inputPass) {
      alert("No se encontraron los campos de usuario o contraseña.");
      return;
    }

    const user = inputUser.value.trim();
    const pass = inputPass.value.trim();

    if (user === "" || pass === "") {
      alert("Por favor complete todos los campos.");
      return;
    }

    // Cargar usuarios del localStorage
    let usuarios = [];
    const usuariosJSON = localStorage.getItem("usuarios");

    if (usuariosJSON) {
      try {
        usuarios = JSON.parse(usuariosJSON);

        if (!Array.isArray(usuarios)) {
          console.warn("La lista de usuarios no es un array. Se reiniciará.");
          usuarios = [];
        }

      } catch (err) {
        console.error("Error al leer usuarios:", err);
        usuarios = [];
      }
    }

    // Buscar coincidencia
    const usuarioValido = usuarios.find(
      u => u.username === user && u.password === pass
    );

    if (!usuarioValido) {
      alert("Usuario o contraseña incorrectos.");
      return;
    }

    // Guardar sesión
    localStorage.setItem("username", user);
    localStorage.setItem("logged", "true");
    localStorage.setItem("login_time", new Date().toLocaleString());

    alert(`Bienvenido, ${usuarioValido.username}`);

    // Redirigir
    window.location.href = "dashboard.html";
  });
}
