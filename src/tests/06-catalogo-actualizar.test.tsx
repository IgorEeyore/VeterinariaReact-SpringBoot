import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import GestionCatalogo from "../componentes/organismos/GestionCatalogo"

describe("Prueba 6: CRUD Catalogo - Actualizar", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
    vi.spyOn(window, "alert").mockImplementation(() => {})
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"))
  })

  it("permite editar el precio de un servicio existente y reflejar el cambio", async () => {
    render(<GestionCatalogo />)

    const botonesEditar = screen.getAllByText("Editar")
    fireEvent.click(botonesEditar[0])

    const inputPrecio = screen.getByPlaceholderText("Ej: 15000")
    fireEvent.change(inputPrecio, { target: { value: "19990" } })

    const botonGuardar = screen.getByText("Guardar")
    fireEvent.click(botonGuardar)

    await waitFor(() => {
      expect(screen.getByText("$19.990")).toBeDefined()
    })
  })
})
