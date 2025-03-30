package io.github.com.lucasmartinsvieira.trackr.services;

import io.github.com.lucasmartinsvieira.trackr.api.dtos.books.OpenLibrarySeachRequestDTO;
import io.github.com.lucasmartinsvieira.trackr.api.dtos.books.OpenLibrarySearchReponseDTO;
import io.github.com.lucasmartinsvieira.trackr.api.external.OpenLibraryClient;
import io.github.com.lucasmartinsvieira.trackr.domain.book.Book;
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

    public OpenLibrarySearchReponseDTO searchBook(OpenLibrarySeachRequestDTO dto) {
        return this.openLibraryClient.searchBook(dto);
    }

    public List<Book> findAll() {
        return this.bookRepository.findAll();
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
    public Book changeBookStatus(UUID id, User user) {
        var book = this.bookRepository.findById(id).orElseThrow(() -> new BookNotFoundException(String.format("Book with ID %s not found", id)));

        if (!book.getUser().equals(user) && user.getRole() != UserRole.ADMIN) {
            throw new BookAccessDeniedException("This book register does not belong to you");
        }

        if (book.getStatus().equals(BookStatus.TO_READ)) {
            book.setStatus(BookStatus.READING);
            book.setDateStarted(LocalDate.now());
            return bookRepository.save(book);
        }
        if (book.getStatus().equals(BookStatus.READING)) {
            book.setStatus(BookStatus.COMPLETE);
            book.setDateFinished(LocalDate.now());
            return bookRepository.save(book);
        }

        throw new BookStatusNotChangeableException("Book status can only be TO_READ or READING");
    }
}
