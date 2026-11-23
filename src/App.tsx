import { BrowserRouter, Routes, Route, Link } from "react-router-dom"

import Navbar from "./componentes/organismos/Navbar"
import Footer from "./componentes/organismos/Footer"
import RutaProtegida from "./componentes/organismos/RutaProtegida"

import Inicio from "./paginas/Inicio"
import Nosotros from "./paginas/Nosotros"
import Catalogo from "./paginas/Catalogo"
import DetalleServicio from "./paginas/DetalleServicio"
import Novedades from "./paginas/Novedades"
import Contacto from "./paginas/Contacto"
import Login from "./paginas/Login"
import Registro from "./paginas/Registro"
import AgendarCita from "./paginas/AgendarCita"
import Carrito from "./paginas/Carrito"
import Admin from "./paginas/Admin"
import AdminCatalogo from "./paginas/Admin-Catalogo"
import AdminUsuarios from "./paginas/Admin-Usuarios"
import AdminAgenda from "./paginas/Admin-Agenda"
import AdminContacto from "./paginas/Admin-Contacto"

import "./App.css"

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Navbar />

        <main className="app-contenido">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/catalogo/:id" element={<DetalleServicio />} />
            <Route path="/novedades" element={<Novedades />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/agendar" element={<AgendarCita />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route
              path="/admin"
              element={
                <RutaProtegida rolRequerido="Admin">
                  <Admin />
                </RutaProtegida>
              }
            />
            <Route
              path="/admin/catalogo"
              element={
                <RutaProtegida rolRequerido="Admin">
                  <AdminCatalogo />
                </RutaProtegida>
              }
            />
            <Route
              path="/admin/usuarios"
              element={
                <RutaProtegida rolRequerido="Admin">
                  <AdminUsuarios />
                </RutaProtegida>
              }
            />
            <Route
              path="/admin/agenda"
              element={
                <RutaProtegida rolRequerido="Admin">
                  <AdminAgenda />
                </RutaProtegida>
              }
            />
            <Route
              path="/admin/contacto"
              element={
                <RutaProtegida rolRequerido="Admin">
                  <AdminContacto />
                </RutaProtegida>
              }
            />
            <Route
              path="*"
              element={
                <div className="container py-5 text-center">
                  <h2 className="fw-bold mb-2" style={{ color: "#2D3161" }}>
                    Página no encontrada
                  </h2>
                  <p className="text-muted mb-4">
                    La ruta que intentas visitar no existe en Veterinaria San Marcos.
                  </p>
                  <Link
                    to="/"
                    className="btn text-white fw-bold px-4 py-2"
                    style={{ backgroundColor: "#2ec4b6" }}
                  >
                    Volver al Inicio
                  </Link>
                </div>
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App