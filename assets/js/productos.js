document.addEventListener('DOMContentLoaded', () => {

//Validar sesión
  const usuarioActivo = localStorage.getItem('usuarioActivo') || localStorage.getItem('username');
  if (!usuarioActivo) {
    window.location.href = 'login.html';
  };

//Inicializar elementos
const closeBtn = document.getElementById('closeModalBtn');
const openModalBtn = document.getElementById('openModalBtn');
const productModal = document.getElementById('productModal');
const deleteModal = document.getElementById('deleteModal');
const closeButtons = document.querySelectorAll('.close');
const productForm = document.getElementById('productForm');
const productTableBody = document.querySelector('#productList tbody');
const confirmDeleteBtn = document.getElementById('confirmDelete');
const cancelDeleteBtn = document.getElementById('cancelDelete');

//Variables
let products = [];
let editingProductId = null;
let deletingProductId = null;

//Cargar productos
function loadProducts() {
    const storedProducts = localStorage.getItem('productos');
    if (storedProducts) {
        try {
            // Intenta parsear los datos de localStorage. Si no existen, queda como arreglo vacío.
            products = JSON.parse(storedProducts);
        } catch (e) {
            console.error("Error al cargar productos de localStorage:", e);
            products = [];
        }
    }
    renderProducts();
}

// Abrir y cerrar modal
openModalBtn.addEventListener('click', () => {
    editingProductId = null;
    productForm.reset();
    productModal.style.display = 'block';
});

  closeBtn.addEventListener('click', () => {
    productModal.style.display = 'none';
  });
  
// Cerrar modal al hacer clic fuera
window.addEventListener('click', (e) => {
    if (e.target === productModal) productModal.style.display = 'none';
    if (e.target === deleteModal) deleteModal.style.display = 'none';
});

//Guardar o actualizar producto
productForm.addEventListener('submit', (e) => {
    e.preventDefault();


    const id = editingProductId ?? Date.now();
    const nombre = document.getElementById('name').value.trim();
    const precio = parseFloat(document.getElementById('price').value) || 0;
    const minimo = parseInt(document.getElementById('minStock').value) || 0;
    const stock = parseInt(document.getElementById('stock').value) || 0;    
    const activo = document.querySelector('input[name="activo"]:checked')?.value || 'NO';

    if (!nombre) {
        alert('Por favor ingresa el nombre del producto.');
        return;
    }

    const newProduct = { id, nombre, precio, minimo, stock, activo };

    if (editingProductId) {
        // Editar producto existente
        products = products.map(p => p.id == editingProductId ? newProduct : p);
        alert('Producto actualizado correctamente.');
    } else {
        // Agregar nuevo producto
        products.push(newProduct);
        alert('Producto agregado correctamente.');
    }

    productModal.style.display = 'none';
    renderProducts();
});

// Mostrar productos 
function renderProducts() {
    productTableBody.innerHTML = '';

    //Guardar los productos en localStorage
    localStorage.setItem('productos', JSON.stringify(products));

    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.nombre}</td>
            <td>${product.precio}</td>            
            <td>${product.minimo}</td>
            <td>${product.stock}</td>
            <td>${product.activo}</td>
            <td>
                <button class="btn-edit" data-id="${product.id}">Editar</button>
                <button class="btn-delete" data-id="${product.id}">Eliminar</button>
            </td>
        `;
        productTableBody.appendChild(row);
    });

    // Asignar eventos a los botones
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => editProduct(btn.dataset.id));
    });
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => confirmDelete(btn.dataset.id));
    });
}


//Editar producto
function editProduct(id) {
    const product = products.find(p => p.id == id); 
    if (!product) return;

    editingProductId = product.id;
    document.getElementById('modalTitle').textContent = 'Editar Producto';
    document.getElementById('name').value = product.nombre;
    document.getElementById('price').value = product.precio;
    document.getElementById('stock').value = product.stock;
    document.getElementById('minStock').value = product.minimo;

    if (product.activo === 'SI') {
        document.getElementById('activoSi').checked = true;
    } else {
        document.getElementById('activoNo').checked = true;
    }

    productModal.style.display = 'block';
}

//Confimar eliminar
function confirmDelete(id) {
    deletingProductId = id;
    deleteModal.style.display = 'block';
}

//Eliminar producto
confirmDeleteBtn.addEventListener('click', () => {
    products = products.filter(p => p.id != deletingProductId);
    deleteModal.style.display = 'none';
    renderProducts();
    alert('Producto eliminado correctamente.');
});

cancelDeleteBtn.addEventListener('click', () => {
    deleteModal.style.display = 'none';
});

// Buscar
document.getElementById('searchInput').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    document.querySelectorAll('#productList tbody tr').forEach(row => {
        const nombre = row.children[1].textContent.toLowerCase();
        row.style.display = nombre.includes(searchTerm) ? '' : 'none';
    });
});

loadProducts();
});