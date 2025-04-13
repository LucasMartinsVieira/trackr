package io.github.com.lucasmartinsvieira.trackr.api.dtos.books;

import io.github.com.lucasmartinsvieira.trackr.domain.book.Book;
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
        BigDecimal userRating,
        String notes,
        int numberOfPages
) {
    public BookResponseDTO(Book book) {
        this(
                book.getId(),
                book.getAuthors(),
                book.getCoverUrl(),
                book.getDateFinished(),
                book.getDateStarted(),
                book.getIsbn10(),
                book.getIsbn13(),
                book.isLoved(),
                book.getOpenLibraryId(),
                book.getPublishDate(),
                book.getPublishers(),
                book.getStatus(),
                book.getSubtitle(),
                book.getTitle(),
                book.getType(),
                book.getUserRating(),
                book.getNotes(),
                book.getNumberOfPages()
        );
    }
}

