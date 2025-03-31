package io.github.com.lucasmartinsvieira.trackr.api.dtos.books;

import io.github.com.lucasmartinsvieira.trackr.domain.book.BookStatus;
import io.github.com.lucasmartinsvieira.trackr.domain.book.BookType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record BookResponseDTO(
        UUID id,
        List<String> authors,
        String coverUrl,
        LocalDate dateFinished,
        LocalDate dateStated,
        String isbn10,
        String isbn13,
        boolean loved,
        String openLibraryId,
        LocalDate publishDate,
        List<String> publishers,
        BookStatus status,
        String subtitle,
        String title,
        BookType type,
        BigDecimal userRating) {
}
