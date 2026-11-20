package cl.veterinaria.cliente.Controller;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.MediaTypes;
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

import cl.veterinaria.cliente.Assemblers.CitaModelAssemblers;
import cl.veterinaria.cliente.Service.CitaService;
import cl.veterinaria.cliente.dto.CitaRequestDTO;
import cl.veterinaria.cliente.dto.CitaResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v2/citas")
@RequiredArgsConstructor
@Tag(name = "Citas V2 (HATEOAS)", description = "Operaciones de citas con enlaces HATEOAS")
public class CitaControllerV2 {

    private final CitaService citaService;
    private final CitaModelAssemblers assembler;

    @Operation(summary = "Crear nueva cita (V2 HATEOAS)")
    @PostMapping(produces = MediaTypes.HAL_JSON_VALUE)
    public ResponseEntity<EntityModel<CitaResponseDTO>> crearCita(@Valid @RequestBody CitaRequestDTO request) {
        CitaResponseDTO creada = citaService.crearCita(request);
        return new ResponseEntity<>(assembler.toModel(creada), HttpStatus.CREATED);
    }

    @Operation(summary = "Listar todas las citas (V2 HATEOAS)")
    @GetMapping(produces = MediaTypes.HAL_JSON_VALUE)
    public CollectionModel<EntityModel<CitaResponseDTO>> obtenerTodas() {
        List<EntityModel<CitaResponseDTO>> citas = citaService.obtenerTodas().stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());

        return CollectionModel.of(citas,
                linkTo(methodOn(CitaControllerV2.class).obtenerTodas()).withSelfRel());
    }

    @Operation(summary = "Obtener cita por ID (V2 HATEOAS)")
    @GetMapping(value = "/{id}", produces = MediaTypes.HAL_JSON_VALUE)
    public EntityModel<CitaResponseDTO> obtenerPorId(@PathVariable("id") Long id) {
        return assembler.toModel(citaService.obtenerPorId(id));
    }

    @Operation(summary = "Obtener citas por dueño (V2 HATEOAS)")
    @GetMapping(value = "/dueno/{nombreDueno}", produces = MediaTypes.HAL_JSON_VALUE)
    public CollectionModel<EntityModel<CitaResponseDTO>> obtenerPorDueno(@PathVariable("nombreDueno") String nombreDueno) {
        List<EntityModel<CitaResponseDTO>> citas = citaService.obtenerPorDueno(nombreDueno).stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());

        return CollectionModel.of(citas,
                linkTo(methodOn(CitaControllerV2.class).obtenerPorDueno(nombreDueno)).withSelfRel());
    }

    @Operation(summary = "Actualizar cita (V2 HATEOAS)")
    @PutMapping(value = "/{id}", produces = MediaTypes.HAL_JSON_VALUE)
    public ResponseEntity<EntityModel<CitaResponseDTO>> actualizarCita(
            @PathVariable("id") Long id,
            @Valid @RequestBody CitaRequestDTO request) {
        CitaResponseDTO actualizada = citaService.actualizarCita(id, request);
        return new ResponseEntity<>(assembler.toModel(actualizada), HttpStatus.OK);
    }

    @Operation(summary = "Cancelar cita (V2 HATEOAS)")
    @PutMapping(value = "/{id}/cancelar", produces = MediaTypes.HAL_JSON_VALUE)
    public ResponseEntity<EntityModel<CitaResponseDTO>> cancelarCita(@PathVariable("id") Long id) {
        CitaResponseDTO cancelada = citaService.cancelarCita(id);
        return new ResponseEntity<>(assembler.toModel(cancelada), HttpStatus.OK);
    }

    @Operation(summary = "Eliminar cita (V2)")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminarCita(@PathVariable("id") Long id) {
        citaService.eliminarCita(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
