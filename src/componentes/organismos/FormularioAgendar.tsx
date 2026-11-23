import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import CampoFormulario from "../moleculas/CampoFormulario"
import { listaServicios } from "../../datos/serviciosIniciales"
import type { Servicio } from "../../datos/serviciosIniciales"

interface Cita {
  id: number
  nombreDueno: string
  telefono: string
  nombreMascota: string
  tipoMascota: string
  servicio: string
  fecha: string
  hora: string
  notas?: string
  estado?: string
}

const API_CITAS = "http://localhost:8080/api/v1/citas"
const API_CATALOGO = "http://localhost:8080/api/v1/catalogo"

const obtenerFechaHoyLocal = (): string => {
  const ahora = new Date()
  const anio = ahora.getFullYear()
  const mes = String(ahora.getMonth() + 1).padStart(2, "0")
  const dia = String(ahora.getDate()).padStart(2, "0")
  return `${anio}-${mes}-${dia}`
}

const obtenerHoraActualLocal = (): string => {
  const ahora = new Date()
  const horas = String(ahora.getHours()).padStart(2, "0")
  const minutos = String(ahora.getMinutes()).padStart(2, "0")
  return `${horas}:${minutos}`
}

const obtenerNombresServiciosLocales = (): string[] => {
  try {
    const guardados = localStorage.getItem("catalogoSanMarcos")
    const items: Servicio[] = guardados ? JSON.parse(guardados) : listaServicios
    const nombres = items.map((s) => s.nombre).filter(Boolean)
    return nombres.length > 0 ? nombres : listaServicios.map((s) => s.nombre)
  } catch {
    return listaServicios.map((s) => s.nombre)
  }
}

function FormularioAgendar() {
  const [serviciosDisponibles, setServiciosDisponibles] = useState<string[]>(obtenerNombresServiciosLocales)
  const [nombreDueno, setNombreDueno] = useState("")
  const [telefono, setTelefono] = useState("")
  const [nombreMascota, setNombreMascota] = useState("")
  const [tipoMascota, setTipoMascota] = useState("Perro")
  const [servicio, setServicio] = useState(() => obtenerNombresServiciosLocales()[0] || "Consulta General")
  const [fecha, setFecha] = useState("")
  const [hora, setHora] = useState("")
  const [notas, setNotas] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const fechaMinima = obtenerFechaHoyLocal()

  useEffect(() => {
    const cargarServicios = async () => {
      try {
        const respuesta = await fetch(API_CATALOGO)
        if (respuesta.ok) {
          const data: unknown = await respuesta.json()
          if (Array.isArray(data)) {
            const nombres = (data as Servicio[]).map((s) => s.nombre).filter(Boolean)
            if (nombres.length > 0) {
              setServiciosDisponibles(nombres)
              setServicio((actual) => (nombres.includes(actual) ? actual : nombres[0]))
            }
          }
        }
      } catch {
        void 0
      }
    }

    cargarServicios()
  }, [])

  const manejarEnvio = async (e: FormEvent) => {
    e.preventDefault()
    setError("")

    if (
      !nombreDueno.trim() ||
      !telefono.trim() ||
      !nombreMascota.trim() ||
      !fecha.trim() ||
      !hora.trim()
    ) {
      setError("Por favor completa todos los campos obligatorios")
      return
    }

    const hoy = obtenerFechaHoyLocal()
    if (fecha < hoy) {
      setError("No se puede agendar una cita en una fecha pasada")
      return
    }

    if (fecha === hoy && hora < obtenerHoraActualLocal()) {
      setError("La hora seleccionada ya paso para el dia de hoy")
      return
    }

    const datosCita = {
      nombreDueno: nombreDueno.trim(),
      telefono: telefono.trim(),
      nombreMascota: nombreMascota.trim(),
      tipoMascota,
      servicio,
      fecha,
      hora,
      notas: notas.trim(),
      estado: "PENDIENTE"
    }

    try {
      const token = localStorage.getItem("tokenSanMarcos")
      const respuesta = await fetch(API_CITAS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(datosCita)
      })

      if (!respuesta.ok) {
        const errorData = await respuesta.json().catch(() => null)
        setError(errorData?.detalles?.[0] || errorData?.mensaje || "No se pudo agendar la cita")
        return
      }
    } catch {
      const guardadas = localStorage.getItem("citasSanMarcos")
      const citasGuardadas: Cita[] = guardadas ? JSON.parse(guardadas) : []
      const nuevoId = citasGuardadas.length > 0 ? Math.max(...citasGuardadas.map((c) => c.id)) + 1 : 1
      citasGuardadas.push({ id: nuevoId, ...datosCita })
      localStorage.setItem("citasSanMarcos", JSON.stringify(citasGuardadas))
    }

    alert(`Cita agendada con exito para ${nombreMascota} el dia ${fecha} a las ${hora}. Te esperamos en Veterinaria San Marcos.`)
    navigate("/")
  }

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-10 col-lg-8">
        <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5">
          <div className="card-body">
            <h2 className="fw-bold text-center mb-2" style={{ color: "#2D3161" }}>
              Agendar Cita Medica
            </h2>
            <p className="text-muted text-center mb-4">
              Selecciona fecha y hora para la atencion de tu mascota
            </p>

            {error && (
              <div className="alert alert-danger py-2 text-center" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={manejarEnvio} noValidate>
              <div className="row">
                <div className="col-12 col-md-6">
                  <CampoFormulario
                    etiqueta="Nombre del Dueno o Responsable"
                    tipo="text"
                    nombre="nombreDueno"
                    valor={nombreDueno}
                    placeholder="Ej: Carolina Munoz"
                    obligatorio={true}
                    alCambiar={setNombreDueno}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <CampoFormulario
                    etiqueta="Telefono de Contacto"
                    tipo="tel"
                    nombre="telefono"
                    valor={telefono}
                    placeholder="Ej: +56 9 1234 5678"
                    obligatorio={true}
                    alCambiar={setTelefono}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-12 col-md-6">
                  <CampoFormulario
                    etiqueta="Nombre de la Mascota"
                    tipo="text"
                    nombre="nombreMascota"
                    valor={nombreMascota}
                    placeholder="Ej: Rocky"
                    obligatorio={true}
                    alCambiar={setNombreMascota}
                  />
                </div>
                <div className="col-12 col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Tipo de Mascota <span className="text-danger">(*)</span>
                  </label>
                  <select
                    className="form-select"
                    value={tipoMascota}
                    onChange={(e) => setTipoMascota(e.target.value)}
                  >
                    <option value="Perro">Perro</option>
                    <option value="Gato">Gato</option>
                    <option value="Exotico">Animal Exotico</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Servicio Requerido <span className="text-danger">(*)</span>
                </label>
                <select
                  className="form-select"
                  value={servicio}
                  onChange={(e) => setServicio(e.target.value)}
                >
                  {serviciosDisponibles.map((nombreServicio) => (
                    <option key={nombreServicio} value={nombreServicio}>
                      {nombreServicio}
                    </option>
                  ))}
                </select>
              </div>

              <div className="row">
                <div className="col-12 col-md-6">
                  <CampoFormulario
                    etiqueta="Fecha de la Cita"
                    tipo="date"
                    nombre="fecha"
                    valor={fecha}
                    min={fechaMinima}
                    obligatorio={true}
                    alCambiar={setFecha}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <CampoFormulario
                    etiqueta="Hora Preferida"
                    tipo="time"
                    nombre="hora"
                    valor={hora}
                    obligatorio={true}
                    alCambiar={setHora}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Motivo o Notas adicionales (Opcional)
                </label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Detalla sintomas o indicaciones especiales..."
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn text-white fw-bold w-100 py-3"
                style={{ backgroundColor: "#2ec4b6" }}
              >
                Confirmar y Agendar Cita
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormularioAgendar
