package CalculaterApp.Calculater.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORS configuration to allow the React frontend (Vite dev server) to
 * communicate with the Spring Boot backend.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                // Allow Vite dev server and production build origins
                .allowedOrigins(
                        "http://localhost:5173",   // Vite default
                        "http://localhost:3000",   // CRA fallback
                        "http://127.0.0.1:5173",
                        "http://localhost:4173",   // Vite preview
                        "http://127.0.0.1:4173"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(false)
                .maxAge(3600); // Cache preflight for 1 hour
    }
}
