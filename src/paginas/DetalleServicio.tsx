import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { listaServicios } from "../datos/serviciosIniciales"
import type { Servicio } from "../datos/serviciosIniciales"

const API_CATALOGO = "http://localhost:8080/api/v1/catalogo"

const obtenerServicioLocal = (idParam?: string): Servicio | undefined => {
  const idNumerico = Number(idParam)
  let catalogo: Servicio[] = listaServicios
  try {
    const guardados = localStorage.getItem("catalogoSanMarcos")
    if (guardados) catalogo = JSON.parse(guardados)
  } catch {
    catalogo = listaServicios
  }
  const itemGuardado = catalogo.find((s) => s.id === idNumerico)
  const itemOriginal = listaServicios.find((s) => s.id === idNumerico)

  if (!itemGuardado) return undefined
  return {
    ...itemGuardado,
    precio: Number(itemGuardado.precio),
    imagen: itemGuardado.imagen || itemOriginal?.imagen || "",
    descripcionCorta: itemGuardado.descripcionCorta || itemOriginal?.descripcionCorta || "",
    descripcionLarga: itemGuardado.descripcionLarga || itemOriginal?.descripcionLarga || ""
  }
}

function DetalleServicio() {
  const { id } = useParams()
  const [servicio, setServicio] = useState<Servicio | undefined>(() => obtenerServicioLocal(id))

  useEffect(() => {
    const cargarServicio = async () => {
      if (!id) return
      try {
        const respuesta = await fetch(`${API_CATALOGO}/${id}`)
        if (respuesta.ok) {
          const data: Servicio = await respuesta.json()
          const itemOriginal = listaServicios.find((s) => s.id === data.id)
          setServicio({
            ...data,
            precio: Number(data.precio),
            imagen: data.imagen || itemOriginal?.imagen || "",
            descripcionCorta: data.descripcionCorta || itemOriginal?.descripcionCorta || "",
            descripcionLarga: data.descripcionLarga || itemOriginal?.descripcionLarga || ""
          })
        }
      } catch {
        setServicio(obtenerServicioLocal(id))
      }
    }

    cargarServicio()
  }, [id])

  const agregarAlCarrito = () => {
    if (!servicio) return
    const carritoActual = JSON.parse(localStorage.getItem("carritoSanMarcos") || "[]")
    carritoActual.push(servicio)
    localStorage.setItem("carritoSanMarcos", JSON.stringify(carritoActual))
    alert(`${servicio.nombre} se agrego al carrito.`)
  }

  if (!servicio) {
    return (
      <div className="container py-5 text-center">
        <h2>Servicio no encontrado</h2>
        <p className="text-muted">El servicio con ID {id} no existe en nuestro catalogo.</p>
        <Link to="/catalogo" className="btn btn-secondary mt-3">
          Volver al Catalogo
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <div className="card shadow-sm border-0 rounded-4 p-4">
        <div className="row align-items-center g-4">
          <div className="col-12 col-md-6 text-center">
            {servicio.imagen ? (
              <img
                src={servicio.imagen}
                alt={servicio.nombre}
                className="img-fluid rounded-4 shadow-sm w-100"
                style={{ maxHeight: "350px", objectFit: "cover" }}
              />
            ) : (
              <div
                className="d-flex align-items-center justify-content-center bg-light text-muted fw-semibold rounded-4 shadow-sm w-100"
                style={{ height: "280px" }}
              >
                Sin imagen
              </div>
            )}
          </div>
          <div className="col-12 col-md-6">
            <span className="badge text-white mb-2" style={{ backgroundColor: "#2ec4b6" }}>
              {servicio.categoria}
            </span>
            <h1 className="fw-bold mb-2" style={{ color: "#2D3161" }}>
              {servicio.nombre}
            </h1>
            <p className="fs-3 fw-bold text-success mb-3">
              ${servicio.precio.toLocaleString("es-CL")}
            </p>
            {servicio.descripcionCorta && (
              <p className="lead text-muted mb-3">{servicio.descripcionCorta}</p>
            )}
            {servicio.descripcionLarga ? (
              <p className="mb-4">{servicio.descripcionLarga}</p>
            ) : (
              <p className="mb-4 text-secondary">
                Atencion profesional y personalizada en Veterinaria San Marcos.
              </p>
            )}
            <div className="d-flex gap-3 flex-wrap">
              <button
                type="button"
                className="btn text-white fw-bold px-4 py-2"
                style={{ backgroundColor: "#2ec4b6" }}
                onClick={agregarAlCarrito}
              >
                🛒 Agregar al Carrito
              </button>
              <Link to="/catalogo" className="btn btn-outline-secondary fw-semibold px-4 py-2">
                ← Volver al Catalogo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetalleServicio
