package cl.veterinaria.cliente.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cl.veterinaria.cliente.Model.MensajeContacto;
import cl.veterinaria.cliente.Repository.MensajeContactoRepository;
import cl.veterinaria.cliente.dto.MensajeContactoRequestDTO;
import cl.veterinaria.cliente.dto.MensajeContactoResponseDTO;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MensajeContactoService {

    private final MensajeContactoRepository mensajeContactoRepository;

    @Transactional(readOnly = true)
    public List<MensajeContactoResponseDTO> obtenerTodos() {
        return mensajeContactoRepository.findAll().stream()
                .map(this::mapearADTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MensajeContactoResponseDTO obtenerPorId(Long id) {
        MensajeContacto mensaje = mensajeContactoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("El mensaje de contacto con ID " + id + " no existe"));
        return mapearADTO(mensaje);
    }

    @Transactional
    public MensajeContactoResponseDTO crearMensaje(MensajeContactoRequestDTO request) {
        MensajeContacto mensaje = new MensajeContacto();
        mensaje.setNombre(request.getNombre());
        mensaje.setCorreo(request.getCorreo());
        mensaje.setTelefono(request.getTelefono());
        mensaje.setAsunto(request.getAsunto());
        mensaje.setMensaje(request.getMensaje());
        mensaje.setFechaEnvio(LocalDateTime.now());
        mensaje.setLeido(false);

        MensajeContacto guardado = mensajeContactoRepository.save(mensaje);
        return mapearADTO(guardado);
    }

    @Transactional
    public MensajeContactoResponseDTO marcarLeido(Long id) {
        MensajeContacto mensaje = mensajeContactoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("El mensaje de contacto con ID " + id + " no existe"));

        mensaje.setLeido(true);
        MensajeContacto actualizado = mensajeContactoRepository.save(mensaje);
        return mapearADTO(actualizado);
    }

    @Transactional
    public void eliminarMensaje(Long id) {
        if (!mensajeContactoRepository.existsById(id)) {
            throw new EntityNotFoundException("El mensaje de contacto con ID " + id + " no existe");
        }
        mensajeContactoRepository.deleteById(id);
    }

    public MensajeContactoResponseDTO mapearADTO(MensajeContacto mensaje) {
        MensajeContactoResponseDTO dto = new MensajeContactoResponseDTO();
        dto.setId(mensaje.getId());
        dto.setNombre(mensaje.getNombre());
        dto.setCorreo(mensaje.getCorreo());
        dto.setTelefono(mensaje.getTelefono());
        dto.setAsunto(mensaje.getAsunto());
        dto.setMensaje(mensaje.getMensaje());
        dto.setFechaEnvio(mensaje.getFechaEnvio());
        dto.setLeido(mensaje.getLeido());
        return dto;
    }
}
