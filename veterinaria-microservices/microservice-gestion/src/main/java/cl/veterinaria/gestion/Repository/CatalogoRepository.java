package cl.veterinaria.gestion.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import cl.veterinaria.gestion.Model.Catalogo;

@Repository
public interface CatalogoRepository extends JpaRepository<Catalogo, Long> {

    List<Catalogo> findByCategoriaIgnoreCase(String categoria);

    List<Catalogo> findByNombreContainingIgnoreCase(String nombre);

    boolean existsByNombreIgnoreCase(String nombre);
}
