import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import FormularioAgendar from "../componentes/organismos/FormularioAgendar"

const obtenerFechaManana = (): string => {
  const fecha = new Date()
  fecha.setDate(fecha.getDate() + 1)
  const anio = fecha.getFullYear()
  const mes = String(fecha.getMonth() + 1).padStart(2, "0")
  const dia = String(fecha.getDate()).padStart(2, "0")
  return `${anio}-${mes}-${dia}`
}

describe("Prueba 14: Formulario Agendar Cita - Flujo Completo", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it("permite completar el formulario y confirmar la reserva de atencion", async () => {
    const fechaFutura = obtenerFechaManana()
    const alerta = vi.spyOn(window, "alert").mockImplementation(() => {})
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ id: 1 })
    } as Response)

    render(
      <MemoryRouter>
        <FormularioAgendar />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByPlaceholderText("Ej: Carolina Munoz"), {
      target: { value: "Maria Gonzalez" }
    })
    fireEvent.change(screen.getByPlaceholderText("Ej: +56 9 1234 5678"), {
      target: { value: "+56911223344" }
    })
    fireEvent.change(screen.getByPlaceholderText("Ej: Rocky"), {
      target: { value: "Boby" }
    })

    const selectEspecie = screen.getAllByRole("combobox")[0]
    fireEvent.change(selectEspecie, { target: { value: "Perro" } })

    const inputFecha = document.querySelector('input[type="date"]') as HTMLInputElement
    fireEvent.change(inputFecha, { target: { value: fechaFutura } })

    const inputHora = document.querySelector('input[type="time"]') as HTMLInputElement
    fireEvent.change(inputHora, { target: { value: "11:00" } })

    fireEvent.click(screen.getByRole("button", { name: "Confirmar y Agendar Cita" }))

    await waitFor(() => {
      expect(alerta).toHaveBeenCalledWith(
        `Cita agendada con exito para Boby el dia ${fechaFutura} a las 11:00. Te esperamos en Veterinaria San Marcos.`
      )
    })
  })

  it("rechaza agendar una cita en una fecha pasada", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => []
    } as Response)

    render(
      <MemoryRouter>
        <FormularioAgendar />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByPlaceholderText("Ej: Carolina Munoz"), {
      target: { value: "Maria Gonzalez" }
    })
    fireEvent.change(screen.getByPlaceholderText("Ej: +56 9 1234 5678"), {
      target: { value: "+56911223344" }
    })
    fireEvent.change(screen.getByPlaceholderText("Ej: Rocky"), {
      target: { value: "Boby" }
    })

    const inputFecha = document.querySelector('input[type="date"]') as HTMLInputElement
    fireEvent.change(inputFecha, { target: { value: "2020-01-01" } })

    const inputHora = document.querySelector('input[type="time"]') as HTMLInputElement
    fireEvent.change(inputHora, { target: { value: "11:00" } })

    fetchSpy.mockClear()
    fireEvent.click(screen.getByRole("button", { name: "Confirmar y Agendar Cita" }))

    expect(screen.getByText("No se puede agendar una cita en una fecha pasada")).toBeDefined()
    expect(fetchSpy).not.toHaveBeenCalled()
  })
})
