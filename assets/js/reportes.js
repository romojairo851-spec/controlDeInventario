document.addEventListener('DOMContentLoaded', () => {
  //Validar sesión
  const usuarioActivo = localStorage.getItem('usuarioActivo') || localStorage.getItem('username');
  if (!usuarioActivo) {
    window.location.href = 'login.html';
  };
  const form = document.getElementById('formReportes');
  const tablaReporte = document.getElementById('tablaReporte');
  const theadReporte = document.getElementById('theadReporte');
  const tbodyReporte = document.getElementById('tbodyReporte');

  const btnExportXLS = document.getElementById('btnExportXLS');
  const btnExportCSV = document.getElementById('btnExportCSV');
  const btnExportPDF = document.getElementById('btnExportPDF');

  let datosReporte = [];
  let columnasReporte = [];

  form.addEventListener('submit', e => {
    e.preventDefault();

    const tipo = form.tipoReporte.value;
    const fechaInicio = form.fechaInicio.value;
    const fechaFin = form.fechaFin.value;
    const productoFiltro = form.productoFiltro.value.trim().toLowerCase();

    if (!tipo) {
      alert('Seleccione un tipo de reporte');
      return;
    }

    // Obtener datos reales de localStorage
    const datosBase = obtenerDatosLocalStorage(tipo);

    if (!datosBase) {
      alert("No hay datos para este reporte.");
      return;
    }

    // Filtrar según fecha y producto
    let datosFiltrados = datosBase.filter(item => {
      let cumple = true;

      if (fechaInicio && item.fecha && item.fecha < fechaInicio) cumple = false;
      if (fechaFin && item.fecha && item.fecha > fechaFin) cumple = false;

      // filtro por nombre de producto
      if (productoFiltro && item.producto) {
        if (!item.producto.toLowerCase().includes(productoFiltro)) cumple = false;
      }

      return cumple;
    });

    columnasReporte = columnasPorTipo(tipo);
    datosReporte = datosFiltrados;

    mostrarTabla(columnasReporte, datosReporte);

    const hayDatos = datosReporte.length > 0;
    btnExportXLS.disabled = !hayDatos;
    btnExportCSV.disabled = !hayDatos;
    btnExportPDF.disabled = !hayDatos;
  });

//Mostrar tabla
  function mostrarTabla(columnas, datos) {
    theadReporte.innerHTML = '';
    const trHead = document.createElement('tr');

    columnas.forEach(col => {
      const th = document.createElement('th');
      th.textContent = col;
      trHead.appendChild(th);
    });

    theadReporte.appendChild(trHead);

    tbodyReporte.innerHTML = '';

    datos.forEach(row => {
      const tr = document.createElement('tr');
      columnas.forEach(col => {
        const key = col.toLowerCase().replace(" ", "_");
        const td = document.createElement('td');
        td.textContent = row[key] ?? '';
        tr.appendChild(td);
      });
      tbodyReporte.appendChild(tr);
    });

    tablaReporte.style.display = 'table';
  }

//Columnas por tipo
  function columnasPorTipo(tipo) {
    switch (tipo) {
      case 'entradas':
        return ['Fecha', 'Usuario', 'Producto', 'Cantidad'];
      case 'salidas':
        return ['Fecha', 'Usuario', 'Producto', 'Cantidad', 'Observaciones'];
      case 'productos':
        return ['Nombre', 'Precio', 'Stock'];
      case 'proveedores':
        return ['Nombre', 'Dirección', 'Teléfono', 'Email', 'Contacto'];
      case 'stock_bajo':
        return ['Nombre', 'Stock', 'Stock mínimo'];
      default:
        return [];
    }
  }

 //Obtener datos del localStorage
  function obtenerDatosLocalStorage(tipo) {
    switch (tipo) {

     //Entradas
      case 'entradas': {
        const entradas = JSON.parse(localStorage.getItem('entradas')) || [];
        let lista = [];

        entradas.forEach(e => {
          e.detalles.forEach(d => {
            lista.push({
              fecha: e.fecha,
              usuario: e.usuario,
              producto: d.producto,
              cantidad: d.cantidad
            });
          });
        });

        return lista;
      }

      //Salidas
      case 'salidas': {
        const salidas = JSON.parse(localStorage.getItem('salidas')) || [];
        let lista = [];

        salidas.forEach(s => {
          s.detalles.forEach(d => {
            lista.push({
              fecha: s.fecha,
              usuario: s.usuario,
              producto: d.producto,
              cantidad: d.cantidad,
              observaciones: s.observaciones ?? ""
            });
          });
        });

        return lista;
      }

     //Productos
      case 'productos': {
        const productos = JSON.parse(localStorage.getItem('productos')) || [];
        return productos.map(p => ({
          nombre: p.nombre,
          precio: p.precio,
          stock: p.stock
        }));
      }

     //Proveedores
      case 'proveedores': {
        const proveedores = JSON.parse(localStorage.getItem('proveedores')) || [];
        return proveedores.map(p => ({
          nombre: p.name,
          dirección: p.address,
          teléfono: p.phone,
          email: p.email,
          contacto: p.contact
        }));
      }

    //Bajo Stock
      case 'stock_bajo': {
        const productos = JSON.parse(localStorage.getItem('productos')) || [];
        return productos
          .filter(p => p.stock <= p.minimo)
          .map(p => ({
            nombre: p.nombre,
            stock: p.stock,
            stock_mínimo: p.minimo
          }));
      }

      default:
        return [];
    }
  }


  //Exportar a XLXS
  btnExportXLS.addEventListener('click', () => {
    if (datosReporte.length === 0) return;

    const wb = XLSX.utils.book_new();
    const data = [columnasReporte];

    datosReporte.forEach(row => {
      data.push(
        columnasReporte.map(col =>
          row[col.toLowerCase().replace(" ", "_")] ?? ''
        )
      );
    });

    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
    XLSX.writeFile(wb, 'reporte.xlsx');
  });


 //Exportar a CSV
  btnExportCSV.addEventListener('click', () => {
    if (datosReporte.length === 0) return;

    const data = [columnasReporte];

    datosReporte.forEach(row => {
      data.push(columnasReporte.map(col => row[col.toLowerCase().replace(" ", "_")] ?? ''));
    });

    const ws = XLSX.utils.aoa_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(ws);
    descargarArchivo(csv, 'reporte.csv', 'text/csv;charset=utf-8;');
  });

  function descargarArchivo(contenido, nombre, tipo) {
    const blob = new Blob([contenido], { type: tipo });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombre;
    a.click();
    URL.revokeObjectURL(url);
  }

//Exportar a PDF
  btnExportPDF.addEventListener('click', () => {
    if (datosReporte.length === 0) return;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let y = 10;
    const lineHeight = 7;

    doc.setFontSize(14);
    doc.text('Reporte', 10, y);
    y += lineHeight * 2;

    doc.setFontSize(10);

    columnasReporte.forEach((col, i) => {
      doc.text(col, 10 + i * 40, y);
    });

    y += lineHeight;

    datosReporte.forEach(row => {
      columnasReporte.forEach((col, i) => {
        const key = col.toLowerCase().replace(" ", "_");
        doc.text(String(row[key] ?? ''), 10 + i * 40, y);
      });
      y += lineHeight;

      if (y > 280) {
        doc.addPage();
        y = 10;
      }
    });

    doc.save('reporte.pdf');
  });

});
