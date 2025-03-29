package io.github.com.lucasmartinsvieira.trackr.api.controllers;

import io.github.com.lucasmartinsvieira.trackr.api.clients.OpenLibraryClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("books")
public class BookController {
    private final OpenLibraryClient openLibraryClient;

    public BookController(OpenLibraryClient openLibraryClient) {
        this.openLibraryClient = openLibraryClient;
    }

    @GetMapping
    public ResponseEntity<String> getBook() {
        String res1 = this.openLibraryClient.searchEditions("OL22056168W");

        return ResponseEntity.ok(res1);
    }
}
