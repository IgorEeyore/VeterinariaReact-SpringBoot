package cl.veterinaria.user.Controller;

import cl.veterinaria.user.Service.UserService;
import cl.veterinaria.user.dto.AuthRequest;
import cl.veterinaria.user.dto.AuthResponse;
import cl.veterinaria.user.dto.RegisterRequest;
import cl.veterinaria.user.dto.RegisterResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticacion", description = "Operaciones de registro e inicio de sesion con JWT")
public class AuthController {

    private final UserService userService;

    @Operation(summary = "Registrar nuevo usuario", description = "Registra un nuevo cliente en el sistema")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Usuario registrado exitosamente"),
        @ApiResponse(responseCode = "400", description = "Solicitud invalida")
    })
    @PostMapping("/registrar")
    public ResponseEntity<RegisterResponse> registrar(@Valid @RequestBody RegisterRequest request) {
        return new ResponseEntity<>(userService.registrar(request), HttpStatus.CREATED);
    }

    @Operation(summary = "Iniciar sesion", description = "Valida credenciales y genera token JWT")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Inicio de sesion exitoso"),
        @ApiResponse(responseCode = "401", description = "Credenciales invalidas")
    })
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        return new ResponseEntity<>(userService.login(request), HttpStatus.OK);
    }
}
