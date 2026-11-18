package cl.veterinaria.gestion.Controller;

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

import cl.veterinaria.gestion.Service.CatalogoService;
import cl.veterinaria.gestion.dto.CatalogoRequestDTO;
import cl.veterinaria.gestion.dto.CatalogoResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/catalogo")
@RequiredArgsConstructor
@Tag(name = "Catálogo / Servicios", description = "Operaciones CRUD para el catálogo de servicios de la veterinaria")
public class CatalogoController {

    private final CatalogoService catalogoService;

    @Operation(summary = "Listar todos los servicios del catálogo")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Listado de servicios obtenido exitosamente")
    })
    @GetMapping
    public ResponseEntity<List<CatalogoResponseDTO>> obtenerTodos() {
        return new ResponseEntity<>(catalogoService.obtenerTodos(), HttpStatus.OK);
    }

    @Operation(summary = "Obtener servicio por ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Servicio encontrado"),
        @ApiResponse(responseCode = "404", description = "Servicio no encontrado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<CatalogoResponseDTO> obtenerPorId(@PathVariable("id") Long id) {
        return new ResponseEntity<>(catalogoService.obtenerPorId(id), HttpStatus.OK);
    }

    @Operation(summary = "Obtener servicios por categoría")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Servicios filtrados por categoría")
    })
    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<List<CatalogoResponseDTO>> obtenerPorCategoria(@PathVariable("categoria") String categoria) {
        return new ResponseEntity<>(catalogoService.obtenerPorCategoria(categoria), HttpStatus.OK);
    }

    @Operation(summary = "Crear nuevo servicio en el catálogo")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Servicio creado exitosamente"),
        @ApiResponse(responseCode = "400", description = "Solicitud inválida")
    })
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPCIONISTA')")
    public ResponseEntity<CatalogoResponseDTO> crear(@Valid @RequestBody CatalogoRequestDTO request) {
        return new ResponseEntity<>(catalogoService.crear(request), HttpStatus.CREATED);
    }

    @Operation(summary = "Actualizar servicio existente")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Servicio actualizado exitosamente"),
        @ApiResponse(responseCode = "400", description = "Solicitud inválida"),
        @ApiResponse(responseCode = "404", description = "Servicio no encontrado")
    })
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPCIONISTA')")
    public ResponseEntity<CatalogoResponseDTO> actualizar(
            @PathVariable("id") Long id,
            @Valid @RequestBody CatalogoRequestDTO request) {
        return new ResponseEntity<>(catalogoService.actualizar(id, request), HttpStatus.OK);
    }

    @Operation(summary = "Eliminar servicio por ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Servicio eliminado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Servicio no encontrado")
    })
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPCIONISTA')")
    public ResponseEntity<Void> eliminar(@PathVariable("id") Long id) {
        catalogoService.eliminar(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
