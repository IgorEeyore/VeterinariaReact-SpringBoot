import { useState } from "react"
import type { FormEvent } from "react"
import { useNavigate, Link } from "react-router-dom"
import CampoFormulario from "../moleculas/CampoFormulario"

const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const API_LOGIN = "http://localhost:8080/api/v1/auth/login"

function FormularioLogin() {
  const [correo, setCorreo] = useState("")
  const [contrasena, setContrasena] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const manejarEnvio = async (e: FormEvent) => {
    e.preventDefault()
    setError("")

    if (correo.trim() === "" || contrasena.trim() === "") {
      setError("Por favor complete todos los campos")
      return
    }

    if (!formatoCorreo.test(correo.trim())) {
      setError("Por favor ingrese un correo electronico valido")
      return
    }

    if (contrasena.length < 4 || contrasena.length > 10) {
      setError("La contrasena debe tener entre 4 y 10 caracteres")
      return
    }

    try {
      const respuesta = await fetch(API_LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          correo: correo.trim().toLowerCase(),
          contrasena: contrasena.trim()
        })
      })

      if (!respuesta.ok) {
        const errorData = await respuesta.json().catch(() => null)
        setError(errorData?.mensaje || "Correo o contrasena incorrectos")
        return
      }

      const data = await respuesta.json()
      const usuarioValido = {
        id: data.id,
        nombre: data.nombre,
        correo: data.correo,
        rol: data.rol
      }

      localStorage.setItem("tokenSanMarcos", data.token)
      localStorage.setItem("usuarioActivo", JSON.stringify(usuarioValido))
      navigate(usuarioValido.rol?.toLowerCase() === "admin" ? "/admin" : "/")
    } catch {
      setError("No se pudo conectar con el servidor de autenticacion")
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-8 col-lg-5">
        <div className="card shadow-sm border-0 rounded-4 p-4">
          <div className="card-body">
            <h2 className="fw-bold text-center mb-2" style={{ color: "#2D3161" }}>
              Iniciar sesion
            </h2>
            <p className="text-muted text-center mb-4">
              Ingresa tus credenciales para acceder al sistema
            </p>

            {error && (
              <div className="alert alert-danger py-2 text-center" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={manejarEnvio} noValidate>
              <CampoFormulario
                etiqueta="Correo electronico"
                tipo="email"
                nombre="correo"
                valor={correo}
                placeholder="ejemplo@demo.cl"
                obligatorio={true}
                alCambiar={setCorreo}
              />

              <CampoFormulario
                etiqueta="Contrasena"
                tipo="password"
                nombre="contrasena"
                valor={contrasena}
                placeholder="Ingresa tu contrasena (entre 4 y 10 caracteres)"
                obligatorio={true}
                alCambiar={(val) => setContrasena(val.slice(0, 10))}
              />

              <button
                type="submit"
                className="btn text-white fw-bold w-100 py-2 mt-3"
                style={{ backgroundColor: "#2D3161" }}
              >
                Ingresar
              </button>
            </form>

            <div className="text-center mt-4">
              <span className="text-muted">No tienes una cuenta? </span>
              <Link
                to="/registro"
                className="fw-semibold text-decoration-none"
                style={{ color: "#2ec4b6" }}
              >
                Registrate aqui
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormularioLogin