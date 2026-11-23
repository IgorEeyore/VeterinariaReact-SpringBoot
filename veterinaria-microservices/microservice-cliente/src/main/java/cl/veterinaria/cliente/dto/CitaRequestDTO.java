package cl.veterinaria.cliente.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CitaRequestDTO {

    @NotBlank(message = "El nombre del dueño es obligatorio")
    @Size(max = 150, message = "El nombre del dueño no puede exceder los 150 caracteres")
    private String nombreDueno;

    @NotBlank(message = "El teléfono es obligatorio")
    @Size(max = 50, message = "El teléfono no puede exceder los 50 caracteres")
    private String telefono;

    @NotBlank(message = "El nombre de la mascota es obligatorio")
    @Size(max = 100, message = "El nombre de la mascota no puede exceder los 100 caracteres")
    private String nombreMascota;

    @NotBlank(message = "El tipo de mascota es obligatorio")
    @Size(max = 100, message = "El tipo de mascota no puede exceder los 100 caracteres")
    private String tipoMascota;

    @NotBlank(message = "El servicio es obligatorio")
    @Size(max = 150, message = "El servicio no puede exceder los 150 caracteres")
    private String servicio;

    @NotNull(message = "La fecha de la cita es obligatoria")
    private LocalDate fecha;

    @NotBlank(message = "La hora de la cita es obligatoria")
    private String hora;

    private String notas;

    @Size(max = 50, message = "El estado no puede exceder los 50 caracteres")
    private String estado;
}
