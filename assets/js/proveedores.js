  document.addEventListener('DOMContentLoaded', () => {
  const usuarioActivo = localStorage.getItem('usuarioActivo') || localStorage.getItem('username');
  if (!usuarioActivo) {
    window.location.href = 'login.html';
  };
  const modal = document.getElementById('providerModal');
  const openBtn = document.getElementById('openModalBtn');
  const closeBtn = document.getElementById('closeModalBtn');
  const form = document.getElementById('providerForm');
  //const providerList = document.getElementById('providerList');
  const providerTableBody = document.querySelector('#providerList tbody');
  const confirmDeleteBtn = document.getElementById('confirmDelete');
  const cancelDeleteBtn = document.getElementById('cancelDelete');

  let proveedores = [];
  let editingRow = null;
  let codigoProveedorId =null;
  let deletingProveedorId =null;
  
// Cargar proveedores 
function loadProveedores(){
  const storedProveedores = localStorage.getItem('proveedores')
  if (storedProveedores) {
    try {
      proveedores = JSON.parse(storedProveedores);      
    }catch (e){
      console.error("Error al cargar proveedores del localStorage",e)
      proveedores=[];
    }
  }
  renderProveedores();
}


  // Abrir modal para nuevo proveedor
  openBtn.addEventListener('click', () => {
    form.reset();
    editingRow = null;
    modal.style.display = 'block';
  });

  // Cerrar modal
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });
  // cerra modal al dar click fuera
  window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
     if (e.target === deleteModal) deleteModal.style.display = 'none';    
  });

// Guardar o actualizar proveedores
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = form.name.value.trim();
    const address = form.address.value.trim();
    const phone = form.phone.value.trim();
    const email = form.email.value.trim();
    const contact = form.contact.value.trim();
    const id = editingRow ?? Date.now() + name;

    if (!name || !address || !phone || !email || !contact) {
      alert('Por favor rellene todos los campos');
      return;
    }

    const newProveedor = { id, name, address, phone, email, contact};

    if (editingRow) {
      // Editar fila existente
      proveedores = proveedores.map(p => p.id == editingRow ? newProveedor : p);
    } else {
      // Agregar nueva fila
      proveedores.push(newProveedor);
      alert('Proveedor registrado correctamente.')

    };

      providerModal.style.display= 'none';
      renderProveedores();
    
  });

//Mostrar proveedores en la tabla

function renderProveedores(){
  providerTableBody.innerHTML ='';

  //Guardar en el localStorage
  localStorage.setItem('proveedores', JSON.stringify(proveedores));

  proveedores.forEach(proveedor => {
    const row =document.createElement('tr');
    row.innerHTML= `
      <td>${proveedor.id}</td>
      <td>${proveedor.name}</td>
      <td>${proveedor.address}</td>
      <td>${proveedor.phone}</td>
      <td>${proveedor.email}</td>
      <td>${proveedor.contact}</td>
      <td>
          <button class="btn-edit" data-id="${proveedor.id}">Editar</button>
          <button class="btn-delete" data-id="${proveedor.id}">Eliminar</button>
      </td>
    `;
   providerTableBody.appendChild(row);
  });

  //Asignar eventos a los botones
  document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => editProveedor(btn.dataset.id));
    });
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => confirmDelete(btn.dataset.id));
    });

  }    

    //Editar proveedor
function editProveedor(id) {
    const proveedor = proveedores.find(p => p.id == id); 
    if (!proveedor) return;

    editingRow = proveedor.id;
    document.getElementById('modalTitle').textContent = 'Editar Prooveedor';
    document.getElementById('name').value = proveedor.name;
    document.getElementById('address').value = proveedor.address;
    document.getElementById('phone').value = proveedor.phone;
    document.getElementById('email').value = proveedor.email;
    document.getElementById('contact').value = proveedor.contact;
    
    providerModal.style.display = 'block';
}

//Confirmar eliminación
function confirmDelete(id) {
    deletingProveedorId = id;
    deleteModal.style.display = 'block';
}

//Eliminar proveedor
confirmDeleteBtn.addEventListener('click', () => {
    proveedores = proveedores.filter(p => p.id != deletingProveedorId);
    deleteModal.style.display = 'none';
    renderProveedores();
    alert('Proveedor eliminado correctamente.');
});

cancelDeleteBtn.addEventListener('click', () => {
    deleteModal.style.display = 'none';
});

//Buscar
document.getElementById('searchInput').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    document.querySelectorAll('#providerList tbody tr').forEach(row => {
        const nombre = row.children[1].textContent.toLowerCase();
        row.style.display = nombre.includes(searchTerm) ? '' : 'none';
    });
});

loadProveedores();
  });
