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

  const usuario = JSON.parse(usuarioTexto)

  if (rolRequerido && usuario.rol !== rolRequerido) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default RutaProtegida