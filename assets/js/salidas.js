document.addEventListener('DOMContentLoaded', () => {
//Validar sesión
  const usuarioActivo = localStorage.getItem('usuarioActivo') || localStorage.getItem('username');
  if (!usuarioActivo) {
    window.location.href = 'login.html';
  };

 //Inicializar elementos
  const modal = document.getElementById('salidaModal');
  const openBtn = document.getElementById('openSalidaModalBtn');
  const closeBtn = document.getElementById('closeSalidaModalBtn');

  const verModal = document.getElementById('verDetallesModal');
  const closeVerBtn = document.getElementById('closeVerDetallesBtn');
  const contenidoDetalles = document.getElementById('contenidoDetalles');

  const form = document.getElementById('salidaForm');
  const salidaList = document.getElementById('salidaList');

  const fechaInput = document.getElementById('fecha');
  const productoSelect = document.getElementById('producto');
  const cantidadInput = document.getElementById('cantidad');
  const observacionesInput = document.getElementById('observaciones');
  const detallesList = document.getElementById('detallesList');
  const addDetalleBtn = document.getElementById('addDetalleBtn');

  const usuarioInput = document.getElementById('usuario');
  usuarioInput.value = usuarioActivo;

//Variables
  let editingIndex = -1;
  let detalles = [];

  //Abrir y cerrar modal
  openBtn.addEventListener('click', () => {
    form.reset();
    detalles = [];
    renderDetalles();
    editingIndex = -1;
    usuarioInput.value = usuarioActivo;
    modal.style.display = 'block';
  });

  closeBtn.addEventListener('click', () => modal.style.display = 'none');
  closeVerBtn.addEventListener('click', () => verModal.style.display = 'none');

  window.addEventListener('click', e => {
    if (e.target === modal) modal.style.display = 'none';
    if (e.target === verModal) verModal.style.display = 'none';
  });

//Cargar select
  function cargarSelect() {
    productoSelect.innerHTML = '<option value="">Seleccione un producto</option>';
    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    productos.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.nombre;
      opt.textContent = p.nombre;
      productoSelect.appendChild(opt);
    });
  }
  cargarSelect();

//Agregar detalle
  addDetalleBtn.addEventListener('click', () => {
    const producto = productoSelect.value;
    const cantidad = parseInt(cantidadInput.value);
    const observaciones = observacionesInput.value;

    if (!producto || !cantidad || cantidad <= 0) {
      alert('Complete producto y cantidad válidos.');
      return;
    }

    detalles.push({ producto, cantidad, observaciones });
    renderDetalles();

    productoSelect.value = '';
    cantidadInput.value = '';
  });

  function renderDetalles() {
    detallesList.innerHTML = '';
    detalles.forEach((d, idx) => {
      const li = document.createElement('li');
      li.textContent = `${d.producto} / Cantidad: ${d.cantidad}`;

      const remove = document.createElement('button');
      remove.textContent = 'X';
      remove.className = 'btn-clear';
      remove.addEventListener('click', () => {
        detalles.splice(idx, 1);
        renderDetalles();
      });

      li.appendChild(remove);
      detallesList.appendChild(li);
    });
  }

 //Guardar salida
  form.addEventListener('submit', e => {
    e.preventDefault();

    if (detalles.length === 0) {
      alert('Agregue al menos un detalle.');
      return;
    }

    const salidas = JSON.parse(localStorage.getItem('salidas')) || [];

    const nuevaSalida = {
      fecha: form.fecha.value,
      usuario: usuarioInput.value,
      observaciones: form.observaciones.value,
      detalles: JSON.parse(JSON.stringify(detalles))
    };

    // Si está editando, revertir inventario primero
    if (editingIndex >= 0) {
      revertirInventario(salidas[editingIndex]);
      salidas[editingIndex] = nuevaSalida;
      editingIndex = -1;
    } else {
      salidas.push(nuevaSalida);
    }

    localStorage.setItem('salidas', JSON.stringify(salidas));

    // Aplicar = restar stock
    aplicarSalidaInventario(nuevaSalida);

    renderSalidas(salidas);
    form.reset();
    detalles = [];
    renderDetalles();
    modal.style.display = 'none';
  });

//Actualizar inventario
  function aplicarSalidaInventario(salida) {
    let productos = JSON.parse(localStorage.getItem('productos')) || [];

    salida.detalles.forEach(det => {
      const i = productos.findIndex(p => p.nombre === det.producto);
      if (i >= 0) {
        productos[i].stock = Math.max(0, (productos[i].stock || 0) - det.cantidad);
      }
    });

    localStorage.setItem('productos', JSON.stringify(productos));
  }

  function revertirInventario(salida) {
    let productos = JSON.parse(localStorage.getItem('productos')) || [];

    salida.detalles.forEach(det => {
      const i = productos.findIndex(p => p.nombre === det.producto);
      if (i >= 0) {
        productos[i].stock = (productos[i].stock || 0) + det.cantidad;
      }
    });

    localStorage.setItem('productos', JSON.stringify(productos));
  }

 //Mostrar listado de salidas
  function renderSalidas(salidas) {
    salidaList.innerHTML = '';

    salidas.forEach((salida, index) => {
      const row = salidaList.insertRow();

      row.insertCell(0).textContent = salida.fecha;
      row.insertCell(1).textContent = salida.usuario;
      row.insertCell(2).textContent = salida.detalles.map(d => `${d.producto} (${d.cantidad})`).join(', ');
      row.insertCell(3).textContent = salida.observaciones;
      
      const actions = row.insertCell(4);

      // Ver
      const verBtn = document.createElement('button');
      verBtn.textContent = 'Ver';
      verBtn.className = 'btn-ver';
      verBtn.onclick = () => mostrarDetalles(salida.detalles);
      actions.appendChild(verBtn);

      // Editar
      const editBtn = document.createElement('button');
      editBtn.textContent = 'Editar';
      editBtn.className = 'btn-edit';
      editBtn.style.marginLeft = '0.5rem';
      editBtn.onclick = () => editarSalida(index);
      actions.appendChild(editBtn);

      // Eliminar
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Eliminar';
      deleteBtn.className = 'btn-delete';
      deleteBtn.style.marginLeft = '0.5rem';
      deleteBtn.onclick = () => eliminarSalida(index);
      actions.appendChild(deleteBtn);
    });
  }

  function mostrarDetalles(detalles) {
    contenidoDetalles.innerHTML = '';
    detalles.forEach(d => {
      const div = document.createElement('div');
      div.textContent = `${d.producto} / Cantidad: ${d.cantidad}`;
      contenidoDetalles.appendChild(div);
    });
    verModal.style.display = 'block';
  }

  function editarSalida(index) {
    const salidas = JSON.parse(localStorage.getItem('salidas')) || [];
    const salida = salidas[index];

    editingIndex = index;

    form.fecha.value = salida.fecha;
    usuarioInput.value = salida.usuario;
    form.observaciones.value = salida.observaciones;
    

    detalles = [...salida.detalles];
    renderDetalles();

    modal.style.display = 'block';
  }

  function eliminarSalida(index) {
    let salidas = JSON.parse(localStorage.getItem('salidas')) || [];

    if (!confirm('¿Eliminar esta salida?')) return;

    // Revertir inventario antes de eliminar
    revertirInventario(salidas[index]);

    salidas.splice(index, 1);
    localStorage.setItem('salidas', JSON.stringify(salidas));
    renderSalidas(salidas);
  }

  
//Cargar salidas
  renderSalidas(JSON.parse(localStorage.getItem('salidas')) || []);

//Buscar 
  searchInput.addEventListener('input', () => {
    const filtro = searchInput.value.toLowerCase();
    const salidas = JSON.parse(localStorage.getItem('salidas')) || [];

    const filtradas = salidas.filter(salida =>
      salida.fecha.toLowerCase().includes(filtro) ||
      salida.usuario.toLowerCase().includes(filtro) ||
      salida.observaciones.toLowerCase().includes(filtro) ||
      salida.detalles.map(d => d.producto.toLowerCase()).join(' ').includes(filtro)

    );

    salidaList.innerHTML = '';

    filtradas.forEach((salida, index) => {
      const row = salidaList.insertRow();

      row.insertCell(0).textContent = salida.fecha;
      row.insertCell(1).textContent = salida.usuario;
      row.insertCell(2).textContent = salida.detalles.map(d => `${d.producto} (${d.cantidad})`).join(', ');
      row.insertCell(3).textContent = salida.observaciones;
      const actions = row.insertCell(4);

      const verBtn = document.createElement('button');
      verBtn.textContent = 'Ver';
      verBtn.className = 'btn-ver';
      verBtn.onclick = () => editarSalida(index);
      actions.appendChild(verBtn);
    });
  });

});
