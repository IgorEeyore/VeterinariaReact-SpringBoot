package cl.veterinaria.gestion.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cl.veterinaria.gestion.Service.CompraService;
import cl.veterinaria.gestion.dto.CompraRequestDTO;
import cl.veterinaria.gestion.dto.CompraResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/compras")
@RequiredArgsConstructor
@Tag(name = "Compras", description = "Operaciones relacionadas con las compras y detalle de compra")
public class CompraController {

    private final CompraService compraService;

    @Operation(summary = "Registrar nueva compra con sus detalles")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Compra registrada exitosamente"),
        @ApiResponse(responseCode = "400", description = "Solicitud inválida")
    })
    @PostMapping
    public ResponseEntity<CompraResponseDTO> registrarCompra(@Valid @RequestBody CompraRequestDTO request) {
        return new ResponseEntity<>(compraService.registrarCompra(request), HttpStatus.CREATED);
    }

    @Operation(summary = "Listar todas las compras")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Listado de compras obtenido")
    })
    @GetMapping
    public ResponseEntity<List<CompraResponseDTO>> obtenerTodas() {
        return new ResponseEntity<>(compraService.obtenerTodas(), HttpStatus.OK);
    }

    @Operation(summary = "Obtener compra por ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Compra encontrada"),
        @ApiResponse(responseCode = "404", description = "Compra no encontrada")
    })
    @GetMapping("/{id}")
    public ResponseEntity<CompraResponseDTO> obtenerPorId(@PathVariable("id") Long id) {
        return new ResponseEntity<>(compraService.obtenerPorId(id), HttpStatus.OK);
    }
}
