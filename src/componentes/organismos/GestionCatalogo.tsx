import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import CampoFormulario from "../moleculas/CampoFormulario"
import { listaServicios } from "../../datos/serviciosIniciales"
import type { Servicio } from "../../datos/serviciosIniciales"

const API_CATALOGO = "http://localhost:8080/api/v1/catalogo"

function GestionCatalogo() {
  const [servicios, setServicios] = useState<Servicio[]>(() => {
    try {
      const datos = localStorage.getItem("catalogoSanMarcos")
      return datos ? JSON.parse(datos) : listaServicios
    } catch {
      return listaServicios
    }
  })

  const [nombre, setNombre] = useState("")
  const [categoria, setCategoria] = useState("Servicio")
  const [precio, setPrecio] = useState("")
  const [descripcionCorta, setDescripcionCorta] = useState("")
  const [descripcionLarga, setDescripcionLarga] = useState("")
  const [imagenEditando, setImagenEditando] = useState("")
  const [idEditando, setIdEditando] = useState<number | null>(null)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  useEffect(() => {
    const cargarServicios = async () => {
      try {
        const respuesta = await fetch(API_CATALOGO)
        if (respuesta.ok) {
          const data: Servicio[] = await respuesta.json()
          const normalizados = data.map((s) => ({ ...s, precio: Number(s.precio) }))
          setServicios(normalizados)
          localStorage.setItem("catalogoSanMarcos", JSON.stringify(normalizados))
        }
      } catch {
        void 0
      }
    }

    cargarServicios()
  }, [])

  const guardarCambios = (nuevaLista: Servicio[]) => {
    setServicios(nuevaLista)
    localStorage.setItem("catalogoSanMarcos", JSON.stringify(nuevaLista))
  }

  const abrirCrear = () => {
    setIdEditando(null)
    setNombre("")
    setCategoria("Servicio")
    setPrecio("")
    setDescripcionCorta("")
    setDescripcionLarga("")
    setImagenEditando("")
    setMostrarFormulario(true)
  }

  const abrirEditar = (item: Servicio) => {
    setIdEditando(item.id)
    setNombre(item.nombre)
    setCategoria(item.categoria)
    setPrecio(String(item.precio))
    setDescripcionCorta(item.descripcionCorta || "")
    setDescripcionLarga(item.descripcionLarga || "")
    setImagenEditando(item.imagen || "")
    setMostrarFormulario(true)
  }

  const cancelar = () => {
    setMostrarFormulario(false)
    setIdEditando(null)
    setNombre("")
    setPrecio("")
    setDescripcionCorta("")
    setDescripcionLarga("")
    setImagenEditando("")
  }

  const guardarServicio = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const nombreLimpio = nombre.trim()
    const precioNumero = Number(precio)

    if (!nombreLimpio || !precio.trim()) {
      alert("Debes completar todos los campos obligatorios.")
      return
    }

    if (isNaN(precioNumero) || precioNumero <= 0) {
      alert("El precio debe ser un numero valido mayor a cero.")
      return
    }

    const token = localStorage.getItem("tokenSanMarcos")
    const payload = {
      nombre: nombreLimpio,
      categoria,
      precio: precioNumero,
      descripcionCorta: descripcionCorta.trim(),
      descripcionLarga: descripcionLarga.trim(),
      imagen: imagenEditando
    }

    if (idEditando !== null) {
      let itemActualizado: Servicio = { id: idEditando, ...payload }

      try {
        const respuesta = await fetch(`${API_CATALOGO}/${idEditando}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify(payload)
        })

        if (!respuesta.ok) {
          const errorData = await respuesta.json().catch(() => null)
          alert(errorData?.mensaje || "No se pudo actualizar el servicio.")
          return
        }

        const data = await respuesta.json().catch(() => null)
        if (data && data.id) {
          itemActualizado = { ...data, precio: Number(data.precio) }
        }
      } catch {
        void 0
      }

      const actualizados = servicios.map((s) => (s.id === idEditando ? itemActualizado : s))
      guardarCambios(actualizados)
      alert("Servicio actualizado con exito.")
    } else {
      const nuevoIdLocal = servicios.length > 0 ? Math.max(...servicios.map((s) => s.id)) + 1 : 1
      let nuevoServicio: Servicio = { id: nuevoIdLocal, ...payload }

      try {
        const respuesta = await fetch(API_CATALOGO, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify(payload)
        })

        if (!respuesta.ok) {
          const errorData = await respuesta.json().catch(() => null)
          alert(errorData?.mensaje || "No se pudo crear el servicio.")
          return
        }

        const data = await respuesta.json().catch(() => null)
        if (data && data.id) {
          nuevoServicio = { ...data, precio: Number(data.precio) }
        }
      } catch {
        void 0
      }

      guardarCambios([...servicios, nuevoServicio])
      alert("Servicio creado con exito.")
    }

    cancelar()
  }

  const eliminarServicio = async (id: number) => {
    if (!window.confirm("Estas seguro de eliminar este item?")) {
      return
    }

    const token = localStorage.getItem("tokenSanMarcos")

    try {
      const respuesta = await fetch(`${API_CATALOGO}/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })

      if (!respuesta.ok) {
        const errorData = await respuesta.json().catch(() => null)
        alert(errorData?.mensaje || "No se pudo eliminar el servicio.")
        return
      }
    } catch {
      void 0
    }

    const filtrados = servicios.filter((s) => s.id !== id)
    guardarCambios(filtrados)
  }

  return (
    <div>
      <div className="d-flex justify-content-end mb-4">
        <button
          type="button"
          className="btn text-white fw-bold px-4"
          style={{ backgroundColor: "#2ec4b6" }}
          onClick={abrirCrear}
        >
          + Nuevo Item
        </button>
      </div>

      {mostrarFormulario && (
        <div className="card shadow-sm border-0 rounded-4 p-4 mb-4 bg-white">
          <h4 className="fw-bold mb-3" style={{ color: "#2D3161" }}>
            {idEditando !== null ? "Editar Servicio" : "Agregar Nuevo Servicio"}
          </h4>
          <form onSubmit={guardarServicio}>
            <div className="row g-3">
              <div className="col-12 col-md-5">
                <CampoFormulario
                  etiqueta="Nombre del Servicio o Producto"
                  tipo="text"
                  nombre="nombre"
                  valor={nombre}
                  placeholder="Ej: Vacunacion felina"
                  obligatorio={true}
                  alCambiar={setNombre}
                />
              </div>
              <div className="col-12 col-md-4">
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Categoria <span className="text-danger">(*)</span>
                  </label>
                  <select
                    className="form-select"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                  >
                    <option value="Servicio">Servicio</option>
                    <option value="Medicamento">Medicamento</option>
                    <option value="Producto">Producto</option>
                  </select>
                </div>
              </div>
              <div className="col-12 col-md-3">
                <CampoFormulario
                  etiqueta="Precio ($ CLP)"
                  tipo="number"
                  nombre="precio"
                  valor={precio}
                  placeholder="Ej: 15000"
                  obligatorio={true}
                  alCambiar={setPrecio}
                />
              </div>
            </div>

            <div className="row g-3">
              <div className="col-12 col-md-6">
                <CampoFormulario
                  etiqueta="Descripcion Corta"
                  tipo="text"
                  nombre="descripcionCorta"
                  valor={descripcionCorta}
                  placeholder="Ej: Revision completa para tu mascota"
                  alCambiar={setDescripcionCorta}
                />
              </div>
              <div className="col-12 col-md-6 mb-3">
                <label className="form-label fw-semibold">
                  Descripcion Detallada
                </label>
                <textarea
                  className="form-control"
                  rows={2}
                  placeholder="Detalla lo que incluye el servicio o producto..."
                  value={descripcionLarga}
                  onChange={(e) => setDescripcionLarga(e.target.value)}
                />
              </div>
            </div>

            <div className="d-flex gap-2 justify-content-end mt-4">
              <button type="button" className="btn btn-secondary" onClick={cancelar}>
                Cancelar
              </button>
              <button
                type="submit"
                className="btn text-white fw-bold px-4"
                style={{ backgroundColor: "#2ec4b6" }}
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Categoria</th>
                <th>Precio</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {servicios.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-muted">
                    No hay servicios registrados en el catalogo.
                  </td>
                </tr>
              ) : (
                servicios.map((s) => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td className="fw-semibold">{s.nombre}</td>
                    <td>
                      <span className="badge text-white" style={{ backgroundColor: "#2ec4b6" }}>
                        {s.categoria}
                      </span>
                    </td>
                    <td className="fw-bold text-success">${s.precio.toLocaleString("es-CL")}</td>
                    <td className="text-center">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary me-2"
                        onClick={() => abrirEditar(s)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => eliminarServicio(s.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default GestionCatalogo
