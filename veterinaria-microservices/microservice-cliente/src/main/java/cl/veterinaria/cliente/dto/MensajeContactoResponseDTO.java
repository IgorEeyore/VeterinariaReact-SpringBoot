package cl.veterinaria.cliente.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MensajeContactoResponseDTO {

    private Long id;
    private String nombre;
    private String correo;
    private String telefono;
    private String asunto;
    private String mensaje;
    private LocalDateTime fechaEnvio;
    private Boolean leido;
}
