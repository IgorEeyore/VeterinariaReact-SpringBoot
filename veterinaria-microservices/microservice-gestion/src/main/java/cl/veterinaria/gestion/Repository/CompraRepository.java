package cl.veterinaria.gestion.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import cl.veterinaria.gestion.Model.Compra;

@Repository
public interface CompraRepository extends JpaRepository<Compra, Long> {

}
