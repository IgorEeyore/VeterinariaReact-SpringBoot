package cl.veterinaria.user.Assemblers;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import cl.veterinaria.user.Controller.UserControllerV2;
import cl.veterinaria.user.Model.User;
import cl.veterinaria.user.dto.UserResponseDTO;

import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;

@Component
public class UserModelAssemblers implements RepresentationModelAssembler<UserResponseDTO, EntityModel<UserResponseDTO>> {

    public UserResponseDTO toResponseDTO(User user) {
        return new UserResponseDTO(
                user.getId(),
                user.getRut(),
                user.getNombre(),
                user.getCorreo(),
                user.getRol()
        );
    }

    @Override
    public EntityModel<UserResponseDTO> toModel(UserResponseDTO user) {
        return EntityModel.of(user,
                linkTo(methodOn(UserControllerV2.class).obtenerPorId(user.getId())).withSelfRel(),
                linkTo(methodOn(UserControllerV2.class).obtenerTodos()).withRel("usuarios"));
    }
}
