package io.github.com.lucasmartinsvieira.trackr.api.dtos.books;

import java.util.List;

public record OpenLibrarySearchEditionsResponseDTO(
        List<OpenLibraryBookEntry> entries,
        OpenLibraryLinks links,
        int size) {
}
