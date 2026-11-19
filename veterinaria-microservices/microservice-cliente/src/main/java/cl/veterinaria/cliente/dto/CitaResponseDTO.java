package cl.veterinaria.cliente.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CitaResponseDTO {

    private Long id;
    private String nombreDueno;
    private String telefono;
    private String nombreMascota;
    private String tipoMascota;
    private String servicio;
    private LocalDate fecha;
    private String hora;
    private String notas;
    private String estado;
}
