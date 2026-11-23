import { Navigate } from "react-router-dom"
import FormularioLogin from "../componentes/organismos/FormularioLogin"

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

function Login() {
  const destino = obtenerDestinoActivo()
  if (destino) {
    return <Navigate to={destino} replace />
  }

  return (
    <div className="container py-5">
      <FormularioLogin />
    </div>
  )
}

export default Login
