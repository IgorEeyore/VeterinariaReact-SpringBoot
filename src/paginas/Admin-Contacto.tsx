import { Link } from "react-router-dom"
import GestionContacto from "../componentes/organismos/GestionContacto"

function AdminContacto() {
  return (
    <div className="container py-5">
      <div className="mb-4">
        <Link to="/admin" className="text-decoration-none fw-bold small text-secondary">
          ← Volver al Panel
        </Link>
        <h2 className="fw-bold mb-0 mt-1" style={{ color: "#2D3161" }}>
          Solicitudes de Contacto
        </h2>
      </div>
      <GestionContacto />
    </div>
  )
}

export default AdminContacto
