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
  rol: "Admin" | "Cliente"
}

const leerUsuarioActivo = (): UsuarioActivo | null => {
  const usuarioTexto = localStorage.getItem("usuarioActivo")
  const token = localStorage.getItem("tokenSanMarcos")
  if (usuarioTexto && token) {
    return JSON.parse(usuarioTexto)
  }
  return null
}

function Navbar() {
  useLocation()
  const navigate = useNavigate()
  const usuarioActivo = leerUsuarioActivo()

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
            Catalogo
          </Nav.Link>

          <Nav.Link as={NavLink} to="/novedades">
            Novedades
          </Nav.Link>

          <Nav.Link as={NavLink} to="/nosotros">
            Nosotros
          </Nav.Link>

          {usuarioActivo?.rol === "Admin" && (
            <Nav.Link as={NavLink} to="/admin" className="fw-bold text-warning">
              Panel Admin
            </Nav.Link>
          )}

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
              title={usuarioActivo.nombre}
              id="menu-cuenta"
              align="end"
              menuVariant="light"
            >
              <NavDropdown.ItemText className="small text-muted">
                Rol: {usuarioActivo.rol}
              </NavDropdown.ItemText>
              <NavDropdown.Divider />
              {usuarioActivo.rol === "Admin" && (
                <NavDropdown.Item as={Link} to="/admin">
                  Ir al Panel Admin
                </NavDropdown.Item>
              )}
              <NavDropdown.Item onClick={cerrarSesion} className="text-danger fw-semibold">
                Cerrar sesion
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
                Iniciar sesion
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