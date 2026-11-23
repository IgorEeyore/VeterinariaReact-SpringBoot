import FormularioContacto from "../componentes/organismos/FormularioContacto"

function Contacto() {
  return (
    <div className="container py-5">
      <h1
        className="text-center fw-bold mb-4"
        style={{ color: "#2D3161" }}
      >
        Contacto
      </h1>

      <p className="text-center mb-5">
        Comunícate con Veterinaria San Marcos para consultar por
        servicios, horarios y precios.
      </p>

      <div className="row g-4 mb-5">
        <div className="col-12 col-md-6">
          <div className="card h-100 shadow-sm border-0 rounded-4">
            <div className="card-body p-4">
              <h2 className="h4 fw-bold" style={{ color: "#2D3161" }}>
                Información de contacto
              </h2>

              <p className="mt-3">
                <strong>Dirección:</strong>
                <br />
                Av. Los Zapadores 904,
                Región Metropolitana, Chile.
              </p>

              <p>
                <strong>Teléfono:</strong>
                <br />
                <a href="tel:+56936726204" className="text-decoration-none">
                  +56 9 3672 6204
                </a>
              </p>

              <p>
                <strong>Correo:</strong>
                <br />
                <a href="mailto:veterinariasm@sanmarcos.cl" className="text-decoration-none">
                  veterinariasm@sanmarcos.cl
                </a>
              </p>

              <p className="fw-bold text-success">
                Urgencias veterinarias 24/7
              </p>

              <p className="text-muted small mb-0">
                Los horarios regulares de atención no están
                especificados. Consulta directamente por
                disponibilidad y precios.
              </p>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="card h-100 shadow-sm border-0 rounded-4">
            <div className="card-body p-4">
              <h2 className="h4 fw-bold" style={{ color: "#2D3161" }}>
                ¿Dónde estamos?
              </h2>

              <p className="mt-3">
                Encuéntranos en Av. Los Zapadores 904,
                Región Metropolitana, Chile.
              </p>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Av.+Los+Zapadores+904%2C+Chile"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-secondary fw-semibold mb-3"
              >
                Ver ubicación en Google Maps
              </a>

              <hr />

              <p className="mb-0 text-muted small">
                Para consultas sobre nuestros servicios puedes
                llamar, escribirnos por correo o completar el formulario a continuación.
              </p>
            </div>
          </div>
        </div>
      </div>

      <FormularioContacto />
    </div>
  )
}

export default Contacto
