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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cl.veterinaria.gestion.Assemblers.CompraModelAssembler;
import cl.veterinaria.gestion.Service.CompraService;
import cl.veterinaria.gestion.dto.CompraRequestDTO;
import cl.veterinaria.gestion.dto.CompraResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v2/compras")
@RequiredArgsConstructor
@Tag(name = "Compras V2 (HATEOAS)", description = "Operaciones de compras con HATEOAS")
public class CompraControllerV2 {

    private final CompraService compraService;
    private final CompraModelAssembler assembler;

    @Operation(summary = "Registrar nueva compra (V2 HATEOAS)")
    @PostMapping(produces = MediaTypes.HAL_JSON_VALUE)
    public ResponseEntity<EntityModel<CompraResponseDTO>> registrarCompra(@Valid @RequestBody CompraRequestDTO request) {
        CompraResponseDTO dto = compraService.registrarCompra(request);
        return new ResponseEntity<>(assembler.toModel(dto), HttpStatus.CREATED);
    }

    @Operation(summary = "Listar compras (V2 HATEOAS)")
    @GetMapping(produces = MediaTypes.HAL_JSON_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public CollectionModel<EntityModel<CompraResponseDTO>> obtenerTodas() {
        List<EntityModel<CompraResponseDTO>> compras = compraService.obtenerTodas().stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());

        return CollectionModel.of(compras,
                linkTo(methodOn(CompraControllerV2.class).obtenerTodas()).withSelfRel());
    }

    @Operation(summary = "Obtener compra por ID (V2 HATEOAS)")
    @GetMapping(value = "/{id}", produces = MediaTypes.HAL_JSON_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public EntityModel<CompraResponseDTO> obtenerPorId(@PathVariable("id") Long id) {
        return assembler.toModel(compraService.obtenerPorId(id));
    }
}
