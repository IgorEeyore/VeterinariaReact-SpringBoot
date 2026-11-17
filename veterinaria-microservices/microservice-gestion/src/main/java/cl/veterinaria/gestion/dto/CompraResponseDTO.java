package cl.veterinaria.gestion.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CompraResponseDTO {

    private Long id;
    private LocalDateTime fecha;
    private Integer cantidadItems;
    private Double total;
    private List<DetalleCompraDTO> items;
}
