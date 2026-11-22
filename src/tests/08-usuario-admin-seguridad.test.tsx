import { describe, it, expect, beforeEach, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import GestionUsuarios from "../componentes/organismos/GestionUsuarios"

describe("Prueba 8: CRUD Usuarios - Seguridad Admin", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it("verifica que el boton eliminar del rol Admin este deshabilitado", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => [
        { id: 1, nombre: "Admin", correo: "admin@demo.cl", rol: "Admin" },
        { id: 2, nombre: "Cliente Ejemplo", correo: "cliente@correo.cl", rol: "Cliente" }
      ]
    } as Response)

    render(<GestionUsuarios />)

    await waitFor(() => {
      const filas = screen.getAllByRole("row")
      const filaAdmin = filas.find((f) => f.textContent?.includes("Admin"))
      expect(filaAdmin).toBeDefined()

      const botonEliminarAdmin = filaAdmin?.querySelector(".btn-outline-danger") as HTMLButtonElement
      expect(botonEliminarAdmin.disabled).toBe(true)
    })
  })
})