package cl.veterinaria.gestion.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CompraRequestDTO {

    @NotEmpty(message = "La compra debe incluir al menos un detalle de compra")
    @Valid
    private List<DetalleCompraDTO> items;
}
