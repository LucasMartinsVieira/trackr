package io.github.com.lucasmartinsvieira.trackr.api.controllers;

import io.github.com.lucasmartinsvieira.trackr.api.dtos.books.OpenLibrarySeachRequestDTO;
import io.github.com.lucasmartinsvieira.trackr.api.dtos.books.OpenLibrarySearchReponseDTO;
import io.github.com.lucasmartinsvieira.trackr.domain.book.Book;
import io.github.com.lucasmartinsvieira.trackr.domain.user.User;
import io.github.com.lucasmartinsvieira.trackr.services.BookService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("books")
public class BookController {
    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping()
    public ResponseEntity<List<Book>> getAllBooks() {
        List<Book> books = this.bookService.findAll();
        System.out.println(books);

        return ResponseEntity.ok(books);
    }

    @GetMapping("/search")
    public ResponseEntity<OpenLibrarySearchReponseDTO> searchForBook(@RequestBody @Valid OpenLibrarySeachRequestDTO dto) {
        var books = this.bookService.searchBook(dto);

        return ResponseEntity.ok(books);
    }

    @DeleteMapping("{id}")
    public ResponseEntity deleteBook(@PathVariable UUID id, @AuthenticationPrincipal User user) {
        this.bookService.deleteBook(id, user);

        return ResponseEntity.ok().build();
    }

    @PatchMapping("/changeStatus/{id}")
    public ResponseEntity changeBookStatus(@PathVariable UUID id, @AuthenticationPrincipal User user) {
        var book = this.bookService.changeBookStatus(id, user);

        return ResponseEntity.ok(book);
    }
}
