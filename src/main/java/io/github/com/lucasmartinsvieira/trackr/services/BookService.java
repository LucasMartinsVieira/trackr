package io.github.com.lucasmartinsvieira.trackr.services;

import io.github.com.lucasmartinsvieira.trackr.api.dtos.books.OpenLibrarySeachRequestDTO;
import io.github.com.lucasmartinsvieira.trackr.api.dtos.books.OpenLibrarySearchReponseDTO;
import io.github.com.lucasmartinsvieira.trackr.api.external.OpenLibraryClient;
import io.github.com.lucasmartinsvieira.trackr.domain.book.Book;
import io.github.com.lucasmartinsvieira.trackr.domain.user.User;
import io.github.com.lucasmartinsvieira.trackr.domain.user.UserRole;
import io.github.com.lucasmartinsvieira.trackr.infra.exception.BookAccessDeniedException;
import io.github.com.lucasmartinsvieira.trackr.repositories.BookRepository;
import org.springframework.stereotype.Service;

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

    public void deleteBook(UUID id, User user) {
        var book = this.bookRepository.getReferenceById(id);

        if (!book.getUser().equals(user) && user.getRole() != UserRole.ADMIN) {
            throw new BookAccessDeniedException("This book register does not belong to you");
        }

        this.bookRepository.deleteById(id);
    }
}
