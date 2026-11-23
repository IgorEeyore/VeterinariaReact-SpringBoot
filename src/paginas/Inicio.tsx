import { Link } from "react-router-dom"

function Inicio() {
  const serviciosDestacados = [
    {
      titulo: "Consulta General",
      descripcion: "Revisión médica completa para prevenir y detectar cualquier problema de salud a tiempo.",
      precio: "$15.000",
      imagen: "/img/consulta.jpg"
    },
    {
      titulo: "Vacunación y Desparasitación",
      descripcion: "Protege a tu compañero con esquemas de vacunación certificados y control antiparasitario al día.",
      precio: "Desde $12.000",
      imagen: "/img/vacuna.jpg"
    },
    {
      titulo: "Peluquería y Baño",
      descripcion: "Baño estético, corte de pelo, limpieza de oídos y corte de uñas con el máximo cuidado.",
      precio: "Desde $18.000",
      imagen: "/img/peluqueria.jpg"
    }
  ]

  const caracteristicas = [
    {
      icono: "🩺",
      titulo: "Veterinarios Certificados",
      detalle: "Equipo multidisciplinario con vocación y constante actualización médica."
    },
    {
      icono: "🏥",
      titulo: "Instalaciones Equipadas",
      detalle: "Boxes clínicos, pabellón quirúrgico y farmacia integrada para tu comodidad."
    },
    {
      icono: "⏰",
      titulo: "Urgencias 24/7",
      detalle: "Disponibilidad permanente para atender emergencias veterinarias en cualquier momento."
    },
    {
      icono: "🐾",
      titulo: "Atención Personalizada",
      detalle: "Cada mascota recibe un trato único, respetuoso y lleno de cariño."
    }
  ]

  const testimonios = [
    {
      nombre: "Andrea Silva",
      texto: "Salvaron a mi perrito Max cuando se enfermó a medianoche. La atención de urgencias fue rápida y los doctores muy empáticos. Recomendados al 100%.",
      estrellas: "★★★★★"
    },
    {
      nombre: "Carlos Mendoza",
      texto: "El servicio de peluquería es excelente. Mi gata suele ser muy nerviosa, pero la trataron con tanto amor y paciencia que salió ronroneando.",
      estrellas: "★★★★★"
    },
    {
      nombre: "Valeria Rojas",
      texto: "Tienen precios justos, instalaciones muy cómodas y una atención al cliente de primer nivel. Es mi clínica de confianza hace años.",
      estrellas: "★★★★★"
    }
  ]

  return (
    <div>
      <section className="container py-5 mt-2">
        <div className="row align-items-center g-5">
          <div className="col-12 col-lg-6 text-center text-lg-start">
            <h1 className="display-5 fw-bold mb-3" style={{ color: "#2D3161" }}>
              Cuidamos a tu mejor amigo como si fuera nuestro
            </h1>
            <p className="lead mb-4 text-muted">
              En Veterinaria San Marcos ofrecemos atención médica integral, peluquería y urgencias 24/7 para perros, gatos y animales exóticos. Más de 10 años de experiencia brindando salud y bienestar.
            </p>
            <div className="d-flex gap-3 justify-content-center justify-content-lg-start flex-wrap">
              <Link
                to="/catalogo"
                className="btn text-white fw-bold px-4 py-2"
                style={{ backgroundColor: "#2ec4b6" }}
              >
                Ver Catálogo
              </Link>
              <Link
                to="/contacto"
                className="btn btn-outline-secondary fw-bold px-4 py-2"
              >
                Contáctanos
              </Link>
            </div>
          </div>
          <div className="col-12 col-lg-6 text-center">
            <img
              src="/img/presentacion.jpg"
              className="img-fluid rounded-4 shadow"
              alt="Bienvenida Veterinaria San Marcos"
              style={{ maxHeight: "380px", width: "100%", objectFit: "cover" }}
            />
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold mb-2" style={{ color: "#2D3161" }}>
            Nuestros Servicios Destacados
          </h2>
          <p className="text-muted">
            Atención médica y estética especializada con los más altos estándares de calidad
          </p>
        </div>

        <div className="row g-4">
          {serviciosDestacados.map((item) => (
            <div key={item.titulo} className="col-12 col-md-4">
              <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
                <img
                  src={item.imagen}
                  className="card-img-top"
                  alt={item.titulo}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column p-4">
                  <h5 className="card-title fw-bold" style={{ color: "#2D3161" }}>
                    {item.titulo}
                  </h5>
                  <p className="card-text text-muted mb-4 small flex-grow-1">
                    {item.descripcion}
                  </p>
                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    <span className="fw-bold text-success fs-5">
                      {item.precio}
                    </span>
                    <Link
                      to="/catalogo"
                      className="btn btn-sm text-white fw-semibold px-3"
                      style={{ backgroundColor: "#2D3161" }}
                    >
                      Ver en Catálogo
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-2" style={{ color: "#2D3161" }}>
              Por qué confiar en Nosotros
            </h2>
            <p className="text-muted">
              Compromiso profesional y tecnología al servicio del cuidado animal
            </p>
          </div>

          <div className="row g-4">
            {caracteristicas.map((caract) => (
              <div key={caract.titulo} className="col-12 col-sm-6 col-lg-3">
                <div className="card h-100 shadow-sm border-0 rounded-4 p-3 text-center bg-white">
                  <div className="card-body">
                    <div className="display-5 mb-3">{caract.icono}</div>
                    <h5 className="fw-bold mb-2" style={{ color: "#2D3161" }}>
                      {caract.titulo}
                    </h5>
                    <p className="text-muted small mb-0">
                      {caract.detalle}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5 text-white" style={{ backgroundColor: "#2D3161" }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold text-white mb-2">
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-white-50">
              La opinión de quienes confían día a día la salud de sus mascotas con nosotros
            </p>
          </div>

          <div className="row g-4">
            {testimonios.map((testimonio) => (
              <div key={testimonio.nombre} className="col-12 col-md-4">
                <div className="card h-100 shadow border-0 rounded-4 p-4 bg-white text-dark">
                  <div className="text-warning mb-2 fs-5">
                    {testimonio.estrellas}
                  </div>
                  <p className="fst-italic text-muted mb-4 small flex-grow-1">
                    "{testimonio.texto}"
                  </p>
                  <h6 className="fw-bold mb-0" style={{ color: "#2D3161" }}>
                    - {testimonio.nombre}
                  </h6>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-5 text-center">
        <div className="card shadow-sm border-0 rounded-4 p-5" style={{ backgroundColor: "#eef9f8" }}>
          <h2 className="fw-bold mb-3" style={{ color: "#2D3161" }}>
            Urgencias Veterinarias 24/7
          </h2>
          <p className="text-muted mb-4 col-12 col-md-8 mx-auto">
            Atención de emergencias las 24 horas, todos los días del año. Nuestro equipo de turno está listo para cuidar a tu mascota cuando más lo necesita.
          </p>
          <div>
            <a
              className="btn text-white fw-bold px-4 py-2"
              style={{ backgroundColor: "#2ec4b6" }}
            >
              📞 Llamar al +56 9 3672 6204
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Inicio
