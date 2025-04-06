package io.github.com.lucasmartinsvieira.trackr.infra.exception;

public class BookAccessDeniedException extends RuntimeException {
    public BookAccessDeniedException(String message) {
        super(message);
    }
}
