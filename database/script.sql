-- database/script.sql

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS inventario_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE inventario_db;

-- ============================================
-- TABLA: usuarios
-- ============================================
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'bodeguero', 'vendedor') DEFAULT 'bodeguero',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Insertar usuario administrador por defecto (admin / admin123)
INSERT INTO usuarios (username, nombre, email, password, rol) 
VALUES ('admin', 'Administrador del Sistema', 'admin@ejemplo.com', '$2y$10$bjXfwDlgQ3PdcGE.wukDue.zt.TDcbY5eY7aZUXURaX9zoJ0pyoZK', 'admin');

-- ============================================
-- TABLA: proveedores
-- ============================================
CREATE TABLE proveedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    contacto VARCHAR(100),
    telefono VARCHAR(20),
    email VARCHAR(100),
    direccion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================
-- TABLA: productos
-- ============================================
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    stock_minimo INT DEFAULT 5,
    estado BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_codigo (codigo),
    INDEX idx_nombre (nombre)
) ENGINE=InnoDB;

-- ============================================
-- TABLA: entradas
-- ============================================
CREATE TABLE entradas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_proveedor INT,
    fecha_entrada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_proveedor) REFERENCES proveedores(id) ON DELETE SET NULL,
    INDEX idx_fecha (fecha_entrada)
) ENGINE=InnoDB;

-- ============================================
-- TABLA: detalle_entradas
-- ============================================
CREATE TABLE detalle_entradas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_entrada INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    FOREIGN KEY (id_entrada) REFERENCES entradas(id) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES productos(id),
    INDEX idx_entrada (id_entrada),
    INDEX idx_producto (id_producto)
) ENGINE=InnoDB;

-- ============================================
-- TABLA: salidas
-- ============================================
CREATE TABLE salidas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    fecha_salida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    observaciones TEXT,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    INDEX idx_fecha (fecha_salida)
) ENGINE=InnoDB;

-- ============================================
-- TABLA: detalle_salidas
-- ============================================
CREATE TABLE detalle_salidas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_salida INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    FOREIGN KEY (id_salida) REFERENCES salidas(id) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES productos(id),
    INDEX idx_salida (id_salida),
    INDEX idx_producto (id_producto)
) ENGINE=InnoDB;

-- ============================================
-- TABLA: reportes
-- ============================================

CREATE TABLE reportes (
    id_reporte INT AUTO_INCREMENT PRIMARY KEY,    
    tipo_reporte ENUM('Entradas', 'Salidas', 'Productos', 'Proveedores', 'StockBajo'),
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,    
    tipo_exportacion ENUM('PDF', 'EXCEL', 'CSV') NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
