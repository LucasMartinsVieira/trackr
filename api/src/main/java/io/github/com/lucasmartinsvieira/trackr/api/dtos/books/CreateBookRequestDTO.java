package io.github.com.lucasmartinsvieira.trackr.api.dtos.books;

import io.github.com.lucasmartinsvieira.trackr.domain.book.BookStatus;
import io.github.com.lucasmartinsvieira.trackr.domain.book.BookType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.List;

public record CreateBookRequestDTO(
        @NotBlank
        @Size(min = 1, max = 20)
        String openLibraryId,
        @NotBlank
        String title,
        @Size(min = 1, max = 255)
        String subtitle,
        List<String> authors,
        LocalDate publishDate,
        String coverUrl,
        // @Size(min = 1, max = 20)
        String isbn10,
        // @Size(min = 1, max = 20)
        String isbn13,
        int numberOfPages,
        List<String> publishers,
        BookType type,
        BookStatus status,
        String notes) {
}
