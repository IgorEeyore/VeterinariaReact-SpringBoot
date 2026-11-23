import { useEffect, useState } from "react"

interface MensajeContacto {
  id: number
  nombre: string
  correo: string
  telefono?: string
  asunto: string
  mensaje: string
  fechaEnvio?: string
  leido?: boolean
}

const API_CONTACTOS = "http://localhost:8080/api/v1/mensajes-contacto"

function GestionContacto() {
  const [mensajes, setMensajes] = useState<MensajeContacto[]>(() => {
    try {
      const guardados = localStorage.getItem("mensajesContactoSanMarcos")
      return guardados ? JSON.parse(guardados) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    const cargarMensajes = async () => {
      const token = localStorage.getItem("tokenSanMarcos")
      try {
        const respuesta = await fetch(API_CONTACTOS, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
        if (respuesta.ok) {
          const data: MensajeContacto[] = await respuesta.json()
          setMensajes(data)
          localStorage.setItem("mensajesContactoSanMarcos", JSON.stringify(data))
        }
      } catch {
        const locales = localStorage.getItem("mensajesContactoSanMarcos")
        if (locales) {
          setMensajes(JSON.parse(locales))
        }
      }
    }

    cargarMensajes()
  }, [])

  const marcarLeido = async (item: MensajeContacto) => {
    const token = localStorage.getItem("tokenSanMarcos")
    let actualizado: MensajeContacto = { ...item, leido: true }

    try {
      const respuesta = await fetch(`${API_CONTACTOS}/${item.id}/marcar-leido`, {
        method: "PUT",
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })

      if (!respuesta.ok) {
        const errorData = await respuesta.json().catch(() => null)
        alert(errorData?.mensaje || "No se pudo actualizar el estado del mensaje.")
        return
      }

      const data = await respuesta.json().catch(() => null)
      if (data && data.id) {
        actualizado = data
      }
    } catch {
      void 0
    }

    const nuevaLista = mensajes.map((m) => (m.id === item.id ? actualizado : m))
    setMensajes(nuevaLista)
    localStorage.setItem("mensajesContactoSanMarcos", JSON.stringify(nuevaLista))
  }

  const eliminarMensaje = async (item: MensajeContacto) => {
    if (!window.confirm(`Estas seguro de eliminar el mensaje de ${item.nombre}?`)) {
      return
    }

    const token = localStorage.getItem("tokenSanMarcos")
    try {
      const respuesta = await fetch(`${API_CONTACTOS}/${item.id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })

      if (!respuesta.ok) {
        const errorData = await respuesta.json().catch(() => null)
        alert(errorData?.mensaje || "No se pudo eliminar el mensaje.")
        return
      }
    } catch {
      void 0
    }

    const filtrados = mensajes.filter((m) => m.id !== item.id)
    setMensajes(filtrados)
    localStorage.setItem("mensajesContactoSanMarcos", JSON.stringify(filtrados))
  }

  const formatearFecha = (fecha?: string) => {
    if (!fecha) return "Sin fecha"
    const parsed = new Date(fecha)
    if (isNaN(parsed.getTime())) return fecha
    return parsed.toLocaleString("es-CL")
  }

  if (mensajes.length === 0) {
    return (
      <div className="card shadow-sm border-0 rounded-4 p-5 text-center">
        <p className="fs-5 text-muted mb-0">
          No hay solicitudes de contacto registradas todavia.
        </p>
      </div>
    )
  }

  return (
    <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Fecha</th>
              <th scope="col">Remitente</th>
              <th scope="col">Asunto</th>
              <th scope="col">Mensaje</th>
              <th scope="col">Estado</th>
              <th scope="col" className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {mensajes.map((m) => (
              <tr key={m.id}>
                <td className="fw-bold text-muted">{m.id}</td>
                <td>
                  <small className="text-muted">{formatearFecha(m.fechaEnvio)}</small>
                </td>
                <td>
                  <div className="fw-semibold">{m.nombre}</div>
                  <small className="text-muted d-block">{m.correo}</small>
                  {m.telefono && <small className="text-muted">{m.telefono}</small>}
                </td>
                <td className="fw-semibold">{m.asunto}</td>
                <td style={{ maxWidth: "280px" }}>{m.mensaje}</td>
                <td>
                  <span
                    className="badge text-white"
                    style={{ backgroundColor: m.leido ? "#198754" : "#f59f00" }}
                  >
                    {m.leido ? "RESPONDIDO" : "PENDIENTE"}
                  </span>
                </td>
                <td className="text-center">
                  <div className="d-flex justify-content-center gap-1 flex-wrap">
                    {!m.leido && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-success"
                        onClick={() => marcarLeido(m)}
                      >
                        Marcar Leído
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => eliminarMensaje(m)}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default GestionContacto
