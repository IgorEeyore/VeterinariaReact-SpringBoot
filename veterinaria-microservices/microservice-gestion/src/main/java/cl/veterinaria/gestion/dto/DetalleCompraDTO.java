package cl.veterinaria.gestion.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DetalleCompraDTO {

    private Long id;

    @NotNull(message = "El ID del servicio es obligatorio")
    private Long servicioId;

    @Positive(message = "El precio unitario debe ser positivo")
    private Double precioUnitario;

    @NotNull(message = "La cantidad es obligatoria")
    @Positive(message = "La cantidad debe ser mayor a cero")
    private Integer cantidad;

    private Double subtotal;
}
