package cl.veterinaria.gestion.Controller;

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

import cl.veterinaria.gestion.Assemblers.CatalogoModelAssemblers;
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
@RequestMapping("/api/v2/catalogo")
@RequiredArgsConstructor
@Tag(name = "Catálogo / Servicios V2 (HATEOAS)", description = "Operaciones de catálogo con enlaces hipermedia")
public class CatalogoControllerV2 {

    private final CatalogoService catalogoService;
    private final CatalogoModelAssemblers assembler;

    @Operation(summary = "Listar todos los servicios (V2 HATEOAS)")
    @GetMapping(produces = MediaTypes.HAL_JSON_VALUE)
    public CollectionModel<EntityModel<CatalogoResponseDTO>> obtenerTodos() {
        List<EntityModel<CatalogoResponseDTO>> items = catalogoService.obtenerTodos().stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());

        return CollectionModel.of(items,
                linkTo(methodOn(CatalogoControllerV2.class).obtenerTodos()).withSelfRel());
    }

    @Operation(summary = "Obtener servicio por ID (V2 HATEOAS)")
    @GetMapping(value = "/{id}", produces = MediaTypes.HAL_JSON_VALUE)
    public EntityModel<CatalogoResponseDTO> obtenerPorId(@PathVariable("id") Long id) {
        return assembler.toModel(catalogoService.obtenerPorId(id));
    }

    @Operation(summary = "Obtener servicios por categoría (V2 HATEOAS)")
    @GetMapping(value = "/categoria/{categoria}", produces = MediaTypes.HAL_JSON_VALUE)
    public CollectionModel<EntityModel<CatalogoResponseDTO>> obtenerPorCategoria(@PathVariable("categoria") String categoria) {
        List<EntityModel<CatalogoResponseDTO>> items = catalogoService.obtenerPorCategoria(categoria).stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());

        return CollectionModel.of(items,
                linkTo(methodOn(CatalogoControllerV2.class).obtenerPorCategoria(categoria)).withSelfRel());
    }

    @Operation(summary = "Crear servicio (V2 HATEOAS)")
    @PostMapping(produces = MediaTypes.HAL_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPCIONISTA')")
    public ResponseEntity<EntityModel<CatalogoResponseDTO>> crear(@Valid @RequestBody CatalogoRequestDTO request) {
        CatalogoResponseDTO creado = catalogoService.crear(request);
        return new ResponseEntity<>(assembler.toModel(creado), HttpStatus.CREATED);
    }

    @Operation(summary = "Actualizar servicio (V2 HATEOAS)")
    @PutMapping(value = "/{id}", produces = MediaTypes.HAL_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPCIONISTA')")
    public ResponseEntity<EntityModel<CatalogoResponseDTO>> actualizar(
            @PathVariable("id") Long id,
            @Valid @RequestBody CatalogoRequestDTO request) {
        CatalogoResponseDTO actualizado = catalogoService.actualizar(id, request);
        return new ResponseEntity<>(assembler.toModel(actualizado), HttpStatus.OK);
    }

    @Operation(summary = "Eliminar servicio (V2)")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPCIONISTA')")
    public ResponseEntity<Void> eliminar(@PathVariable("id") Long id) {
        catalogoService.eliminar(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
