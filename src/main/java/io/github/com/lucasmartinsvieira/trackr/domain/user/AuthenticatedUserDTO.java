package io.github.com.lucasmartinsvieira.trackr.domain.user;

public record AuthenticatedUserDTO(String id, String name, String email, UserRole role) {
}
