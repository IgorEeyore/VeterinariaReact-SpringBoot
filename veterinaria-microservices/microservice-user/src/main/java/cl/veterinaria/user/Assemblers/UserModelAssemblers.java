package cl.veterinaria.user.Assemblers;

import cl.veterinaria.user.Model.User;
import cl.veterinaria.user.dto.UserResponseDTO;

import org.springframework.stereotype.Component;

@Component
public class UserModelAssemblers {

    public UserResponseDTO toResponseDTO(User user) {
        return new UserResponseDTO(
                user.getId(),
                user.getRut(),
                user.getNombre(),
                user.getCorreo(),
                user.getRol()
        );
    }
}
