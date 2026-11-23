import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"

interface RutaProtegidaProps {
  children: ReactNode
  rolRequerido?: "Admin" | "Cliente"
}

function RutaProtegida({ children, rolRequerido }: RutaProtegidaProps) {
  const usuarioTexto = localStorage.getItem("usuarioActivo")
  const token = localStorage.getItem("tokenSanMarcos")

  if (!usuarioTexto || !token) {
    return <Navigate to="/login" replace />
  }

  let usuario: { rol?: string }
  try {
    usuario = JSON.parse(usuarioTexto)
  } catch {
    localStorage.removeItem("usuarioActivo")
    localStorage.removeItem("tokenSanMarcos")
    return <Navigate to="/login" replace />
  }

  if (rolRequerido && usuario.rol?.toLowerCase() !== rolRequerido.toLowerCase()) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default RutaProtegida
