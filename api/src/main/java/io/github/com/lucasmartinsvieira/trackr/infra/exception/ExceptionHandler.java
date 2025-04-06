package io.github.com.lucasmartinsvieira.trackr.infra.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ExceptionHandler {
    @org.springframework.web.bind.annotation.ExceptionHandler(BookAccessDeniedException.class)
    public ResponseEntity handleBookAccessDeniedExceptiona(BookAccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    @org.springframework.web.bind.annotation.ExceptionHandler(BookStatusNotChangeableException.class)
    public ResponseEntity handleBookStatusNotChangeable(BookStatusNotChangeableException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    @org.springframework.web.bind.annotation.ExceptionHandler(BookNotFoundException.class)
    public ResponseEntity handleBookNotFoundException(BookNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }
}
