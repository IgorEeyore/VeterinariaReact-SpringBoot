package cl.veterinaria.gestion.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cl.veterinaria.gestion.Model.Catalogo;
import cl.veterinaria.gestion.Model.Compra;
import cl.veterinaria.gestion.Model.DetalleCompra;
import cl.veterinaria.gestion.Repository.CatalogoRepository;
import cl.veterinaria.gestion.Repository.CompraRepository;
import cl.veterinaria.gestion.dto.CompraRequestDTO;
import cl.veterinaria.gestion.dto.CompraResponseDTO;
import cl.veterinaria.gestion.dto.DetalleCompraDTO;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CompraService {

    private final CompraRepository compraRepository;
    private final CatalogoRepository catalogoRepository;

    @Transactional
    public CompraResponseDTO registrarCompra(CompraRequestDTO request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("La compra debe incluir al menos un detalle");
        }

        Compra compra = new Compra();
        compra.setFecha(LocalDateTime.now());

        int totalCantidad = 0;
        double totalPrecio = 0.0;

        for (DetalleCompraDTO itemDTO : request.getItems()) {
            Catalogo servicio = catalogoRepository.findById(itemDTO.getServicioId())
                    .orElseThrow(() -> new EntityNotFoundException("El servicio con ID " + itemDTO.getServicioId() + " no existe"));

            double precioReal = servicio.getPrecio();
            DetalleCompra detalle = new DetalleCompra();
            detalle.setCompra(compra);
            detalle.setServicioId(servicio.getId());
            detalle.setPrecioUnitario(precioReal);
            detalle.setCantidad(itemDTO.getCantidad());
            double subtotal = precioReal * itemDTO.getCantidad();
            detalle.setSubtotal(subtotal);

            totalCantidad += itemDTO.getCantidad();
            totalPrecio += subtotal;

            compra.getDetalles().add(detalle);
        }

        compra.setCantidadItems(totalCantidad);
        compra.setTotal(totalPrecio);

        Compra guardada = compraRepository.save(compra);
        return mapearADTO(guardada);
    }

    @Transactional(readOnly = true)
    public List<CompraResponseDTO> obtenerTodas() {
        return compraRepository.findAll().stream()
                .map(this::mapearADTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CompraResponseDTO obtenerPorId(Long id) {
        Compra compra = compraRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("La compra con ID " + id + " no existe"));
        return mapearADTO(compra);
    }

    public CompraResponseDTO mapearADTO(Compra compra) {
        CompraResponseDTO dto = new CompraResponseDTO();
        dto.setId(compra.getId());
        dto.setFecha(compra.getFecha());
        dto.setCantidadItems(compra.getCantidadItems());
        dto.setTotal(compra.getTotal());

        if (compra.getDetalles() != null) {
            List<DetalleCompraDTO> items = compra.getDetalles().stream().map(d -> {
                DetalleCompraDTO itemDTO = new DetalleCompraDTO();
                itemDTO.setId(d.getId());
                itemDTO.setServicioId(d.getServicioId());
                itemDTO.setPrecioUnitario(d.getPrecioUnitario());
                itemDTO.setCantidad(d.getCantidad());
                itemDTO.setSubtotal(d.getSubtotal());
                return itemDTO;
            }).collect(Collectors.toList());
            dto.setItems(items);
        }

        return dto;
    }
}
