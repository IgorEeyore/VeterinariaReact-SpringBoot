import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"
import {
  Container,
  Navbar as BootstrapNavbar,
  Nav,
  NavDropdown
} from "react-bootstrap"

interface UsuarioActivo {
  id: number
  nombre: string
  correo: string
  rol: string
}

const leerUsuarioActivo = (): UsuarioActivo | null => {
  const usuarioTexto = localStorage.getItem("usuarioActivo")
  const token = localStorage.getItem("tokenSanMarcos")
  if (!usuarioTexto || !token) return null
  try {
    return JSON.parse(usuarioTexto)
  } catch {
    return null
  }
}

function Navbar() {
  useLocation()
  const navigate = useNavigate()
  const usuarioActivo = leerUsuarioActivo()
  const esAdmin = usuarioActivo?.rol?.toLowerCase() === "admin"

  const cerrarSesion = () => {
    localStorage.removeItem("usuarioActivo")
    localStorage.removeItem("tokenSanMarcos")
    navigate("/login")
  }

  return (
    <BootstrapNavbar
      style={{ backgroundColor: "#2D3161" }}
      variant="dark"
      className="py-3"
    >
      <Container className="d-flex flex-wrap gap-3">
        <BootstrapNavbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
          <img
            src="/img/logo.png"
            alt="Logo Veterinaria San Marcos"
            style={{
              height: "42px",
              backgroundColor: "#ffffff",
              padding: "2px 8px",
              borderRadius: "8px",
              objectFit: "contain"
            }}
          />
          <span className="fw-bold text-white">Veterinaria San Marcos</span>
        </BootstrapNavbar.Brand>

        <Nav className="ms-lg-auto flex-row flex-wrap align-items-center gap-2 gap-lg-3">
          <Link
            to="/agendar"
            className="btn text-white fw-bold px-3 py-1 shadow-sm rounded-pill d-inline-flex align-items-center gap-1"
            style={{ backgroundColor: "#2ec4b6" }}
          >
            📅 Agendar hora
          </Link>

          <Nav.Link as={NavLink} to="/" end>
            Inicio
          </Nav.Link>

          <Nav.Link as={NavLink} to="/catalogo">
            Catálogo
          </Nav.Link>

          <Nav.Link as={NavLink} to="/novedades">
            Novedades
          </Nav.Link>

          <Nav.Link as={NavLink} to="/nosotros">
            Nosotros
          </Nav.Link>

          <Nav.Link as={NavLink} to="/contacto">
            Contacto
          </Nav.Link>

          <Link
            to="/carrito"
            className="btn btn-light btn-sm d-inline-flex align-items-center justify-content-center shadow-sm"
            style={{
              width: "40px",
              height: "36px",
              borderRadius: "10px"
            }}
            title="Ver carrito"
            aria-label="Ver carrito"
          >
            🛒
          </Link>

          {usuarioActivo ? (
            <NavDropdown
              title={esAdmin ? `Admin: ${usuarioActivo.nombre}` : usuarioActivo.nombre}
              id="menu-cuenta"
              align="end"
              menuVariant="light"
            >
              <NavDropdown.ItemText className="small text-muted">
                Rol: {esAdmin ? "Admin" : "Cliente"}
              </NavDropdown.ItemText>
              <NavDropdown.Divider />
              {esAdmin && (
                <>
                  <NavDropdown.Item as={Link} to="/admin" className="fw-semibold">
                    Panel de Control
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/catalogo">
                    Gestión de Catálogo
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/usuarios">
                    Gestión de Usuarios
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/agenda">
                    Revisión de Agenda
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/contacto">
                    Solicitudes de Contacto
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                </>
              )}
              <NavDropdown.Item onClick={cerrarSesion} className="text-danger fw-semibold">
                Cerrar sesión
              </NavDropdown.Item>
            </NavDropdown>
          ) : (
            <NavDropdown
              title="Cuenta"
              id="menu-cuenta"
              align="end"
              menuVariant="light"
            >
              <NavDropdown.Item as={Link} to="/login">
                Iniciar sesión
              </NavDropdown.Item>

              <NavDropdown.Item as={Link} to="/registro">
                Registrarse
              </NavDropdown.Item>
            </NavDropdown>
          )}
        </Nav>
      </Container>
    </BootstrapNavbar>
  )
}

export default Navbar
