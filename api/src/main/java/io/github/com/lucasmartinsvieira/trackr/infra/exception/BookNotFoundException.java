package io.github.com.lucasmartinsvieira.trackr.infra.exception;

public class BookNotFoundException extends RuntimeException {
    public BookNotFoundException(String message) {
        super(message);
    }
}
