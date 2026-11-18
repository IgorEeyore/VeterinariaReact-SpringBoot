package cl.veterinaria.gestion.Assemblers;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;

import cl.veterinaria.gestion.Controller.CatalogoControllerV2;
import cl.veterinaria.gestion.dto.CatalogoResponseDTO;

@Component
public class CatalogoModelAssemblers implements RepresentationModelAssembler<CatalogoResponseDTO, EntityModel<CatalogoResponseDTO>> {

    @Override
    public EntityModel<CatalogoResponseDTO> toModel(CatalogoResponseDTO catalogo) {
        return EntityModel.of(catalogo,
                linkTo(methodOn(CatalogoControllerV2.class).obtenerPorId(catalogo.getId())).withSelfRel(),
                linkTo(methodOn(CatalogoControllerV2.class).obtenerTodos()).withRel("servicios"),
                linkTo(methodOn(CatalogoControllerV2.class).obtenerPorCategoria(catalogo.getCategoria())).withRel("servicios-categoria"));
    }
}
