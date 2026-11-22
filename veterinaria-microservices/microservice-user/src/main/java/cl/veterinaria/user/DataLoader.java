package cl.veterinaria.user;

import cl.veterinaria.user.Model.User;
import cl.veterinaria.user.Repository.UserRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setRut("111111111");
            admin.setNombre("Admin");
            admin.setCorreo("admin@demo.cl");
            admin.setContrasena(passwordEncoder.encode("1234"));
            admin.setRol("Admin");

            User usuario = new User();
            usuario.setRut("222222222");
            usuario.setNombre("Usuario");
            usuario.setCorreo("user@demo.cl");
            usuario.setContrasena(passwordEncoder.encode("5678"));
            usuario.setRol("Cliente");

            User cliente = new User();
            cliente.setRut("123456785");
            cliente.setNombre("Cliente Ejemplo");
            cliente.setCorreo("cliente@correo.cl");
            cliente.setContrasena(passwordEncoder.encode("1234"));
            cliente.setRol("Cliente");

            userRepository.saveAll(List.of(admin, usuario, cliente));
        }
    }
}
