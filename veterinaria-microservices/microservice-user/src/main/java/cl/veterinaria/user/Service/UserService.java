package cl.veterinaria.user.Service;

import cl.veterinaria.user.Assemblers.UserModelAssemblers;
import cl.veterinaria.user.Model.User;
import cl.veterinaria.user.Repository.UserRepository;
import cl.veterinaria.user.Security.JwtUtil;
import cl.veterinaria.user.dto.AuthRequest;
import cl.veterinaria.user.dto.AuthResponse;
import cl.veterinaria.user.dto.RegisterRequest;
import cl.veterinaria.user.dto.RegisterResponse;
import cl.veterinaria.user.dto.UserRequestDTO;
import cl.veterinaria.user.dto.UserResponseDTO;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserModelAssemblers userModelAssemblers;

    public RegisterResponse registrar(RegisterRequest request) {
        String correoLimpio = request.getCorreo().trim().toLowerCase();

        if (userRepository.existsByCorreo(correoLimpio)) {
            throw new RuntimeException("Este correo ya se encuentra registrado");
        }

        if (request.getRut() != null && !request.getRut().trim().isEmpty()
                && userRepository.existsByRut(request.getRut().trim())) {
            throw new RuntimeException("Este RUN ya se encuentra registrado");
        }

        User user = new User();
        user.setRut(request.getRut().trim());
        user.setNombre(request.getNombre().trim());
        user.setCorreo(correoLimpio);
        user.setContrasena(passwordEncoder.encode(request.getContrasena().trim()));
        user.setRol("Cliente");

        userRepository.save(user);

        return new RegisterResponse("Usuario registrado exitosamente", user.getCorreo());
    }

    public AuthResponse login(AuthRequest request) {
        String correoLimpio = request.getCorreo().trim().toLowerCase();

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(correoLimpio, request.getContrasena().trim())
        );

        User user = userRepository.findByCorreo(correoLimpio)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String token = jwtUtil.generarToken(user.getCorreo(), user.getRol());
        return new AuthResponse(token, user.getId(), user.getNombre(), user.getCorreo(), user.getRol());
    }

    public List<UserResponseDTO> obtenerTodos() {
        return userRepository.findAll().stream()
                .map(userModelAssemblers::toResponseDTO)
                .collect(Collectors.toList());
    }

    public UserResponseDTO obtenerPorId(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return userModelAssemblers.toResponseDTO(user);
    }

    public UserResponseDTO crearUsuario(UserRequestDTO request) {
        String correoLimpio = request.getCorreo().trim().toLowerCase();

        if (userRepository.existsByCorreo(correoLimpio)) {
            throw new RuntimeException("Este correo ya se encuentra registrado");
        }

        User user = new User();
        user.setRut(request.getRut() != null && !request.getRut().trim().isEmpty() ? request.getRut().trim() : null);
        user.setNombre(request.getNombre().trim());
        user.setCorreo(correoLimpio);
        String clave = (request.getContrasena() != null && !request.getContrasena().trim().isEmpty())
                ? request.getContrasena().trim()
                : "1234";
        user.setContrasena(passwordEncoder.encode(clave));
        user.setRol(request.getRol() != null && !request.getRol().trim().isEmpty() ? request.getRol().trim() : "Cliente");

        return userModelAssemblers.toResponseDTO(userRepository.save(user));
    }

    public UserResponseDTO actualizarUsuario(Long id, UserRequestDTO request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String correoLimpio = request.getCorreo().trim().toLowerCase();
        if (!user.getCorreo().equalsIgnoreCase(correoLimpio) && userRepository.existsByCorreo(correoLimpio)) {
            throw new RuntimeException("Este correo ya se encuentra registrado");
        }

        user.setNombre(request.getNombre().trim());
        user.setCorreo(correoLimpio);
        if (request.getRut() != null && !request.getRut().trim().isEmpty()) {
            user.setRut(request.getRut().trim());
        }
        if (request.getContrasena() != null && !request.getContrasena().trim().isEmpty()) {
            user.setContrasena(passwordEncoder.encode(request.getContrasena().trim()));
        }

        return userModelAssemblers.toResponseDTO(userRepository.save(user));
    }

    public void eliminarUsuario(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if ("Admin".equalsIgnoreCase(user.getRol())) {
            throw new RuntimeException("No se puede eliminar un usuario con rol Admin");
        }

        userRepository.delete(user);
    }
}
