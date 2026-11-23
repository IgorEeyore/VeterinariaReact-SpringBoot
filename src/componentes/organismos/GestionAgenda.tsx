import { useEffect, useState } from "react"

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

function GestionAgenda() {
  const [citas, setCitas] = useState<Cita[]>(() => {
    try {
      const datos = localStorage.getItem("citasSanMarcos")
      return datos ? JSON.parse(datos) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    const cargarCitas = async () => {
      const token = localStorage.getItem("tokenSanMarcos")
      try {
        const respuesta = await fetch(API_CITAS, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
        if (respuesta.ok) {
          const data: Cita[] = await respuesta.json()
          setCitas(data)
          localStorage.setItem("citasSanMarcos", JSON.stringify(data))
        }
      } catch {
        const locales = localStorage.getItem("citasSanMarcos")
        if (locales) {
          setCitas(JSON.parse(locales))
        }
      }
    }

    cargarCitas()
  }, [])

  const cambiarEstado = async (cita: Cita, nuevoEstado: string) => {
    const token = localStorage.getItem("tokenSanMarcos")
    let citaActualizada: Cita = { ...cita, estado: nuevoEstado }

    try {
      const respuesta = await fetch(`${API_CITAS}/${cita.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(citaActualizada)
      })

      if (!respuesta.ok) {
        const errorData = await respuesta.json().catch(() => null)
        alert(errorData?.mensaje || "No se pudo actualizar el estado de la cita.")
        return
      }

      const data = await respuesta.json().catch(() => null)
      if (data && data.id) {
        citaActualizada = data
      }
    } catch {
      void 0
    }

    const nuevaLista = citas.map((c) => (c.id === cita.id ? citaActualizada : c))
    setCitas(nuevaLista)
    localStorage.setItem("citasSanMarcos", JSON.stringify(nuevaLista))
  }

  const eliminarCita = async (cita: Cita) => {
    if (!window.confirm(`Estas seguro de eliminar la cita de ${cita.nombreMascota}?`)) {
      return
    }

    const token = localStorage.getItem("tokenSanMarcos")

    try {
      const respuesta = await fetch(`${API_CITAS}/${cita.id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })

      if (!respuesta.ok) {
        const errorData = await respuesta.json().catch(() => null)
        alert(errorData?.mensaje || "No se pudo eliminar la cita.")
        return
      }
    } catch {
      void 0
    }

    const filtradas = citas.filter((c) => c.id !== cita.id)
    setCitas(filtradas)
    localStorage.setItem("citasSanMarcos", JSON.stringify(filtradas))
  }

  const colorEstado = (estado?: string) => {
    const normalizado = (estado || "").toUpperCase()
    if (normalizado === "ATENDIDA") return "#198754"
    if (normalizado === "CANCELADA") return "#dc3545"
    return "#f59f00"
  }

  if (citas.length === 0) {
    return (
      <div className="card shadow-sm border-0 rounded-4 p-5 text-center">
        <p className="fs-5 text-muted mb-0">
          No hay citas ni atenciones registradas todavia.
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
              <th scope="col">Fecha y Hora</th>
              <th scope="col">Dueño</th>
              <th scope="col">Mascota</th>
              <th scope="col">Servicio</th>
              <th scope="col">Notas</th>
              <th scope="col">Estado</th>
              <th scope="col" className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {citas.map((c) => (
              <tr key={c.id}>
                <td className="fw-bold text-muted">{c.id}</td>
                <td>
                  <div className="fw-semibold">{c.fecha}</div>
                  <small className="text-muted">{c.hora}</small>
                </td>
                <td>
                  <div className="fw-semibold">{c.nombreDueno}</div>
                  <small className="text-muted">{c.telefono}</small>
                </td>
                <td>
                  <div className="fw-semibold">{c.nombreMascota}</div>
                  <small className="text-muted">{c.tipoMascota}</small>
                </td>
                <td>{c.servicio}</td>
                <td>{c.notas || "Sin notas"}</td>
                <td>
                  <span
                    className="badge text-white"
                    style={{ backgroundColor: colorEstado(c.estado) }}
                  >
                    {c.estado || "PENDIENTE"}
                  </span>
                </td>
                <td className="text-center">
                  <div className="d-flex justify-content-center gap-1 flex-wrap">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-success"
                      onClick={() => cambiarEstado(c, "ATENDIDA")}
                    >
                      Atendida
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-warning"
                      onClick={() => cambiarEstado(c, "CANCELADA")}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => eliminarCita(c)}
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

export default GestionAgenda