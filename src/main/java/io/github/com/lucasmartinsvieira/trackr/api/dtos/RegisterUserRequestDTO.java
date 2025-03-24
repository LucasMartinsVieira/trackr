package io.github.com.lucasmartinsvieira.trackr.api.dtos;

import io.github.com.lucasmartinsvieira.trackr.domain.user.UserRole;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterUserRequestDTO(
        @Email @NotBlank
        String email,

        @NotBlank @Size(min = 4, max = 128)
        String password,

        @NotBlank
        String name,

        @Enumerated(EnumType.STRING)
        UserRole role) {
}
