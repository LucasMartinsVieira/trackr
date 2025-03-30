package io.github.com.lucasmartinsvieira.trackr.api.dtos.authentication;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AuthenticationUserRequestDTO(
        @Email @NotBlank
        String email,

        @NotBlank @Size(min = 4, max = 128)
        String password) {
}
