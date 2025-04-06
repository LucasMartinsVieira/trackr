package io.github.com.lucasmartinsvieira.trackr.api.dtos.books;

import io.github.com.lucasmartinsvieira.trackr.domain.book.BookStatus;
import io.github.com.lucasmartinsvieira.trackr.domain.book.BookType;

import java.time.LocalDate;
import java.util.List;

public record UpdateBookRequestDTO(
        String title,
        String subtitle,
        List<String> authors,
        LocalDate publishDate,
        String coverUrl,
        String isbn10,
        String isbn13,
        Integer numberOfPages,
        List<String> publishers,
        BookType type,
        BookStatus status,
        String notes,
        Boolean loved,
        LocalDate dateStarted,
        LocalDate dateFinished) {
}
