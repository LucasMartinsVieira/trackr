package io.github.com.lucasmartinsvieira.trackr.services;

import io.github.com.lucasmartinsvieira.trackr.api.dtos.books.*;
import io.github.com.lucasmartinsvieira.trackr.api.external.OpenLibraryClient;
import io.github.com.lucasmartinsvieira.trackr.api.mappers.CreateBookMapper;
import io.github.com.lucasmartinsvieira.trackr.domain.book.BookStatus;
import io.github.com.lucasmartinsvieira.trackr.domain.user.User;
import io.github.com.lucasmartinsvieira.trackr.domain.user.UserRole;
import io.github.com.lucasmartinsvieira.trackr.infra.exception.BookAccessDeniedException;
import io.github.com.lucasmartinsvieira.trackr.infra.exception.BookNotFoundException;
import io.github.com.lucasmartinsvieira.trackr.infra.exception.BookStatusNotChangeableException;
import io.github.com.lucasmartinsvieira.trackr.repositories.BookRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class BookService {
    private final BookRepository bookRepository;
    private final OpenLibraryClient openLibraryClient;

    public BookService(BookRepository bookRepository, OpenLibraryClient openLibraryClient) {
        this.bookRepository = bookRepository;
        this.openLibraryClient = openLibraryClient;
    }

    public List<BookResponseDTO> findAll(User user) {
        return this.bookRepository.findAllByUser(user)
                .stream()
                .map(book -> new BookResponseDTO(
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
                        book.getNotes()
                ))
                .toList();
    }

    public BookResponseDTO findBookById(UUID id, User user) {
        var book = this.bookRepository.findById(id).orElseThrow(() -> new BookNotFoundException(String.format("Book with ID %s not found!", id)));

        if (!book.getUser().equals(user) && user.getRole() != UserRole.ADMIN) {
            throw new BookAccessDeniedException("This book register does not belong to you");
        }

        return new BookResponseDTO(
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
                book.getNotes()
        );
    }

    @Transactional
    public void deleteBook(UUID id, User user) {
        var book = this.bookRepository.getReferenceById(id);

        if (!book.getUser().equals(user) && user.getRole() != UserRole.ADMIN) {
            throw new BookAccessDeniedException("This book register does not belong to you");
        }

        this.bookRepository.deleteById(id);
    }

    @Transactional
    public BookResponseDTO changeBookStatus(UUID id, User user) {
        var book = this.bookRepository.findById(id).orElseThrow(() -> new BookNotFoundException(String.format("Book with ID %s not found", id)));

        // TODO: Add filter instead of this?
        if (!book.getUser().equals(user) && user.getRole() != UserRole.ADMIN) {
            throw new BookAccessDeniedException("This book register does not belong to you");
        }

        if (book.getStatus().equals(BookStatus.TO_READ)) {
            book.setStatus(BookStatus.READING);
            book.setDateStarted(LocalDate.now());
            bookRepository.save(book);
            return new BookResponseDTO(
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
                    book.getNotes()
            );
        }
        if (book.getStatus().equals(BookStatus.READING)) {
            book.setStatus(BookStatus.COMPLETE);
            book.setDateFinished(LocalDate.now());
            bookRepository.save(book);
            return new BookResponseDTO(
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
                    book.getNotes()
            );
        }

        throw new BookStatusNotChangeableException("Book status can only be TO_READ or READING");
    }

    @Transactional
    public BookResponseDTO createBook(CreateBookRequestDTO dto, User user) {
        var book = CreateBookMapper.map(dto, user);

        bookRepository.save(book);

        return new BookResponseDTO(
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
                book.getNotes()
        );
    }

    public OpenLibrarySearchReponseDTO searchBook(OpenLibrarySeachRequestDTO dto) {
        return this.openLibraryClient.searchBook(dto);
    }

    public OpenLibrarySearchEditionsResponseDTO searchEditions(String id) {
        return this.openLibraryClient.searchEditions(id);
    }

    public OpenLibraryBookEntry searchForOpenLibraryEditionEntry(String id) {

        return this.openLibraryClient.searchForEdition(id);
    }

}
