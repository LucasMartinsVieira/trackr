package io.github.com.lucasmartinsvieira.trackr.infra.exception;

public class BookStatusNotChangeableException extends RuntimeException {
    public BookStatusNotChangeableException(String message) {
        super(message);
    }
}
