import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import CampoFormulario from "../moleculas/CampoFormulario"

interface Usuario {
  id: number
  rut?: string | null
  nombre: string
  correo: string
  rol: "Admin" | "Cliente"
}

const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const formatoRut = /^[0-9]{7,8}[0-9kK]$/
const API_USUARIOS = "http://localhost:8080/api/v1/usuarios"

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

function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [rut, setRut] = useState("")
  const [nombre, setNombre] = useState("")
  const [correo, setCorreo] = useState("")
  const [contrasena, setContrasena] = useState("")
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
    setRut("")
    setNombre("")
    setCorreo("")
    setContrasena("")
    setMostrarFormulario(true)
  }

  const abrirEditar = (usuario: Usuario) => {
    setIdEditando(usuario.id)
    setRut(usuario.rut || "")
    setNombre(usuario.nombre)
    setCorreo(usuario.correo)
    setContrasena("")
    setMostrarFormulario(true)
  }

  const cancelar = () => {
    setMostrarFormulario(false)
    setIdEditando(null)
    setRut("")
    setNombre("")
    setCorreo("")
    setContrasena("")
  }

  const guardarUsuario = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const rutLimpio = rut.trim()
    const nombreLimpio = nombre.trim()
    const correoLimpio = correo.trim().toLowerCase()
    const claveLimpia = contrasena.trim()

    if (!nombreLimpio || !correoLimpio) {
      alert("Debes completar todos los campos obligatorios.")
      return
    }

    if (!formatoCorreo.test(correoLimpio)) {
      alert("Ingrese un correo electronico valido.")
      return
    }

    if (rutLimpio && (!formatoRut.test(rutLimpio) || !validarRut(rutLimpio))) {
      alert("El RUN ingresado no es valido (formato sin puntos ni guion y digito verificador correcto).")
      return
    }

    if (claveLimpia && (claveLimpia.length < 4 || claveLimpia.length > 10)) {
      alert("La contrasena debe tener entre 4 y 10 caracteres.")
      return
    }

    try {
      if (idEditando !== null) {
        const respuesta = await fetch(`${API_USUARIOS}/${idEditando}`, {
          method: "PUT",
          headers: obtenerHeaders(),
          body: JSON.stringify({
            nombre: nombreLimpio,
            correo: correoLimpio,
            ...(rutLimpio ? { rut: rutLimpio } : {}),
            ...(claveLimpia ? { contrasena: claveLimpia } : {})
          })
        })

        if (!respuesta.ok) {
          const errorData = await respuesta.json().catch(() => null)
          alert(errorData?.mensaje || "No se pudo actualizar el usuario.")
          return
        }

        const activoTexto = localStorage.getItem("usuarioActivo")
        if (activoTexto) {
          try {
            const activo = JSON.parse(activoTexto)
            if (activo.id === idEditando) {
              const cambioCorreo = activo.correo?.toLowerCase() !== correoLimpio
              if (cambioCorreo) {
                localStorage.removeItem("usuarioActivo")
                localStorage.removeItem("tokenSanMarcos")
                alert("Usuario actualizado. Como cambiaste tu correo de sesion, inicia sesion nuevamente.")
                window.location.href = "/login"
                return
              }
              localStorage.setItem(
                "usuarioActivo",
                JSON.stringify({ ...activo, nombre: nombreLimpio, correo: correoLimpio })
              )
            }
          } catch {
            void 0
          }
        }

        alert("Usuario actualizado con exito.")
      } else {
        const respuesta = await fetch(API_USUARIOS, {
          method: "POST",
          headers: obtenerHeaders(),
          body: JSON.stringify({
            nombre: nombreLimpio,
            correo: correoLimpio,
            rol: "Cliente",
            ...(rutLimpio ? { rut: rutLimpio } : {}),
            ...(claveLimpia ? { contrasena: claveLimpia } : {})
          })
        })

        if (!respuesta.ok) {
          const errorData = await respuesta.json().catch(() => null)
          alert(errorData?.mensaje || "No se pudo crear el usuario.")
          return
        }

        alert(
          claveLimpia
            ? "Usuario creado con exito."
            : "Usuario creado con exito (contrasena inicial por defecto: 1234)."
        )
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

              <div className="col-12 col-md-6">
                <CampoFormulario
                  etiqueta="RUN (opcional, sin puntos ni guion)"
                  tipo="text"
                  nombre="rut"
                  valor={rut}
                  placeholder="Ej: 123456785"
                  alCambiar={(val) => setRut(val.replace(/[^0-9kK]/g, "").slice(0, 9))}
                />
              </div>

              <div className="col-12 col-md-6">
                <CampoFormulario
                  etiqueta={
                    idEditando !== null
                      ? "Nueva Contrasena (opcional)"
                      : "Contrasena (opcional, por defecto 1234)"
                  }
                  tipo="password"
                  nombre="contrasena"
                  valor={contrasena}
                  placeholder="Entre 4 y 10 caracteres"
                  alCambiar={(val) => setContrasena(val.slice(0, 10))}
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
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-muted">
                    No hay usuarios registrados o no se pudo conectar con el servidor.
                  </td>
                </tr>
              ) : (
                usuarios.map((u) => (
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default GestionUsuarios
