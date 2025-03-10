package io.github.com.lucasmartinsvieira.trackr.domain.user;

public record RegisterUserDTO(String email, String password, String name, UserRole role) {
}
