package cl.veterinaria.cliente.Assemblers;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;

import cl.veterinaria.cliente.Controller.CitaControllerV2;
import cl.veterinaria.cliente.dto.CitaResponseDTO;

@Component
public class CitaModelAssemblers implements RepresentationModelAssembler<CitaResponseDTO, EntityModel<CitaResponseDTO>> {

    @Override
    public EntityModel<CitaResponseDTO> toModel(CitaResponseDTO cita) {
        return EntityModel.of(cita,
                linkTo(methodOn(CitaControllerV2.class).obtenerPorId(cita.getId())).withSelfRel(),
                linkTo(methodOn(CitaControllerV2.class).obtenerTodas()).withRel("citas"),
                linkTo(methodOn(CitaControllerV2.class).obtenerPorDueno(cita.getNombreDueno())).withRel("citas-dueno"));
    }
}
