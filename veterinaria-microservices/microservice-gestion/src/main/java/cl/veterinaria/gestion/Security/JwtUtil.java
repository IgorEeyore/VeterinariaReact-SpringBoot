package cl.veterinaria.gestion.Security;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

@Component
public class JwtUtil {

    @Value("${jwt.secret:VetApp2026_secret_hospital_veterinario}")
    private String secretKey;

    public Claims extraerClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey.getBytes())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String extraerUsername(String token) {
        return extraerClaims(token).getSubject();
    }

    public List<String> extraerRoles(String token) {
        Object rolesObj = extraerClaims(token).get("roles");

        if (!(rolesObj instanceof List<?>)) {
            return Collections.emptyList();
        }

        return ((List<?>) rolesObj).stream()
                .filter(String.class::isInstance)
                .map(String.class::cast)
                .collect(Collectors.toList());
    }

    public boolean validarToken(String token) {
        try {
            extraerClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
