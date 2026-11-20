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

import cl.veterinaria.cliente.Assemblers.MensajeContactoModelAssembler;
import cl.veterinaria.cliente.Service.MensajeContactoService;
import cl.veterinaria.cliente.dto.MensajeContactoRequestDTO;
import cl.veterinaria.cliente.dto.MensajeContactoResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v2/mensajes-contacto")
@RequiredArgsConstructor
@Tag(name = "Mensajes de Contacto V2 (HATEOAS)", description = "Operaciones de mensajes con enlaces HATEOAS")
public class MensajeContactoControllerV2 {

    private final MensajeContactoService mensajeContactoService;
    private final MensajeContactoModelAssembler assembler;

    @Operation(summary = "Enviar mensaje de contacto (V2 HATEOAS)")
    @PostMapping(produces = MediaTypes.HAL_JSON_VALUE)
    public ResponseEntity<EntityModel<MensajeContactoResponseDTO>> crearMensaje(@Valid @RequestBody MensajeContactoRequestDTO request) {
        MensajeContactoResponseDTO creado = mensajeContactoService.crearMensaje(request);
        return new ResponseEntity<>(assembler.toModel(creado), HttpStatus.CREATED);
    }

    @Operation(summary = "Listar mensajes de contacto (V2 HATEOAS)")
    @GetMapping(produces = MediaTypes.HAL_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPCIONISTA')")
    public CollectionModel<EntityModel<MensajeContactoResponseDTO>> obtenerTodos() {
        List<EntityModel<MensajeContactoResponseDTO>> mensajes = mensajeContactoService.obtenerTodos().stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());

        return CollectionModel.of(mensajes,
                linkTo(methodOn(MensajeContactoControllerV2.class).obtenerTodos()).withSelfRel());
    }

    @Operation(summary = "Obtener mensaje de contacto por ID (V2 HATEOAS)")
    @GetMapping(value = "/{id}", produces = MediaTypes.HAL_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPCIONISTA')")
    public EntityModel<MensajeContactoResponseDTO> obtenerPorId(@PathVariable("id") Long id) {
        return assembler.toModel(mensajeContactoService.obtenerPorId(id));
    }

    @Operation(summary = "Marcar mensaje como leído (V2 HATEOAS)")
    @PutMapping(value = "/{id}/marcar-leido", produces = MediaTypes.HAL_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPCIONISTA')")
    public ResponseEntity<EntityModel<MensajeContactoResponseDTO>> marcarLeido(@PathVariable("id") Long id) {
        MensajeContactoResponseDTO actualizado = mensajeContactoService.marcarLeido(id);
        return new ResponseEntity<>(assembler.toModel(actualizado), HttpStatus.OK);
    }

    @Operation(summary = "Eliminar mensaje de contacto (V2)")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminarMensaje(@PathVariable("id") Long id) {
        mensajeContactoService.eliminarMensaje(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
