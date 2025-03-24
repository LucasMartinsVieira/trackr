package io.github.com.lucasmartinsvieira.trackr.api.dtos;

import io.github.com.lucasmartinsvieira.trackr.domain.user.UserRole;

public record RegisterUserRequestDTO(String email, String password, String name, UserRole role) {
}
