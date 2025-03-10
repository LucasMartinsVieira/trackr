package io.github.com.lucasmartinsvieira.trackr.domain.user;

public record RegisterDTO(String email, String password, String name, UserRole role) {
}
