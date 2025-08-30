package com.busreservation.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    @Autowired
    private final JwtFilter jwtFilter;

   @Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    return http
        .csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(auth -> auth
            // Public endpoints
            .requestMatchers("/api/v1/auth/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll()

            // Bus endpoints
            .requestMatchers(HttpMethod.GET, "/api/v1/buses/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_CUSTOMER")
            .requestMatchers(HttpMethod.POST, "/api/v1/buses/**").hasAuthority("ROLE_ADMIN")
            .requestMatchers(HttpMethod.PUT, "/api/v1/buses/**").hasAuthority("ROLE_ADMIN")
            .requestMatchers(HttpMethod.DELETE, "/api/v1/buses/**").hasAuthority("ROLE_ADMIN")

            // Route endpoints
            .requestMatchers(HttpMethod.GET, "/api/v1/routes/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_CUSTOMER")
            .requestMatchers(HttpMethod.POST, "/api/v1/routes/**").hasAuthority("ROLE_ADMIN")
            .requestMatchers(HttpMethod.PUT, "/api/v1/routes/**").hasAuthority("ROLE_ADMIN")
            .requestMatchers(HttpMethod.DELETE, "/api/v1/routes/**").hasAuthority("ROLE_ADMIN")

            // Trip endpoints
            .requestMatchers(HttpMethod.GET, "/api/v1/trips/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_CUSTOMER")
            .requestMatchers(HttpMethod.POST, "/api/v1/trips/**").hasAuthority("ROLE_ADMIN")
            .requestMatchers(HttpMethod.PUT, "/api/v1/trips/**").hasAuthority("ROLE_ADMIN")
            .requestMatchers(HttpMethod.DELETE, "/api/v1/trips/**").hasAuthority("ROLE_ADMIN")

            // Report endpoints (admin only)
            .requestMatchers("/api/v1/reports/**").hasAuthority("ROLE_ADMIN")

            // Booking, Payment, Ticket endpoints (customer only)
            .requestMatchers("/api/v1/bookings/**", "/api/v1/payments/**", "/api/v1/tickets/**").hasAuthority("ROLE_CUSTOMER")

            // All other requests need authentication
            .anyRequest().authenticated()
        )
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
        .build();
}

    @Bean
public WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurer() {
        @Override
        public void addCorsMappings(CorsRegistry registry) {
            registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("*")
                .allowedHeaders("*");
        }
    };
}


    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
