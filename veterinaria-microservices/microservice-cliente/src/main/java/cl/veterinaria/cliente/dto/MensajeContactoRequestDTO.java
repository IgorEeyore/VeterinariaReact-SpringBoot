package cl.veterinaria.cliente.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MensajeContactoRequestDTO {

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 150, message = "El nombre no puede exceder los 150 caracteres")
    private String nombre;

    @NotBlank(message = "El correo electrónico es obligatorio")
    @Email(message = "El formato del correo es inválido")
    @Size(max = 150, message = "El correo no puede exceder los 150 caracteres")
    private String correo;

    @Size(max = 50, message = "El teléfono no puede exceder los 50 caracteres")
    private String telefono;

    @NotBlank(message = "El asunto es obligatorio")
    @Size(max = 150, message = "El asunto no puede exceder los 150 caracteres")
    private String asunto;

    @NotBlank(message = "El mensaje no puede estar vacío")
    private String mensaje;
}
