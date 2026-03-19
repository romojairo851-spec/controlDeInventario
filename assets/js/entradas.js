
document.addEventListener('DOMContentLoaded', () => {

  //Validar sesión
  const usuarioActivo = localStorage.getItem('usuarioActivo') || localStorage.getItem('username');
  if (!usuarioActivo) {
    window.location.href = 'login.html';
  };

//Inicializar elementos
  const modal = document.getElementById('entryModal');
  const openBtn = document.getElementById('openEntryModalBtn');
  const closeBtn = document.getElementById('closeEntryModalBtn');

  const form = document.getElementById('entryForm');
  const entryList = document.getElementById('entryList');

  const fechaInput = document.getElementById('date');
  const usuarioInput = document.getElementById('user');
  const productoSelect = document.getElementById('product');
  const proveedorSelect = document.getElementById('provider');
  const cantidadInput = document.getElementById('quantity');

  const addDetalleBtn = document.getElementById('addDetailBtn');
  const detallesList = document.getElementById('detailsList');

  const searchInput = document.getElementById('searchInput');

  //Variables
  let detalles = [];
  let editIndex = -1;

  usuarioInput.value = usuarioActivo;

 //Cargar selects
  function cargarSelects() {
    productoSelect.innerHTML = '<option value="">Seleccione un producto</option>';
    proveedorSelect.innerHTML = '<option value="">Seleccione un proveedor</option>';

    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    productos.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.nombre;
      opt.textContent = p.nombre;
      productoSelect.appendChild(opt);
    });

    const proveedores = JSON.parse(localStorage.getItem('proveedores')) || [];
    proveedores.forEach(pr => {
      const opt = document.createElement('option');
      opt.value = pr.name;
      opt.textContent = pr.name;
      proveedorSelect.appendChild(opt);
    });
  }

  cargarSelects();

  //Renderizar detalles
  function renderDetalles() {
    detallesList.innerHTML = '';

    detalles.forEach((d, index) => {
      const li = document.createElement('li');
      li.textContent = `${d.producto} / ${d.proveedor} / Cant: ${d.cantidad}`;

      const btnRemove = document.createElement('button');
      btnRemove.textContent = 'X';
      btnRemove.className = 'btn-clear';
      btnRemove.onclick = () => {
        detalles.splice(index, 1);

        if (detalles.length === 0) proveedorSelect.disabled = false;

        renderDetalles();
      };

      li.appendChild(btnRemove);
      detallesList.appendChild(li);
    });
  }

 //Añadir detalles de entrada
  addDetalleBtn.addEventListener('click', () => {
    const producto = productoSelect.value;
    const proveedor = proveedorSelect.value;
    const cantidad = Number(cantidadInput.value);

    if (!producto || !proveedor || cantidad <= 0) {
      alert('Complete los datos del detalle');
      return;
    }

    if (detalles.length === 0) {
      detalles.push({ producto, proveedor, cantidad });
      proveedorSelect.disabled = true;
    } else {
      if (proveedor !== detalles[0].proveedor) {
        alert('Todos los productos deben ser del mismo proveedor');
        return;
      }
      detalles.push({ producto, proveedor, cantidad });
    }

    productoSelect.value = '';
    cantidadInput.value = '';
    renderDetalles();
  });

 //Actualizar inventario

  // SUMAR (cuando se crea o edita entrada nueva)
  function aplicarEntradaInventario(entrada) {
    let productos = JSON.parse(localStorage.getItem('productos')) || [];

    entrada.detalles.forEach(det => {
      const i = productos.findIndex(p => p.nombre === det.producto);
      if (i >= 0) productos[i].stock = (productos[i].stock || 0) + det.cantidad;
    });

    localStorage.setItem('productos', JSON.stringify(productos));
  }

  // RESTAR (cuando se elimina o antes de editar)
  function revertirEntradaInventario(entrada) {
    let productos = JSON.parse(localStorage.getItem('productos')) || [];

    entrada.detalles.forEach(det => {
      const i = productos.findIndex(p => p.nombre === det.producto);
      if (i >= 0) productos[i].stock = Math.max(0, (productos[i].stock || 0) - det.cantidad);
    });

    localStorage.setItem('productos', JSON.stringify(productos));
  }

 //Editar
  function abrirParaEditar(index) {
    const entradas = JSON.parse(localStorage.getItem('entradas')) || [];
    const entrada = entradas[index];

    editIndex = index;

    fechaInput.value = entrada.fecha;
    usuarioInput.value = entrada.usuario;

    detalles = structuredClone(entrada.detalles);
    proveedorSelect.value = detalles[0].proveedor;
    proveedorSelect.disabled = true;

    renderDetalles();

    modal.style.display = 'block';
  }

//Eliminar
  function eliminarEntrada(index) {
    const entradas = JSON.parse(localStorage.getItem('entradas')) || [];

    if (!confirm('¿Eliminar esta entrada?')) return;

    revertirEntradaInventario(entradas[index]);
    entradas.splice(index, 1);

    localStorage.setItem('entradas', JSON.stringify(entradas));

    cargarEntradas();
  }

//Guardar
  form.addEventListener('submit', e => {
    e.preventDefault();

    if (detalles.length === 0) {
      alert('Debe agregar al menos un detalle');
      return;
    }

    const entradas = JSON.parse(localStorage.getItem('entradas')) || [];

    const nuevaEntrada = {
      fecha: fechaInput.value,
      usuario: usuarioInput.value,
      detalles: structuredClone(detalles)
    };

    if (editIndex >= 0) {
      // revertir stock anterior
      revertirEntradaInventario(entradas[editIndex]);

      // reemplazar
      entradas[editIndex] = nuevaEntrada;

      // aplicar nuevo stock
      aplicarEntradaInventario(nuevaEntrada);

      editIndex = -1;
    } else {
      entradas.push(nuevaEntrada);
      aplicarEntradaInventario(nuevaEntrada);
    }

    localStorage.setItem('entradas', JSON.stringify(entradas));

    form.reset();
    proveedorSelect.disabled = false;
    detalles = [];

    renderDetalles();
    cargarEntradas();

    modal.style.display = 'none';
  });

 //Cargar lista de entradas del localStorage
  function cargarEntradas() {
    entryList.innerHTML = '';

    const entradas = JSON.parse(localStorage.getItem('entradas')) || [];

    entradas.forEach((entrada, index) => {
      const row = entryList.insertRow();

      row.insertCell(0).textContent = entrada.fecha;
      row.insertCell(1).textContent = entrada.usuario;
      row.insertCell(2).textContent = entrada.detalles[0].proveedor;
      row.insertCell(3).textContent = entrada.detalles.map(d => `${d.producto} (${d.cantidad})`).join(', ');

      const actions = row.insertCell(4);

      // Ver
      const verBtn = document.createElement('button');
      verBtn.textContent = 'Ver';
      verBtn.className = 'btn-ver';
      verBtn.onclick = () => abrirParaEditar(index);
      actions.appendChild(verBtn);

      // Editar
      const editBtn = document.createElement('button');
      editBtn.textContent = 'Editar';
      editBtn.className = 'btn-edit';
      editBtn.style.marginLeft = '0.5rem';
      editBtn.onclick = () => abrirParaEditar(index);
      actions.appendChild(editBtn);

      // Eliminar
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Eliminar';
      deleteBtn.className = 'btn-delete';
      deleteBtn.style.marginLeft = '0.5rem';
      deleteBtn.onclick = () => eliminarEntrada(index);
      actions.appendChild(deleteBtn);
    });
  }

  cargarEntradas();

//Nueva entrada
  openBtn.addEventListener('click', () => {
    editIndex = -1;
    detalles = [];
    proveedorSelect.disabled = false;

    form.reset();
    renderDetalles();

    usuarioInput.value = usuarioActivo;

    modal.style.display = 'block';
  });

  closeBtn.addEventListener('click', () => (modal.style.display = 'none'));

  window.addEventListener('click', e => {
    if (e.target === modal) modal.style.display = 'none';
  });
  
//Buscar entrada
  searchInput.addEventListener('input', () => {
    const filtro = searchInput.value.toLowerCase();
    const entradas = JSON.parse(localStorage.getItem('entradas')) || [];

    const filtradas = entradas.filter(entrada =>
      entrada.fecha.toLowerCase().includes(filtro) ||
      entrada.usuario.toLowerCase().includes(filtro) ||
      entrada.detalles.map(d => d.producto.toLowerCase()).join(' ').includes(filtro)
    );

    entryList.innerHTML = '';

    filtradas.forEach((entrada, index) => {
      const row = entryList.insertRow();

      row.insertCell(0).textContent = entrada.fecha;
      row.insertCell(1).textContent = entrada.usuario;
      row.insertCell(2).textContent = entrada.detalles[0].proveedor;
      row.insertCell(3).textContent = entrada.detalles.map(d => `${d.producto} (${d.cantidad})`).join(', ');

      const actions = row.insertCell(4);

      const verBtn = document.createElement('button');
      verBtn.textContent = 'Ver';
      verBtn.className = 'btn-ver';
      verBtn.onclick = () => abrirParaEditar(index);
      actions.appendChild(verBtn);
    });
  });

});

