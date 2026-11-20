package cl.veterinaria.cliente.Assemblers;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;

import cl.veterinaria.cliente.Controller.MensajeContactoControllerV2;
import cl.veterinaria.cliente.dto.MensajeContactoResponseDTO;

@Component
public class MensajeContactoModelAssembler implements RepresentationModelAssembler<MensajeContactoResponseDTO, EntityModel<MensajeContactoResponseDTO>> {

    @Override
    public EntityModel<MensajeContactoResponseDTO> toModel(MensajeContactoResponseDTO mensaje) {
        return EntityModel.of(mensaje,
                linkTo(methodOn(MensajeContactoControllerV2.class).obtenerPorId(mensaje.getId())).withSelfRel(),
                linkTo(methodOn(MensajeContactoControllerV2.class).obtenerTodos()).withRel("mensajes-contacto"));
    }
}
