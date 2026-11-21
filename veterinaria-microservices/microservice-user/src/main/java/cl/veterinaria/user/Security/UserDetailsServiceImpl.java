package cl.veterinaria.user.Security;

import cl.veterinaria.user.Model.User;
import cl.veterinaria.user.Repository.UserRepository;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String correo) throws UsernameNotFoundException {
        User user = userRepository.findByCorreo(correo)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        String rolNormalizado = user.getRol().startsWith("ROLE_")
                ? user.getRol()
                : "ROLE_" + user.getRol().toUpperCase();

        return new org.springframework.security.core.userdetails.User(
                user.getCorreo(),
                user.getContrasena(),
                Collections.singletonList(new SimpleGrantedAuthority(rolNormalizado))
        );
    }
}
