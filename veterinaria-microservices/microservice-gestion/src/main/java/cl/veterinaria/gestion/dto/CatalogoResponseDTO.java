package cl.veterinaria.gestion.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CatalogoResponseDTO {

    private Long id;
    private String nombre;
    private String categoria;
    private Double precio;
    private String descripcionCorta;
    private String descripcionLarga;
    private String imagen;
}
