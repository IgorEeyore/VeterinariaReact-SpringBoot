import { useState } from "react"
import type { FormEvent } from "react"
import CampoFormulario from "../moleculas/CampoFormulario"

const asuntos = [
  "Consulta General",
  "Servicios Veterinarios",
  "Vacunacion",
  "Peluqueria",
  "Precios y Disponibilidad",
  "Otro"
]

const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const API_CONTACTOS = "http://localhost:8080/api/v1/mensajes-contacto"

function FormularioContacto() {
  const [nombre, setNombre] = useState("")
  const [correo, setCorreo] = useState("")
  const [telefono, setTelefono] = useState("")
  const [asunto, setAsunto] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [error, setError] = useState("")

  const manejarEnvio = async (e: FormEvent) => {
    e.preventDefault()
    setError("")

    const nombreLimpio = nombre.trim()
    const correoLimpio = correo.trim().toLowerCase()
    const telefonoLimpio = telefono.trim()
    const mensajeLimpio = mensaje.trim()

    if (!nombreLimpio || !correoLimpio || !asunto || !mensajeLimpio) {
      setError("Por favor completa todos los campos obligatorios")
      return
    }

    if (!formatoCorreo.test(correoLimpio)) {
      setError("Por favor ingresa un correo electronico valido")
      return
    }

    if (mensajeLimpio.length < 10) {
      setError("El mensaje debe contener al menos 10 caracteres")
      return
    }

    const payload = {
      nombre: nombreLimpio,
      correo: correoLimpio,
      telefono: telefonoLimpio,
      asunto,
      mensaje: mensajeLimpio
    }

    let mensajeGuardado = {
      id: Date.now(),
      ...payload,
      fechaEnvio: new Date().toISOString(),
      leido: false
    }

    try {
      const respuesta = await fetch(API_CONTACTOS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (!respuesta.ok) {
        const errorData = await respuesta.json().catch(() => null)
        setError(errorData?.detalles?.[0] || errorData?.mensaje || "No se pudo enviar el mensaje")
        return
      }

      const data = await respuesta.json().catch(() => null)
      if (data && data.id) {
        mensajeGuardado = data
      }
    } catch {
      void 0
    }

    const guardados = localStorage.getItem("mensajesContactoSanMarcos")
    const listaMensajes = guardados ? JSON.parse(guardados) : []
    listaMensajes.push(mensajeGuardado)
    localStorage.setItem("mensajesContactoSanMarcos", JSON.stringify(listaMensajes))

    alert("Mensaje enviado con exito. Nos comunicaremos contigo a la brevedad.")

    setNombre("")
    setCorreo("")
    setTelefono("")
    setAsunto("")
    setMensaje("")
  }

  return (
    <section className="row justify-content-center">
      <div className="col-12 col-lg-9">
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body p-4 p-md-5">
            <h2
              className="h3 fw-bold text-center mb-2"
              style={{ color: "#2D3161" }}
            >
              Envianos tu consulta
            </h2>

            <p className="text-muted text-center mb-4">
              Completa el formulario y nuestro equipo te respondera lo antes posible.
            </p>

            {error && (
              <div className="alert alert-danger text-center py-2" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={manejarEnvio} noValidate>
              <CampoFormulario
                etiqueta="Nombre completo"
                tipo="text"
                nombre="nombre"
                valor={nombre}
                placeholder="Ej: Carolina Munoz"
                obligatorio={true}
                alCambiar={setNombre}
              />

              <div className="row">
                <div className="col-12 col-md-6">
                  <CampoFormulario
                    etiqueta="Correo electronico"
                    tipo="email"
                    nombre="correo"
                    valor={correo}
                    placeholder="correo@ejemplo.cl"
                    obligatorio={true}
                    alCambiar={setCorreo}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <CampoFormulario
                    etiqueta="Celular (opcional)"
                    tipo="tel"
                    nombre="telefono"
                    valor={telefono}
                    placeholder="+56 9 1234 5678"
                    alCambiar={setTelefono}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Asunto <span className="text-danger">(*)</span>
                </label>

                <select
                  name="asunto"
                  className="form-select"
                  value={asunto}
                  onChange={(e) => setAsunto(e.target.value)}
                >
                  <option value="">Selecciona una opcion</option>
                  {asuntos.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Mensaje <span className="text-danger">(*)</span>
                </label>

                <textarea
                  name="mensaje"
                  className="form-control"
                  rows={4}
                  placeholder="Escribe tu consulta o requerimiento aqui..."
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                />
                <div className="form-text">
                  Minimo 10 caracteres.
                </div>
              </div>

              <button
                type="submit"
                className="btn w-100 text-white fw-bold py-3"
                style={{ backgroundColor: "#2D3161" }}
              >
                Enviar Mensaje
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FormularioContacto
