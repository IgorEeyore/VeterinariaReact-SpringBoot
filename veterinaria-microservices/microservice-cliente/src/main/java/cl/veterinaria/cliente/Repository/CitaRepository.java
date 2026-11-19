package cl.veterinaria.cliente.Repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import cl.veterinaria.cliente.Model.Cita;

@Repository
public interface CitaRepository extends JpaRepository<Cita, Long> {

    List<Cita> findByNombreDuenoIgnoreCase(String nombreDueno);

    List<Cita> findByFecha(LocalDate fecha);

    List<Cita> findByEstado(String estado);
}
