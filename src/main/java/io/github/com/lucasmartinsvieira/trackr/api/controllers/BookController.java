package io.github.com.lucasmartinsvieira.trackr.api.controllers;

import io.github.com.lucasmartinsvieira.trackr.api.dtos.books.*;
import io.github.com.lucasmartinsvieira.trackr.domain.user.User;
import io.github.com.lucasmartinsvieira.trackr.services.BookService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
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
    @SecurityRequirement(name = "bearer-key")
    public ResponseEntity<List<BookResponseDTO>> getAllBooks(@AuthenticationPrincipal User user) {
        var books = this.bookService.findAll(user);

        return ResponseEntity.ok(books);
    }

    @DeleteMapping("{id}")
    @SecurityRequirement(name = "bearer-key")
    public ResponseEntity deleteBook(@PathVariable UUID id, @AuthenticationPrincipal User user) {
        this.bookService.deleteBook(id, user);

        return ResponseEntity.ok().build();
    }

    @GetMapping("{id}")
    @SecurityRequirement(name = "bearer-key")
    public ResponseEntity<BookResponseDTO> findBookById(@PathVariable UUID id, @AuthenticationPrincipal User user) {
        var book = this.bookService.findBookById(id, user);

        return ResponseEntity.ok(book);
    }

    @SecurityRequirement(name = "bearer-key")
    @PatchMapping("/changeStatus/{id}")
    public ResponseEntity changeBookStatus(@PathVariable UUID id, @AuthenticationPrincipal User user) {
        var book = this.bookService.changeBookStatus(id, user);

        return ResponseEntity.ok(book);
    }

    @GetMapping("/search")
    @SecurityRequirement(name = "bearer-key")
    public ResponseEntity<OpenLibrarySearchReponseDTO> searchForBook(@RequestBody @Valid OpenLibrarySeachRequestDTO dto) {
        var books = this.bookService.searchBook(dto);

        return ResponseEntity.ok(books);
    }

    @GetMapping("/search/{id}/editions")
    @SecurityRequirement(name = "bearer-key")
    public ResponseEntity<OpenLibrarySearchEditionsResponseDTO> searchEditions(@PathVariable String id) {
        var response = this.bookService.searchEditions(id);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/search/{id}/edition")
    @SecurityRequirement(name = "bearer-key")
    public ResponseEntity<OpenLibraryBookEntry> searchForOpenLibraryEditionEntry(@PathVariable String id) {
        var response = this.bookService.searchForOpenLibraryEditionEntry(id);

        return ResponseEntity.ok(response);
    }

    @PostMapping
    @SecurityRequirement(name = "bearer-key")
    public ResponseEntity<BookResponseDTO> createBook(@RequestBody @Valid CreateBookRequestDTO dto, @AuthenticationPrincipal User user) {
        var book = this.bookService.createBook(dto, user);

        return ResponseEntity.ok(book);
    }

    @PutMapping("/{id}")
    @SecurityRequirement(name = "bearer-key")
    public ResponseEntity<BookResponseDTO> createBook(@PathVariable UUID id, @RequestBody @Valid UpdateBookRequestDTO dto, @AuthenticationPrincipal User user) {
        var book = this.bookService.updateBook(id, dto, user);

        return ResponseEntity.ok(book);
    }
}
