package cl.veterinaria.user.Controller;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.MediaTypes;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cl.veterinaria.user.Assemblers.UserModelAssemblers;
import cl.veterinaria.user.Service.UserService;
import cl.veterinaria.user.dto.UserRequestDTO;
import cl.veterinaria.user.dto.UserResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v2/usuarios")
@RequiredArgsConstructor
@Tag(name = "Usuarios V2 (HATEOAS)", description = "Operaciones de usuarios con enlaces hipermedia")
public class UserControllerV2 {

    private final UserService userService;
    private final UserModelAssemblers assembler;

    @Operation(summary = "Crear nuevo usuario (V2 HATEOAS)")
    @PostMapping(produces = MediaTypes.HAL_JSON_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EntityModel<UserResponseDTO>> crearUsuario(@Valid @RequestBody UserRequestDTO request) {
        UserResponseDTO creado = userService.crearUsuario(request);
        return new ResponseEntity<>(assembler.toModel(creado), HttpStatus.CREATED);
    }

    @Operation(summary = "Listar todos los usuarios (V2 HATEOAS)")
    @GetMapping(produces = MediaTypes.HAL_JSON_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public CollectionModel<EntityModel<UserResponseDTO>> obtenerTodos() {
        List<EntityModel<UserResponseDTO>> usuarios = userService.obtenerTodos().stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());

        return CollectionModel.of(usuarios,
                linkTo(methodOn(UserControllerV2.class).obtenerTodos()).withSelfRel());
    }

    @Operation(summary = "Obtener usuario por ID (V2 HATEOAS)")
    @GetMapping(value = "/{id}", produces = MediaTypes.HAL_JSON_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public EntityModel<UserResponseDTO> obtenerPorId(@PathVariable("id") Long id) {
        return assembler.toModel(userService.obtenerPorId(id));
    }

    @Operation(summary = "Actualizar usuario (V2 HATEOAS)")
    @PutMapping(value = "/{id}", produces = MediaTypes.HAL_JSON_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EntityModel<UserResponseDTO>> actualizarUsuario(
            @PathVariable("id") Long id,
            @Valid @RequestBody UserRequestDTO request) {
        UserResponseDTO actualizado = userService.actualizarUsuario(id, request);
        return new ResponseEntity<>(assembler.toModel(actualizado), HttpStatus.OK);
    }

    @Operation(summary = "Eliminar usuario (V2)")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable("id") Long id) {
        userService.eliminarUsuario(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
