import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import CampoFormulario from "../moleculas/CampoFormulario"

interface Usuario {
  id: number
  nombre: string
  correo: string
  rol: "Admin" | "Cliente"
}

const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const API_USUARIOS = "http://localhost:8080/api/v1/usuarios"

function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [nombre, setNombre] = useState("")
  const [correo, setCorreo] = useState("")
  const [idEditando, setIdEditando] = useState<number | null>(null)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  const obtenerHeaders = () => {
    const token = localStorage.getItem("tokenSanMarcos")
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  }

  const cargarUsuarios = async () => {
    try {
      const respuesta = await fetch(API_USUARIOS, {
        headers: obtenerHeaders()
      })
      if (respuesta.ok) {
        const data: Usuario[] = await respuesta.json()
        setUsuarios(data)
      }
    } catch {
      void 0
    }
  }

  useEffect(() => {
    const iniciarCarga = async () => {
      const token = localStorage.getItem("tokenSanMarcos")
      try {
        const respuesta = await fetch(API_USUARIOS, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
        if (respuesta.ok) {
          const data: Usuario[] = await respuesta.json()
          setUsuarios(data)
        }
      } catch {
        void 0
      }
    }

    iniciarCarga()
  }, [])

  const abrirCrear = () => {
    setIdEditando(null)
    setNombre("")
    setCorreo("")
    setMostrarFormulario(true)
  }

  const abrirEditar = (usuario: Usuario) => {
    setIdEditando(usuario.id)
    setNombre(usuario.nombre)
    setCorreo(usuario.correo)
    setMostrarFormulario(true)
  }

  const cancelar = () => {
    setMostrarFormulario(false)
    setIdEditando(null)
    setNombre("")
    setCorreo("")
  }

  const guardarUsuario = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const nombreLimpio = nombre.trim()
    const correoLimpio = correo.trim().toLowerCase()

    if (!nombreLimpio || !correoLimpio) {
      alert("Debes completar todos los campos obligatorios.")
      return
    }

    if (!formatoCorreo.test(correoLimpio)) {
      alert("Ingrese un correo electronico valido.")
      return
    }

    try {
      if (idEditando !== null) {
        const respuesta = await fetch(`${API_USUARIOS}/${idEditando}`, {
          method: "PUT",
          headers: obtenerHeaders(),
          body: JSON.stringify({ nombre: nombreLimpio, correo: correoLimpio })
        })

        if (!respuesta.ok) {
          const errorData = await respuesta.json().catch(() => null)
          alert(errorData?.mensaje || "No se pudo actualizar el usuario.")
          return
        }

        alert("Usuario actualizado con exito.")
      } else {
        const respuesta = await fetch(API_USUARIOS, {
          method: "POST",
          headers: obtenerHeaders(),
          body: JSON.stringify({
            nombre: nombreLimpio,
            correo: correoLimpio,
            rol: "Cliente"
          })
        })

        if (!respuesta.ok) {
          const errorData = await respuesta.json().catch(() => null)
          alert(errorData?.mensaje || "No se pudo crear el usuario.")
          return
        }

        alert("Usuario creado con exito.")
      }

      await cargarUsuarios()
      cancelar()
    } catch {
      alert("No se pudo conectar con el servidor de usuarios.")
    }
  }

  const eliminarUsuario = async (usuario: Usuario) => {
    if (usuario.rol === "Admin") return

    if (!window.confirm(`Estas seguro de eliminar al usuario ${usuario.nombre}?`)) {
      return
    }

    try {
      const respuesta = await fetch(`${API_USUARIOS}/${usuario.id}`, {
        method: "DELETE",
        headers: obtenerHeaders()
      })

      if (!respuesta.ok) {
        const errorData = await respuesta.json().catch(() => null)
        alert(errorData?.mensaje || "No se pudo eliminar el usuario.")
        return
      }

      await cargarUsuarios()
    } catch {
      alert("No se pudo conectar con el servidor de usuarios.")
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-end mb-4">
        <button
          type="button"
          className="btn text-white fw-bold px-4 py-2"
          style={{ backgroundColor: "#2D3161" }}
          onClick={abrirCrear}
        >
          + Nuevo Usuario
        </button>
      </div>

      {mostrarFormulario && (
        <div className="card shadow-sm border-0 rounded-4 p-4 mb-4 bg-light">
          <h5 className="fw-bold mb-3" style={{ color: "#2D3161" }}>
            {idEditando !== null ? "Editar Usuario" : "Crear Nuevo Usuario"}
          </h5>

          <form onSubmit={guardarUsuario}>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <CampoFormulario
                  etiqueta="Nombre"
                  tipo="text"
                  nombre="nombre"
                  valor={nombre}
                  placeholder="Ej: Maria Gonzalez"
                  obligatorio={true}
                  alCambiar={setNombre}
                />
              </div>

              <div className="col-12 col-md-6">
                <CampoFormulario
                  etiqueta="Correo Electronico"
                  tipo="email"
                  nombre="correo"
                  valor={correo}
                  placeholder="Ej: maria@correo.cl"
                  obligatorio={true}
                  alCambiar={setCorreo}
                />
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-3">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={cancelar}
              >
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
                <th scope="col" style={{ width: "80px" }}>ID</th>
                <th scope="col">Nombre</th>
                <th scope="col">Correo</th>
                <th scope="col">Rol</th>
                <th scope="col" className="text-center" style={{ width: "160px" }}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td className="fw-bold text-muted">{u.id}</td>
                  <td className="fw-semibold">{u.nombre}</td>
                  <td>{u.correo}</td>
                  <td>
                    <span
                      className="badge"
                      style={{
                        backgroundColor: u.rol === "Admin" ? "#2D3161" : "#6c757d",
                        color: "#fff"
                      }}
                    >
                      {u.rol}
                    </span>
                  </td>
                  <td className="text-center">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary me-2"
                      onClick={() => abrirEditar(u)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      disabled={u.rol === "Admin"}
                      onClick={() => eliminarUsuario(u)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default GestionUsuarios