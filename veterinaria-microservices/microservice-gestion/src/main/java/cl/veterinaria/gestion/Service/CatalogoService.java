package cl.veterinaria.gestion.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cl.veterinaria.gestion.Model.Catalogo;
import cl.veterinaria.gestion.Repository.CatalogoRepository;
import cl.veterinaria.gestion.dto.CatalogoRequestDTO;
import cl.veterinaria.gestion.dto.CatalogoResponseDTO;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CatalogoService {

    private final CatalogoRepository catalogoRepository;

    @Transactional(readOnly = true)
    public List<CatalogoResponseDTO> obtenerTodos() {
        return catalogoRepository.findAll().stream()
                .map(this::mapearADTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CatalogoResponseDTO obtenerPorId(Long id) {
        Catalogo catalogo = catalogoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("El servicio con ID " + id + " no existe"));
        return mapearADTO(catalogo);
    }

    @Transactional(readOnly = true)
    public List<CatalogoResponseDTO> obtenerPorCategoria(String categoria) {
        return catalogoRepository.findByCategoriaIgnoreCase(categoria).stream()
                .map(this::mapearADTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public CatalogoResponseDTO crear(CatalogoRequestDTO request) {
        Catalogo catalogo = new Catalogo();
        catalogo.setNombre(request.getNombre());
        catalogo.setCategoria(request.getCategoria());
        catalogo.setPrecio(request.getPrecio());
        catalogo.setDescripcionCorta(request.getDescripcionCorta());
        catalogo.setDescripcionLarga(request.getDescripcionLarga());
        catalogo.setImagen(request.getImagen());

        Catalogo guardado = catalogoRepository.save(catalogo);
        return mapearADTO(guardado);
    }

    @Transactional
    public CatalogoResponseDTO actualizar(Long id, CatalogoRequestDTO request) {
        Catalogo catalogo = catalogoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("El servicio con ID " + id + " no existe"));

        catalogo.setNombre(request.getNombre());
        catalogo.setCategoria(request.getCategoria());
        catalogo.setPrecio(request.getPrecio());
        catalogo.setDescripcionCorta(request.getDescripcionCorta());
        catalogo.setDescripcionLarga(request.getDescripcionLarga());
        catalogo.setImagen(request.getImagen());

        Catalogo actualizado = catalogoRepository.save(catalogo);
        return mapearADTO(actualizado);
    }

    @Transactional
    public void eliminar(Long id) {
        if (!catalogoRepository.existsById(id)) {
            throw new EntityNotFoundException("El servicio con ID " + id + " no existe");
        }
        catalogoRepository.deleteById(id);
    }

    public CatalogoResponseDTO mapearADTO(Catalogo catalogo) {
        CatalogoResponseDTO dto = new CatalogoResponseDTO();
        dto.setId(catalogo.getId());
        dto.setNombre(catalogo.getNombre());
        dto.setCategoria(catalogo.getCategoria());
        dto.setPrecio(catalogo.getPrecio());
        dto.setDescripcionCorta(catalogo.getDescripcionCorta());
        dto.setDescripcionLarga(catalogo.getDescripcionLarga());
        dto.setImagen(catalogo.getImagen());
        return dto;
    }
}
