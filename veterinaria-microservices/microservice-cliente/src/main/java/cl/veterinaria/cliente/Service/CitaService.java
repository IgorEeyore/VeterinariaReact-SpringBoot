package cl.veterinaria.cliente.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cl.veterinaria.cliente.Model.Cita;
import cl.veterinaria.cliente.Repository.CitaRepository;
import cl.veterinaria.cliente.dto.CitaRequestDTO;
import cl.veterinaria.cliente.dto.CitaResponseDTO;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CitaService {

    private final CitaRepository citaRepository;

    @Transactional(readOnly = true)
    public List<CitaResponseDTO> obtenerTodas() {
        return citaRepository.findAll().stream()
                .map(this::mapearADTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CitaResponseDTO obtenerPorId(Long id) {
        Cita cita = citaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("La cita con ID " + id + " no existe"));
        return mapearADTO(cita);
    }

    @Transactional(readOnly = true)
    public List<CitaResponseDTO> obtenerPorDueno(String nombreDueno) {
        return citaRepository.findByNombreDuenoIgnoreCase(nombreDueno).stream()
                .map(this::mapearADTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public CitaResponseDTO crearCita(CitaRequestDTO request) {
        Cita cita = new Cita();
        cita.setNombreDueno(request.getNombreDueno());
        cita.setTelefono(request.getTelefono());
        cita.setNombreMascota(request.getNombreMascota());
        cita.setTipoMascota(request.getTipoMascota());
        cita.setServicio(request.getServicio());
        cita.setFecha(request.getFecha());
        cita.setHora(request.getHora());
        cita.setNotas(request.getNotas());
        cita.setEstado("Pendiente");

        Cita guardada = citaRepository.save(cita);
        return mapearADTO(guardada);
    }

    @Transactional
    public CitaResponseDTO actualizarCita(Long id, CitaRequestDTO request) {
        Cita cita = citaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("La cita con ID " + id + " no existe"));

        if ("Cancelada".equalsIgnoreCase(cita.getEstado()) || "Completada".equalsIgnoreCase(cita.getEstado())) {
            throw new RuntimeException("No se puede modificar una cita en estado " + cita.getEstado());
        }

        cita.setNombreDueno(request.getNombreDueno());
        cita.setTelefono(request.getTelefono());
        cita.setNombreMascota(request.getNombreMascota());
        cita.setTipoMascota(request.getTipoMascota());
        cita.setServicio(request.getServicio());
        cita.setFecha(request.getFecha());
        cita.setHora(request.getHora());
        cita.setNotas(request.getNotas());

        Cita actualizada = citaRepository.save(cita);
        return mapearADTO(actualizada);
    }

    @Transactional
    public CitaResponseDTO cancelarCita(Long id) {
        Cita cita = citaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("La cita con ID " + id + " no existe"));

        if ("Completada".equalsIgnoreCase(cita.getEstado())) {
            throw new RuntimeException("No se puede cancelar una cita que ya fue completada");
        }

        cita.setEstado("Cancelada");
        Cita actualizada = citaRepository.save(cita);
        return mapearADTO(actualizada);
    }

    @Transactional
    public void eliminarCita(Long id) {
        if (!citaRepository.existsById(id)) {
            throw new EntityNotFoundException("La cita con ID " + id + " no existe");
        }
        citaRepository.deleteById(id);
    }

    public CitaResponseDTO mapearADTO(Cita cita) {
        CitaResponseDTO dto = new CitaResponseDTO();
        dto.setId(cita.getId());
        dto.setNombreDueno(cita.getNombreDueno());
        dto.setTelefono(cita.getTelefono());
        dto.setNombreMascota(cita.getNombreMascota());
        dto.setTipoMascota(cita.getTipoMascota());
        dto.setServicio(cita.getServicio());
        dto.setFecha(cita.getFecha());
        dto.setHora(cita.getHora());
        dto.setNotas(cita.getNotas());
        dto.setEstado(cita.getEstado());
        return dto;
    }
}
