INSERT INTO servicios (nombre, categoria, precio, descripcion_corta, descripcion_larga, imagen) VALUES
('Consulta General', 'Servicio', 15000.0, 'Revision fisica completa para tu mascota.', 'La consulta general incluye una revision exhaustiva de los signos vitales, peso, temperatura, revision dental, ocular y de oidos.', '/img/consulta1.jpg'),
('Vacunacion Antirrabica', 'Vacuna', 12000.0, 'Inmunizacion obligatoria contra el virus de la rabia.', 'Protege a tu mascota contra la rabia. Incluye certificado oficial y registro en el sistema nacional.', '/img/vacuna1.jpg'),
('Peluqueria Canina', 'Peluqueria', 18000.0, 'Bano, corte higienico y cepillado profesional.', 'Servicio completo de estetica canina: bano con shampoo medicado, corte de pelo segun la raza, corte de unas y limpieza de oidos.', '/img/peinado.jpg');

INSERT INTO compras (fecha, cantidad_items, total) VALUES
('2026-11-20 10:30:00', 1, 15000.0);

INSERT INTO detalle_compra (compra_id, servicio_id, precio_unitario, cantidad, subtotal) VALUES
(1, 1, 15000.0, 1, 15000.0);
