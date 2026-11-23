package cl.veterinaria.cliente.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeParseException;
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

    private void validarFechaYHora(LocalDate fecha, String hora, String mensajeFechaPasada) {
        LocalDate hoy = LocalDate.now();
        if (fecha != null && fecha.isBefore(hoy)) {
            throw new IllegalArgumentException(mensajeFechaPasada);
        }
        if (fecha != null && fecha.equals(hoy) && hora != null && !hora.isBlank()) {
            try {
                LocalTime horaCita = LocalTime.parse(hora.trim());
                if (horaCita.isBefore(LocalTime.now())) {
                    throw new IllegalArgumentException("La hora seleccionada ya paso para el dia de hoy");
                }
            } catch (DateTimeParseException e) {
                throw new IllegalArgumentException("Formato de hora invalido (use HH:mm)");
            }
        }
    }

    @Transactional
    public CitaResponseDTO crearCita(CitaRequestDTO request) {
        validarFechaYHora(
                request.getFecha(),
                request.getHora(),
                "No se puede agendar una cita en una fecha pasada"
        );

        Cita cita = new Cita();
        cita.setNombreDueno(request.getNombreDueno());
        cita.setTelefono(request.getTelefono());
        cita.setNombreMascota(request.getNombreMascota());
        cita.setTipoMascota(request.getTipoMascota());
        cita.setServicio(request.getServicio());
        cita.setFecha(request.getFecha());
        cita.setHora(request.getHora());
        cita.setNotas(request.getNotas());
        cita.setEstado("PENDIENTE");

        Cita guardada = citaRepository.save(cita);
        return mapearADTO(guardada);
    }

    @Transactional
    public CitaResponseDTO actualizarCita(Long id, CitaRequestDTO request) {
        Cita cita = citaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("La cita con ID " + id + " no existe"));

        boolean cambioFecha = request.getFecha() != null && !request.getFecha().equals(cita.getFecha());
        boolean cambioHora = request.getHora() != null && !request.getHora().equals(cita.getHora());
        if (cambioFecha || cambioHora) {
            validarFechaYHora(
                    request.getFecha(),
                    request.getHora(),
                    "No se puede reprogramar una cita a una fecha pasada"
            );
        }

        cita.setNombreDueno(request.getNombreDueno());
        cita.setTelefono(request.getTelefono());
        cita.setNombreMascota(request.getNombreMascota());
        cita.setTipoMascota(request.getTipoMascota());
        cita.setServicio(request.getServicio());
        cita.setFecha(request.getFecha());
        cita.setHora(request.getHora());
        cita.setNotas(request.getNotas());
        if (request.getEstado() != null && !request.getEstado().isBlank()) {
            cita.setEstado(request.getEstado().trim().toUpperCase());
        }

        Cita actualizada = citaRepository.save(cita);
        return mapearADTO(actualizada);
    }

    @Transactional
    public CitaResponseDTO cancelarCita(Long id) {
        Cita cita = citaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("La cita con ID " + id + " no existe"));

        cita.setEstado("CANCELADA");
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
