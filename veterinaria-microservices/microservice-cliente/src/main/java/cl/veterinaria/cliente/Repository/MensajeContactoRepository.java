package cl.veterinaria.cliente.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import cl.veterinaria.cliente.Model.MensajeContacto;

@Repository
public interface MensajeContactoRepository extends JpaRepository<MensajeContacto, Long> {

    List<MensajeContacto> findByCorreoIgnoreCase(String correo);

    List<MensajeContacto> findByLeido(Boolean leido);
}
