import { useEffect, useState } from "react"
import CardServicio from "../moleculas/CardServicio"
import { listaServicios } from "../../datos/serviciosIniciales"
import type { Servicio } from "../../datos/serviciosIniciales"

const API_CATALOGO = "http://localhost:8080/api/v1/catalogo"

const normalizarServicios = (items: Servicio[]): Servicio[] => {
  return items.map((item) => {
    const original = listaServicios.find((s) => s.id === item.id)
    return {
      id: item.id,
      nombre: item.nombre,
      categoria: item.categoria,
      precio: Number(item.precio),
      imagen: item.imagen || original?.imagen || "",
      descripcionCorta: item.descripcionCorta || original?.descripcionCorta || "Servicio profesional para tu mascota.",
      descripcionLarga: item.descripcionLarga || original?.descripcionLarga || "Atencion y cuidado veterinario especializado."
    }
  })
}

const obtenerServiciosLocales = (): Servicio[] => {
  try {
    const guardados = localStorage.getItem("catalogoSanMarcos")
    if (!guardados) return listaServicios
    return normalizarServicios(JSON.parse(guardados))
  } catch {
    return listaServicios
  }
}

function ListadoCatalogo() {
  const [servicios, setServicios] = useState<Servicio[]>(obtenerServiciosLocales)
  const [busqueda, setBusqueda] = useState("")
  const [categoria, setCategoria] = useState("Todos")

  useEffect(() => {
    const cargarCatalogo = async () => {
      try {
        const respuesta = await fetch(API_CATALOGO)
        if (respuesta.ok) {
          const data: Servicio[] = await respuesta.json()
          const normalizados = normalizarServicios(data)
          setServicios(normalizados)
          localStorage.setItem("catalogoSanMarcos", JSON.stringify(normalizados))
        }
      } catch {
        void 0
      }
    }

    cargarCatalogo()
  }, [])

  const agregarAlCarrito = (id: number) => {
    const item = servicios.find((s) => s.id === id)
    if (!item) return
    const carritoActual = JSON.parse(localStorage.getItem("carritoSanMarcos") || "[]")
    carritoActual.push(item)
    localStorage.setItem("carritoSanMarcos", JSON.stringify(carritoActual))
    alert(`${item.nombre} se agrego al carrito.`)
  }

  const categoriasDisponibles = Array.from(
    new Set(["Servicio", "Medicamento", "Producto", ...servicios.map((s) => s.categoria)])
  )

  const serviciosFiltrados = servicios.filter((servicio) => {
    const textoCorta = servicio.descripcionCorta || ""
    const coincideTexto =
      servicio.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      textoCorta.toLowerCase().includes(busqueda.toLowerCase())
    const coincideCategoria =
      categoria === "Todos" || servicio.categoria === categoria
    return coincideTexto && coincideCategoria
  })

  return (
    <>
      <div className="card shadow-sm border-0 p-4 mb-4 rounded-4 bg-white">
        <div className="row g-3">
          <div className="col-12 col-md-8">
            <label className="form-label fw-semibold">
              Buscar por nombre o descripcion
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Ej: Consulta, Vacuna, Peluqueria..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label fw-semibold">
              Filtrar por categoria
            </label>
            <select
              className="form-select"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="Todos">Todas las categorias</option>
              {categoriasDisponibles.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {serviciosFiltrados.length === 0 ? (
        <div className="text-center py-5">
          <p className="fs-5 text-muted">
            No se encontraron servicios que coincidan con la busqueda.
          </p>
        </div>
      ) : (
        <div className="row g-4">
          {serviciosFiltrados.map((servicio) => (
            <div key={servicio.id} className="col-12 col-md-6 col-lg-4">
              <CardServicio
                id={servicio.id}
                nombre={servicio.nombre}
                categoria={servicio.categoria}
                precio={servicio.precio}
                descripcionCorta={servicio.descripcionCorta || ""}
                imagen={servicio.imagen}
                onAgregarCarrito={agregarAlCarrito}
              />
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default ListadoCatalogo
