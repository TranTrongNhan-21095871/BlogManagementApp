package project.blogmanagementapp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletResponse; // hoặc javax.servlet nếu dùng Spring Boot 2

@RestController
public class TokenValidationController {

    @GetMapping("/validate-token")
    public ResponseEntity<?> validateToken() {
        // Nếu token hợp lệ, SecurityContextHolder đã xác thực từ JwtAuthenticationFilter
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            return ResponseEntity.ok().build();
        }

        return ResponseEntity
                .status(HttpServletResponse.SC_UNAUTHORIZED)
                .body("Token invalid or expired");
    }
}
