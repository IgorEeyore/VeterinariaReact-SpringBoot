CREATE TABLE citas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre_dueno VARCHAR(150) NOT NULL,
    telefono VARCHAR(50) NOT NULL,
    nombre_mascota VARCHAR(100) NOT NULL,
    tipo_mascota VARCHAR(100) NOT NULL,
    servicio VARCHAR(150) NOT NULL,
    fecha DATE NOT NULL,
    hora VARCHAR(50) NOT NULL,
    notas TEXT,
    estado VARCHAR(50) NOT NULL DEFAULT 'Pendiente'
);

CREATE TABLE mensajes_contacto (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    correo VARCHAR(150) NOT NULL,
    telefono VARCHAR(50) NOT NULL,
    asunto VARCHAR(150) NOT NULL,
    mensaje TEXT NOT NULL,
    fecha_envio DATETIME NOT NULL,
    leido BOOLEAN NOT NULL DEFAULT FALSE
);
