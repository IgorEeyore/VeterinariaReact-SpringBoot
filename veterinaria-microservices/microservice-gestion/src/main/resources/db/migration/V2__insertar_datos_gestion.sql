INSERT INTO servicios (nombre, categoria, precio, descripcion_corta, descripcion_larga, imagen) VALUES
('Consulta General', 'Servicio', 15000.0, 'Revision fisica completa para tu mascota.', 'La consulta general incluye una revision exhaustiva de los signos vitales, peso, temperatura, revision dental, ocular y de oidos.', '/img/consulta1.jpg'),
('Vacunacion Anual', 'Servicio', 25000.0, 'Esquema de vacunacion preventiva.', 'Protege a tu mascota contra las enfermedades mas comunes y peligrosas. Incluye la vacuna Octuple o Triple Felina.', '/img/vacuna2.jpg'),
('Peluqueria Canina/Felina', 'Servicio', 18000.0, 'Bano, corte de pelo y unas.', 'Servicio estetico completo. Incluye bano con shampoo hipoalergenico, limpieza de glandulas anales y corte.', '/img/peinado.jpg'),
('Desparasitacion Interna/Externa', 'Medicamento', 12000.0, 'Tratamiento contra parasitos y pulgas.', 'Control integral de parasitos gastrointestinales y ectoparasitos como pulgas y garrapatas con farmacos certificados.', '/img/vacuna.jpg'),
('Cirugia Menor', 'Servicio', 45000.0, 'Intervenciones quirurgicas programadas.', 'Procedimientos como esterilizacion, castracion o suturas menores con anestesia monitoreada y cuidados postoperatorios.', '/img/consulta.jpg'),
('Corte de Unas y Limpieza', 'Servicio', 8000.0, 'Cuidado podologico y de almohadillas.', 'Corte seguro de unas para evitar sobrecrecimiento y sangrado, junto con hidratacion de almohadillas plantares.', '/img/uñas.jpg');

INSERT INTO compras (fecha, cantidad_items, total) VALUES
('2026-11-20 10:30:00', 1, 15000.0);

INSERT INTO detalle_compra (compra_id, servicio_id, precio_unitario, cantidad, subtotal) VALUES
(1, 1, 15000.0, 1, 15000.0);
