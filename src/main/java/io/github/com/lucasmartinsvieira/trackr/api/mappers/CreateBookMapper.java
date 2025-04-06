package io.github.com.lucasmartinsvieira.trackr.api.mappers;

import io.github.com.lucasmartinsvieira.trackr.api.dtos.books.CreateBookRequestDTO;
import io.github.com.lucasmartinsvieira.trackr.domain.book.Book;
import io.github.com.lucasmartinsvieira.trackr.domain.book.BookStatus;
import io.github.com.lucasmartinsvieira.trackr.domain.book.BookType;
import io.github.com.lucasmartinsvieira.trackr.domain.user.User;

public class CreateBookMapper {
    public static Book map(CreateBookRequestDTO dto, User user) {
        return Book.builder()
                .openLibraryId(dto.openLibraryId())
                .title(dto.title())
                .subtitle(dto.subtitle())
                .authors(dto.authors())
                .publishDate(dto.publishDate())
                .coverUrl(dto.coverUrl())
                .isbn10(dto.isbn10())
                .isbn13(dto.isbn13())
                .publishers(dto.publishers())
                .type(dto.type() != null ? dto.type() : BookType.PAPERBACK)
                .status(dto.status() != null ? dto.status() : BookStatus.TO_READ)
                .user(user)
                .loved(false)
                .userRating(null)
                .notes(dto.notes())
                .dateStarted(null)
                .dateFinished(null)
                .build();
    }
}
