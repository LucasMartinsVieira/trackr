package io.github.com.lucasmartinsvieira.trackr.api.dtos;

import io.github.com.lucasmartinsvieira.trackr.domain.user.UserRole;

public record AuthenticatedUserResponseDTO(String id, String name, String email, UserRole role) {
}
