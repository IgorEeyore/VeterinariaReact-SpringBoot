CREATE TABLE servicios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    precio DOUBLE NOT NULL,
    descripcion_corta VARCHAR(255),
    descripcion_larga TEXT,
    imagen VARCHAR(255)
);

CREATE TABLE compras (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    fecha DATETIME NOT NULL,
    cantidad_items INT NOT NULL,
    total DOUBLE NOT NULL
);

CREATE TABLE detalle_compra (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    compra_id BIGINT NOT NULL,
    servicio_id BIGINT NOT NULL,
    precio_unitario DOUBLE NOT NULL,
    cantidad INT NOT NULL,
    subtotal DOUBLE NOT NULL,
    CONSTRAINT fk_detalle_compra FOREIGN KEY (compra_id) REFERENCES compras(id) ON DELETE CASCADE
);
