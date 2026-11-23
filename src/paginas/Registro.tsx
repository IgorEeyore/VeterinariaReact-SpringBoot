import { Navigate } from "react-router-dom"
import FormularioRegistro from "../componentes/organismos/FormularioRegistro"

const obtenerDestinoActivo = (): string | null => {
  const usuarioTexto = localStorage.getItem("usuarioActivo")
  const token = localStorage.getItem("tokenSanMarcos")
  if (!usuarioTexto || !token) return null
  try {
    const usuario = JSON.parse(usuarioTexto)
    return usuario?.rol?.toLowerCase() === "admin" ? "/admin" : "/"
  } catch {
    return null
  }
}

function Registro() {
  const destino = obtenerDestinoActivo()
  if (destino) {
    return <Navigate to={destino} replace />
  }

  return (
    <div className="container py-5">
      <FormularioRegistro />
    </div>
  )
}

export default Registro
