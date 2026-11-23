export interface Servicio {
  id: number
  nombre: string
  precio: number
  categoria: string
  imagen?: string
  descripcionCorta?: string
  descripcionLarga?: string
}

export const listaServicios: Servicio[] = [
  {
    id: 1,
    nombre: "Consulta General",
    precio: 15000,
    categoria: "Servicio",
    imagen: "/img/consulta1.jpg",
    descripcionCorta: "Revision fisica completa para tu mascota.",
    descripcionLarga: "La consulta general incluye una revision exhaustiva de los signos vitales, peso, temperatura, revision dental, ocular y de oidos."
  },
  {
    id: 2,
    nombre: "Vacunacion Anual",
    precio: 25000,
    categoria: "Servicio",
    imagen: "/img/vacuna2.jpg",
    descripcionCorta: "Esquema de vacunacion preventiva.",
    descripcionLarga: "Protege a tu mascota contra las enfermedades mas comunes y peligrosas. Incluye la vacuna Octuple o Triple Felina."
  },
  {
    id: 3,
    nombre: "Peluqueria Canina/Felina",
    precio: 18000,
    categoria: "Servicio",
    imagen: "/img/peinado.jpg",
    descripcionCorta: "Bano, corte de pelo y unas.",
    descripcionLarga: "Servicio estetico completo. Incluye bano con shampoo hipoalergenico, limpieza de glandulas anales y corte."
  },
  {
    id: 4,
    nombre: "Desparasitacion Interna/Externa",
    precio: 12000,
    categoria: "Medicamento",
    imagen: "/img/vacuna.jpg",
    descripcionCorta: "Tratamiento contra parasitos y pulgas.",
    descripcionLarga: "Control integral de parasitos gastrointestinales y ectoparasitos como pulgas y garrapatas con farmacos certificados."
  },
  {
    id: 5,
    nombre: "Cirugia Menor",
    precio: 45000,
    categoria: "Servicio",
    imagen: "/img/consulta.jpg",
    descripcionCorta: "Intervenciones quirurgicas programadas.",
    descripcionLarga: "Procedimientos como esterilizacion, castracion o suturas menores con anestesia monitoreada y cuidados postoperatorios."
  },
  {
    id: 6,
    nombre: "Corte de Unas y Limpieza",
    precio: 8000,
    categoria: "Servicio",
    imagen: "/img/uñas.jpg",
    descripcionCorta: "Cuidado podologico y de almohadillas.",
    descripcionLarga: "Corte seguro de unas para evitar sobrecrecimiento y sangrado, junto con hidratacion de almohadillas plantares."
  }
]
