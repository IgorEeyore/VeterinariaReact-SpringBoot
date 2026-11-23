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

import cl.veterinaria.cliente.Service.MensajeContactoService;
import cl.veterinaria.cliente.dto.MensajeContactoRequestDTO;
import cl.veterinaria.cliente.dto.MensajeContactoResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/mensajes-contacto")
@RequiredArgsConstructor
@Tag(name = "Mensajes de Contacto", description = "Operaciones de consulta y recepción de mensajes de contacto")
public class MensajeContactoController {

    private final MensajeContactoService mensajeContactoService;

    @Operation(summary = "Enviar nuevo mensaje de contacto")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Mensaje enviado exitosamente"),
        @ApiResponse(responseCode = "400", description = "Solicitud inválida")
    })
    @PostMapping
    public ResponseEntity<MensajeContactoResponseDTO> crearMensaje(@Valid @RequestBody MensajeContactoRequestDTO request) {
        return new ResponseEntity<>(mensajeContactoService.crearMensaje(request), HttpStatus.CREATED);
    }

    @Operation(summary = "Listar todos los mensajes de contacto")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Listado de mensajes obtenido exitosamente")
    })
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<MensajeContactoResponseDTO>> obtenerTodos() {
        return new ResponseEntity<>(mensajeContactoService.obtenerTodos(), HttpStatus.OK);
    }

    @Operation(summary = "Obtener mensaje de contacto por ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Mensaje encontrado"),
        @ApiResponse(responseCode = "404", description = "Mensaje no encontrado")
    })
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MensajeContactoResponseDTO> obtenerPorId(@PathVariable("id") Long id) {
        return new ResponseEntity<>(mensajeContactoService.obtenerPorId(id), HttpStatus.OK);
    }

    @Operation(summary = "Marcar mensaje como leído")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Mensaje marcado como leído"),
        @ApiResponse(responseCode = "404", description = "Mensaje no encontrado")
    })
    @PutMapping("/{id}/marcar-leido")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MensajeContactoResponseDTO> marcarLeido(@PathVariable("id") Long id) {
        return new ResponseEntity<>(mensajeContactoService.marcarLeido(id), HttpStatus.OK);
    }

    @Operation(summary = "Eliminar mensaje de contacto por ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Mensaje eliminado"),
        @ApiResponse(responseCode = "404", description = "Mensaje no encontrado")
    })
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminarMensaje(@PathVariable("id") Long id) {
        mensajeContactoService.eliminarMensaje(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
