package io.github.com.lucasmartinsvieira.trackr.services;

import io.github.com.lucasmartinsvieira.trackr.api.dtos.books.OpenLibrarySeachRequestDTO;
import io.github.com.lucasmartinsvieira.trackr.api.dtos.books.OpenLibrarySearchReponseDTO;
import io.github.com.lucasmartinsvieira.trackr.api.external.OpenLibraryClient;
import io.github.com.lucasmartinsvieira.trackr.domain.book.Book;
import io.github.com.lucasmartinsvieira.trackr.repositories.BookRepository;
import org.springframework.stereotype.Service;

import java.util.List;

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
}
