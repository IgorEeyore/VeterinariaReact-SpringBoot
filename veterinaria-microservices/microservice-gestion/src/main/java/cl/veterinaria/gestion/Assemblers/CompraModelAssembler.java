package cl.veterinaria.gestion.Assemblers;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;

import cl.veterinaria.gestion.Controller.CompraControllerV2;
import cl.veterinaria.gestion.dto.CompraResponseDTO;

@Component
public class CompraModelAssembler implements RepresentationModelAssembler<CompraResponseDTO, EntityModel<CompraResponseDTO>> {

    @Override
    public EntityModel<CompraResponseDTO> toModel(CompraResponseDTO compra) {
        return EntityModel.of(compra,
                linkTo(methodOn(CompraControllerV2.class).obtenerPorId(compra.getId())).withSelfRel(),
                linkTo(methodOn(CompraControllerV2.class).obtenerTodas()).withRel("compras"));
    }
}
