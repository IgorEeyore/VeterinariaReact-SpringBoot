package cl.veterinaria.cliente.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cl.veterinaria.cliente.Service.CitaService;
import cl.veterinaria.cliente.dto.CitaRequestDTO;
import cl.veterinaria.cliente.dto.CitaResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/citas")
@RequiredArgsConstructor
@Tag(name = "Citas", description = "Operaciones relacionadas con el agendamiento y gestión de citas")
public class CitaController {

    private final CitaService citaService;

    @Operation(summary = "Crear nueva cita médica")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Cita creada exitosamente"),
        @ApiResponse(responseCode = "400", description = "Solicitud inválida")
    })
    @PostMapping
    public ResponseEntity<CitaResponseDTO> crearCita(@Valid @RequestBody CitaRequestDTO request) {
        return new ResponseEntity<>(citaService.crearCita(request), HttpStatus.CREATED);
    }

    @Operation(summary = "Listar todas las citas")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Listado de citas obtenido exitosamente")
    })
    @GetMapping
    public ResponseEntity<List<CitaResponseDTO>> obtenerTodas() {
        return new ResponseEntity<>(citaService.obtenerTodas(), HttpStatus.OK);
    }

    @Operation(summary = "Obtener cita por ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Cita encontrada"),
        @ApiResponse(responseCode = "404", description = "Cita no encontrada")
    })
    @GetMapping("/{id}")
    public ResponseEntity<CitaResponseDTO> obtenerPorId(@PathVariable("id") Long id) {
        return new ResponseEntity<>(citaService.obtenerPorId(id), HttpStatus.OK);
    }

    @Operation(summary = "Obtener citas por nombre del dueño")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Citas encontradas para el dueño")
    })
    @GetMapping("/dueno/{nombreDueno}")
    public ResponseEntity<List<CitaResponseDTO>> obtenerPorDueno(@PathVariable("nombreDueno") String nombreDueno) {
        return new ResponseEntity<>(citaService.obtenerPorDueno(nombreDueno), HttpStatus.OK);
    }

    @Operation(summary = "Actualizar datos de una cita")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Cita actualizada"),
        @ApiResponse(responseCode = "400", description = "Solicitud inválida"),
        @ApiResponse(responseCode = "404", description = "Cita no encontrada")
    })
    @PutMapping("/{id}")
    public ResponseEntity<CitaResponseDTO> actualizarCita(
            @PathVariable("id") Long id,
            @Valid @RequestBody CitaRequestDTO request) {
        return new ResponseEntity<>(citaService.actualizarCita(id, request), HttpStatus.OK);
    }

    @Operation(summary = "Cancelar una cita")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Cita cancelada"),
        @ApiResponse(responseCode = "404", description = "Cita no encontrada")
    })
    @PutMapping("/{id}/cancelar")
    public ResponseEntity<CitaResponseDTO> cancelarCita(@PathVariable("id") Long id) {
        return new ResponseEntity<>(citaService.cancelarCita(id), HttpStatus.OK);
    }

    @Operation(summary = "Eliminar cita por ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Cita eliminada"),
        @ApiResponse(responseCode = "404", description = "Cita no encontrada")
    })
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminarCita(@PathVariable("id") Long id) {
        citaService.eliminarCita(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
