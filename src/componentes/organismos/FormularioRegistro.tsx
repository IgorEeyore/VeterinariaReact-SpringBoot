import { useState } from "react"
import type { FormEvent } from "react"
import { useNavigate, Link } from "react-router-dom"
import CampoFormulario from "../moleculas/CampoFormulario"

const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const formatoRut = /^[0-9]{7,8}[0-9kK]$/
const API_REGISTRO = "http://localhost:8080/api/v1/auth/registrar"

const validarRut = (rut: string): boolean => {
  const valor = rut.replace(/\./g, "").replace(/-/g, "")
  const cuerpo = valor.slice(0, -1)
  const dv = valor.slice(-1).toUpperCase()

  if (cuerpo.length < 7 || cuerpo.length > 8) return false

  let suma = 0
  let multiplo = 2
  let i = 1

  while (i <= cuerpo.length) {
    const index = multiplo * Number(valor.charAt(cuerpo.length - i))
    suma = suma + index
    multiplo = multiplo < 7 ? multiplo + 1 : 2
    i++
  }

  const residuo = 11 - (suma % 11)
  const dvEsperado = residuo === 11 ? "0" : residuo === 10 ? "K" : String(residuo)

  return dv === dvEsperado
}

function FormularioRegistro() {
  const [nombre, setNombre] = useState("")
  const [rut, setRut] = useState("")
  const [correo, setCorreo] = useState("")
  const [contrasena, setContrasena] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const manejarEnvio = async (e: FormEvent) => {
    e.preventDefault()
    setError("")

    if (
      nombre.trim() === "" ||
      rut.trim() === "" ||
      correo.trim() === "" ||
      contrasena.trim() === ""
    ) {
      setError("Por favor completa todos los campos obligatorios")
      return
    }

    const rutLimpio = rut.trim()
    if (!formatoRut.test(rutLimpio)) {
      setError("El RUN debe ingresarse sin puntos ni guion")
      return
    }

    if (!validarRut(rutLimpio)) {
      setError("El RUN ingresado no es valido (Digito verificador incorrecto)")
      return
    }

    if (!formatoCorreo.test(correo.trim())) {
      setError("Por favor ingresa un correo electronico valido")
      return
    }

    if (contrasena.length < 4 || contrasena.length > 10) {
      setError("La contrasena debe tener entre 4 y 10 caracteres")
      return
    }

    try {
      const respuesta = await fetch(API_REGISTRO, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          rut: rutLimpio,
          nombre: nombre.trim(),
          correo: correo.trim().toLowerCase(),
          contrasena: contrasena.trim()
        })
      })

      if (!respuesta.ok) {
        const errorData = await respuesta.json().catch(() => null)
        setError(errorData?.mensaje || "No se pudo completar el registro")
        return
      }

      alert("Registro exitoso. Ahora puedes iniciar sesion con tu cuenta.")
      navigate("/login")
    } catch {
      setError("No se pudo conectar con el servidor de usuarios")
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-8 col-lg-6">
        <div className="card shadow-sm border-0 rounded-4 p-4">
          <div className="card-body">
            <h2 className="fw-bold text-center mb-2" style={{ color: "#2D3161" }}>
              Crear Cuenta
            </h2>
            <p className="text-muted text-center mb-4">
              Registrate para gestionar citas, servicios y compras
            </p>

            {error && (
              <div className="alert alert-danger py-2 text-center" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={manejarEnvio} noValidate>
              <CampoFormulario
                etiqueta="Nombre Completo"
                tipo="text"
                nombre="nombre"
                valor={nombre}
                placeholder="Ej: Juan Perez"
                obligatorio={true}
                alCambiar={setNombre}
              />

              <CampoFormulario
                etiqueta="RUN o RUT (sin puntos ni guion)"
                tipo="text"
                nombre="rut"
                valor={rut}
                placeholder="Ej: 123456789"
                obligatorio={true}
                alCambiar={(val) => setRut(val.replace(/[^0-9kK]/g, "").slice(0, 9))}
              />

              <CampoFormulario
                etiqueta="Correo electronico"
                tipo="email"
                nombre="correo"
                valor={correo}
                placeholder="correo@ejemplo.cl"
                obligatorio={true}
                alCambiar={setCorreo}
              />

              <CampoFormulario
                etiqueta="Contrasena (entre 4 y 10 caracteres)"
                tipo="password"
                nombre="contrasena"
                valor={contrasena}
                placeholder="Ingresa entre 4 y 10 caracteres"
                obligatorio={true}
                alCambiar={(val) => setContrasena(val.slice(0, 10))}
              />

              <button
                type="submit"
                className="btn text-white fw-bold w-100 py-2 mt-3"
                style={{ backgroundColor: "#2D3161" }}
              >
                Registrarme
              </button>
            </form>

            <div className="text-center mt-4">
              <span className="text-muted">Ya tienes una cuenta? </span>
              <Link
                to="/login"
                className="fw-semibold text-decoration-none"
                style={{ color: "#2ec4b6" }}
              >
                Inicia sesion aqui
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormularioRegistro