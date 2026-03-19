document.addEventListener('DOMContentLoaded', () => {
  //validar sesión
  const usuarioActivo = localStorage.getItem('usuarioActivo') || localStorage.getItem('username');
  if (!usuarioActivo) {
    window.location.href = 'login.html';
  };

  //Cargar productos
    const productosJSON = localStorage.getItem('productos');
    console.log('productosJSON:', productosJSON);

let productos = [];
if (productosJSON) {
  productos = JSON.parse(productosJSON);
  console.log('productos parseados:', productos);
} else {
  console.log('No hay productos guardados en localStorage');
}

    
  // Elementos en el dashboard donde mostraremos información
  const totalProductosElem = document.getElementById('totalProductos');
  const bajoStockListElem = document.getElementById('bajoStockList');

  // Calcular cantidad total (sumando stock)
  const totalProductos = productos.reduce((acc, prod) => {
    const stockActual = Number(prod.stock);
    return acc + (isNaN(stockActual) ? 0 : stockActual);
  }, 0);

   // Filtrar productos con stock bajo (stock < stock mínimo)
  const productosBajoStock = productos.filter(prod => {
  const stockActual = Number(prod.stock);
  const stockMin = Number(prod.minimo ?? prod['stock mínimo'] ?? 0);

  console.log(`Producto: ${prod.nombre || prod.name}, Stock: ${stockActual}, Minimo: ${stockMin}`);

  if (isNaN(stockActual) || isNaN(stockMin)) {
    console.warn('Stock o mínimo no son números válidos para el producto:', prod);
    return false;
  }

  return stockActual < stockMin;
});


if (bajoStockListElem) {
  bajoStockListElem.innerHTML = ''; // limpiar listado

  if (productosBajoStock.length === 0) {
    bajoStockListElem.innerHTML = '<li>Sin productos con stock bajo</li>';
  } else {
    productosBajoStock.forEach(prod => {
      const li = document.createElement('li');

      const spanNombre = document.createElement('span');
      spanNombre.className = 'product-name';
      spanNombre.textContent = `${prod.nombre ?? prod.name ?? 'Producto desconocido'} - Stock: ${prod.stock}`;

      const btnIr = document.createElement('button');
      btnIr.className = 'ir-productos-btn';
      btnIr.textContent = 'Ir a Productos';

      // Al hacer click ir a la página productos.html (o el módulo correspondiente)
      btnIr.addEventListener('click', () => {
        window.location.href = 'productos.html';
      });

      li.appendChild(spanNombre);
      li.appendChild(btnIr);

      bajoStockListElem.appendChild(li);
    });
  }
}
});